import getRecommendation  from "./data/recommendationLogic"
import {
    HiOutlineGlobeAlt,
    HiOutlineBriefcase,
    HiOutlineAcademicCap
} from "react-icons/hi";

import "./AssessmentResult.css";

import AssessmentHeader
    from "./components/AssessmentHeader";

import AssessmentScoreCard
    from "./components/AssessmentScoreCard";

import AssessmentPathwayCard
    from "./components/AssessmentPathwayCard";

import AssessmentCountries
    from "./components/AssessmentCountries";

import AssessmentProfile
    from "./components/AssessmentProfile";

import AssessmentRoadmap
    from "./components/AssessmentRoadmap";

import AssessmentCTA
    from "./components/AssessmentCTA";



const AssessmentResult = ({ data }) => {




    const recommendation = getRecommendation(data);
    const pathwayIcons = {

        briefcase: <HiOutlineBriefcase />,

        academic: <HiOutlineAcademicCap />,

        globe: <HiOutlineGlobeAlt />

    };


    recommendation.icon = pathwayIcons[recommendation.icon];

    return (
        <section
            id="assessment-result"
            className="assessmentResult"
        >
            <div className="assessmentResult__container">
                <AssessmentHeader />
                <AssessmentScoreCard
                    recommendation={
                        recommendation
                    }
                />
                <AssessmentPathwayCard
                    recommendation={
                        recommendation
                    }
                />
                <AssessmentCountries
                    countries={
                        recommendation.countries
                    }
                />
                <AssessmentProfile
                    data={
                        data
                    }
                />
                <AssessmentRoadmap />
                <AssessmentCTA />
            </div>
        </section>
    );
};
export default AssessmentResult;