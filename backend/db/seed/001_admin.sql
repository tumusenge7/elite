-- Seed default admin user. Replace password hash if desired.
-- Password hash is bcrypt for: admin123

INSERT INTO users (name, email, password_hash, role)
VALUES ('Admin', 'admin@elite.com', '$2b$10$k8TJ9oTQf9q0q8Pov1qM0O5s2dYx5S9G0R4oO4Fv5wZlM0w8yXQ8m', 'admin')
ON DUPLICATE KEY UPDATE
  name = VALUES(name),
  role = VALUES(role);

