import type { UUID } from 'crypto';

// Import the pool instance
import { pool } from './dbConfig';

// Define PurchaseOrder type
export interface PurchaseOrder {
    id: UUID;
    po_number: string;
    supplier_id: UUID;
    order_date: Date;
    expected_delivery_date?: Date | null;
    delivery_address?: string | null;
    total_amount?: number | null;
    status: string;
    notes?: string | null;
    created_at: Date;
    updated_at: Date;
}

export async function getPurchaseOrders(): Promise<PurchaseOrder[]> {
    const client = await pool.connect();
    try {
        const result = await client.query<PurchaseOrder>('SELECT * FROM stock.purchase_orders ORDER BY order_date DESC');
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getPurchaseOrderById(id: UUID): Promise<PurchaseOrder | null> {
    const client = await pool.connect();
    try {
        const result = await client.query<PurchaseOrder>('SELECT * FROM stock.purchase_orders WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function createPurchaseOrder(
    data: Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at' | 'order_date' | 'status'> & {
        order_date?: Date;
        status?: string;
    },
): Promise<PurchaseOrder> {
    const client = await pool.connect();
    try {
        const { po_number, supplier_id, expected_delivery_date, delivery_address, total_amount, notes, order_date = new Date(), status = 'Pending' } = data;
        const result = await client.query<PurchaseOrder>(
            `INSERT INTO stock.purchase_orders (po_number, supplier_id, order_date, expected_delivery_date, delivery_address, total_amount, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
            [po_number, supplier_id, order_date, expected_delivery_date, delivery_address, total_amount, status, notes],
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

export async function updatePurchaseOrder(
    id: UUID,
    data: Partial<Omit<PurchaseOrder, 'id' | 'created_at' | 'updated_at' | 'order_date' | 'status'>> & {
        order_date?: Date;
        status?: string;
    },
): Promise<PurchaseOrder | null> {
    const client = await pool.connect();
    try {
        const { po_number, supplier_id, expected_delivery_date, delivery_address, total_amount, status, notes, order_date } = data;
        const fieldsToUpdate: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (po_number !== undefined) {
            fieldsToUpdate.push(`po_number = $${paramIndex++}`);
            values.push(po_number);
        }
        if (supplier_id !== undefined) {
            fieldsToUpdate.push(`supplier_id = $${paramIndex++}`);
            values.push(supplier_id);
        }
        if (order_date !== undefined) {
            fieldsToUpdate.push(`order_date = $${paramIndex++}`);
            values.push(order_date);
        }
        if (expected_delivery_date !== undefined) {
            fieldsToUpdate.push(`expected_delivery_date = $${paramIndex++}`);
            values.push(expected_delivery_date);
        }
        if (delivery_address !== undefined) {
            fieldsToUpdate.push(`delivery_address = $${paramIndex++}`);
            values.push(delivery_address);
        }
        if (total_amount !== undefined) {
            fieldsToUpdate.push(`total_amount = $${paramIndex++}`);
            values.push(total_amount);
        }
        if (status !== undefined) {
            fieldsToUpdate.push(`status = $${paramIndex++}`);
            values.push(status);
        }
        if (notes !== undefined) {
            fieldsToUpdate.push(`notes = $${paramIndex++}`);
            values.push(notes);
        }
        fieldsToUpdate.push(`updated_at = NOW()`);

        if (fieldsToUpdate.length === 0) {
            return await getPurchaseOrderById(id);
        }

        const query = `UPDATE stock.purchase_orders SET ${fieldsToUpdate.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await client.query<PurchaseOrder>(query, [...values, id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function deletePurchaseOrder(id: UUID): Promise<boolean> {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM stock.purchase_orders WHERE id = $1', [id]);
        return result.rowCount > 0;
    } finally {
        client.release();
    }
}