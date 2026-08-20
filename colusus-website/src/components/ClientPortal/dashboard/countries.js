import australiaFlag from "../../../assets/flags/australia.png";
import bulgariaFlag from "../../../assets/flags/bulgaria.png";
import canadaFlag from "../../../assets/flags/canada.png";
import germanyFlag from "../../../assets/flags/germany.png";
import hungaryFlag from "../../../assets/flags/hungary.png";
import nigeriaFlag from "../../../assets/flags/nigeria.png";
import polandFlag from "../../../assets/flags/poland.png";
import romaniaFlag from "../../../assets/flags/romania.png";
import serbiaFlag from "../../../assets/flags/serbia.png";
import singaporeFlag from "../../../assets/flags/singapore.png";
import unitedKingdomFlag from "../../../assets/flags/united-kingdom.png";
import usaFlag from "../../../assets/flags/usa.png";

const COUNTRY_FLAGS = {
  australia: australiaFlag,
  bulgaria: bulgariaFlag,
  canada: canadaFlag,
  germany: germanyFlag,
  hungary: hungaryFlag,
  nigeria: nigeriaFlag,
  poland: polandFlag,
  romania: romaniaFlag,
  serbia: serbiaFlag,
  singapore: singaporeFlag,

  "united kingdom": unitedKingdomFlag,

  usa: usaFlag,
  "united states": usaFlag,
};

export const getCountryFlag = (country) => {
  if (!country) {
    return null;
  }

  const normalizedCountry = country.trim().toLowerCase();

  return COUNTRY_FLAGS[normalizedCountry] || null;
};
