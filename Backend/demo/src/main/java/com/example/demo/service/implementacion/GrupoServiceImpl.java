package com.example.demo.service.implementacion;

import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.dto.GrupoDTO;
import com.example.demo.dto.GrupoResponseDTO;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Cursos;
import com.example.demo.model.Grupos;
import com.example.demo.repository.AlumnoGrupoRepository;
import com.example.demo.repository.AlumnoRepository;
import com.example.demo.repository.CursoRepository;
import com.example.demo.repository.GrupoRepository;
import com.example.demo.service.GrupoService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
public class GrupoServiceImpl implements GrupoService {


    @Autowired
    private GrupoRepository grupoRepository;

    @Autowired
    private CursoRepository cursoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private AlumnoGrupoRepository alumnoGrupoRepository;

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
        grupo.setCicloEscolar(dto.getCicloEscolar());

        return grupoRepository.save(grupo);
    }

    @Override
    public List<GrupoResponseDTO> listarPorCiclo(String cicloEscolar) {

        List<Grupos> grupos = grupoRepository.findByCicloEscolar(cicloEscolar);
        List<GrupoResponseDTO> respuesta = new ArrayList<>();

        for (Grupos grupo : grupos) {

            GrupoResponseDTO dto = new GrupoResponseDTO();
            dto.setId(grupo.getId());
            dto.setCodigo(grupo.getCodigo());
            dto.setCurso(grupo.getCurso().getNombre());
            dto.setJornada(grupo.getJornada());
            dto.setHorario(grupo.getHorario());
            dto.setDia(grupo.getDia());
            dto.setCicloEscolar(grupo.getCicloEscolar());

            // Contar alumnos usando AlumnoGrupo
            int cantidadAlumnos = alumnoGrupoRepository.countByGrupoId(grupo.getId());
            dto.setCantidadAlumnos(cantidadAlumnos);

            respuesta.add(dto);
        }

        return respuesta;
    }

    private String generarCodigoGrupo() {
        String prefijo = "GRP-";
        String anioActual = String.valueOf(LocalDate.now().getYear()).substring(2);

        String ultimoCodigo = grupoRepository.findLastCodigo();

        int correlativo = 1;

        if (ultimoCodigo != null && ultimoCodigo.startsWith(prefijo + anioActual)) {
            correlativo = Integer.parseInt(ultimoCodigo.substring(6)) + 1;
        }

        return prefijo + anioActual + String.format("%02d", correlativo);
    }

    @Override
    public GrupoResponseDTO obtenerGrupoPorId(Long id) {

        Grupos grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Grupo no encontrado"
                ));

        int cantidadAlumnos = alumnoGrupoRepository.countByGrupoId(grupo.getId());

        return new GrupoResponseDTO(
                grupo.getId(),
                grupo.getCodigo(),
                grupo.getCurso().getNombre(),
                grupo.getJornada(),
                grupo.getHorario(),
                grupo.getDia(),
                grupo.getCicloEscolar(),
                cantidadAlumnos
        );
    }


    @Override
    public void eliminarGrupo(Long id) {
        Grupos grupo = grupoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Grupo no encontrado"
                ));

        // Validar si tiene alumnos asignados usando AlumnoGrupo
        if (alumnoGrupoRepository.existsByGrupoId(grupo.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede eliminar el grupo porque tiene alumnos asignados. Elimine primero a los alumnos"
            );
        }

        grupoRepository.deleteById(id);
    }

}
