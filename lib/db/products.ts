import type { UUID } from 'crypto';

// Import the pool instance
import { pool } from './dbConfig';

// Define Product type
export interface Product {
    id: UUID;
    name: string;
    reference: string;
    category_id: UUID;
    description?: string | null;
    sku?: string | null;
    barcode?: string | null;
    purchase_price?: number | null;
    selling_price?: number | null;
    unit?: string | null;
    quantity_in_stock: number;
    low_stock_threshold?: number | null;
    supplier_id?: UUID | null;
    acquisition_date?: Date | null;
    expiration_date?: Date | null;
    weight?: number | null;
    dimensions?: string | null;
    storage_location?: string | null;
    notes?: string | null;
    is_active: boolean;
    image_url?: string | null;
    created_at: Date;
    updated_at: Date;
}

export async function getProducts(): Promise<Product[]> {
    const client = await pool.connect();
    try {
        const result = await client.query<Product>('SELECT * FROM stock.products ORDER BY name ASC');
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getProductById(id: UUID): Promise<Product | null> {
    const client = await pool.connect();
    try {
        const result = await client.query<Product>('SELECT * FROM stock.products WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function createProduct(data: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product> {
    const client = await pool.connect();
    try {
        const {
            name,
            reference,
            category_id,
            description,
            sku,
            barcode,
            purchase_price,
            selling_price,
            unit,
            quantity_in_stock,
            low_stock_threshold,
            supplier_id,
            acquisition_date,
            expiration_date,
            weight,
            dimensions,
            storage_location,
            notes,
            is_active = true,
            image_url,
        } = data;
        const result = await client.query<Product>(
            `INSERT INTO stock.products (name, reference, category_id, description, sku, barcode, purchase_price, selling_price, unit, quantity_in_stock, low_stock_threshold, supplier_id, acquisition_date, expiration_date, weight, dimensions, storage_location, notes, is_active, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20)
       RETURNING *`,
            [
                name,
                reference,
                category_id,
                description,
                sku,
                barcode,
                purchase_price,
                selling_price,
                unit,
                quantity_in_stock,
                low_stock_threshold,
                supplier_id,
                acquisition_date,
                expiration_date,
                weight,
                dimensions,
                storage_location,
                notes,
                is_active,
                image_url,
            ],
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

export async function updateProduct(
    id: UUID,
    data: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>,
): Promise<Product | null> {
    const client = await pool.connect();
    try {
        const {
            name,
            reference,
            category_id,
            description,
            sku,
            barcode,
            purchase_price,
            selling_price,
            unit,
            quantity_in_stock,
            low_stock_threshold,
            supplier_id,
            acquisition_date,
            expiration_date,
            weight,
            dimensions,
            storage_location,
            notes,
            is_active,
            image_url,
        } = data;
        const fieldsToUpdate: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (name !== undefined) {
            fieldsToUpdate.push(`name = $${paramIndex++}`);
            values.push(name);
        }
        if (reference !== undefined) {
            fieldsToUpdate.push(`reference = $${paramIndex++}`);
            values.push(reference);
        }
        if (category_id !== undefined) {
            fieldsToUpdate.push(`category_id = $${paramIndex++}`);
            values.push(category_id);
        }
        if (description !== undefined) {
            fieldsToUpdate.push(`description = $${paramIndex++}`);
            values.push(description);
        }
        if (sku !== undefined) {
            fieldsToUpdate.push(`sku = $${paramIndex++}`);
            values.push(sku);
        }
        if (barcode !== undefined) {
            fieldsToUpdate.push(`barcode = $${paramIndex++}`);
            values.push(barcode);
        }
        if (purchase_price !== undefined) {
            fieldsToUpdate.push(`purchase_price = $${paramIndex++}`);
            values.push(purchase_price);
        }
        if (selling_price !== undefined) {
            fieldsToUpdate.push(`selling_price = $${paramIndex++}`);
            values.push(selling_price);
        }
        if (unit !== undefined) {
            fieldsToUpdate.push(`unit = $${paramIndex++}`);
            values.push(unit);
        }
        if (quantity_in_stock !== undefined) {
            fieldsToUpdate.push(`quantity_in_stock = $${paramIndex++}`);
            values.push(quantity_in_stock);
        }
        if (low_stock_threshold !== undefined) {
            fieldsToUpdate.push(`low_stock_threshold = $${paramIndex++}`);
            values.push(low_stock_threshold);
        }
        if (supplier_id !== undefined) {
            fieldsToUpdate.push(`supplier_id = $${paramIndex++}`);
            values.push(supplier_id);
        }
        if (acquisition_date !== undefined) {
            fieldsToUpdate.push(`acquisition_date = $${paramIndex++}`);
            values.push(acquisition_date);
        }
        if (expiration_date !== undefined) {
            fieldsToUpdate.push(`expiration_date = $${paramIndex++}`);
            values.push(expiration_date);
        }
        if (weight !== undefined) {
            fieldsToUpdate.push(`weight = $${paramIndex++}`);
            values.push(weight);
        }
        if (dimensions !== undefined) {
            fieldsToUpdate.push(`dimensions = $${paramIndex++}`);
            values.push(dimensions);
        }
        if (storage_location !== undefined) {
            fieldsToUpdate.push(`storage_location = $${paramIndex++}`);
            values.push(storage_location);
        }
        if (notes !== undefined) {
            fieldsToUpdate.push(`notes = $${paramIndex++}`);
            values.push(notes);
        }
        if (is_active !== undefined) {
            fieldsToUpdate.push(`is_active = $${paramIndex++}`);
            values.push(is_active);
        }
        if (image_url !== undefined) {
            fieldsToUpdate.push(`image_url = $${paramIndex++}`);
            values.push(image_url);
        }
        fieldsToUpdate.push(`updated_at = NOW()`);

        if (fieldsToUpdate.length === 0) {
            return await getProductById(id);
        }

        const query = `UPDATE stock.products SET ${fieldsToUpdate.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await client.query<Product>(query, [...values, id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function deleteProduct(id: UUID): Promise<boolean> {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM stock.products WHERE id = $1', [id]);
        return result.rowCount > 0;
    } finally {
        client.release();
    }
}