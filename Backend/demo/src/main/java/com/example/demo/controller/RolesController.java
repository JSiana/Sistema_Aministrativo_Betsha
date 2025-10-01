package com.example.demo.controller;


import com.example.demo.model.Roles;
import com.example.demo.repository.RolesRepository;
import com.example.demo.service.RolesService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/roles")
public class RolesController {

    @Autowired
    private RolesService rolesService;

    @Autowired
    private RolesRepository rolesRepository;


    @PostMapping
    public ResponseEntity<Roles> crearRol(@Valid @RequestBody Roles rol){
        rol.setEstado(true);
        Roles nuevoRol = rolesService.crearRol(rol);

        return new ResponseEntity<>(nuevoRol, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<Roles>> obtenerRolesActivos(){
        List<Roles> roles = rolesService.obtenerRolActivo();
        return ResponseEntity.ok(roles);
    }

    @PutMapping("/desactivar/{id}")
    public ResponseEntity<?> desactivarRol(@PathVariable Long id){
        Optional<Roles> rolOpt = rolesRepository.findById(id);
        if (rolOpt.isPresent()){
            Roles rol = rolOpt.get();
            rol.setEstado(false);
            rolesRepository.save(rol);
            return ResponseEntity.ok().build();
        } else{
            return ResponseEntity.notFound().build();
        }
    }


    @PutMapping("/{id}")
    public ResponseEntity<?> modificarRol(@PathVariable Long id, @RequestBody Roles rolActualizado){
        Optional<Roles> rolOpt = rolesRepository.findById(id);
        if (rolOpt.isPresent()){
            Roles rol = rolOpt.get();
            rol.setNombreRol(rolActualizado.getNombreRol());
            rol.setDescripcion(rolActualizado.getDescripcion());

            rolesRepository.save(rol);
            return ResponseEntity.ok(rol);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

}

