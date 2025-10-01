package com.example.demo.service.implementacion;

import com.example.demo.dto.EncargadoResponseDTO;
import com.example.demo.mapper.EncargadoMapper;
import com.example.demo.model.Encargados;
import com.example.demo.repository.EncargadoRepository;
import com.example.demo.service.EncargadoService;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EncargadoServiceImpl implements EncargadoService {

    private final EncargadoRepository encargadoRepository;

    public EncargadoServiceImpl(EncargadoRepository encargadoRepository){
        this.encargadoRepository = encargadoRepository;
    }

    @Override
    public List<EncargadoResponseDTO> listarEncargados() {
        return encargadoRepository.findAll()
                .stream()
                .map(EncargadoMapper::toResponseDTO)
                .toList();
    }

}
