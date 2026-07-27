import {
    HiOutlinePlay,
    HiOutlineClock,
    HiOutlineLocationMarker,
    HiOutlineBadgeCheck
} from "react-icons/hi";


import "./StoryCard.css";


const StoryCard = ({
    story,
    onWatch
}) => {


    if(!story) return null;



    return (

        <article className="story-card">


            {/* IMAGE */}

            <div className="story-card__visual">


                <img

                    src={
                        story.image ||
                        "/images/success-default.jpg"
                    }

                    alt={`${story.name} success story`}

                />



                <button

                    className="story-card__play"

                    onClick={() => onWatch(story)}

                    aria-label={`Watch ${story.name} story`}

                >

                    <HiOutlinePlay/>

                </button>



                <span className="story-card__outcome">


                    <HiOutlineBadgeCheck/>

                    {story.outcome}


                </span>



            </div>





            {/* CONTENT */}

            <div className="story-card__content">



                <span className="story-card__category">

                    {story.path}

                </span>





                <h3>

                    {story.name}

                </h3>





                <p>

                    {story.text}

                </p>







                <div className="story-card__meta">


                    <span>

                        <HiOutlineLocationMarker/>

                        {story.country}

                    </span>




                    <span>

                        <HiOutlineClock/>

                        {story.time}

                    </span>



                </div>






                <button

                    className="story-card__button"

                    onClick={() => onWatch(story)}

                >

                    Watch Full Story

                    <HiOutlinePlay/>


                </button>



            </div>


        </article>

    );

};


export default StoryCard;