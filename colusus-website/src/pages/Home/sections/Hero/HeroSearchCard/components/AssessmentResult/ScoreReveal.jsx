import {
    useEffect,
    useState
} from "react";


import {
    HiOutlineSparkles,
    HiOutlineTrendingUp
} from "react-icons/hi";


import "./ScoreReveal.css";



const ScoreReveal = ({
    assessment
}) => {


    const [count,setCount] = useState(0);

    const [complete,setComplete] = useState(false);



    useEffect(()=>{


        const target =
            assessment?.score || 0;


        let current = 0;


        const timer =
        setInterval(()=>{


            current += 2;



            if(current >= target){


                current = target;


                clearInterval(timer);


                setTimeout(()=>{

                    setComplete(true);

                },300);


            }



            setCount(current);



        },25);



        return ()=>clearInterval(timer);



    },[assessment]);







    const progress =
    count * 3.6;






    const confidenceText = () => {


        if(count >=90)

            return "Exceptional migration potential discovered";



        if(count >=75)

            return "Strong pathway opportunity identified";



        return "Promising international opportunity found";


    };







    return (


        <section className={`score-reveal ${complete ? "complete":""}`}>


            <div className="score-particles">

                <span></span>
                <span></span>
                <span></span>

            </div>





            <div className="score-title">


                <HiOutlineSparkles/>


                <span>

                    Your Opportunity Match

                </span>


            </div>







            <div

                className="score-circle"

                style={{

                    background:

                    `conic-gradient(

                        var(--primary)

                        ${progress}deg,

                        rgba(38,118,255,.12)

                        ${progress}deg

                    )`

                }}

            >



                <div className="score-inner">


                    <strong>

                        {count}

                        <small>%</small>

                    </strong>



                    <span>

                        Match

                    </span>


                </div>


            </div>







            <div className="score-content">


                <HiOutlineTrendingUp/>




                <h4>

                    {assessment?.match}

                </h4>




                <p>

                    {confidenceText()}

                </p>


            </div>





        </section>


    );


};


export default ScoreReveal;