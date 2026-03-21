import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CostCalculator from '../components/CostCalculator';
import { CheckCircle2, Minus, Home, ShieldCheck, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';

const colorSets = [
    { icon: Home, color: 'text-blue-600', bgColor: 'bg-blue-50', bgHighlight: 'lg:bg-blue-50/20' },
    { icon: ShieldCheck, color: 'text-accent', bgColor: 'bg-red-50', bgHighlight: 'lg:bg-red-50/20' },
    { icon: Crown, color: 'text-yellow-600', bgColor: 'bg-yellow-50', bgHighlight: 'lg:bg-yellow-50/20' },
    { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', bgHighlight: 'lg:bg-emerald-50/20' }
];


const CONSTRUCTION_DATA = {
    packages: [
        { id: 'standard', name: 'Standard / Basic', price: '₹2250', display_order: 1 },
        { id: 'premium', name: 'Premium / Elite', price: '₹2550', display_order: 2 },
        { id: 'luxury', name: 'Luxury', price: '₹3000', display_order: 3 }
    ],
    features: [
        { id: 'de-head', title: 'Design & Engineering', type: 'heading' },
        { id: 'f1', title: 'Soil Test', values: { standard: '✖', premium: 'tick', luxury: 'tick' } },
        { id: 'f2', title: 'Borewell Test', values: { standard: '✖', premium: 'tick', luxury: 'tick' } },
        { id: 'f3', title: '2D Floor Plan', values: { standard: 'tick', premium: 'tick', luxury: 'tick' } },
        { id: 'f4', title: '3D Elevation', values: { standard: 'Basic', premium: 'Premium', luxury: 'Luxury' } },
        { id: 'f5', title: 'Structural Design', values: { standard: 'tick', premium: 'tick', luxury: 'tick' } },
        { id: 'f6', title: 'Electrical Drawing', values: { standard: '✖', premium: 'tick', luxury: 'tick' } },

        { id: 'st-head', title: 'Structure', type: 'heading' },
        { id: 'f7', title: 'Cement', values: { standard: 'Dalmia / Zuari / Ultratech', premium: 'Same', luxury: 'Same' } },
        { id: 'f8', title: 'Steel', values: { standard: 'GSK / PWD', premium: 'APS Steel', luxury: 'TATA' } },
        { id: 'f9', title: 'RCC Grade', values: { standard: 'M20 / M25', premium: 'M20 / M25', luxury: 'M25' } },
        { id: 'f10', title: 'Foundation', values: { standard: 'Included', premium: 'Included', luxury: 'Included' } },
        { id: 'f11', title: 'Foundation Waterproofing', values: { standard: '✖', premium: 'Dr Fixit Bitufix', luxury: 'Dr Fixit Bitufix' } },

        { id: 'fs-head', title: 'Floor Structure', type: 'heading' },
        { id: 'f12', title: 'Floor Height', values: { standard: '3 ft', premium: '3\'6 ft', luxury: '4 ft' } },
        { id: 'f13', title: 'Parking Height', values: { standard: '10 inch from pavement', premium: 'Same', luxury: 'Same' } },
        { id: 'f14', title: 'Lintel', values: { standard: 'Through Lintel', premium: 'Through Lintel', luxury: 'Through Lintel' } },
        { id: 'f15', title: 'Loft', values: { standard: 'One Loft (Bedroom & Kitchen)', premium: 'Same', luxury: 'Same' } },
        { id: 'f16', title: 'Ceiling Height', values: { standard: '10 ft slab to slab', premium: '10\'6 slab to slab', luxury: '11 ft slab' } },
        { id: 'f17', title: 'Sand', values: { standard: 'M Sand', premium: 'Same', luxury: 'Same' } },
        { id: 'f18', title: 'Plastering', values: { standard: 'Waterproof admixture', premium: 'Same', luxury: 'Fibre Reinforced Plastering' } },
        { id: 'f19', title: 'Brick Work', values: { standard: 'Red Box Bricks', premium: 'Box Finish Red Brick', luxury: 'Wire Cut Bricks' } },

        { id: 'el-head', title: 'Electrical', type: 'heading' },
        { id: 'f20', title: 'Wiring', values: { standard: 'Orbit / Polycab FRLSH', premium: 'RR / Polycab FRLSH', luxury: 'Polycab FRLSH' } },
        { id: 'f21', title: 'Switch MCB', values: { standard: 'Legrand / Schneider / Roma', premium: 'Legrand / Schneider', luxury: 'Legrand Schneider Anterior' } },
        { id: 'f22', title: 'Switch Model', values: { standard: 'Alizy', premium: 'Lyncus', luxury: 'Premium' } },
        { id: 'f23', title: 'Main Board', values: { standard: 'Wooden Open Type', premium: 'Steel Box', luxury: 'Panel Box' } },

        { id: 'pb-head', title: 'Plumbing', type: 'heading' },
        { id: 'f24', title: 'CPVC Concealed', values: { standard: 'Ashirvad / Finolex', premium: 'Same', luxury: 'Same' } },
        { id: 'f25', title: 'Potable Cold Water', values: { standard: 'UPVC', premium: 'Same', luxury: 'Same' } },
        { id: 'f26', title: 'Grey Water Pipes', values: { standard: 'Neopro / Supreme', premium: 'Finolex', luxury: 'Finolex' } },

        { id: 'kt-head', title: 'Kitchen', type: 'heading' },
        { id: 'f27', title: 'Wall Tiles', values: { standard: 'upto 2 ft – ₹50', premium: '₹70', luxury: '₹90' } },
        { id: 'f28', title: 'Flooring', values: { standard: '₹50', premium: '₹70', luxury: '₹90' } },
        { id: 'f29', title: 'Countertop', values: { standard: 'Granite ₹150', premium: 'Granite ₹180', luxury: 'Granite ₹200' } },
        { id: 'f30', title: 'Sink', values: { standard: 'SS Sink ₹2000', premium: 'SS Sink or Quartz ₹7500', luxury: 'Quartz ₹12000' } },

        { id: 'bt-head', title: 'Bathroom', type: 'heading' },
        { id: 'f31', title: 'Wall Tiles', values: { standard: '₹40 upto 7 ft', premium: '₹50 upto 9 ft', luxury: '₹60 upto 10 ft' } },
        { id: 'f32', title: 'Fittings', values: { standard: 'Parryware / Essco ₹15000', premium: 'Rube / Essco / Jaguar ₹30000', luxury: 'Kohler ₹40000' } },

        { id: 'fl-head', title: 'Flooring', type: 'heading' },
        { id: 'f33', title: 'Parking', values: { standard: 'Any Tiles ₹40/sqft', premium: 'Kajaria / Johnson ₹60', luxury: 'Simpolo ₹70' } },
        { id: 'f34', title: 'Living / Bedroom', values: { standard: '₹50', premium: 'Granite ₹180', luxury: 'Granite ₹200' } },
        { id: 'f35', title: 'Staircase', values: { standard: 'Granite ₹110', premium: 'Granite ₹180', luxury: 'Granite ₹200' } },
        { id: 'f36', title: 'Balcony', values: { standard: 'Designer Tile ₹50', premium: 'Designer Tile ₹70', luxury: 'Designer Tile ₹90' } },

        { id: 'ut-head', title: 'Utility', type: 'heading' },
        { id: 'f37', title: 'Flooring', values: { standard: '₹50', premium: '₹70', luxury: '₹90' } },
        { id: 'f38', title: 'Counter Top', values: { standard: '✖', premium: 'tick', luxury: 'tick' } },
        { id: 'f39', title: 'CP Fittings', values: { standard: '₹2000', premium: '₹3000', luxury: '₹4000' } },
        { id: 'f40', title: 'Sink', values: { standard: '✖', premium: 'tick', luxury: 'tick' } },

        { id: 'dj-head', title: 'Doors & Joinery', type: 'heading' },
        { id: 'f41', title: 'Main Door Frame', values: { standard: 'Neem / Bamboo / Mixed', premium: 'Nimbhar 1st Quality', luxury: 'Nimbhar Premium' } },
        { id: 'f42', title: 'Door Accessories', values: { standard: 'upto ₹5000', premium: 'upto ₹7000', luxury: 'upto ₹8000' } },
        { id: 'f43', title: 'Bedroom Door', values: { standard: '3x7', premium: '3x7', luxury: '3x8' } },
        { id: 'f44', title: 'Bathroom Door', values: { standard: '2.6 x 7 UPVC', premium: '2.6 x 7 UPVC', luxury: '2.6 x 8 UPVC / ABS' } },
        { id: 'f45', title: 'Windows', values: { standard: 'White / Ashara', premium: 'Prominence', luxury: 'Prominence' } },

        { id: 'rl-head', title: 'Railings', type: 'heading' },
        { id: 'f46', title: 'Staircase Railing', values: { standard: 'MS', premium: 'SS + MS', luxury: 'Glass' } },
        { id: 'f47', title: 'Balcony Railing', values: { standard: 'MS Grill', premium: 'SS', luxury: 'Glass' } },

        { id: 'pt-head', title: 'Paint', type: 'heading' },
        { id: 'f48', title: 'Internal Walls', values: { standard: 'Asian / Berger / Nerolac', premium: 'Premium Range', luxury: 'Royal' } },
        { id: 'f49', title: 'External Paint', values: { standard: '1 Coat Damp Proof + Apex', premium: '2 Coat Damp Proof + Ultima', luxury: 'Apex Ultima' } },

        { id: 'ex-head', title: 'Extra Electrical', type: 'heading' },
        { id: 'f50', title: 'AC Points', values: { standard: 'Hall / Bedroom', premium: 'Same', luxury: 'Same' } },
        { id: 'f51', title: 'EV Charging', values: { standard: 'tick', premium: 'tick', luxury: 'tick' } },
        { id: 'f52', title: 'Inverter Wiring', values: { standard: 'tick', premium: 'tick', luxury: 'tick' } },
        { id: 'f53', title: 'Pressure Pump Provision', values: { standard: '✖', premium: '✖', luxury: 'tick' } },
        { id: 'f54', title: 'Solar Heater Provision', values: { standard: '✖', premium: '✖', luxury: 'tick' } },
        { id: 'f55', title: 'CCTV Wiring', values: { standard: 'tick', premium: 'tick', luxury: 'tick' } }
    ]
};

const renderFeatureValue = (val) => {
    if (!val) return <div className="flex justify-center"><Minus className="text-gray-300" size={20} /></div>;
    if (val === 'tick') return <div className="flex justify-center"><CheckCircle2 className="text-green-500" size={20} /></div>;
    if (val === 'dash' || val === '✖') return <div className="flex justify-center"><Minus className="text-gray-300" size={20} /></div>;
    return <span className="text-sm font-medium text-gray-700">{val}</span>;
};

const Construction = () => {
    const location = useLocation();
    const [activePackage, setActivePackage] = useState(0);

    const [packages, setPackages] = useState(CONSTRUCTION_DATA.packages);
    const [features, setFeatures] = useState(CONSTRUCTION_DATA.features);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // Try fetching from Supabase, but favor the provided data if it works
                const [pkgRes, featRes, valRes] = await Promise.all([
                    supabase.from('packages').select('*').eq('is_active', true).order('display_order', { ascending: true }),
                    supabase.from('features').select('*').order('display_order', { ascending: true }),
                    supabase.from('feature_values').select('*')
                ]);

                if (pkgRes.data && pkgRes.data.length > 0) {
                    setPackages(pkgRes.data);
                    setFeatures(featRes.data.map(f => ({
                        ...f,
                        values: pkgRes.data.reduce((acc, p) => {
                            const v = valRes.data.find(v => v.package_id === p.id && v.feature_id === f.id);
                            acc[p.id] = v ? (v.type === 'text' ? v.value : v.type) : null;
                            return acc;
                        }, {})
                    })));
                }
            } catch (err) {
                console.warn("DB fetch failed, using static data fallback:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (location.hash) {
            const element = document.getElementById(location.hash.substring(1));
            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        } else {
            window.scrollTo(0, 0);
        }
    }, [location]);

    return (
        <>
            {/* Top Banner with Breadcrumbs */}
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-primary pt-32 pb-20 mt-0 relative overflow-hidden"
            >
                <div className="absolute inset-0 opacity-10 bg-[url('/images/project_2026-02-25_11.23.39_AM.webp')] bg-cover bg-center"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Construction Packages</h1>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <span>-</span>
                        <span className="text-white">Construction</span>
                    </div>
                </div>
            </motion.section>

            <motion.section 
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="pt-24 pb-32 lg:pb-24 bg-white"
            >
                <div className="container mx-auto px-6">

                    <div className="text-center mb-12 lg:mb-16">
                        <span className="text-accent font-bold tracking-wider uppercase mb-2 block text-sm">Our Plans</span>
                        <h2 className="text-3xl md:text-5xl font-black text-primary mb-6">Compare Packages</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            We offer three comprehensive construction packages designed to fit your budget and quality requirements. Review the detailed breakdown below.
                        </p>
                    </div>

                    {/* Mobile Comparison Layout (Pill Tabs + Single Card) */}
                    <div className="block lg:hidden mb-12">
                        {loading ? (
                            <div className="flex flex-col gap-4">
                                <div className="h-14 w-full skeleton rounded-2xl"></div>
                                <div className="h-[500px] w-full skeleton rounded-[16px]"></div>
                            </div>
                        ) : packages.length === 0 ? (
                            <div className="text-center text-gray-500 py-10">Packages are currently being configured.</div>
                        ) : (
                            <>
                                {/* Mobile Pill Tabs */}
                                <div className="flex bg-gray-50 p-1.5 rounded-2xl mb-6 shadow-sm border border-gray-100 overflow-x-auto hide-scrollbar sticky top-[72px] z-30">
                                    {packages.map((pkg, idx) => (
                                        <button
                                            key={pkg.id}
                                            onClick={() => setActivePackage(idx)}
                                            className={`flex-1 min-w-[90px] py-2.5 px-2 text-center text-[13px] font-bold rounded-xl transition-all duration-300 whitespace-nowrap ${activePackage === idx ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-gray-900 bg-transparent'}`}
                                        >
                                            {(pkg.name || pkg.title).split(' ')[0]}
                                        </button>
                                    ))}
                                </div>

                                {/* Mobile Card Form */}
                                <div className="bg-white rounded-[16px] shadow-lg border border-gray-100 overflow-hidden relative z-20">
                                    {packages[activePackage] && (() => {
                                        const pkg = packages[activePackage];
                                        const colorSet = colorSets[activePackage % colorSets.length];
                                        const Icon = colorSet.icon;
                                        return (
                                            <>
                                                {/* Left/Right Header split */}
                                                <div className="flex border-b border-gray-200">
                                                    <div className="w-[45%] p-4 border-r border-gray-100 bg-[#f8fafc] flex flex-col justify-center">
                                                        <h3 className="text-[16px] font-black text-primary leading-tight mb-1">Particulars</h3>
                                                        <p className="text-[11px] font-medium text-gray-500 leading-snug">Detailed service inclusions</p>
                                                    </div>
                                                    <div className={`w-[55%] p-4 flex flex-col items-center justify-center text-center ${colorSet.bgColor}`}>
                                                        <div className={`w-12 h-12 rounded-full bg-white shadow-sm flex items-center justify-center mb-3 ${colorSet.color}`}>
                                                            <Icon strokeWidth={2.5} size={24} />
                                                        </div>
                                                        <h3 className={`text-[15px] font-black mb-1 ${colorSet.color}`}>{pkg.name || pkg.title}</h3>
                                                        <div className="text-[22px] font-black text-gray-900 leading-none mb-1">{pkg.price}</div>
                                                        <span className="text-[11px] font-semibold text-gray-500 block">per sq.ft</span>
                                                    </div>
                                                </div>

                                                {/* Features List */}
                                                <div className="flex flex-col">
                                                    {features.map((feat) => {
                                                        if (feat.type === 'heading') {
                                                            return (
                                                                <div key={feat.id} className="bg-[#e2e8f0] px-4 py-2 border-y border-gray-300 shadow-inner">
                                                                    <span className="text-[11px] font-black text-gray-700 uppercase tracking-widest">{feat.title}</span>
                                                                </div>
                                                            );
                                                        }

                                                        const val = feat.values ? feat.values[pkg.id] : null;
                                                        return (
                                                            <div key={feat.id} className="flex border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors group">
                                                                <div className="w-[45%] p-3.5 border-r border-gray-100 flex items-center bg-white group-hover:bg-gray-50 transition-colors">
                                                                    <span className="text-[13px] font-bold text-gray-700 leading-tight">{feat.title}</span>
                                                                </div>
                                                                <div className="w-[55%] p-3.5 flex items-center justify-center bg-white/50 group-hover:bg-gray-50 transition-colors">
                                                                    {renderFeatureValue(val)}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </>
                                        );
                                    })()}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Desktop Comparison Table */}
                    <div className="hidden lg:block border border-gray-100 rounded-[16px] shadow-xl bg-white overflow-hidden mb-24 relative">
                        {loading ? (
                            <div className="p-8 flex flex-col gap-4">
                                <div className="grid grid-cols-4 gap-4 mb-8">
                                    <div className="h-24 w-full skeleton rounded-xl"></div>
                                    <div className="h-24 w-full skeleton rounded-xl"></div>
                                    <div className="h-24 w-full skeleton rounded-xl"></div>
                                    <div className="h-24 w-full skeleton rounded-xl"></div>
                                </div>
                                {Array(10).fill(0).map((_, i) => (
                                    <div key={i} className="h-10 w-full skeleton rounded-md"></div>
                                ))}
                            </div>
                        ) : packages.length === 0 ? (
                            <div className="p-10 text-center text-gray-500">
                                Packages are currently being configured. Check back later!
                            </div>
                        ) : (
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr>
                                        <th className="p-6 border-b border-gray-100 bg-white align-bottom w-1/3 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)] z-10 relative">
                                            <h3 className="text-xl font-bold text-primary">Features Outline</h3>
                                            <p className="text-sm font-normal text-gray-500 mt-1">Compare what is included</p>
                                        </th>
                                        {packages.map((pkg, idx) => {
                                            const colorSet = colorSets[idx % colorSets.length];
                                            const Icon = colorSet.icon;
                                            return (
                                                <th key={pkg.id} className="p-6 border-b border-gray-100 border-l border-gray-50 text-center w-1/4 bg-white">
                                                    <div className={`mx-auto w-14 h-14 rounded-full ${colorSet.bgColor} ${colorSet.color} flex items-center justify-center mb-4`}>
                                                        <Icon className="w-7 h-7" />
                                                    </div>
                                                    <h3 className="text-xl font-black text-primary mb-2">{pkg.name || pkg.title}</h3>
                                                    <div className="text-3xl font-black text-secondary leading-none mb-1">{pkg.price}</div>
                                                    <span className="text-sm font-normal text-gray-500 block mb-1">per sq.ft</span>
                                                </th>
                                            );
                                        })}
                                    </tr>
                                </thead>
                                <tbody>
                                    {features.map((feat) => {
                                        if (feat.type === 'heading') {
                                            return (
                                                <tr key={feat.id} className="bg-gray-100/80">
                                                    <td colSpan={packages.length + 1} className="p-4 px-6 border-b border-gray-200 font-black text-gray-800 text-sm uppercase tracking-wider">
                                                        {feat.title}
                                                    </td>
                                                </tr>
                                            );
                                        }

                                        return (
                                            <tr key={feat.id} className="hover:bg-gray-50/50 transition-colors group">
                                                <td className="p-4 px-6 border-b border-gray-100 font-bold text-gray-700 text-sm bg-white group-hover:bg-gray-50/50 relative z-10 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                                                    {feat.title}
                                                </td>
                                                {packages.map((pkg, pIdx) => {
                                                    const colorSet = colorSets[pIdx % colorSets.length];
                                                    const val = feat.values ? feat.values[pkg.id] : null;
                                                    return (
                                                        <td key={pkg.id} className={`p-4 border-b border-gray-100 border-l border-gray-50 text-center text-sm transition-colors duration-300 ${colorSet.bgHighlight}`}>
                                                            {renderFeatureValue(val)}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div id="calculator-section" className="pt-12 border-t border-gray-200">
                        <CostCalculator />
                    </div>

                </div>
            </motion.section>
        </>
    );
};

export default Construction;
