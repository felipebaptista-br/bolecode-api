import Fastify from "fastify";
import fastifyCors from "@fastify/cors";
import fs from 'fs';
import accessTokenRoutes from "./routes/accessTokenRoutes.mjs";
import invoiceRoutes from "./routes/invoiceRoutes.mjs";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fastifyStatic from "@fastify/static";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const fastify = Fastify({
    logger: true
});

fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
    methods: ["POST", "GET", "OPTIONS"],
});

fastify.register(fastifyStatic, {
    root: join(__dirname, 'public'),
    prefix: '/public/',
});

fastify.get('/', async (_request, reply) => {
    try {
        const filePath = join(__dirname, 'templates', 'index.html');
        const content = await fs.promises.readFile(filePath, 'utf8');
        return reply.type('text/html').send(content);
    } catch (error) {
        reply.code(500).send('Internal Server Error');
    }
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