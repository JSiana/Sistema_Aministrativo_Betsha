import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EncargadoResponse } from '../../models/encargado.model';

@Injectable({
  providedIn: 'root'
})
export class EncargadoService {

  private apiUrl = 'http://localhost:8080/api/encargados';

  constructor(private http: HttpClient) { }

  

  // Listar encargados
  listarEncargado(): Observable<EncargadoResponse[]>{
    return this.http.get<EncargadoResponse[]>(this.apiUrl);
  }

}
