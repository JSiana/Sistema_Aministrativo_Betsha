package com.example.demo.service.implementacion;

import com.example.demo.dto.PagoDTO;
import com.example.demo.dto.PagoResponseDTO;
import com.example.demo.model.AlumnoGrupo;
import com.example.demo.model.Pagos;
import com.example.demo.repository.AlumnoGrupoRepository;
import com.example.demo.repository.PagoRepository;
import com.example.demo.service.PagoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PagoServiceImpl implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private AlumnoGrupoRepository alumnoGrupoRepository;

    @Override
    @Transactional
    public PagoResponseDTO registrarPago(PagoDTO dto) {
        // 1. Validar que la asignación exista
        AlumnoGrupo asignacionActual = alumnoGrupoRepository.findById(dto.getAlumnoGrupoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No se encontró la asignación del alumno al grupo."));

        // 2. Lógica de Boleta Única (FILTRANDO SOLO ACTIVOS)
        List<Pagos> pagosActivosConBoleta = pagoRepository.findByNumeroBoletaAndActivoTrue(dto.getNumeroBoleta());

        if (!pagosActivosConBoleta.isEmpty()) {

            // REGLA A: No puede ser de otro alumno
            boolean esDeOtroAlumno = pagosActivosConBoleta.stream()
                    .anyMatch(p -> !p.getAlumnoGrupo().getAlumno().getId()
                            .equals(asignacionActual.getAlumno().getId()));

            if (esDeOtroAlumno) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "El número de boleta '" + dto.getNumeroBoleta() + "' ya fue registrado por otro alumno.");
            }

            // REGLA B: Si es COLEGIATURA, no puede repetir la boleta para el mismo mes
            if ("COLEGIATURA".equalsIgnoreCase(dto.getTipoPago())) {
                boolean boletaRepetidaEnMes = pagosActivosConBoleta.stream()
                        .anyMatch(p -> p.getMes().equalsIgnoreCase(dto.getMes()) &&
                                "COLEGIATURA".equalsIgnoreCase(p.getTipoPago()));

                if (boletaRepetidaEnMes) {
                    throw new ResponseStatusException(HttpStatus.CONFLICT,
                            "La boleta '" + dto.getNumeroBoleta() + "' ya fue utilizada para el pago de " + dto.getMes());
                }
            }
        }

        // 3. Lógica de Mes Único (SOLO PAGOS ACTIVOS)
        if ("COLEGIATURA".equalsIgnoreCase(dto.getTipoPago()) || "INSCRIPCION".equalsIgnoreCase(dto.getTipoPago())) {

            boolean yaExisteActivo = pagoRepository.existsByAlumnoGrupoIdAndMesAndTipoPagoAndActivoTrue(
                    dto.getAlumnoGrupoId(),
                    dto.getMes(),
                    dto.getTipoPago().toUpperCase() // Buscamos el tipo que viene en el formulario
            );

            if (yaExisteActivo) {
                throw new ResponseStatusException(HttpStatus.CONFLICT,
                        "El alumno ya tiene una " + dto.getTipoPago().toUpperCase() + " ACTIVA registrada para el mes de " + dto.getMes());
            }
        }

        // 4. Mapeo de DTO a Entidad Pagos
        Pagos nuevoPago = new Pagos();
        nuevoPago.setAlumnoGrupo(asignacionActual);
        nuevoPago.setTipoPago(dto.getTipoPago());
        nuevoPago.setMonto(dto.getMonto());
        nuevoPago.setMes(dto.getMes().toUpperCase());
        nuevoPago.setNumeroBoleta(dto.getNumeroBoleta());
        nuevoPago.setMora(dto.getMora() != null ? dto.getMora() : BigDecimal.ZERO);
        nuevoPago.setObservaciones(dto.getObservaciones());

        // Inicialización de campos de auditoría y estado
        nuevoPago.setActivo(true);
        nuevoPago.setMotivoAnulacion(null);
        nuevoPago.setFechaEliminacion(null);

        // 5. Guardar
        Pagos guardado = pagoRepository.save(nuevoPago);

        // 6. Respuesta
        BigDecimal totalCalculado = guardado.getMonto().add(guardado.getMora());

        return new PagoResponseDTO(
                guardado.getId(),
                asignacionActual.getAlumno().getPrimerNombre() + " " + asignacionActual.getAlumno().getPrimerApellido(),
                asignacionActual.getAlumno().getCodigoPersonal(),
                asignacionActual.getGrupo().getCurso().getNombre(),
                guardado.getTipoPago(),
                guardado.getMonto(),
                guardado.getMes(),
                guardado.getNumeroBoleta(),
                guardado.getMora(),
                guardado.getFechaPago(),
                totalCalculado,
                guardado.getMes(),
                guardado.getObservaciones(),
                guardado.getMotivoAnulacion(),
                guardado.getFechaEliminacion(),
                guardado.isActivo()
        );
    }

    @Override
    public List<Pagos> obtenerHistorialPorAsignacion(Long alumnoGrupoId) {
        // 1. Obtenemos la lista completa de la base de datos
        List<Pagos> historialCompleto = pagoRepository.findByAlumnoGrupoId(alumnoGrupoId);

        // 2. Filtramos usando Java Streams para quedarnos solo con los activos
        return historialCompleto.stream()
                .filter(pago -> pago.isActivo()) // O .filter(Pagos::isActivo)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional // Agregado para persistir los cambios del borrado lógico
    public void eliminarPago(Long id, String motivo) {
        Pagos pago = pagoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "El pago no ha sido encontrado en la base de datos"));

        // Intercepción del motivo (Validación de negocio)
        if (motivo == null || motivo.trim().isEmpty()){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Debe escribir el motivo de eliminación");
        }

        // Borrado Lógico
        pago.setActivo(false);
        pago.setMotivoAnulacion(motivo);
        pago.setFechaEliminacion(LocalDateTime.now());

        // Al estar en un método @Transactional, los cambios se guardan automáticamente al finalizar,
        // pero podemos usar save() para ser explícitos.
        pagoRepository.save(pago);
    }
}
