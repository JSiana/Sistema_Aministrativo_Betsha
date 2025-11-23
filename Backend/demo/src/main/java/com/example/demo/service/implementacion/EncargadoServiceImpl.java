package com.example.demo.service.implementacion;

import com.example.demo.dto.ApiResponse;
import com.example.demo.dto.EncargadoDTO;
import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.mapper.EncargadoMapper;
import com.example.demo.model.Encargados;
import com.example.demo.repository.EncargadoRepository;
import com.example.demo.service.EncargadoService;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.Optional;
import lombok.extern.slf4j.Slf4j;


import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class EncargadoServiceImpl implements EncargadoService {

    private final EncargadoRepository encargadoRepository;



    public EncargadoServiceImpl(EncargadoRepository encargadoRepository){
        this.encargadoRepository = encargadoRepository;

    }

    @Override
    public boolean existeDpiEncargado(String dpiEncargado){
        return encargadoRepository.existsByDpi(dpiEncargado);
    }


    @Override
    public List<EncargadoResponseDTO> listarEncargados() {
         List<Encargados> encargadosList = encargadoRepository.findAll();

         return encargadosList.stream()
                 .map(EncargadoMapper::toResponseDTO)
                 .collect(Collectors.toList());
    }

    @Override
    public Encargados crearEncargado(Encargados encargados){
        return encargadoRepository.save(encargados);
    }

    @Override
    public EncargadoDTO obtenerEncargadoPorId(Long id){
        Encargados encargado = encargadoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Encargado no encontrado"));

        EncargadoDTO dto = new EncargadoDTO();
        dto.setId(encargado.getId());
        dto.setDpi(encargado.getDpi());
        dto.setNombres(encargado.getNombres());
        dto.setApellidos(encargado.getApellidos());
        dto.setTelefono(encargado.getTelefono());
        dto.setDireccion(encargado.getDireccion());
        dto.setEstado(encargado.getEstado());

        return dto;
    }

    @Override
    public EncargadoResponseDTO actualizarEncargado(Long id, EncargadoDTO dto) {



        Encargados encargado = encargadoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Encargado no encontrado con ID: " + id));


        // Validar DPI duplicado
        Optional<Encargados> otro = encargadoRepository.findByDpi(dto.getDpi());


        if (otro.isPresent() && !otro.get().getId().equals(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "El DPI del encargado ya está registrado");
        }

        // Actualizar campos
        encargado.setDpi(dto.getDpi());
        encargado.setNombres(dto.getNombres());
        encargado.setApellidos(dto.getApellidos());
        encargado.setTelefono(dto.getTelefono());
        encargado.setDireccion(dto.getDireccion());

        encargadoRepository.save(encargado);

        return new EncargadoResponseDTO(encargado);
    }


    @Override
    public ApiResponse eliminarEncargado(Long id) {
        try {
            if (encargadoRepository.existsById(id)) {
                encargadoRepository.deleteById(id);
                log.info("Encargado con ID {} eliminado correctamente", id);
                return new ApiResponse(true, "Encargado eliminado correctamente");
            } else {
                log.warn("No se encontró encargado con ID {}", id);
                return new ApiResponse(false, "El encargado con ID " + id + " no existe");
            }
        } catch (Exception e) {
            log.error("Error eliminando encargado con ID {}: {}", id, e.getMessage());
            return new ApiResponse(false, "Ocurrió un error al eliminar el encargado");
        }
    }

}
