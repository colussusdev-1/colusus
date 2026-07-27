import "./JurisdictionCard.css";


import {
    FiBriefcase,
    FiClock,
    FiTrendingUp
} from "react-icons/fi";



const JurisdictionCard = ({
    jurisdiction
}) => {


    return (


        <article className="jurisdiction-card">





            <div className="jurisdiction-top">


                <img

                    src={jurisdiction.flag}

                    alt={jurisdiction.country}

                />



                <span>

                    Global Market

                </span>


            </div>







            <h3>

                {jurisdiction.country}

            </h3>







            <p className="jurisdiction-description">


                {jurisdiction.benefit}


            </p>









            <div className="jurisdiction-meta">



                <div>


                    <FiBriefcase/>


                    <span>

                        {jurisdiction.structure}

                    </span>


                </div>






                <div>


                    <FiClock/>


                    <span>

                        Setup Timeline

                        <br/>

                        {jurisdiction.timeline}

                    </span>


                </div>






            </div>








            <div className="jurisdiction-cost">


                <FiTrendingUp/>


                <span>

                    Business Environment:
                    {jurisdiction.cost}

                </span>



            </div>








        </article>


    );

};


export default JurisdictionCard;