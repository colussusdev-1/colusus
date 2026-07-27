import {
    HiOutlineGlobeAlt,
    HiOutlineUsers,
    HiOutlineBadgeCheck,
    HiOutlineStar
} from "react-icons/hi";


import "./SuccessStats.css";


const SuccessStats = () => {


    const stats = [

        {
            id:1,
            icon:<HiOutlineUsers />,
            value:"1,200+",
            label:"Applicants Guided"
        },


        {
            id:2,
            icon:<HiOutlineGlobeAlt />,
            value:"18+",
            label:"Destination Countries"
        },


        {
            id:3,
            icon:<HiOutlineBadgeCheck />,
            value:"95%",
            label:"Positive Experiences"
        },


        {
            id:4,
            icon:<HiOutlineStar />,
            value:"4.9/5",
            label:"Client Satisfaction"
        }

    ];



    return (

        <section className="success-stats">


            <div className="success-stats-container">


                {
                    stats.map((item)=>(


                        <article
                            className="success-stat-card"
                            key={item.id}
                        >


                            <div className="success-stat-icon">

                                {item.icon}

                            </div>




                            <div className="success-stat-content">


                                <strong>

                                    {item.value}

                                </strong>



                                <span>

                                    {item.label}

                                </span>


                            </div>



                        </article>


                    ))
                }


            </div>


        </section>

    );

};


export default SuccessStats;