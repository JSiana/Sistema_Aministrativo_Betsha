package com.example.demo.service;

import com.example.demo.model.AlumnoGrupo;

import java.util.List;

public interface AlumnoGrupoService {

    AlumnoGrupo asignarAlumno(Long grupoId, Long alumnoId);

    List<AlumnoGrupo> listarAlumnosPorGrupo(Long grupoId);

    List<AlumnoGrupo> listarGruposPorAlumno(Long alumnoId);

    void quitarAlumno(Long grupoId, Long alumnoId);
}
