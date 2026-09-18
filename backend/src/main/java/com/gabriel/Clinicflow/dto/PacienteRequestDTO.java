package com.gabriel.Clinicflow.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Past;

import java.time.LocalDate;

public record PacienteRequestDTO(

        @NotBlank(message = "O nome é obrigatório")
        String nome,

        @NotBlank(message = "O CPF é obrigatório")
        String cpf,

        @Past(message = "A data de nascimento deve ser no passado")
        LocalDate dataNascimento,

        String telefone,

        @Email(message = "E-mail inválido")
        String email,

        String endereco
) {
}