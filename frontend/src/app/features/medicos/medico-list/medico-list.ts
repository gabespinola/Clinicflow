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

import { MedicoService } from '../../../core/services/medico.service';
import { MedicoResponse } from '../../../core/models/medico.model';

import {
  ConfirmDialog,
  ConfirmDialogData
} from '../../../shared/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-medico-list',
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
  templateUrl: './medico-list.html',
  styleUrl: './medico-list.css'
})
export class MedicoList implements OnInit {

  private medicoService = inject(MedicoService);
  private snackBar = inject(MatSnackBar);
  private dialog = inject(MatDialog);

  medicos = signal<MedicoResponse[]>([]);
  termoBusca = signal('');

  colunaOrdenacao = signal('');
  direcaoOrdenacao = signal<'asc' | 'desc' | ''>('');

  paginaAtual = signal(0);
  tamanhoPagina = signal(5);

  carregando = signal(true);
  erro = signal(false);

  medicosFiltrados = computed(() => {

    const termo = this.termoBusca()
      .trim()
      .toLowerCase();

    let resultado = this.medicos();

    // BUSCA
    if (termo) {

      resultado = resultado.filter((medico) => {

        const nome =
          medico.nome.toLowerCase();

        const crm =
          medico.crm.toLowerCase();

        const especialidade =
          medico.especialidade.toLowerCase();

        const encontrouNome =
          nome.includes(termo);

        const encontrouCrm =
          crm.includes(termo);

        const encontrouEspecialidade =
          especialidade.includes(termo);

        return (
          encontrouNome ||
          encontrouCrm ||
          encontrouEspecialidade
        );
      });
    }

    // ORDENAÇÃO
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

        case 'crm':
          valorA = a.crm;
          valorB = b.crm;
          break;

        case 'especialidade':
          valorA = a.especialidade;
          valorB = b.especialidade;
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

  medicosPaginados = computed(() => {

    const medicos =
      this.medicosFiltrados();

    const inicio =
      this.paginaAtual() * this.tamanhoPagina();

    const fim =
      inicio + this.tamanhoPagina();

    return medicos.slice(inicio, fim);
  });

  colunas: string[] = [
    'nome',
    'crm',
    'especialidade',
    'telefone',
    'email',
    'acoes'
  ];

  ngOnInit(): void {
    this.carregarMedicos();
  }

  carregarMedicos(): void {
    this.carregando.set(true);
    this.erro.set(false);

    this.medicoService.listarTodos().subscribe({
      next: (dados) => {
        this.medicos.set(dados);
        this.carregando.set(false);
      },

      error: () => {
        this.erro.set(true);
        this.carregando.set(false);

        this.snackBar.open(
          'Não foi possível carregar os médicos.',
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

  excluir(medico: MedicoResponse): void {

    const dados: ConfirmDialogData = {
      titulo: 'Excluir médico?',
      mensagem: `Tem certeza de que deseja excluir "${medico.nome}"?`,
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

      this.medicoService.excluir(medico.id).subscribe({
        next: () => {
          this.snackBar.open(
            'Médico excluído com sucesso.',
            'Fechar',
            { duration: 3000 }
          );

          this.carregarMedicos();
        },

        error: (erro) => {

          const mensagem =
            erro.error?.mensagem ??
            'Erro ao excluir médico.';

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