import {
    useState
} from "react";


import "./FAQ.css";


import faqData from "./faqData";


import FAQItem from "./FAQItem";




const FAQ = () => {


    const [activeId,setActiveId] = useState(null);





    const handleToggle = (id)=>{


        setActiveId(current =>

            current === id

            ? null

            : id

        );


    };






    return (


        <section className="faq-section">



            <div className="faq-container">





                <div className="faq-header">


                    <span>

                        Frequently Asked Questions

                    </span>





                    <h2>

                        Everything You Need To Know

                    </h2>





                    <p>

                        Get answers about offshore company
                        formation, international business setup,
                        compliance and global expansion.

                    </p>



                </div>







                <div className="faq-list">


                    {
                        faqData.map(item=>(


                            <FAQItem


                                key={item.id}


                                item={item}



                                isOpen={

                                    activeId === item.id

                                }



                                onToggle={()=>


                                    handleToggle(item.id)

                                }



                            />


                        ))
                    }



                </div>




            </div>



        </section>


    );


};


export default FAQ;