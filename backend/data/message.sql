CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contact(id)
);
