

export interface IListaAlumnos{
    alumnoId:string;
    nombre:string;
    apellido:string;
    fechaNacimiento: Date | any;
    direccion:string;
    email:string;
    telefono:string;
    token?:any;
    encargadoId?:any;
    edadId?:any;
}