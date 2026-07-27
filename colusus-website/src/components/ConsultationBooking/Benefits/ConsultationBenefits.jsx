import {
    HiOutlineDocumentSearch,
    HiOutlineUserGroup,
    HiOutlineMap
} from "react-icons/hi";


import "./ConsultationBenefits.css";



const benefits = [


    {
        id:1,

        icon:<HiOutlineDocumentSearch/>,

        title:"Personal Migration Assessment",

        text:
        "We review your background, qualifications, and goals to identify the most suitable migration options."

    },





    {
        id:2,

        icon:<HiOutlineUserGroup/>,

        title:"Expert Advisor Guidance",

        text:
        "Get professional guidance from experienced advisors and avoid costly mistakes during your application journey."

    },





    {
        id:3,

        icon:<HiOutlineMap/>,

        title:"Clear Migration Roadmap",

        text:
        "Receive practical next steps covering your visa pathway, documents, and preparation process."

    }



];







const ConsultationBenefits = () => {


    return (


        <section

            id="consultation-benefits"

            className="consultationBenefits"

        >



            <div className="container">





                <div className="consultationBenefits__header">



                    <span className="consultationBenefits__badge">

                        What's Included

                    </span>







                    <h2>


                        Make The Right Migration Decision


                        <strong>

                            Before You Apply.

                        </strong>


                    </h2>








                    <p>


                        Your consultation gives you clarity,
                        direction, and confidence before investing
                        time and money into your migration process.


                    </p>




                </div>









                <div className="consultationBenefits__grid">



                    {
                        benefits.map((item)=>(


                            <article

                                key={item.id}

                                className="consultationBenefits__card"

                            >




                                <div className="consultationBenefits__icon">


                                    {item.icon}


                                </div>







                                <h3>

                                    {item.title}

                                </h3>








                                <p>

                                    {item.text}

                                </p>







                            </article>


                        ))
                    }



                </div>







            </div>



        </section>


    );

};



export default ConsultationBenefits;