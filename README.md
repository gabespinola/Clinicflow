# 🏥 ClinicFlow

Sistema full stack para gerenciamento de clínicas, desenvolvido com **Angular, Spring Boot e PostgreSQL**, com gestão de pacientes, médicos e consultas, dashboard administrativo e integração com **Google Gemini** para geração de resumos administrativos do histórico de atendimentos.

O projeto foi desenvolvido com foco na aplicação prática de conceitos de desenvolvimento full stack, organização em camadas, construção de APIs REST, validações, regras de negócio e integração com serviços externos.

## ✨ Funcionalidades

### 👤 Pacientes
- Cadastro, edição, consulta e exclusão de pacientes
- Validação de CPF
- Validação e formatação de telefone
- Validação de e-mail e data de nascimento
- Busca por nome ou CPF
- Ordenação e paginação
- Bloqueio da exclusão quando existem consultas vinculadas
- Visualização do histórico de consultas

### 🩺 Médicos
- Cadastro, edição, consulta e exclusão de médicos
- Validação de CRM
- Cadastro de especialidade e dados de contato
- Busca por nome, CRM ou especialidade
- Ordenação e paginação
- Bloqueio da exclusão quando existem consultas vinculadas

### 📅 Consultas
- Agendamento e gerenciamento de consultas
- Associação entre paciente e médico
- Status: **Agendada, Realizada e Cancelada**
- Validação das datas conforme o status da consulta
- Campo de observações
- Busca por paciente ou médico
- Filtro por status
- Ordenação priorizando próximas consultas agendadas
- Paginação

### 📊 Dashboard
- Total de pacientes cadastrados
- Total de médicos cadastrados
- Quantidade de consultas agendadas
- Quantidade de consultas realizadas
- Exibição das próximas consultas

### 🤖 Integração com Inteligência Artificial
O ClinicFlow possui integração com a **API do Google Gemini** para geração de um resumo administrativo do histórico de consultas de um paciente.

A integração foi configurada para organizar informações já registradas no sistema de maneira objetiva e cronológica, sem realizar diagnóstico, recomendar medicamentos, tratamentos ou outras condutas médicas.

As credenciais da API são mantidas fora do código-fonte por meio de variáveis de ambiente.

## 🛠️ Tecnologias

### Backend
- Java 21
- Spring Boot
- Spring Data JPA
- Spring Validation
- API REST
- PostgreSQL
- Maven
- Google Gemini API

### Frontend
- Angular
- TypeScript
- Angular Material
- HTML
- CSS
- Signals
- Reactive Forms

## 🏗️ Estrutura do projeto

O repositório está dividido em duas aplicações:

```text
ClinicFlow/
├── backend/     # API REST desenvolvida com Spring Boot
└── frontend/    # Interface desenvolvida com Angular
```

No backend, a aplicação utiliza uma arquitetura em camadas, separando responsabilidades entre controllers, services, repositories, entidades e DTOs.

## 🔐 Variáveis de ambiente

Para executar o backend, é necessário configurar:

```text
DB_PASSWORD=sua_senha_do_postgresql
GEMINI_API_KEY=sua_chave_da_api_gemini
```

Nenhuma senha ou chave de API é armazenada diretamente no código-fonte.

## 🚀 Como executar

### Pré-requisitos

- Java 21
- Node.js e npm
- PostgreSQL
- Angular CLI

### Backend

Configure um banco PostgreSQL chamado:

```text
clinicflow_db
```

Configure as variáveis de ambiente `DB_PASSWORD` e `GEMINI_API_KEY`.

Depois, dentro da pasta `backend`, execute a aplicação Spring Boot pela sua IDE ou utilizando Maven.

A API será iniciada em:

```text
http://localhost:8080
```

### Frontend

Dentro da pasta `frontend`, instale as dependências:

```bash
npm install
```

Depois execute:

```bash
ng serve
```

A aplicação poderá ser acessada em:

```text
http://localhost:4200
```

## 📸 Demonstração

> Screenshots da aplicação serão adicionados aqui.

## 📚 Objetivo do projeto

O ClinicFlow foi desenvolvido como projeto prático para consolidar conhecimentos em desenvolvimento **Full Stack**, incluindo integração entre frontend e backend, persistência de dados, validações, regras de negócio, tratamento de erros, construção de interfaces e consumo de APIs externas.

---

Desenvolvido por **Gabriel Sousa Espínola**.
