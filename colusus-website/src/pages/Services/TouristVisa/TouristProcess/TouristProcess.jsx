import "./TouristProcess.css";

import TouristProcessCard from "./TouristProcessCard";
import { touristProcess } from "../data/touristProcessData";

const TouristProcess = () => {

    return (

        <section className="touristProcess">

            <div className="touristProcess__heading">

                <span className="touristProcess__badge">

                    SIMPLE PROCESS

                </span>

                <h2>

                    Your Journey In

                    <span>

                        Three Simple Steps

                    </span>

                </h2>

                <p>

                    We simplify international travel by guiding you
                    through every stage—from understanding your options
                    to submitting your application with confidence.

                </p>

            </div>

            <div className="touristProcess__grid">

                {

                    touristProcess.map((item,index)=>(

                        <TouristProcessCard

                            key={item.id}

                            process={item}

                            last={
                                index===touristProcess.length-1
                            }

                        />

                    ))

                }

            </div>

        </section>

    );

};

export default TouristProcess;