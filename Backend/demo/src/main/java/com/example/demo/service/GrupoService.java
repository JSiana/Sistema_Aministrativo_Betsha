package com.example.demo.service;

import com.example.demo.dto.GrupoDTO;
import com.example.demo.dto.GrupoResponseDTO;
import com.example.demo.model.Grupos;

import java.util.List;

public interface GrupoService {

    Grupos crearGrupo (GrupoDTO dto);

    List<GrupoResponseDTO> listarGrupo();

}
