package com.gabriel.Clinicflow.dto;

public record MedicoResponseDTO(
        Long id,
        String nome,
        String crm,
        String especialidade,
        String telefone,
        String email
) {
}