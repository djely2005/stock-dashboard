import type { UUID } from 'crypto';

// Import the pool instance
import { pool } from './dbConfig';

// Define Supplier type
export interface Supplier {
    id: UUID;
    name: string;
    contact_person?: string | null;
    email?: string | null;
    phone_number?: string | null;
    address?: string | null;
    created_at: Date;
    updated_at: Date;
}

export async function getSuppliers(): Promise<Supplier[]> {
    const client = await pool.connect();
    try {
        const result = await client.query<Supplier>('SELECT * FROM stock.suppliers ORDER BY name ASC');
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getSupplierById(id: UUID): Promise<Supplier | null> {
    const client = await pool.connect();
    try {
        const result = await client.query<Supplier>('SELECT * FROM stock.suppliers WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function createSupplier(data: Omit<Supplier, 'id' | 'created_at' | 'updated_at'>): Promise<Supplier> {
    const client = await pool.connect();
    try {
        const { name, contact_person, email, phone_number, address } = data;
        const result = await client.query<Supplier>(
            `INSERT INTO stock.suppliers (name, contact_person, email, phone_number, address)
             VALUES ($1, $2, $3, $4, $5)
             RETURNING *`,
            [name, contact_person, email, phone_number, address],
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

export async function updateSupplier(
    id: UUID,
    data: Partial<Omit<Supplier, 'id' | 'created_at' | 'updated_at'>>,
): Promise<Supplier | null> {
    const client = await pool.connect();
    try {
        const { name, contact_person, email, phone_number, address } = data;
        const fieldsToUpdate: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;

        if (name !== undefined) {
            fieldsToUpdate.push(`name = $${paramIndex++}`);
            values.push(name);
        }
        if (contact_person !== undefined) {
            fieldsToUpdate.push(`contact_person = $${paramIndex++}`);
            values.push(contact_person);
        }
        if (email !== undefined) {
            fieldsToUpdate.push(`email = $${paramIndex++}`);
            values.push(email);
        }
        if (phone_number !== undefined) {
            fieldsToUpdate.push(`phone_number = $${paramIndex++}`);
            values.push(phone_number);
        }
        if (address !== undefined) {
            fieldsToUpdate.push(`address = $${paramIndex++}`);
            values.push(address);
        }
        fieldsToUpdate.push(`updated_at = NOW()`);

        if (fieldsToUpdate.length === 0) {
            return await getSupplierById(id);
        }

        const query = `UPDATE stock.suppliers SET ${fieldsToUpdate.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await client.query<Supplier>(query, [...values, id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function deleteSupplier(id: UUID): Promise<boolean> {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM stock.suppliers WHERE id = $1', [id]);
        return result.rowCount > 0;
    } finally {
        client.release();
    }
}