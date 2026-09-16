import {
    FaCircle,
    FaPlay,
    FaPause,
    FaVolumeUp,
    FaVolumeMute,
    FaExpand,
    FaCompress,
    FaComments,
    FaPaperPlane,
    FaArrowLeft,
    FaTimes,
} from "react-icons/fa";

import {
    useEffect,
    useRef,
    useState,
} from "react";

import "./WebinarPlayer.css";


function WebinarPlayer({ webinar }) {

    const playerContainerRef = useRef(null);
    const playerRef = useRef(null);

    const controlsTimeoutRef = useRef(null);
    const intervalRef = useRef(null);

    const viewerIntervalRef = useRef(null);
    const viewerNotificationTimeoutRef = useRef(null);

    const chatTimeoutRef = useRef(null);
    const chatMessagesRef = useRef(null);
    const chatInactivityTimeoutRef = useRef(null);

    const mobileChatPromptTimeoutRef = useRef(null);
    const mobileChatPromptHideTimeoutRef = useRef(null);
    const mobileChatReminderTimeoutRef = useRef(null);


    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(100);

    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [showControls, setShowControls] = useState(true);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const [showSoundPrompt, setShowSoundPrompt] = useState(false);

    const [viewerCount, setViewerCount] = useState(400);

    const [recentJoinCount, setRecentJoinCount] = useState(null);

    const [showJoinNotification, setShowJoinNotification] =
        useState(false);

    const [initialViewerRushComplete, setInitialViewerRushComplete] =
        useState(false);


    /* =========================================================
       LIVE CHAT
    ========================================================= */

    const [chatMessage, setChatMessage] = useState("");

    const [visibleMessages, setVisibleMessages] = useState([]);

    /*
     * Chat starts CLOSED.
     */
    const [isChatOpen, setIsChatOpen] = useState(false);

    const [isMobile, setIsMobile] = useState(false);


    /*
     * Mobile chat reminder.
     */
    const [showMobileChatPrompt, setShowMobileChatPrompt] =
        useState(false);

    const [mobileChatPromptDismissed, setMobileChatPromptDismissed] =
        useState(false);


    const DEFAULT_VIDEO_ID = "bRYAkufQlB8";


    /* =========================================================
       GET YOUTUBE VIDEO ID
    ========================================================= */

    const getYouTubeVideoId = (url) => {

        if (
            typeof url !== "string" ||
            !url.trim()
        ) {
            return DEFAULT_VIDEO_ID;
        }

        const cleanUrl = url.trim();

        if (
            /^[a-zA-Z0-9_-]{11}$/.test(cleanUrl)
        ) {
            return cleanUrl;
        }

        if (
            cleanUrl.includes("youtu.be/")
        ) {

            const videoId =
                cleanUrl
                    .split("youtu.be/")[1]
                    ?.split(/[?&#/]/)[0];

            if (
                videoId &&
                /^[a-zA-Z0-9_-]{11}$/.test(videoId)
            ) {
                return videoId;
            }
        }

        if (
            cleanUrl.includes("youtube.com/watch")
        ) {

            try {

                const parsedUrl =
                    new URL(cleanUrl);

                const videoId =
                    parsedUrl.searchParams.get("v");

                if (
                    videoId &&
                    /^[a-zA-Z0-9_-]{11}$/.test(videoId)
                ) {
                    return videoId;
                }

            } catch {

                return DEFAULT_VIDEO_ID;
            }
        }

        if (
            cleanUrl.includes("youtube.com/embed/")
        ) {

            const videoId =
                cleanUrl
                    .split("youtube.com/embed/")[1]
                    ?.split(/[?&#/]/)[0];

            if (
                videoId &&
                /^[a-zA-Z0-9_-]{11}$/.test(videoId)
            ) {
                return videoId;
            }
        }

        return DEFAULT_VIDEO_ID;
    };


    const videoId =
        getYouTubeVideoId(
            webinar?.videoUrl ||
            "https://youtu.be/bRYAkufQlB8"
        );


    /* =========================================================
       FORMAT VIDEO TIME
    ========================================================= */

    const formatTime = (seconds) => {

        if (
            !Number.isFinite(seconds) ||
            seconds < 0
        ) {
            return "0:00";
        }

        const totalSeconds =
            Math.floor(seconds);

        const minutes =
            Math.floor(
                totalSeconds / 60
            );

        const remainingSeconds =
            totalSeconds % 60;

        return `${minutes}:${String(
            remainingSeconds
        ).padStart(2, "0")}`;
    };


    /* =========================================================
       CURRENT CHAT TIME
    ========================================================= */

    const formatCurrentTime = () => {

        return new Intl.DateTimeFormat(
            undefined,
            {
                hour: "numeric",
                minute: "2-digit",
            }
        ).format(
            new Date()
        );
    };


    /* =========================================================
       MOBILE DETECTION
    ========================================================= */

    useEffect(() => {

        if (
            typeof window === "undefined"
        ) {
            return undefined;
        }

        const mediaQuery =
            window.matchMedia(
                "(max-width: 650px)"
            );

        const updateMobileState = () => {

            setIsMobile(
                mediaQuery.matches
            );
        };

        updateMobileState();

        mediaQuery.addEventListener(
            "change",
            updateMobileState
        );

        return () => {

            mediaQuery.removeEventListener(
                "change",
                updateMobileState
            );
        };

    }, []);


    /* =========================================================
       CHECK MOBILE REMINDER PREFERENCE
    ========================================================= */

    useEffect(() => {

        if (
            !isMobile ||
            typeof window === "undefined"
        ) {
            return;
        }

        try {

            const dismissed =
                window.localStorage.getItem(
                    "colossus_webinar_mobile_chat_prompt_dismissed"
                );

            if (
                dismissed === "true"
            ) {

                setMobileChatPromptDismissed(
                    true
                );

                setShowMobileChatPrompt(
                    false
                );

            } else {

                setMobileChatPromptDismissed(
                    false
                );
            }

        } catch {

            setMobileChatPromptDismissed(
                false
            );
        }

    }, [isMobile]);


    /* =========================================================
       MOBILE LIVE CHAT REMINDER
    ========================================================= */

    useEffect(() => {

        if (!isMobile) {
            return undefined;
        }

        if (mobileChatPromptDismissed) {

            setShowMobileChatPrompt(
                false
            );

            return undefined;
        }

        if (isChatOpen) {

            setShowMobileChatPrompt(
                false
            );

            return undefined;
        }

        if (
            mobileChatPromptTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatPromptTimeoutRef.current
            );
        }

        if (
            mobileChatPromptHideTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatPromptHideTimeoutRef.current
            );
        }

        if (
            mobileChatReminderTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatReminderTimeoutRef.current
            );
        }

        const firstDelay =
            Math.floor(
                Math.random() * 5000
            ) + 9000;

        mobileChatPromptTimeoutRef.current =
            setTimeout(() => {

                setShowMobileChatPrompt(
                    true
                );

                mobileChatPromptHideTimeoutRef.current =
                    setTimeout(() => {

                        setShowMobileChatPrompt(
                            false
                        );

                    }, 7000);

                mobileChatReminderTimeoutRef.current =
                    setTimeout(() => {

                        if (
                            mobileChatPromptDismissed ||
                            isChatOpen
                        ) {
                            return;
                        }

                        setShowMobileChatPrompt(
                            true
                        );

                        mobileChatPromptHideTimeoutRef.current =
                            setTimeout(() => {

                                setShowMobileChatPrompt(
                                    false
                                );

                            }, 7000);

                    }, 32000);

            }, firstDelay);

        return () => {

            if (
                mobileChatPromptTimeoutRef.current
            ) {

                clearTimeout(
                    mobileChatPromptTimeoutRef.current
                );
            }

            if (
                mobileChatPromptHideTimeoutRef.current
            ) {

                clearTimeout(
                    mobileChatPromptHideTimeoutRef.current
                );
            }

            if (
                mobileChatReminderTimeoutRef.current
            ) {

                clearTimeout(
                    mobileChatReminderTimeoutRef.current
                );
            }
        };

    }, [
        isMobile,
        mobileChatPromptDismissed,
        isChatOpen
    ]);


    /* =========================================================
       CHAT AUTO-CLOSE TIMER
    ========================================================= */

    const clearChatInactivityTimer = () => {

        if (
            chatInactivityTimeoutRef.current
        ) {

            clearTimeout(
                chatInactivityTimeoutRef.current
            );

            chatInactivityTimeoutRef.current =
                null;
        }
    };


    const scheduleChatAutoClose = () => {

        clearChatInactivityTimer();

        chatInactivityTimeoutRef.current =
            setTimeout(() => {

                setIsChatOpen(
                    false
                );

                setShowMobileChatPrompt(
                    false
                );

                chatInactivityTimeoutRef.current =
                    null;

            }, 13000);
    };


    const handleChatInteraction = () => {

        if (!isChatOpen) {
            return;
        }

        scheduleChatAutoClose();
    };


    /* =========================================================
       OPEN CHAT
    ========================================================= */

    const openMobileChat = () => {

        setIsChatOpen(
            true
        );

        setShowMobileChatPrompt(
            false
        );

        if (
            mobileChatPromptHideTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatPromptHideTimeoutRef.current
            );
        }

        if (
            mobileChatReminderTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatReminderTimeoutRef.current
            );
        }

        scheduleChatAutoClose();
    };


    /* =========================================================
       CLOSE CHAT
    ========================================================= */

    const closeMobileChat = () => {

        setIsChatOpen(
            false
        );

        setShowMobileChatPrompt(
            false
        );

        clearChatInactivityTimer();
    };


    /* =========================================================
       DON'T SHOW REMINDER AGAIN
    ========================================================= */

    const dismissMobileChatPrompt = () => {

        setMobileChatPromptDismissed(
            true
        );

        setShowMobileChatPrompt(
            false
        );

        try {

            window.localStorage.setItem(
                "colossus_webinar_mobile_chat_prompt_dismissed",
                "true"
            );

        } catch {
            /* Ignore storage errors. */
        }

        if (
            mobileChatPromptTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatPromptTimeoutRef.current
            );
        }

        if (
            mobileChatPromptHideTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatPromptHideTimeoutRef.current
            );
        }

        if (
            mobileChatReminderTimeoutRef.current
        ) {

            clearTimeout(
                mobileChatReminderTimeoutRef.current
            );
        }
    };


    /* =========================================================
       VIEWER JOIN NOTIFICATION
    ========================================================= */

    const showViewerJoinNotification = (
        numberOfPeople
    ) => {

        if (
            !Number.isFinite(
                numberOfPeople
            ) ||
            numberOfPeople <= 0
        ) {
            return;
        }

        setRecentJoinCount(
            numberOfPeople
        );

        setShowJoinNotification(
            true
        );

        if (
            viewerNotificationTimeoutRef.current
        ) {

            clearTimeout(
                viewerNotificationTimeoutRef.current
            );
        }

        viewerNotificationTimeoutRef.current =
            setTimeout(() => {

                setShowJoinNotification(
                    false
                );

            }, 4200);
    };


    /* =========================================================
       INITIAL VIEWER RUSH
    ========================================================= */

    useEffect(() => {

        let currentCount = 400;

        let rushTimer = null;

        const runViewerRush = () => {

            const remaining =
                500 - currentCount;

            if (
                remaining <= 0
            ) {

                setViewerCount(
                    500
                );

                setInitialViewerRushComplete(
                    true
                );

                return;
            }

            let increment;

            const groupChance =
                Math.random();

            if (
                groupChance > 0.94 &&
                remaining >= 8
            ) {

                increment =
                    Math.floor(
                        Math.random() * 5
                    ) + 8;

            } else if (
                groupChance > 0.72
            ) {

                increment =
                    Math.floor(
                        Math.random() * 4
                    ) + 4;

            } else {

                increment =
                    Math.floor(
                        Math.random() * 3
                    ) + 1;
            }

            increment =
                Math.min(
                    increment,
                    remaining
                );

            currentCount +=
                increment;

            setViewerCount(
                currentCount
            );

            if (
                Math.random() > 0.25
            ) {

                showViewerJoinNotification(
                    increment
                );
            }

            const nextDelay =
                Math.floor(
                    Math.random() * 1600
                ) + 1200;

            rushTimer =
                setTimeout(
                    runViewerRush,
                    nextDelay
                );
        };

        rushTimer =
            setTimeout(
                runViewerRush,
                1800
            );

        return () => {

            if (rushTimer) {

                clearTimeout(
                    rushTimer
                );
            }
        };

    }, []);


    /* =========================================================
       CONTINUOUS VIEWER GROWTH
    ========================================================= */

    useEffect(() => {

        if (
            !initialViewerRushComplete
        ) {
            return;
        }

        const scheduleNextViewerUpdate =
            () => {

                const delay =
                    Math.floor(
                        Math.random() * 6500
                    ) + 3500;

                viewerIntervalRef.current =
                    setTimeout(() => {

                        let increment;

                        const groupChance =
                            Math.random();

                        if (
                            groupChance > 0.93
                        ) {

                            increment =
                                Math.floor(
                                    Math.random() * 16
                                ) + 10;

                        } else if (
                            groupChance > 0.72
                        ) {

                            increment =
                                Math.floor(
                                    Math.random() * 6
                                ) + 5;

                        } else {

                            increment =
                                Math.floor(
                                    Math.random() * 4
                                ) + 1;
                        }

                        setViewerCount(
                            (previousCount) =>
                                previousCount +
                                increment
                        );

                        showViewerJoinNotification(
                            increment
                        );

                        scheduleNextViewerUpdate();

                    }, delay);
            };

        scheduleNextViewerUpdate();

        return () => {

            if (
                viewerIntervalRef.current
            ) {

                clearTimeout(
                    viewerIntervalRef.current
                );
            }
        };

    }, [
        initialViewerRushComplete
    ]);


    /* =========================================================
       MOCK LIVE CHAT
    ========================================================= */

    const messages =
        webinar?.chat || [];

    const getRandomChatDelay = () => {

        return (
            Math.floor(
                Math.random() * 1400
            ) + 1800
        );
    };

    const getChatBurstSize = () => {

        const random =
            Math.random();

        if (
            random < 0.18
        ) {
            return 3;
        }

        if (
            random < 0.55
        ) {
            return 2;
        }

        return 1;
    };

    useEffect(() => {

        setVisibleMessages([]);

        if (
            !messages.length
        ) {
            return undefined;
        }

        let currentIndex = 0;

        let cancelled = false;

        const releaseChatBurst = () => {

            if (cancelled) {
                return;
            }

            const burstSize =
                getChatBurstSize();

            const burstMessages = [];

            for (
                let i = 0;
                i < burstSize;
                i += 1
            ) {

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

            if (
                burstMessages.length
            ) {

                setVisibleMessages(
                    (previousMessages) => {

                        const nextMessages = [
                            ...previousMessages,
                            ...burstMessages,
                        ];

                        return nextMessages.slice(
                            -16
                        );
                    }
                );
            }

            chatTimeoutRef.current =
                setTimeout(
                    releaseChatBurst,
                    getRandomChatDelay()
                );
        };

        chatTimeoutRef.current =
            setTimeout(
                releaseChatBurst,
                1800
            );

        return () => {

            cancelled = true;

            if (
                chatTimeoutRef.current
            ) {

                clearTimeout(
                    chatTimeoutRef.current
                );
            }
        };

    }, [webinar]);


    /* =========================================================
       KEEP CHAT AT LATEST MESSAGE
    ========================================================= */

    useEffect(() => {

        const container =
            chatMessagesRef.current;

        if (
            !container ||
            !isChatOpen
        ) {
            return;
        }

        requestAnimationFrame(() => {

            container.scrollTop =
                container.scrollHeight;

        });

    }, [
        visibleMessages,
        isChatOpen
    ]);


    /* =========================================================
       SEND COMMENT
    ========================================================= */

    const handleChatSubmit = (
        event
    ) => {

        event.preventDefault();

        const trimmedMessage =
            chatMessage.trim();

        if (
            !trimmedMessage
        ) {
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

                ...previousMessages.slice(-15),

                userMessage,
            ]
        );

        setChatMessage("");

        setIsChatOpen(
            true
        );

        setShowMobileChatPrompt(
            false
        );

        scheduleChatAutoClose();
    };


    /* =========================================================
       YOUTUBE PLAYER
    ========================================================= */

    useEffect(() => {

        let cancelled = false;

        const createPlayer = () => {

            if (
                cancelled ||
                !window.YT ||
                !window.YT.Player
            ) {
                return;
            }

            if (
                playerRef.current
            ) {
                return;
            }

            playerRef.current =
                new window.YT.Player(
                    "webinar-youtube-player",
                    {

                        videoId,

                        playerVars: {

                            autoplay: 1,

                            controls: 0,

                            disablekb: 1,

                            playsinline: 1,

                            fs: 0,

                            rel: 0,

                            iv_load_policy: 3,

                            enablejsapi: 1,

                            origin:
                                window.location.origin,
                        },

                        events: {

                            onReady: (event) => {

                                if (
                                    cancelled
                                ) {
                                    return;
                                }

                                setIsReady(
                                    true
                                );

                                const videoDuration =
                                    event.target.getDuration();

                                setDuration(
                                    videoDuration || 0
                                );

                                event.target.setVolume(
                                    volume || 100
                                );

                                try {

                                    event.target.unMute();

                                    event.target.setVolume(
                                        volume || 100
                                    );

                                    setIsMuted(
                                        false
                                    );

                                    event.target.playVideo();

                                } catch {

                                    try {

                                        event.target.mute();

                                        event.target.setVolume(
                                            volume || 100
                                        );

                                        event.target.playVideo();

                                        setIsMuted(
                                            true
                                        );

                                        setShowSoundPrompt(
                                            true
                                        );

                                    } catch {
                                        /* Browser blocked playback. */
                                    }
                                }
                            },

                            onAutoplayBlocked: () => {

                                if (
                                    cancelled ||
                                    !playerRef.current
                                ) {
                                    return;
                                }

                                try {

                                    playerRef.current.mute();

                                    playerRef.current.setVolume(
                                        volume || 100
                                    );

                                    setIsMuted(
                                        true
                                    );

                                    setShowSoundPrompt(
                                        true
                                    );

                                    playerRef.current.playVideo();

                                } catch {
                                    /* Browser blocked playback. */
                                }
                            },

                            onStateChange: (
                                event
                            ) => {

                                if (
                                    cancelled
                                ) {
                                    return;
                                }

                                if (
                                    event.data ===
                                    window.YT.PlayerState.PLAYING
                                ) {

                                    setIsPlaying(
                                        true
                                    );

                                    if (
                                        playerRef.current &&
                                        typeof playerRef.current.isMuted ===
                                            "function"
                                    ) {

                                        const playerIsMuted =
                                            playerRef.current.isMuted();

                                        if (
                                            playerIsMuted
                                        ) {

                                            setIsMuted(
                                                true
                                            );

                                            setShowSoundPrompt(
                                                true
                                            );

                                        } else {

                                            setIsMuted(
                                                false
                                            );

                                            setShowSoundPrompt(
                                                false
                                            );
                                        }
                                    }

                                    setShowControls(
                                        true
                                    );

                                    if (
                                        controlsTimeoutRef.current
                                    ) {

                                        clearTimeout(
                                            controlsTimeoutRef.current
                                        );
                                    }

                                    controlsTimeoutRef.current =
                                        setTimeout(() => {

                                            setShowControls(
                                                false
                                            );

                                        }, 3000);

                                } else {

                                    setIsPlaying(
                                        false
                                    );
                                }

                                if (
                                    event.data ===
                                    window.YT.PlayerState.ENDED
                                ) {

                                    setIsPlaying(
                                        false
                                    );
                                }
                            },
                        },
                    }
                );
        };


        /* =====================================================
           LOAD YOUTUBE IFRAME API
        ===================================================== */

        if (
            window.YT &&
            window.YT.Player
        ) {

            createPlayer();

        } else {

            const existingScript =
                document.querySelector(
                    'script[src="https://www.youtube.com/iframe_api"]'
                );

            if (
                !existingScript
            ) {

                const script =
                    document.createElement(
                        "script"
                    );

                script.src =
                    "https://www.youtube.com/iframe_api";

                script.async = true;

                document.body.appendChild(
                    script
                );
            }

            const previousCallback =
                window.onYouTubeIframeAPIReady;

            window.onYouTubeIframeAPIReady =
                () => {

                    if (
                        previousCallback
                    ) {

                        previousCallback();
                    }

                    createPlayer();
                };
        }


        return () => {

            cancelled = true;

            if (
                intervalRef.current
            ) {

                clearInterval(
                    intervalRef.current
                );
            }

            if (
                controlsTimeoutRef.current
            ) {

                clearTimeout(
                    controlsTimeoutRef.current
                );
            }

            if (
                playerRef.current
            ) {

                try {

                    playerRef.current.destroy();

                } catch {
                    /* Ignore cleanup errors. */
                }

                playerRef.current =
                    null;
            }
        };

    }, [videoId]);


    /* =========================================================
       VIDEO TIME TRACKING
    ========================================================= */

    useEffect(() => {

        if (
            !isPlaying
        ) {

            if (
                intervalRef.current
            ) {

                clearInterval(
                    intervalRef.current
                );

                intervalRef.current =
                    null;
            }

            return;
        }

        intervalRef.current =
            setInterval(() => {

                if (
                    !playerRef.current ||
                    !playerRef.current.getCurrentTime
                ) {
                    return;
                }

                const current =
                    playerRef.current
                        .getCurrentTime();

                const total =
                    playerRef.current
                        .getDuration();

                setCurrentTime(
                    current || 0
                );

                setDuration(
                    total || 0
                );

            }, 250);

        return () => {

            if (
                intervalRef.current
            ) {

                clearInterval(
                    intervalRef.current
                );

                intervalRef.current =
                    null;
            }
        };

    }, [
        isPlaying
    ]);


    /* =========================================================
       ENABLE SOUND
    ========================================================= */

    const enableSound = () => {

        if (
            !playerRef.current ||
            !isReady
        ) {
            return;
        }

        try {

            playerRef.current.unMute();

            playerRef.current.setVolume(
                volume || 100
            );

            setIsMuted(
                false
            );

            setShowSoundPrompt(
                false
            );

            if (
                typeof playerRef.current.playVideo ===
                "function"
            ) {

                playerRef.current.playVideo();
            }

        } catch {
            /* Ignore browser playback errors. */
        }

        showPlayerControls();
    };


    /* =========================================================
       PLAY / PAUSE
    ========================================================= */

    const togglePlay = () => {

        if (
            !playerRef.current ||
            !isReady
        ) {
            return;
        }

        if (
            isPlaying
        ) {

            playerRef.current.pauseVideo();

        } else {

            playerRef.current.playVideo();
        }

        showPlayerControls();
    };


    /* =========================================================
       MUTE
    ========================================================= */

    const toggleMute = () => {

        if (
            !playerRef.current ||
            !isReady
        ) {
            return;
        }

        if (
            isMuted
        ) {

            enableSound();

        } else {

            playerRef.current.mute();

            setIsMuted(
                true
            );
        }

        showPlayerControls();
    };


    /* =========================================================
       VOLUME
    ========================================================= */

    const handleVolumeChange = (
        event
    ) => {

        const newVolume =
            Number(
                event.target.value
            );

        if (
            !playerRef.current ||
            !isReady
        ) {
            return;
        }

        playerRef.current.setVolume(
            newVolume
        );

        if (
            newVolume === 0
        ) {

            playerRef.current.mute();

            setIsMuted(
                true
            );

        } else {

            playerRef.current.unMute();

            setIsMuted(
                false
            );

            setShowSoundPrompt(
                false
            );
        }

        setVolume(
            newVolume
        );

        showPlayerControls();
    };


    /* =========================================================
       FULLSCREEN
    ========================================================= */

    const toggleFullscreen = async () => {

        const container =
            playerContainerRef.current;

        if (
            !container
        ) {
            return;
        }

        try {

            if (
                !document.fullscreenElement
            ) {

                await container.requestFullscreen();

                setIsFullscreen(
                    true
                );

            } else {

                await document.exitFullscreen();

                setIsFullscreen(
                    false
                );
            }

        } catch {
            /* Browser may block fullscreen. */
        }
    };


    /* =========================================================
       FULLSCREEN STATE
    ========================================================= */

    useEffect(() => {

        const handleFullscreenChange =
            () => {

                setIsFullscreen(
                    Boolean(
                        document.fullscreenElement
                    )
                );
            };

        document.addEventListener(
            "fullscreenchange",
            handleFullscreenChange
        );

        return () => {

            document.removeEventListener(
                "fullscreenchange",
                handleFullscreenChange
            );
        };

    }, []);


    /* =========================================================
       PLAYER CONTROLS
    ========================================================= */

    const showPlayerControls = () => {

        setShowControls(
            true
        );

        if (
            controlsTimeoutRef.current
        ) {

            clearTimeout(
                controlsTimeoutRef.current
            );
        }

        if (
            isPlaying
        ) {

            controlsTimeoutRef.current =
                setTimeout(() => {

                    setShowControls(
                        false
                    );

                }, 3000);
        }
    };


    const handlePlayerInteraction = () => {

        showPlayerControls();
    };


    /* =========================================================
       BLOCK CONTEXT MENU
    ========================================================= */

    const handleContextMenu = (
        event
    ) => {

        event.preventDefault();
    };


    /* =========================================================
       CLEANUP
    ========================================================= */

    useEffect(() => {

        return () => {

            if (
                viewerNotificationTimeoutRef.current
            ) {

                clearTimeout(
                    viewerNotificationTimeoutRef.current
                );
            }

            if (
                viewerIntervalRef.current
            ) {

                clearTimeout(
                    viewerIntervalRef.current
                );
            }

            if (
                chatTimeoutRef.current
            ) {

                clearTimeout(
                    chatTimeoutRef.current
                );
            }

            if (
                chatInactivityTimeoutRef.current
            ) {

                clearTimeout(
                    chatInactivityTimeoutRef.current
                );
            }

            if (
                mobileChatPromptTimeoutRef.current
            ) {

                clearTimeout(
                    mobileChatPromptTimeoutRef.current
                );
            }

            if (
                mobileChatPromptHideTimeoutRef.current
            ) {

                clearTimeout(
                    mobileChatPromptHideTimeoutRef.current
                );
            }

            if (
                mobileChatReminderTimeoutRef.current
            ) {

                clearTimeout(
                    mobileChatReminderTimeoutRef.current
                );
            }

            if (
                controlsTimeoutRef.current
            ) {

                clearTimeout(
                    controlsTimeoutRef.current
                );
            }

        };

    }, []);


    return (

        <div
            className={`
                webinar-player
                ${
                    showControls
                        ? "webinar-player-controls-visible"
                        : "webinar-player-controls-hidden"
                }
                ${
                    isFullscreen
                        ? "webinar-player-fullscreen"
                        : ""
                }
            `}
            ref={
                playerContainerRef
            }
            onMouseMove={
                handlePlayerInteraction
            }
            onMouseEnter={
                handlePlayerInteraction
            }
            onContextMenu={
                handleContextMenu
            }
        >

            {/* =================================================
                LIVE HEADER
            ================================================= */}

            <div className="webinar-player-topbar">

                <div className="webinar-player-topbar-left">

                    <div className="webinar-player-live-status">

                        <span className="webinar-player-live-dot">
                            <FaCircle />
                        </span>

                        <span>
                            BROADCASTING LIVE
                        </span>

                    </div>

                    <span className="webinar-player-topbar-divider">
                        •
                    </span>

                    <div className="webinar-player-viewer-count">

                        <span className="webinar-player-viewer-icon">
                            <FaCircle />
                        </span>

                        <strong>
                            {viewerCount}
                        </strong>

                        <span>
                            watching
                        </span>

                    </div>

                </div>

                <div className="webinar-player-topbar-brand">

                    <span>
                        COLOSSUS MIGRATION & TOURS
                    </span>

                </div>

            </div>


            {/* =================================================
                VIDEO
            ================================================= */}

            <div
                className="webinar-player-screen"
                onContextMenu={
                    handleContextMenu
                }
            >

                <div className="webinar-player-video-layer">

                    <div
                        id="webinar-youtube-player"
                        className="webinar-player-iframe"
                    />

                    {/*
                     * First 64px of video remains
                     * protected from interaction.
                     */}

                    <div
                        className="webinar-player-youtube-shield"
                        aria-hidden="true"
                    />

                </div>


                {!isReady && (

                    <div className="webinar-player-loading">

                        <div className="webinar-player-loading-spinner" />

                        <span>
                            Connecting to live webinar...
                        </span>

                    </div>

                )}


                {isReady &&
                    isPlaying &&
                    showSoundPrompt &&
                    isMuted && (

                    <button
                        type="button"
                        className="webinar-player-sound-prompt"
                        onClick={
                            enableSound
                        }
                        aria-label="Enable webinar sound"
                    >

                        <span className="webinar-player-sound-prompt-icon">
                            <FaVolumeUp />
                        </span>

                        <span className="webinar-player-sound-prompt-copy">

                            <strong>
                                Sound is off
                            </strong>

                            <small>
                                Tap to enable live audio
                            </small>

                        </span>

                        <span className="webinar-player-sound-prompt-arrow">
                            <FaVolumeUp />
                        </span>

                    </button>

                )}


                {showJoinNotification &&
                    recentJoinCount && (

                    <div
                        className="
                            webinar-player-join-notification
                            webinar-player-join-notification-visible
                        "
                    >

                        <span className="webinar-player-join-notification-dot">
                            <FaCircle />
                        </span>

                        <span className="webinar-player-join-notification-copy">

                            <strong>
                                +{recentJoinCount}
                            </strong>

                            <span>
                                {
                                    recentJoinCount === 1
                                        ? "person joined"
                                        : "people joined"
                                }
                            </span>

                        </span>

                    </div>

                )}


                {isMobile &&
                    !isChatOpen &&
                    showMobileChatPrompt &&
                    !mobileChatPromptDismissed && (

                    <div
                        className="
                            webinar-player-mobile-chat-prompt
                        "
                    >

                        <div className="webinar-player-mobile-chat-prompt-icon">
                            <FaComments />
                        </div>

                        <div className="webinar-player-mobile-chat-prompt-copy">

                            <strong>
                                Join the live chat
                            </strong>

                            <span>
                                See what other viewers are saying.
                            </span>

                        </div>

                        <button
                            type="button"
                            className="webinar-player-mobile-chat-prompt-join"
                            onClick={
                                openMobileChat
                            }
                        >
                            Join
                        </button>

                        <button
                            type="button"
                            className="webinar-player-mobile-chat-prompt-close"
                            onClick={() =>
                                setShowMobileChatPrompt(
                                    false
                                )
                            }
                            aria-label="Close chat reminder"
                        >
                            <FaTimes />
                        </button>

                        <button
                            type="button"
                            className="webinar-player-mobile-chat-prompt-dismiss"
                            onClick={
                                dismissMobileChatPrompt
                            }
                        >
                            Don't show this again
                        </button>

                    </div>

                )}


                {/* =================================================
                    LIVE CHAT DRAWER
                    -----------------------------------------------
                    Desktop:
                    Left sidebar.

                    Fullscreen:
                    Bottom drawer.

                    Mobile:
                    Left sidebar.

                    The floating open button is separate and
                    stays on the RIGHT.
                ================================================= */}

                {isChatOpen && (

                    <aside
                        className={`
                            webinar-player-live-chat
                            webinar-player-live-chat-open
                            ${
                                isFullscreen
                                    ? "webinar-player-live-chat-fullscreen"
                                    : ""
                            }
                            ${
                                isMobile
                                    ? "webinar-player-live-chat-mobile"
                                    : ""
                            }
                        `}
                        aria-label="Live chat"
                        onMouseMove={
                            handleChatInteraction
                        }
                        onMouseEnter={
                            handleChatInteraction
                        }
                        onTouchStart={
                            handleChatInteraction
                        }
                        onClick={
                            handleChatInteraction
                        }
                    >

                        <div className="webinar-player-live-chat-header">

                            <div className="webinar-player-live-chat-heading">

                                <span className="webinar-player-live-chat-header-icon">
                                    <FaComments />
                                </span>

                                <span className="webinar-player-live-chat-title">
                                    Live chat
                                </span>

                                <span className="webinar-player-live-chat-live-dot" />

                            </div>

                            <button
                                type="button"
                                className="webinar-player-live-chat-toggle"
                                onClick={
                                    closeMobileChat
                                }
                                aria-label="Close live chat"
                            >

                                <span className="webinar-player-live-chat-toggle-icon">
                                    <FaArrowLeft />
                                </span>

                            </button>

                        </div>


                        <div
                            className="webinar-player-live-chat-messages"
                            ref={
                                chatMessagesRef
                            }
                        >

                            {visibleMessages.length > 0 ? (

                                visibleMessages.map(
                                    (chat) => (

                                        <div
                                            className={`
                                                webinar-player-live-chat-message
                                                ${
                                                    chat.name === "You"
                                                        ? "webinar-player-live-chat-message-own"
                                                        : ""
                                                }
                                            `}
                                            key={
                                                chat.liveId ||
                                                chat.id
                                            }
                                        >

                                            <div className="webinar-player-live-chat-message-line">

                                                <strong>
                                                    {chat.name}
                                                </strong>

                                                <span>
                                                    {chat.message}
                                                </span>

                                            </div>

                                        </div>

                                    )
                                )

                            ) : (

                                <div className="webinar-player-live-chat-empty">

                                    <FaComments />

                                    <span>
                                        Live conversation is starting...
                                    </span>

                                </div>

                            )}

                        </div>


                        <form
                            className="webinar-player-live-chat-form"
                            onSubmit={
                                handleChatSubmit
                            }
                            onFocus={
                                handleChatInteraction
                            }
                            onClick={
                                handleChatInteraction
                            }
                        >

                            <input
                                type="text"
                                value={
                                    chatMessage
                                }
                                onChange={(
                                    event
                                ) => {

                                    setChatMessage(
                                        event.target.value
                                    );

                                    handleChatInteraction();
                                }}
                                onFocus={
                                    handleChatInteraction
                                }
                                placeholder="Add a comment..."
                                aria-label="Add a live comment"
                                className="webinar-player-live-chat-input"
                            />

                            <button
                                type="submit"
                                className="webinar-player-live-chat-send"
                                disabled={
                                    !chatMessage.trim()
                                }
                                aria-label="Send comment"
                            >

                                <FaPaperPlane />

                            </button>

                        </form>

                    </aside>

                )}


                {/* =================================================
                    CHAT OPEN BUTTON

                    NORMAL DESKTOP:
                    RIGHT SIDE

                    FULLSCREEN:
                    RIGHT SIDE

                    MOBILE:
                    RIGHT SIDE
                ================================================= */}

                {!isChatOpen &&
                    !showMobileChatPrompt && (

                    <button
                        type="button"
                        className={`
                            webinar-player-live-chat-mini
                            ${
                                isFullscreen
                                    ? "webinar-player-live-chat-mini-fullscreen"
                                    : ""
                            }
                            ${
                                isMobile
                                    ? "webinar-player-live-chat-mini-mobile"
                                    : ""
                            }
                        `}
                        onClick={
                            openMobileChat
                        }
                        aria-label="Open live chat"
                    >

                        <FaComments />

                        <span>
                            Live chat
                        </span>

                        <span className="webinar-player-live-chat-mini-dot" />

                    </button>

                )}


                {/* =================================================
                    VIDEO CONTROLS
                ================================================= */}

                <div
                    className="webinar-player-controls"
                    onMouseMove={
                        handlePlayerInteraction
                    }
                >

                    <div className="webinar-player-controls-row">

                        <div className="webinar-player-controls-left">

                            <button
                                type="button"
                                className="
                                    webinar-player-control-button
                                    webinar-player-play
                                "
                                onClick={
                                    togglePlay
                                }
                                disabled={
                                    !isReady
                                }
                                aria-label={
                                    isPlaying
                                        ? "Pause video"
                                        : "Play video"
                                }
                            >

                                {
                                    isPlaying
                                        ? <FaPause />
                                        : <FaPlay />
                                }

                            </button>


                            <div className="webinar-player-volume">

                                <button
                                    type="button"
                                    className="webinar-player-control-button"
                                    onClick={
                                        toggleMute
                                    }
                                    disabled={
                                        !isReady
                                    }
                                    aria-label={
                                        isMuted
                                            ? "Enable sound"
                                            : "Mute video"
                                    }
                                >

                                    {
                                        isMuted
                                            ? <FaVolumeMute />
                                            : <FaVolumeUp />
                                    }

                                </button>

                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={
                                        isMuted
                                            ? 0
                                            : volume
                                    }
                                    onChange={
                                        handleVolumeChange
                                    }
                                    className="webinar-player-volume-input"
                                    aria-label="Volume"
                                />

                            </div>


                            <span className="webinar-player-time">

                                {formatTime(
                                    currentTime
                                )}

                                <span>
                                    /
                                </span>

                                {formatTime(
                                    duration
                                )}

                            </span>

                        </div>


                        <div className="webinar-player-controls-right">

                            <button
                                type="button"
                                className="webinar-player-control-button"
                                onClick={
                                    toggleFullscreen
                                }
                                disabled={
                                    !isReady
                                }
                                aria-label={
                                    isFullscreen
                                        ? "Exit fullscreen"
                                        : "Enter fullscreen"
                                }
                            >

                                {
                                    isFullscreen
                                        ? <FaCompress />
                                        : <FaExpand />
                                }

                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}


export default WebinarPlayer;