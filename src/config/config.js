import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    ARIStenant: process.env.UMC_TENANT,
    ARISusername: process.env.UMC_USERNAME,
    ARISpassword: process.env.UMC_PASSWORD,
    umcUrl: process.env.UMC_BASE_URL,
    absUrl: process.env.ABS_BASE_URL,
  },
  test: {},
  production: {},
};


export default config; // Export as the default export
