import "./TouristProcess.css";

import TouristProcessCard from "./TouristProcessCard";
import { touristProcess } from "../data/touristProcessData";

import {
    HiOutlineClipboardCheck,
    HiOutlineDocumentSearch,
    HiOutlinePaperAirplane
} from "react-icons/hi";


const processIcons = [
    HiOutlineClipboardCheck,
    HiOutlineDocumentSearch,
    HiOutlinePaperAirplane
];


const TouristProcess = () => {


    const enhancedProcess = touristProcess.map(
        (item, index) => ({

            ...item,

            icon:
                processIcons[index]

        })
    );


    return (

        <section className="tourist-process">


            <div className="container">



                {/* HEADER */}

                <div className="tourist-process-header">


                    <span className="tourist-process-tag">

                        HOW IT WORKS

                    </span>



                    <h2>

                        A Simple Path To Your

                        <span>

                            International Journey

                        </span>

                    </h2>



                    <p>

                        From your first consultation to travel preparation,
                        our experts guide you through every important stage
                        with clarity and confidence.

                    </p>


                </div>





                {/* PROCESS GRID */}

                <div className="tourist-process-grid">


                    {
                        enhancedProcess.map((item, index) => (


                            <TouristProcessCard

                                key={item.id}

                                process={item}

                                step={index + 1}

                                last={
                                    index === enhancedProcess.length - 1
                                }


                            />


                        ))
                    }


                </div>





                {/* TRUST MESSAGE */}

                <div className="tourist-process-note">


                    <div className="tourist-process-note-icon">


                        <HiOutlinePaperAirplane />


                    </div>



                    <div>


                        <h3>

                            Your Destination Is Closer Than You Think

                        </h3>



                        <p>

                            Proper preparation increases your chances of a smooth
                            travel experience. Our team helps you understand
                            requirements, prepare documents and avoid common mistakes.

                        </p>


                    </div>


                </div>



            </div>


        </section>

    );

};


export default TouristProcess;