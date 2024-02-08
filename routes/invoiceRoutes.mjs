import { createAccessToken } from "../services/accessTokenService.mjs";
import { createInvoiceWithAccessToken } from "../services/createInvoiceWithAccessTokenService.mjs";
import { createViewTemplateInvoice } from "../services/createViewTemplateInvoice.mjs";

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

    fastify.post('/api/invoice/template', async (request, reply) => {
        const { body } = request;

        try {
            const accessTokenResponse = await createAccessToken();
            const accessToken = accessTokenResponse.access_token;
            const invoice = await createInvoiceWithAccessToken(body, accessToken);
            const invoiceTemplate = await createViewTemplateInvoice(invoice);
            reply.header('Content-Type', 'text/html').send(invoiceTemplate);
        } catch (error) {
            console.error(error.message);
            reply.status(500).send({ error: 'Erro ao processar a requisição' });
        }
    });
}