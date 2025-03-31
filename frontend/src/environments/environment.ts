export interface Environment {
    production: boolean;
    API_URL: string;
}

export const environment: Environment = {
    production: false,
    API_URL: 'http://localhost:3001',
}
