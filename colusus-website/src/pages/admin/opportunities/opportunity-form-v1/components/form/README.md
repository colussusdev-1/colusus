# Opportunity Form V1

This is a component-based first pass for the Colossus Migration Offer Builder.

## Files
- `OpportunityForm.jsx`: loads, validates and submits the offer.
- `components/form/DestinationSection.jsx`: selects destinations by `countrySlug`.
- `components/form/OfferDetailsSection.jsx`: core public offer content and repeatable lists.
- `components/form/CommercialSection.jsx`: pricing and payment-plan stages.
- `components/form/ApplicationConfigSection.jsx`: application steps, required documents, questions and workflow.
- `components/form/PublicationSection.jsx`: active/featured controls.
- `components/form/Field.jsx`: shared form control.
- `components/form/ArrayEditor.jsx`: simple repeatable string-list editor.

## Install
Copy `OpportunityForm.jsx` over the existing page and copy the `components/form` folder beside it.

The existing `opportunities.service.js`, `opportunity-form.css`, and ImagePicker remain untouched.

## Important integration notes
1. This version sends the full offer payload fields already handled by the current admin opportunity service.
2. Application questions and workflow are edited as JSON arrays. Invalid JSON is not applied to form state.
3. Existing applications retain their own snapshots; editing an offer does not rewrite those snapshots.
4. The destination selector uses `countrySlug`, not `countryId`, to avoid ambiguous matches.
5. Before production use, test a staging/local record first. A destination change can collide with the `{ countrySlug, slug }` unique index.
6. `documents`, `positions`, `workConditions`, and `faq` are preserved in form state and payload; this first pass focuses structured editing on required documents and the most common lists. Dedicated editors can be added in the next iteration.
