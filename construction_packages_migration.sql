-- Construction Packages Migration
-- Run this in the Supabase SQL Editor

-- 1. DELETE existing data (Optional: ONLY if you want to replace it)
-- TRUNCATE TABLE feature_values CASCADE;
-- DELETE FROM features;
-- DELETE FROM packages;

-- 2. INSERT PACKAGES
INSERT INTO packages (name, price, display_order, is_active)
VALUES 
('Standard / Basic', '₹2250', 1, true),
('Premium / Elite', '₹2550', 2, true),
('Luxury', '₹3000', 3, true);

-- 3. INSERT FEATURES AND FEATURE VALUES
-- This part is complex to do in one SQL script without package IDs.
-- Let's use a temporary table to handle the mapping or use CTEs.

WITH pkg AS (SELECT id, name FROM packages)
INSERT INTO features (title, type, value_mode, display_order)
VALUES
('DESIGN & ENGINEERING', 'heading', 'boolean', 10),
('Soil Test', 'feature', 'boolean', 11),
('Borewell Test', 'feature', 'boolean', 12),
('2D Floor Plan', 'feature', 'boolean', 13),
('3D Elevation', 'feature', 'text', 14),
('Structural Design', 'feature', 'boolean', 15),
('Electrical Drawing', 'feature', 'boolean', 16),

('STRUCTURE', 'heading', 'boolean', 20),
('Cement', 'feature', 'text', 21),
('Steel', 'feature', 'text', 22),
('RCC Grade', 'feature', 'text', 23),
('Foundation', 'feature', 'text', 24),
('Foundation Waterproofing', 'feature', 'text', 25),

('FLOOR STRUCTURE', 'heading', 'boolean', 30),
('Floor Height', 'feature', 'text', 31),
('Parking Height', 'feature', 'text', 32),
('Lintel', 'feature', 'text', 33),
('Loft', 'feature', 'text', 34),
('Ceiling Height', 'feature', 'text', 35),
('Sand', 'feature', 'text', 36),
('Plastering', 'feature', 'text', 37),
('Brick Work', 'feature', 'text', 38),

('ELECTRICAL', 'heading', 'boolean', 40),
('Wiring', 'feature', 'text', 41),
('Switch MCB', 'feature', 'text', 42),
('Switch Model', 'feature', 'text', 43),
('Main Board', 'feature', 'text', 44),

('PLUMBING', 'heading', 'boolean', 50),
('CPVC Concealed', 'feature', 'text', 51),
('Potable Cold Water', 'feature', 'text', 52),
('Grey Water Pipes', 'feature', 'text', 53),

('KITCHEN', 'heading', 'boolean', 60),
('Wall Tiles', 'feature', 'text', 61),
('Flooring', 'feature', 'text', 62),
('Countertop', 'feature', 'text', 63),
('Sink', 'feature', 'text', 64),

('BATHROOM', 'heading', 'boolean', 70),
-- We need to re-use names like "Wall Tiles" but features usually have unique names? 
-- Let's prepend section name if needed or just use titles.

('Bathroom Wall Tiles', 'feature', 'text', 71),
('Fittings', 'feature', 'text', 72),

('FLOORING', 'heading', 'boolean', 80),
('Parking Flooring', 'feature', 'text', 81),
('Living / Bedroom Flooring', 'feature', 'text', 82),
('Staircase Flooring', 'feature', 'text', 83),
('Balcony Flooring', 'feature', 'text', 84),

('UTILITY', 'heading', 'boolean', 90),
('Utility Flooring', 'feature', 'text', 91),
('Counter Top', 'feature', 'boolean', 92),
('CP Fittings', 'feature', 'text', 93),
('Utility Sink', 'feature', 'boolean', 94),

('DOORS & JOINERY', 'heading', 'boolean', 100),
('Main Door Frame', 'feature', 'text', 101),
('Door Accessories', 'feature', 'text', 102),
('Bedroom Door', 'feature', 'text', 103),
('Bathroom Door', 'feature', 'text', 104),
('Windows', 'feature', 'text', 105),

('RAILINGS', 'heading', 'boolean', 110),
('Staircase Railing', 'feature', 'text', 111),
('Balcony Railing', 'feature', 'text', 112),

('PAINT', 'heading', 'boolean', 120),
('Internal Walls', 'feature', 'text', 121),
('External Paint', 'feature', 'text', 122),

('EXTRA ELECTRICAL', 'heading', 'boolean', 130),
('AC Points', 'feature', 'text', 131),
('EV Charging', 'feature', 'boolean', 132),
('Inverter Wiring', 'feature', 'boolean', 133),
('Pressure Pump Provision', 'feature', 'boolean', 134),
('Solar Heater Provision', 'feature', 'boolean', 135),
('CCTV Wiring', 'feature', 'boolean', 136);

-- Now, inserting values for each package... This is hard to do without knowing the IDs.
-- Let's use a mapping script in JavaScript instead to insert everything via Supabase.
