import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth/auth.service';
import { Observable, throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  
  constructor(
    private authService: AuthService,
    private http: HttpClient // Necesario para llamar al refresh
  ) {}

 intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  if (req.url.includes('/login') || req.url.includes('/refresh')) {
    return next.handle(req);
  }

  const token = this.authService.getToken();

  if (token) {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000;
    const ahora = Date.now();

    // CASO 1: EL TOKEN YA EXPIRÓ (Pasaron los 3 minutos)
    if (ahora >= exp) {
      console.warn("Sesión expirada. Redirigiendo...");
      this.authService.logout(); // Este método debe borrar el token y hacer router.navigate(['/login'])
      return throwError(() => new Error('Sesión expirada'));
    }

    // CASO 2: ESTÁ POR EXPIRAR (Faltan menos de 30 segundos para los 3 min)
    if (exp - ahora < 120000) { 
      return this.http.post<any>('http://localhost:8080/api/usuarios/refresh', {}, {
        headers: { Authorization: `Bearer ${token}` }
      }).pipe(
        switchMap(res => {
          localStorage.setItem('token', res.token);
          const cloned = req.clone({ setHeaders: { Authorization: `Bearer ${res.token}` } });
          return next.handle(cloned);
        }),
        catchError(err => {
          // Si el servidor rechaza el refresco por cualquier motivo
          this.authService.logout();
          return throwError(() => err);
        })
      );
    }
    
    // CASO 3: EL TOKEN ES VÁLIDO Y TIENE TIEMPO
    const authReq = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    return next.handle(authReq);
  }

  return next.handle(req);
}
}