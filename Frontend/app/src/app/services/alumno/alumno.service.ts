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

  // Listar todos los alumnos
  listarAlumnos(): Observable<AlumnoResponse[]> {
    return this.http.get<AlumnoResponse[]>(this.apiUrl);
  }


  // 2️⃣ Obtener alumno completo por ID
  obtenerAlumnoPorId(id: number): Observable<AlumnoDTO> {
    return this.http.get<AlumnoDTO>(`${this.apiUrl}/${id}`);
  }

  // 3️⃣ Crear alumno
  crearAlumno(alumno: AlumnoDTO): Observable<AlumnoDTO> {
    return this.http.post<AlumnoDTO>(this.apiUrl, alumno);
  }

  // 4️⃣ Actualizar alumno
  actualizarAlumno(id: number, alumno: AlumnoDTO): Observable<AlumnoDTO> {
    return this.http.put<AlumnoDTO>(`${this.apiUrl}/alumnos/${id}`, alumno);
  }

  // 5️⃣ Eliminar alumno
  eliminarAlumno(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
