import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupoDTO, GrupoResponse } from '../../models/grupo';
import { AlumnoResponse } from '../../models/alumno.model';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private apiUrl = 'http://localhost:8080/api/grupos';


  constructor(private http: HttpClient) { }

  listarGrupos(): Observable<GrupoResponse[]> {
    return this.http.get<GrupoResponse[]>(this.apiUrl);
  }


  obtenerGrupoPorId(id: number): Observable<GrupoResponse> {
    return this.http.get<GrupoResponse>(`${this.apiUrl}/${id}`);
  }

  asignarAlumno(grupoId: number, alumnoId: number): Observable<void> {
    return this.http.post<void>(
      `${this.apiUrl}/${grupoId}/alumnos/${alumnoId}`,
      {}
    );
  }


  quitarAlumno(grupoId: number, alumnoId: number): Observable<any> {
    return this.http.delete(
      `${this.apiUrl}/${grupoId}/alumnos/${alumnoId}`,
      { observe: 'response'}
    );
  }


  listarAlumnosDelGrupo(grupoId: number): Observable<AlumnoResponse[]> {
    return this.http.get<AlumnoResponse[]>(
      `${this.apiUrl}/${grupoId}/alumnos`
    );
  }

  crearGrupo(grupo: GrupoDTO) {
    return this.http.post<GrupoResponse>(this.apiUrl, grupo);
  }

  eliminarGrupo(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

}
