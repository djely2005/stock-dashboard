import type { UUID } from 'crypto';

// Import the pool instance
import { pool } from './dbConfig';

// Define PurchaseOrderItem type
export interface PurchaseOrderItem {
    id: UUID;
    po_id: UUID;
    product_id: UUID;
    quantity: number;
    purchase_price: number;
    notes?: string | null;
    created_at: Date;
    updated_at: Date;
}

export async function getPurchaseOrderItemsByPoId(poId: UUID): Promise<PurchaseOrderItem[]> {
    const client = await pool.connect();
    try {
        const result = await client.query<PurchaseOrderItem>(
            'SELECT * FROM stock.purchase_order_items WHERE po_id = $1',
            [poId],
        );
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getPurchaseOrderItemById(id: UUID): Promise<PurchaseOrderItem | null> {
    const client = await pool.connect();
    try {
        const result = await client.query<PurchaseOrderItem>('SELECT * FROM stock.purchase_order_items WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function createPurchaseOrderItem(
    data: Omit<PurchaseOrderItem, 'id' | 'created_at' | 'updated_at'>,
): Promise<PurchaseOrderItem> {
    const client = await pool.connect();
    try {
        const { po_id, product_id, quantity, purchase_price, notes } = data;
        const result = await client.query<PurchaseOrderItem>(
            `INSERT INTO stock.purchase_order_items (po_id, product_id, quantity, purchase_price, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
            [po_id, product_id, quantity, purchase_price, notes],
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

export async function updatePurchaseOrderItem(
    id: UUID,
    data: Partial<Omit<PurchaseOrderItem, 'id' | 'created_at' | 'updated_at'>>,
): Promise<PurchaseOrderItem | null> {
    const client = await pool.connect();
    try {
        const { po_id, product_id, quantity, purchase_price, notes } = data;
        const fieldsToUpdate: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (po_id !== undefined) {
            fieldsToUpdate.push(`po_id = $${paramIndex++}`);
            values.push(po_id);
        }
        if (product_id !== undefined) {
            fieldsToUpdate.push(`product_id = $${paramIndex++}`);
            values.push(product_id);
        }
        if (quantity !== undefined) {
            fieldsToUpdate.push(`quantity = $${paramIndex++}`);
            values.push(quantity);
        }
        if (purchase_price !== undefined) {
            fieldsToUpdate.push(`purchase_price = $${paramIndex++}`);
            values.push(purchase_price);
        }
        if (notes !== undefined) {
            fieldsToUpdate.push(`notes = $${paramIndex++}`);
            values.push(notes);
        }
        fieldsToUpdate.push(`updated_at = NOW()`);

        if (fieldsToUpdate.length === 0) {
            return await getPurchaseOrderItemById(id);
        }

        const query = `UPDATE stock.purchase_order_items SET ${fieldsToUpdate.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await client.query<PurchaseOrderItem>(query, [...values, id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function deletePurchaseOrderItem(id: UUID): Promise<boolean> {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM stock.purchase_order_items WHERE id = $1', [id]);
        return result.rowCount > 0;
    } finally {
        client.release();
    }
}