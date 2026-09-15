import sqlite3
import bcrypt

def init_db():
    conn = sqlite3.connect('users.db')
    cursor = conn.cursor()
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT DEFAULT 'customer'
        )
    ''')
    
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quotations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            route_data TEXT NOT NULL,
            base_freight REAL NOT NULL,
            margin REAL NOT NULL,
            total_price REAL NOT NULL,
            status TEXT DEFAULT 'pending',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    
    cursor.execute("SELECT * FROM users WHERE role='admin'")
    admin = cursor.fetchone()
    
    if not admin:
        hashed_pw = bcrypt.hashpw('admin123'.encode('utf-8'), bcrypt.gensalt())
        cursor.execute(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            ('admin@agenticmaritime.com', hashed_pw.decode('utf-8'), 'admin')
        )
        
    conn.commit()
    conn.close()

if __name__ == "__main__":
    init_db()