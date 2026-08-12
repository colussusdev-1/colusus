import {
    HiX,
    HiOutlineBadgeCheck,
    HiOutlineLocationMarker,
    HiOutlineClock,
    HiOutlinePlay
} from "react-icons/hi";

import "./VideoModal.css";

const VideoModal = ({
    isOpen,
    onClose,
    videoUrl,
    title,
    story
}) => {

    if (!isOpen) {
        return null;
    }


    return (

        <div
            className="video-modal"
            role="dialog"
            aria-modal="true"
            aria-label={title || "Success story video"}
        >


            {/* =================================================
                BACKDROP
            ================================================= */}

            <div
                className="video-modal__overlay"
                onClick={onClose}
                aria-hidden="true"
            />



            {/* =================================================
                MODAL
            ================================================= */}

            <div className="video-modal__container">


                {/* CLOSE */}

                <button
                    type="button"
                    className="video-modal__close"
                    onClick={onClose}
                    aria-label="Close video"
                >

                    <HiX />

                </button>



                {/* =================================================
                    VIDEO
                ================================================= */}

                <div className="video-modal__video">

                    <iframe
                        src={videoUrl}
                        title={title || "Success story"}
                        allow="autoplay; fullscreen"
                        allowFullScreen
                    />

                </div>



                {/* =================================================
                    STORY INFORMATION
                ================================================= */}

                {
                    story && (

                        <div className="video-modal__info">


                            <span className="video-modal__badge">

                                <HiOutlinePlay />

                                Success Journey

                            </span>



                            <h2>

                                {story.name}

                                <span>
                                    successfully moved to {story.country}
                                </span>

                            </h2>



                            <p>

                                {story.text}

                            </p>



                            {/* =================================================
                                META
                            ================================================= */}

                            <div className="video-modal__meta">


                                <div>

                                    <HiOutlineLocationMarker />

                                    <span>

                                        Destination

                                        <strong>
                                            {story.country}
                                        </strong>

                                    </span>

                                </div>



                                <div>

                                    <HiOutlineClock />

                                    <span>

                                        Timeline

                                        <strong>
                                            {story.time}
                                        </strong>

                                    </span>

                                </div>



                                <div>

                                    <HiOutlineBadgeCheck />

                                    <span>

                                        Result

                                        <strong>
                                            {story.outcome}
                                        </strong>

                                    </span>

                                </div>


                            </div>


                        </div>

                    )
                }


            </div>


        </div>

    );
};

export default VideoModal;