import { HttpClient } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private API_LOGIN = 'http://localhost:8080/api/usuarios/login';
  private TOKEN_KEY = 'token';

  constructor(
    private http: HttpClient,
    private router: Router // Inyecta el Router
  ) { }

  login(usuario: string, contrasenia: string): Observable<any> {
    const body = { usuario, contrasenia };
    return this.http.post<any>(this.API_LOGIN, body).pipe(
      tap(res => {
        const token = res?.token ?? res?.jwt ?? res?.accessToken;
        if (token) {
          this.setToken(token);
        }
        localStorage.setItem('usuario', JSON.stringify(res));
      })
    );
  }

  setToken(token: string) {
    if (token) localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // --- CORRECCIÓN AQUÍ ---
  logout() {
    localStorage.removeItem(this.TOKEN_KEY); // Borra el token
    localStorage.removeItem('usuario');     // Borra los datos del usuario
    this.router.navigate(['/login']);       // ¡Redirige al login!
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    // Validación extra: Si el token está corrupto o expirado
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return (payload.exp * 1000) > Date.now();
    } catch (e) {
      return false;
    }
  }

}
