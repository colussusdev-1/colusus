import "./OffshoreSuccessStories.css";

import successStories from "./offshoreSuccessData";

import SuccessCard from "../../../OverseasJobs/sections/SucessStories/SuccessCard/SuccessCard";

const OffshoreSuccessStories = () => {

    const featured = successStories.find(
        item => item.featured
    );

    const others = successStories.filter(
        item => !item.featured
    );

    return (

        <section className="offshore-success">

            <div className="success-container">

                <div className="success-header">

                    <span>

                        Client Success Stories

                    </span>

                    <h2>

                        Businesses That Expanded Globally

                    </h2>

                    <p>

                        Entrepreneurs and founders who
                        successfully established their
                        international companies with
                        our support.

                    </p>

                </div>

                <div className="success-layout">

                    <SuccessCard
                        story={featured}
                        featured
                    />

                    <div className="success-grid">

                        {

                            others.map(story => (

                                <SuccessCard
                                    key={story.id}
                                    story={story}
                                />

                            ))

                        }

                    </div>

                </div>

            </div>

        </section>

    );

};

export default OffshoreSuccessStories;