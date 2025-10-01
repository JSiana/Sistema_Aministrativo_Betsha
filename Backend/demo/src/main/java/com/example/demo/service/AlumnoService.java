package com.example.demo.service;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.AlumnoResponseDTO;

import java.util.List;

public interface AlumnoService {

    List<AlumnoResponseDTO> listarAlumnos();

    AlumnoDTO obtenerAlumnoPorId(Long id);

    AlumnoDTO actualizarAlumno(Long id, AlumnoDTO alumnoDTO);

}
