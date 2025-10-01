import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_LOGIN = 'http://localhost:8080/api/usuarios/login'; 
  private TOKEN_KEY = 'token';

  constructor(private http: HttpClient) { }

   login(usuario: string, contrasenia: string): Observable<any> {
    const body = {
      usuario: usuario,
      contrasenia: contrasenia
    };
    return this.http.post<any>(this.API_LOGIN, body).pipe(
      tap(res => {
        const token = res?.token ?? res?.jwt ?? res?.accessToken;
        if(token){
          localStorage.setItem(this.TOKEN_KEY, token);
        }
        localStorage.setItem('usuario', JSON.stringify(res));
      })
    )
  }

  setToken(token: string){
    if(token) localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null{
    return localStorage.getItem(this.TOKEN_KEY);
  }

  logout(){
    return localStorage.getItem(this.TOKEN_KEY);
  }

  isAuthenticated(): boolean{
    return !!this.getToken();
  }

}
