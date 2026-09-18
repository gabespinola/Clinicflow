package com.gabriel.Clinicflow.repository;

import com.gabriel.Clinicflow.entity.Medico;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MedicoRepository extends JpaRepository<Medico, Long> {

    boolean existsByCrm(String crm);

    boolean existsByCrmAndIdNot(String crm, Long id);
}