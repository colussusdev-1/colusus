import "./SuccessStories.css";

const stories = [

    {
        name: "David O.",
        country: "Canada PR",
        outcome: "Express Entry Approval",
        text: "I had no idea where to start. They guided my profile, improved my eligibility, and I got invited within months.",
    },

    {
        name: "Aisha K.",
        country: "UK Work Visa",
        outcome: "Skilled Worker Visa",
        text: "The process was smooth and clear. My application was structured perfectly and approved without delays.",
    },

    {
        name: "Michael T.",
        country: "Germany",
        outcome: "Job Seeker Visa",
        text: "I was struggling alone before. Their support helped me secure interviews and relocation approval.",
    },

];

const SuccessStories = () => {

    return (

        <section className="ss">

            <div className="container">

                <div className="ss__header">

                    <span className="ss__tag">SUCCESS STORIES</span>

                    <h2>
                        Real People.
                        <span> Real Results.</span>
                    </h2>

                    <p>
                        These are clients who successfully completed their immigration journey with our guidance.
                    </p>

                </div>

                <div className="ss__grid">

                    {stories.map((story) => (

                        <div className="ss__card" key={story.name}>

                            <div className="ss__top">

                                <div className="ss__avatar">
                                    {story.name.split(" ")[0][0]}
                                </div>

                                <div>

                                    <h3>{story.name}</h3>

                                    <span>{story.country}</span>

                                </div>

                            </div>

                            <div className="ss__outcome">
                                {story.outcome}
                            </div>

                            <p className="ss__text">
                                “{story.text}”
                            </p>

                        </div>

                    ))}

                </div>

            </div>

        </section>

    );
};

export default SuccessStories;