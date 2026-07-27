const getRecommendation = (data) => {

    if (
        data?.goal === "Work Abroad" &&
        data?.education === "Bachelor Degree"
    ) {

        return {

            score:92,
            level:"Excellent Match",
            pathway:"Work Permit",

            icon:"briefcase",

            countries:[
                {
                    flag:"🇨🇦",
                    name:"Canada",
                    match:"92%"
                },
                {
                    flag:"🇦🇺",
                    name:"Australia",
                    match:"87%"
                },
                {
                    flag:"🇬🇧",
                    name:"United Kingdom",
                    match:"81%"
                }
            ]

        };

    }


    if(data?.goal==="Study Overseas"){

        return{

            score:89,
            level:"Strong Match",
            pathway:"Student Visa",

            icon:"academic",

            countries:[
                {
                    flag:"🇨🇦",
                    name:"Canada",
                    match:"89%"
                },
                {
                    flag:"🇬🇧",
                    name:"United Kingdom",
                    match:"84%"
                },
                {
                    flag:"🇦🇺",
                    name:"Australia",
                    match:"82%"
                }
            ]

        };

    }



    return{

        score:78,
        level:"Good Match",
        pathway:"Migration Pathway",

        icon:"globe",

        countries:[
            {
                flag:"🇨🇦",
                name:"Canada",
                match:"78%"
            },
            {
                flag:"🇦🇺",
                name:"Australia",
                match:"74%"
            },
            {
                flag:"🇬🇧",
                name:"United Kingdom",
                match:"71%"
            }
        ]

    };

};


export default getRecommendation;