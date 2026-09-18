package com.gabriel.Clinicflow.dto;

import com.gabriel.Clinicflow.entity.StatusConsulta;

import java.time.LocalDateTime;

public record ConsultaResponseDTO(
        Long id,
        LocalDateTime dataHora,
        StatusConsulta status,
        String observacoes,
        Long medicoId,
        String medicoNome,
        Long pacienteId,
        String pacienteNome
) {
}