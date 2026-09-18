package com.gabriel.Clinicflow.controller;

import com.gabriel.Clinicflow.dto.PacienteRequestDTO;
import com.gabriel.Clinicflow.dto.PacienteResponseDTO;
import com.gabriel.Clinicflow.dto.ResumoIaResponseDTO;
import com.gabriel.Clinicflow.service.PacienteService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pacientes")
@CrossOrigin(origins = "http://localhost:4200")
public class PacienteController {

    private final PacienteService pacienteService;

    public PacienteController(PacienteService pacienteService) {
        this.pacienteService = pacienteService;
    }

    @GetMapping
    public List<PacienteResponseDTO> listarTodos() {
        return pacienteService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.buscarPorId(id));
    }

    @PostMapping
    public ResponseEntity<PacienteResponseDTO> salvar(@Valid @RequestBody PacienteRequestDTO dto) {
        return ResponseEntity.status(201).body(pacienteService.salvar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<PacienteResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody PacienteRequestDTO dto) {
        return ResponseEntity.ok(pacienteService.atualizar(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {
        pacienteService.excluir(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/resumo-ia")
    public ResponseEntity<ResumoIaResponseDTO> gerarResumoIa(@PathVariable Long id) {
        return ResponseEntity.ok(pacienteService.gerarResumoIa(id));
    }
}