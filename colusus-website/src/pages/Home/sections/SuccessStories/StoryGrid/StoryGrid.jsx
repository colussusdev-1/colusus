import StoryCard from "./StoryCard";

import "./StoryGrid.css";


const StoryGrid = ({
    stories,
    onWatch
}) => {


    if(!stories || stories.length === 0){

        return (

            <div className="story-empty">

                No success stories available yet.

            </div>

        );

    }



    return (

        <section className="story-grid-section">


            <div className="story-grid-container">



                <header className="story-grid-header">


                    <span className="story-grid-tag">

                        More Success Journeys

                    </span>



                    <h2>

                        Real People.

                        <span>
                            Real Migration Results.
                        </span>

                    </h2>



                    <p>

                        Verified journeys from applicants who achieved
                        their migration goals through structured support.

                    </p>


                </header>





                <div className="story-grid-list">

                    {
                        stories.map(story=>(

                            <StoryCard

                                key={story.id}

                                story={story}

                                onWatch={onWatch}

                            />

                        ))
                    }


                </div>



            </div>


        </section>

    );

};


export default StoryGrid;