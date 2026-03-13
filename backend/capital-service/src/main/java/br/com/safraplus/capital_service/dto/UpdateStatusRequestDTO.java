package br.com.safraplus.capital_service.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateStatusRequestDTO(
        @NotBlank String status
) {
}
