export interface GrupoResponse {
    id: number;
    codigo: string;
    curso: string;
    jornada: string;
    horario: string;
    dia: string;
    cicloEscolar: string;
    cantidadAlumnos: number;
}

export interface GrupoDTO {
    id?: number;
    cursoId: number | null;
    jornada: string;
    horario: string;
    dia: string;
    cicloEscolar: string;
}


