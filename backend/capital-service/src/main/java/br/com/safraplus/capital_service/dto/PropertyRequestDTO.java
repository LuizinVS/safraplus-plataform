package br.com.safraplus.capital_service.dto;

import jakarta.validation.constraints.NotBlank;

public record PropertyRequestDTO(
        @NotBlank(message = "O nome da propriedade não pode estar em branco")
        String propertyName,
        String location,
        Integer areaInHectares,
        String description
) {
}
