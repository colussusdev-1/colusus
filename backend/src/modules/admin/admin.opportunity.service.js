import mongoose from "mongoose";
import Opportunity from "../opportunities/opportunity.model.js";

/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const toTrimmedString = (value, fallback = "") => {
    if (value === undefined || value === null) {
        return fallback;
    }

    return String(value).trim();
};

const toNullableString = (value) => {
    const normalized = toTrimmedString(value);

    return normalized || null;
};

const toBoolean = (value, fallback = false) => {
    if (typeof value === "boolean") {
        return value;
    }

    if (typeof value === "string") {
        if (value.toLowerCase() === "true") {
            return true;
        }

        if (value.toLowerCase() === "false") {
            return false;
        }
    }

    return fallback;
};

const normalizeArray = (value) => {
    if (!Array.isArray(value)) {
        return [];
    }

    return value
        .map((item) => {
            if (typeof item === "string") {
                return item.trim();
            }

            return item;
        })
        .filter((item) => {
            if (typeof item === "string") {
                return item.length > 0;
            }

            return item !== null && item !== undefined;
        });
};

const slugify = (value) => {
    return toTrimmedString(value)
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .replace(/-{2,}/g, "-");
};

/*
|--------------------------------------------------------------------------
| UNIQUE SLUG
|--------------------------------------------------------------------------
*/

const makeUniqueSlug = async (
    value,
    excludeId = null,
) => {
    const baseSlug = slugify(value);

    if (!baseSlug) {
        const error = new Error(
            "A valid opportunity slug could not be generated.",
        );

        error.statusCode = 400;

        throw error;
    }

    let slug = baseSlug;
    let counter = 2;

    while (true) {
        const query = {
            slug,
        };

        if (excludeId) {
            query._id = {
                $ne: excludeId,
            };
        }

        const existing = await Opportunity
            .findOne(query)
            .select("_id");

        if (!existing) {
            return slug;
        }

        slug = `${baseSlug}-${counter}`;

        counter += 1;
    }
};

/*
|--------------------------------------------------------------------------
| COUNTRY ID
|--------------------------------------------------------------------------
*/

const getCountryId = async (
    countryName,
    providedCountryId = null,
) => {
    if (
        providedCountryId !== null &&
        providedCountryId !== undefined &&
        providedCountryId !== ""
    ) {
        const parsed = Number(providedCountryId);

        if (
            Number.isFinite(parsed) &&
            parsed > 0
        ) {
            return parsed;
        }
    }

    const escapedCountryName = String(
        countryName || "",
    )
        .trim()
        .replace(
            /[.*+?^${}()|[\]\\]/g,
            "\\$&",
        );

    const existingCountry = await Opportunity
        .findOne({
            countryName: {
                $regex: `^${escapedCountryName}$`,
                $options: "i",
            },
        })
        .select("countryId")
        .sort({
            countryId: 1,
        });

    if (
        existingCountry?.countryId
    ) {
        return existingCountry.countryId;
    }

    const latestCountry = await Opportunity
        .findOne({
            countryId: {
                $exists: true,
                $ne: null,
            },
        })
        .sort({
            countryId: -1,
        })
        .select("countryId");

    return (
        Number(
            latestCountry?.countryId || 0,
        ) + 1
    );
};

/*
|--------------------------------------------------------------------------
| LEGACY ID
|--------------------------------------------------------------------------
*/

const getNextLegacyId = async () => {
    const latestOpportunity = await Opportunity
        .findOne({
            legacyId: {
                $exists: true,
                $ne: null,
            },
        })
        .sort({
            legacyId: -1,
        })
        .select("legacyId");

    return (
        Number(
            latestOpportunity?.legacyId || 0,
        ) + 1
    );
};

/*
|--------------------------------------------------------------------------
| POSITIONS
|--------------------------------------------------------------------------
*/

const normalizePositions = (
    positions,
) => {
    if (!Array.isArray(positions)) {
        return [];
    }

    return positions
        .map((position) => {
            if (typeof position === "string") {
                const title = position.trim();

                if (!title) {
                    return null;
                }

                return {
                    title,
                };
            }

            if (
                !position ||
                typeof position !== "object"
            ) {
                return null;
            }

            return {
                ...position,

                title: toTrimmedString(
                    position.title,
                ),

                description:
                    toNullableString(
                        position.description,
                    ),

                salary:
                    toNullableString(
                        position.salary,
                    ),

                demand:
                    toNullableString(
                        position.demand,
                    ),

                requirements:
                    normalizeArray(
                        position.requirements,
                    ),

                benefits:
                    normalizeArray(
                        position.benefits,
                    ),
            };
        })
        .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| STEPS
|--------------------------------------------------------------------------
*/

const normalizeSteps = (
    steps,
) => {
    if (!Array.isArray(steps)) {
        return [];
    }

    return steps
        .map((step) => {
            if (
                !step ||
                typeof step !== "object"
            ) {
                return null;
            }

            const title =
                toTrimmedString(
                    step.title,
                );

            if (!title) {
                return null;
            }

            return {
                title,

                description:
                    toNullableString(
                        step.description,
                    ),

                duration:
                    toNullableString(
                        step.duration,
                    ),
            };
        })
        .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| PAYMENT PLAN
|--------------------------------------------------------------------------
*/

const normalizePaymentPlan = (
    paymentPlan,
) => {
    if (!Array.isArray(paymentPlan)) {
        return [];
    }

    return paymentPlan
        .map((item) => {
            if (typeof item === "string") {
                const description =
                    item.trim();

                if (!description) {
                    return null;
                }

                return {
                    description,
                };
            }

            if (
                !item ||
                typeof item !== "object"
            ) {
                return null;
            }

            return {
                ...item,

                title:
                    toNullableString(
                        item.title,
                    ),

                description:
                    toNullableString(
                        item.description,
                    ),

                amount:
                    toNullableString(
                        item.amount,
                    ),

                percentage:
                    item.percentage !==
                        undefined &&
                    item.percentage !==
                        null &&
                    item.percentage !== ""
                        ? Number(
                            item.percentage,
                        )
                        : undefined,
            };
        })
        .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| PRICING
|--------------------------------------------------------------------------
*/

const normalizePricing = (
    pricing,
) => {
    if (
        !pricing ||
        typeof pricing !== "object"
    ) {
        return {};
    }

    return {
        ...pricing,

        amount:
            pricing.amount !==
                undefined &&
            pricing.amount !==
                null &&
            pricing.amount !== ""
                ? Number(
                    pricing.amount,
                )
                : undefined,

        currency:
            toNullableString(
                pricing.currency,
            ),

        label:
            toNullableString(
                pricing.label,
            ),

        description:
            toNullableString(
                pricing.description,
            ),
    };
};

/*
|--------------------------------------------------------------------------
| REQUIRED DOCUMENTS
|--------------------------------------------------------------------------
*/

const normalizeRequiredDocuments = (
    documents,
) => {
    if (!Array.isArray(documents)) {
        return [];
    }

    const allowedTypes = [
        "PASSPORT",
        "IDENTIFICATION",
        "ACADEMIC_CERTIFICATE",
        "FINANCIAL_DOCUMENT",
        "EMPLOYMENT_DOCUMENT",
        "OTHER",
    ];

    return documents
        .map((document) => {
            if (
                typeof document ===
                "string"
            ) {
                const name =
                    document.trim();

                if (!name) {
                    return null;
                }

                return {
                    name,

                    type: "OTHER",

                    description: "",

                    required: true,
                };
            }

            if (
                !document ||
                typeof document !==
                    "object"
            ) {
                return null;
            }

            const name =
                toTrimmedString(
                    document.name,
                );

            if (!name) {
                return null;
            }

            const type =
                allowedTypes.includes(
                    document.type,
                )
                    ? document.type
                    : "OTHER";

            return {
                name,

                type,

                description:
                    toNullableString(
                        document.description,
                    ),

                required: toBoolean(
                    document.required,
                    true,
                ),
            };
        })
        .filter(Boolean);
};

/*
|--------------------------------------------------------------------------
| APPLICATION CONFIG
|--------------------------------------------------------------------------
*/

const normalizeApplicationConfig = (
    applicationConfig,
) => {
    if (
        !applicationConfig ||
        typeof applicationConfig !==
            "object"
    ) {
        return {
            steps: [
                "DOCUMENTS",
                "REVIEW",
            ],

            questions: [],

            requiredDocuments: [],

            workflow: [],
        };
    }

    const steps =
        Array.isArray(
            applicationConfig.steps,
        ) &&
        applicationConfig.steps.length >
            0
            ? normalizeArray(
                applicationConfig.steps,
            )
            : [
                "DOCUMENTS",
                "REVIEW",
            ];

    return {
        steps,

        questions:
            Array.isArray(
                applicationConfig.questions,
            )
                ? applicationConfig.questions
                : [],

        requiredDocuments:
            normalizeRequiredDocuments(
                applicationConfig.requiredDocuments,
            ),

        workflow:
            Array.isArray(
                applicationConfig.workflow,
            )
                ? applicationConfig.workflow
                : [],
    };
};

/*
|--------------------------------------------------------------------------
| VALIDATION
|--------------------------------------------------------------------------
*/

const validateOpportunityPayload = (
    payload,
) => {
    const requiredFields = [
        [
            "countryName",
            payload.countryName,
        ],

        [
            "title",
            payload.title,
        ],

        [
            "category",
            payload.category,
        ],

        [
            "type",
            payload.type,
        ],

        [
            "description",
            payload.description,
        ],
    ];

    const missingFields =
        requiredFields
            .filter(
                ([, value]) =>
                    !toTrimmedString(
                        value,
                    ),
            )
            .map(
                ([field]) =>
                    field,
            );

    if (
        missingFields.length > 0
    ) {
        const error = new Error(
            `Missing required opportunity fields: ${missingFields.join(
                ", ",
            )}.`,
        );

        error.statusCode = 400;

        throw error;
    }
};

/*
|--------------------------------------------------------------------------
| CREATE DATA
|--------------------------------------------------------------------------
|
| This is ONLY for creating a new opportunity.
|--------------------------------------------------------------------------
*/

const buildCreateData = async (
    payload,
) => {
    validateOpportunityPayload(
        payload,
    );

    const countryName =
        toTrimmedString(
            payload.countryName,
        );

    const countrySlug =
        slugify(
            payload.countrySlug,
        ) ||
        slugify(countryName);

    if (!countrySlug) {
        const error = new Error(
            "A valid country slug is required.",
        );

        error.statusCode = 400;

        throw error;
    }

    const title =
        toTrimmedString(
            payload.title,
        );

    const slug =
        await makeUniqueSlug(
            payload.slug ||
                title,
        );

    const countryId =
        await getCountryId(
            countryName,
            payload.countryId,
        );

    const legacyId =
        payload.legacyId !==
            undefined &&
        payload.legacyId !==
            null &&
        payload.legacyId !== ""
            ? Number(
                payload.legacyId,
            )
            : await getNextLegacyId();

    return {
        countryId,

        countryName,

        countrySlug,

        countryFlag:
            toNullableString(
                payload.countryFlag,
            ),

        countryImage:
            toNullableString(
                payload.countryImage,
            ),

        applicants:
            toTrimmedString(
                payload.applicants,
            ),

        countryCategories:
            normalizeArray(
                payload.countryCategories,
            ),

        countryVisa:
            toNullableString(
                payload.countryVisa,
            ),

        countryDuration:
            toNullableString(
                payload.countryDuration,
            ),

        countryProcessingTime:
            toNullableString(
                payload.countryProcessingTime,
            ),

        countryDescription:
            toNullableString(
                payload.countryDescription,
            ),

        opportunityScore:
            toTrimmedString(
                payload.opportunityScore,
            ),

        successRate:
            toTrimmedString(
                payload.successRate,
            ),

        featured: toBoolean(
            payload.featured,
            false,
        ),

        legacyId,

        title,

        slug,

        image:
            toNullableString(
                payload.image,
            ),

        category:
            toTrimmedString(
                payload.category,
            ),

        location:
            toNullableString(
                payload.location,
            ),

        type:
            toTrimmedString(
                payload.type,
            ),

        duration:
            toNullableString(
                payload.duration,
            ),

        icon:
            toNullableString(
                payload.icon,
            ),

        salary:
            toNullableString(
                payload.salary,
            ),

        demand:
            toNullableString(
                payload.demand,
            ),

        description:
            toTrimmedString(
                payload.description,
            ),

        highlights:
            normalizeArray(
                payload.highlights,
            ),

        requirements:
            normalizeArray(
                payload.requirements,
            ),

        documents:
            normalizeArray(
                payload.documents,
            ),

        benefits:
            normalizeArray(
                payload.benefits,
            ),

        steps:
            normalizeSteps(
                payload.steps,
            ),

        positions:
            normalizePositions(
                payload.positions,
            ),

        workConditions:
            payload.workConditions !==
                undefined
                ? payload.workConditions
                : null,

        contract:
            toNullableString(
                payload.contract,
            ),

        faq:
            Array.isArray(
                payload.faq,
            )
                ? payload.faq
                : [],

        pricing:
            normalizePricing(
                payload.pricing,
            ),

        paymentPlan:
            normalizePaymentPlan(
                payload.paymentPlan,
            ),

        terms:
            normalizeArray(
                payload.terms,
            ),

        applicationConfig:
            normalizeApplicationConfig(
                payload.applicationConfig,
            ),

        active: toBoolean(
            payload.active,
            true,
        ),
    };
};

/*
|--------------------------------------------------------------------------
| UPDATE DATA
|--------------------------------------------------------------------------
|
| IMPORTANT:
|
| This function ONLY includes fields explicitly sent by the frontend.
|
| That means the simplified admin form can safely update:
|
| - countryImage
| - image
| - title
| - category
| - type
| - location
| - duration
| - salary
| - description
| - active
| - featured
|
| without destroying advanced opportunity configuration.
|--------------------------------------------------------------------------
*/

const buildUpdateData = async (
    payload,
    existing,
) => {
    validateOpportunityPayload({
        countryName:
            payload.countryName ??
            existing.countryName,

        title:
            payload.title ??
            existing.title,

        category:
            payload.category ??
            existing.category,

        type:
            payload.type ??
            existing.type,

        description:
            payload.description ??
            existing.description,
    });

    const data = {};

    /*
    |--------------------------------------------------------------------------
    | COUNTRY
    |--------------------------------------------------------------------------
    */

    if (
        payload.countryName !==
        undefined
    ) {
        data.countryName =
            toTrimmedString(
                payload.countryName,
            );
    }

    if (
        payload.countrySlug !==
        undefined
    ) {
        data.countrySlug =
            slugify(
                payload.countrySlug,
            );
    }

    if (
        payload.countryId !==
        undefined
    ) {
        const countryId =
            Number(
                payload.countryId,
            );

        if (
            Number.isFinite(
                countryId,
            ) &&
            countryId > 0
        ) {
            data.countryId =
                countryId;
        }
    }

    if (
        payload.countryFlag !==
        undefined
    ) {
        data.countryFlag =
            toNullableString(
                payload.countryFlag,
            );
    }

    if (
        payload.countryImage !==
        undefined
    ) {
        data.countryImage =
            toNullableString(
                payload.countryImage,
            );
    }

    /*
    |--------------------------------------------------------------------------
    | COUNTRY METADATA
    |--------------------------------------------------------------------------
    */

    if (
        payload.applicants !==
        undefined
    ) {
        data.applicants =
            toTrimmedString(
                payload.applicants,
            );
    }

    if (
        payload.countryCategories !==
        undefined
    ) {
        data.countryCategories =
            normalizeArray(
                payload.countryCategories,
            );
    }

    if (
        payload.countryVisa !==
        undefined
    ) {
        data.countryVisa =
            toNullableString(
                payload.countryVisa,
            );
    }

    if (
        payload.countryDuration !==
        undefined
    ) {
        data.countryDuration =
            toNullableString(
                payload.countryDuration,
            );
    }

    if (
        payload.countryProcessingTime !==
        undefined
    ) {
        data.countryProcessingTime =
            toNullableString(
                payload.countryProcessingTime,
            );
    }

    if (
        payload.countryDescription !==
        undefined
    ) {
        data.countryDescription =
            toNullableString(
                payload.countryDescription,
            );
    }

    if (
        payload.opportunityScore !==
        undefined
    ) {
        data.opportunityScore =
            toTrimmedString(
                payload.opportunityScore,
            );
    }

    if (
        payload.successRate !==
        undefined
    ) {
        data.successRate =
            toTrimmedString(
                payload.successRate,
            );
    }

    /*
    |--------------------------------------------------------------------------
    | PUBLISHING
    |--------------------------------------------------------------------------
    */

    if (
        payload.featured !==
        undefined
    ) {
        data.featured =
            toBoolean(
                payload.featured,
                existing.featured ??
                    false,
            );
    }

    if (
        payload.active !==
        undefined
    ) {
        data.active =
            toBoolean(
                payload.active,
                existing.active ??
                    true,
            );
    }

    /*
    |--------------------------------------------------------------------------
    | OPPORTUNITY IDENTITY
    |--------------------------------------------------------------------------
    */

    if (
        payload.title !==
        undefined
    ) {
        data.title =
            toTrimmedString(
                payload.title,
            );
    }

    if (
        payload.slug !==
        undefined
    ) {
        data.slug =
            await makeUniqueSlug(
                payload.slug ||
                    payload.title ||
                    existing.title,
                existing._id,
            );
    }

    /*
    |--------------------------------------------------------------------------
    | OPPORTUNITY CONTENT
    |--------------------------------------------------------------------------
    */

    if (
        payload.image !==
        undefined
    ) {
        data.image =
            toNullableString(
                payload.image,
            );
    }

    if (
        payload.category !==
        undefined
    ) {
        data.category =
            toTrimmedString(
                payload.category,
            );
    }

    if (
        payload.location !==
        undefined
    ) {
        data.location =
            toNullableString(
                payload.location,
            );
    }

    if (
        payload.type !==
        undefined
    ) {
        data.type =
            toTrimmedString(
                payload.type,
            );
    }

    if (
        payload.duration !==
        undefined
    ) {
        data.duration =
            toNullableString(
                payload.duration,
            );
    }

    if (
        payload.icon !==
        undefined
    ) {
        data.icon =
            toNullableString(
                payload.icon,
            );
    }

    if (
        payload.salary !==
        undefined
    ) {
        data.salary =
            toNullableString(
                payload.salary,
            );
    }

    if (
        payload.demand !==
        undefined
    ) {
        data.demand =
            toNullableString(
                payload.demand,
            );
    }

    if (
        payload.description !==
        undefined
    ) {
        data.description =
            toTrimmedString(
                payload.description,
            );
    }

    /*
    |--------------------------------------------------------------------------
    | ADVANCED FIELDS
    |--------------------------------------------------------------------------
    |
    | These are preserved unless a future form explicitly sends them.
    |--------------------------------------------------------------------------
    */

    if (
        payload.highlights !==
        undefined
    ) {
        data.highlights =
            normalizeArray(
                payload.highlights,
            );
    }

    if (
        payload.requirements !==
        undefined
    ) {
        data.requirements =
            normalizeArray(
                payload.requirements,
            );
    }

    if (
        payload.documents !==
        undefined
    ) {
        data.documents =
            normalizeArray(
                payload.documents,
            );
    }

    if (
        payload.benefits !==
        undefined
    ) {
        data.benefits =
            normalizeArray(
                payload.benefits,
            );
    }

    if (
        payload.steps !==
        undefined
    ) {
        data.steps =
            normalizeSteps(
                payload.steps,
            );
    }

    if (
        payload.positions !==
        undefined
    ) {
        data.positions =
            normalizePositions(
                payload.positions,
            );
    }

    if (
        payload.workConditions !==
        undefined
    ) {
        data.workConditions =
            payload.workConditions;
    }

    if (
        payload.contract !==
        undefined
    ) {
        data.contract =
            toNullableString(
                payload.contract,
            );
    }

    if (
        payload.faq !==
        undefined
    ) {
        data.faq =
            Array.isArray(
                payload.faq,
            )
                ? payload.faq
                : [];
    }

    if (
        payload.pricing !==
        undefined
    ) {
        data.pricing =
            normalizePricing(
                payload.pricing,
            );
    }

    if (
        payload.paymentPlan !==
        undefined
    ) {
        data.paymentPlan =
            normalizePaymentPlan(
                payload.paymentPlan,
            );
    }

    if (
        payload.terms !==
        undefined
    ) {
        data.terms =
            normalizeArray(
                payload.terms,
            );
    }

    if (
        payload.applicationConfig !==
        undefined
    ) {
        data.applicationConfig =
            normalizeApplicationConfig(
                payload.applicationConfig,
            );
    }

    /*
    |--------------------------------------------------------------------------
    | NEVER UPDATE THESE DURING EDIT
    |--------------------------------------------------------------------------
    |
    | _id
    | legacyId
    | createdAt
    |
    | They are database identity/history.
    |--------------------------------------------------------------------------
    */

    return data;
};

/*
|--------------------------------------------------------------------------
| GET ALL OPPORTUNITIES
|--------------------------------------------------------------------------
*/

const getAllOpportunities =
    async () => {
        return Opportunity.find({})
            .sort({
                active: -1,
                featured: -1,
                countryName: 1,
                title: 1,
            })
            .lean();
    };

/*
|--------------------------------------------------------------------------
| GET SINGLE OPPORTUNITY
|--------------------------------------------------------------------------
*/

const getOpportunityById =
    async (id) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                id,
            )
        ) {
            return null;
        }

        return Opportunity
            .findById(id)
            .lean();
    };

/*
|--------------------------------------------------------------------------
| CREATE OPPORTUNITY
|--------------------------------------------------------------------------
*/

const createOpportunity =
    async (payload) => {
        const data =
            await buildCreateData(
                payload,
            );

        const opportunity =
            await Opportunity.create(
                data,
            );

        return opportunity.toObject();
    };

/*
|--------------------------------------------------------------------------
| UPDATE OPPORTUNITY
|--------------------------------------------------------------------------
*/

const updateOpportunity =
    async (
        id,
        payload,
    ) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                id,
            )
        ) {
            return null;
        }

        const existing =
            await Opportunity.findById(
                id,
            );

        if (!existing) {
            return null;
        }

        const data =
            await buildUpdateData(
                payload,
                existing,
            );

        const updatedOpportunity =
            await Opportunity.findByIdAndUpdate(
                id,
                {
                    $set: data,
                },
                {
                    new: true,
                    runValidators: true,
                },
            );

        return updatedOpportunity;
    };

/*
|--------------------------------------------------------------------------
| SET ACTIVE / INACTIVE
|--------------------------------------------------------------------------
*/

const setOpportunityActive =
    async (
        id,
        active,
    ) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                id,
            )
        ) {
            return null;
        }

        return Opportunity.findByIdAndUpdate(
            id,
            {
                $set: {
                    active: Boolean(
                        active,
                    ),
                },
            },
            {
                new: true,
                runValidators: true,
            },
        );
    };

/*
|--------------------------------------------------------------------------
| SET FEATURED
|--------------------------------------------------------------------------
*/

const setOpportunityFeatured =
    async (
        id,
        featured,
    ) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                id,
            )
        ) {
            return null;
        }

        return Opportunity.findByIdAndUpdate(
            id,
            {
                $set: {
                    featured: Boolean(
                        featured,
                    ),
                },
            },
            {
                new: true,
                runValidators: true,
            },
        );
    };

/*
|--------------------------------------------------------------------------
| DEACTIVATE
|--------------------------------------------------------------------------
|
| Soft-delete only.
|--------------------------------------------------------------------------
*/

const deactivateOpportunity =
    async (id) => {
        if (
            !mongoose.Types.ObjectId.isValid(
                id,
            )
        ) {
            return null;
        }

        return Opportunity.findByIdAndUpdate(
            id,
            {
                $set: {
                    active: false,
                    featured: false,
                },
            },
            {
                new: true,
                runValidators: true,
            },
        );
    };

/*
|--------------------------------------------------------------------------
| EXPORT
|--------------------------------------------------------------------------
*/

export default {
    getAllOpportunities,

    getOpportunityById,

    createOpportunity,

    updateOpportunity,

    setOpportunityActive,

    setOpportunityFeatured,

    deactivateOpportunity,
};