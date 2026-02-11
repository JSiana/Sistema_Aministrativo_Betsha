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
import java.util.List;

@Service
public class PagoServiceImpl implements PagoService {

    @Autowired
    private PagoRepository pagoRepository;

    @Autowired
    private AlumnoGrupoRepository alumnoGrupoRepository;

    @Override
    @Transactional
    public PagoResponseDTO registrarPago(PagoDTO dto) {
        // 1. Validar que la asignación (Alumno-Grupo) exista
        AlumnoGrupo asignacionActual = alumnoGrupoRepository.findById(dto.getAlumnoGrupoId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "No se encontró la asignación del alumno al grupo."));

        // 2. Lógica de Boleta Única (Misma boleta solo permitida para el mismo alumno)
        List<Pagos> pagosConBoleta = pagoRepository.findByNumeroBoleta(dto.getNumeroBoleta());
        if (!pagosConBoleta.isEmpty()) {
            boolean esDeOtroAlumno = pagosConBoleta.stream()
                    .anyMatch(p -> !p.getAlumnoGrupo().getAlumno().getId()
                            .equals(asignacionActual.getAlumno().getId()));

            if (esDeOtroAlumno) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                        "El número de boleta '" + dto.getNumeroBoleta() + "' ya fue registrado por otro alumno.");
            }
        }

        // 3. Lógica de Mes Único (Evitar duplicidad de pago en el mismo grupo)
        if (pagoRepository.existsByAlumnoGrupoIdAndMes(dto.getAlumnoGrupoId(), dto.getMes())) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST,
                    "El alumno ya tiene un pago registrado para el mes de " + dto.getMes() + " en este curso.");
        }

        // 4. Mapeo de DTO a Entidad Pagos
        Pagos nuevoPago = new Pagos();
        nuevoPago.setAlumnoGrupo(asignacionActual);
        nuevoPago.setTipoPago(dto.getTipoPago()); // Desde PagoDTO
        nuevoPago.setMonto(dto.getMonto());
        nuevoPago.setMes(dto.getMes().toUpperCase());
        nuevoPago.setNumeroBoleta(dto.getNumeroBoleta());
        // Si la mora viene nula desde el front, le asignamos 0 para evitar errores en cálculos
        nuevoPago.setMora(dto.getMora() != null ? dto.getMora() : BigDecimal.ZERO);
        nuevoPago.setObservaciones(dto.getObservaciones());

        // 5. Guardar en Base de Datos (Aquí se dispara el @PrePersist de la fecha)
        Pagos guardado = pagoRepository.save(nuevoPago);

        // 6. Cálculo del Total (Monto + Mora)
        BigDecimal totalCalculado = guardado.getMonto().add(guardado.getMora());

        // 7. Construcción del PagoResponseDTO (Exactamente 12 argumentos)
        return new PagoResponseDTO(
                guardado.getId(),                                     // 1. id
                asignacionActual.getAlumno().getPrimerNombre() + " " +
                        asignacionActual.getAlumno().getPrimerApellido(),     // 2. alumnoNombre
                asignacionActual.getAlumno().getCodigoPersonal(),     // 3. alumnoCodigo
                asignacionActual.getGrupo().getCurso().getNombre(),   // 4. cursoNombre
                guardado.getTipoPago(),                               // 5. tipoPago
                guardado.getMonto(),                                  // 6. monto
                guardado.getMes(),                                    // 7. mes
                guardado.getNumeroBoleta(),                           // 8. numeroBoleta
                guardado.getMora(),                                   // 9. mora
                guardado.getFechaPago(),                              // 10. fechaPago (Generada automáticamente)
                totalCalculado,                                       // 11. totalPagado (Calculado arriba)
                guardado.getMes(),
                guardado.getObservaciones()// 12. ultimoMesPagado
        );
    }
    @Override
    public List<Pagos> obtenerHistorialPorAsignacion(Long alumnoGrupoId) {
        return pagoRepository.findByAlumnoGrupoId(alumnoGrupoId);
    }
}
