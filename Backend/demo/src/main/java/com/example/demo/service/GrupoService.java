package com.example.demo.service;

import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.dto.GrupoDTO;
import com.example.demo.dto.GrupoResponseDTO;
import com.example.demo.model.Grupos;

import java.util.List;

public interface GrupoService {

    Grupos crearGrupo (GrupoDTO dto);

    List<GrupoResponseDTO> listarGrupo();

    GrupoResponseDTO obtenerGrupoPorId(Long id);

    void asignarAlumno(Long grupoId, Long alumnoId);

    void quitarAlumno(Long grupoId, Long alumnoID);

    List<AlumnoResponseDTO> listarAlumnosDelGrupo(Long grupoId);

    void eliminarGrupo(Long id);
}
