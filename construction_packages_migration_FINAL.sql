-- Construction Packages Migration (FINAL & ROBUST)
-- Run this in the Supabase SQL Editor.

-- 1. DELETE existing data
TRUNCATE TABLE feature_values CASCADE;
DELETE FROM features;
DELETE FROM packages;

-- 2. INSERT PACKAGES
-- Satisfying ALL potentially non-nullable columns (title, name, description, price, etc.)
INSERT INTO packages (id, title, name, description, price, display_order, is_active, highlighted)
VALUES 
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'Standard / Basic', 'Standard / Basic', 'Standard construction package with essential features.', '₹2250', 1, true, false),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'Premium / Elite', 'Premium / Elite', 'Premium construction package with upgraded materials and better finishes.', '₹2550', 2, true, false),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'Luxury', 'Luxury', 'Luxury construction package with top-tier materials, advanced engineering, and premium finishes.', '₹3000', 3, true, true);

-- 3. INSERT ALL FEATURES
INSERT INTO features (id, title, type, value_mode, display_order) VALUES 
-- DESIGN & ENGINEERING
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
('f11', 'Foundation Waterproofing', 'feature', 'text', 25),
-- FLOOR STRUCTURE
('f300', 'FLOOR STRUCTURE', 'heading', 'boolean', 30),
('f12', 'Floor Height', 'feature', 'text', 31),
('f13', 'Parking Height', 'feature', 'text', 32),
('f14', 'Lintel', 'feature', 'text', 33),
('f15', 'Loft', 'feature', 'text', 34),
('f16', 'Ceiling Height', 'feature', 'text', 35),
('f17', 'Sand', 'feature', 'text', 36),
('f18', 'Plastering', 'feature', 'text', 37),
('f19', 'Brick Work', 'feature', 'text', 38),
-- ELECTRICAL
('f400', 'ELECTRICAL', 'heading', 'boolean', 40),
('f20', 'Wiring', 'feature', 'text', 41),
('f21', 'Switch MCB', 'feature', 'text', 42),
('f22', 'Switch Model', 'feature', 'text', 43),
('f23', 'Main Board', 'feature', 'text', 44),
-- PLUMBING
('f500', 'PLUMBING', 'heading', 'boolean', 50),
('f24', 'CPVC Concealed', 'feature', 'text', 51),
('f25', 'Potable Cold Water', 'feature', 'text', 52),
('f26', 'Grey Water Pipes', 'feature', 'text', 53),
-- KITCHEN
('f600', 'KITCHEN', 'heading', 'boolean', 60),
('f27', 'Kitchen Wall Tiles', 'feature', 'text', 61),
('f28', 'Kitchen Flooring', 'feature', 'text', 62),
('f29', 'Countertop', 'feature', 'text', 63),
('f30', 'Sink', 'feature', 'text', 64),
-- BATHROOM
('f700', 'BATHROOM', 'heading', 'boolean', 70),
('f31', 'Bathroom Wall Tiles', 'feature', 'text', 71),
('f32', 'Fittings', 'feature', 'text', 72),
-- FLOORING
('f800', 'FLOORING', 'heading', 'boolean', 80),
('f33', 'Parking Flooring', 'feature', 'text', 81),
('f34', 'Living / Bedroom Flooring', 'feature', 'text', 82),
('f35', 'Staircase Flooring', 'feature', 'text', 83),
('f36', 'Balcony Flooring', 'feature', 'text', 84),
-- UTILITY
('f900', 'UTILITY', 'heading', 'boolean', 90),
('f37', 'Utility Flooring', 'feature', 'text', 91),
('f38', 'Utility Counter Top', 'feature', 'boolean', 92),
('f39', 'CP Fittings', 'feature', 'text', 93),
('f40', 'Utility Sink', 'feature', 'boolean', 94),
-- DOORS & JOINERY
('f1000', 'DOORS & JOINERY', 'heading', 'boolean', 100),
('f41', 'Main Door Frame', 'feature', 'text', 101),
('f42', 'Door Accessories', 'feature', 'text', 102),
('f43', 'Bedroom Door', 'feature', 'text', 103),
('f44', 'Bathroom Door', 'feature', 'text', 104),
('f45', 'Windows', 'feature', 'text', 105),
-- RAILINGS
('f1100', 'RAILINGS', 'heading', 'boolean', 110),
('f46', 'Staircase Railing', 'feature', 'text', 111),
('f47', 'Balcony Railing', 'feature', 'text', 112),
-- PAINT
('f1200', 'PAINT', 'heading', 'boolean', 120),
('f48', 'Internal Walls', 'feature', 'text', 121),
('f49', 'External Paint', 'feature', 'text', 122),
-- EXTRA ELECTRICAL
('f1300', 'EXTRA ELECTRICAL', 'heading', 'boolean', 130),
('f50', 'AC Points', 'feature', 'text', 131),
('f51', 'EV Charging', 'feature', 'boolean', 132),
('f52', 'Inverter Wiring', 'feature', 'boolean', 133),
('f53', 'Pressure Pump Provision', 'feature', 'boolean', 134),
('f54', 'Solar Heater Provision', 'feature', 'boolean', 135),
('f55', 'CCTV Wiring', 'feature', 'boolean', 136);

-- 4. INSERT VALUES
-- Values are inserted for f1-f55 across all 3 packages
INSERT INTO feature_values (package_id, feature_id, type, value) VALUES 
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f1', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f1', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f1', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f2', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f2', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f2', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f3', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f3', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f3', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f4', 'text', 'Basic'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f4', 'text', 'Premium'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f4', 'text', 'Luxury'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f5', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f5', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f5', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f6', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f6', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f6', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f7', 'text', 'Dalmia / Zuari / Ultratech'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f7', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f7', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f8', 'text', 'GSK / PWD'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f8', 'text', 'APS Steel'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f8', 'text', 'TATA'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f9', 'text', 'M20 / M25'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f9', 'text', 'M20 / M25'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f9', 'text', 'M25'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f10', 'text', 'Included'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f10', 'text', 'Included'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f10', 'text', 'Included'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f11', 'text', '✖'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f11', 'text', 'Dr Fixit Bitufix'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f11', 'text', 'Dr Fixit Bitufix'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f12', 'text', '3 ft'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f12', 'text', '3''6 ft'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f12', 'text', '4 ft'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f13', 'text', '10 inch from pavement'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f13', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f13', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f14', 'text', 'Through Lintel'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f14', 'text', 'Through Lintel'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f14', 'text', 'Through Lintel'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f15', 'text', 'One Loft (Bedroom & Kitchen)'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f15', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f15', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f16', 'text', '10 ft slab to slab'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f16', 'text', '10''6 slab to slab'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f16', 'text', '11 ft slab'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f17', 'text', 'M Sand'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f17', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f17', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f18', 'text', 'Waterproof admixture'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f18', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f18', 'text', 'Fibre Reinforced Plastering'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f19', 'text', 'Red Box Bricks'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f19', 'text', 'Box Finish Red Brick'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f19', 'text', 'Wire Cut Bricks'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f20', 'text', 'Orbit / Polycab FRLSH'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f20', 'text', 'RR / Polycab FRLSH'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f20', 'text', 'Polycab FRLSH'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f21', 'text', 'Legrand / Schneider / Roma'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f21', 'text', 'Legrand / Schneider'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f21', 'text', 'Legrand Schneider Anterior'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f22', 'text', 'Alizy'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f22', 'text', 'Lyncus'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f22', 'text', 'Premium'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f23', 'text', 'Wooden Open Type'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f23', 'text', 'Steel Box'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f23', 'text', 'Panel Box'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f24', 'text', 'Ashirvad / Finolex'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f24', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f24', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f25', 'text', 'UPVC'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f25', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f25', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f26', 'text', 'Neopro / Supreme'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f26', 'text', 'Finolex'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f26', 'text', 'Finolex'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f27', 'text', 'upto 2 ft – ₹50'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f27', 'text', '₹70'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f27', 'text', '₹90'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f28', 'text', '₹50'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f28', 'text', '₹70'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f28', 'text', '₹90'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f29', 'text', 'Granite ₹150'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f29', 'text', 'Granite ₹180'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f29', 'text', 'Granite ₹200'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f30', 'text', 'SS Sink ₹2000'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f30', 'text', 'SS Sink or Quartz ₹7500'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f30', 'text', 'Quartz ₹12000'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f31', 'text', '₹40 upto 7 ft'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f31', 'text', '₹50 upto 9 ft'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f31', 'text', '₹60 upto 10 ft'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f32', 'text', 'Parryware / Essco ₹15000'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f32', 'text', 'Rube / Essco / Jaguar ₹30000'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f32', 'text', 'Kohler ₹40000'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f33', 'text', 'Any Tiles ₹40/sqft'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f33', 'text', 'Kajaria / Johnson ₹60'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f33', 'text', 'Simpolo ₹70'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f34', 'text', '₹50'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f34', 'text', 'Granite ₹180'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f34', 'text', 'Granite ₹200'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f35', 'text', 'Granite ₹110'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f35', 'text', 'Granite ₹180'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f35', 'text', 'Granite ₹200'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f36', 'text', 'Designer Tile ₹50'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f36', 'text', 'Designer Tile ₹70'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f36', 'text', 'Designer Tile ₹90'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f37', 'text', '₹50'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f37', 'text', '₹70'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f37', 'text', '₹90'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f38', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f38', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f38', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f39', 'text', '₹2000'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f39', 'text', '₹3000'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f39', 'text', '₹4000'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f40', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f40', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f40', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f41', 'text', 'Neem / Bamboo / Mixed'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f41', 'text', 'Nimbhar 1st Quality'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f41', 'text', 'Nimbhar Premium'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f42', 'text', 'upto ₹5000'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f42', 'text', 'upto ₹7000'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f42', 'text', 'upto ₹8000'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f43', 'text', '3x7'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f43', 'text', '3x7'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f43', 'text', '3x8'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f44', 'text', '2.6 x 7 UPVC'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f44', 'text', '2.6 x 7 UPVC'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f44', 'text', '2.6 x 8 UPVC / ABS'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f45', 'text', 'White / Ashara'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f45', 'text', 'Prominence'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f45', 'text', 'Prominence'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f46', 'text', 'MS'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f46', 'text', 'SS + MS'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f46', 'text', 'Glass'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f47', 'text', 'MS Grill'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f47', 'text', 'SS'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f47', 'text', 'Glass'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f48', 'text', 'Asian / Berger / Nerolac'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f48', 'text', 'Premium Range'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f48', 'text', 'Royal'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f49', 'text', '1 Coat Damp Proof + Apex'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f49', 'text', '2 Coat Damp Proof + Ultima'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f49', 'text', 'Apex Ultima'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f50', 'text', 'Hall / Bedroom'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f50', 'text', 'Same'), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f50', 'text', 'Same'),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f51', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f51', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f51', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f52', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f52', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f52', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f53', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f53', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f53', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f54', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f54', 'dash', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f54', 'tick', ''),
('46868bf6-6f62-4f0d-8b9c-ad0e1f203101', 'f55', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203102', 'f55', 'tick', ''), ('46868bf6-6f62-4f0d-8b9c-ad0e1f203103', 'f55', 'tick', '');
