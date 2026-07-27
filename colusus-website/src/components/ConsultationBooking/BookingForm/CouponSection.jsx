import {
    HiOutlineTag,
    HiOutlineCheckCircle,
    HiOutlineXCircle
} from "react-icons/hi";


import "./CouponSection.css";



const CouponSection = ({
    formData,
    updateField,
    couponStatus,
    onApplyCoupon
}) => {



    return (



        <div className="couponSection">







            <div className="couponSection__header">



                <div className="couponSection__icon">


                    <HiOutlineTag/>


                </div>





                <div>


                    <h3>
                        Coupon Code
                    </h3>


                    <p>
                        Have a discount code? Apply it here
                    </p>


                </div>




            </div>









            <div className="couponSection__action">





                <div className="couponSection__input">


                    <HiOutlineTag />



                    <input


                        type="text"


                        placeholder="Enter coupon code"



                        value={
                            formData.couponCode || ""
                        }




                        onChange={(e)=>



                            updateField(

                                "couponCode",

                                e.target.value.toUpperCase()

                            )


                        }



                    />


                </div>







                <button


                    type="button"


                    onClick={onApplyCoupon}


                >

                    Apply Code


                </button>





            </div>









            {
                couponStatus?.type === "success" && (


                    <div className="couponMessage success">


                        <HiOutlineCheckCircle/>


                        <span>

                            Coupon applied. Consultation fee waived.

                        </span>


                    </div>


                )
            }








            {
                couponStatus?.type === "error" && (


                    <div className="couponMessage error">


                        <HiOutlineXCircle/>


                        <span>

                            Invalid coupon code. Try again.

                        </span>


                    </div>


                )
            }







        </div>


    );

};



export default CouponSection;