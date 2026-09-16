import {
    FaComments,
    FaPaperPlane,
} from "react-icons/fa";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import "./WebinarChat.css";


function WebinarChat({ webinar }) {

    const [message, setMessage] = useState("");
    const [visibleMessages, setVisibleMessages] = useState([]);

    const messagesContainerRef = useRef(null);
    const timeoutRef = useRef(null);

    const messages = webinar?.chat || [];


    /*
     * Always use the viewer's actual current time.
     */
    const formatCurrentTime = () => {

        return new Intl.DateTimeFormat(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit",
            }
        ).format(new Date());

    };


    /*
     * Random short delay between chat activity.
     *
     * Usually:
     * 2–3 seconds
     *
     * This keeps the conversation feeling active
     * without looking like a fixed timer.
     */
    const getRandomDelay = () => {

        return (
            Math.floor(
                Math.random() * 1400
            ) + 1800
        );

    };


    /*
     * Occasionally release multiple comments
     * together so the chat feels like several
     * people are actively watching.
     */
    const getBurstSize = () => {

        const random =
            Math.random();


        if (random < 0.18) {
            return 3;
        }


        if (random < 0.55) {
            return 2;
        }


        return 1;

    };


    /*
     * Continuously generate chat activity.
     *
     * When we reach the end of the mock messages,
     * start again from the beginning.
     *
     * This means the chat NEVER stops simply because
     * the visible chat box is full.
     */
    useEffect(() => {

        setVisibleMessages([]);

        if (!messages.length) {
            return undefined;
        }


        let currentIndex = 0;
        let cancelled = false;


        const releaseBurst = () => {

            if (cancelled) {
                return;
            }


            const burstSize =
                getBurstSize();


            const burstMessages = [];


            for (
                let i = 0;
                i < burstSize;
                i += 1
            ) {

                /*
                 * Loop back to the beginning when
                 * every mock comment has been used.
                 */
                if (
                    currentIndex >=
                    messages.length
                ) {
                    currentIndex = 0;
                }


                const originalMessage =
                    messages[currentIndex];


                if (!originalMessage) {
                    continue;
                }


                const liveMessage = {

                    ...originalMessage,

                    time:
                        formatCurrentTime(),

                    liveId:
                        `${originalMessage.id || currentIndex}-${Date.now()}-${i}-${Math.random()}`,

                };


                burstMessages.push(
                    liveMessage
                );


                currentIndex += 1;

            }


            if (burstMessages.length > 0) {

                setVisibleMessages(
                    (previousMessages) => [

                        ...previousMessages,

                        ...burstMessages,

                    ]
                );

            }


            /*
             * Keep scheduling new activity forever.
             */
            timeoutRef.current =
                setTimeout(
                    releaseBurst,
                    getRandomDelay()
                );

        };


        /*
         * Small initial delay so the chat does not
         * instantly dump comments on page load.
         */
        timeoutRef.current =
            setTimeout(
                releaseBurst,
                1800
            );


        return () => {

            cancelled = true;


            if (timeoutRef.current) {

                clearTimeout(
                    timeoutRef.current
                );

            }

        };

    }, [messages]);


    /*
     * Always follow the newest message.
     *
     * Older messages naturally move above the
     * visible area and remain available by scrolling.
     */
    useEffect(() => {

        const container =
            messagesContainerRef.current;


        if (!container) {
            return;
        }


        requestAnimationFrame(() => {

            container.scrollTop =
                container.scrollHeight;

        });

    }, [visibleMessages]);


    /*
     * Viewer sends their own message.
     */
    const handleSubmit = (event) => {

        event.preventDefault();


        const trimmedMessage =
            message.trim();


        if (!trimmedMessage) {
            return;
        }


        const timestamp =
            Date.now();


        const userMessage = {

            id:
                `viewer-${timestamp}`,

            liveId:
                `viewer-${timestamp}`,

            name:
                "You",

            message:
                trimmedMessage,

            time:
                formatCurrentTime(),

        };


        setVisibleMessages(
            (previousMessages) => [

                ...previousMessages,

                userMessage,

            ]
        );


        setMessage("");

    };


    return (

        <div className="webinar-chat">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="webinar-chat-header">

                <div className="webinar-chat-header-left">

                    <div className="webinar-chat-icon">
                        <FaComments />
                    </div>


                    <div>

                        <h2 className="webinar-chat-title">
                            Live Chat
                        </h2>


                        <div className="webinar-chat-status">

                            <span className="webinar-chat-status-dot" />

                            <span>
                                Join the conversation
                            </span>

                        </div>

                    </div>

                </div>


                <div className="webinar-chat-live-badge">

                    <span className="webinar-chat-live-badge-dot" />

                    LIVE

                </div>

            </div>


            {/* =================================================
                MESSAGES
            ================================================= */}

            <div
                className="webinar-chat-messages"
                ref={messagesContainerRef}
            >

                {visibleMessages.length > 0 ? (

                    visibleMessages.map(
                        (chatMessage) => (

                            <div
                                className={`webinar-chat-message ${
                                    chatMessage.name === "You"
                                        ? "webinar-chat-message-own"
                                        : ""
                                }`}
                                key={
                                    chatMessage.liveId ||
                                    chatMessage.id
                                }
                            >

                                <div className="webinar-chat-message-top">

                                    <span className="webinar-chat-message-name">
                                        {chatMessage.name}
                                    </span>


                                    <span className="webinar-chat-message-time">
                                        {chatMessage.time}
                                    </span>

                                </div>


                                <p className="webinar-chat-message-text">
                                    {chatMessage.message}
                                </p>

                            </div>

                        )
                    )

                ) : (

                    <div className="webinar-chat-empty">

                        <div className="webinar-chat-empty-icon">
                            <FaComments />
                        </div>


                        <p>
                            Live conversation is starting...
                        </p>


                        <span>
                            Questions and comments will appear here.
                        </span>

                    </div>

                )}

            </div>


            {/* =================================================
                INPUT
            ================================================= */}

            <div className="webinar-chat-footer">

                <form
                    className="webinar-chat-form"
                    onSubmit={handleSubmit}
                >

                    <input
                        type="text"
                        value={message}
                        onChange={(event) =>
                            setMessage(
                                event.target.value
                            )
                        }
                        placeholder="Ask a question..."
                        className="webinar-chat-input"
                        aria-label="Chat message"
                    />


                    <button
                        type="submit"
                        className="webinar-chat-send"
                        aria-label="Send message"
                        disabled={!message.trim()}
                    >

                        <FaPaperPlane />

                    </button>

                </form>


                <p className="webinar-chat-notice">
                    Questions and comments may be moderated.
                </p>

            </div>

        </div>

    );

}


export default WebinarChat;