import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios';
import { createPool } from 'mysql2/promise';
import initializeDatabase from './db/init.js';
import { INSERT_PRODUCT } from './db/queries.js';

// Configuration
const config = {
    shopify: {
        shopName: process.env.SHOPIFY_SHOP_NAME,
        accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
        apiVersion: '2024-01'
    },
    database: {
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    }
};

class DatabaseManager {
    constructor() {
        this.pool = createPool(config.database);
        this.client = axios.create({
            baseURL: `https://${config.shopify.shopName}.myshopify.com/admin/api/${config.shopify.apiVersion}`,
            headers: {
                'X-Shopify-Access-Token': config.shopify.accessToken,
                'Content-Type': 'application/json'
            }
        });
    }

    async saveProduct(product) {
        const values = [
            product.id,
            product.title,
            product.body_html,
            product.vendor,
            product.product_type,
            new Date(product.created_at),
            product.handle,
            new Date(product.updated_at),
            product.image?.src || null,
            product.image?.alt || null,
            product.variants[0]?.price || null
        ];

        try {
            const [result] = await this.pool.execute(INSERT_PRODUCT, values);
            return result;
        } catch (error) {
            console.error(`Error saving product ${product.id}:`, error.message);
            throw error;
        }
    }

    async close() {
        await this.pool.end();
    }
}

class ShopifyProductReader {
    constructor() {
        this.client = axios.create({
            baseURL: `https://${config.shopify.shopName}.myshopify.com/admin/api/${config.shopify.apiVersion}`,
            headers: {
                'X-Shopify-Access-Token': config.shopify.accessToken,
                'Content-Type': 'application/json'
            }
        });
    }

    async getProducts(limit = 10) {
        try {
            const response = await this.client.get(`/products.json?limit=${limit}`);
            return response.data.products;
        } catch (error) {
            console.error('Error fetching products:', error.response?.data || error.message);
            throw error;
        }
    }
}

async function main() {
    try {
        // Initialize database schema
        await initializeDatabase(config.database);

        const reader = new ShopifyProductReader();
        const dbManager = new DatabaseManager();

        console.log('Fetching products...');
        const products = await reader.getProducts();
        console.log(`Found ${products.length} products`);

        for (const product of products) {
            try {
                await dbManager.saveProduct(product);
                console.log(`Saved product: ${product.title} (ID: ${product.id})`);
            } catch (error) {
                console.error(`Failed to save product ${product.id}:`, error.message);
            }
        }

        await dbManager.close();
    } catch (error) {
        console.error('Application error:', error.message);
        process.exit(1);
    }
}

main();