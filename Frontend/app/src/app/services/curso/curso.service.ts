import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CursoResponseDTO } from '../../models/curso';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class CursoService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:8080/api/cursos';


  listarCursos(): Observable<CursoResponseDTO[]> {
    return this.http.get<CursoResponseDTO[]>(this.apiUrl);
  }

}
