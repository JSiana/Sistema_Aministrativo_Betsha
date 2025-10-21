package com.example.demo.service.implementacion;

import com.example.demo.dto.EncargadoDTO;
import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.dto.UsuarioResponseDTO;
import com.example.demo.mapper.EncargadoMapper;
import com.example.demo.model.Encargados;
import com.example.demo.repository.EncargadoRepository;
import com.example.demo.service.EncargadoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class EncargadoServiceImpl implements EncargadoService {

    private final EncargadoRepository encargadoRepository;



    public EncargadoServiceImpl(EncargadoRepository encargadoRepository){
        this.encargadoRepository = encargadoRepository;

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
}
