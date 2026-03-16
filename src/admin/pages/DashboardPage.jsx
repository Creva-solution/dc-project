import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { LayoutDashboard, Users, Images, MonitorSmartphone, TrendingUp } from 'lucide-react';

// Example stats fetching dashboard
const DashboardPage = () => {
    const [stats, setStats] = useState({
        projects: 0,
        teamCount: 0,
        testimonials: 0,
        totalLoading: true,
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Execute count queries sequentially or promise.all (simulated logic for Supabase)
                // In Supabase, table names might be "projects", "team_members", "testimonials"

                // const { count: projectCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
                // const { count: teamCount } = await supabase.from('team_members').select('*', { count: 'exact', head: true });
                // const { count: testimonialCount } = await supabase.from('testimonials').select('*', { count: 'exact', head: true });

                // Mock delay to demonstrate loading state
                await new Promise(resolve => setTimeout(resolve, 800));

                setStats({
                    projects: 12,
                    teamCount: 4,
                    testimonials: 8,
                    totalLoading: false,
                });
            } catch (error) {
                console.error("Dashboard fetch error", error);
                setStats(p => ({ ...p, totalLoading: false }));
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        { label: "Total Projects", value: stats.projects, icon: Images, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Team Members", value: stats.teamCount, icon: Users, color: "text-emerald-600", bg: "bg-emerald-50" },
        { label: "Testimonials", value: stats.testimonials, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Live Pages", value: "8", icon: MonitorSmartphone, color: "text-orange-600", bg: "bg-orange-50" },
    ];

    return (
        <div className="animate-fade-in max-w-7xl mx-auto">
            <h1 className="text-3xl font-black text-primary tracking-tight mb-2">Overview Dashboard</h1>
            <p className="text-gray-500 font-medium mb-8 text-sm">Welcome to the DC Constructions control panel.</p>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                {statCards.map((card, idx) => (
                    <div key={idx} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center justify-between hover:-translate-y-1 hover:shadow-md transition-all duration-300">
                        <div>
                            <p className="text-sm font-bold text-gray-500 mb-1">{card.label}</p>
                            {stats.totalLoading ? (
                                <div className="h-9 w-16 bg-gray-200 animate-pulse rounded"></div>
                            ) : (
                                <h3 className="text-3xl font-black text-gray-900">{card.value}</h3>
                            )}
                        </div>
                        <div className={`h-14 w-14 rounded-full flex items-center justify-center ${card.bg} ${card.color}`}>
                            <card.icon size={26} strokeWidth={2.5} />
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
};

export default DashboardPage;
