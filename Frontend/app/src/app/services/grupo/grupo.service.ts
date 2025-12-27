import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GrupoResponse } from '../../models/grupo';

@Injectable({
  providedIn: 'root'
})
export class GrupoService {

  private apiUrl = 'http://localhost:8080/api/grupos';


  constructor(private http: HttpClient) { }

  listarGrupos(): Observable<GrupoResponse[]>{
    return this.http.get<GrupoResponse[]>(this.apiUrl);
  }
}
