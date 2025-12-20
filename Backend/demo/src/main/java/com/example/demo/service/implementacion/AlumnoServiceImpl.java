package com.example.demo.service.implementacion;

import com.example.demo.dto.AlumnoDTO;
import com.example.demo.dto.AlumnoResponseDTO;
import com.example.demo.mapper.AlumnoMapper;
import com.example.demo.model.Alumnos;
import com.example.demo.model.Encargados;
import com.example.demo.repository.AlumnoRepository;
import com.example.demo.repository.EncargadoRepository;
import com.example.demo.service.AlumnoService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.graphql.GraphQlProperties;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AlumnoServiceImpl implements AlumnoService {

    private final AlumnoRepository alumnoRepository;
    private final EncargadoRepository encargadoRepository;



    @Override
    public List<AlumnoResponseDTO> listarAlumnos() {
        List<Alumnos> alumnos = alumnoRepository.findAll();

        return alumnoRepository.findAll()
                .stream()
                .map(AlumnoMapper::toResponseDTO)
                .collect(Collectors.toList());
    }

    /**
     * Guardar Alumno
     */

    @Override
    public Alumnos guardarAlumno(AlumnoDTO dto){

        /**
         * Validar Codigo Personal para evitar Duplicidad
         */

        if (alumnoRepository.existsByCodigoPersonal(dto.getCodigoPersonal())){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El código personal ya está registrado");

        }

        if (dto.getIdEncargado() == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debe seleccionar un encargado"
            );
        }

        Encargados encargado = encargadoRepository.findById(dto.getIdEncargado())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Encargado no encontrado"
                ));

        Alumnos alumno = new Alumnos();
        alumno.setCodigoPersonal(dto.getCodigoPersonal());
        alumno.setPrimerNombre(dto.getPrimerNombre());
        alumno.setSegundoNombre(dto.getSegundoNombre());
        alumno.setTercerNombre(dto.getTercerNombre());
        alumno.setPrimerApellido(dto.getPrimerApellido());
        alumno.setSegundoApellido(dto.getSegundoApellido());
        alumno.setEmail(dto.getEmail());
        alumno.setFechaNacimiento(dto.getFechaNacimiento());
        alumno.setSexo(dto.getSexo());
        alumno.setUltimoGrado(dto.getUltimoGrado());
        alumno.setTelefono(dto.getTelefono());
        alumno.setEstado(dto.getEstado());
        alumno.setEncargado(encargado);


        return alumnoRepository.save(alumno);
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
        dto.setSexo(alumno.getSexo());
        dto.setUltimoGrado(alumno.getUltimoGrado());
        dto.setTelefono(alumno.getTelefono());
        dto.setEstado(alumno.getEstado());
        dto.setIdEncargado(alumno.getEncargado().getId());


        return dto;
    }


    @Override
    public AlumnoResponseDTO actualizarAlumno(Long id, AlumnoDTO alumnoDTO) {

        Alumnos alumno = alumnoRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                        "Alumno no encontrado con ID: " + id));

        /**
         * Validar Codigo Personal Duplicado
         */

        Optional<Alumnos> otro = alumnoRepository.findByCodigoPersonal(alumnoDTO.getCodigoPersonal());

        if(otro.isPresent() && !otro.get().getId().equals(id)){
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "El Codigo Personal ya está registrado");
        }

        Encargados encargado = encargadoRepository.findById(alumnoDTO.getIdEncargado())
                .orElseThrow(() -> new RuntimeException("Encargado no encontrado"));

        alumno.setCodigoPersonal(alumnoDTO.getCodigoPersonal());
        alumno.setPrimerNombre(alumnoDTO.getPrimerNombre());
        alumno.setSegundoApellido(alumnoDTO.getSegundoNombre());
        alumno.setTercerNombre(alumnoDTO.getTercerNombre());
        alumno.setPrimerApellido(alumnoDTO.getPrimerApellido());
        alumno.setSegundoApellido(alumnoDTO.getSegundoApellido());
        alumno.setEmail(alumnoDTO.getEmail());
        alumno.setFechaNacimiento(alumnoDTO.getFechaNacimiento());
        alumno.setSexo(alumnoDTO.getSexo());
        alumno.setUltimoGrado(alumnoDTO.getUltimoGrado());
        alumno.setTelefono(alumnoDTO.getTelefono());
        alumno.setEncargado(encargado);

        alumnoRepository.save(alumno);

        return new AlumnoResponseDTO(alumno);
    }

    @Override
    public void eliminarAlumno(Long id){
        if (!alumnoRepository.existsById(id)){
            throw new RuntimeException("Alumno no encontrado");
        }
        alumnoRepository.deleteById(id);
    }


}
