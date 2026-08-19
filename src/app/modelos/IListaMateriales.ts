export interface IListaMateriales{
    materialId:string;
    nombre:string;
    descripcion?:string;
    fecha:Date | string;
    contentType?:string;
    tamano?:number;
}
