import {
    HiOutlineUser,
    HiOutlineMail,
    HiOutlinePhone
} from "react-icons/hi";


import "./PersonalInfo.css";



const PersonalInfo = ({
    formData,
    updateField
}) => {



    return (


        <div className="personalInfo">



            <div className="personalInfo__header">


                <div className="personalInfo__icon">

                    <HiOutlineUser />

                </div>



                <div>

                    <h3>
                        Personal Information
                    </h3>

                    <p>
                        Provide your basic details
                    </p>

                </div>


            </div>









            <div className="personalInfo__grid">





                <div className="personalInfo__field">

                    <label>
                        Full Name
                    </label>


                    <div className="personalInfo__input">


                        <HiOutlineUser />


                        <input

                            type="text"

                            placeholder="John Doe"

                            value={formData.fullName}

                            onChange={(e)=>
                                updateField(
                                    "fullName",
                                    e.target.value
                                )
                            }

                        />

                    </div>

                </div>









                <div className="personalInfo__field">


                    <label>
                        Email Address
                    </label>


                    <div className="personalInfo__input">


                        <HiOutlineMail />


                        <input

                            type="email"

                            placeholder="example@email.com"

                            value={formData.email}

                            onChange={(e)=>
                                updateField(
                                    "email",
                                    e.target.value
                                )
                            }

                        />

                    </div>


                </div>









                <div className="personalInfo__field">


                    <label>
                        Phone Number
                    </label>



                    <div className="personalInfo__input">


                        <HiOutlinePhone />



                        <input

                            type="tel"

                            placeholder="+234 800 000 0000"

                            value={formData.phone}

                            onChange={(e)=>
                                updateField(
                                    "phone",
                                    e.target.value
                                )
                            }

                        />

                    </div>


                </div>









                <div className="personalInfo__field">


                    <label>
                        Age
                    </label>


                    <input

                        className="personalInfo__plain"

                        type="number"

                        placeholder="Age"

                        value={formData.age}

                        onChange={(e)=>
                            updateField(
                                "age",
                                e.target.value
                            )
                        }

                    />

                </div>









                <div className="personalInfo__field">


                    <label>
                        Education Level
                    </label>


                    <select

                        value={formData.education}

                        onChange={(e)=>
                            updateField(
                                "education",
                                e.target.value
                            )
                        }

                    >

                        <option value="">
                            Select level
                        </option>

                        <option>
                            High School
                        </option>

                        <option>
                            Diploma
                        </option>

                        <option>
                            Bachelor Degree
                        </option>

                        <option>
                            Masters
                        </option>


                    </select>


                </div>









                <div className="personalInfo__field">


                    <label>
                        Marital Status
                    </label>


                    <select

                        value={formData.maritalStatus}

                        onChange={(e)=>
                            updateField(
                                "maritalStatus",
                                e.target.value
                            )
                        }

                    >

                        <option value="">
                            Select status
                        </option>


                        <option>
                            Single
                        </option>


                        <option>
                            Married
                        </option>


                        <option>
                            Divorced
                        </option>


                    </select>


                </div>





            </div>




        </div>


    );

};



export default PersonalInfo;