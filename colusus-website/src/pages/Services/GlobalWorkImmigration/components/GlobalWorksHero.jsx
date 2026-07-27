import "./GlobalWorksHero.css";

const GlobalWorksHero = () => {

    return (

        <section className="global-hero">


            {/* VIDEO BACKGROUND */}

            <video
                className="global-hero-video"
                autoPlay
                muted
                loop
                playsInline
            >

                <source
                    src="https://colossusmigration.com/wp-content/uploads/2026/06/COLOSSUS-ADS-VIDEO1.mp4"
                    type="video/mp4"
                />

            </video>


            {/* SOFT OVERLAY */}

            <div className="global-hero-overlay"></div>



            {/* CONTENT */}

            <div className="global-hero-content">


                <span className="tag">
                    GLOBAL WORK & IMMIGRATION
                </span>


                <h1>
                    Work Anywhere.
                    <span> Live Everywhere.</span>
                </h1>


                <p>
                    Explore global migration pathways, remote work visas,
                    and international job opportunities designed for modern mobility.
                </p>


            </div>


        </section>

    );

};

export default GlobalWorksHero;