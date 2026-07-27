import "./FlightPath.css"

const FlightPath = () => {
    return (

        <svg
            className="flight-svg"
            viewBox="0 0 560 560"
        >

            <path
                id="heroFlight"

                d="
                M170 355
                C185 200,
                375 200,
                390 355
                "

                className="flight-path"
            />

        </svg>

    );
};

export default FlightPath;