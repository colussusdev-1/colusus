/*
|--------------------------------------------------------------------------
| Required Environment Variables
|--------------------------------------------------------------------------
*/

const requiredEnvVariables = [
  "MONGO_URI",

  "JWT_SECRET",

  "PAYSTACK_SECRET_KEY",

  "PAYSTACK_PUBLIC_KEY",

  // Cloudinary
  "CLOUDINARY_CLOUD_NAME",

  "CLOUDINARY_API_KEY",

  "CLOUDINARY_API_SECRET",
];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});

/*
|--------------------------------------------------------------------------
| Application Configuration
|--------------------------------------------------------------------------
*/

const config = {
  /*
    |--------------------------------------------------------------------------
    | Application
    |--------------------------------------------------------------------------
    */

  nodeEnv: process.env.NODE_ENV || "development",

  port: Number(process.env.PORT) || 5000,

  clientUrl: process.env.CLIENT_URL || "http://localhost:5173",

  /*
    |--------------------------------------------------------------------------
    | Database
    |--------------------------------------------------------------------------
    */

  mongoUri: process.env.MONGO_URI,

  /*
    |--------------------------------------------------------------------------
    | Authentication
    |--------------------------------------------------------------------------
    */

  jwtSecret: process.env.JWT_SECRET,

  jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",

  /*
    |--------------------------------------------------------------------------
    | Paystack
    |--------------------------------------------------------------------------
    */

  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY,

  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY,

  paystackBaseUrl: process.env.PAYSTACK_BASE_URL || "https://api.paystack.co",

  /*
    |--------------------------------------------------------------------------
    | Consultation
    |--------------------------------------------------------------------------
    */

  consultationFee: Number(process.env.CONSULTATION_FEE) || 50000,

  consultationCurrency: process.env.CONSULTATION_CURRENCY || "NGN",

  /*
    |--------------------------------------------------------------------------
    | Cloudinary
    |--------------------------------------------------------------------------
    */

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,

  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,

  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,
};

/*
|--------------------------------------------------------------------------
| Consultation Fee Debug
|--------------------------------------------------------------------------
|
| Temporary debugging only.
| Remove this after the pricing issue is resolved.
|
|--------------------------------------------------------------------------
*/

console.log("");
console.log("=================================");
console.log("CONSULTATION FEE DEBUG");
console.log("=================================");

console.log("RAW ENV VALUE:", process.env.CONSULTATION_FEE);

console.log("RAW ENV TYPE:", typeof process.env.CONSULTATION_FEE);

console.log("PARSED ENV VALUE:", Number(process.env.CONSULTATION_FEE));

console.log("CONFIG CONSULTATION FEE:", config.consultationFee);

console.log("CONFIG FEE TYPE:", typeof config.consultationFee);

console.log("=================================");
console.log("");

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default config;
