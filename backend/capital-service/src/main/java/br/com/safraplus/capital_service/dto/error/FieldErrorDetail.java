package br.com.safraplus.capital_service.dto.error;

public record FieldErrorDetail(
        String field,
        String message
) {
}
