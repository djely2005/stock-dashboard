-- @Db creation
CREATE DATABASE Warehouse;


-- @Schema creation
CREATE SCHEMA IF NOT EXISTS stock;

-- @Tables of stock
CREATE TABLE IF NOT EXISTS stock.categories (
                                                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                name VARCHAR(255) NOT NULL UNIQUE,
                                                slug VARCHAR(255) NOT NULL UNIQUE,
                                                parent_id UUID REFERENCES stock.categories(id) ON DELETE CASCADE,
                                                description TEXT,
                                                meta_title VARCHAR(255),
                                                meta_description TEXT,
                                                is_active BOOLEAN DEFAULT TRUE,
                                                display_order INTEGER,
                                                image_url VARCHAR(255),
                                                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optionally create the suppliers table if it doesn't exist
CREATE TABLE IF NOT EXISTS stock.suppliers (
                                               id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                               name VARCHAR(255) NOT NULL UNIQUE,
                                               contact_person VARCHAR(255),
                                               email VARCHAR(255),
                                               phone_number VARCHAR(255),
                                               address TEXT,
                                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS stock.products (
                                              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                              name VARCHAR(255) NOT NULL UNIQUE,
                                              reference VARCHAR(255) NOT NULL UNIQUE,
                                              category_id UUID NOT NULL REFERENCES stock.categories(id) ON DELETE CASCADE,
                                              description TEXT,
                                              sku VARCHAR(255) UNIQUE,
                                              barcode VARCHAR(255) UNIQUE,
                                              purchase_price DECIMAL(10, 2),
                                              selling_price DECIMAL(10, 2),
                                              unit VARCHAR(50),
                                              quantity_in_stock INTEGER DEFAULT 0,
                                              low_stock_threshold INTEGER,
                                              supplier_id UUID REFERENCES stock.suppliers(id) ON DELETE SET NULL,
                                              acquisition_date DATE,
                                              expiration_date DATE,
                                              weight DECIMAL(10, 3),
                                              dimensions VARCHAR(255),
                                              storage_location VARCHAR(255),
                                              notes TEXT,
                                              is_active BOOLEAN DEFAULT TRUE,
                                              image_url VARCHAR(255),
                                              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SQL equivalent for Table 2: stock.purchase_orders
CREATE TABLE IF NOT EXISTS stock.purchase_orders (
                                                     id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                     po_number VARCHAR(255) NOT NULL UNIQUE,
                                                     supplier_id UUID NOT NULL REFERENCES stock.suppliers(id) ON DELETE CASCADE,
                                                     order_date DATE DEFAULT CURRENT_DATE,
                                                     expected_delivery_date DATE,
                                                     delivery_address TEXT,
                                                     total_amount DECIMAL(10, 2),
                                                     status VARCHAR(50) DEFAULT 'Pending',
                                                     notes TEXT,
                                                     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- SQL equivalent for Table 3: stock.purchase_order_items
CREATE TABLE IF NOT EXISTS stock.purchase_order_items (
                                                          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                                                          po_id UUID NOT NULL REFERENCES stock.purchase_orders(id) ON DELETE CASCADE,
                                                          product_id UUID NOT NULL REFERENCES stock.products(id) ON DELETE CASCADE,
                                                          quantity INTEGER NOT NULL,
                                                          purchase_price DECIMAL(10, 2) NOT NULL,
                                                          notes TEXT,
                                                          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                                                          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
