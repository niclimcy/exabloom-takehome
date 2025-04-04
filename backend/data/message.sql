CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    contact_id INTEGER NOT NULL,
    content TEXT NOT NULL,
    content_vector TSVECTOR GENERATED ALWAYS AS (to_tsvector('english', content)) STORED,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (contact_id) REFERENCES contact(id)
);

-- For recent messages queries
CREATE INDEX IF NOT EXISTS idx_message_created_at ON message (created_at DESC);
-- For searching message content
CREATE INDEX IF NOT EXISTS idx_message_content_vector ON message USING GIN (content_vector);
-- For searching by contact_id
CREATE INDEX IF NOT EXISTS idx_message_contact_id ON message (contact_id);
