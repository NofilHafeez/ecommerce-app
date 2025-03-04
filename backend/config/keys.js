module.exports = {
    // MongoDB URI (for connecting to your database)
    MONGO_URI: process.env.MONGO_URI,
  
    // JWT Secret (for signing JSON Web Tokens)
    JWT_SECRET: process.env.JWT_SECRET,
  
    // Cloudinary configuration (for handling image uploads)
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
  
    // SMTP email configuration (for sending emails)
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_PORT: process.env.SMTP_PORT,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PASS: process.env.SMTP_PASS,
  
    // PayPal configuration (for payments)
    PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
    PAYPAL_SECRET: process.env.PAYPAL_SECRET,
  };
  