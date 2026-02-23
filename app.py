from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sqlite3
import os
from datetime import datetime

app = Flask(__name__, static_folder='static', static_url_path='')
CORS(app)

DB_PATH = os.environ.get('DB_PATH', 'portfolio.db')

def init_db():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()

@app.route('/')
def index():
    return send_from_directory('static', 'index.html')

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    data = request.get_json()
    if not data or not data.get('name') or not data.get('email') or not data.get('message'):
        return jsonify({'error': 'Name, email, and message are required.'}), 400
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute(
        'INSERT INTO contacts (name, email, subject, message, created_at) VALUES (?,?,?,?,?)',
        (data['name'], data['email'], data.get('subject',''), data['message'], datetime.utcnow().isoformat())
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True, 'message': 'Message received! I will get back to you soon.'})

@app.route('/api/contacts', methods=['GET'])
def get_contacts():
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('SELECT id, name, email, subject, message, created_at FROM contacts ORDER BY created_at DESC')
    rows = c.fetchall()
    conn.close()
    return jsonify([{'id':r[0],'name':r[1],'email':r[2],'subject':r[3],'message':r[4],'created_at':r[5]} for r in rows])

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=False)