CREATE TABLE IF NOT EXISTS contact (
    id SERIAL PRIMARY KEY,
    phone_number VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For searching by phone number
CREATE INDEX IF NOT EXISTS idx_contact_phone_number ON contact(phone_number);