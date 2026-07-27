import {
    HiOutlineGlobeAlt,
    HiOutlineAcademicCap,
    HiOutlineBriefcase,
    HiOutlineArrowRight
} from "react-icons/hi";


import "./AssessmentForm.css";


const AssessmentForm = ({
    formData,
    handleChange,
    handleSubmit,
    currentAssessment
}) => {



    const renderIcon = () => {


        if (!currentAssessment) {

            return <HiOutlineBriefcase/>;

        }



        switch(currentAssessment.icon){


            case "academic":

                return <HiOutlineAcademicCap/>;



            case "globe":

                return <HiOutlineGlobeAlt/>;



            default:

                return <HiOutlineBriefcase/>;


        }

    };





    return (

        <>


            <div className="hero-card-header">


                <div className="card-top">


                    <span className="card-badge">

                        Free Assessment

                    </span>



                    <span className="card-time">

                        2 min

                    </span>


                </div>





                <h3>

                    Find Your Migration Pathway

                </h3>





                <p>

                    Discover opportunities matched
                    to your personal profile.

                </p>



            </div>








            <form

                className="hero-form"

                onSubmit={handleSubmit}

            >




                <div className="input-icon">


                    <HiOutlineGlobeAlt/>


                    <select

                        name="destination"

                        value={formData.destination}

                        onChange={handleChange}

                    >


                        <option value="">

                            Destination

                        </option>


                        <option value="Canada">

                            Canada

                        </option>


                        <option value="United Kingdom">

                            United Kingdom

                        </option>


                        <option value="Australia">

                            Australia

                        </option>


                        <option value="Germany">

                            Germany

                        </option>


                    </select>


                </div>









                <div className="input-icon">


                    <HiOutlineAcademicCap/>


                    <select

                        name="purpose"

                        value={formData.purpose}

                        onChange={handleChange}

                    >


                        <option value="">

                            Purpose

                        </option>



                        <option value="Study">

                            Study

                        </option>



                        <option value="Work">

                            Work

                        </option>



                        <option value="Permanent Residence">

                            Permanent Residence

                        </option>



                        <option value="Business">

                            Business

                        </option>



                        <option value="Visit">

                            Visit

                        </option>


                    </select>


                </div>









                {
                    currentAssessment &&

                    (

                        <div className="input-icon">


                            {renderIcon()}





                            <select

                                name="requirement"

                                value={formData.requirement}

                                onChange={handleChange}

                            >


                                <option value="">

                                    {currentAssessment.label}

                                </option>





                                {
                                    currentAssessment.options.map(item => (

                                        <option

                                            key={item.label}

                                            value={item.label}

                                        >

                                            {item.label}

                                        </option>


                                    ))
                                }



                            </select>


                        </div>


                    )
                }









                <button

                    className="hero-submit"

                    type="submit"

                >

                    Check My Eligibility


                    <HiOutlineArrowRight/>

                </button>



            </form>





            <div className="hero-card-footer">


                <div>

                    ✓ No Fees

                </div>



                <div>

                    ✓ Licensed Advisors

                </div>



                <div>

                    ✓ Fast Reply

                </div>


            </div>



        </>

    );

};


export default AssessmentForm;