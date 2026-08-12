import {
    useEffect,
    useRef,
    useState
} from "react";

import "./ScrollReveal.css";


function ScrollReveal({
    children,
    className = "",
    delay = 0,
    duration = 1.25,
    distance = 55,
    direction = "up",
    once = true,
    scale = 0.92,
}) {

    const elementRef = useRef(null);

    const [isVisible, setIsVisible] = useState(false);


    useEffect(() => {

        const element = elementRef.current;

        if (!element) {
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
                threshold: 0.1,
                rootMargin: "0px 0px -80px 0px",
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
                "--scroll-reveal-delay": `${delay}s`,
                "--scroll-reveal-duration": `${duration}s`,
                "--scroll-reveal-distance": `${distance}px`,
                "--scroll-reveal-scale": scale,
            }}
        >

            {children}

        </div>

    );

}


export default ScrollReveal;