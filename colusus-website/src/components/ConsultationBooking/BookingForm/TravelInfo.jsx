import {
    HiOutlineGlobeAlt,
    HiOutlineBriefcase,
    HiOutlineDocumentText,
    HiOutlineCalendar
} from "react-icons/hi";


import "./TravelInfo.css";



const TravelInfo = ({
    formData,
    updateField
}) => {



    const travelPackages = [
        "Individual",
        "Family",
        "Student",
        "Business"
    ];



    const visaClasses = [
        "Tourist",
        "Student",
        "Work",
        "Business",
        "Permanent Residence"
    ];






    return (



        <div className="travelInfo">





            <div className="travelInfo__header">


                <div className="travelInfo__icon">

                    <HiOutlineGlobeAlt />

                </div>



                <div>

                    <h3>
                        Travel Information
                    </h3>


                    <p>
                        Tell us about your migration plans
                    </p>


                </div>



            </div>












            <div className="travelInfo__grid">







                {/* PACKAGE */}



                <div className="travelInfo__section">


                    <label>
                        Travel Package
                    </label>



                    <div className="travelInfo__pills">


                        {
                            travelPackages.map(item=>(


                                <button

                                    type="button"

                                    key={item}

                                    className={
                                        formData.travelPackage === item
                                        ?
                                        "active"
                                        :
                                        ""
                                    }


                                    onClick={()=>


                                        updateField(
                                            "travelPackage",
                                            item
                                        )


                                    }

                                >

                                    <HiOutlineBriefcase />

                                    {item}


                                </button>


                            ))
                        }



                    </div>


                </div>












                {/* COUNTRY */}



                <div className="travelInfo__field">


                    <label>
                        Countries Interested
                    </label>



                    <div className="travelInfo__input">


                        <HiOutlineGlobeAlt />



                        <input

                            type="text"

                            placeholder="USA, Canada, UK..."

                            value={formData.countries}

                            onChange={(e)=>

                                updateField(
                                    "countries",
                                    e.target.value
                                )

                            }

                        />

                    </div>


                </div>












                {/* VISA */}



                <div className="travelInfo__section">


                    <label>
                        Visa Class
                    </label>



                    <div className="travelInfo__pills">


                        {
                            visaClasses.map(item=>(


                                <button

                                    type="button"

                                    key={item}


                                    className={
                                        formData.visaClass === item
                                        ?
                                        "active"
                                        :
                                        ""
                                    }



                                    onClick={()=>


                                        updateField(
                                            "visaClass",
                                            item
                                        )

                                    }


                                >


                                    <HiOutlineDocumentText />


                                    {item}


                                </button>


                            ))
                        }


                    </div>



                </div>













                {/* DATE */}



                <div className="travelInfo__field">


                    <label>
                        Preferred Travel Date
                    </label>




                    <div className="travelInfo__input">


                        <HiOutlineCalendar />



                        <input

                            type="date"


                            value={
                                formData.travelDate
                            }


                            onChange={(e)=>

                                updateField(
                                    "travelDate",
                                    e.target.value
                                )

                            }

                        />



                    </div>



                </div>






            </div>





        </div>



    );

};



export default TravelInfo;