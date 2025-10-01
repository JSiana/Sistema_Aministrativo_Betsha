import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface Roles {
  id?: number;
  nombreRol: string;
  descripcion: string;
  estado?: boolean;
}


@Injectable({
  providedIn: 'root'
})
export class RolesService {

  private apiUrl = 'http://localhost:8080/api/roles';

  constructor(private http: HttpClient) { }

  listarRoles(): Observable<Roles[]> {
    return this.http.get<Roles[]>(this.apiUrl);
  }

  crearRol(rol: Roles): Observable<Roles> {
    return this.http.post<Roles>(this.apiUrl, rol);
  }

  desactivarRol(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/desactivar/${id}`, {});

  }

  modificarRol(rol: Roles): Observable<Roles> {
    return this.http.put<Roles>(`${this.apiUrl}/${rol.id}`, rol);
  }


}
