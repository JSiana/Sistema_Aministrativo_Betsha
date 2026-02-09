import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CicloService {

  private readonly KEY = 'cicloActivo';

  getCicloActivo(): string {
    const guardado = localStorage.getItem(this.KEY);
    return guardado ?? new Date().getFullYear().toString();
  }

  setCicloActivo(ciclo: string): void {
    localStorage.setItem(this.KEY, ciclo);
  }

  constructor() { 
     if (!localStorage.getItem(this.KEY)) {
    localStorage.setItem(this.KEY, new Date().getFullYear().toString());
  }
  }
}
