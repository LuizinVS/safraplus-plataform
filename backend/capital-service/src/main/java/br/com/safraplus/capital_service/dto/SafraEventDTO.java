package br.com.safraplus.capital_service.dto;

public record SafraEventDTO(
        Long safraId,
        String cropType,
        String userEmail
) {
}
