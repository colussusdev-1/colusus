import "./Webinar.css";

import webinarMockData from "./data/webinarMockData";

import WebinarHeader from "./components/WebinarHeader";
import WebinarPlayer from "./components/WebinarPlayer";
import WebinarHost from "./components/WebinarHost";
import WebinarCTA from "./components/WebinarCTA";
import WebinarFooter from "./components/WebinarFooter";


function Webinar() {

    const webinar = webinarMockData;


    return (

        <div className="webinar-page">

            {/* ==================================================
                EVENT HERO
            ================================================== */}

            <WebinarHeader webinar={webinar} />


            {/* ==================================================
                LIVE SESSION
            ================================================== */}

            <main className="webinar-main">

                <section
                    className="webinar-session"
                    id="webinar-session"
                >

                    <div className="webinar-session-container">

                        <div className="webinar-session-heading">

                            <div className="webinar-session-heading-copy">

                                <span className="webinar-section-kicker">
                                    The live session
                                </span>


                                <h2>
                                    Ireland Nursing Webinar
                                </h2>


                                <p>
                                    Join the session, follow the conversation,
                                    and get practical guidance from the
                                    Colossus Migration & Tours team.
                                </p>

                            </div>


                            <div className="webinar-session-heading-status">

                                <span className="webinar-session-status-dot" />

                                <span>
                                    Live session
                                </span>

                            </div>

                        </div>


                        {/* ==================================================
                            LIVE PLAYER
                        ================================================== */}

                        <div className="webinar-session-player">

                            <WebinarPlayer
                                webinar={webinar}
                            />

                        </div>


                        {/* ==================================================
                            EVENT META
                        ================================================== */}


                    </div>

                </section>


                {/* ==================================================
                    HOST
                ================================================== */}

                <section className="webinar-host-section">

                    <div className="webinar-host-container">

                        <div className="webinar-host-intro">

                            <span className="webinar-section-kicker">
                                Your hosts
                            </span>


                            <h2>
                                Guidance from people
                                who understand the journey.
                            </h2>


                            <p>
                                Get clear, practical information about
                                international recruitment, migration
                                pathways, documentation and the realities
                                of relocating abroad.
                            </p>

                        </div>


                        <WebinarHost webinar={webinar} />

                    </div>

                </section>


                {/* ==================================================
                    CTA
                ================================================== */}

                {webinar.cta?.enabled && (

                    <section className="webinar-cta-section">

                        <div className="webinar-cta-container">

                           

                            <WebinarCTA webinar={webinar} />

                        </div>

                    </section>

                )}

            </main>


            {/* ==================================================
                FOOTER
            ================================================== */}

            <WebinarFooter webinar={webinar} />

        </div>

    );

}


export default Webinar;