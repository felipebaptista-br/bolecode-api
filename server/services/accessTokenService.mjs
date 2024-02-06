import axios from 'axios';
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import { config } from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../.env') });
const { CLIENT_ID, CLIENT_SECRET, API_TOKEN } = process.env;

const certPath = resolve(__dirname, '../assets/certificate/CERTIFICATE.crt');
const keyPath = resolve(__dirname, '../assets/key/ARQUIVO_CHAVE_PRIVADA.key');

/**
 * Creates an access token using client credentials.
 *
 * @return {Promise<Object>} The response data containing the access token.
 */
export async function createAccessToken() {
    try {
        const url = API_TOKEN;
        const payload = `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`;
        const cert = fs.readFileSync(certPath).toString('ascii');
        const key = fs.readFileSync(keyPath).toString('ascii');

        const response = await axios.post(url, payload, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'x-itau-flowID': '1',
                'x-itau-correlationID': '2'
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key
            })
        });

        return response.data;
    } catch (error) {
        console.log('Erro ao fazer a chamada para a API:', error);
        throw new Error(error);
    }
}
