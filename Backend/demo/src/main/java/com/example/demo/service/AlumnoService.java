package com.example.demo.service;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.model.Alumnos;

import java.util.List;

public interface AlumnoService {

    List<AlumnoResponseDTO> listarAlumnos();

    Alumnos guardarAlumno(AlumnoDTO dto);

    AlumnoDTO obtenerAlumnoPorId(Long id);

    AlumnoResponseDTO actualizarAlumno(Long id, AlumnoDTO alumnoDTO);

    void eliminarAlumno(Long id);
}
