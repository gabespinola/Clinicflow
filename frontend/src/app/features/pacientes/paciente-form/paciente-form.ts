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
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PacienteService } from '../../../core/services/paciente.service';

@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatDatepickerModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './paciente-form.html',
  styleUrl: './paciente-form.css'
})
export class PacienteForm implements OnInit {

  private fb = inject(FormBuilder);
  private pacienteService = inject(PacienteService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  modoEdicao = signal(false);
  salvando = signal(false);
  carregando = signal(false);

  pacienteId: number | null = null;

  hoje = new Date();

  form = this.fb.group({
    nome: ['', [
      Validators.required,
      Validators.minLength(3)
    ]],

    cpf: ['', [
      Validators.required,
      this.validarCpf
    ]],

    dataNascimento: [null as Date | null, [
      Validators.required
    ]],

    telefone: ['', [
      this.validarTelefone
    ]],

    email: ['', [
      Validators.email
    ]],

    endereco: ['']
  });

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');

    if (idParam) {
      this.modoEdicao.set(true);
      this.pacienteId = Number(idParam);
      this.carregarPaciente(this.pacienteId);
    }
  }

  carregarPaciente(id: number): void {
    this.carregando.set(true);

    this.pacienteService.buscarPorId(id).subscribe({
      next: (paciente) => {
        this.form.patchValue({
          nome: paciente.nome,
          cpf: this.formatarCpf(paciente.cpf),
          dataNascimento: paciente.dataNascimento
            ? this.stringParaData(paciente.dataNascimento)
            : null,
          telefone: paciente.telefone
            ? this.formatarTelefone(paciente.telefone)
            : '',
          email: paciente.email,
          endereco: paciente.endereco
        });

        this.carregando.set(false);
      },

      error: () => {
        this.snackBar.open(
          'Erro ao carregar dados do paciente.',
          'Fechar',
          { duration: 4000 }
        );

        this.carregando.set(false);
      }
    });
  }

  aoDigitarCpf(event: Event): void {
    const input = event.target as HTMLInputElement;

    const cpfFormatado = this.formatarCpf(input.value);

    this.form.get('cpf')?.setValue(cpfFormatado, {
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

      cpf: this.somenteNumeros(valores.cpf!),

      dataNascimento: this.dataParaString(
        valores.dataNascimento!
      ),

      telefone: valores.telefone
        ? this.somenteNumeros(valores.telefone)
        : undefined,

      email: valores.email?.trim() || undefined,

      endereco: valores.endereco?.trim() || undefined
    };

    const request$ =
      this.modoEdicao() && this.pacienteId
        ? this.pacienteService.atualizar(this.pacienteId, payload)
        : this.pacienteService.criar(payload);

    request$.subscribe({
      next: (paciente) => {
        this.snackBar.open(
          'Paciente salvo com sucesso.',
          'Fechar',
          { duration: 3000 }
        );

        this.router.navigate(['/pacientes', paciente.id]);
      },

      error: (err) => {
        this.salvando.set(false);

        const mensagem =
          err?.error?.mensagem ||
          'Erro ao salvar paciente. Verifique os dados.';

        this.snackBar.open(
          mensagem,
          'Fechar',
          { duration: 5000 }
        );
      }
    });
  }

  private formatarCpf(valor: string): string {
    const numeros = this.somenteNumeros(valor).slice(0, 11);

    return numeros
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
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

  private somenteNumeros(valor: string): string {
    return valor.replace(/\D/g, '');
  }

  private validarCpf(control: AbstractControl): ValidationErrors | null {
    const cpf = String(control.value ?? '').replace(/\D/g, '');

    if (!cpf) {
      return null;
    }

    if (cpf.length !== 11) {
      return { cpfInvalido: true };
    }

    if (/^(\d)\1{10}$/.test(cpf)) {
      return { cpfInvalido: true };
    }

    let soma = 0;

    for (let i = 0; i < 9; i++) {
      soma += Number(cpf[i]) * (10 - i);
    }

    let primeiroDigito = (soma * 10) % 11;

    if (primeiroDigito === 10) {
      primeiroDigito = 0;
    }

    if (primeiroDigito !== Number(cpf[9])) {
      return { cpfInvalido: true };
    }

    soma = 0;

    for (let i = 0; i < 10; i++) {
      soma += Number(cpf[i]) * (11 - i);
    }

    let segundoDigito = (soma * 10) % 11;

    if (segundoDigito === 10) {
      segundoDigito = 0;
    }

    if (segundoDigito !== Number(cpf[10])) {
      return { cpfInvalido: true };
    }

    return null;
  }

  private validarTelefone(control: AbstractControl): ValidationErrors | null {
    const telefone = String(control.value ?? '').replace(/\D/g, '');

    if (!telefone) {
      return null;
    }

    if (telefone.length !== 10 && telefone.length !== 11) {
      return { telefoneInvalido: true };
    }

    return null;
  }

  private dataParaString(data: Date): string {
    const ano = data.getFullYear();
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const dia = String(data.getDate()).padStart(2, '0');

    return `${ano}-${mes}-${dia}`;
  }

  private stringParaData(texto: string): Date {
    const [ano, mes, dia] = texto.split('-').map(Number);

    return new Date(ano, mes - 1, dia);
  }
}