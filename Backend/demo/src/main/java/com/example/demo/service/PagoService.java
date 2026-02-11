package com.example.demo.service;

import com.example.demo.dto.PagoDTO;
import com.example.demo.dto.PagoResponseDTO;
import com.example.demo.model.Pagos;

import java.util.List;

public interface PagoService {

    PagoResponseDTO registrarPago(PagoDTO request);

    List<Pagos> obtenerHistorialPorAsignacion(Long alumnoGrupoId);
}
