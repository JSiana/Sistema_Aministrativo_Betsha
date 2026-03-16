package com.example.demo.service;

import com.example.demo.dto.TareaDTO;
import com.example.demo.dto.TareaResponseDTO;

import java.util.List;

public interface TareaService {

    TareaResponseDTO crearTareaConPunteos(TareaDTO dto);

    List<TareaResponseDTO> listarTareasPorGrupoYBimestre(Long idGrupo, Integer bimestre);

    void eliminarTarea(Long id);
}
