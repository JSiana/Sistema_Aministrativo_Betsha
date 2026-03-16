package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;

@Entity
@Table(name = "tarea_alumnos")
@Data
public class TareaAlumnos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_tarea")
    private Tareas tarea;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_alumno")
    private Alumnos alumno;

    private Double nota;
    private String observacion;
    private LocalDate fechaEntregada;

}
