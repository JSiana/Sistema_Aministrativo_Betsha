package com.example.demo.controller;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.EncargadoDTO;
import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.model.Encargados;
import com.example.demo.repository.EncargadoRepository;
import com.example.demo.service.EncargadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@RestController
@RequestMapping("/api/encargados")
public class EncargadoController {
    @Autowired
    private EncargadoRepository encargadoRepository;

    private final EncargadoService encargadoService;
    private final Logger logger = LoggerFactory.getLogger(EncargadoController.class);

    public EncargadoController(EncargadoService encargadoService){
        this.encargadoService = encargadoService;
    }

    @GetMapping
    public ResponseEntity<List<EncargadoResponseDTO>> listarEncargados() {
        List<EncargadoResponseDTO> lista = encargadoService.listarEncargados();
        return ResponseEntity.ok(lista);
    }

    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PostMapping
    public ResponseEntity<?> crearEncargado(@RequestBody EncargadoDTO encargadoDTO){
        //Validar nombre DPI de encargado
        if (encargadoService.existeDpiEncargado(encargadoDTO.getDpi())){ return ResponseEntity .status(HttpStatus.CONFLICT)
                .body("El DPI del encargado ya esta registrado"); }

        //Crear encargado por DTO
        Encargados encargado = new Encargados();
        encargado.setDpi(encargadoDTO.getDpi());
        encargado.setNombres(encargadoDTO.getNombres());
        encargado.setApellidos(encargadoDTO.getApellidos());
        encargado.setTelefono(encargadoDTO.getTelefono());
        encargado.setDireccion(encargadoDTO.getDireccion());
        Encargados nuevoEncargado = encargadoService.crearEncargado(encargado);

        //Respuesta del DTO
        return ResponseEntity.ok(nuevoEncargado);
    }


    //Obtener encargado por id
    @GetMapping("/{id}")
    public EncargadoDTO obtenerEncargadoPorId(@PathVariable Long id){
        return encargadoService.obtenerEncargadoPorId(id);
    }

    // Actualizar encargado


    @PreAuthorize("hasRole('ADMINISTRADOR')")
    @PutMapping("/{id}")
    public ResponseEntity<EncargadoResponseDTO> actualizarEncargado(
            @PathVariable Long id,
            @RequestBody EncargadoDTO dto){
        EncargadoResponseDTO response = encargadoService.actualizarEncargado(id, dto);
        return ResponseEntity.ok(response);
    }


    // Eliminar encargado
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse> eliminar(@PathVariable Long id) {
        ApiResponse response = encargadoService.eliminarEncargado(id);
        if (response.isSuccess()) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(404).body(response);
        }
    }

}
