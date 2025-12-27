package com.example.demo.service.implementacion;

import com.example.demo.dto.GrupoDTO;
import com.example.demo.dto.GrupoResponseDTO;
import com.example.demo.model.Cursos;
import com.example.demo.model.Grupos;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.GrupoRepository;
import com.example.demo.service.GrupoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
public class GrupoServiceImpl implements GrupoService {


    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Override
    public Grupos crearGrupo(GrupoDTO dto) {



        Cursos curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.BAD_REQUEST,
                        "Curso no válido"
                ));

        Grupos grupo = new Grupos();

        // GENERAR CÓDIGO AUTOMÁTICO
        String codigoGenerado = generarCodigoGrupo();

        // (Opcional pero recomendado)
        if (grupoRepository.existsByCodigo(codigoGenerado)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Error al generar el código del grupo"
            );
        }

        grupo.setCodigo(codigoGenerado);
        grupo.setCurso(curso);
        grupo.setJornada(dto.getJornada());
        grupo.setHorario(dto.getHorario());
        grupo.setDia(dto.getDia());

        return grupoRepository.save(grupo);
    }

    @Override
    public List<GrupoResponseDTO> listarGrupo() {

        List<Grupos> grupos = grupoRepository.findAll();
        List<GrupoResponseDTO> respuesta = new ArrayList<>();





        for (Grupos grupo : grupos) {

            GrupoResponseDTO dto = new GrupoResponseDTO();
            dto.setId(grupo.getId());
            dto.setCodigo(grupo.getCodigo());
            dto.setCurso(grupo.getCurso().getNombre());
            dto.setJornada(grupo.getJornada());
            dto.setHorario(grupo.getHorario());
            dto.setDia(grupo.getDia());
            dto.setCantidadAlumnos(
                    grupo.getAlumnos() != null ? grupo.getAlumnos().size() : 0
            );

            respuesta.add(dto);
        }

        return respuesta;
    }


    private String generarCodigoGrupo() {
        String prefijo = "GRP";

        // Año actual (2 dígitos)
        String anio = String.valueOf(LocalDate.now().getYear()).substring(2);

        String ultimoCodigo = grupoRepository.findLastCodigo();

        int correlativo = 1;

        if (ultimoCodigo != null) {
            // GRP-2601 → 01
            correlativo = Integer.parseInt(ultimoCodigo.substring(6)) + 1;
        }

        return prefijo + "-" + anio + String.format("%02d", correlativo);
    }
}
