package com.example.demo.controller;

import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.model.Encargados;
import com.example.demo.repository.EncargadoRepository;
import com.example.demo.service.EncargadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/encargados")
public class EncargadoController {
    @Autowired
    private EncargadoRepository encargadoRepository;

    private final EncargadoService encargadoService;

    public EncargadoController(EncargadoService encargadoService){
        this.encargadoService = encargadoService;
    }

    @GetMapping
    public ResponseEntity<List<EncargadoResponseDTO>> listarEncargados() {
        return ResponseEntity.ok(encargadoService.listarEncargados());
    }

    @PostMapping
    public ResponseEntity<Encargados> crearEncargado(@RequestBody Encargados encargado){
        Encargados creado = encargadoRepository.save(encargado);
        return ResponseEntity.ok(creado);
    }

    // Obtener encargado por ID
    @GetMapping("/{id}")
    public ResponseEntity<Encargados> obtenerEncargado(@PathVariable Long id) {
        return encargadoRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Actualizar encargado
    @PutMapping("/{id}")
    public ResponseEntity<Encargados> actualizarEncargado(@PathVariable Long id, @RequestBody Encargados datos) {
        return encargadoRepository.findById(id).map(enc -> {
            enc.setNombres(datos.getNombres());
            enc.setApellidos(datos.getApellidos());
            enc.setDpi(datos.getDpi());
            enc.setTelefono(datos.getTelefono());
            enc.setDireccion(datos.getDireccion());
            enc.setEstado(datos.isEstado());
            Encargados actualizado = encargadoRepository.save(enc);
            return ResponseEntity.ok(actualizado);
        }).orElse(ResponseEntity.notFound().build());
    }

    // Eliminar encargado
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarEncargado(@PathVariable Long id) {
        if (encargadoRepository.existsById(id)) {
            encargadoRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }


}
