package com.example.demo.service.implementacion;

import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.dto.GrupoDTO;
import com.example.demo.dto.GrupoResponseDTO;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Cursos;
import com.example.demo.model.Grupos;
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

        return new GrupoResponseDTO(
                grupo.getId(),
                grupo.getCodigo(),
                grupo.getCurso().getNombre(),
                grupo.getJornada(),
                grupo.getHorario(),
                grupo.getDia(),
                grupo.getAlumnos() != null ? grupo.getAlumnos().size() : 0
        );
    }


    @Override
    public void asignarAlumno(Long grupoId, Long alumnoId){
        Grupos grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Grupo no encontrado"
                ));

        Alumnos alumno = alumnoRepository.findById(alumnoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Alumno no encontrado"
                ));


        if (alumno.getGrupos().contains(grupo)){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "El alumno ya está asignado a este grupo"
            );


        }
        alumno.getGrupos().add(grupo);
        grupo.getAlumnos().add(alumno);


        grupoRepository.save(grupo);
    }

    @Override
    public List<AlumnoResponseDTO> listarAlumnosDelGrupo(Long grupoId) {

        Grupos grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Grupo no encontrado"));

        return grupo.getAlumnos().stream()
                .map(AlumnoResponseDTO::new)
                .toList();
    }


    @Override
    public void quitarAlumno(Long grupoId, Long alumnoId){
        Grupos grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Grupo no encontrado"
                ));

        Alumnos alumno = alumnoRepository.findById(alumnoId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND, "Alumno no encontrado"
                ));

        /**
         * Validar que el alumno si este asignado al grupo
         */

        if (!alumno.getGrupos().contains(grupo)){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT, "EL alumno no está asignado a este grupo"
            );
        }

        /**
         * Quitar relación
         */

        alumno.getGrupos().remove(grupo);
        grupo.getAlumnos().remove(alumno);

        /**
         * Guardar cambios
         */

        grupoRepository.save(grupo);


    }

    @Override
    public void eliminarGrupo(Long id){
        Grupos grupo = grupoRepository.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(
                                HttpStatus.NOT_FOUND, "Grupo no encontrado"
                        ));
        /**
         * Validar si tiene alumnos asignados
         */

        if (!grupo.getAlumnos().isEmpty()){
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se puede eliminar el grupo porque tiene alumnos asignados. Elimine primero a los alumnos"
            );
        }
        grupoRepository.deleteById(id);
    }


}
