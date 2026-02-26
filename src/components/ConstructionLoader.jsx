import { useState, useEffect } from 'react';
import './loader.css';

const SVG_FRAMES = [
    '/loading/vector.svg',
    '/loading/vector1.svg',
    '/loading/vector2.svg',
    '/loading/vector3.svg',
    '/loading/vector4.svg',
    '/loading/vector5.svg',
    '/loading/vector6.svg',
    '/loading/vector7.svg',
    '/loading/vector8.svg',
    '/loading/vector9.svg',
    '/loading/vector10.svg',
];

const FRAME_DURATION = 180; // ms per frame
const POST_ANIMATION_DELAY = 500; // ms to wait after last frame before fading out
const FADE_OUT_DURATION = 500; // ms css transition duration

const ConstructionLoader = () => {
    const [currentFrame, setCurrentFrame] = useState(0);
    const [isFadingOut, setIsFadingOut] = useState(false);
    const [isMounted, setIsMounted] = useState(true);
    const [imagesLoaded, setImagesLoaded] = useState(false);

    // Preload SVG frames to prevent flickering during playback
    useEffect(() => {
        let loadedCount = 0;

        SVG_FRAMES.forEach(src => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                loadedCount++;
                if (loadedCount === SVG_FRAMES.length) {
                    setImagesLoaded(true);
                }
            };
            img.onerror = () => {
                // Ensure loader doesn't get infinitely stuck if an image fails to load
                loadedCount++;
                if (loadedCount === SVG_FRAMES.length) {
                    setImagesLoaded(true);
                }
            };
        });
    }, []);

    // Handle frame animation and unmounting sequence
    useEffect(() => {
        if (!imagesLoaded) return;

        let frameTimeout;
        let delayTimeout;

        if (currentFrame < SVG_FRAMES.length - 1 && !isFadingOut) {
            // Play next frame
            frameTimeout = setTimeout(() => {
                setCurrentFrame(prev => prev + 1);
            }, FRAME_DURATION);
        } else if (currentFrame === SVG_FRAMES.length - 1 && !isFadingOut) {
            // Animation finished: Wait, then Trigger Fade-out
            delayTimeout = setTimeout(() => {
                setIsFadingOut(true);
            }, POST_ANIMATION_DELAY);
        }

        return () => {
            clearTimeout(frameTimeout);
            clearTimeout(delayTimeout);
        };
    }, [currentFrame, imagesLoaded, isFadingOut]);

    // Handle unmounting after fade out
    useEffect(() => {
        if (isFadingOut) {
            const unmountTimeout = setTimeout(() => {
                setIsMounted(false);
            }, FADE_OUT_DURATION);
            return () => clearTimeout(unmountTimeout);
        }
    }, [isFadingOut]);

    // Unmount component from DOM tree
    if (!isMounted) return null;

    return (
        <div className={`construction-loader-container ${isFadingOut ? 'fade-out' : ''}`}>
            {imagesLoaded && (
                <img
                    src={SVG_FRAMES[currentFrame]}
                    alt="DC Constructions Loading Animation"
                    className="construction-loader-image"
                />
            )}
        </div>
    );
};

export default ConstructionLoader;
