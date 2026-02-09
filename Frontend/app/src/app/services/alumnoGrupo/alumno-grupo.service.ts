import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AlumnoResponse } from '../../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class AlumnoGrupoService {


  private apiUrl = 'http://localhost:8080/api/alumno-grupo';

  constructor(
    private http: HttpClient
  ) { }

  asignarAlumno(grupoId: number, alumnoId: number): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${grupoId}/alumnos/${alumnoId}`, {});
  } 

  quitarAlumno(grupoId: number, alumnoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${grupoId}/alumnos/${alumnoId}`);
  }

  listarAlumnosDelGrupo(grupoId: number): Observable<AlumnoResponse[]> {
    return this.http.get<AlumnoResponse[]>(`${this.apiUrl}/${grupoId}/alumnos`);
  }

 

}
