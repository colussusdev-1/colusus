import {
    HiOutlineCheckCircle
} from "react-icons/hi";


const TouristProcessCard = ({
    process,
    last,
    step
}) => {


    const Icon = process.icon;


    return (

        <article className="tpCard">


            {/* ICON TIMELINE */}

            <div className="tpCard__top">


                <div className="tpCard__circle">


                    {
                        Icon && <Icon />
                    }


                </div>



                {
                    !last && (

                        <div className="tpCard__line"></div>

                    )
                }


            </div>





            {/* CONTENT CARD */}

            <div className="tpCard__glass">


                <span className="tpCard__step">


                    STEP {step || process.step}


                </span>




                <h3>

                    {process.title}

                </h3>



                <p>

                    {process.description}

                </p>





                <div className="tpCard__footer">


                    <span className="tpCard__pill">


                        <HiOutlineCheckCircle />


                        Expert Guidance


                    </span>



                </div>



            </div>




        </article>

    );

};


export default TouristProcessCard;