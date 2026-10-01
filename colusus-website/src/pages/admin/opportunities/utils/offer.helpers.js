export function getResponseData(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.data?.opportunities)) {
    return response.data.opportunities;
  }

  if (Array.isArray(response?.opportunities)) {
    return response.opportunities;
  }

  return [];
}

export function getOpportunityId(opportunity) {
  return opportunity?._id || opportunity?.id || opportunity?.legacyId || null;
}

export function getCountryName(opportunity) {
  return opportunity?.countryName || opportunity?.country?.name || "—";
}

export function getCountrySlug(opportunity) {
  return opportunity?.countrySlug || opportunity?.country?.slug || "";
}

export function getOpportunityStatus(opportunity) {
  return opportunity?.active === false ? "INACTIVE" : "PUBLISHED";
}

export function formatSalary(salary) {
  if (!salary) {
    return "—";
  }

  if (typeof salary === "string") {
    return salary;
  }

  if (typeof salary === "number") {
    return salary.toLocaleString();
  }

  if (typeof salary === "object") {
    if (salary.display) {
      return salary.display;
    }

    if (salary.amount) {
      const currency = salary.currency ? `${salary.currency} ` : "";

      return `${currency}${Number(salary.amount).toLocaleString()}`;
    }

    if (salary.min !== undefined || salary.max !== undefined) {
      const currency = salary.currency ? `${salary.currency} ` : "";

      const min =
        salary.min !== undefined ? Number(salary.min).toLocaleString() : "—";

      const max =
        salary.max !== undefined ? Number(salary.max).toLocaleString() : "—";

      return `${currency}${min} – ${currency}${max}`;
    }
  }

  return "—";
}

export function getOpportunityTitle(opportunity) {
  return opportunity?.title || "Untitled offer";
}

export function getOpportunityCategory(opportunity) {
  return opportunity?.category || "Uncategorized";
}

export function getOpportunityType(opportunity) {
  return opportunity?.type || "—";
}

export function getOpportunityLocation(opportunity) {
  return opportunity?.location || "—";
}

export function getOpportunityImage(opportunity) {
  return (
    opportunity?.image?.url ||
    opportunity?.imageUrl ||
    opportunity?.coverImage ||
    opportunity?.image ||
    ""
  );
}

export function getPublicOpportunityPath(opportunity) {
  const countrySlug = getCountrySlug(opportunity);
  const slug = opportunity?.slug;

  if (!countrySlug || !slug) {
    return "";
  }

  return `/opportunities/${countrySlug}/${slug}`;
}
