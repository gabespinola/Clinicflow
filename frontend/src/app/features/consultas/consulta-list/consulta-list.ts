import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';

import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';

import { ConsultaService } from '../../../core/services/consulta.service';
import { ConsultaResponse } from '../../../core/models/consulta.model';

import {
  ConfirmDialog,
  ConfirmDialogData
} from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-consulta-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatChipsModule,
    MatPaginatorModule
  ],
  templateUrl: './consulta-list.html',
  styleUrl: './consulta-list.css'
})
export class ConsultaList implements OnInit {

  private consultaService = inject(ConsultaService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  consultas = signal<ConsultaResponse[]>([]);

  termoBusca = signal('');
  statusSelecionado = signal('TODOS');

  paginaAtual = signal(0);
  tamanhoPagina = signal(5);

  carregando = signal(true);
  erro = signal(false);

  consultasFiltradas = computed(() => {

    const termo = this.termoBusca()
      .trim()
      .toLowerCase();

    const status = this.statusSelecionado();

    return this.consultas().filter((consulta) => {

      const paciente =
        consulta.pacienteNome.toLowerCase();

      const medico =
        consulta.medicoNome.toLowerCase();

      const correspondeBusca =
        !termo ||
        paciente.includes(termo) ||
        medico.includes(termo);

      const correspondeStatus =
        status === 'TODOS' ||
        consulta.status === status;

      return correspondeBusca && correspondeStatus;
    });
  });

  consultasPaginadas = computed(() => {

    const consultas =
      this.consultasFiltradas();

    const inicio =
      this.paginaAtual() * this.tamanhoPagina();

    const fim =
      inicio + this.tamanhoPagina();

    return consultas.slice(inicio, fim);
  });

  colunas: string[] = [
    'dataHora',
    'paciente',
    'medico',
    'status',
    'acoes'
  ];

  ngOnInit(): void {
    this.carregarConsultas();
  }

  carregarConsultas(): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.consultaService.listarTodos().subscribe({
      next: (dados) => {

        const agora = new Date().getTime();

        const ordenadas = [...dados].sort((a, b) => {

          const dataA =
            new Date(a.dataHora).getTime();

          const dataB =
            new Date(b.dataHora).getTime();

          const aFutura =
            a.status === 'AGENDADA' &&
            dataA >= agora;

          const bFutura =
            b.status === 'AGENDADA' &&
            dataB >= agora;

          if (aFutura && !bFutura) {
            return -1;
          }

          if (!aFutura && bFutura) {
            return 1;
          }

          if (aFutura && bFutura) {
            return dataA - dataB;
          }

          return dataB - dataA;
        });

        this.consultas.set(ordenadas);
        this.carregando.set(false);
      },

      error: () => {
        this.erro.set(true);
        this.carregando.set(false);

        this.snackBar.open(
          'Não foi possível carregar as consultas.',
          'Fechar',
          { duration: 5000 }
        );
      }
    });
  }

  atualizarBusca(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    this.termoBusca.set(input.value);

    this.paginaAtual.set(0);
  }

  alterarStatus(status: string): void {

    this.statusSelecionado.set(status);

    this.paginaAtual.set(0);
  }

  limparBusca(): void {

    this.termoBusca.set('');

    this.paginaAtual.set(0);
  }

  limparFiltros(): void {

    this.termoBusca.set('');
    this.statusSelecionado.set('TODOS');

    this.paginaAtual.set(0);
  }

  mudarPagina(event: PageEvent): void {

    this.paginaAtual.set(event.pageIndex);
    this.tamanhoPagina.set(event.pageSize);
  }

  excluir(consulta: ConsultaResponse): void {

    const dados: ConfirmDialogData = {
      titulo: 'Excluir consulta?',
      mensagem: `Tem certeza de que deseja excluir a consulta de "${consulta.pacienteNome}"?`,
      textoConfirmar: 'Excluir'
    };

    const dialogRef = this.dialog.open(
      ConfirmDialog,
      {
        width: '440px',
        data: dados
      }
    );

    dialogRef.afterClosed().subscribe(
      (confirmado) => {

        if (!confirmado) {
          return;
        }

        this.consultaService
          .excluir(consulta.id)
          .subscribe({

            next: () => {

              this.snackBar.open(
                'Consulta excluída com sucesso.',
                'Fechar',
                { duration: 3000 }
              );

              this.carregarConsultas();
            },

            error: (erro) => {

              const mensagem =
                erro.error?.mensagem ??
                'Erro ao excluir consulta.';

              this.snackBar.open(
                mensagem,
                'Fechar',
                { duration: 5000 }
              );
            }
          });
      }
    );
  }

  formatarStatus(status: string): string {

    const labels: Record<string, string> = {
      AGENDADA: 'Agendada',
      REALIZADA: 'Realizada',
      CANCELADA: 'Cancelada'
    };

    return labels[status] ?? status;
  }
}