package br.com.safraplus.authservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterUserRequestDTO(
        @NotBlank(message = "O nome não pode estar em branco")
        String name,

        @NotBlank(message = "O email não pode estar em branco")
        @Email(message = "Formato de email inválido")
        String email,

        @NotBlank(message = "A senha não pode estar em branco")
        @Size(min = 8, message = "A senha deve ter no mínimo 8 caracteres")
        String password
) {
}
