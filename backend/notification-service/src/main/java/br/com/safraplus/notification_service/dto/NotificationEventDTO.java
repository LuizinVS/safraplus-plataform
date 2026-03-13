package br.com.safraplus.notification_service.dto;

public record NotificationEventDTO(
        String userEmail,
        String message,
        String type
) {
}
