export interface IUsuarios {
    usuarioId?: string;
    nombre?: string;
    apellido?: string;
    usuario_Cuenta?: string;
    password?: string;
    token?: string;
    email?: string;
    role?: string;
    activo?: boolean;
    refreshToken?: string;
    refreshTokenExpiryTime?: string;
    resetPasswordToken?: string;
    resetPasswordExpiry?: string;
}
