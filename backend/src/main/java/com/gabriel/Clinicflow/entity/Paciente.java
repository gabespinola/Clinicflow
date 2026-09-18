package com.gabriel.Clinicflow.entity;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "pacientes")
public class Paciente {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String nome;
    private String cpf;
    private LocalDate dataNascimento;
    private String telefone;
    private String email;
    private String endereco;

    @Column(columnDefinition = "TEXT")
    private String resumoIa;

    private LocalDateTime resumoIaGeradoEm;

    public Paciente() {
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }

    public String getCpf() { return cpf; }
    public void setCpf(String cpf) { this.cpf = cpf; }

    public LocalDate getDataNascimento() { return dataNascimento; }
    public void setDataNascimento(LocalDate dataNascimento) { this.dataNascimento = dataNascimento; }

    public String getTelefone() { return telefone; }
    public void setTelefone(String telefone) { this.telefone = telefone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getEndereco() { return endereco; }
    public void setEndereco(String endereco) { this.endereco = endereco; }

    public String getResumoIa() { return resumoIa; }
    public void setResumoIa(String resumoIa) { this.resumoIa = resumoIa; }

    public LocalDateTime getResumoIaGeradoEm() { return resumoIaGeradoEm; }
    public void setResumoIaGeradoEm(LocalDateTime resumoIaGeradoEm) { this.resumoIaGeradoEm = resumoIaGeradoEm; }
}