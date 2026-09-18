package com.gabriel.Clinicflow.service;

import com.gabriel.Clinicflow.dto.PacienteRequestDTO;
import com.gabriel.Clinicflow.dto.PacienteResponseDTO;
import com.gabriel.Clinicflow.dto.ResumoIaResponseDTO;
import com.gabriel.Clinicflow.entity.Consulta;
import com.gabriel.Clinicflow.entity.Paciente;
import com.gabriel.Clinicflow.exception.ResourceNotFoundException;
import com.gabriel.Clinicflow.gemini.GeminiService;
import com.gabriel.Clinicflow.repository.ConsultaRepository;
import com.gabriel.Clinicflow.repository.PacienteRepository;
import org.springframework.stereotype.Service;
import com.gabriel.Clinicflow.exception.DuplicateResourceException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import com.gabriel.Clinicflow.exception.ResourceInUseException;

@Service
public class PacienteService {

    private static final DateTimeFormatter FORMATO_DATA = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");

    private final PacienteRepository pacienteRepository;
    private final ConsultaRepository consultaRepository;
    private final GeminiService geminiService;

    public PacienteService(
            PacienteRepository pacienteRepository,
            ConsultaRepository consultaRepository,
            GeminiService geminiService) {

        this.pacienteRepository = pacienteRepository;
        this.consultaRepository = consultaRepository;
        this.geminiService = geminiService;
    }

    public List<PacienteResponseDTO> listarTodos() {

        return pacienteRepository.findAll()
                .stream()
                .map(this::toResponseDTO)
                .toList();
    }

    public PacienteResponseDTO buscarPorId(Long id) {

        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com id: " + id));

        return toResponseDTO(paciente);
    }

    public PacienteResponseDTO salvar(PacienteRequestDTO dto) {

        if (pacienteRepository.existsByCpf(dto.cpf())) {
            throw new DuplicateResourceException(
                    "Já existe um paciente cadastrado com este CPF."
            );
        }



        Paciente paciente = new Paciente();

        paciente.setNome(dto.nome());
        paciente.setCpf(dto.cpf());
        paciente.setDataNascimento(dto.dataNascimento());
        paciente.setTelefone(dto.telefone());
        paciente.setEmail(dto.email());
        paciente.setEndereco(dto.endereco());

        Paciente pacienteSalvo = pacienteRepository.save(paciente);

        return toResponseDTO(pacienteSalvo);
    }

    public PacienteResponseDTO atualizar(Long id, PacienteRequestDTO dto) {

        Paciente paciente = pacienteRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com id: " + id));


        if (pacienteRepository.existsByCpfAndIdNot(dto.cpf(), id)) {
            throw new DuplicateResourceException(
                    "Já existe outro paciente cadastrado com este CPF."
            );
        }

        paciente.setNome(dto.nome());
        paciente.setCpf(dto.cpf());
        paciente.setDataNascimento(dto.dataNascimento());
        paciente.setTelefone(dto.telefone());
        paciente.setEmail(dto.email());
        paciente.setEndereco(dto.endereco());

        Paciente pacienteAtualizado = pacienteRepository.save(paciente);

        return toResponseDTO(pacienteAtualizado);
    }

    public void excluir(Long id) {

        if (!pacienteRepository.existsById(id)) {
            throw new ResourceNotFoundException(
                    "Paciente não encontrado com id: " + id
            );
        }

        if (consultaRepository.existsByPacienteId(id)) {
            throw new ResourceInUseException(
                    "Não é possível excluir este paciente porque existem consultas vinculadas a ele."
            );
        }

        pacienteRepository.deleteById(id);
    }

    public ResumoIaResponseDTO gerarResumoIa(Long pacienteId) {

        Paciente paciente = pacienteRepository.findById(pacienteId)
                .orElseThrow(() -> new ResourceNotFoundException("Paciente não encontrado com id: " + pacienteId));

        List<Consulta> consultas = consultaRepository.findByPacienteIdOrderByDataHoraAsc(pacienteId);

        String prompt = montarPrompt(paciente, consultas);

        String resumo = geminiService.gerarResumo(prompt);

        paciente.setResumoIa(resumo);
        paciente.setResumoIaGeradoEm(LocalDateTime.now());

        pacienteRepository.save(paciente);

        return new ResumoIaResponseDTO(
                paciente.getId(),
                paciente.getNome(),
                resumo,
                paciente.getResumoIaGeradoEm()
        );
    }

    private String montarPrompt(Paciente paciente, List<Consulta> consultas) {

        StringBuilder prompt = new StringBuilder();
        prompt.append("Paciente: ").append(paciente.getNome()).append("\n\n");

        if (consultas.isEmpty()) {
            prompt.append("Este paciente ainda não possui consultas registradas.");
            return prompt.toString();
        }

        prompt.append("Histórico de consultas (ordem cronológica):\n");

        for (Consulta consulta : consultas) {

            String dataFormatada = consulta.getDataHora() != null
                    ? consulta.getDataHora().format(FORMATO_DATA)
                    : "data não informada";

            String observacoes = (consulta.getObservacoes() == null || consulta.getObservacoes().isBlank())
                    ? "sem observações registradas"
                    : consulta.getObservacoes();

            prompt.append("- Data: ").append(dataFormatada)
                    .append(" | Status: ").append(consulta.getStatus())
                    .append(" | Médico: ").append(consulta.getMedico().getNome())
                    .append(" (").append(consulta.getMedico().getEspecialidade()).append(")")
                    .append(" | Observações: ").append(observacoes)
                    .append("\n");
        }

        return prompt.toString();
    }

    private PacienteResponseDTO toResponseDTO(Paciente paciente) {

        return new PacienteResponseDTO(
                paciente.getId(),
                paciente.getNome(),
                paciente.getCpf(),
                paciente.getDataNascimento(),
                paciente.getTelefone(),
                paciente.getEmail(),
                paciente.getEndereco(),
                paciente.getResumoIa(),
                paciente.getResumoIaGeradoEm()
        );
    }
}