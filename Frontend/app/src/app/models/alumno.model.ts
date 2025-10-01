export interface AlumnoResponse {
  id: number;
  codigoPersonal: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  nombreEncargado?: string;
  apellidoEncargado?: string;
  estado: boolean;
}

export interface AlumnoDTO {
  id?: number;
  codigoPersonal: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  email: string;
  fechaNacimiento: string; 
  ultimoGrado: string;
  telefono: string;
  estado: boolean;
  idEncargado: number;
  nombreEncargado: string;
  apellidoEncargado: string;
}
