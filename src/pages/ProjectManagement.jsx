import { useEffect, useRef, useState } from 'react';

const FadeInSection = ({ children, delay = 0, direction = 'up', className = '' }) => {
    const [isVisible, setVisible] = useState(false);
    const domRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

        const current = domRef.current;
        if (current) observer.observe(current);

        return () => {
            if (current) observer.unobserve(current);
        };
    }, []);

    const directionClasses = {
        up: 'translate-y-16',
        left: '-translate-x-16',
        right: 'translate-x-16',
        none: 'scale-95'
    };

    return (
        <div
            ref={domRef}
            className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0 translate-x-0 scale-100' : 'opacity-0 ' + directionClasses[direction]
                } ${className}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            {children}
        </div>
    );
};

const stages = [
    {
        num: '01',
        title: 'Planning & Soil Testing',
        desc: 'Before breaking ground, we conduct comprehensive soil tests and architectural planning. This crucial stage ensures structural integrity, perfect spatial design, and lays the foundation for a flawless execution.',
        image: '/images/stage1.webp'
    },
    {
        num: '02',
        title: 'BOQ & Budget Finalization',
        desc: 'Transparency is our core value. We prepare a detailed Bill of Quantities (BOQ), ensuring every material cost and labor charge is accounted for, eliminating hidden surprises and finalizing a budget that respects your investment.',
        image: '/images/stage2.webp'
    },
    {
        num: '03',
        title: 'Construction Execution',
        desc: 'Watch your dream take shape as our skilled professionals execute the build. From foundational work to structural framing, we employ modern techniques and strict safety standards to bring the blueprints to life.',
        image: '/images/stage3.webp'
    },
    {
        num: '04',
        title: 'Quality Monitoring',
        desc: 'Quality is non-negotiable. Our dedicated civil engineers rigorously inspect concrete strength, structural alignment, and material standards at every step to guarantee maximum durability and perfection.',
        image: '/images/stage4.webp'
    },
    {
        num: '05',
        title: 'Final Handover',
        desc: 'The moment you’ve been waiting for. We perform a deep clean, test all pipelines and electricals, and conduct a comprehensive final walkthrough before handing over the keys to your beautifully finished dream home.',
        image: '/images/stage5.webp'
    }
];

const ProjectManagement = () => {
    return (
        <>
            <section className="bg-primary pt-32 pb-20 mt-0">
                <div className="container mx-auto px-6 text-center text-white">
                    <FadeInSection direction="up">
                        <h1 className="text-4xl md:text-6xl font-black mb-6">Project <span className="text-secondary">Management</span></h1>
                        <p className="text-xl max-w-2xl mx-auto opacity-90">We strictly supervise and coordinate so you don't have to stress.</p>
                    </FadeInSection>
                </div>
            </section>

            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <div className="text-center mb-20">
                        <FadeInSection direction="none">
                            <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">Our Workflow</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Experience a seamless transition from concept to completion with our structured, five-stage project management approach.
                            </p>
                        </FadeInSection>
                    </div>

                    <div className="space-y-24 md:space-y-32">
                        {stages.map((stage, idx) => {
                            const isEven = idx % 2 !== 0;
                            return (
                                <div key={idx} className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}>

                                    <div className="w-full md:w-1/2">
                                        <FadeInSection direction={isEven ? 'right' : 'left'}>
                                            <div className="relative rounded-3xl overflow-hidden shadow-2xl aspect-[4/3] group block">
                                                <div className="absolute inset-0 bg-primary/20 group-hover:bg-transparent transition duration-500 z-10 pointer-events-none"></div>
                                                <img
                                                    src={stage.image}
                                                    alt={stage.title}
                                                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-700 ease-in-out"
                                                />
                                                <div className={`absolute ${isEven ? 'bottom-6 left-6' : 'bottom-6 right-6'} z-20 pointer-events-none`}>
                                                    <span className="text-7xl md:text-9xl font-black text-white/90 drop-shadow-2xl">
                                                        {stage.num}
                                                    </span>
                                                </div>
                                            </div>
                                        </FadeInSection>
                                    </div>

                                    <div className="w-full md:w-1/2 flex flex-col justify-center">
                                        <FadeInSection direction={isEven ? 'left' : 'right'} delay={200}>
                                            <div className="flex items-center gap-4 mb-4">
                                                <span className="text-4xl font-bold text-secondary">Stage {stage.num}</span>
                                                <div className="h-0.5 max-w-[80px] w-full bg-secondary"></div>
                                            </div>
                                            <h3 className="text-3xl lg:text-4xl font-extrabold text-primary mb-6 leading-tight">
                                                {stage.title}
                                            </h3>
                                            <p className="text-lg text-gray-600 leading-relaxed">
                                                {stage.desc}
                                            </p>
                                        </FadeInSection>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                </div>
            </section>
        </>
    );
};

export default ProjectManagement;
