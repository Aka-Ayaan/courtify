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
  phone VARCHAR(20),
  password_hash VARCHAR(255) NOT NULL,
  is_active TINYINT(1) DEFAULT 0,
  verification_token VARCHAR(255)
);

INSERT INTO arena_owners (name, email, phone, password_hash, is_active)
VALUES
('Ayaan Merchant', 'ayaan@example.com', '03009998888', '$2b$10$abcdefghijklmnopqrstuv', 1),
('Hamza Khan', 'hamza@example.com', '03001112222', '$2b$10$abcdefghijklmnopqrstuv', 1);


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
  timing VARCHAR(100),              -- NEW
  amenities JSON,                   -- NEW: ["Showers","Lockers",...]
  description TEXT,                 -- NEW
  rules JSON,                       -- NEW: ["Wear proper kit", "No smoking", ...]
  FOREIGN KEY (owner_id) REFERENCES arena_owners(id)
);

/* Dummy Arenas */
INSERT INTO arenas (
  owner_id, 
  name, 
  city, 
  address, 
  pricePerHour, 
  availability, 
  rating,
  timing,
  amenities,
  description,
  rules
)
VALUES
(1,
 'Clifton Padel Arena',
 'Karachi',
 'Clifton Block 5',
 4500,
 'available',
 4.50,
 '8 AM - 11 PM',
 JSON_ARRAY('Changing Rooms', 'Showers', 'Parking', 'Equipment Rental'),
 'A premium padel facility located near Clifton Beach, known for its well-maintained courts and vibrant community events.',
 JSON_ARRAY('Proper sports shoes required', 'Arrive 10 minutes early', 'Respect booking times')
),

(2,
 'Gulshan Smash Arena',
 'Karachi',
 'Gulshan Block 10',
 3500,
 'available',
 4.20,
 '9 AM - 12 AM',
 JSON_ARRAY('Locker Room', 'Café', 'WiFi', 'Rental Rackets'),
 'A popular neighborhood sports venue offering high-quality courts suitable for both beginners and experienced players.',
 JSON_ARRAY('No smoking inside venue', 'Follow staff instructions', 'Bring your own water bottle')
),

(1,
 'Defense Tennis Hub',
 'Karachi',
 'DHA Phase 6',
 5000,
 'closed',
 4.00,
 '7 AM - 10 PM',
 JSON_ARRAY('Rest Area', 'Parking', 'Professional Coaches'),
 'A well-established tennis facility in DHA offering multiple courts and coaching for players of all ages.',
 JSON_ARRAY('Coaching sessions must be pre-booked', 'Wear proper tennis attire', 'Do not litter on the courts')
);



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
  image_path VARCHAR(255),     -- NEW COLUMN ADDED
  FOREIGN KEY (arena_id) REFERENCES arenas(id),
  FOREIGN KEY (court_type_id) REFERENCES court_types(id)
);

/* Dummy Courts */
INSERT INTO courts (arena_id, court_type_id, name, image_path)
VALUES
(1, 1, 'Padel Court A', '/assets/courts/padel_a.jpg'),
(1, 1, 'Padel Court B', '/assets/courts/padel_b.jpg'),
(2, 2, 'Tennis Court A', '/assets/courts/tennis_a.jpg'),
(3, 3, 'Badminton Court A', '/assets/courts/badminton_a.jpg');


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
