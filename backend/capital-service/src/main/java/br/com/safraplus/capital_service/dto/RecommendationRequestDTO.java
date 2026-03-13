package br.com.safraplus.capital_service.dto;

import jakarta.validation.constraints.NotBlank;

public record RecommendationRequestDTO(
        @NotBlank String recommendationText,
        @NotBlank String action
) {
}
