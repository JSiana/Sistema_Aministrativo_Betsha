export interface Tarea {
    id?: number;
    descripcion: string;
    bimestre: number;
    fechaEntrega: string; 
    punteo: number;
    idGrupo?: number;
}

export interface PunteoAlumno {
    idTareaAlumno: number;
    nombreAlumno: string;
    
    apellidoAlumno: string;
    nota: number;
    observacion: string;
    fechaEntregada: string | null;
    descripcionTarea?: string;
}

export interface PunteoUpdateRequest {
    idTareaAlumno: number;
    nota: number;
    observacion: string;
    fechaEntregada: string | null;
}