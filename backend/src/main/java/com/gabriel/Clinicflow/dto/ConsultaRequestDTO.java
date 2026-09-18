package com.gabriel.Clinicflow.dto;

import com.gabriel.Clinicflow.entity.StatusConsulta;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ConsultaRequestDTO(

        @NotNull(message = "A data e hora são obrigatórias")
        LocalDateTime dataHora,

        @NotNull(message = "O status é obrigatório")
        StatusConsulta status,

        String observacoes,

        @NotNull(message = "O médico é obrigatório")
        Long medicoId,

        @NotNull(message = "O paciente é obrigatório")
        Long pacienteId

) {}