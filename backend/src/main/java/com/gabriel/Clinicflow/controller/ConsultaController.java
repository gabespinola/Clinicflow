package com.gabriel.Clinicflow.controller;

import com.gabriel.Clinicflow.dto.ConsultaRequestDTO;
import com.gabriel.Clinicflow.dto.ConsultaResponseDTO;
import com.gabriel.Clinicflow.service.ConsultaService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/consultas")
@CrossOrigin(origins = "http://localhost:4200")
public class ConsultaController {

    private final ConsultaService consultaService;

    public ConsultaController(ConsultaService consultaService) {
        this.consultaService = consultaService;
    }

    @GetMapping
    public List<ConsultaResponseDTO> listarTodos() {
        return consultaService.listarTodos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(
                consultaService.buscarPorId(id)
        );
    }

    @PostMapping
    public ResponseEntity<ConsultaResponseDTO> salvar(
            @Valid @RequestBody ConsultaRequestDTO dto) {

        return ResponseEntity
                .status(201)
                .body(consultaService.salvar(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ConsultaResponseDTO> atualizar(
            @PathVariable Long id,
            @Valid @RequestBody ConsultaRequestDTO dto) {

        return ResponseEntity.ok(
                consultaService.atualizar(id, dto)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> excluir(@PathVariable Long id) {

        consultaService.excluir(id);

        return ResponseEntity.noContent().build();
    }
}