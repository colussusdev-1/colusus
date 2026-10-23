
import AboutHero from "./sections/Hero/AboutHero";
import AboutProcess from "./sections/Process/AboutProcess";
import AboutStory from "./sections/Story/AboutStory";
import AboutWhyChooseUs from "./sections/WhyChooseUs/AboutWhyChooseUs";
import AboutValues from "./sections/Values/AboutValues";
import AboutTeam from "./sections/Team/AboutTeam";

import Footer from "../Home/sections/Footer/Footer";

const About = () => {
    const handleOpenServices = () => {
        window.dispatchEvent(
            new CustomEvent("colossus:explore-services")
        );
    };

    return (
        <>
            <AboutHero onOpenServices={handleOpenServices} />

            <AboutStory />

            <AboutWhyChooseUs />

            <AboutProcess />

            <AboutValues />

            <AboutTeam />

          
        </>
    );
};

export default About;

