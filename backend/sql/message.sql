CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    integer contact_id NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    foreign key (contact_id) references contact(id),
);
