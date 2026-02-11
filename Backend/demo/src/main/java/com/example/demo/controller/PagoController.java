package com.example.demo.controller;

import com.example.demo.dto.PagoDTO;
import com.example.demo.dto.PagoResponseDTO;
import com.example.demo.model.Pagos;
import com.example.demo.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pagos")
public class PagoController {

    @Autowired
    private PagoService pagoService;


    @PostMapping
    public ResponseEntity<PagoResponseDTO> crear(@RequestBody PagoDTO request) {
        return ResponseEntity.ok(pagoService.registrarPago(request));
    }

    @GetMapping("/historial/{alumnoGrupoId}")
    public ResponseEntity<List<Pagos>> historial(@PathVariable Long alumnoGrupoId) {
        return ResponseEntity.ok(pagoService.obtenerHistorialPorAsignacion(alumnoGrupoId));
    }


}
