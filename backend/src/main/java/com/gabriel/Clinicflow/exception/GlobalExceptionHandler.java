package com.gabriel.Clinicflow.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleResourceNotFound(
            ResourceNotFoundException ex) {

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", HttpStatus.NOT_FOUND.value());
        corpo.put("erro", "Recurso não encontrado");
        corpo.put("mensagem", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(corpo);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationErrors(
            MethodArgumentNotValidException ex) {

        Map<String, String> camposInvalidos = new HashMap<>();

        for (FieldError erro : ex.getBindingResult().getFieldErrors()) {
            camposInvalidos.put(
                    erro.getField(),
                    erro.getDefaultMessage()
            );
        }

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", HttpStatus.BAD_REQUEST.value());
        corpo.put("erro", "Erro de validação");
        corpo.put("campos", camposInvalidos);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(corpo);
    }

    @ExceptionHandler(GeminiApiException.class)
    public ResponseEntity<Map<String, Object>> handleGeminiApiException(
            GeminiApiException ex) {

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", HttpStatus.BAD_GATEWAY.value());
        corpo.put("erro", "Falha na integração com a IA");
        corpo.put("mensagem", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(corpo);
    }

    @ExceptionHandler(ResourceInUseException.class)
    public ResponseEntity<Map<String, Object>> handleResourceInUse(
            ResourceInUseException ex) {

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", HttpStatus.CONFLICT.value());
        corpo.put("erro", "Recurso em uso");
        corpo.put("mensagem", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(corpo);
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<Map<String, Object>> handleDuplicateResource(
            DuplicateResourceException ex) {

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", HttpStatus.CONFLICT.value());
        corpo.put("erro", "Recurso duplicado");
        corpo.put("mensagem", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(corpo);
    }

    @ExceptionHandler(BusinessRuleException.class)
    public ResponseEntity<Map<String, Object>> handleBusinessRule(
            BusinessRuleException ex) {

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", HttpStatus.UNPROCESSABLE_ENTITY.value());
        corpo.put("erro", "Regra de negócio");
        corpo.put("mensagem", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.UNPROCESSABLE_ENTITY)
                .body(corpo);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(
            Exception ex) {

        Map<String, Object> corpo = new HashMap<>();
        corpo.put("timestamp", LocalDateTime.now());
        corpo.put("status", HttpStatus.INTERNAL_SERVER_ERROR.value());
        corpo.put("erro", "Erro interno no servidor");
        corpo.put("mensagem", ex.getMessage());

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(corpo);
    }
}