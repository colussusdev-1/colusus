import {
    useEffect,
    useRef,
    useState,
} from "react";

import "./ScrollReveal.css";

function ScrollReveal({
    children,
    className = "",
    delay = 0,
    duration = 0.35,
    distance = 18,
    direction = "up",
    once = true,
    scale = 0.96,
}) {
    const elementRef = useRef(null);


    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const element = elementRef.current;

        if (!element) {
            return;
        }

        // Respect reduced-motion preferences.
        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        if (
            prefersReducedMotion ||
            !("IntersectionObserver" in window)
        ) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true);

                    if (once) {
                        observer.unobserve(element);
                    }
                } else if (!once) {
                    setIsVisible(false);
                }
            },
            {
                // Trigger as soon as a small part of the section enters.
                threshold: 0,

                // Start revealing content before it reaches the viewport.
                rootMargin: "0px 0px 120px 0px",
            }
        );

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, [once]);

    const classes = [
        "scroll-reveal",
        `scroll-reveal-${direction}`,
        isVisible ? "scroll-reveal-visible" : "",
        className,
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            ref={elementRef}
            className={classes}
            style={{
                "--scroll-reveal-delay": `${Math.max(0, delay)}s`,
                "--scroll-reveal-duration": `${Math.max(0.15, duration)}s`,
                "--scroll-reveal-distance": `${Math.max(0, distance)}px`,
                "--scroll-reveal-scale": scale,
            }}
        >
            {children}
        </div>
    );


}

export default ScrollReveal;
