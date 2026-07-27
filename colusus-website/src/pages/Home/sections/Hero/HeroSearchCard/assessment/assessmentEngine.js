import assessmentConfig from "./assessmentConfig";


const runAssessment = ({
    destination,
    purpose,
    requirement
}) => {


    const assessment =
        assessmentConfig[purpose];



    if(!assessment){

        return null;

    }




    const selectedOption =
        assessment.options.find(
            item =>
            item.label === requirement
        );





    if(!selectedOption){

        return null;

    }






    /*
    ==========================================
        SCORE CALCULATION
    ==========================================
    */


    let score =
    selectedOption.score;



    score =
    Math.round(
        (
            score *
            assessment.scoreWeight
        )
        /
        100
    );







    /*
    ==========================================
        DESTINATION ADVANTAGE
    ==========================================
    */


    const countryBonus = {


        Canada:8,


        Australia:7,


        "United Kingdom":6,


        Germany:7


    };



    score +=
    countryBonus[destination] || 0;






    /*
    ==========================================
        SCORE CONTROL
    ==========================================
    */


    score = Math.min(
        score,
        98
    );


    score = Math.max(
        score,
        65
    );








    /*
    ==========================================
        EMOTIONAL CONFIDENCE LABEL
    ==========================================
    */


    let confidenceLabel;



    if(score >=90){


        confidenceLabel =
        "Exceptional Opportunity Potential";


    }

    else if(score >=75){


        confidenceLabel =
        "Strong Migration Potential";


    }

    else{


        confidenceLabel =
        "Promising Starting Point";


    }








    /*
    ==========================================
        MATCH LEVEL
    ==========================================
    */


    let match;



    if(score >=90){


        match =
        "Excellent Match";


    }


    else if(score >=75){


        match =
        "Strong Match";


    }


    else{


        match =
        "Potential Match";


    }










    /*
    ==========================================
        PATHWAY GENERATION
    ==========================================
    */


    const pathwayMap = {


        Work:

        `${destination} Skilled Work Pathway`,



        Study:

        `${destination} Education Pathway`,



        "Permanent Residence":

        `${destination} Permanent Residence Route`,



        Business:

        `${destination} Business Migration Pathway`,



        Visit:

        `${destination} Visitor Pathway`


    };



    const pathway =
    pathwayMap[purpose]
    ||
    `${destination} Migration Opportunity`;









    /*
    ==========================================
        STRENGTH GENERATION
    ==========================================
    */


    const strengths = [];



    strengths.push(

        `${requirement} profile`

    );



    strengths.push(

        `${destination} pathway identified`

    );



    strengths.push(

        `${purpose} opportunity alignment`

    );









    /*
    ==========================================
        PREPARATION ROADMAP
    ==========================================
    */


    const preparationSteps = [


        "Profile verification",


        "Document preparation",


        "Personal migration roadmap"


    ];









    /*
    ==========================================
        FINAL RESULT
    ==========================================
    */


    return {


        score,


        match,


        confidenceLabel,



        destination,


        purpose,


        requirement,



        pathway,



        opportunityType:

        assessment.title
        ||
        `${purpose} Opportunity`,



        achievementTitle:

        assessment.achievement
        ||
        `${purpose} Opportunity Unlocked`,



        recommendation:

        assessment.resultMessage,



        advisorMessage:

        `Our advisors will guide your ${purpose.toLowerCase()} journey and help you understand the best next steps.`,



        nextMilestone:

        assessment.nextStep
        ||
        "Personal Roadmap",



        profileLevel:

        selectedOption.level
        ||
        "Qualified Profile",



        strengths,


        preparationSteps


    };


};



export default runAssessment;