import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface Usuarios {
  id?: number;
  usuario: string;
  nombre:string;
  email: string;
  rolId?: number;
  rolNombre?: string;
  estado?: boolean;
  contrasenia?: string;
}



@Injectable({
  providedIn: 'root'
})
export class UsuarioServiceService {

  private apiUrl = 'http://localhost:8080/api/usuarios';
  constructor(private http: HttpClient) {}


  listarUsuarios(): Observable<Usuarios[]> {
    return this.http.get<Usuarios[]>(this.apiUrl);
  }

  crearUsuario(usuario: Usuarios): Observable<Usuarios>{
    return this.http.post<Usuarios>(this.apiUrl, usuario);
  }

  login(usuario: string, contrasenia: string): Observable<any>{
    const loginData = {
      usuario: usuario,
      contrasenia: contrasenia
    };
    return this.http.post<any>(`${this.apiUrl}/login`,loginData);
  }

}
