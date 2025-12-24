export type Perfil = {
    id: number;
    nome: string;
}    

export type PerfilPage = {
    content?: Perfil[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}