package com.example.demo.mapper;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Encargados;

public class EncargadoMapper {

    // Para convertir de DTO de creación a entidad
    public static Encargados toEntity(AlumnoDTO dto, EncargadoResponseDTO dto {
        Alumnos alumno = new Alumnos();
        alumno.setCodigoPersonal(dto.getCodigoPersonal());
        alumno.setPrimerNombre(dto.getPrimerNombre());
        alumno.setSegundoNombre(dto.getSegundoNombre());
        alumno.setTercerNombre(dto.getTercerNombre());
        alumno.setPrimerApellido(dto.getPrimerApellido());
        alumno.setSegundoApellido(dto.getSegundoApellido());
        alumno.setEmail(dto.getEmail());
        alumno.setFechaNacimiento(dto.getFechaNacimiento());
        alumno.setUltimoGrado(dto.getUltimoGrado());
        alumno.setTelefono(dto.getTelefono());
        alumno.setEstado(dto.getEstado());
        alumno.setEncargado(encargado);
        return alumno;
    }


}
