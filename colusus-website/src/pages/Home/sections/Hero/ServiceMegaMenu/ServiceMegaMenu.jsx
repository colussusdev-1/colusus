import {
    useEffect,
    useRef
} from "react";


import {
    useNavigate
} from "react-router-dom";


import {
    HiOutlineX,
    HiSparkles
} from "react-icons/hi";


import ServiceItem from "./ServiceItem";


import "./ServiceMegaMenu.css";



const ServiceMegaMenu = ({
    services,
    onClose
}) => {


    const menuRef = useRef(null);


    const navigate = useNavigate();






    useEffect(()=>{


        const handleOutsideClick = (event)=>{


            if(
                menuRef.current &&
                !menuRef.current.contains(event.target)
            ){

                onClose();

            }


        };



        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );



        return ()=>{


            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );


        };


    },[onClose]);







    useEffect(()=>{


        const handleEscape = (event)=>{


            if(event.key === "Escape"){

                onClose();

            }


        };



        window.addEventListener(
            "keydown",
            handleEscape
        );



        return ()=>{


            window.removeEventListener(
                "keydown",
                handleEscape
            );


        };


    },[onClose]);








    const handleAssessment = ()=>{


        onClose();


        navigate("/free-assessment");


    };








    return (

        <>


            <div

                className="serviceMenu__overlay"

                onClick={onClose}

            />







            <div

                ref={menuRef}

                className="serviceMenu"

            >





                <div className="serviceMenu__header">


                    <div>


                        <div className="serviceMenu__title">


                            <HiSparkles/>


                            Explore Services


                        </div>




                        <p>

                            Find your migration pathway

                        </p>


                    </div>






                    <button

                        onClick={onClose}

                    >

                        <HiOutlineX/>


                    </button>



                </div>









                <div className="serviceMenu__list">


                    {
                        (services || []).map(service=>(


                            <ServiceItem

                                key={service.path}

                                service={service}

                                onClose={onClose}

                            />


                        ))
                    }



                </div>









                <div className="serviceMenu__footer">


                    <span>

                        Not sure where you qualify?

                    </span>





                    <button

                        onClick={handleAssessment}

                    >

                        Take Free Assessment →

                    </button>


                </div>







            </div>


        </>

    );

};


export default ServiceMegaMenu;