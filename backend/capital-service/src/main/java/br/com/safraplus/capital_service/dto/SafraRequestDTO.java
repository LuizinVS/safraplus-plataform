package br.com.safraplus.capital_service.dto;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

public record SafraRequestDTO(
        @NotBlank String name,
        @NotBlank String cropType,
        LocalDate startDate,
        LocalDate endDate
) {
}
