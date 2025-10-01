package com.example.demo.model;

import com.example.demo.config.LocalDateTimeAtrributeConverter;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Entity
@Table(name = "usuarios")
@Getter
@Setter
public class Usuarios {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Nombre de usuario (login)
    @Column(name = "usuario", nullable = false, unique = true, length = 50)
    private String usuario;

    // Nombre completo
    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    // Email
    @Column(name = "email", nullable = false, unique = true, length = 100)
    private String email;

    // Contraseña (hashed idealmente)

    @Column(name = "contraseña", nullable = false)
    private String contrasenia;

    // Relación con Rol (muchos usuarios a un rol)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "rol_id", nullable = false)
    private Roles rol;

    // Estado del usuario (activo/inactivo)
    @Column(name = "estado", nullable = false)
    private Boolean estado;

    private int intentosFallidos;


    private LocalDateTime fechaBloqueo;


}
