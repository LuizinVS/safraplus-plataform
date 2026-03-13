package br.com.safraplus.authservice.dto;

public record NotificationEventDTO(
        String userEmail,
        String message,
        String type
) {
}
