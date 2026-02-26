import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import CostCalculator from '../components/CostCalculator';
import { CheckCircle2, Minus, Home, ShieldCheck, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';

const colorSets = [
    { icon: Home, color: 'text-blue-600', bgColor: 'bg-blue-50', bgHighlight: 'lg:bg-blue-50/20' },
    { icon: ShieldCheck, color: 'text-accent', bgColor: 'bg-red-50', bgHighlight: 'lg:bg-red-50/20' },
    { icon: Crown, color: 'text-yellow-600', bgColor: 'bg-yellow-50', bgHighlight: 'lg:bg-yellow-50/20' },
    { icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', bgHighlight: 'lg:bg-emerald-50/20' }
];

const renderFeatureValue = (val) => {
    if (!val) return <div className="flex justify-center"><Minus className="text-gray-300" size={20} /></div>;
    if (val.type === 'tick') return <div className="flex justify-center"><CheckCircle2 className="text-green-500" size={20} /></div>;
    if (val.type === 'dash') return <div className="flex justify-center"><Minus className="text-gray-300" size={20} /></div>;
    return <span className="text-sm font-medium text-gray-700">{val.value}</span>;
};



const Construction = () => {
    const location = useLocation();
    const scrollContainerRef = useRef(null);
    const [activePackage, setActivePackage] = useState(0);

    const [packages, setPackages] = useState([]);
    const [features, setFeatures] = useState([]);
    const [featureValues, setFeatureValues] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [pkgRes, featRes, valRes] = await Promise.all([
                    supabase.from('packages').select('*').eq('is_active', true).order('display_order', { ascending: true }),
                    supabase.from('features').select('*').order('display_order', { ascending: true }),
                    supabase.from('feature_values').select('*')
                ]);
                setPackages(pkgRes.data || []);
                setFeatures(featRes.data || []);
                setFeatureValues(valRes.data || []);
            } catch (err) {
                console.error("Error fetching comparison data:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const scrollToPackage = (index) => {
        setActivePackage(index);
        if (scrollContainerRef.current) {
            const { scrollWidth, clientWidth } = scrollContainerRef.current;
            const scrollableWidth = scrollWidth - clientWidth;
            const scrollAmount = packages.length > 1 ? (scrollableWidth / (packages.length - 1)) * index : 0;

            scrollContainerRef.current.scrollTo({
                left: scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    const handleScroll = () => {
        if (scrollContainerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
            const scrollableWidth = scrollWidth - clientWidth;

            if (scrollableWidth > 0 && packages.length > 1) {
                const scrollRatio = scrollLeft / scrollableWidth;
                const segment = 1 / (packages.length - 1);
                const index = Math.round(scrollRatio / segment);
                setActivePackage(index);
            }
        }
    };

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
            <section className="bg-primary pt-32 pb-20 mt-0 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[url('/images/project_2026-02-25_11.23.39_AM.jpeg')] bg-cover bg-center"></div>
                <div className="container mx-auto px-6 text-center relative z-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">Construction</h1>
                    <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-300">
                        <Link to="/" className="hover:text-white transition">Home</Link>
                        <span>-</span>
                        <span className="text-white">Construction</span>
                    </div>
                </div>
            </section>

            <section className="pt-24 pb-32 lg:pb-24 bg-white">
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
                            <div className="py-20 flex justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full shadow-lg"></div></div>
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
                                                        {pkg.min_area && (
                                                            <span className="text-[10px] font-bold text-gray-500 bg-white/80 px-2 py-1 rounded inline-block mt-2 shadow-sm border border-gray-100 flex items-center justify-center">
                                                                {pkg.min_area}
                                                            </span>
                                                        )}
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

                                                        const val = featureValues.find(v => v.package_id === pkg.id && v.feature_id === feat.id);
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
                    <div className="hidden lg:block border border-gray-100 rounded-[16px] shadow-lg bg-white overflow-hidden mb-24 relative">
                        {loading ? (
                            <div className="h-64 flex items-center justify-center w-full">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full shadow-lg"></div>
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
                                                    const val = featureValues.find(v => v.package_id === pkg.id && v.feature_id === feat.id);
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
            </section>
        </>
    );
};

export default Construction;
