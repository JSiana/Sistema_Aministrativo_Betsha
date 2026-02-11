package com.example.demo.service.implementacion;

import com.example.demo.dto.AlumnoGrupoResponseDTO;
import com.example.demo.model.AlumnoGrupo;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Grupos;
import com.example.demo.repository.AlumnoGrupoRepository;
import com.example.demo.repository.AlumnoRepository;
import com.example.demo.repository.GrupoRepository;
import com.example.demo.service.AlumnoGrupoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class AlumnoGrupoServiceImpl implements AlumnoGrupoService {

    @Autowired
    private AlumnoGrupoRepository alumnoGrupoRepository;

    @Autowired
    private AlumnoRepository alumnoRepository;

    @Autowired
    private GrupoRepository grupoRepository;



    @Override
    public AlumnoGrupo asignarAlumno(Long grupoId, Long alumnoId) {
        Grupos grupo = grupoRepository.findById(grupoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Grupo no encontrado"));

        Alumnos alumno = alumnoRepository.findById(alumnoId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Alumno no encontrado"));

        // Verificar si ya está asignado
        boolean existe = alumnoGrupoRepository
                .findByGrupoId(grupoId)
                .stream()
                .anyMatch(ag -> ag.getAlumno().getId().equals(alumnoId));

        if (existe) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Alumno ya asignado a este grupo");
        }

        AlumnoGrupo ag = new AlumnoGrupo();
        ag.setAlumno(alumno);
        ag.setGrupo(grupo);

        return alumnoGrupoRepository.save(ag);
    }


    @Override
    public List<AlumnoGrupo> listarAlumnosPorGrupo(Long grupoId) {
        return alumnoGrupoRepository.findByGrupoId(grupoId);
    }

    @Override
    public List<AlumnoGrupo> listarGruposPorAlumno(Long alumnoId) {
        return alumnoGrupoRepository.findByAlumnoId(alumnoId);
    }

    @Override
    @Transactional
    public void quitarAlumno(Long grupoId, Long alumnoId) {
        // Buscamos el registro en la tabla intermedia alumno_grupo
        // que coincida con ese grupo y ese alumno
        AlumnoGrupo asignacion = alumnoGrupoRepository.findByGrupoId(grupoId)
                .stream()
                .filter(ag -> ag.getAlumno().getId().equals(alumnoId))
                .findFirst()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "El alumno no pertenece a este grupo"));

        // Borramos solo la relación, el alumno y el grupo siguen existiendo en sus tablas
        alumnoGrupoRepository.delete(asignacion);
    }

    public AlumnoGrupoResponseDTO obtenerDetalleBanner(Long id) {
        AlumnoGrupo ag = alumnoGrupoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asignación no encontrada con ID: " + id));

        AlumnoGrupoResponseDTO dto = new AlumnoGrupoResponseDTO();
        dto.setId(ag.getId());

        // Unir nombres y apellidos de forma limpia
        StringBuilder sb = new StringBuilder();
        appendIfPresent(sb, ag.getAlumno().getPrimerNombre());
        appendIfPresent(sb, ag.getAlumno().getSegundoNombre());
        appendIfPresent(sb, ag.getAlumno().getTercerNombre());
        appendIfPresent(sb, ag.getAlumno().getPrimerApellido());
        appendIfPresent(sb, ag.getAlumno().getSegundoApellido());

        dto.setNombreCompleto(sb.toString().trim());
        dto.setCodigoPersonal(ag.getAlumno().getCodigoPersonal());
        dto.setNombreCurso(ag.getGrupo().getCurso().getNombre());
        dto.setCodigoGrupo(ag.getGrupo().getCodigo());

        return dto;
    }

    // Método auxiliar para evitar espacios extras si un nombre es nulo
    private void appendIfPresent(StringBuilder sb, String text) {
        if (text != null && !text.trim().isEmpty()) {
            if (sb.length() > 0) sb.append(" ");
            sb.append(text.trim());
        }
    }

}
