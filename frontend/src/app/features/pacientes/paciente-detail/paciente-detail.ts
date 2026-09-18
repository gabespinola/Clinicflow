import {
  Component,
  OnInit,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PacienteService } from '../../../core/services/paciente.service';
import { ConsultaService } from '../../../core/services/consulta.service';

import { PacienteResponse } from '../../../core/models/paciente.model';
import { ConsultaResponse } from '../../../core/models/consulta.model';

@Component({
  selector: 'app-paciente-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './paciente-detail.html',
  styleUrl: './paciente-detail.css'
})
export class PacienteDetail implements OnInit {

  private pacienteService = inject(PacienteService);
  private consultaService = inject(ConsultaService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  paciente = signal<PacienteResponse | null>(null);
  consultas = signal<ConsultaResponse[]>([]);

  carregando = signal(true);

  gerandoResumo = signal(false);
  erroResumo = signal<string | null>(null);

  pacienteId!: number;

  ngOnInit(): void {
    this.pacienteId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);

    this.pacienteService
      .buscarPorId(this.pacienteId)
      .subscribe({
        next: (paciente) => {
          this.paciente.set(paciente);
        },

        error: () => {
          this.snackBar.open(
            'Erro ao carregar paciente.',
            'Fechar',
            { duration: 4000 }
          );
        }
      });

    this.consultaService
      .listarTodos()
      .subscribe({
        next: (todasConsultas) => {

          const consultasDoPaciente =
            todasConsultas
              .filter(
                consulta =>
                  consulta.pacienteId === this.pacienteId
              )
              .sort(
                (a, b) =>
                  new Date(b.dataHora).getTime() -
                  new Date(a.dataHora).getTime()
              );

          this.consultas.set(
            consultasDoPaciente
          );

          this.carregando.set(false);
        },

        error: () => {

          this.snackBar.open(
            'Erro ao carregar consultas.',
            'Fechar',
            { duration: 4000 }
          );

          this.carregando.set(false);
        }
      });
  }

  gerarResumo(): void {

    if (this.gerandoResumo()) {
      return;
    }

    this.gerandoResumo.set(true);
    this.erroResumo.set(null);

    this.pacienteService
      .gerarResumoIa(this.pacienteId)
      .subscribe({

        next: (resposta) => {

          const textoLimpo =
            this.limparMarkdown(
              resposta.resumo
            );

          this.paciente.update(
            paciente =>
              paciente
                ? {
                    ...paciente,
                    resumoIa: textoLimpo,
                    resumoIaGeradoEm: resposta.geradoEm
                  }
                : paciente
          );

          this.gerandoResumo.set(false);

          this.snackBar.open(
            'Resumo atualizado com sucesso.',
            'Fechar',
            { duration: 3000 }
          );
        },

        error: (err) => {

          const mensagem =
            err?.error?.mensagem ??
            'Não foi possível gerar o resumo. Tente novamente.';

          this.erroResumo.set(mensagem);
          this.gerandoResumo.set(false);

          this.snackBar.open(
            mensagem,
            'Fechar',
            { duration: 5000 }
          );
        }
      });
  }

  private limparMarkdown(texto: string): string {

    return texto
      .replace(/\*\*(.*?)\*\*/g, '$1')
      .replace(/\*(.*?)\*/g, '$1')
      .replace(/^#+\s*/gm, '')
      .replace(/^[-*]\s+/gm, '')
      .trim();
  }
}