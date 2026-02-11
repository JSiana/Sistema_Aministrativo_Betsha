import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagoDTO, PagoResponseDTO } from '../../models/pago.model';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  // URL base general
  private readonly BASE_URL = 'http://localhost:8080/api';
  
  // URL específica para pagos
  private readonly PAGO_API = `${this.BASE_URL}/pagos`;

  constructor(private http: HttpClient) { }

  /**
   * Registra un nuevo pago
   */
  registrarPago(pago: PagoDTO): Observable<PagoResponseDTO> {
    return this.http.post<PagoResponseDTO>(this.PAGO_API, pago);
  }

  /**
   * Obtiene todos los pagos de un alumno
   */
  obtenerHistorial(alumnoGrupoId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.PAGO_API}/historial/${alumnoGrupoId}`);
  }

  /**
   * Obtiene el nombre del último mes que el alumno canceló
   */
  obtenerUltimoMes(alumnoGrupoId: number): Observable<string> {
    return this.http.get(`${this.PAGO_API}/ultimo-mes/${alumnoGrupoId}`, { responseType: 'text' });
  }

  /**
   * CORRECCIÓN FINAL: 
   * Quitamos la 's' para que sea 'alumno-grupo' igual que tu Java Controller
   */
  obtenerInfoBanner(id: number): Observable<any> {
    return this.http.get(`${this.BASE_URL}/alumno-grupo/${id}/detalle-banner`);
  }
}
