package com.example.demo.service.implementacion;

import com.example.demo.dto.PunteoResponseDTO;
import com.example.demo.dto.PunteoUpdateRequestDTO;
import com.example.demo.model.TareaAlumnos;
import com.example.demo.repository.TareaAlumnoRepository;
import com.example.demo.service.TareaAlumnoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class TareaAlumnoServiceImpl implements TareaAlumnoService {

    @Autowired
    private TareaAlumnoRepository tareaAlumnoRepository;

    // Listar alumnos y sus notas para una tarea específica
    @Override
    public List<PunteoResponseDTO> listarNotasPorTarea(Long idTarea) {
        List<TareaAlumnos> notas = tareaAlumnoRepository.findByTareaId(idTarea);

        return notas.stream().map(n -> {
            PunteoResponseDTO d = new PunteoResponseDTO();
            d.setIdTareaAlumno(n.getId());
            d.setNombreAlumno(n.getAlumno().getPrimerNombre() + " " + n.getAlumno().getSegundoNombre());
            d.setApellidoAlumno(n.getAlumno().getPrimerApellido() + " " + n.getAlumno().getSegundoApellido());
            d.setNota(n.getNota());
            d.setObservacion(n.getObservacion());
            d.setFechaEntregada(n.getFechaEntregada());
            return d;
        }).collect(Collectors.toList());
    }

    // Actualizar una nota individual
    @Override
    @Transactional
    public void actualizarNotasMasivamente(List<PunteoUpdateRequestDTO> dtos) {
        for (PunteoUpdateRequestDTO dto : dtos) {
            TareaAlumnos nota = tareaAlumnoRepository.findById(dto.getIdTareaAlumno())
                    .orElseThrow(() -> new RuntimeException("Nota no encontrada id: " + dto.getIdTareaAlumno()));

            nota.setNota(dto.getNota());
            nota.setObservacion(dto.getObservacion());
            nota.setFechaEntregada(dto.getFechaEntregada());

            tareaAlumnoRepository.save(nota);
        }
    }

}
