const requiredEnvVariables = [
  "MONGO_URI",
  "JWT_SECRET",
  "PAYSTACK_SECRET_KEY",
  "PAYSTACK_PUBLIC_KEY",
];

requiredEnvVariables.forEach((variable) => {
  if (!process.env[variable]) {
    throw new Error(`Missing required environment variable: ${variable}`);
  }
});

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
};

export default config;
