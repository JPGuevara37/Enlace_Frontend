export interface IRolesMes {
    rolMesId?: string;
    edadId?: string | null;
    personaId: string;
    mes: number;
    anno: number;
    dia: number;
    tipo?: string;
    estado: string;
    disponible: boolean;
    respuesta?: string;
    motivo?: string;
    fechaCreacion?: string;
}
