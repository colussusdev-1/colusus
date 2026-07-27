import {
    HiOutlineCalendar,
    HiOutlineChatAlt2,
    HiOutlineVideoCamera,
    HiOutlinePhone,
    HiOutlineOfficeBuilding
} from "react-icons/hi";


import "./ConsultationInfo.css";



const ConsultationInfo = ({
    formData,
    updateField
}) => {



    const consultationTypes = [

        {
            title:"Online Meeting",
            icon:<HiOutlineVideoCamera/>
        },

        {
            title:"Phone Consultation",
            icon:<HiOutlinePhone/>
        },

        {
            title:"Office Visit",
            icon:<HiOutlineOfficeBuilding/>
        }

    ];







    return (



        <div className="consultationInfo">






            <div className="consultationInfo__header">


                <div className="consultationInfo__icon">


                    <HiOutlineChatAlt2/>


                </div>



                <div>


                    <h3>
                        Consultation Details
                    </h3>


                    <p>
                        Select your preferred consultation schedule
                    </p>


                </div>


            </div>









            <div className="consultationInfo__grid">







                {/* DATE */}



                <div className="consultationInfo__field">


                    <label>
                        Consultation Booking Date
                    </label>




                    <div className="consultationInfo__input">


                        <HiOutlineCalendar/>


                        <input

                            type="date"

                            value={
                                formData.consultationDate
                            }


                            onChange={(e)=>

                                updateField(
                                    "consultationDate",
                                    e.target.value
                                )

                            }

                        />


                    </div>



                </div>









                {/* TYPE */}



                <div className="consultationInfo__field">


                    <label>
                        Consultation Type
                    </label>




                    <div className="consultationInfo__types">


                        {
                            consultationTypes.map(item=>(


                                <button


                                    type="button"


                                    key={item.title}



                                    className={

                                        formData.consultationType === item.title

                                        ?

                                        "active"

                                        :

                                        ""

                                    }



                                    onClick={()=>


                                        updateField(

                                            "consultationType",

                                            item.title

                                        )


                                    }


                                >



                                    {item.icon}



                                    <span>

                                        {item.title}

                                    </span>



                                </button>



                            ))
                        }


                    </div>



                </div>









                {/* MESSAGE */}



                <div className="consultationInfo__field">


                    <label>
                        Message
                    </label>



                    <textarea


                        placeholder="Tell us about your migration goals..."


                        value={
                            formData.message
                        }



                        onChange={(e)=>


                            updateField(

                                "message",

                                e.target.value

                            )


                        }


                    />



                </div>







            </div>







        </div>


    );

};



export default ConsultationInfo;