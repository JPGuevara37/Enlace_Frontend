export interface IPerfil {
    usuarioId?: string;
    nombre?: string;
    apellido?: string;
    usuario_Cuenta?: string;
    email?: string;
    role?: string;
    avatar?: string;
}

export interface IPerfilGuardar {
    nombre?: string;
    apellido?: string;
    usuario_Cuenta?: string;
    email?: string;
    avatar?: string;
}

export interface ICambiarPassword {
    passwordActual?: string;
    passwordNueva?: string;
}
