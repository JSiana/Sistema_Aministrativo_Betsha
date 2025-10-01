import { Component, OnInit } from '@angular/core';
import { Roles, RolesService } from '../../services/roles.service';


@Component({
  selector: 'app-roles',
  standalone: false,
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.scss'
})
export class RolesComponent implements OnInit {

  roles: Roles[] = [];
  mensajeError: string = '';

  constructor(private rolesService: RolesService) {



    console.log('json', this.nuevoRol);
  }

  ngOnInit(): void {
    this.cargarRoles();
  }

  nuevoRol: Roles = {
    nombreRol: '',
    descripcion: ''
  };


  rolSeleccionado: Roles | null = null;



  mostrarFormulario: boolean = false;


  abrirFormulario(){
    this.rolSeleccionado = {nombreRol: '', descripcion: ''};
    this.mostrarFormulario = true;

  }

  abrirFormularioEdicion( rol: Roles) {
    this.rolSeleccionado = {...rol};
    this.mostrarFormulario = true;
  }

  cerrarFormulario() {
    this.mostrarFormulario = false;
  }

  cargarRoles(): void {
    this.rolesService.listarRoles().subscribe({
      next: (data) => {
        console.log('Roles cargados', data);
        this.cerrarFormulario
        this.roles = data;
      },
      error: (error) => {
        this.mensajeError = 'Error al cargar los roles';
        console.log(error);
      }
    })
  }


  // crear nuevo rol
  crearRol(): void {
    this.rolesService.crearRol(this.nuevoRol).subscribe(
      (data) => {

        alert('Rol creado');
        this.nuevoRol = { nombreRol: '', descripcion: '' };
        this.cargarRoles();
        this.cerrarFormulario();
      },
      (error) => {
        console.error('Error al crear rol', error);
      }
    )
  }


  guardarRol(): void{
    if(!this.rolSeleccionado) return;

    if(this.rolSeleccionado.id){
      this.rolesService.modificarRol(this.rolSeleccionado).subscribe({
        next: () => {
          alert('Rol modificado');
          this.cargarRoles();
          this.cerrarFormulario();
        },
        error: (e) => {
          console.error('error al modificar rol', e);
        }
      });
    } else {
      this.rolesService.crearRol(this.rolSeleccionado).subscribe({
        next: () => {
          alert('Rol creado');
          this.cargarRoles();
          this.cerrarFormulario();
        },
        error: (e) => {
          console.error('error al crear rol', e);
        }
      })
    }
  }


  // Desactivar/eliminar ROL
  desactivarRol(id: number): void {
    if (confirm('Estar seguro de elimnar el rol')) {
      this.rolesService.desactivarRol(id).subscribe({
        next: () => {
          alert('Rol eliminado');
          this.cargarRoles();
        },
        error: (error) => {
          console.error('Error al desactivar el rol:', error);
          this.mensajeError = 'No se pudo desactivar el rol';
        }
      });
    }
  }



}
