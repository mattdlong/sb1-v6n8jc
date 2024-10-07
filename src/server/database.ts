import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import bcrypt from 'bcrypt';

export async function setupDatabase() {
  const db = await open({
    filename: './database.sqlite',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS opportunity (
      key TEXT PRIMARY KEY,
      url TEXT,
      company TEXT NOT NULL,
      suburb TEXT,
      state TEXT,
      title TEXT NOT NULL,
      description TEXT,
      blurb TEXT,
      languages TEXT,
      salary TEXT,
      date DATE,
      status TEXT NOT NULL,
      date_status_changed DATE,
      user_status_changed_id TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS technology (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE
    );

    CREATE TABLE IF NOT EXISTS opportunity_technology (
      opportunity_key TEXT,
      technology_id INTEGER,
      type TEXT CHECK(type IN ('technology', 'tool')),
      PRIMARY KEY (opportunity_key, technology_id, type),
      FOREIGN KEY (opportunity_key) REFERENCES opportunity(key),
      FOREIGN KEY (technology_id) REFERENCES technology(id)
    );

    CREATE TABLE IF NOT EXISTS company (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,
      name TEXT NOT NULL,
      website_url TEXT,
      linkedin_url TEXT,
      blurb TEXT,
      suburb TEXT,
      state TEXT,
      employees INTEGER,
      FOREIGN KEY (key) REFERENCES opportunity(key)
    );

    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT,
      sex TEXT,
      linkedin_url TEXT,
      email_address TEXT,
      blurb TEXT,
      FOREIGN KEY (key) REFERENCES opportunity(key)
    );

    CREATE TABLE IF NOT EXISTS user (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      password TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      last_login TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS user_permissions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      permission TEXT NOT NULL,
      permitted BOOLEAN NOT NULL CHECK(permitted IN (0, 1)),
      FOREIGN KEY (user_id) REFERENCES user(id),
      UNIQUE(user_id, permission)
    );

    CREATE INDEX IF NOT EXISTS idx_opportunity_status ON opportunity(status);
    CREATE INDEX IF NOT EXISTS idx_company_name ON company(name);
    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email_address);
    CREATE INDEX IF NOT EXISTS idx_technology_name ON technology(name);
  `);

  // Function to create initial admin user
  async function createInitialAdminUser() {
    const adminEmail = 'admin@example.com';
    const adminPassword = 'admin123'; // This should be changed immediately after first login
    const adminName = 'Admin User';
    const adminRole = 'admin';

    const existingAdmin = await db.get('SELECT * FROM user WHERE role = ?', adminRole);

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await db.run(
        'INSERT INTO user (email, name, role, password) VALUES (?, ?, ?, ?)',
        [adminEmail, adminName, adminRole, hashedPassword]
      );

      const adminUser = await db.get('SELECT id FROM user WHERE email = ?', adminEmail);

      // Grant all permissions to the admin user
      const permissions = ['new', 'progressed', 'contacts_added', 'qualified', 'contacted', 'followed_up', 'replied', 'deleted', 'unqualified', 'administrator'];
      for (const permission of permissions) {
        await db.run(
          'INSERT INTO user_permissions (user_id, permission, permitted) VALUES (?, ?, ?)',
          [adminUser.id, permission, 1]
        );
      }

      console.log('Initial admin user created. Please change the password after first login.');
    }
  }

  // Call the function to create the initial admin user
  await createInitialAdminUser();

  return db;
}