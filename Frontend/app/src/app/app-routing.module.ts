import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserFormComponent } from './user-form/user-form.component';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { UserComponent } from './business/user/user.component';
import { RolesComponent } from './business/roles/roles.component';
import { AlumnosComponent } from './business/alumnos/alumnos.component';
import { CalificacionesComponent } from './business/calificaciones/calificaciones.component';
import { PagosComponent } from './business/pagos/pagos.component';
import { ReportesComponent } from './business/reportes/reportes.component';
import { CierreComponent } from './business/cierre/cierre.component';
import { ConfiguracionComponent } from './business/configuracion/configuracion.component';
import { AlumnoFormComponent } from './business/alumno-form/alumno-form.component';
import { UsersFormComponent } from './business/users-form/users-form.component';

const routes: Routes = [

  {path:'', redirectTo:'login', pathMatch:'full'},
  {path:'login', component: UserFormComponent},
  {
    path:'',
    component: LayoutComponent,
    children:[
      {path:'dashboard', component: DashboardComponent},
      {path: 'users', component:UserComponent},
      {path: 'roles', component:RolesComponent},
      {path: 'alumnos', component:AlumnosComponent},
      {path: 'calificaciones', component:CalificacionesComponent},
      {path: 'pagos', component:PagosComponent},
      {path: 'reportes', component:ReportesComponent},
      {path: 'cierre', component:CierreComponent},
      {path:'configuracion', component:ConfiguracionComponent},
      {path: 'alumno-form', component:AlumnoFormComponent},
      {path: 'users-form', component:UsersFormComponent}
    ]
  },
  {path:'**', redirectTo:'login', pathMatch:'full'},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
