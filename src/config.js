module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DB_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET || 'angry-auth-token',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '3h'
}