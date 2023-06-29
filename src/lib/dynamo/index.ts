// import 'server-only'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb'
import { fromIni } from '@aws-sdk/credential-provider-ini'
import { type ShortenRespone } from '@/lib/model/shorten'
import { isDev, tableName } from '@/lib/config'

const useProfileCredentials =
  isDev && !process.env.APP_AWS_ACCESS_KEY_ID && !process.env.APP_AWS_SECRET_ACCESS_KEY

const dynamoClient = new DynamoDBClient({
  region: process.env.APP_AWS_REGION,
  credentials: useProfileCredentials
    ? fromIni({ profile: process.env.DEV_AWS_PROFILE })
    : {
        accessKeyId: process.env.APP_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.APP_AWS_SECRET_ACCESS_KEY || '',
        sessionToken: process.env.APP_AWS_SESSION_TOKEN,
      },
})

const ddbDocClient = DynamoDBDocument.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
})

export async function getUrlById(id: string): Promise<ShortenRespone> {
  const resp = await ddbDocClient.get({
    Key: { id },
    TableName: tableName,
  })
  return resp.Item as ShortenRespone
}

export async function createShortenUrl(payload: ShortenRespone) {
  const params = {
    TableName: tableName,
    Item: payload,
  }
  return ddbDocClient.put(params)
}
