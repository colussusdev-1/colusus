import "./WhyBuy.css";

import {
    FiShield,
    FiDownload,
    FiRefreshCw,
    FiAward
} from "react-icons/fi";

const benefits = [

    {
        id:1,
        icon:<FiAward />,
        title:"Expert Created",
        description:
        "Resources developed by immigration and career professionals."
    },

    {
        id:2,
        icon:<FiDownload />,
        title:"Instant Access",
        description:
        "Download immediately after purchase on any device."
    },

    {
        id:3,
        icon:<FiRefreshCw />,
        title:"Lifetime Updates",
        description:
        "Receive future improvements at no extra cost."
    },

    {
        id:4,
        icon:<FiShield />,
        title:"Trusted Resources",
        description:
        "Used by thousands of professionals worldwide."
    }

];

const WhyBuy = () => {

    return (

        <section className="why-buy">

            <div className="why-buy-container">

                <div className="why-buy-header">

                    <span>

                        Why Choose Our Resources

                    </span>

                    <h2>

                        Built For Real Results

                    </h2>

                    <p>

                        Every guide, template and toolkit is designed
                        to help you move faster toward your global goals.

                    </p>

                </div>

                <div className="why-buy-grid">

                    {

                        benefits.map(item => (

                            <article
                                key={item.id}
                                className="benefit-card"
                            >

                                <div className="benefit-icon">

                                    {item.icon}

                                </div>

                                <h3>

                                    {item.title}

                                </h3>

                                <p>

                                    {item.description}

                                </p>

                            </article>

                        ))

                    }

                </div>

            </div>

        </section>

    );

};

export default WhyBuy;