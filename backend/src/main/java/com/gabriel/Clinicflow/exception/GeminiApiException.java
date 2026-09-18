package com.gabriel.Clinicflow.exception;

public class GeminiApiException extends RuntimeException {

    public GeminiApiException(String message) {
        super(message);
    }

    public GeminiApiException(String message, Throwable causa) {
        super(message, causa);
    }
}