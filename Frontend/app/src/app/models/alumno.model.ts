export interface AlumnoResponse {
  id: number;
  codigoPersonal: string;
  primerNombre: string;
  segundoNombre?: string;
  tercerNombre?: string;
  primerApellido: string;
  segundoApellido?: string;
  sexo:string | null;
  nombreEncargado?: string;
  apellidoEncargado?: string;
  telefono: string;
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
  sexo: string | null; 
  ultimoGrado: string;
  telefono: string;
  estado: boolean;
  idEncargado: number | null;
}
