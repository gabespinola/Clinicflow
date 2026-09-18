package com.gabriel.Clinicflow.service;

import com.gabriel.Clinicflow.dto.ConsultaRequestDTO;
import com.gabriel.Clinicflow.dto.ConsultaResponseDTO;
import com.gabriel.Clinicflow.entity.Consulta;
import com.gabriel.Clinicflow.entity.Medico;
import com.gabriel.Clinicflow.entity.Paciente;
import com.gabriel.Clinicflow.entity.StatusConsulta;
import com.gabriel.Clinicflow.exception.BusinessRuleException;
import com.gabriel.Clinicflow.exception.ResourceNotFoundException;
import com.gabriel.Clinicflow.repository.ConsultaRepository;
import com.gabriel.Clinicflow.repository.MedicoRepository;
import com.gabriel.Clinicflow.repository.PacienteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ConsultaService {

    private final ConsultaRepository consultaRepository;
    private final MedicoRepository medicoRepository;
    private final PacienteRepository pacienteRepository;

    public ConsultaService(
            ConsultaRepository consultaRepository,
            MedicoRepository medicoRepository,
            PacienteRepository pacienteRepository) {

        this.consultaRepository = consultaRepository;
        this.medicoRepository = medicoRepository;
        this.pacienteRepository = pacienteRepository;
    }

    public List<ConsultaResponseDTO> listarTodos() {

        return consultaRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public ConsultaResponseDTO buscarPorId(Long id) {

        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consulta não encontrada com id: " + id
                ));

        return toResponseDTO(consulta);
    }

    public ConsultaResponseDTO salvar(ConsultaRequestDTO dto) {

        validarDataAgendamento(dto);

        Medico medico = medicoRepository.findById(dto.medicoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Médico não encontrado com id: " + dto.medicoId()
                ));

        Paciente paciente = pacienteRepository.findById(dto.pacienteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Paciente não encontrado com id: " + dto.pacienteId()
                ));

        Consulta consulta = new Consulta();

        consulta.setDataHora(dto.dataHora());
        consulta.setStatus(dto.status());
        consulta.setObservacoes(dto.observacoes());
        consulta.setMedico(medico);
        consulta.setPaciente(paciente);

        Consulta consultaSalva = consultaRepository.save(consulta);

        return toResponseDTO(consultaSalva);
    }

    public ConsultaResponseDTO atualizar(
            Long id,
            ConsultaRequestDTO dto) {

        Consulta consulta = consultaRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Consulta não encontrada com id: " + id
                ));

        validarDataAgendamento(dto);

        Medico medico = medicoRepository.findById(dto.medicoId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Médico não encontrado com id: " + dto.medicoId()
                ));

        Paciente paciente = pacienteRepository.findById(dto.pacienteId())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Paciente não encontrado com id: " + dto.pacienteId()
                ));

        consulta.setDataHora(dto.dataHora());
        consulta.setStatus(dto.status());
        consulta.setObservacoes(dto.observacoes());
        consulta.setMedico(medico);
        consulta.setPaciente(paciente);

        Consulta consultaAtualizada =
                consultaRepository.save(consulta);

        return toResponseDTO(consultaAtualizada);
    }

    public void excluir(Long id) {

        if (!consultaRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Consulta não encontrada com id: " + id
            );
        }

        consultaRepository.deleteById(id);
    }

    private ConsultaResponseDTO toResponseDTO(
            Consulta consulta) {

        return new ConsultaResponseDTO(
                consulta.getId(),
                consulta.getDataHora(),
                consulta.getStatus(),
                consulta.getObservacoes(),
                consulta.getMedico().getId(),
                consulta.getMedico().getNome(),
                consulta.getPaciente().getId(),
                consulta.getPaciente().getNome()
        );
    }

    private void validarDataAgendamento(
            ConsultaRequestDTO dto) {

        if (dto.status() == StatusConsulta.AGENDADA
                && dto.dataHora().isBefore(LocalDateTime.now())) {

            throw new BusinessRuleException(
                    "Não é possível manter uma consulta agendada em uma data ou horário que já passou."
            );
        }
    }
}