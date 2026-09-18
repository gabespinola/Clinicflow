import {
  Component,
  OnInit,
  computed,
  inject,
  signal
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { forkJoin } from 'rxjs';

import { PacienteService } from '../../core/services/paciente.service';
import { MedicoService } from '../../core/services/medico.service';
import { ConsultaService } from '../../core/services/consulta.service';

import { ConsultaResponse } from '../../core/models/consulta.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  private pacienteService = inject(PacienteService);
  private medicoService = inject(MedicoService);
  private consultaService = inject(ConsultaService);

  totalPacientes = signal(0);
  totalMedicos = signal(0);

  consultas = signal<ConsultaResponse[]>([]);

  carregando = signal(true);
  erro = signal(false);

  consultasAgendadas = computed(() =>
    this.consultas().filter(
      consulta => consulta.status === 'AGENDADA'
    ).length
  );

  consultasRealizadas = computed(() =>
    this.consultas().filter(
      consulta => consulta.status === 'REALIZADA'
    ).length
  );

  proximasConsultas = computed(() => {

    const agora = new Date().getTime();

    return this.consultas()
      .filter((consulta) => {

        const dataConsulta =
          new Date(consulta.dataHora).getTime();

        return (
          consulta.status === 'AGENDADA' &&
          dataConsulta >= agora
        );
      })
      .sort((a, b) =>
        new Date(a.dataHora).getTime() -
        new Date(b.dataHora).getTime()
      )
      .slice(0, 5);
  });

  ngOnInit(): void {
    this.carregarDashboard();
  }

  carregarDashboard(): void {

    this.carregando.set(true);
    this.erro.set(false);

    forkJoin({
      pacientes: this.pacienteService.listarTodos(),
      medicos: this.medicoService.listarTodos(),
      consultas: this.consultaService.listarTodos()
    }).subscribe({

      next: (dados) => {

        this.totalPacientes.set(
          dados.pacientes.length
        );

        this.totalMedicos.set(
          dados.medicos.length
        );

        this.consultas.set(
          dados.consultas
        );

        this.carregando.set(false);
      },

      error: () => {

        this.erro.set(true);
        this.carregando.set(false);
      }
    });
  }
}