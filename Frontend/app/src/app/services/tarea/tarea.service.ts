import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { PunteoAlumno, PunteoUpdateRequest, Tarea } from '../../models/tarea.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TareaService {

  // Ajusta esta URL según tu configuración de Spring Boot
  private readonly API_URL = 'http://localhost:8080/api';

  constructor(private http: HttpClient) { }

  // --- MÉTODOS PARA LA PESTAÑA "DETALLES" ---

  /**
   * Crea una nueva tarea y genera automáticamente los registros 
   * de punteo para los alumnos en el Backend.
   */
  crear(tarea: Tarea): Observable<Tarea> {
    return this.http.post<Tarea>(`${this.API_URL}/tareas/crear`, tarea);
  }

  /**
   * Obtiene la lista de tareas filtradas por grupo y bimestre.
   */
  listarPorGrupoYBimestre(idGrupo: number, bimestre: number): Observable<Tarea[]> {
    return this.http.get<Tarea[]>(`${this.API_URL}/tareas/grupo/${idGrupo}/bimestre/${bimestre}`);
  }

  /**
   * Elimina una tarea y sus calificaciones asociadas.
   */
  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/tareas/${id}`);
  }

  // --- MÉTODOS PARA LA PESTAÑA "LISTADO Y PUNTEOS" ---

  /**
   * Obtiene la lista de alumnos con sus notas para una tarea específica.
   */
  obtenerNotasPorTarea(idTarea: number): Observable<PunteoAlumno[]> {
    return this.http.get<PunteoAlumno[]>(`${this.API_URL}/notas-tareas/tarea/${idTarea}`);
  }

  /**
   * Actualiza las notas, observaciones y fechas de forma masiva.
   */
  actualizarNotasMasivo(notas: PunteoUpdateRequest[]): Observable<string> {
    return this.http.put(`${this.API_URL}/notas-tareas/actualizar-masivo`, notas, { responseType: 'text' });
  }
}
