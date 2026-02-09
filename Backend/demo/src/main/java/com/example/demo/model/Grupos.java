package com.example.demo.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "grupos")
public class Grupos {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String codigo;

    @ManyToOne
    @JoinColumn(name = "curso_id", nullable = false)
    private Cursos curso;

    @Column(nullable = false)
    private String jornada;

    @Column(nullable = false)
    private String horario;

    @Column(nullable = false)
    private String dia;

    @Column(nullable = false)
    private String cicloEscolar;

    @Column(nullable = false)
    private Boolean estado = true;

    @OneToMany(mappedBy = "grupo")
    private Set<AlumnoGrupo> alumnoGrupos = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCodigo() {
        return codigo;
    }

    public void setCodigo(String codigo) {
        this.codigo = codigo;
    }

    public Cursos getCurso() {
        return curso;
    }

    public void setCurso(Cursos curso) {
        this.curso = curso;
    }

    public String getJornada() {
        return jornada;
    }

    public void setJornada(String jornada) {
        this.jornada = jornada;
    }

    public String getHorario() {
        return horario;
    }

    public void setHorario(String horario) {
        this.horario = horario;
    }

    public String getDia() {
        return dia;
    }

    public void setDia(String dia) {
        this.dia = dia;
    }

    public String getCicloEscolar() {
        return cicloEscolar;
    }

    public void setCicloEscolar(String cicloEscolar) {
        this.cicloEscolar = cicloEscolar;
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }

    public Set<AlumnoGrupo> getAlumnoGrupos() {
        return alumnoGrupos;
    }

    public void setAlumnoGrupos(Set<AlumnoGrupo> alumnoGrupos) {
        this.alumnoGrupos = alumnoGrupos;
    }
}
