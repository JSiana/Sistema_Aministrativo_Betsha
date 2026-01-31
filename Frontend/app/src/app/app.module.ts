import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserFormComponent } from './user-form/user-form.component';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { DashboardComponent } from './business/dashboard/dashboard.component';
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProfileComponent } from './business/profile/profile.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LocationStrategy, PathLocationStrategy } from '@angular/common';
import { UserComponent } from './business/user/user.component';
import { RolesComponent } from './business/roles/roles.component';
import { AlumnosComponent } from './business/alumnos/alumnos.component';
import { CalificacionesComponent } from './business/calificaciones/calificaciones.component';
import { PagosComponent } from './business/pagos/pagos.component';
import { ReportesComponent } from './business/reportes/reportes.component';
import { CierreComponent } from './business/cierre/cierre.component';
import { ConfiguracionComponent } from './business/configuracion/configuracion.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { AlumnoFormComponent } from './business/alumno-form/alumno-form.component';
import { UsersFormComponent } from './business/users-form/users-form.component';
import { AuthInterceptor } from './interceptors/auth/auth.interceptor';
import { NgChartsModule } from 'ng2-charts';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { EncargadoComponent } from './business/encargado/encargado.component';
import { MatSelectModule } from '@angular/material/select';
import { GruposComponent } from './business/grupos/grupos.component';
import { InfoGrupoComponent } from './business/info-grupo/info-grupo.component';
import { SpinnerInterceptor } from './interceptors/spinner.interceptor';
import { SpinnerModule } from './components/spinner/spinner.module';


@NgModule({
  declarations: [
    AppComponent,
    UserFormComponent,
    DashboardComponent,
    FooterComponent,
    HeaderComponent,
    SidebarComponent,
    LayoutComponent,
    ProfileComponent,
    UserComponent,
    RolesComponent,
    AlumnosComponent,
    CalificacionesComponent,
    PagosComponent,
    ReportesComponent,
    CierreComponent,
    ConfiguracionComponent,
    AlumnoFormComponent,
    UsersFormComponent,
    EncargadoComponent,
    GruposComponent,
    InfoGrupoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgxPaginationModule,
    NgChartsModule,
    FullCalendarModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    SpinnerModule
  ],
  providers: [
  {
    provide: HTTP_INTERCEPTORS,
    useClass: SpinnerInterceptor,
    multi: true
  },
  {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptor,
    multi: true
  }

  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
