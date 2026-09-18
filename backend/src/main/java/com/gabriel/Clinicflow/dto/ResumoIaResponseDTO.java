package com.gabriel.Clinicflow.dto;

import java.time.LocalDateTime;

public record ResumoIaResponseDTO(
        Long pacienteId,
        String pacienteNome,
        String resumo,
        LocalDateTime geradoEm
) {
}