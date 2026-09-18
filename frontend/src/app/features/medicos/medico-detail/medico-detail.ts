import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MedicoService } from '../../../core/services/medico.service';
import { MedicoResponse } from '../../../core/models/medico.model';

@Component({
  selector: 'app-medico-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './medico-detail.html',
  styleUrl: './medico-detail.css'
})
export class MedicoDetail implements OnInit {

  private medicoService = inject(MedicoService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  medico = signal<MedicoResponse | null>(null);
  carregando = signal(true);

  medicoId!: number;

  ngOnInit(): void {
    this.medicoId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.carregarMedico();
  }

  carregarMedico(): void {
    this.carregando.set(true);

    this.medicoService.buscarPorId(this.medicoId).subscribe({
      next: (medico) => {
        this.medico.set(medico);
        this.carregando.set(false);
      },
      error: () => {
        this.carregando.set(false);

        this.snackBar.open(
          'Erro ao carregar médico.',
          'Fechar',
          { duration: 4000 }
        );
      }
    });
  }
}