import { Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {

  usuario: string ='';
  rol: string = '';
  email: string ='';

  ngOnInit(): void{
    const userStr = localStorage.getItem('usuario');
    if(userStr){
      const user= JSON.parse(userStr);
      this.usuario = user.usuario || '';
      this.rol = user.rol || '';
      this.email = user.email ||'';
    }
  }

}
