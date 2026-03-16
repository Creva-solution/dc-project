import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

let env = {};
try {
    env = fs.readFileSync('.env', 'utf8').split('\n').reduce((acc, line) => {
        const [key, ...val] = line.split('=');
        if (key && val.length > 0) acc[key.trim()] = val.join('=').trim();
        return acc;
    }, {});
} catch (e) {
    console.log('No .env file found, using process.env');
}

const supabase = createClient(env.VITE_SUPABASE_URL || process.env.VITE_SUPABASE_URL, env.VITE_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY);

const data = {
    packages: [
        { name: 'Standard / Basic', price: '₹2250', display_order: 1 },
        { name: 'Premium / Elite', price: '₹2550', display_order: 2 },
        { name: 'Luxury', price: '₹3000', display_order: 3 }
    ],
    sections: [
        {
            title: 'DESIGN & ENGINEERING',
            features: [
                { title: 'Soil Test', type: 'boolean', values: ['dash', 'tick', 'tick'] },
                { title: 'Borewell Test', type: 'boolean', values: ['dash', 'tick', 'tick'] },
                { title: '2D Floor Plan', type: 'boolean', values: ['tick', 'tick', 'tick'] },
                { title: '3D Elevation', type: 'text', values: ['Basic', 'Premium', 'Luxury'] },
                { title: 'Structural Design', type: 'boolean', values: ['tick', 'tick', 'tick'] },
                { title: 'Electrical Drawing', type: 'boolean', values: ['dash', 'tick', 'tick'] }
            ]
        },
        {
            title: 'STRUCTURE',
            features: [
                { title: 'Cement', type: 'text', values: ['Dalmia / Zuari / Ultratech', 'Same', 'Same'] },
                { title: 'Steel', type: 'text', values: ['GSK / PWD', 'APS Steel', 'TATA'] },
                { title: 'RCC Grade', type: 'text', values: ['M20 / M25', 'M20 / M25', 'M25'] },
                { title: 'Foundation', type: 'text', values: ['Included', 'Included', 'Included'] },
                { title: 'Foundation Waterproofing', type: 'text', values: ['✖', 'Dr Fixit Bitufix', 'Dr Fixit Bitufix'] }
            ]
        },
        {
            title: 'FLOOR STRUCTURE',
            features: [
                { title: 'Floor Height', type: 'text', values: ['3 ft', '3\'6 ft', '4 ft'] },
                { title: 'Parking Height', type: 'text', values: ['10 inch from pavement', 'Same', 'Same'] },
                { title: 'Lintel', type: 'text', values: ['Through Lintel', 'Through Lintel', 'Through Lintel'] },
                { title: 'Loft', type: 'text', values: ['One Loft (Bedroom & Kitchen)', 'Same', 'Same'] },
                { title: 'Ceiling Height', type: 'text', values: ['10 ft slab to slab', '10\'6 slab to slab', '11 ft slab'] },
                { title: 'Sand', type: 'text', values: ['M Sand', 'Same', 'Same'] },
                { title: 'Plastering', type: 'text', values: ['Waterproof admixture', 'Same', 'Fibre Reinforced Plastering'] },
                { title: 'Brick Work', type: 'text', values: ['Red Box Bricks', 'Box Finish Red Brick', 'Wire Cut Bricks'] }
            ]
        },
        {
            title: 'ELECTRICAL',
            features: [
                { title: 'Wiring', type: 'text', values: ['Orbit / Polycab FRLSH', 'RR / Polycab FRLSH', 'Polycab FRLSH'] },
                { title: 'Switch MCB', type: 'text', values: ['Legrand / Schneider / Roma', 'Legrand / Schneider', 'Legrand Schneider Anterior'] },
                { title: 'Switch Model', type: 'text', values: ['Alizy', 'Lyncus', 'Premium'] },
                { title: 'Main Board', type: 'text', values: ['Wooden Open Type', 'Steel Box', 'Panel Box'] }
            ]
        },
        {
            title: 'PLUMBING',
            features: [
                { title: 'CPVC Concealed', type: 'text', values: ['Ashirvad / Finolex', 'Same', 'Same'] },
                { title: 'Potable Cold Water', type: 'text', values: ['UPVC', 'Same', 'Same'] },
                { title: 'Grey Water Pipes', type: 'text', values: ['Neopro / Supreme', 'Finolex', 'Finolex'] }
            ]
        },
        {
            title: 'KITCHEN',
            features: [
                { title: 'Kitchen Wall Tiles', type: 'text', values: ['upto 2 ft – ₹50', '₹70', '₹90'] },
                { title: 'Kitchen Flooring', type: 'text', values: ['₹50', '₹70', '₹90'] },
                { title: 'Countertop', type: 'text', values: ['Granite ₹150', 'Granite ₹180', 'Granite ₹200'] },
                { title: 'Sink', type: 'text', values: ['SS Sink ₹2000', 'SS Sink or Quartz ₹7500', 'Quartz ₹12000'] }
            ]
        },
        {
            title: 'BATHROOM',
            features: [
                { title: 'Bathroom Wall Tiles', type: 'text', values: ['₹40 upto 7 ft', '₹50 upto 9 ft', '₹60 upto 10 ft'] },
                { title: 'Fittings', type: 'text', values: ['Parryware / Essco ₹15000', 'Rube / Essco / Jaguar ₹30000', 'Kohler ₹40000'] }
            ]
        },
        {
            title: 'FLOORING',
            features: [
                { title: 'Parking Flooring', type: 'text', values: ['Any Tiles ₹40/sqft', 'Kajaria / Johnson ₹60', 'Simpolo ₹70'] },
                { title: 'Living / Bedroom Flooring', type: 'text', values: ['₹50', 'Granite ₹180', 'Granite ₹200'] },
                { title: 'Staircase Flooring', type: 'text', values: ['Granite ₹110', 'Granite ₹180', 'Granite ₹200'] },
                { title: 'Balcony Flooring', type: 'text', values: ['Designer Tile ₹50', 'Designer Tile ₹70', 'Designer Tile ₹90'] }
            ]
        },
        {
            title: 'UTILITY',
            features: [
                { title: 'Utility Flooring', type: 'text', values: ['₹50', '₹70', '₹90'] },
                { title: 'Utility Counter Top', type: 'boolean', values: ['dash', 'tick', 'tick'] },
                { title: 'CP Fittings', type: 'text', values: ['₹2000', '₹3000', '₹4000'] },
                { title: 'Utility Sink', type: 'boolean', values: ['dash', 'tick', 'tick'] }
            ]
        },
        {
            title: 'DOORS & JOINERY',
            features: [
                { title: 'Main Door Frame', type: 'text', values: ['Neem / Bamboo / Mixed', 'Nimbhar 1st Quality', 'Nimbhar Premium'] },
                { title: 'Door Accessories', type: 'text', values: ['upto ₹5000', 'upto ₹7000', 'upto ₹8000'] },
                { title: 'Bedroom Door', type: 'text', values: ['3x7', '3x7', '3x8'] },
                { title: 'Bathroom Door', type: 'text', values: ['2.6 x 7 UPVC', '2.6 x 7 UPVC', '2.6 x 8 UPVC / ABS'] },
                { title: 'Windows', type: 'text', values: ['White / Ashara', 'Prominence', 'Prominence'] }
            ]
        },
        {
            title: 'RAILINGS',
            features: [
                { title: 'Staircase Railing', type: 'text', values: ['MS', 'SS + MS', 'Glass'] },
                { title: 'Balcony Railing', type: 'text', values: ['MS Grill', 'SS', 'Glass'] }
            ]
        },
        {
            title: 'PAINT',
            features: [
                { title: 'Internal Walls', type: 'text', values: ['Asian / Berger / Nerolac', 'Premium Range', 'Royal'] },
                { title: 'External Paint', type: 'text', values: ['1 Coat Damp Proof + Apex', '2 Coat Damp Proof + Ultima', 'Apex Ultima'] }
            ]
        },
        {
            title: 'EXTRA ELECTRICAL',
            features: [
                { title: 'AC Points', type: 'text', values: ['Hall / Bedroom', 'Same', 'Same'] },
                { title: 'EV Charging', type: 'boolean', values: ['tick', 'tick', 'tick'] },
                { title: 'Inverter Wiring', type: 'boolean', values: ['tick', 'tick', 'tick'] },
                { title: 'Pressure Pump Provision', type: 'boolean', values: ['dash', 'dash', 'tick'] },
                { title: 'Solar Heater Provision', type: 'boolean', values: ['dash', 'dash', 'tick'] },
                { title: 'CCTV Wiring', type: 'boolean', values: ['tick', 'tick', 'tick'] }
            ]
        }
    ]
};

async function importData() {
    try {
        console.log('Clearing existing construction data...');
        // await supabase.from('feature_values').delete().neq('id', 0);
        // await supabase.from('features').delete().neq('id', 0);
        // await supabase.from('packages').delete().neq('id', 0);

        // Or better, just delete then insert to ensure clean state
        const { error: valDeleteError } = await supabase.from('feature_values').delete().neq('id', 0);
        const { error: featDeleteError } = await supabase.from('features').delete().neq('id', 0);
        const { error: pkgDeleteError } = await supabase.from('packages').delete().neq('id', 0);

        if (valDeleteError || featDeleteError || pkgDeleteError) {
            console.error('Error clearing data:', { valDeleteError, featDeleteError, pkgDeleteError });
            // return;
        }

        console.log('Inserting packages...');
        const { data: pkgData, error: pkgError } = await supabase.from('packages').insert(data.packages).select();
        if (pkgError) throw pkgError;

        const pkgMap = {};
        pkgData.forEach(p => {
            if (p.name.includes('Standard')) pkgMap[0] = p.id;
            if (p.name.includes('Premium')) pkgMap[1] = p.id;
            if (p.name.includes('Luxury')) pkgMap[2] = p.id;
        });

        console.log('Inserting features and values...');
        let featOrder = 1;
        for (const section of data.sections) {
            // Insert Heading
            const { data: headData, error: headError } = await supabase.from('features').insert({
                title: section.title,
                type: 'heading',
                value_mode: 'boolean',
                display_order: featOrder++
            }).select();
            if (headError) throw headError;

            for (const feature of section.features) {
                const { data: featureData, error: featureError } = await supabase.from('features').insert({
                    title: feature.title,
                    type: 'feature',
                    value_mode: feature.type,
                    display_order: featOrder++
                }).select();
                if (featureError) throw featureError;

                const featureId = featureData[0].id;
                const valuesToInsert = feature.values.map((val, idx) => {
                    const pkgId = pkgMap[idx];
                    if (feature.type === 'boolean') {
                        return { package_id: pkgId, feature_id: featureId, type: val, value: '' };
                    } else {
                        return { package_id: pkgId, feature_id: featureId, type: 'text', value: val };
                    }
                });

                const { error: valError } = await supabase.from('feature_values').insert(valuesToInsert);
                if (valError) throw valError;
            }
        }

        console.log('Import successful!');
    } catch (err) {
        console.error('Import failed:', err);
    }
}

importData();
