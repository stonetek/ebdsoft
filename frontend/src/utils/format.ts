import { format } from "date-fns";

export const formatLocalDate = (date: string, pattern: string) => {
    const dt = new Date(date);
    const dtDateOnly = new Date(dt.valueOf() + dt.getTimezoneOffset() * 60 * 1000);
    return format(dtDateOnly, pattern);
}


export const formatLocalDate1 = (date: string, pattern: string) => {
    const extractedDate = date.split("T")[0];
    const dtDateOnly = new Date(extractedDate);
    return format(dtDateOnly, pattern);
}

export function formatarCNPJ(cnpj: string): string {
    // Remove caracteres não numéricos do CNPJ
    cnpj = cnpj.replace(/\D/g, '');

    // Aplica a formatação do CNPJ (XX.XXX.XXX/YYYY-ZZ)
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, '$1.$2.$3/$4-$5');
}
