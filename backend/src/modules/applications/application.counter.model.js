import mongoose from "mongoose";

/*
============================================================
APPLICATION COUNTER MODEL
============================================================
|
| Maintains the permanent sequential number used for
| colossus application references.
|
| Example:
|
| APPLICATION_2026
|
| sequence:
|   1
|   2
|   3
|   4
|
| The application service will convert these numbers into:
|
| COL-2026-000001
| COL-2026-000002
| COL-2026-000003
|
| IMPORTANT:
|
| This counter is NOT the application's MongoDB _id.
|
| MongoDB _id:
|   Internal database identity
|
| ApplicationCounter:
|   Sequential number generator
|
| Application:
|   Permanent human-facing application identity
|
============================================================
*/

/*
============================================================
COUNTER SCHEMA
============================================================
*/

const applicationCounterSchema = new mongoose.Schema(
  {
    /*
    |----------------------------------------------------------------
    | YEAR
    |----------------------------------------------------------------
    |
    | The year this counter belongs to.
    |
    | Example:
    |
    | 2026
    |
    | A new year automatically gets its own sequence.
    |
    | 2026:
    |   1, 2, 3, 4...
    |
    | 2027:
    |   1, 2, 3, 4...
    |
    |----------------------------------------------------------------
    */

    year: {
      type: Number,

      required: true,

      min: 2000,

      index: true,
    },

    /*
    |----------------------------------------------------------------
    | SEQUENCE
    |----------------------------------------------------------------
    |
    | Current application number for this year.
    |
    | Example:
    |
    | year:
    |   2026
    |
    | sequence:
    |   42
    |
    | Next application:
    |
    | COL-2026-000043
    |
    |----------------------------------------------------------------
    */

    sequence: {
      type: Number,

      required: true,

      default: 0,

      min: 0,
    },
  },

  {
    timestamps: true,
  },
);

/*
============================================================
PRIMARY COUNTER ID
============================================================
|
| We use a deterministic MongoDB _id for each year.
|
| Examples:
|
| APPLICATION_2026
| APPLICATION_2027
| APPLICATION_2028
|
| This means MongoDB maintains exactly one counter document
| per year.
|
============================================================
*/

applicationCounterSchema.index(
  {
    year: 1,
  },
  {
    unique: true,
  },
);

/*
============================================================
MODEL
============================================================
*/

const ApplicationCounter = mongoose.model(
  "ApplicationCounter",

  applicationCounterSchema,
);

export default ApplicationCounter;
