import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlumnoResponse } from '../../models/alumno.model';
import { AlumnoDTO } from '../../models/alumno.model';


@Injectable({
  providedIn: 'root'
})
export class AlumnoService {
  private apiUrl = 'http://localhost:8080/api/alumnos';

  constructor(private http: HttpClient) { }

  /**
   * Obtiene la lista completa de alumnos registrados en el sistema.
   * 
   * @returns Observable que emite un arreglo de AlunoResponse con la informacion de todos los alunmos.
   */
  listarAlumnos(): Observable<AlumnoResponse[]> {
    return this.http.get<AlumnoResponse[]>(this.apiUrl);
  }


  /**
   * Obtiene la información compleeta de un alumno especifico por su ID.
   * 
   * @param id Identificador único del alumno.
   * @returns Observable que emite un AlumnoDTO con los datos de alumno solicitado.
   */
  obtenerAlumnoPorId(id: number): Observable<AlumnoDTO> {
    return this.http.get<AlumnoDTO>(`${this.apiUrl}/${id}`);
  }

  /**
   * Crea un nuevo alumno en el sistema.
   * 
   * @param alumno Datos del aluno a registrar (AlumnoDTO)
   * @returns Observable que emite el alumno creado con su informacion completa. 
   */

  crearAlumno(alumno: AlumnoDTO): Observable<AlumnoDTO> {
    return this.http.post<AlumnoDTO>(this.apiUrl, alumno);
  }

  /**
   * 
   * @param id Identificador único del alumno a actualizar.
   * @param alumno Datos actualizados del alumno (AlumnoDTO)
   * @returns Observable que emite el alumno actualizado.
   */
  actualizarAlumno(id: number, alumno: AlumnoDTO): Observable<AlumnoDTO> {
    return this.http.put<AlumnoDTO>(`${this.apiUrl}/${id}`, alumno);
  }

  /**
   * Elimina un alumno del sistema por ID
   * 
   * @param id Identificador único del alumno a eliminar
   * @returns Observable que completa cuando la eliminación ha sido exitosa
   */
  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
