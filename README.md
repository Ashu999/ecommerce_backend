# E-commerce Backend

## Setup Instructions

1. Start the MySQL database using Docker:
```bash
cp .env.example .env  # Fill the .env file with your credentials: SHOPIFY_SHOP_NAME, SHOPIFY_ACCESS_TOKEN

docker-compose up --build

npm install

npm run start
```