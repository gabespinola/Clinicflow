import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';

import { ConsultaService } from '../../../core/services/consulta.service';
import { ConsultaResponse } from '../../../core/models/consulta.model';

@Component({
  selector: 'app-consulta-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatChipsModule
  ],
  templateUrl: './consulta-detail.html',
  styleUrl: './consulta-detail.css'
})
export class ConsultaDetail implements OnInit {

  private consultaService = inject(ConsultaService);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  consulta = signal<ConsultaResponse | null>(null);
  carregando = signal(true);

  consultaId!: number;

  ngOnInit(): void {
    this.consultaId = Number(
      this.route.snapshot.paramMap.get('id')
    );

    this.carregarConsulta();
  }

  carregarConsulta(): void {
    this.carregando.set(true);

    this.consultaService.buscarPorId(this.consultaId).subscribe({
      next: (consulta) => {
        this.consulta.set(consulta);
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
}