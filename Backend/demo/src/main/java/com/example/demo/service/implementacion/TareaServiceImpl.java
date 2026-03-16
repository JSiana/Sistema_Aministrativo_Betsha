package com.example.demo.service.implementacion;

import com.example.demo.dto.TareaDTO;
import com.example.demo.dto.TareaResponseDTO;
import com.example.demo.model.AlumnoGrupo;
import com.example.demo.model.Grupos;
import com.example.demo.model.TareaAlumnos;
import com.example.demo.model.Tareas;
import com.example.demo.repository.AlumnoGrupoRepository;
import com.example.demo.repository.GrupoRepository;
import com.example.demo.repository.TareaAlumnoRepository;
import com.example.demo.repository.TareaRepository;
import com.example.demo.service.TareaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TareaServiceImpl implements TareaService {

    @Autowired
    private TareaRepository tareaRepository;

    @Autowired
    private TareaAlumnoRepository tareaAlumnoRepository;

    @Autowired
    private AlumnoGrupoRepository alumnoGrupoRepository;

    @Autowired
    private GrupoRepository grupoRepository;

    @Override
    @Transactional
    public TareaResponseDTO crearTareaConPunteos(TareaDTO dto) {
        // 1. Crear la entidad Tarea desde el DTO
        Tareas tarea = new Tareas();
        tarea.setDescripcion(dto.getDescripcion());
        tarea.setBimestre(dto.getBimestre());
        tarea.setFechaEntrega(dto.getFechaEntrega());
        tarea.setPunteo(dto.getPunteo());


        if (dto.getIdGrupo() != null) {
            Grupos grupo = grupoRepository.findById(dto.getIdGrupo())
                    .orElseThrow(() -> new RuntimeException("Grupo no encontrado con ID: " + dto.getIdGrupo()));
            tarea.setGrupo(grupo); // Esto es lo que guarda el ID en la base de datos
        }


        Tareas tareaGuardada = tareaRepository.save(tarea);

        // 2. Buscar a todos los alumnos inscritos en ese grupo
        // Nota: Asegúrate de tener este método en tu AlumnoGrupoRepository
        List<AlumnoGrupo> inscripciones = alumnoGrupoRepository.findByGrupoId(dto.getIdGrupo());

        // 3. Crear automáticamente el registro de nota para cada alumno
        for (AlumnoGrupo registro : inscripciones) {
            TareaAlumnos notaInicial = new TareaAlumnos();
            notaInicial.setTarea(tareaGuardada);
            notaInicial.setAlumno(registro.getAlumno());
            notaInicial.setNota(0.0);
            notaInicial.setObservacion("");
            tareaAlumnoRepository.save(notaInicial);
        }

        // 4. Retornar el ResponseDTO
        TareaResponseDTO response = new TareaResponseDTO();
        response.setId(tareaGuardada.getId());
        response.setDescripcion(tareaGuardada.getDescripcion());
        response.setBimestre(tareaGuardada.getBimestre());
        response.setFechaEntrega(tareaGuardada.getFechaEntrega());
        response.setPunteo(tareaGuardada.getPunteo());

        return response;
    }


    @Override
    public List<TareaResponseDTO> listarTareasPorGrupoYBimestre(Long idGrupo, Integer bimestre) {
        return tareaRepository.findByGrupoIdAndBimestre(idGrupo, bimestre)
                .stream()
                .map(this::mapearATareaResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void eliminarTarea(Long id) {
        // Al eliminar la tarea, JPA eliminará las notas si configuraste CascadeType.ALL,
        // si no, bórralas manualmente aquí.
        tareaRepository.deleteById(id);
    }

    private TareaResponseDTO mapearATareaResponse(Tareas tarea) {
        TareaResponseDTO response = new TareaResponseDTO();
        response.setId(tarea.getId());
        response.setDescripcion(tarea.getDescripcion());
        response.setBimestre(tarea.getBimestre());
        response.setFechaEntrega(tarea.getFechaEntrega());
        response.setPunteo(tarea.getPunteo());
        return response;
    }

}
