interface Environment {
    production: boolean;
    API_URL: string;
}

export const environment: Environment = {
    production: false,
    // API_URL: 'http://localhost:3001',
    API_URL: 'http://dwengo-2-backend-1:3000'
}
