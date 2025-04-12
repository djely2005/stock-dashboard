import type { UUID } from 'crypto';

// Import the pool instance (ensure the path is correct for your project structure)
import { pool } from './dbConfig';

// Define Category type
export interface Category {
    id: UUID;
    name: string;
    slug: string;
    parent_id: UUID | null;
    description?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    is_active: boolean;
    display_order?: number | null;
    image_url?: string | null;
    created_at: Date;
    updated_at: Date;
}

export async function getCategories(): Promise<Category[]> {
    const client = await pool.connect();
    try {
        const result = await client.query<Category>('SELECT * FROM stock.categories ORDER BY display_order ASC NULLS LAST, name ASC');
        return result.rows;
    } finally {
        client.release();
    }
}

export async function getCategoryById(id: UUID): Promise<Category | null> {
    const client = await pool.connect();
    try {
        const result = await client.query<Category>('SELECT * FROM stock.categories WHERE id = $1', [id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function createCategory(
    data: Omit<Category, 'id' | 'created_at' | 'updated_at' | 'slug'> & { slug?: string },
): Promise<Category> {
    const client = await pool.connect();
    try {
        const { name, parent_id, description, meta_title, meta_description, is_active = true, display_order, image_url } = data;
        const slug = data.slug || name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
        const result = await client.query<Category>(
            `INSERT INTO stock.categories (name, slug, parent_id, description, meta_title, meta_description, is_active, display_order, image_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
            [name, slug, parent_id, description, meta_title, meta_description, is_active, display_order, image_url],
        );
        return result.rows[0];
    } finally {
        client.release();
    }
}

export async function updateCategory(
    id: UUID,
    data: Partial<Omit<Category, 'id' | 'created_at' | 'updated_at' | 'slug'>> & { slug?: string },
): Promise<Category | null> {
    const client = await pool.connect();
    try {
        const { name, parent_id, description, meta_title, meta_description, is_active, display_order, image_url } = data;
        const slug = data.slug || (name ? name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '') : undefined);
        const fieldsToUpdate = [];
        const values = [];
        let paramIndex = 1;

        if (name !== undefined) {
            fieldsToUpdate.push(`name = $${paramIndex++}`);
            values.push(name);
        }
        if (slug !== undefined) {
            fieldsToUpdate.push(`slug = $${paramIndex++}`);
            values.push(slug);
        }
        if (parent_id !== undefined) {
            fieldsToUpdate.push(`parent_id = $${paramIndex++}`);
            values.push(parent_id);
        }
        if (description !== undefined) {
            fieldsToUpdate.push(`description = $${paramIndex++}`);
            values.push(description);
        }
        if (meta_title !== undefined) {
            fieldsToUpdate.push(`meta_title = $${paramIndex++}`);
            values.push(meta_title);
        }
        if (meta_description !== undefined) {
            fieldsToUpdate.push(`meta_description = $${paramIndex++}`);
            values.push(meta_description);
        }
        if (is_active !== undefined) {
            fieldsToUpdate.push(`is_active = $${paramIndex++}`);
            values.push(is_active);
        }
        if (display_order !== undefined) {
            fieldsToUpdate.push(`display_order = $${paramIndex++}`);
            values.push(display_order);
        }
        if (image_url !== undefined) {
            fieldsToUpdate.push(`image_url = $${paramIndex++}`);
            values.push(image_url);
        }
        fieldsToUpdate.push(`updated_at = NOW()`);

        if (fieldsToUpdate.length === 0) {
            return await getCategoryById(id);
        }

        const query = `UPDATE stock.categories SET ${fieldsToUpdate.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
        const result = await client.query<Category>(query, [...values, id]);
        return result.rows.length > 0 ? result.rows[0] : null;
    } finally {
        client.release();
    }
}

export async function deleteCategory(id: UUID): Promise<boolean> {
    const client = await pool.connect();
    try {
        const result = await client.query('DELETE FROM stock.categories WHERE id = $1', [id]);
        return result.rowCount > 0;
    } finally {
        client.release();
    }
}}