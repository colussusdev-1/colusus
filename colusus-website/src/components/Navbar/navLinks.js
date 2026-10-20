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
        name: "Global Work & Immigration Pathways",
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
    name: "Pathways",
    path: "/pathways",
  },

  {
    name: "Blog",
    path: "/blog",
  },

  {
    name: "Contact",
    path: "/contact",
  },
];

/* -------------------------------------------------------------------------- */
/* SECONDARY NAVIGATION ACTIONS                                               */
/* -------------------------------------------------------------------------- */

export const navActions = {
  search: {
    name: "Search Destinations",
    ariaLabel: "Search migration destinations",
  },

  login: {
    name: "Client Login",
    path: "/login",
  },

  consultation: {
    name: "Book a Consultation",
    path: "/contact",
  },
};

export default navLinks;
