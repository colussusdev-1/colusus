import {
    HiArrowRight
} from "react-icons/hi";


import {
    Link
} from "react-router-dom";


import "./ServiceItem.css";



const ServiceItem = ({
    service,
    onClose
}) => {


    return (


        <Link

            to={service.path}

            className="serviceItem"

            onClick={onClose}

        >



            <div className="serviceItem__content">


                <h3>

                    {service.label}

                </h3>



                <p>

                    Explore this pathway

                </p>


            </div>




            <div className="serviceItem__arrow">


                <HiArrowRight/>


            </div>




        </Link>


    );

};



export default ServiceItem;