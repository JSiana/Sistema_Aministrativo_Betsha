package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name="alumno_grupo")
public class AlumnoGrupo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "alumno_id", nullable = false)
    @JsonIgnoreProperties("alumnoGrupos") // <--- Evita que el alumno vuelva a llamar a esta tabla
    private Alumnos alumno;

    @ManyToOne
    @JoinColumn(name = "grupo_id", nullable = false)
    @JsonIgnoreProperties("alumnoGrupos") // <--- Evita que el grupo vuelva a llamar a esta tabla
    private Grupos grupo;

}
