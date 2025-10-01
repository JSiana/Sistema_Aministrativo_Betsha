package com.example.demo.service.implementacion;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.mapper.AlumnoMapper;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Encargados;
import com.example.demo.repository.AlumnoRepository;
import com.example.demo.repository.EncargadoRepository;
import com.example.demo.service.AlumnoService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AlumnoServiceImpl implements AlumnoService {

    private final AlumnoRepository alumnoRepository;

    public AlumnoServiceImpl(AlumnoRepository alumnoRepository){
        this.alumnoRepository = alumnoRepository;
    }

    @Override
    public List<AlumnoResponseDTO> listarAlumnos() {
        List<Alumnos> alumnos = alumnoRepository.findAll();

        return alumnoRepository.findAll()
                .stream()
                .map(AlumnoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    @Override
    public AlumnoDTO obtenerAlumnoPorId(Long id) {
        Alumnos alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        AlumnoDTO dto = new AlumnoDTO();
        dto.setId(alumno.getId());
        dto.setCodigoPersonal(alumno.getCodigoPersonal());
        dto.setPrimerNombre(alumno.getPrimerNombre());
        dto.setSegundoNombre(alumno.getSegundoNombre());
        dto.setTercerNombre(alumno.getTercerNombre());
        dto.setPrimerApellido(alumno.getPrimerApellido());
        dto.setSegundoApellido(alumno.getSegundoApellido());
        dto.setEmail(alumno.getEmail());
        dto.setFechaNacimiento(alumno.getFechaNacimiento());
        dto.setUltimoGrado(alumno.getUltimoGrado());
        dto.setTelefono(alumno.getTelefono());
        dto.setEstado(alumno.getEstado());
        dto.setIdEncargado(alumno.getEncargado().getId());
        dto.setNombreEncargado(alumno.getEncargado().getNombres());
        dto.setApellidoEncargado(alumno.getEncargado().getApellidos());

        return dto;
    }


    @Override
    public AlumnoDTO actualizarAlumno(Long id, AlumnoDTO alumnoDTO) {
        Alumnos alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Alumno no encontrado"));

        // Actualizamos campos
        alumno.setCodigoPersonal(alumnoDTO.getCodigoPersonal());
        alumno.setPrimerNombre(alumnoDTO.getPrimerNombre());
        alumno.setSegundoNombre(alumnoDTO.getSegundoNombre());
        alumno.setTercerNombre(alumnoDTO.getTercerNombre());
        alumno.setPrimerApellido(alumnoDTO.getPrimerApellido());
        alumno.setSegundoApellido(alumnoDTO.getSegundoApellido());
        alumno.setEmail(alumnoDTO.getEmail());
        alumno.setFechaNacimiento(alumnoDTO.getFechaNacimiento());
        alumno.setUltimoGrado(alumnoDTO.getUltimoGrado());
        alumno.setTelefono(alumnoDTO.getTelefono());
        alumno.setEstado(alumnoDTO.getEstado());

        // Actualizamos encargado si es necesario
        // suponiendo que tienes un metodo para buscar el encargado por id
        // Encargados encargado = encargadoRepository.findById(alumnoDTO.getIdEncargado())
        //        .orElseThrow(() -> new RuntimeException("Encargado no encontrado"));
        // alumno.setEncargado(encargado);

        alumnoRepository.save(alumno);

        // Convertimos a DTO para retornar
        AlumnoDTO dto = new AlumnoDTO();
        dto.setId(alumno.getId());
        dto.setCodigoPersonal(alumno.getCodigoPersonal());
        dto.setPrimerNombre(alumno.getPrimerNombre());
        dto.setSegundoNombre(alumno.getSegundoNombre());
        dto.setTercerNombre(alumno.getTercerNombre());
        dto.setPrimerApellido(alumno.getPrimerApellido());
        dto.setSegundoApellido(alumno.getSegundoApellido());
        dto.setEmail(alumno.getEmail());
        dto.setFechaNacimiento(alumno.getFechaNacimiento());
        dto.setUltimoGrado(alumno.getUltimoGrado());
        dto.setTelefono(alumno.getTelefono());
        dto.setEstado(alumno.getEstado());
        dto.setIdEncargado(alumno.getEncargado() != null ? alumno.getEncargado().getId() : 0L);

        return dto;
    }



}
