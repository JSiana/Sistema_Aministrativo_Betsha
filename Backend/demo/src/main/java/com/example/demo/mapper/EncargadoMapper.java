package com.example.demo.mapper;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Encargados;

public class EncargadoMapper {

    public static Encargados toEntity(EncargadoResponseDTO dto){
        Encargados encargado = new Encargados();
        encargado.setDpi(dto.getDpi());
        encargado.setNombres(dto.getNombres());
        encargado.setApellidos(dto.getApellidos());
        encargado.setTelefono(dto.getTelefono());
        encargado.setDireccion(dto.getDireccion());
        encargado.setEstado(dto.getEstado());

        return encargado;
    }

    public static EncargadoResponseDTO toResponseDTO(Encargados encargados){
        EncargadoResponseDTO dto = new EncargadoResponseDTO();

        dto.setId(encargados.getId());
        dto.setDpi(encargados.getDpi());
        dto.setNombres(encargados.getNombres());
        dto.setApellidos(encargados.getApellidos());
        dto.setTelefono(encargados.getTelefono());
        dto.setDireccion(encargados.getDireccion());
        dto.setEstado(encargados.get);

    }




}
