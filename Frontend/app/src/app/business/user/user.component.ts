import { Component } from '@angular/core';
import { Usuarios, UsuarioServiceService } from '../../services/usuario/usuario-service.service';
import { Roles, RolesService } from '../../services/roles.service';
import Swal from 'sweetalert2';
import { isNgContainer } from '@angular/compiler';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: false,
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent {

  usuarios: Usuarios[] = [];
  roles: Roles[] = [];
  rolSeleccionadoId: number | null = null;
  mensajeError: string = '';
  mensajeExito: string | null = null;

  constructor(
    private usuarioService: UsuarioServiceService,
    private rolesService: RolesService,
    private router: Router
  ) {

  }

  usuarioSeleccionado: Usuarios | null = null;


  mostrarFormulario: boolean = false;


  abrirFormulario() {
    this.usuarioSeleccionado = { usuario: '', nombre: '', email: '', rolNombre: '' };
    this.mostrarFormulario = true;
    this.rolSeleccionadoId =null;
  }

  abrirFormularioEdicion(usuario: Usuarios) {
    this.usuarioSeleccionado = { ...usuario };
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  ngOnInit(): void {
    this.cargarUsuarios();
    this.cargarRoles();
  }

  cargarRoles(): void {
    this.rolesService.listarRoles().subscribe({
      next: (data) => {
        this.roles = data;
      },
      error: (e) => {
        this.mensajeError = ' Error al cargar usuarios';
        console.log(e);
      }
    });
  }

  cargarUsuarios(): void {
    this.usuarioService.listarUsuarios().subscribe({
      next: (data) => {
        this.cerrarFormulario;
        this.usuarios = data;
      },
      error: (e) => {
      
      if (e.status === 403) {
        Swal.fire({
          icon: 'error',
          title: 'Acceso denegado',
          text: 'No tienes permiso para ver esta sección',
          confirmButtonText: 'Aceptar'
        }).then(() => {
          this.router.navigate(['/dashboard']);
        });
      } else {
        this.mensajeError = 'Error al cargar los usuarios';
        console.log(e);
      }
    }
    });

  }

  guardarUsuario(): void {
    if (!this.usuarioSeleccionado) return;




    if (this.rolSeleccionadoId != null) {  // ni null ni undefined
      this.usuarioSeleccionado.rolId = this.rolSeleccionadoId;
    } else {
      // Opcional: manejar error o asignar un valor por defecto
      Swal.fire({
        icon: 'info',
        text: 'No se ha seleccionado el ROL',
      });
      return;
    }

    const usuarioEnviar = {
      usuario: this.usuarioSeleccionado.usuario,
      nombre: this.usuarioSeleccionado.nombre,
      email: this.usuarioSeleccionado.email,
      rolId: this.usuarioSeleccionado.rolId,
      contrasenia: this.usuarioSeleccionado.contrasenia
    }

    console.log('datos', usuarioEnviar);

    if (this.usuarioSeleccionado.id) {

    } else {
      this.usuarioService.crearUsuario(usuarioEnviar).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            text:'El usuario se creo correctamente',
            showCancelButton: false
          });
          this.cargarUsuarios();
          this.cerrarFormulario();
        },
        error: (e) => {
          console.error('Error al crear usuario', e);
          if (e.status === 409){
            Swal.fire({
              icon: 'error',
              text: e.error || 'El nombre de Usuario o Email ya esta registrado',
            });
          } else{
            Swal.fire({
              icon: 'error',
              text: 'Ocurrio un error inesperado, intentelo de nuevo',
            });
          }
        }
      })
    }
  }

}
