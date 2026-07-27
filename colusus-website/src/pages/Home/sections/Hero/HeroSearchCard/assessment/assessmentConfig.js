const assessmentConfig = {


    Work: {

        label: "Years of Professional Experience",

        icon:"briefcase",

        scoreWeight:40,


        title:
        "Skilled Work Opportunity",


        achievement:
        "Your professional profile unlocked a possible work pathway.",


        nextStep:
        "Employer & Opportunity Matching",



        options:[

            {
                label:"0 - 2 Years",
                score:50,
                level:"Entry Profile"
            },


            {
                label:"3 - 5 Years",
                score:75,
                level:"Experienced Profile"
            },


            {
                label:"5+ Years",
                score:95,
                level:"Advanced Professional Profile"
            }

        ],



        resultMessage:
        "Your professional background may qualify you for international employment opportunities."

    },








    Study:{


        label:"Education Level",

        icon:"academic",


        scoreWeight:35,


        title:
        "International Study Opportunity",


        achievement:
        "Your academic profile unlocked possible education pathways.",


        nextStep:
        "School & Program Matching",



        options:[


            {
                label:"Secondary School",
                score:50,
                level:"Foundation Stage"
            },


            {
                label:"Bachelor Degree",
                score:80,
                level:"Graduate Profile"
            },


            {
                label:"Master Degree",
                score:90,
                level:"Advanced Academic Profile"
            },


            {
                label:"PhD",
                score:95,
                level:"Research Profile"
            }


        ],



        resultMessage:

        "Your academic background opens possible study pathways abroad."

    },









    "Permanent Residence":{


        label:"Language Level",

        icon:"globe",


        scoreWeight:40,


        title:
        "Permanent Residence Potential",


        achievement:
        "Your profile shows indicators for long-term migration routes.",


        nextStep:
        "Eligibility Assessment",



        options:[


            {
                label:"Beginner",
                score:45,
                level:"Needs Improvement"
            },


            {
                label:"Intermediate",
                score:65,
                level:"Developing Profile"
            },


            {
                label:"Fluent",
                score:85,
                level:"Strong Language Profile"
            },


            {
                label:"Certified Language Score",
                score:95,
                level:"Verified Language Profile"
            }


        ],



        resultMessage:

        "Your profile shows indicators that may support long-term migration pathways."

    },









    Business:{


        label:"Business Background",

        icon:"business",


        scoreWeight:45,


        title:
        "Business Migration Opportunity",


        achievement:
        "Your business profile unlocked investment possibilities.",


        nextStep:
        "Business Route Review",



        options:[


            {
                label:"No Business Experience",
                score:40,
                level:"New Entrepreneur"
            },


            {
                label:"Existing Business Owner",
                score:80,
                level:"Business Profile"
            },


            {
                label:"Investor",
                score:95,
                level:"Investment Profile"
            }


        ],



        resultMessage:

        "Your business profile may align with international investment opportunities."

    },









    Visit:{


        label:"Travel History",

        icon:"globe",


        scoreWeight:25,


        title:
        "International Travel Opportunity",


        achievement:
        "Your travel profile created a possible visitor pathway.",


        nextStep:
        "Travel Planning",



        options:[


            {
                label:"First International Trip",
                score:50,
                level:"New Traveller"
            },


            {
                label:"Previous Travel Experience",
                score:75,
                level:"Experienced Traveller"
            },


            {
                label:"Frequent Traveler",
                score:90,
                level:"Frequent Traveller"
            }


        ],



        resultMessage:

        "Your travel background can support your international journey planning."

    }


};


export default assessmentConfig;