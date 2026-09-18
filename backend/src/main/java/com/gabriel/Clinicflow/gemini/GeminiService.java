package com.gabriel.Clinicflow.gemini;

import com.gabriel.Clinicflow.exception.GeminiApiException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Service
public class GeminiService {

    private static final String INSTRUCAO_SISTEMA = """
        Você é um assistente administrativo de uma clínica médica.
        Sua única tarefa é organizar e resumir, de forma clara e cronológica,
        o histórico de consultas de um paciente com base nos dados fornecidos
        (datas, status das consultas, especialidades e observações já registradas).

        REGRAS OBRIGATÓRIAS:
        - NUNCA sugira, confirme, especule ou mencione diagnósticos ou hipóteses diagnósticas.
        - NUNCA recomende tratamentos, medicamentos ou condutas médicas.
        - NUNCA faça interpretação clínica dos sintomas ou observações.
        - Apenas reorganize e resuma as informações administrativas já registradas.
        - Se as observações contiverem algo que pareça diagnóstico, apenas relate
          que "há uma observação registrada nessa consulta" sem repetir conteúdo clínico sensível.
        - Escreva em português, em tom profissional e objetivo, em no máximo 200 palavras.
        - Escreva em texto corrido, em parágrafos normais. NÃO use markdown:
          sem asteriscos, sem negrito, sem listas com marcadores, sem títulos.
          Apenas texto simples, como em um relatório comum.
        """;

    private final RestClient restClient;
    private final String apiKey;
    private final String apiUrl;

    public GeminiService(
            @Value("${gemini.api.key}") String apiKey,
            @Value("${gemini.api.url}") String apiUrl) {

        this.apiKey = apiKey;
        this.apiUrl = apiUrl;
        this.restClient = RestClient.create();
    }

    public String gerarResumo(String promptComDados) {

        GeminiRequest requestBody = new GeminiRequest(
                new GeminiRequest.SystemInstruction(List.of(new GeminiRequest.Part(INSTRUCAO_SISTEMA))),
                List.of(new GeminiRequest.Content("user", List.of(new GeminiRequest.Part(promptComDados))))
        );

        GeminiResponse response;

        try {
            response = restClient.post()
                    .uri(apiUrl + "?key={key}", apiKey)
                    .contentType(MediaType.APPLICATION_JSON)
                    .body(requestBody)
                    .retrieve()
                    .body(GeminiResponse.class);

        } catch (RestClientException e) {
            throw new GeminiApiException("Falha ao chamar a API do Gemini: " + e.getMessage(), e);
        }

        if (response == null || response.candidates() == null || response.candidates().isEmpty()) {
            throw new GeminiApiException("A API do Gemini não retornou nenhum conteúdo.");
        }

        GeminiResponse.Content conteudo = response.candidates().get(0).content();

        if (conteudo == null || conteudo.parts() == null || conteudo.parts().isEmpty()) {
            throw new GeminiApiException("A resposta da IA veio vazia.");
        }

        return conteudo.parts().get(0).text();
    }
}