-- Construction Packages Migration (FINAL FIX)
-- Run this in the Supabase SQL Editor.

-- 1. DELETE existing data
TRUNCATE TABLE feature_values CASCADE;
DELETE FROM features;
DELETE FROM packages;

-- 2. INSERT PACKAGES
-- We provide both 'title' and 'name' columns to satisfy the database schema.
INSERT INTO packages (id, title, name, price, display_order, is_active)
VALUES 
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'Standard / Basic', 'Standard / Basic', '₹2250', 1, true),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'Premium / Elite', 'Premium / Elite', '₹2550', 2, true),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'Luxury', 'Luxury', '₹3000', 3, true);

-- 3. INSERT FEATURES
INSERT INTO features (id, title, type, value_mode, display_order) VALUES 
('f100', 'DESIGN & ENGINEERING', 'heading', 'boolean', 10),
('f1', 'Soil Test', 'feature', 'boolean', 11),
('f2', 'Borewell Test', 'feature', 'boolean', 12),
('f3', '2D Floor Plan', 'feature', 'boolean', 13),
('f4', '3D Elevation', 'feature', 'text', 14),
('f5', 'Structural Design', 'feature', 'boolean', 15),
('f6', 'Electrical Drawing', 'feature', 'boolean', 16),
-- STRUCTURE
('f200', 'STRUCTURE', 'heading', 'boolean', 20),
('f7', 'Cement', 'feature', 'text', 21),
('f8', 'Steel', 'feature', 'text', 22),
('f9', 'RCC Grade', 'feature', 'text', 23),
('f10', 'Foundation', 'feature', 'text', 24),
('f11', 'Foundation Waterproofing', 'feature', 'text', 25);

-- 4. INSERT VALUES
INSERT INTO feature_values (package_id, feature_id, type, value) VALUES 
-- Design
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f1', 'dash', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f1', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f1', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f2', 'dash', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f2', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f2', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f3', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f3', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f3', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f4', 'text', 'Basic'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f4', 'text', 'Premium'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f4', 'text', 'Luxury'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f5', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f5', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f5', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f6', 'dash', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f6', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f6', 'tick', ''),
-- Structure
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f7', 'text', 'Dalmia / Zuari / Ultratech'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f7', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f7', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f8', 'text', 'GSK / PWD'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f8', 'text', 'APS Steel'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f8', 'text', 'TATA'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f9', 'text', 'M20 / M25'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f9', 'text', 'M20 / M25'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f9', 'text', 'M25'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f10', 'text', 'Included'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f10', 'text', 'Included'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f10', 'text', 'Included'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f11', 'text', '✖'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f11', 'text', 'Dr Fixit Bitufix'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f11', 'text', 'Dr Fixit Bitufix');

-- Note: This is a partial script. Use it to verify the fix for 'title' column. 
-- If successful, I will provide the rest of the 50+ features.
