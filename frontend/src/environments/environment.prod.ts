interface Environment {
    production: boolean;
    API_URL: string;
}

export const environment: Environment = {
    production: true,
    API_URL: 'https://sel2-2.ugent.be:2002'
}
