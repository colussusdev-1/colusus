import {
    useEffect,
    useState
} from "react";

import StoryHero
    from "./StoryHero/StoryHero";

import StoryGrid
    from "./StoryGrid/StoryGrid";

import ImpactStats
    from "./ImpactStats/ImpactStats";

import SuccessCTA
    from "./SuccessCTA/SuccessCTA";

import VideoModal
    from "./VideoModal/VideoModal";

import successStoriesData
    from "./successStoriesData";

import "./SuccessStories.css";


/* =========================================================
   STORY FILTERS
========================================================= */

const filters = [

    {
        key: "all",
        label: "All Stories"
    },

    {
        key: "pr",
        label: "Canada PR"
    },

    {
        key: "work",
        label: "Work Visa"
    },

    {
        key: "study",
        label: "Study Abroad"
    }

];


const SuccessStories = () => {


    /* =====================================================
       FILTER
    ===================================================== */

    const [
        activeFilter,
        setActiveFilter
    ] = useState("all");



    /* =====================================================
       VIDEO MODAL
    ===================================================== */

    const [
        selectedStory,
        setSelectedStory
    ] = useState(null);


    const [
        isOpen,
        setIsOpen
    ] = useState(false);



    /* =====================================================
       FEATURED STORY
    ===================================================== */

    const featuredStory =
        successStoriesData?.[0];



    /* =====================================================
       REMAINING STORIES
    ===================================================== */

    const remainingStories =
        successStoriesData.filter(
            (story) =>
                story.id !== featuredStory?.id
        );



    /* =====================================================
       FILTERED STORIES
    ===================================================== */

    const filteredStories =

        activeFilter === "all"

            ? remainingStories

            : remainingStories.filter(
                (story) =>
                    story.type === activeFilter
            );



    /* =====================================================
       OPEN VIDEO
    ===================================================== */

    const handleWatch = (story) => {

        if (!story) {
            return;
        }


        setSelectedStory(story);

        setIsOpen(true);

    };



    /* =====================================================
       CLOSE VIDEO
    ===================================================== */

    const closeVideo = () => {

        setIsOpen(false);

        setSelectedStory(null);

    };



    /* =====================================================
       LOCK PAGE SCROLL WHEN MODAL IS OPEN
    ===================================================== */

    useEffect(() => {

        if (!isOpen) {

            document.body.style.overflow = "";

            return;

        }


        const previousOverflow =
            document.body.style.overflow;


        document.body.style.overflow = "hidden";


        return () => {

            document.body.style.overflow =
                previousOverflow;

        };

    }, [isOpen]);



    /* =====================================================
       ESCAPE KEY
    ===================================================== */

    useEffect(() => {

        if (!isOpen) {
            return;
        }


        const handleKeyDown = (event) => {

            if (event.key === "Escape") {

                closeVideo();

            }

        };


        document.addEventListener(
            "keydown",
            handleKeyDown
        );


        return () => {

            document.removeEventListener(
                "keydown",
                handleKeyDown
            );

        };

    }, [isOpen]);



    /* =====================================================
       RENDER
    ===================================================== */

    return (

        <section className="success">


            {/* =================================================
                PAGE CONTAINER
            ================================================= */}

            <div className="container">


                {/* =================================================
                    HERO
                ================================================= */}

                {
                    featuredStory && (

                        <StoryHero

                            story={featuredStory}

                            onWatch={handleWatch}

                        />

                    )
                }



                {/* =================================================
                    FILTER BAR
                ================================================= */}

                <div className="filter-bar">


                    {
                        filters.map(
                            (filter) => (

                                <button

                                    key={filter.key}

                                    type="button"

                                    className={

                                        activeFilter ===
                                            filter.key

                                            ? "filter-btn active"

                                            : "filter-btn"

                                    }

                                    onClick={() =>
                                        setActiveFilter(
                                            filter.key
                                        )
                                    }

                                >

                                    {filter.label}

                                </button>

                            )
                        )
                    }


                </div>



                {/* =================================================
                    STORY COLLECTION
                ================================================= */}

                <StoryGrid

                    stories={filteredStories}

                    onWatch={handleWatch}

                />



                {/* =================================================
                    IMPACT STATISTICS
                ================================================= */}

                <ImpactStats />



                {/* =================================================
                    SUCCESS CTA
                ================================================= */}

                <SuccessCTA />



            </div>



            {/* =====================================================
                VIDEO MODAL

                IMPORTANT:
                Kept outside the page container so the fixed
                modal is positioned relative to the viewport.
            ===================================================== */}

            <VideoModal

                isOpen={isOpen}

                onClose={closeVideo}

                videoUrl={
                    selectedStory?.video
                }

                title={
                    selectedStory?.name
                }

                story={
                    selectedStory
                }

            />


        </section>

    );

};


export default SuccessStories;