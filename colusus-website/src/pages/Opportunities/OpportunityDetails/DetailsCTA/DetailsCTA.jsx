import "./DetailsCTA.css";

import {
    useNavigate
} from "react-router-dom";


const DetailsCTA = ({
    country,
    opportunity
}) => {


    const navigate = useNavigate();



    return (

        <section className="details-cta">


            <div className="details-cta-container">



                <h2>

                    Ready To Start Your

                    <span>
                        {country.name}
                    </span>

                    Journey?

                </h2>





                <p>

                    Speak with our migration experts
                    and discover the best pathway
                    for your profile.

                </p>





                <button

                    onClick={() => navigate("/consultation")}

                >

                    Book Consultation


                </button>





            </div>


        </section>

    );

};


export default DetailsCTA;