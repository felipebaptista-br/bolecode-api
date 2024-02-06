import Fastify from "fastify"
import fastifyCors from "@fastify/cors";
import accessTokenRoutes from "./routes/accessTokenRoutes.mjs";
import invoiceRoutes from "./routes/invoiceRoutes.mjs";

export const fastify = Fastify({
    logger: true
});

fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
    methods: ["POST", "GET", "OPTIONS"],
});

fastify.get('/', async (_request, reply) => {
    return reply.send({ hello: 'world' })
});

fastify.register(accessTokenRoutes);
fastify.register(invoiceRoutes);

try {
    const PORT = 8080;
    await fastify.listen({ port: PORT, host: '0.0.0.0' });
} catch (error) {
    fastify.log.error(error);
    process.exit(1);
}