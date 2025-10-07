package com.example.demo.service;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.model.Encargados;

import java.util.List;

public interface EncargadoService {

    public Encargados crearEncargado(Encargados encargados);



    List<EncargadoResponseDTO> listarEncargados();




}
