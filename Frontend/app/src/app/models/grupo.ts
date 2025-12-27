export interface GrupoResponse {
    id: number;
    codigo: string;
    curso: string;
    jornada: string;
    horario: string;
    dia: string;
    cantidadAlumnos: number;
}

export interface GrupoDTO {
    id?: number;
    cursoId: number;
    jornada: string;
    horario: string;
    dia: string;
}


