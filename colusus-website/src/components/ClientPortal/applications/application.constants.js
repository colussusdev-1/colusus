/* ============================================================
   COLUSUS — APPLICATION CONSTANTS
============================================================ */

/* ============================================================
   COUNTRY IMAGES
============================================================ */

import australiaImage from "../../../assets/images/countries/australia.jpg";
import bulgariaImage from "../../../assets/images/countries/bulgaria.jpg";
import canadaImage from "../../../assets/images/countries/canada.jpg";
import croatiaImage from "../../../assets/images/countries/croatia.jpg";
import finlandImage from "../../../assets/images/countries/finland.jpg";
import germanyImage from "../../../assets/images/countries/germany.jpg";
import hungaryImage from "../../../assets/images/countries/hungary.jpg";
import latviaImage from "../../../assets/images/countries/latvia.jpg";
import lithuaniaImage from "../../../assets/images/countries/lithuania.jpg";
import norwayImage from "../../../assets/images/countries/norway.jpg";
import polandImage from "../../../assets/images/countries/poland.jpg";
import romaniaImage from "../../../assets/images/countries/romania.jpg";
import serbiaImage from "../../../assets/images/countries/serbia.jpg";
import spainImage from "../../../assets/images/countries/spain.jpg";
import unitedKingdomImage from "../../../assets/images/countries/uk.jpg";

/* ============================================================
   COUNTRY FLAGS
============================================================ */

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

/* ============================================================
   COUNTRY IMAGES
============================================================ */

export const COUNTRY_IMAGES = {
  AUSTRALIA: australiaImage,

  BULGARIA: bulgariaImage,

  CANADA: canadaImage,

  CROATIA: croatiaImage,

  FINLAND: finlandImage,

  GERMANY: germanyImage,

  HUNGARY: hungaryImage,

  LATVIA: latviaImage,

  LITHUANIA: lithuaniaImage,

  NORWAY: norwayImage,

  POLAND: polandImage,

  ROMANIA: romaniaImage,

  SERBIA: serbiaImage,

  SPAIN: spainImage,

  "UNITED KINGDOM": unitedKingdomImage,

  UK: unitedKingdomImage,
};

/* ============================================================
   COUNTRY FLAGS
============================================================ */

export const COUNTRY_FLAGS = {
  AUSTRALIA: australiaFlag,

  BULGARIA: bulgariaFlag,

  CANADA: canadaFlag,

  GERMANY: germanyFlag,

  HUNGARY: hungaryFlag,

  NIGERIA: nigeriaFlag,

  POLAND: polandFlag,

  ROMANIA: romaniaFlag,

  SERBIA: serbiaFlag,

  SINGAPORE: singaporeFlag,

  "UNITED KINGDOM": unitedKingdomFlag,

  UK: unitedKingdomFlag,

  "UNITED STATES": usaFlag,

  "UNITED STATES OF AMERICA": usaFlag,

  USA: usaFlag,
};

/* ============================================================
   COUNTRY ALIASES
============================================================ */

export const COUNTRY_ALIASES = {
  /* Australia */

  AUSATRALIA: "AUSTRALIA",

  AUSATRAILIA: "AUSTRALIA",

  AUSTRAILIA: "AUSTRALIA",

  /* United Kingdom */

  BRITAIN: "UNITED KINGDOM",

  "GREAT BRITAIN": "UNITED KINGDOM",

  UK: "UNITED KINGDOM",

  ENGLAND: "UNITED KINGDOM",

  /* United States */

  AMERICA: "UNITED STATES",

  USA: "UNITED STATES",

  "UNITED STATES OF AMERICA": "UNITED STATES",
};

/* ============================================================
   NORMALIZE COUNTRY
============================================================ */

export const normalizeCountry = (country) => {
  if (!country) {
    return "";
  }

  const normalizedCountry = String(country)
    .trim()
    .toUpperCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  return COUNTRY_ALIASES[normalizedCountry] || normalizedCountry;
};

/* ============================================================
   GET COUNTRY IMAGE
============================================================ */

export const getCountryImage = (country) => {
  const normalizedCountry = normalizeCountry(country);

  return COUNTRY_IMAGES[normalizedCountry] || null;
};

/* ============================================================
   GET COUNTRY FLAG
============================================================ */

export const getCountryFlag = (country) => {
  const normalizedCountry = normalizeCountry(country);

  return COUNTRY_FLAGS[normalizedCountry] || null;
};

/* ============================================================
   COUNTRY CODES
============================================================ */

export const COUNTRY_CODES = {
  AUSTRALIA: "AU",

  BULGARIA: "BG",

  CANADA: "CA",

  CROATIA: "HR",

  FINLAND: "FI",

  GERMANY: "DE",

  HUNGARY: "HU",

  LATVIA: "LV",

  LITHUANIA: "LT",

  NORWAY: "NO",

  POLAND: "PL",

  ROMANIA: "RO",

  SERBIA: "RS",

  SPAIN: "ES",

  "UNITED KINGDOM": "GB",

  "UNITED STATES": "US",

  NIGERIA: "NG",

  SINGAPORE: "SG",
};

/* ============================================================
   GET COUNTRY CODE
============================================================ */

export const getCountryCode = (country) => {
  const normalizedCountry = normalizeCountry(country);

  return COUNTRY_CODES[normalizedCountry] || normalizedCountry.slice(0, 2);
};

/* ============================================================
   APPLICATION FILTERS
============================================================ */

export const APPLICATION_FILTERS = {
  ALL: "ALL",

  ACTIVE: "ACTIVE",

  SUBMITTED: "SUBMITTED",

  COMPLETED: "COMPLETED",
};

/* ============================================================
   COMPLETED STATUSES
============================================================ */

export const COMPLETED_STATUSES = ["APPROVED", "COMPLETED"];

/* ============================================================
   TERMINAL STATUSES
============================================================ */

export const TERMINAL_STATUSES = ["APPROVED", "COMPLETED", "REJECTED"];
