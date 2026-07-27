import "./Jurisdictions.css";

import jurisdictions from "./jurisdictionData";

import JurisdictionCard from "./JurisdictionCard/JurisdictionCard";

import {
    FiArrowRight
} from "react-icons/fi";

import {
    useNavigate
} from "react-router-dom";



const Jurisdictions = () => {


    const navigate = useNavigate();



    return (


        <section

            id="jurisdictions"

            className="jurisdictions"

        >



            <div className="jurisdictions-container">






                <div className="jurisdictions-header">


                    <span>

                        Global Opportunities

                    </span>



                    <h2>

                        Explore Business Destinations

                    </h2>



                    <p>

                        Different jurisdictions offer different
                        advantages for entrepreneurs, investors
                        and international businesses. Discover
                        where your goals may fit best.

                    </p>



                </div>








                <div className="jurisdictions-grid">


                    {
                        jurisdictions.map(item=>(

                            <JurisdictionCard

                                key={item.id}

                                jurisdiction={item}

                            />

                        ))
                    }



                </div>







                <div className="jurisdictions-cta">



                    <h3>

                        Ready To Explore The Right Country
                        For Your Global Business?

                    </h3>



                    <p>

                        Speak with our advisors and discover
                        which international pathway aligns
                        with your goals.

                    </p>





                    <button

                        onClick={()=>navigate("/consultation")}

                    >

                        Book A Business Consultation


                        <FiArrowRight/>


                    </button>




                </div>







            </div>


        </section>

    );

};


export default Jurisdictions;