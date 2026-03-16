package com.example.demo.service;

import com.example.demo.dto.PunteoResponseDTO;
import com.example.demo.dto.PunteoUpdateRequestDTO;

import java.util.List;

public interface TareaAlumnoService {
    List<PunteoResponseDTO> listarNotasPorTarea (Long idTareas);

    void actualizarNotasMasivamente(List<PunteoUpdateRequestDTO> dtos);
}
