import axios from "axios";
import fs from 'fs';
import https from 'https';
import { fileURLToPath } from "url";
import { dirname, resolve } from 'path';
import { config } from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

config({ path: resolve(__dirname, '../.env') });
const { API_INVOICE } = process.env;

const certPath = resolve(__dirname, '../assets/certificate/CERTIFICATE.crt');
const keyPath = resolve(__dirname, '../assets/key/ARQUIVO_CHAVE_PRIVADA.key');

/**
 * Creates an invoice using the provided payload and access token.
 *
 * @param {Object} payload - The payload for creating the invoice.
 * @param {string} accessToken - The access token for authentication.
 * @return {Object} The response data from the API.
 */
export async function createInvoiceWithAccessToken(payload, accessToken) {
    try {
        const url = API_INVOICE;
        const cert = fs.readFileSync(certPath).toString('ascii');
        const key = fs.readFileSync(keyPath).toString('ascii');

        const response = await axios.post(url, payload, {
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'x-itau-flowID': '1234',
                'x-itau-correlationID': '1234',
                'Content-Type': 'application/json'
            },
            httpsAgent: new https.Agent({
                cert: cert,
                key: key
            })
        });

        if (response.status !== 200) {
            console.log('Resposta da API não foi bem-sucedida:', response.data);
        }

        return response.data;
    } catch (error) {
        console.error('Erro ao fazer a chamada para a API:', error);
        throw new Error('Erro ao fazer a chamada para a API');
    }
}
