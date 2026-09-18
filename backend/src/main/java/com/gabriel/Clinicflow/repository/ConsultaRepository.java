package com.gabriel.Clinicflow.repository;

import com.gabriel.Clinicflow.entity.Consulta;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ConsultaRepository extends JpaRepository<Consulta, Long> {

    List<Consulta> findByPacienteIdOrderByDataHoraAsc(Long pacienteId);

    boolean existsByMedicoId(Long medicoId);

    boolean existsByPacienteId(Long pacienteId);
}