export interface IUsuarios {
    usuarioId?: string;
    nombre?: string;
    apellido?: string;
    usuario_Cuenta?: string;
    email?: string;
    role?: string;
    activo?: boolean;
}

export interface IUsuarioGuardar {
    nombre?: string;
    apellido?: string;
    usuario_Cuenta?: string;
    password?: string;
    email?: string;
    role?: string;
    activo?: boolean;
}
