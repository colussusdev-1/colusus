import "./FlightScene.css";

import FlightRoute from "./FlightRoute";
import FlightTrail from "./FlightTrail";
import Plane from "./Plane";
import Clouds from "./Clouds";

import useFlightScene from "./useFlightScene";

const FlightScene = ({ sectionRef, cardRefs }) => {

    const flight = useFlightScene({
        sectionRef,
        cardRefs,
    });

    if (!flight.route) return null;

    return (

        <div className="flight-scene">

            {/* FIX 1: lock coordinate system container */}
            <div className="flight-stage">

                {/* SVG Layer */}
                <svg
                    className="flight-scene-svg"
                    width="100%"
                    height={flight.svgHeight}
                    viewBox={`0 0 500 ${flight.svgHeight}`}
                    preserveAspectRatio="none"
                >

                    <FlightRoute
                        route={flight.route}
                        pathRef={flight.pathRef}
                    />

                    <FlightTrail
                        route={flight.route}
                        progress={flight.progress}
                    />

                </svg>

                {/* HTML Overlay (NOW PERFECTLY ALIGNED) */}
                <div className="flight-overlay">

                    <Plane
                        x={flight.x}
                        y={flight.y}
                        rotate={flight.rotate}
                    />

                    <Clouds progress={flight.progress} />

                </div>

            </div>

        </div>

    );
};

export default FlightScene;