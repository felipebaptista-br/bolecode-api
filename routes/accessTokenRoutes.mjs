import { createAccessToken } from '../services/accessTokenService.mjs';

export default async function accessTokenRoutes(fastify, _options) {
    fastify.get('/api/access-token', async (_request, reply) => {
        try {
            const tokenData = await createAccessToken();
            return tokenData;
        } catch (error) {
            console.error(error.message);
            reply.status(500).send({ error: 'Erro ao processar a requisição' });
        }
    });
}