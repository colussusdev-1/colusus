import {
    HiArrowRight,
    HiGlobeAlt,
    HiShieldCheck
} from "react-icons/hi";


import {
    useNavigate
} from "react-router-dom";


import "./CTA.css";



const CTA = () => {


    const navigate = useNavigate();




    return (


        <section className="offshore-cta">



            <div className="offshore-cta__background"></div>





            <div className="offshore-cta__content">





                <span className="offshore-cta__badge">


                    <HiGlobeAlt />


                    Global Business Expansion


                </span>







                <h2>


                    Ready To Build Your

                    <span>

                        Global Business Presence?

                    </span>


                </h2>







                <p>


                    Whether you are exploring company
                    formation, international expansion,
                    or choosing the right jurisdiction,
                    our advisors will help you understand
                    the best structure for your goals.


                </p>








                <div className="offshore-cta__features">



                    <div>


                        <HiShieldCheck/>


                        <span>

                            Expert Business Guidance

                        </span>


                    </div>




                    <div>


                        <HiGlobeAlt/>


                        <span>

                            Global Jurisdiction Advice

                        </span>


                    </div>




                </div>









                <button


                    onClick={()=>navigate("/consultation")}


                >



                    Discuss Your Business Setup


                    <HiArrowRight/>


                </button>





            </div>





        </section>


    );

};


export default CTA;