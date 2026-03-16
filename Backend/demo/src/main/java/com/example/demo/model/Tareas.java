package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "tareas")
@Data
public class Tareas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String descripcion;
    private Integer bimestre;
    private LocalDate fechaEntrega;

    private Integer punteo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_grupo")
    private Grupos grupo;
}
