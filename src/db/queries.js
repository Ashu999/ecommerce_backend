export const CREATE_SCHEMA = `
CREATE TABLE IF NOT EXISTS products (
    id BIGINT PRIMARY KEY,
    title VARCHAR(255),
    body_html TEXT,
    vendor VARCHAR(255),
    product_type VARCHAR(255),
    created_at DATETIME,
    handle VARCHAR(255),
    updated_at DATETIME,
    image_src TEXT,
    image_alt VARCHAR(255),
    price DECIMAL(10, 2)
)`;

export const INSERT_PRODUCT = `
    INSERT INTO products (
        id, title, body_html, vendor, product_type, created_at, 
        handle, updated_at, image_src, image_alt, price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        body_html = VALUES(body_html),
        vendor = VALUES(vendor),
        product_type = VALUES(product_type),
        updated_at = VALUES(updated_at),
        image_src = VALUES(image_src),
        image_alt = VALUES(image_alt),
        price = VALUES(price)`;
