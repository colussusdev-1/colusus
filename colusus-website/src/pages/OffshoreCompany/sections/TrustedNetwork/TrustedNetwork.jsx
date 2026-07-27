import "./TrustedNetwork.css";

import networkData from "./networkData";

import NetworkCard from "./NetworkCard/NetworkCard";

const TrustedNetwork = () => {

    return (

        <section className="trusted-network">

            <div className="trusted-container">

                <div className="trusted-header">

                    <span>

                        Global Network

                    </span>

                    <h2>

                        Trusted Experts Across Key Jurisdictions

                    </h2>

                    <p>

                        We work alongside experienced
                        incorporation specialists,
                        compliance professionals and
                        business consultants worldwide.

                    </p>

                </div>

                <div className="network-grid">

                    {

                        networkData.map(item => (

                            <NetworkCard

                                key={item.id}

                                partner={item}

                            />

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default TrustedNetwork;