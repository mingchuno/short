// import 'server-only'

export const isDev = process.env.VERCEL_ENV === 'development'

export const tableName = process.env.APP_DYNAMODB_TABLE_NAME

export const appDomain = process.env.APP_DOMAIN