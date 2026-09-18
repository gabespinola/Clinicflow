import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { MedicoService } from '../../../core/services/medico.service';

@Component({
  selector: 'app-medico-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './medico-form.html',
  styleUrl: './medico-form.css'
})
export class MedicoForm implements OnInit {

  private fb = inject(FormBuilder);
  private medicoService = inject(MedicoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  modoEdicao = signal(false);
  salvando = signal(false);
  carregando = signal(false);

  medicoId: number | null = null;

  form = this.fb.group({
    nome: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],

    crm: ['', [
      Validators.required,
      this.validarCrm
    ]],

    especialidade: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],

    telefone: ['', [
      this.validarTelefone
    ]],

    email: ['', [
      Validators.email
    ]]
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modoEdicao.set(true);
      this.medicoId = Number(idParam);
      this.carregarMedico(this.medicoId);
    }
  }

  carregarMedico(id: number): void {
    this.carregando.set(true);

    this.medicoService.buscarPorId(id).subscribe({
      next: (medico) => {
        this.form.patchValue({
          nome: medico.nome,
          crm: this.formatarCrm(medico.crm),
          especialidade: medico.especialidade,
          telefone: medico.telefone
            ? this.formatarTelefone(medico.telefone)
            : '',
          email: medico.email || ''
        });

        this.carregando.set(false);
      },

      error: () => {
        this.snackBar.open(
          'Erro ao carregar dados do médico.',
          'Fechar',
          { duration: 4000 }
        );

        this.carregando.set(false);
      }
    });
  }

  aoDigitarCrm(event: Event): void {
    const input = event.target as HTMLInputElement;

    const crmFormatado = this.formatarCrm(input.value);

    this.form.get('crm')?.setValue(crmFormatado, {
      emitEvent: false
    });
  }

  aoDigitarTelefone(event: Event): void {
    const input = event.target as HTMLInputElement;

    const telefoneFormatado = this.formatarTelefone(input.value);

    this.form.get('telefone')?.setValue(telefoneFormatado, {
      emitEvent: false
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

    const payload = {
      nome: valores.nome!.trim(),

      crm: valores.crm!
        .trim()
        .toUpperCase(),

      especialidade: valores.especialidade!.trim(),

      telefone: valores.telefone
        ? this.somenteNumeros(valores.telefone)
        : undefined,

      email: valores.email?.trim() || undefined
    };

    const request$ =
      this.modoEdicao() && this.medicoId
        ? this.medicoService.atualizar(this.medicoId, payload)
        : this.medicoService.criar(payload);

    request$.subscribe({
      next: (medico) => {
        this.snackBar.open(
          'Médico salvo com sucesso.',
          'Fechar',
          { duration: 3000 }
        );

        this.router.navigate(['/medicos', medico.id]);
      },

      error: (err) => {
        this.salvando.set(false);

        const mensagem =
          err?.error?.mensagem ||
          'Erro ao salvar médico. Verifique os dados.';

        this.snackBar.open(
          mensagem,
          'Fechar',
          { duration: 5000 }
        );
      }
    });
  }

  private formatarCrm(valor: string): string {
    let crm = valor
      .toUpperCase()
      .replace(/\s/g, '');

    crm = crm.replace(/[^0-9A-Z-]/g, '');

    return crm.slice(0, 12);
  }

  private validarCrm(control: AbstractControl): ValidationErrors | null {
    const crm = String(control.value ?? '')
      .trim()
      .toUpperCase();

    if (!crm) {
      return null;
    }

    const formatoValido = /^\d{4,7}-[A-Z]{2}$/.test(crm);

    return formatoValido
      ? null
      : { crmInvalido: true };
  }

  private formatarTelefone(valor: string): string {
    const numeros = this.somenteNumeros(valor).slice(0, 11);

    if (numeros.length <= 10) {
      return numeros
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }

    return numeros
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2');
  }

  private validarTelefone(control: AbstractControl): ValidationErrors | null {
    const telefone = String(control.value ?? '')
      .replace(/\D/g, '');

    if (!telefone) {
      return null;
    }

    if (telefone.length !== 10 && telefone.length !== 11) {
      return { telefoneInvalido: true };
    }

    return null;
  }

  private somenteNumeros(valor: string): string {
    return valor.replace(/\D/g, '');
  }
}