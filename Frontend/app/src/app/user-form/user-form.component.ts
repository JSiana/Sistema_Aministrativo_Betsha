import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService } from '../services/auth/auth.service';

@Component({
  selector: 'app-user-form',
  standalone: false,
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  user = { usuario: '', contrasenia: '' };
  errorMensaje = '';
  showPassword: boolean = false;
  disableLogin: boolean = false;


  private apiUrl = 'http://localhost:8080/api/usuarios';

  constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  disableLoginTemporarily() {
    this.disableLogin = true;
    setTimeout(() => {
      this.disableLogin = false;
    }, 15 * 60 * 1000); // 15 minutos
  }


  onSubmit() {
    if (this.disableLogin) {
      Swal.fire({
        icon: 'error',
        title: 'Login bloqueado',
        text: 'Has superado el número máximo de intentos fallidos. Intenta más tarde.'
      });
      return;
    }


    const username = this.user.usuario?.trim();
    const password = this.user.contrasenia;

    // Validación: campos vacíos
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor asegúrate de llenar todos los campos.'
      });
      return;
    }

    // Validación: longitud mínima
    if (username.length < 4) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario inválido',
        text: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.'
      });
      return;
    }

    // Validación: sin espacios
    if (username.includes(' ')) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario inválido',
        text: 'El nombre de usuario no puede contener espacios.'
      });
      return;
    }


    // Validación: caracteres válidos
    const regex = /^[a-zA-Z0-9_-]+$/;
    if (!regex.test(username)) {
      Swal.fire({
        icon: 'warning',
        title: 'Usuario inválido',
        text: 'El nombre de usuario solo puede contener letras, números, guiones y guiones bajos.'
      });
      return;
    }

    // Si todo pasa, actualizar el valor sin espacios
    this.user.usuario = username;

    // Enviar login al backend
    // ✅ Usamos AuthService ahora
    this.authService.login(this.user.usuario, this.user.contrasenia).subscribe({
      next: (res) => {
        console.log('Login exitoso', res);



        Swal.fire({
          icon: 'success',
          title: 'Bienvenido',
          text: `Hola ${res.nombre}, has iniciado sesión correctamente!`,
          timer: 2000,
          showConfirmButton: false
        });

        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        console.error('Error en login', err);

        if (err.status === 423) {
          Swal.fire({ icon: 'error', title: 'Usuario bloqueado', text: err.error || 'Tu cuenta está temporalmente bloqueada.' });
          this.disableLoginTemporarily?.();
          return;
        }

        if (err.status === 401) {
          Swal.fire({ icon: 'error', title: 'Credenciales inválidas', text: 'Usuario o contraseña incorrectos.' });
          return;
        }

        if (err.status === 403) {
          Swal.fire({ icon: 'error', title: 'Acceso denegado', text: 'No tienes permisos o el token es inválido.' });
          return;
        }

        Swal.fire({ icon: 'error', title: 'Error', text: err.error?.message || 'Ocurrió un problema al iniciar sesión.' });
      }

    });
  }



}
