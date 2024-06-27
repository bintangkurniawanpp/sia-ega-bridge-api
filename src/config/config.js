import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    PORT: process.env.PORT || 3000,
    apiKeyDev: process.env.API_KEY_DEV,
    ARIStenant: process.env.UMC_TENANT,
    ARISusername: process.env.UMC_USERNAME,
    ARISpassword: process.env.UMC_PASSWORD,
    umcUrl: process.env.UMC_BASE_URL,
    absUrl: process.env.ABS_BASE_URL,
    absDatabaseDev: process.env.ABS_DB_DEV
  },
  test: {
    PORT: process.env.PORT || 3000,
    apiKeyDev: process.env.API_KEY_DEV,
    ARIStenant: process.env.UMC_TENANT,
    ARISusername: process.env.UMC_USERNAME,
    ARISpassword: process.env.UMC_PASSWORD,
    umcUrl: process.env.UMC_BASE_URL,
    absUrl: process.env.ABS_BASE_URL,
    absDatabaseDev: process.env.ABS_DB_DEV
  },
  production: {
    PORT: process.env.PORT || 3000,
    apiKeyProd: process.env.API_KEY_PROD,
    ARIStenant: process.env.UMC_TENANT,
    ARISusername: process.env.UMC_USERNAME,
    ARISpassword: process.env.UMC_PASSWORD,
    umcUrl: process.env.UMC_BASE_URL,
    absUrl: process.env.ABS_BASE_URL,
    absDatabaseProd: process.env.ABS_DB_PROD
  },
};


export default config; // Export as the default export
