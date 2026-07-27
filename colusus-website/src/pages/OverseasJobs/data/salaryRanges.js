const salaryRanges = [

    {
        id: "entry",

        label: "€700 - €1,000",

        min: 700,

        max: 1000,

        description:
        "Entry-level roles including agriculture, general labour and seasonal opportunities."

    },



    {
        id: "standard",

        label: "€1,000 - €1,500",

        min: 1000,

        max: 1500,

        description:
        "Common range for warehouse, factory, hospitality and skilled worker positions."

    },



    {
        id: "skilled",

        label: "€1,500 - €2,500",

        min: 1500,

        max: 2500,

        description:
        "Skilled positions including construction trades, technical roles and experienced workers."

    },



    {
        id: "premium",

        label: "€2,500+",

        min: 2500,

        max: Infinity,

        description:
        "Higher-paying opportunities depending on country, employer and professional experience."

    }

];



export default salaryRanges;