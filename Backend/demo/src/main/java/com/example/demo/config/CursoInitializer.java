package com.example.demo.config;

import com.example.demo.model.Cursos;
import com.example.demo.repository.CursoRepository;
import org.hibernate.annotations.Comment;
import org.hibernate.annotations.Comments;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CursoInitializer implements CommandLineRunner {

    @Autowired
    private CursoRepository cursoRepository;

    @Override
    public void run(String... args){
        List<String> cursosPorDefecto = List.of(
                "Tecnologías del Aprendizaje y la Comunicación I",
                "Tecnologías del Aprendizaje y la Comunicación II",
                "Tecnologías del Aprendizaje y la Comunicación III",
                "Ténico Operador de Computadoras",

                "Técnico Programador de Computadoras",
                "Técnico en Mantenimiento y Reparación de Computadoras"
        );

        cursosPorDefecto.forEach(nombre -> {
            if (!cursoRepository.existsByNombre(nombre)){
                Cursos curso = new Cursos();
                curso.setNombre(nombre);
                curso.setEstado(true);
                cursoRepository.save(curso);
            }
        });

    }
}
