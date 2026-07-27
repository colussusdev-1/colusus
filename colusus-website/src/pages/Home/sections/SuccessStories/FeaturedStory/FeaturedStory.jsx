import {
    HiOutlinePlay,
    HiOutlineClock,
    HiOutlineLocationMarker,
    HiOutlineBadgeCheck
} from "react-icons/hi";


import "./FeaturedStory.css";


const FeaturedStory = ({
    story,
    onWatch
}) => {


    if(!story) return null;



    return (

        <section className="featured-story">


            <div className="featured-card">



                {/* IMAGE */}


                <div className="featured-card__image">


                    <img

                        src={
                            story.image ||
                            "/images/success-feature.jpg"
                        }

                        alt={story.name}

                    />



                    <div className="featured-overlay"/>



                    <button

                        className="featured-play"

                        onClick={()=>onWatch(story)}

                    >

                        <HiOutlinePlay/>

                    </button>





                    <div className="featured-outcome">


                        <HiOutlineBadgeCheck/>

                        {story.outcome}


                    </div>



                </div>








                {/* CONTENT */}


                <div className="featured-card__content">



                    <span className="featured-label">

                        {story.flag}

                        Featured Journey

                    </span>





                    <h2>

                        {story.name}

                        <span>

                            {story.country}

                        </span>

                    </h2>





                    <p>

                        {story.text}

                    </p>







                    <div className="featured-meta">


                        <span>

                            <HiOutlineLocationMarker/>

                            {story.country}

                        </span>



                        <span>

                            <HiOutlineBadgeCheck/>

                            {story.path || story.pathway}

                        </span>



                        <span>

                            <HiOutlineClock/>

                            {story.time || story.duration}

                        </span>



                    </div>








                    {
                        story.quote &&

                        <blockquote>

                            "{story.quote}"

                        </blockquote>

                    }





                    <button

                        className="featured-button"

                        onClick={()=>onWatch(story)}

                    >

                        Watch Full Story

                        <HiOutlinePlay/>

                    </button>



                </div>



            </div>


        </section>

    );

};


export default FeaturedStory;