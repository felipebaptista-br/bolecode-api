import { createAccessToken } from "../services/accessTokenService.mjs";
import { createInvoiceWithAccessToken } from "../services/createInvoiceWithAccessTokenService.mjs";

export default async function invoiceRoutes(fastify, _options) {
    fastify.post('/api/invoice', async (request, reply) => {
        const { body } = request;

        try {
            const accessTokenResponse = await createAccessToken();
            const accessToken = accessTokenResponse.access_token;
            const invoice = await createInvoiceWithAccessToken(body, accessToken);
            return reply.status(200).send(invoice);
        } catch (error) {
            console.error(error.message);
            reply.status(500).send({ error: 'Erro ao processar a requisição' });
        }
    });
}