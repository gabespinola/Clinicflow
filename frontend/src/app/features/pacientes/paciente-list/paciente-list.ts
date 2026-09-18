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
import { MatDialog } from '@angular/material/dialog';

import {
  MatSortModule,
  Sort
} from '@angular/material/sort';

import {
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';

import { PacienteService } from '../../../core/services/paciente.service';
import { PacienteResponse } from '../../../core/models/paciente.model';

import {
  ConfirmDialog,
  ConfirmDialogData
} from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-paciente-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTooltipModule,
    MatSortModule,
    MatPaginatorModule
  ],
  templateUrl: './paciente-list.html',
  styleUrl: './paciente-list.css'
})
export class PacienteList implements OnInit {

  private pacienteService = inject(PacienteService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  pacientes = signal<PacienteResponse[]>([]);
  termoBusca = signal('');

  colunaOrdenacao = signal('');
  direcaoOrdenacao = signal<'asc' | 'desc' | ''>('');

  paginaAtual = signal(0);
  tamanhoPagina = signal(5);

  carregando = signal(true);
  erro = signal(false);

  pacientesFiltrados = computed(() => {

    const termo = this.termoBusca()
      .trim()
      .toLowerCase();

    const termoNumerico =
      termo.replace(/\D/g, '');

    let resultado = this.pacientes();

    if (termo) {
      resultado = resultado.filter((paciente) => {

        const nome =
          paciente.nome.toLowerCase();

        const cpf =
          paciente.cpf.replace(/\D/g, '');

        const encontrouNome =
          nome.includes(termo);

        const encontrouCpf =
          termoNumerico.length > 0 &&
          cpf.includes(termoNumerico);

        return encontrouNome || encontrouCpf;
      });
    }

    const coluna = this.colunaOrdenacao();
    const direcao = this.direcaoOrdenacao();

    if (!coluna || !direcao) {
      return resultado;
    }

    return [...resultado].sort((a, b) => {

      let valorA = '';
      let valorB = '';

      switch (coluna) {

        case 'nome':
          valorA = a.nome;
          valorB = b.nome;
          break;

        case 'cpf':
          valorA = a.cpf.replace(/\D/g, '');
          valorB = b.cpf.replace(/\D/g, '');
          break;

        case 'telefone':
          valorA = a.telefone ?? '';
          valorB = b.telefone ?? '';
          break;

        case 'email':
          valorA = a.email ?? '';
          valorB = b.email ?? '';
          break;
      }

      const comparacao = valorA.localeCompare(
        valorB,
        'pt-BR',
        {
          sensitivity: 'base',
          numeric: true
        }
      );

      return direcao === 'asc'
        ? comparacao
        : -comparacao;
    });
  });

  pacientesPaginados = computed(() => {

    const pacientes =
      this.pacientesFiltrados();

    const inicio =
      this.paginaAtual() * this.tamanhoPagina();

    const fim =
      inicio + this.tamanhoPagina();

    return pacientes.slice(inicio, fim);
  });

  colunas: string[] = [
    'nome',
    'cpf',
    'telefone',
    'email',
    'acoes'
  ];

  ngOnInit(): void {
    this.carregarPacientes();
  }

  carregarPacientes(): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.pacienteService.listarTodos().subscribe({
      next: (dados) => {
        this.pacientes.set(dados);
        this.carregando.set(false);
      },

      error: () => {
        this.erro.set(true);
        this.carregando.set(false);

        this.snackBar.open(
          'Não foi possível conectar ao servidor.',
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

  limparBusca(): void {
    this.termoBusca.set('');
    this.paginaAtual.set(0);
  }

  ordenar(sort: Sort): void {
    this.colunaOrdenacao.set(sort.active);
    this.direcaoOrdenacao.set(sort.direction);

    this.paginaAtual.set(0);
  }

  mudarPagina(event: PageEvent): void {
    this.paginaAtual.set(event.pageIndex);
    this.tamanhoPagina.set(event.pageSize);
  }

  excluir(paciente: PacienteResponse): void {

    const dados: ConfirmDialogData = {
      titulo: 'Excluir paciente?',
      mensagem: `Tem certeza de que deseja excluir "${paciente.nome}"?`,
      textoConfirmar: 'Excluir'
    };

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '440px',
      data: dados
    });

    dialogRef.afterClosed().subscribe((confirmado) => {

      if (!confirmado) {
        return;
      }

      this.pacienteService.excluir(paciente.id).subscribe({
        next: () => {
          this.snackBar.open(
            'Paciente excluído com sucesso.',
            'Fechar',
            { duration: 3000 }
          );

          this.carregarPacientes();
        },

        error: (erro) => {

          const mensagem =
            erro.error?.mensagem ??
            'Erro ao excluir paciente.';

          this.snackBar.open(
            mensagem,
            'Fechar',
            { duration: 5000 }
          );
        }
      });
    });
  }
}