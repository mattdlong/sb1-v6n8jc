import express from 'express';
import { setupDatabase } from './database';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'; // Use an environment variable in production

// Middleware
app.use(express.json());

// Database setup
let db: any;
(async () => {
  db = await setupDatabase();
})();

// Helper function for authentication
const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET as string, (err: any, user: any) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Helper function for admin check
const isAdmin = (req: any, res: any, next: any) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ error: 'Admin access required' });
  }
};

// AUTH API Routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await db.get('SELECT * FROM user WHERE email = ?', email);
    if (user && await bcrypt.compare(password, user.password)) {
      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
      await db.run('UPDATE user SET last_login = CURRENT_TIMESTAMP WHERE id = ?', user.id);
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/auth/logout', authenticateToken, (req, res) => {
  // In a stateless JWT setup, the client is responsible for discarding the token
  res.json({ message: 'Logout successful' });
});

app.get('/api/auth/user', authenticateToken, async (req: any, res) => {
  try {
    const user = await db.get('SELECT id, email, name, role FROM user WHERE id = ?', req.user.id);
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Opportunity API Routes
app.get('/api/opportunities', authenticateToken, async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const offset = (Number(page) - 1) * Number(limit);
    
    let query = 'SELECT * FROM opportunity';
    const params: any[] = [];
    
    if (status) {
      query += ' WHERE status = ?';
      params.push(status);
    }
    
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, offset);
    
    const opportunities = await db.all(query, params);
    res.json(opportunities);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const opportunity = await db.get('SELECT * FROM opportunity WHERE key = ?', req.params.id);
    if (opportunity) {
      res.json(opportunity);
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove readonly fields
    delete updates.key;
    delete updates.created_at;
    
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    const result = await db.run(
      `UPDATE opportunity SET ${setClause}, date_status_changed = CURRENT_TIMESTAMP, user_status_changed_id = ? WHERE key = ?`,
      [...values, req.user.id]
    );
    
    if (result.changes > 0) {
      res.json({ message: 'Opportunity updated successfully' });
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/opportunities/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.run(
      'UPDATE opportunity SET status = "deleted", date_status_changed = CURRENT_TIMESTAMP, user_status_changed_id = ? WHERE key = ?',
      [req.user.id, req.params.id]
    );
    
    if (result.changes > 0) {
      res.json({ message: 'Opportunity marked as deleted' });
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/opportunities/:id/progress', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const currentStatus = await db.get('SELECT status FROM opportunity WHERE key = ?', id);
    
    if (!currentStatus) {
      return res.status(404).json({ error: 'Opportunity not found' });
    }
    
    const statusOrder = ['new', 'progressed', 'contacts_added', 'qualified', 'contacted', 'followed_up', 'replied'];
    const currentIndex = statusOrder.indexOf(currentStatus.status);
    const nextStatus = statusOrder[currentIndex + 1] || currentStatus.status;
    
    const result = await db.run(
      'UPDATE opportunity SET status = ?, date_status_changed = CURRENT_TIMESTAMP, user_status_changed_id = ? WHERE key = ?',
      [nextStatus, req.user.id, id]
    );
    
    if (result.changes > 0) {
      res.json({ message: 'Opportunity progressed successfully', newStatus: nextStatus });
    } else {
      res.status(404).json({ error: 'Opportunity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Company API Routes
app.get('/api/companies', authenticateToken, async (req, res) => {
  try {
    const companies = await db.all('SELECT * FROM company');
    res.json(companies);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/companies/:id', authenticateToken, async (req, res) => {
  try {
    const company = await db.get('SELECT * FROM company WHERE id = ?', req.params.id);
    if (company) {
      res.json(company);
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/companies/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove readonly fields
    delete updates.id;
    delete updates.key;
    
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    const result = await db.run(`UPDATE company SET ${setClause} WHERE id = ?`, values);
    if (result.changes > 0) {
      res.json({ message: 'Company updated successfully' });
    } else {
      res.status(404).json({ error: 'Company not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Contact API Routes
app.get('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const contacts = await db.all('SELECT * FROM contacts');
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const contact = await db.get('SELECT * FROM contacts WHERE id = ?', req.params.id);
    if (contact) {
      res.json(contact);
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/contacts', authenticateToken, async (req, res) => {
  try {
    const newContact = req.body;
    const result = await db.run('INSERT INTO contacts (key, name, role, sex, linkedin_url, email_address, blurb) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [newContact.key, newContact.name, newContact.role, newContact.sex, newContact.linkedin_url, newContact.email_address, newContact.blurb]);
    res.status(201).json({ id: result.lastID, ...newContact });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove readonly fields
    delete updates.id;
    delete updates.key;
    
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    const result = await db.run(`UPDATE contacts SET ${setClause} WHERE id = ?`, values);
    if (result.changes > 0) {
      res.json({ message: 'Contact updated successfully' });
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/api/contacts/:id', authenticateToken, async (req, res) => {
  try {
    const result = await db.run('DELETE FROM contacts WHERE id = ?', req.params.id);
    if (result.changes > 0) {
      res.json({ message: 'Contact deleted successfully' });
    } else {
      res.status(404).json({ error: 'Contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User Management API Routes
app.get('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const users = await db.all('SELECT id, email, name, role, created_at, last_login FROM user');
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const user = await db.get('SELECT id, email, name, role, created_at, last_login FROM user WHERE id = ?', req.params.id);
    if (user) {
      const permissions = await db.all('SELECT permission, permitted FROM user_permissions WHERE user_id = ?', req.params.id);
      user.permissions = permissions;
      res.json(user);
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/api/users', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { email, name, role, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.run('INSERT INTO user (email, name, role, password) VALUES (?, ?, ?, ?)',
      [email, name, role, hashedPassword]);
    res.status(201).json({ id: result.lastID, email, name, role });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/api/users/:id', authenticateToken, isAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Remove readonly fields and handle password separately
    delete updates.id;
    delete updates.created_at;
    delete updates.last_login;
    
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    
    const setClause = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    values.push(id);
    
    const result = await db.run(`UPDATE user SET ${setClause} WHERE id = ?`, values);
    if (result.changes > 0) {
      res.json({ message: 'User updated successfully' });
    } else {
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get permissions for a user
router.get('/users/:id/permissions', authenticateToken, isAdmin, async (req, res) => {
  const db = req.db; // Assume db connection is attached to req by a middleware
  const userId = req.params.id;

  try {
    const permissions = await db.all(
      'SELECT permission, permitted FROM user_permissions WHERE user_id = ?',
      userId
    );

    if (permissions.length === 0) {
      return res.status(404).json({ error: 'User or permissions not found' });
    }

    res.json(permissions);
  } catch (error) {
    console.error('Error fetching user permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update permissions for a user
router.put('/users/:id/permissions', authenticateToken, isAdmin, async (req, res) => {
  const db = req.db;
  const userId = req.params.id;
  const { permissions } = req.body;

  if (!Array.isArray(permissions)) {
    return res.status(400).json({ error: 'Permissions must be an array' });
  }

  try {
    await db.run('BEGIN TRANSACTION');

    // Delete existing permissions
    await db.run('DELETE FROM user_permissions WHERE user_id = ?', userId);

    // Insert new permissions
    for (const perm of permissions) {
      if (typeof perm.permission !== 'string' || typeof perm.permitted !== 'boolean') {
        await db.run('ROLLBACK');
        return res.status(400).json({ error: 'Invalid permission format' });
      }

      await db.run(
        'INSERT INTO user_permissions (user_id, permission, permitted) VALUES (?, ?, ?)',
        [userId, perm.permission, perm.permitted ? 1 : 0]
      );
    }

    await db.run('COMMIT');

    res.json({ message: 'Permissions updated successfully' });
  } catch (error) {
    await db.run('ROLLBACK');
    console.error('Error updating user permissions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a single permission for a user
router.post('/users/:id/permissions', authenticateToken, isAdmin, async (req, res) => {
  const db = req.db;
  const userId = req.params.id;
  const { permission, permitted } = req.body;

  if (typeof permission !== 'string' || typeof permitted !== 'boolean') {
    return res.status(400).json({ error: 'Invalid permission format' });
  }

  try {
    const result = await db.run(
      'INSERT OR REPLACE INTO user_permissions (user_id, permission, permitted) VALUES (?, ?, ?)',
      [userId, permission, permitted ? 1 : 0]
    );

    res.status(201).json({ message: 'Permission added/updated successfully' });
  } catch (error) {
    console.error('Error adding user permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Remove a single permission for a user
router.delete('/users/:userId/permissions/:permission', authenticateToken, isAdmin, async (req, res) => {
  const db = req.db;
  const { userId, permission } = req.params;

  try {
    const result = await db.run(
      'DELETE FROM user_permissions WHERE user_id = ? AND permission = ?',
      [userId, permission]
    );

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Permission not found for this user' });
    }

    res.json({ message: 'Permission removed successfully' });
  } catch (error) {
    console.error('Error removing user permission:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
  console.log('WARNING: If this is the first run, please change the admin password immediately.');
  console.log('Use the /api/auth/login endpoint with email: admin@example.com and password: admin123');
  console.log('Then use the /api/users/:id endpoint to change the password.');
});