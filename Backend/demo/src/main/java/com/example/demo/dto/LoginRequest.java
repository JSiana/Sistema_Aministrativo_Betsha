package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LoginRequest {
    @NotBlank(message = "El usuario es obligatorio")
    @Size(min = 4, message = "El nombre de usuario debe tener al menos 4 caracteres")
    @Pattern(regexp = "^[a-zA-Z0-9_-]+$", message = "El usuario solo puede contener letras, números, guiones y guiones bajos")
    private String usuario;

    @NotBlank(message = "La contraseña es obligatoria")
    private String contrasenia;
}
