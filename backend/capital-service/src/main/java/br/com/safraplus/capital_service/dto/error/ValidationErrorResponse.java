package br.com.safraplus.capital_service.dto.error;

import java.util.List;

public record ValidationErrorResponse(
        String message,
        List<FieldErrorDetail> errors
) {
}
