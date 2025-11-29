/* ==========================================================
   Lookup Tables
   ========================================================== */

CREATE TABLE IF NOT EXISTS court_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type_name VARCHAR(50) NOT NULL
);

INSERT INTO court_types (type_name) VALUES 
('Padel'), ('Tennis'), ('Badminton'), ('Futsal');


CREATE TABLE IF NOT EXISTS booking_status (
  id INT AUTO_INCREMENT PRIMARY KEY,
  status_name VARCHAR(50) NOT NULL
);

INSERT INTO booking_status (status_name) VALUES
('pending'), ('confirmed'), ('cancelled');


/* ==========================================================
   Players
   ========================================================== */
CREATE TABLE IF NOT EXISTS players (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(100),
  phone VARCHAR(20),
  is_active TINYINT(1) DEFAULT 0,
  verification_token VARCHAR(255)
);

/* Dummy Players */
INSERT INTO players (email, password_hash, name, phone, is_active)
VALUES
('john@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'John Doe', '03001234567', 1),
('sara@example.com', '$2b$10$abcdefghijklmnopqrstuv', 'Sara Ali', '03111234567', 1);


/* ==========================================================
   Arena Owners
   ========================================================== */
CREATE TABLE IF NOT EXISTS arena_owners (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  phone VARCHAR(20)
);

INSERT INTO arena_owners (name, email, phone)
VALUES
('Ayan Merchant', 'ayan@example.com', '03009998888'),
('Hamza Khan', 'hamza@example.com', '03001112222');


/* ==========================================================
   Arenas
   ========================================================== */
CREATE TABLE IF NOT EXISTS arenas (
  id INT AUTO_INCREMENT PRIMARY KEY,
  owner_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  city VARCHAR(100) NOT NULL,
  address VARCHAR(255),
  pricePerHour INT DEFAULT NULL,
  availability ENUM('available', 'unavailable', 'closed') DEFAULT 'available',
  rating DECIMAL(3,2) DEFAULT 0.00,
  FOREIGN KEY (owner_id) REFERENCES arena_owners(id)
);

/* Dummy Arenas */
INSERT INTO arenas (owner_id, name, city, address, pricePerHour, availability, rating)
VALUES
(1, 'Clifton Padel Arena', 'Karachi', 'Clifton Block 5', 4500, 'available', 4.50),
(2, 'Gulshan Smash Arena', 'Karachi', 'Gulshan Block 10', 3500, 'available', 4.20),
(1, 'Defense Tennis Hub', 'Karachi', 'DHA Phase 6', 5000, 'closed', 4.00);


/* ==========================================================
   Arena Images
   ========================================================== */
CREATE TABLE IF NOT EXISTS arena_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  arena_id INT NOT NULL,
  image_path VARCHAR(255) NOT NULL,
  FOREIGN KEY (arena_id) REFERENCES arenas(id)
);

/* Dummy Arena Images (main images) */
INSERT INTO arena_images (arena_id, image_path)
VALUES
(1, '/assets/arena1_main.jpg'),
(2, '/assets/arena2_main.jpg'),
(3, '/assets/arena3_main.jpg');


/* ==========================================================
   Courts
   ========================================================== */
CREATE TABLE IF NOT EXISTS courts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  arena_id INT NOT NULL,
  court_type_id INT NOT NULL,
  name VARCHAR(100),
  FOREIGN KEY (arena_id) REFERENCES arenas(id),
  FOREIGN KEY (court_type_id) REFERENCES court_types(id)
);

/* Dummy Courts */
INSERT INTO courts (arena_id, court_type_id, name)
VALUES
(1, 1, 'Padel Court A'),
(1, 1, 'Padel Court B'),
(2, 2, 'Tennis Court A'),
(3, 3, 'Badminton Court A');


/* ==========================================================
   Bookings
   ========================================================== */
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  player_id INT NOT NULL,
  court_id INT NOT NULL,
  booking_date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status_id INT NOT NULL,
  FOREIGN KEY (player_id) REFERENCES players(id),
  FOREIGN KEY (court_id) REFERENCES courts(id),
  FOREIGN KEY (status_id) REFERENCES booking_status(id)
);

/* Dummy Bookings */
INSERT INTO bookings (player_id, court_id, booking_date, start_time, end_time, status_id)
VALUES
(1, 1, '2025-01-10', '14:00', '15:00', 2),
(2, 3, '2025-01-11', '16:00', '17:30', 1);
