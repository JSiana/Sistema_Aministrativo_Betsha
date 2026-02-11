export interface PagoDTO {
    alumnoGrupoId: number;
    tipoPago: string;      // EFECTIVO, TRANSFERENCIA, etc.
    monto: number;
    mes: string;
    numeroBoleta: string;
    mora: number;
    observaciones?: string; // El ? lo hace opcional
}

export interface PagoResponseDTO {
    id: number;
    alumnoNombre: string;
    alumnoCodigo: string;
    cursoNombre: string;
    tipoPago: string;
    monto: number;
    mes: string;
    numeroBoleta: string;
    mora: number;
    fechaPago: Date | string; // Viene como string ISO, Angular lo puede tratar como Date
    totalPagado: number;      // El monto + mora calculado en el Java
    ultimoMesPagado: string;
    observaciones?: string;
}