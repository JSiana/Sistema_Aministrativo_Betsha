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

            // CORRECCIÓN: Usar el ID de la fila de la nota, no el del alumno
            d.setIdTareaAlumno(n.getId());

            // Concatenación de nombres...
            String nombreFull = n.getAlumno().getPrimerNombre() +
                    (n.getAlumno().getSegundoNombre() != null ? " " + n.getAlumno().getSegundoNombre() : "");
            String apellidoFull = n.getAlumno().getPrimerApellido() +
                    (n.getAlumno().getSegundoApellido() != null ? " " + n.getAlumno().getSegundoApellido() : "");

            d.setNombreAlumno(nombreFull);
            d.setApellidoAlumno(apellidoFull);
            d.setNota(n.getNota());
            d.setObservacion(n.getObservacion());
            d.setFechaEntregada(n.getFechaEntregada());
            d.setTotalAcumulado(0.0);

            return d;
        }).collect(Collectors.toList());
    }

    // Actualizar una nota individual
    @Override
    @Transactional
    public void actualizarNotasMasivamente(List<PunteoResponseDTO> notasDtos) {
        for (PunteoResponseDTO dto : notasDtos) {
            if (dto.getIdTareaAlumno() != null) {
                tareaAlumnoRepository.findById(dto.getIdTareaAlumno()).ifPresent(entidad -> {
                    entidad.setNota(dto.getNota());
                    entidad.setObservacion(dto.getObservacion());
                    // No hace falta llamar a save() si @Transactional está funcionando bien,
                    // pero puedes ponerlo para estar seguro:
                    tareaAlumnoRepository.save(entidad);
                });
            }
        }
    }

}
