import React, { useState, useEffect } from 'react';

const Loader = () => {
    const [loading, setLoading] = useState(true);
    const [fadeOut, setFadeOut] = useState(false);

    useEffect(() => {
        // Run animation for precisely 5.2 seconds, matching video length
        const timer = setTimeout(() => {
            setFadeOut(true);
            setTimeout(() => {
                setLoading(false);
            }, 500); // 0.5s fade out
        }, 5200);

        return () => clearTimeout(timer);
    }, []);

    if (!loading) return null;

    return (
        <div className={`fixed inset-0 z-[99999] bg-[#F2F1EC] flex flex-col items-center justify-center overflow-hidden transition-opacity duration-500 loader-bg-anim ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
            <div className="relative w-full max-w-lg px-4 flex justify-center mt-[-30px]">
                <style>
                    {`
                        .loader-bg-anim {
                            animation: bgFadeToWhite 0.2s ease-in forwards;
                        }

                        /* Drawing outlines */
                        .draw-circle {
                            stroke-dasharray: 210;
                            stroke-dashoffset: 210;
                            animation: drawPath 1s ease-out 0.2s forwards;
                        }
                        
                        .draw-baseline {
                            stroke-dasharray: 100;
                            stroke-dashoffset: 100;
                            animation: drawPath 0.5s ease-out 0.8s forwards;
                        }

                        .draw-buildings {
                            stroke-dasharray: 150;
                            stroke-dashoffset: 150;
                            animation: drawPath 0.8s ease-out 1.2s forwards;
                        }
                        
                        /* Tractor elements popping in */
                        .tractor-body {
                            opacity: 0;
                            transform: scale(0.8) translate(-10px, 0);
                            animation: popInTractor 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.5s forwards;
                            transform-origin: 30px 40px;
                        }

                        /* Excavator Arm Animation - Actual scooping motion */
                        .excavator-arm {
                            opacity: 0;
                            transform-origin: 55px 50px; /* Pivot point at tractor body */
                            animation: armScoop 3.5s cubic-bezier(0.4, 0, 0.2, 1) 1.8s infinite;
                        }
                        
                        /* Dirt falling animation */
                        .dirt-particle {
                            opacity: 0;
                            fill: #8B5A2B;
                            transform-origin: 75px 45px;
                        }
                        
                        .dirt-1 { animation: fallDirt 3.5s linear 2.6s infinite; }
                        .dirt-2 { animation: fallDirt 3.5s linear 2.65s infinite; transform: translate(2px, 0); }
                        .dirt-3 { animation: fallDirt 3.5s linear 2.7s infinite; transform: translate(-2px, 0); }
                        
                        /* Dirt pile accumulating */
                        .dirt-pile {
                            fill: #8B5A2B;
                            transform-origin: 75px 68px; /* Bottom center point of the pile */
                            animation: pileGrow 3.5s cubic-bezier(0.2, 0.8, 0.2, 1) 2.8s forwards;
                            stroke-dasharray: 40;
                            stroke-dashoffset: 40;
                        }

                        .pop-in-windows {
                            opacity: 0;
                            transform: scale(0.5);
                            transform-origin: center;
                            animation: popIn 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1.5s forwards;
                        }

                        /* Progressive Text Reveal (wipes in from left to right as if revealed by the dirt piling) */
                        .reveal-text-mask-path {
                            animation: maskExpand 2s cubic-bezier(0.2, 0.8, 0.2, 1) 3.5s forwards;
                        }
                        
                        .fade-up-tagline {
                            opacity: 0;
                            transform: translateY(10px);
                            animation: fadeUp 0.8s ease-out 4.2s forwards;
                        }

                        @keyframes bgFadeToWhite {
                            from { background-color: #000000; }
                            to { background-color: #F2F1EC; }
                        }

                        @keyframes drawPath {
                            to { stroke-dashoffset: 0; opacity: 1; }
                        }

                        @keyframes popIn {
                            to { opacity: 1; transform: scale(1); }
                        }
                        
                        @keyframes popInTractor {
                            to { opacity: 1; transform: scale(1) translate(0, 0); }
                        }

                        /* The complex digging animation */
                        @keyframes armScoop {
                            0% { 
                                opacity: 1;
                                transform: rotate(0deg) scaleX(1); 
                            }
                            20% { 
                                opacity: 1;
                                transform: rotate(15deg) scaleX(1.1); /* Reaching down left */
                            }
                            40% { 
                                opacity: 1;
                                transform: rotate(10deg) scaleX(0.9); /* Scooping up */
                            }
                            60% { 
                                opacity: 1;
                                transform: rotate(-25deg) scaleX(1); /* Swinging to the right */
                            }
                            80% { 
                                opacity: 1;
                                transform: rotate(-25deg) scaleX(1); /* Dropping dirt */
                            }
                            100% { 
                                opacity: 1;
                                transform: rotate(0deg) scaleX(1); /* Returning to start */
                            }
                        }
                        
                        /* Dirt dropping with gravity */
                        @keyframes fallDirt {
                            0% { opacity: 0; transform: translateY(0); }
                            10% { opacity: 1; transform: translateY(5px); }
                            30% { opacity: 1; transform: translateY(20px); }
                            40% { opacity: 0; transform: translateY(25px); }
                            100% { opacity: 0; transform: translateY(25px); }
                        }

                        /* Dirt pile growing on the floor */
                        @keyframes pileGrow {
                            0% { stroke-dashoffset: 40; fill-opacity: 0; }
                            10% { stroke-dashoffset: 35; fill-opacity: 0.2; }
                            50% { stroke-dashoffset: 15; fill-opacity: 0.8; }
                            100% { stroke-dashoffset: 0; fill-opacity: 1; }
                        }

                        /* Text Wipe Reveals */
                        @keyframes maskExpand {
                            0% { width: 0%; }
                            100% { width: 100%; }
                        }
                        
                        @keyframes fadeUp {
                            to { opacity: 1; transform: translateY(0); }
                        }
                    `}
                </style>

                <svg viewBox="0 0 450 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-[100%] md:w-full h-auto">
                    {/* Definitions for progress reveal mask */}
                    <defs>
                        <clipPath id="text-reveal-mask">
                            <rect x="100" y="50" width="0" height="40" className="reveal-text-mask-path" />
                        </clipPath>
                    </defs>

                    {/* Circular Base & Icon */}
                    <g transform="translate(10, 20)">
                        {/* Outer Circle */}
                        <circle cx="35" cy="35" r="33" stroke="#001F3F" strokeWidth="3" fill="none" className="draw-circle" />

                        {/* Base Line (The Ground) */}
                        <line x1="12" y1="68" x2="100" y2="68" stroke="#001F3F" strokeWidth="3" strokeLinecap="round" className="draw-baseline" />

                        {/* Building Silhouette */}
                        <path d="M 20 68 V 35 H 35 V 20 H 55 V 68" fill="none" stroke="#001F3F" strokeWidth="3" strokeLinejoin="round" className="draw-buildings" />

                        {/* Windows */}
                        <g className="pop-in-windows">
                            <rect x="25" y="42" width="4" height="4" fill="#001F3F" />
                            <rect x="25" y="52" width="4" height="4" fill="#001F3F" />
                            <rect x="40" y="28" width="4" height="4" fill="#001F3F" />
                            <rect x="40" y="38" width="4" height="4" fill="#001F3F" />
                            <rect x="40" y="48" width="4" height="4" fill="#001F3F" />
                            <rect x="40" y="58" width="4" height="4" fill="#001F3F" />
                        </g>

                        {/* ========================================================= */}
                        {/* CUSTOM DIGGING ANIMATION LOGIC                            */}
                        {/* ========================================================= */}

                        {/* Tractor body (Stays relatively still) */}
                        <g className="tractor-body">
                            <rect x="52" y="50" width="12" height="15" fill="#001F3F" rx="2" />
                            {/* Tractor wheel / tracks */}
                            <rect x="50" y="63" width="16" height="5" fill="#001F3F" rx="1" />
                        </g>

                        {/* Dirt falling from bucket */}
                        <circle cx="75" cy="45" r="2.5" className="dirt-particle dirt-1" />
                        <circle cx="75" cy="45" r="2.5" className="dirt-particle dirt-2" />
                        <circle cx="75" cy="45" r="2.5" className="dirt-particle dirt-3" />

                        {/* Dirt pile accumulating on the ground to the right */}
                        <path d="M 68 68 Q 75 58 82 68" stroke="#8B5A2B" strokeWidth="2" fill="none" className="dirt-pile" />

                        {/* Moving Arm and Bucket */}
                        <path
                            d="M 55 50 L 68 30 L 75 40 L 72 45 M 75 40 L 78 40 L 72 48"
                            fill="none"
                            stroke="#E53935"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="excavator-arm opacity-0"
                        />
                    </g>

                    {/* Text Section (Reveals as dirt piles up from left to right) */}
                    <g clipPath="url(#text-reveal-mask)">
                        <text x="105" y="75" fill="#001F3F" style={{ fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 800, fontSize: '34px', letterSpacing: '0.5px' }}>
                            DC CONSTRUCTIONS
                        </text>
                    </g>

                    {/* Tagline */}
                    <text x="107" y="100" fill="#333333" style={{ fontFamily: 'Poppins, Arial, sans-serif', fontWeight: 500, fontSize: '13.5px', letterSpacing: '1.2px', textTransform: 'uppercase' }} className="fade-up-tagline">
                        Engineering Excellence. Living Elegance.
                    </text>

                </svg>
            </div>
        </div>
    );
};

export default Loader;
