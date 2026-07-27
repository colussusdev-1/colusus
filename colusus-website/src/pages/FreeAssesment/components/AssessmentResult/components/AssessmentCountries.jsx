import {
    HiArrowRight
} from "react-icons/hi";


const AssessmentCountries = ({
    countries
}) => {


    return (

        <div className="assessmentResult__countries">


            <h4>

                Recommended Destinations

            </h4>



            <div className="countriesGrid">


                {
                    countries.map(
                        (country, index) => (

                            <div
                                key={country.name}
                                className="countryCard"
                            >



                                <div className="countryCard__header">


                                    <span className="countryRank">

                                        #{index + 1}

                                    </span>



                                    <div className="countryFlag">

                                        {country.flag}

                                    </div>


                                </div>





                                <h5>

                                    {country.name}

                                </h5>





                                <span className="countryOpportunity">

                                    High Opportunity

                                </span>






                                <div className="countryScore">


                                    <strong>

                                        {country.match}

                                    </strong>



                                    <span>

                                        Compatibility

                                    </span>



                                </div>






                                <div className="countryProgress">


                                    <span

                                        style={{
                                            width: country.match
                                        }}

                                    />

                                </div>






                                <button className="countryAction">


                                    Explore Pathway


                                    <HiArrowRight />


                                </button>





                            </div>

                        )

                    )
                }



            </div>



        </div>

    );

};


export default AssessmentCountries;