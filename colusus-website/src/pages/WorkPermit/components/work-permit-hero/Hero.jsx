import "./Hero.css";
import HeroScene from "./HeroScene/HeroScene";
import HeroContent from "./HeroContent/HeroContent";

const Hero = ({ onStartAssessment }) => {
  return (
    <div className="work-hero">

      {/* Background */}
      <div className="hero-gradient"></div>
      <div className="hero-grid"></div>

      {/* Decorations */}
      <div className="hero-decor hero-decor-1"></div>
      <div className="hero-decor hero-decor-2"></div>
      <div className="hero-decor hero-decor-3"></div>

      <div className="wp-container hero-container">

        {/* LEFT */}
        <HeroContent onStartAssessment={onStartAssessment} />

        {/* RIGHT */}
        <div className="hero-scene-wrapper">
          <HeroScene />
        </div>

      </div>

      {/* Scroll */}
      <div className="hero-scroll" onClick={onStartAssessment}>
        <span>Explore</span>
        <div className="hero-scroll-mouse">
          <div className="hero-scroll-dot"></div>
        </div>
      </div>

    </div>
  );
};

export default Hero;