import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

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
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                className="bg-primary pt-32 pb-20 mt-0"
            >
                <div className="container mx-auto px-6 text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="text-4xl md:text-6xl font-black mb-6">Project <span className="text-secondary">Management</span></h1>
                        <p className="text-xl max-w-2xl mx-auto opacity-90">We strictly supervise and coordinate so you don't have to stress.</p>
                    </motion.div>
                </div>
            </motion.section>

            <section className="py-24 bg-gray-50 overflow-hidden">
                <div className="container mx-auto px-6 max-w-6xl">
                    <motion.div 
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-center mb-20"
                    >
                        <h2 className="text-4xl md:text-5xl font-extrabold text-primary mb-6">Our Workflow</h2>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                            Experience a seamless transition from concept to completion with our structured, five-stage project management approach.
                        </p>
                    </motion.div>

                    <div className="space-y-24 md:space-y-32">
                        {stages.map((stage, idx) => {
                            const isEven = idx % 2 !== 0;
                            return (
                                <div key={idx} className={`flex flex-col ${isEven ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-12 lg:gap-20`}>

                                    <motion.div 
                                        initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8 }}
                                        className="w-full md:w-1/2"
                                    >
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
                                    </motion.div>

                                    <motion.div 
                                        initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true, margin: "-100px" }}
                                        transition={{ duration: 0.8, delay: 0.2 }}
                                        className="w-full md:w-1/2 flex flex-col justify-center"
                                    >
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
                                    </motion.div>
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
