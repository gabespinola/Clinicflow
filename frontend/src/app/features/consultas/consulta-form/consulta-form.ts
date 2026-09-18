import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConsultaService } from '../../../core/services/consulta.service';
import { MedicoService } from '../../../core/services/medico.service';
import { PacienteService } from '../../../core/services/paciente.service';

import { ConsultaRequest } from '../../../core/models/consulta.model';
import { MedicoResponse } from '../../../core/models/medico.model';
import { PacienteResponse } from '../../../core/models/paciente.model';

@Component({
  selector: 'app-consulta-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './consulta-form.html',
  styleUrl: './consulta-form.css'
})
export class ConsultaForm implements OnInit {

  private fb = inject(FormBuilder);

  private consultaService = inject(ConsultaService);
  private medicoService = inject(MedicoService);
  private pacienteService = inject(PacienteService);

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  modoEdicao = signal(false);
  carregando = signal(true);
  salvando = signal(false);

  medicos = signal<MedicoResponse[]>([]);
  pacientes = signal<PacienteResponse[]>([]);

  consultaId: number | null = null;

  statusDisponiveis = [
    { valor: 'AGENDADA', label: 'Agendada' },
    { valor: 'REALIZADA', label: 'Realizada' },
    { valor: 'CANCELADA', label: 'Cancelada' }
  ];

  form = this.fb.group({
    pacienteId: [
      null as number | null,
      Validators.required
    ],

    medicoId: [
      null as number | null,
      Validators.required
    ],

    dataHora: [
      '',
      Validators.required
    ],

    status: [
      'AGENDADA',
      Validators.required
    ],

    observacoes: [
      '',
      Validators.maxLength(1000)
    ]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modoEdicao.set(true);
      this.consultaId = Number(idParam);
    }

    this.carregarDados();
  }

  carregarDados(): void {
    this.carregando.set(true);

    this.medicoService.listarTodos().subscribe({
      next: (medicos) => {
        this.medicos.set(medicos);

        this.pacienteService.listarTodos().subscribe({
          next: (pacientes) => {
            this.pacientes.set(pacientes);

            if (this.modoEdicao() && this.consultaId) {
              this.carregarConsulta(this.consultaId);
            } else {
              this.carregando.set(false);
            }
          },

          error: () => {
            this.carregando.set(false);

            this.snackBar.open(
              'Erro ao carregar pacientes.',
              'Fechar',
              { duration: 4000 }
            );
          }
        });
      },

      error: () => {
        this.carregando.set(false);

        this.snackBar.open(
          'Erro ao carregar médicos.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }

  carregarConsulta(id: number): void {
    this.consultaService.buscarPorId(id).subscribe({
      next: (consulta) => {
        this.form.patchValue({
          pacienteId: consulta.pacienteId,
          medicoId: consulta.medicoId,
          dataHora: this.formatarDataHoraParaInput(
            consulta.dataHora
          ),
          status: consulta.status,
          observacoes: consulta.observacoes || ''
        });

        this.carregando.set(false);
      },

      error: () => {
        this.carregando.set(false);

        this.snackBar.open(
          'Erro ao carregar consulta.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      this.snackBar.open(
        'Verifique os campos destacados antes de continuar.',
        'Fechar',
        { duration: 4000 }
      );

      return;
    }

    this.salvando.set(true);

    const valores = this.form.value;

    const payload: ConsultaRequest = {
      pacienteId: valores.pacienteId!,
      medicoId: valores.medicoId!,
      dataHora: valores.dataHora!,
      status: valores.status!,
      observacoes: valores.observacoes?.trim() || undefined
    };

    const request$ =
      this.modoEdicao() && this.consultaId
        ? this.consultaService.atualizar(
            this.consultaId,
            payload
          )
        : this.consultaService.criar(payload);

    request$.subscribe({
      next: (consulta) => {
        this.snackBar.open(
          'Consulta salva com sucesso.',
          'Fechar',
          { duration: 3000 }
        );

        this.router.navigate([
          '/consultas',
          consulta.id
        ]);
      },

      error: (err) => {
        this.salvando.set(false);

        const mensagem =
          err?.error?.mensagem ||
          'Erro ao salvar consulta. Verifique os dados.';

        this.snackBar.open(
          mensagem,
          'Fechar',
          { duration: 5000 }
        );
      }
    });
  }

  private formatarDataHoraParaInput(
    dataHora: string
  ): string {

    if (!dataHora) {
      return '';
    }

    return dataHora.substring(0, 16);
  }
}