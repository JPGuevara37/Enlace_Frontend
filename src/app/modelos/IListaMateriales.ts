export interface IListaMateriales{
    materialId:string;
    nombre:string;
    descripcion?:string;
    categoria?:string;
    mes?:number;
    anno?:number;
    dia?:number;
    fecha:Date | string;
    contentType?:string;
    tamano?:number;
}
