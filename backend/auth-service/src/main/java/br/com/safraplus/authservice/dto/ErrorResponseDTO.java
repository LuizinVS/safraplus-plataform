package br.com.safraplus.authservice.dto;

import java.time.LocalDateTime;

public record ErrorResponseDTO(
        String message,
        int status,
        LocalDateTime timestamp
) {
}
