import { useEffect, useState } from "react";

const useRotatePathways = (pathways) => {

    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {

        const timer = setInterval(() => {

            setActiveIndex((prev) =>

                (prev + 1) % pathways.length

            );

        }, 10000);

        return () => clearInterval(timer);

    }, [pathways.length]);

    const featured = pathways[activeIndex];

    const others = pathways.filter(

        (_, index) => index !== activeIndex

    );

    return {

        featured,

        others,

        activeIndex,

    };

};

export default useRotatePathways;