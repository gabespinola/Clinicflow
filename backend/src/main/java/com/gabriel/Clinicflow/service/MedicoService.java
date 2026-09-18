package com.gabriel.Clinicflow.service;

import com.gabriel.Clinicflow.dto.MedicoRequestDTO;
import com.gabriel.Clinicflow.dto.MedicoResponseDTO;
import com.gabriel.Clinicflow.entity.Medico;
import com.gabriel.Clinicflow.exception.DuplicateResourceException;
import com.gabriel.Clinicflow.exception.ResourceInUseException;
import com.gabriel.Clinicflow.exception.ResourceNotFoundException;
import com.gabriel.Clinicflow.repository.ConsultaRepository;
import com.gabriel.Clinicflow.repository.MedicoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MedicoService {

    private final MedicoRepository repository;
    private final ConsultaRepository consultaRepository;

    public MedicoService(
            MedicoRepository repository,
            ConsultaRepository consultaRepository) {

        this.repository = repository;
        this.consultaRepository = consultaRepository;
    }

    public List<MedicoResponseDTO> listarTodos() {
        return repository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public MedicoResponseDTO buscarPorId(Long id) {
        Medico medico = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Médico não encontrado com id: " + id
                        )
                );

        return toResponseDTO(medico);
    }

    public MedicoResponseDTO criar(MedicoRequestDTO request) {

        if (repository.existsByCrm(request.getCrm())) {
            throw new DuplicateResourceException(
                    "Já existe um médico cadastrado com este CRM."
            );
        }

        Medico medico = new Medico();

        medico.setNome(request.getNome());
        medico.setCrm(request.getCrm());
        medico.setEspecialidade(request.getEspecialidade());
        medico.setTelefone(request.getTelefone());
        medico.setEmail(request.getEmail());

        Medico medicoSalvo = repository.save(medico);

        return toResponseDTO(medicoSalvo);
    }

    public MedicoResponseDTO atualizar(
            Long id,
            MedicoRequestDTO request) {

        Medico medico = repository.findById(id)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Médico não encontrado com id: " + id
                        )
                );

        if (repository.existsByCrmAndIdNot(request.getCrm(), id)) {
            throw new DuplicateResourceException(
                    "Já existe outro médico cadastrado com este CRM."
            );
        }

        medico.setNome(request.getNome());
        medico.setCrm(request.getCrm());
        medico.setEspecialidade(request.getEspecialidade());
        medico.setTelefone(request.getTelefone());
        medico.setEmail(request.getEmail());

        Medico medicoAtualizado = repository.save(medico);

        return toResponseDTO(medicoAtualizado);
    }

    public void excluir(Long id) {

        if (!repository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Médico não encontrado com id: " + id
            );
        }

        if (consultaRepository.existsByMedicoId(id)) {
            throw new ResourceInUseException(
                    "Não é possível excluir este médico porque existem consultas vinculadas a ele."
            );
        }

        repository.deleteById(id);
    }

    private MedicoResponseDTO toResponseDTO(Medico medico) {

        return new MedicoResponseDTO(
                medico.getId(),
                medico.getNome(),
                medico.getCrm(),
                medico.getEspecialidade(),
                medico.getTelefone(),
                medico.getEmail()
        );
    }
}