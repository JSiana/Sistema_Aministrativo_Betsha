export interface EncargadoResponse {
    id: number;
    dpi: number;
    nombres: string;
    apellidos: string;
    telefono: string;
    direccion: string;
    estado: boolean;
}

export interface EncargadoDTO{
    id?: number;
    dpi: number;
    nombres: string;
    apellidos: string;
    telefono: string;
    direccion: string;
}
