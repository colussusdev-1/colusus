import {
    HiArrowRight,
    HiOutlineClock,
    HiOutlineBadgeCheck,
    HiOutlineTrendingUp
} from "react-icons/hi";

import "./DetailsHero.css";


const DetailsHero = ({
    country,
    opportunity
}) => {


    const stats = [

        {
            icon:<HiOutlineClock />,
            label:"Processing",
            value:opportunity.duration
        },

        {
            icon:<HiOutlineBadgeCheck />,
            label:"Pathway",
            value:opportunity.type
        },

        {
            icon:<HiOutlineTrendingUp />,
            label:"Demand",
            value:
            opportunity.demand || country.successRate || "High"
        }

    ];




    const goToConsultation = () => {

        window.location.href = "/consultation";

    };




    return (

        <section className="details-hero">


            <img

                src={country.image}

                alt={`${country.name} ${opportunity.title}`}

                className="details-hero__image"

            />



            <div className="details-hero__overlay"/>





            <div className="details-hero__container">



                <div className="details-hero__country">


                    <span className="details-hero__flag">


                        {
                            country.flagImage ?

                            <img

                                src={country.flagImage}

                                alt={country.name}

                            />

                            :

                            country.flag
                        }


                    </span>



                    <span>

                        {country.name}

                    </span>


                </div>






                <h1>


                    {opportunity.icon}

                    {" "}

                    {opportunity.title}


                    <span>

                        {" "}in {country.name}

                    </span>


                </h1>







                <div className="details-hero__location">

                    📍 {opportunity.location}

                </div>







                <p className="details-hero__description">

                    {opportunity.description}

                </p>








                <div className="details-hero__actions">


                    <button

                        type="button"

                        className="details-hero__primary"

                        onClick={goToConsultation}

                    >

                        Book Consultation


                        <HiArrowRight/>


                    </button>


                </div>









                <div className="details-hero__stats">


                    {
                        stats.map((item)=>(


                            <div

                                className="details-hero__stat"

                                key={item.label}

                            >


                                <div className="details-hero__icon">

                                    {item.icon}

                                </div>




                                <div>


                                    <span>

                                        {item.label}

                                    </span>


                                    <strong>

                                        {item.value}

                                    </strong>


                                </div>


                            </div>


                        ))
                    }


                </div>





            </div>


        </section>

    );

};


export default DetailsHero;