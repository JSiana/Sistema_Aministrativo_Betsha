package com.example.demo.service;


import com.example.demo.model.Roles;
import com.example.demo.repository.RolesRepository;
import com.fasterxml.jackson.databind.ext.NioPathDeserializer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RolesService {

    @Autowired
    private RolesRepository rolesRepository;

    public Roles crearRol(Roles rol){
        return rolesRepository.save(rol);
    }
    public RolesService(RolesRepository rolesRepository){
        this.rolesRepository = rolesRepository;
    }

    public List<Roles> obtenerRolActivo(){
        return rolesRepository.findByEstadoTrue();
    }

    public boolean eliminarROl (Long id){
        if (rolesRepository.existsById(id)){
            rolesRepository.deleteById(id);
            return true;
        }else {
        return false;
        }
    }


}
