import { useState } from "react";

import StoryHero from "./StoryHero/StoryHero";
import FeaturedStory from "./FeaturedStory/FeaturedStory";
import StoryGrid from "./StoryGrid/StoryGrid";
import VideoModal from "./VideoModal/VideoModal";

import successStoriesData from "./successStoriesData";

import "./SuccessStories.css";


const filters = [

    {
        key:"all",
        label:"All Stories"
    },

    {
        key:"pr",
        label:"Canada PR"
    },

    {
        key:"work",
        label:"Work Visa"
    },

    {
        key:"study",
        label:"Study Abroad"
    }

];



const SuccessStories = () => {


    const [activeFilter,setActiveFilter] = useState("all");

    const [selectedStory,setSelectedStory] = useState(null);

    const [isOpen,setIsOpen] = useState(false);



    const featuredStory = successStoriesData?.[0];



    const remainingStories =
        successStoriesData.filter(
            story => story.id !== featuredStory?.id
        );



    const filteredStories =

        activeFilter === "all"

        ?

        remainingStories

        :

        remainingStories.filter(
            story =>
            story.type === activeFilter
        );





    const handleWatch = (story)=>{

        setSelectedStory(story);

        setIsOpen(true);

    };





    const closeVideo = ()=>{

        setIsOpen(false);

        setSelectedStory(null);

    };





    return (

        <section className="success">


            <div className="container">



                {/* HERO */}

                <StoryHero />





                {/* FEATURED STORY */}

                {
                    featuredStory && (

                        <FeaturedStory

                            story={featuredStory}

                            onWatch={handleWatch}

                        />

                    )
                }







                {/* FILTERS */}

                <div className="filter-bar">


                    {
                        filters.map(filter=>(


                            <button

                                key={filter.key}

                                className={
                                    activeFilter === filter.key
                                    ?
                                    "filter-btn active"
                                    :
                                    "filter-btn"
                                }


                                onClick={() =>
                                    setActiveFilter(filter.key)
                                }

                            >

                                {filter.label}


                            </button>


                        ))
                    }


                </div>








                {/* STORY COLLECTION */}

                <StoryGrid

                    stories={filteredStories}

                    onWatch={handleWatch}

                />








                {/* VIDEO MODAL */}

                <VideoModal


                    isOpen={isOpen}


                    onClose={closeVideo}


                    videoUrl={selectedStory?.video}


                    title={selectedStory?.name}


                    story={selectedStory}


                />









                {/* FINAL CTA */}

                <div className="video-strip">


                    <p>

                        Want results like these?

                    </p>



                    <button className="video-btn">

                        Start Your Application

                    </button>


                </div>



            </div>


        </section>

    );

};


export default SuccessStories;