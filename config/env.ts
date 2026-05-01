import * as dotenv from 'dotenv';
dotenv.config();

export const secretConfig = {
    baseURL: process.env.BASE_URL || '',
};