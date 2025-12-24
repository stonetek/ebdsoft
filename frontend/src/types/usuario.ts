export type UsuarioPerfil = {
    id: number;
    perfil: string;
};

export type Usuario = {
    id: number;
    username: string;
    nome: string;
    password: string;
    status: boolean;
    perfis: string[];
};

export type UsuarioPage = {
    content?: Usuario[];
    last: boolean;
    totalElements: number;
    totalPages: number;
    size?: number;
    number: number;
    first: boolean;
    numberOfElements?: number;
    empty?: boolean;
}

