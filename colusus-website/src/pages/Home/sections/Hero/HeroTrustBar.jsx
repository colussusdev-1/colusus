import {
    HiStar,
    HiOutlineUsers,
    HiOutlineGlobeAlt,
    HiOutlineShieldCheck,
} from "react-icons/hi";

import "./HeroTrustBar.css";


const HeroTrustBar = () => {

    const trustItems = [

        {
            icon:<HiStar />,
            value:"4.9/5",
            label:"Rating",
            className:"star-icon"
        },

        {
            icon:<HiOutlineUsers />,
            value:"5,000+",
            label:"Applications"
        },

        {
            icon:<HiOutlineGlobeAlt />,
            value:"18+",
            label:"Countries"
        },

        {
            icon:<HiOutlineShieldCheck />,
            value:"Licensed",
            label:"Experts"
        }

    ];


    return (

        <div className="hero-trust">

            {
                trustItems.map((item,index)=>(

                    <div
                        className="trust-item"
                        key={index}
                    >

                        <div
                            className={
                                `trust-icon ${
                                    item.className || ""
                                }`
                            }
                        >

                            {item.icon}

                        </div>


                        <div className="trust-content">

                            <strong>
                                {item.value}
                            </strong>


                            <span>
                                {item.label}
                            </span>

                        </div>


                    </div>

                ))
            }

        </div>

    );

};


export default HeroTrustBar;