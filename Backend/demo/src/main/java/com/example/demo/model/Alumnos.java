package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "alumnos")
@Getter
@Setter
@NoArgsConstructor
public class Alumnos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Codigo personal, para login de APP a futuro
    @Column(name = "codigoPersonal", nullable = false, unique = true, length = 7)
    private String codigoPersonal;

    @Column(name = "primerNombre", nullable = false, length = 25)
    private String primerNombre;

    @Column(name = "segundoNombre", nullable = true, length = 25)
    private String segundoNombre;

    @Column(name = "tercerNombre", nullable = true, length = 25)
    private String tercerNombre;

    @Column(name = "primerApellido", nullable = false, length = 25)
    private String primerApellido;

    @Column(name = "segundoApellido", nullable = true, length = 25)
    private String segundoApellido;

    @Column(name = "email", nullable = true, length = 50)
    private String email;

    @Column(name = "fechaNacimiento")
    private LocalDate fechaNacimiento;

    @Column(name= "sexo", nullable = false)
    private String sexo;

    @Column(name = "uGrado", nullable = false)
    private String ultimoGrado;

    @Column(name = "telefono", nullable = true, length = 8)
    private String telefono;


    // Relación con encargados (muchos usuarios a un rol)
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "encargado_id", nullable = false)
    @JsonManagedReference
    private Encargados encargado;


    @Column(name = "estado", nullable = false)
    private Boolean estado;




}
