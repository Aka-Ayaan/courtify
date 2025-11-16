-- Create DB
CREATE DATABASE IF NOT EXISTS courtify CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE courtify;

-- Lookup: court types and booking statuses (small static tables)
CREATE TABLE IF NOT EXISTS court_types (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(32) NOT NULL UNIQUE
);

INSERT INTO court_types (name) VALUES ('Futsal'), ('Cricket'), ('Paddle')
ON DUPLICATE KEY UPDATE name = name;

CREATE TABLE IF NOT EXISTS booking_status (
  id TINYINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  code VARCHAR(32) NOT NULL UNIQUE,
  description VARCHAR(255)
);

INSERT INTO booking_status (code, description) VALUES
('PENDING', 'User booked, awaiting payment/verification'),
('CONFIRMED', 'Booking confirmed and paid'),
('CANCELLED', 'Booking cancelled'),
('EXPIRED', 'Booking expired / time passed'),
('REJECTED', 'Payment rejected or admin rejected')
ON DUPLICATE KEY UPDATE code = code;

-- Players (regular users)
CREATE TABLE IF NOT EXISTS players (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20),
  name VARCHAR(150),
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Court Owners (separate login per arena)
CREATE TABLE IF NOT EXISTS court_owners (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(150) NOT NULL UNIQUE,
  email VARCHAR(255),
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  arena_name VARCHAR(255),  -- short repeated metadata for convenience
  is_verified TINYINT(1) DEFAULT 0, -- admin must set to 1 after verification
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Admins (separate table)
CREATE TABLE IF NOT EXISTS admins (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(150) NOT NULL UNIQUE,
  email VARCHAR(255),
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(64) DEFAULT 'superadmin',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Arenas (each arena assigned to a single court_owner.id)
CREATE TABLE IF NOT EXISTS arenas (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  owner_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(255) NOT NULL,
  address TEXT,
  city VARCHAR(100),
  latitude DECIMAL(10,7) NULL,
  longitude DECIMAL(10,7) NULL,
  phone VARCHAR(20),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (owner_id) REFERENCES court_owners(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Courts (multiple courts per arena)
CREATE TABLE IF NOT EXISTS courts (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  arena_id BIGINT UNSIGNED NOT NULL,
  type_id TINYINT UNSIGNED NOT NULL,
  name VARCHAR(255) NULL, -- e.g., "Court A"
  description TEXT,
  is_active TINYINT(1) DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (arena_id) REFERENCES arenas(id) ON DELETE CASCADE,
  FOREIGN KEY (type_id) REFERENCES court_types(id)
) ENGINE=InnoDB;

-- Court slots (concrete date/time slots). start_time uses TIME and slot_date uses DATE.
-- duration_hours: 1 or 2
CREATE TABLE IF NOT EXISTS court_slots (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  court_id BIGINT UNSIGNED NOT NULL,
  slot_date DATE NOT NULL,
  start_time TIME NOT NULL,
  duration_hours TINYINT UNSIGNED NOT NULL CHECK (duration_hours IN (1,2)),
  price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  status VARCHAR(32) NOT NULL DEFAULT 'AVAILABLE', -- AVAILABLE, BOOKED, OWNER_BLOCKED, etc.
  created_by ENUM('SYSTEM','OWNER','ADMIN') NOT NULL DEFAULT 'SYSTEM',
  created_by_id BIGINT UNSIGNED NULL, -- helpful to track owner/admin who blocked the slot
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_court_datetime (court_id, slot_date, start_time),
  FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Payments
CREATE TABLE IF NOT EXISTS payments (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  player_id BIGINT UNSIGNED NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  method VARCHAR(64) NOT NULL, -- 'EASYPaisa', 'MANUAL_SCREENSHOT'
  provider_txn_id VARCHAR(255) NULL, -- easypaisa transaction id if provided
  receipt_image_path VARCHAR(1024) NULL, -- if user uploaded screenshot (optional)
  is_verified TINYINT(1) DEFAULT 0, -- owner or admin verifies screenshot
  verified_by_owner_id BIGINT UNSIGNED NULL,
  verified_at DATETIME NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (verified_by_owner_id) REFERENCES court_owners(id)
) ENGINE=InnoDB;

-- Bookings: a booking references a specific slot; multiple constraints ensure slot is reserved per booking
CREATE TABLE IF NOT EXISTS bookings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  player_id BIGINT UNSIGNED NOT NULL,
  slot_id BIGINT UNSIGNED NOT NULL,
  booked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  status_id TINYINT UNSIGNED NOT NULL DEFAULT 1, -- refers to booking_status
  payment_id BIGINT UNSIGNED NULL,
  cancellation_reason TEXT NULL,
  notes TEXT NULL,
  FOREIGN KEY (player_id) REFERENCES players(id) ON DELETE CASCADE,
  FOREIGN KEY (slot_id) REFERENCES court_slots(id) ON DELETE CASCADE,
  FOREIGN KEY (status_id) REFERENCES booking_status(id),
  FOREIGN KEY (payment_id) REFERENCES payments(id)
) ENGINE=InnoDB;

-- Audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  actor_type ENUM('PLAYER','OWNER','ADMIN','SYSTEM') NOT NULL,
  actor_id BIGINT UNSIGNED NULL,
  action VARCHAR(255) NOT NULL,
  target_table VARCHAR(255) NULL,
  target_id BIGINT UNSIGNED NULL,
  details JSON NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- Indexes for speed: searching nearby arenas (lat/lng) and searching slots by date/time/court
CREATE INDEX idx_arenas_lat_lng ON arenas(latitude, longitude);
CREATE INDEX idx_slots_court_date_time ON court_slots (court_id, slot_date, start_time);
CREATE INDEX idx_bookings_player ON bookings (player_id);
CREATE INDEX idx_payments_player ON payments (player_id);
