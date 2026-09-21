const navLinks = [
  {
    name: "Home",
    path: "/",
  },

  {
    name: "About Us",
    path: "/about",
  },

  {
    name: "Services",

    dropdown: [
      {
        name: "Canada Migration",
        path: "/services/canada-migration",
      },

      {
        name: "Global Works & Immigration Pathway",
        path: "/services/global-works",
      },

      {
        name: "Ireland Nursing & Healthcare",
        path: "/services/ireland-nursing",
      },

      {
        name: "Tourist Visa",
        path: "/services/tourist-visa",
      },
    ],
  },
  {
    name: "Blog",
    path: "/blog",
  },

  // {
  //     name: "Overseas Job Matching",
  //     path: "/overseas-job-matching",
  // },

  // {
  //     name: "Offshore Company",
  //     path: "/offshore-company",
  // },

  // {
  //     name: "Shop",
  //     path: "/shop",
  // },

  {
    name: "Contact",
    path: "/contact",
  },
];

export default navLinks;
