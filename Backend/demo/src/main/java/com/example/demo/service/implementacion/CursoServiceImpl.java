package com.example.demo.service.implementacion;

import com.example.demo.model.Cursos;
import com.example.demo.repository.CursoRepository;
import com.example.demo.service.CursoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CursoServiceImpl implements CursoService {

    @Autowired
    private CursoRepository cursoRepository;

    @Override
    public List<Cursos> listarCursos() {
        return cursoRepository.findAll();
    }

}
