package com.example.demo.mapper;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Encargados;

public class AlumnoMapper {

    // Para convertir de DTO de creación a entidad
    public static Alumnos toEntity(AlumnoDTO dto, Encargados encargado) {
        Alumnos alumno = new Alumnos();
        alumno.setCodigoPersonal(dto.getCodigoPersonal());
        alumno.setPrimerNombre(dto.getPrimerNombre());
        alumno.setSegundoNombre(dto.getSegundoNombre());
        alumno.setTercerNombre(dto.getTercerNombre());
        alumno.setPrimerApellido(dto.getPrimerApellido());
        alumno.setSegundoApellido(dto.getSegundoApellido());
        alumno.setEmail(dto.getEmail());
        alumno.setFechaNacimiento(dto.getFechaNacimiento());
        alumno.setSexo(dto.getSexo());
        alumno.setUltimoGrado(dto.getUltimoGrado());
        alumno.setTelefono(dto.getTelefono());
        alumno.setEstado(dto.getEstado());
        alumno.setEncargado(encargado);
        return alumno;
    }

    // Para convertir de entidad a ResponseDTO (para listar o mostrar)
    public static AlumnoResponseDTO toResponseDTO(Alumnos alumno) {
        AlumnoResponseDTO dto = new AlumnoResponseDTO();
        dto.setId(alumno.getId());
        dto.setCodigoPersonal(alumno.getCodigoPersonal());
        dto.setPrimerNombre(alumno.getPrimerNombre());
        dto.setSegundoNombre(alumno.getSegundoNombre());
        dto.setTercerNombre(alumno.getTercerNombre());
        dto.setPrimerApellido(alumno.getPrimerApellido());
        dto.setSegundoApellido(alumno.getSegundoApellido());
        dto.setSexo(alumno.getSexo());
        dto.setTelefono(alumno.getTelefono());
        dto.setEstado(alumno.getEstado());

        if (alumno.getEncargado() != null) {
            dto.setNombreEncargado(alumno.getEncargado().getNombres());
            dto.setApellidoEncargado(alumno.getEncargado().getApellidos());
        }

        return dto;
    }
}
