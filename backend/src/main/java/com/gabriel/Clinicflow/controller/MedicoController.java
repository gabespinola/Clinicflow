package com.gabriel.Clinicflow.controller;

import com.gabriel.Clinicflow.dto.MedicoRequestDTO;
import com.gabriel.Clinicflow.dto.MedicoResponseDTO;
import com.gabriel.Clinicflow.service.MedicoService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/medicos")
@CrossOrigin(origins = "http://localhost:4200")
public class MedicoController {

    private final MedicoService service;

    public MedicoController(MedicoService service) {
        this.service = service;
    }

    @GetMapping
    public List<MedicoResponseDTO> listarTodos() {
        return service.listarTodos();
    }

    @GetMapping("/{id}")
    public MedicoResponseDTO buscarPorId(@PathVariable Long id) {
        return service.buscarPorId(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public MedicoResponseDTO criar(@Valid @RequestBody MedicoRequestDTO request) {
        return service.criar(request);
    }

    @PutMapping("/{id}")
    public MedicoResponseDTO atualizar(
            @PathVariable Long id,
            @Valid @RequestBody MedicoRequestDTO request) {

        return service.atualizar(id, request);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void excluir(@PathVariable Long id) {
        service.excluir(id);
    }
}