import fs from 'fs';
import ejs from 'ejs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Create a view template for an invoice.
 *
 * @param {Object} invoice - The invoice object
 * @return {Promise<string>} The rendered invoice template
 */
export async function createViewTemplateInvoice(invoice) {
    try {
        const filePath = join(__dirname, '../templates', 'boleto.html');
        const template = await fs.promises.readFile(filePath, 'utf8');
        const renderedTemplate = ejs.render(template, { data: invoice.data });
        return renderedTemplate;
    } catch (error) {
        console.error(error);
        throw error;
    }
}