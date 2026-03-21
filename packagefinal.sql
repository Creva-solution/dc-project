-- Construction Packages Migration (FINAL VERSION - FULL DATA)
-- Run this in the Supabase SQL Editor.

DO $$ 
DECLARE 
    pkg_std UUID := '46868bf6-6f62-4f0d-8b9c-ad0e1f203101';
    pkg_pre UUID := '46868bf6-6f62-4f0d-8b9c-ad0e1f203102';
    pkg_lux UUID := '46868bf6-6f62-4f0d-8b9c-ad0e1f203103';
    
    f_id UUID;
BEGIN
    -- 1. CLEANUP existing data
    DELETE FROM feature_values;
    DELETE FROM features;
    DELETE FROM packages;

    -- 2. INSERT PACKAGES
    INSERT INTO packages (id, title, name, description, price, display_order, is_active, highlighted)
    VALUES 
    (pkg_std, 'Standard / Basic', 'Standard / Basic', 'Standard construction with essential features.', '₹2250', 1, true, false),
    (pkg_pre, 'Premium / Elite', 'Premium / Elite', 'High-quality materials and enhanced design.', '₹2550', 2, true, false),
    (pkg_lux, 'Luxury', 'Luxury', 'Premium materials and top-tier engineering.', '₹3000', 3, true, true);

    -- 3. INSERT FEATURES & VALUES (Sorted by Category)

    -- --- 2. DESIGN & ENGINEERING ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('DESIGN & ENGINEERING', 'heading', 'boolean', 10);
    
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Soil Test', 'feature', 'boolean', 11) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'dash'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Borewell Test', 'feature', 'boolean', 12) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'dash'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('2D Floor Plan', 'feature', 'boolean', 13) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'tick'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('3D Elevation', 'feature', 'text', 14) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Basic'), (pkg_pre, f_id, 'text', 'Premium'), (pkg_lux, f_id, 'text', 'Luxury');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Structural Design', 'feature', 'boolean', 15) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'tick'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Electrical Drawing', 'feature', 'boolean', 16) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'dash'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    -- --- 3. STRUCTURE ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('STRUCTURE', 'heading', 'boolean', 20);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Cement', 'feature', 'text', 21) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Dalmia / Zuari / Ultratech'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Same');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Steel', 'feature', 'text', 22) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'GSK / PWD'), (pkg_pre, f_id, 'text', 'APS Steel'), (pkg_lux, f_id, 'text', 'TATA');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('RCC Grade', 'feature', 'text', 23) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'M20 / M25'), (pkg_pre, f_id, 'text', 'M20 / M25'), (pkg_lux, f_id, 'text', 'M25');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Foundation', 'feature', 'text', 24) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Included'), (pkg_pre, f_id, 'text', 'Included'), (pkg_lux, f_id, 'text', 'Included');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Foundation Waterproofing', 'feature', 'text', 25) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'dash'), (pkg_pre, f_id, 'text', 'Dr Fixit Bitufix'), (pkg_lux, f_id, 'text', 'Dr Fixit Bitufix');

    -- --- 4. FLOOR STRUCTURE ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('FLOOR STRUCTURE', 'heading', 'boolean', 30);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Floor Height', 'feature', 'text', 31) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '3 ft'), (pkg_pre, f_id, 'text', '3''6 ft'), (pkg_lux, f_id, 'text', '4 ft');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Parking Height', 'feature', 'text', 32) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '10 inch from pavement'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Same');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Lintel', 'feature', 'text', 33) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Through Lintel'), (pkg_pre, f_id, 'text', 'Through Lintel'), (pkg_lux, f_id, 'text', 'Through Lintel');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Loft', 'feature', 'text', 34) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'One Loft (Bedroom & Kitchen)'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Same');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Ceiling Height', 'feature', 'text', 35) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '10 ft slab to slab'), (pkg_pre, f_id, 'text', '10''6 slab to slab'), (pkg_lux, f_id, 'text', '11 ft slab');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Sand', 'feature', 'text', 36) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'M Sand'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Same');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Plastering', 'feature', 'text', 37) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Waterproof admixture'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Fibre Reinforced Plastering');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Brick Work', 'feature', 'text', 38) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Red Box Bricks'), (pkg_pre, f_id, 'text', 'Box Finish Red Brick'), (pkg_lux, f_id, 'text', 'Wire Cut Bricks');

    -- --- 5. ELECTRICAL ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('ELECTRICAL', 'heading', 'boolean', 40);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Wiring', 'feature', 'text', 41) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Orbit / Polycab FRLSH'), (pkg_pre, f_id, 'text', 'RR / Polycab FRLSH'), (pkg_lux, f_id, 'text', 'Polycab FRLSH');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Switch MCB', 'feature', 'text', 42) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Legrand / Schneider / Roma'), (pkg_pre, f_id, 'text', 'Legrand / Schneider'), (pkg_lux, f_id, 'text', 'Legrand Schneider Anterior');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Switch Model', 'feature', 'text', 43) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Alizy'), (pkg_pre, f_id, 'text', 'Lyncus'), (pkg_lux, f_id, 'text', 'Premium');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Main Board', 'feature', 'text', 44) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Wooden Open Type'), (pkg_pre, f_id, 'text', 'Steel Box'), (pkg_lux, f_id, 'text', 'Panel Box');

    -- --- 6. PLUMBING ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('PLUMBING', 'heading', 'boolean', 50);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('CPVC Concealed', 'feature', 'text', 51) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Ashirvad / Finolex'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Same');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Potable Cold Water', 'feature', 'text', 52) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'UPVC'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Same');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Grey Water Pipes', 'feature', 'text', 53) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Neopro / Supreme'), (pkg_pre, f_id, 'text', 'Finolex'), (pkg_lux, f_id, 'text', 'Finolex');

    -- --- 7. KITCHEN ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('KITCHEN', 'heading', 'boolean', 60);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Kitchen Wall Tiles', 'feature', 'text', 61) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'upto 2 ft – ₹50'), (pkg_pre, f_id, 'text', '₹70'), (pkg_lux, f_id, 'text', '₹90');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Kitchen Flooring', 'feature', 'text', 62) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '₹50'), (pkg_pre, f_id, 'text', '₹70'), (pkg_lux, f_id, 'text', '₹90');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Kitchen Countertop', 'feature', 'text', 63) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Granite ₹150'), (pkg_pre, f_id, 'text', 'Granite ₹180'), (pkg_lux, f_id, 'text', 'Granite ₹200');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Kitchen Sink', 'feature', 'text', 64) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'SS Sink ₹2000'), (pkg_pre, f_id, 'text', 'SS Sink or Quartz ₹7500'), (pkg_lux, f_id, 'text', 'Quartz ₹12000');

    -- --- 8. BATHROOM ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('BATHROOM', 'heading', 'boolean', 70);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Bathroom Wall Tiles', 'feature', 'text', 71) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '₹40 upto 7 ft'), (pkg_pre, f_id, 'text', '₹50 upto 9 ft'), (pkg_lux, f_id, 'text', '₹60 upto 10 ft');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Bathroom Fittings', 'feature', 'text', 72) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Parryware / Essco ₹15000'), (pkg_pre, f_id, 'text', 'Rube / Essco / Jaguar ₹30000'), (pkg_lux, f_id, 'text', 'Kohler ₹40000');

    -- --- 9. FLOORING ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('FLOORING', 'heading', 'boolean', 80);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Parking Flooring', 'feature', 'text', 81) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Any Tiles ₹40/sqft'), (pkg_pre, f_id, 'text', 'Kajaria / Johnson ₹60'), (pkg_lux, f_id, 'text', 'Simpolo ₹70');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Living / Bedroom Flooring', 'feature', 'text', 82) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '₹50'), (pkg_pre, f_id, 'text', 'Granite ₹180'), (pkg_lux, f_id, 'text', 'Granite ₹200');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Staircase Flooring', 'feature', 'text', 83) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Granite ₹110'), (pkg_pre, f_id, 'text', 'Granite ₹180'), (pkg_lux, f_id, 'text', 'Granite ₹200');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Balcony Flooring', 'feature', 'text', 84) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Designer Tile ₹50'), (pkg_pre, f_id, 'text', 'Designer Tile ₹70'), (pkg_lux, f_id, 'text', 'Designer Tile ₹90');

    -- --- 10. UTILITY ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('UTILITY', 'heading', 'boolean', 90);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Utility Flooring', 'feature', 'text', 91) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '₹50'), (pkg_pre, f_id, 'text', '₹70'), (pkg_lux, f_id, 'text', '₹90');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Utility Counter Top', 'feature', 'boolean', 92) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'dash'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Utility CP Fittings', 'feature', 'text', 93) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '₹2000'), (pkg_pre, f_id, 'text', '₹3000'), (pkg_lux, f_id, 'text', '₹4000');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Utility Sink', 'feature', 'boolean', 94) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'dash'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    -- --- 11. DOORS & JOINERY ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('DOORS & JOINERY', 'heading', 'boolean', 100);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Main Door Frame', 'feature', 'text', 101) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Neem / Bamboo / Mixed'), (pkg_pre, f_id, 'text', 'Nimbhar 1st Quality'), (pkg_lux, f_id, 'text', 'Nimbhar Premium');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Door Accessories', 'feature', 'text', 102) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'upto ₹5000'), (pkg_pre, f_id, 'text', 'upto ₹7000'), (pkg_lux, f_id, 'text', 'upto ₹8000');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Bedroom Door', 'feature', 'text', 103) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '3x7'), (pkg_pre, f_id, 'text', '3x7'), (pkg_lux, f_id, 'text', '3x8');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Bathroom Door', 'feature', 'text', 104) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '2.6 x 7 UPVC'), (pkg_pre, f_id, 'text', '2.6 x 7 UPVC'), (pkg_lux, f_id, 'text', '2.6 x 8 UPVC / ABS');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Windows', 'feature', 'text', 105) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'White / Ashara'), (pkg_pre, f_id, 'text', 'Prominence'), (pkg_lux, f_id, 'text', 'Prominence');

    -- --- 12. RAILINGS ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('RAILINGS', 'heading', 'boolean', 110);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Staircase Railing', 'feature', 'text', 111) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'MS'), (pkg_pre, f_id, 'text', 'SS + MS'), (pkg_lux, f_id, 'text', 'Glass');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Balcony Railing', 'feature', 'text', 112) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'MS Grill'), (pkg_pre, f_id, 'text', 'SS'), (pkg_lux, f_id, 'text', 'Glass');

    -- --- 13. PAINT ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('PAINT', 'heading', 'boolean', 120);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Internal Walls', 'feature', 'text', 121) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Asian / Berger / Nerolac'), (pkg_pre, f_id, 'text', 'Premium Range'), (pkg_lux, f_id, 'text', 'Royal');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('External Paint', 'feature', 'text', 122) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', '1 Coat Damp Proof + Apex'), (pkg_pre, f_id, 'text', '2 Coat Damp Proof + Ultima'), (pkg_lux, f_id, 'text', 'Apex Ultima');

    -- --- 14. EXTRA ELECTRICAL ---
    INSERT INTO features (title, type, value_mode, display_order) VALUES ('EXTRA ELECTRICAL', 'heading', 'boolean', 130);

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('AC Points', 'feature', 'text', 131) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type, value) VALUES (pkg_std, f_id, 'text', 'Hall / Bedroom'), (pkg_pre, f_id, 'text', 'Same'), (pkg_lux, f_id, 'text', 'Same');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('EV Charging', 'feature', 'boolean', 132) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'tick'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Inverter Wiring', 'feature', 'boolean', 133) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'tick'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Pressure Pump Provision', 'feature', 'boolean', 134) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'dash'), (pkg_pre, f_id, 'dash'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('Solar Heater Provision', 'feature', 'boolean', 135) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'dash'), (pkg_pre, f_id, 'dash'), (pkg_lux, f_id, 'tick');

    INSERT INTO features (title, type, value_mode, display_order) VALUES ('CCTV Wiring', 'feature', 'boolean', 136) RETURNING id INTO f_id;
    INSERT INTO feature_values (package_id, feature_id, type) VALUES (pkg_std, f_id, 'tick'), (pkg_pre, f_id, 'tick'), (pkg_lux, f_id, 'tick');

END $$;
