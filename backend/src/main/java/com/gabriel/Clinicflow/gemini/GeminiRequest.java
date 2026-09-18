package com.gabriel.Clinicflow.gemini;

import java.util.List;

public record GeminiRequest(
        SystemInstruction systemInstruction,
        List<Content> contents
) {

    public record SystemInstruction(List<Part> parts) {
    }

    public record Content(String role, List<Part> parts) {
    }

    public record Part(String text) {
    }
}