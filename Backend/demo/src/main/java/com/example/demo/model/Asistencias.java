package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@Data
@Table(name = "asistencias")
public class Asistencias {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_grupo_id", nullable = false)
    private AlumnoGrupo alumnoGrupo;

    @Column(name = "descripcion", nullable = false)
    private String descripcion;

    @Column(name = "fechaAsistencia", nullable = false)
    private LocalDate fechaAsistencia;

    @Column(name = "observacion")
    private String observacion;

    @Column(name = "estado")
    private boolean estado = true;


}
