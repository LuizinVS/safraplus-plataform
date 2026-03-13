package br.com.safraplus.capital_service.dto;

public record NotificationEventDTO(
        String userEmail,
        String message,
        String type
) {
}
