package br.com.safraplus.authservice.dto;

public record UserResponseDTO(
        Long id,
        String name,
        String email
) {
}
