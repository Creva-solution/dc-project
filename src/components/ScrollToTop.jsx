import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
    const { pathname, hash } = useLocation();

    useEffect(() => {
        // We use a small timeout to let React finish rendering the page
        // before attempting to scroll to a specific hash element.
        setTimeout(() => {
            if (hash) {
                const id = hash.replace('#', '');
                const element = document.getElementById(id);
                if (element) {
                    // With CSS scroll-padding-top, scrollIntoView automatically
                    // accounts for the fixed navbar offset.
                    element.scrollIntoView({ behavior: 'smooth' });
                }
            } else {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }, 100);
    }, [pathname, hash]);

    return null;
};

export default ScrollToTop;
