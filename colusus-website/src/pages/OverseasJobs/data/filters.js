const filters = {


    regions: [

        {
            id: "all",

            label: "All Countries"
        },


        {
            id: "europe",

            label: "Europe"
        }

    ],





    jobTypes: [

        {
            id: "construction",

            label: "Construction"
        },


        {
            id: "warehouse-logistics",

            label: "Warehouse & Logistics"
        },


        {
            id: "factory-production",

            label: "Factory & Production"
        },


        {
            id: "hospitality",

            label: "Hospitality & Kitchen"
        },


        {
            id: "agriculture",

            label: "Agriculture"
        },


        {
            id: "seafood",

            label: "Seafood Production"
        },


        {
            id: "cleaning-maintenance",

            label: "Cleaning & Maintenance"
        },


        {
            id: "technology",

            label: "Technology"
        }

    ],





    salaryRanges: [

        {
            id: "below-1000",

            label: "Below €1,000",

            min: 0,

            max: 999

        },


        {
            id: "1000-1500",

            label: "€1,000 - €1,500",

            min: 1000,

            max: 1500

        },


        {
            id: "1500-2500",

            label: "€1,500 - €2,500",

            min: 1500,

            max: 2500

        },


        {
            id: "2500-plus",

            label: "€2,500+",

            min: 2500,

            max: Infinity

        }

    ],





    processingSpeed: [

        {
            id: "fast",

            label: "Fast Processing"

        },


        {
            id: "standard",

            label: "Standard Processing"

        },


        {
            id: "flexible",

            label: "Flexible Timeline"

        }

    ],





    benefits: [

        {
            id: "accommodation",

            label: "Accommodation Provided"

        },


        {
            id: "work-permit",

            label: "Work Permit"

        },


        {
            id: "residency",

            label: "Residency Support"

        },


        {
            id: "visa",

            label: "Visa Support"

        }


    ]

};




export default filters;