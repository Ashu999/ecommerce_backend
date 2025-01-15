require('dotenv').config();
import { create } from 'axios';

// Basic configuration
const config = {
    shopName: process.env.SHOPIFY_SHOP_NAME,
    accessToken: process.env.SHOPIFY_ACCESS_TOKEN,
    apiVersion: '2024-01'
};

class ShopifyProductReader {
    constructor() {
        this.client = create({
            baseURL: `https://${config.shopName}.myshopify.com/admin/api/${config.apiVersion}`,
            headers: {
                'X-Shopify-Access-Token': config.accessToken,
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

    // async getProductDetails(productId) {
    //     try {
    //         const response = await this.client.get(`/products/${productId}.json`);
    //         return response.data.product;
    //     } catch (error) {
    //         console.error('Error fetching product details:', error.response?.data || error.message);
    //         throw error;
    //     }
    // }
}

// Usage example
async function main() {
    const reader = new ShopifyProductReader();

    try {
        // Get list of products
        console.log('Fetching products...');
        const products = await reader.getProducts();
        console.log('Products count:', products.length);
        // console.log('Products found:', JSON.stringify(products, null, 2));
        console.log('Products found:', products);


        // Print basic product info
        products.forEach(product => {
            console.log('\nProduct:', {
                id: product.id,
                title: product.title,
                body_html: product.body_html,
                vendor: product.vendor,
                product_type: product.product_type,
                created_at: product.created_at,
                handle: product.handle,
                updated_at: product.updated_at,
                image_src: product.image?.src || '',
                image_alt: product.image?.alt || '',
                price: product.variants[0]?.price || 'N/A'
            });
        });

    } catch (error) {
        console.error('Failed to fetch products:', error.message);
    }
}

// Run the script
main();