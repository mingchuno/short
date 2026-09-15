import { beforeEach, describe, expect, it, vi } from 'vitest'

const db = vi.hoisted(() => ({ get: vi.fn(), query: vi.fn(), put: vi.fn() }))
vi.mock('@/lib/config', () => ({ isDev: false, tableName: 'test-short-links' }))
vi.mock('@aws-sdk/client-dynamodb', () => ({ DynamoDBClient: class {} }))
vi.mock('@aws-sdk/lib-dynamodb', () => ({ DynamoDBDocument: { from: () => db } }))

import { createShortenUrl, getUrlById, getUrlByLongUrl } from './index'

const record = {
  id: 'abcdefghi',
  longUrl: 'https://example.com/?a=b',
  link: 'https://sho.rt/abcdefghi',
}

describe('short URL persistence', () => {
  beforeEach(() => {
    db.get.mockReset()
    db.query.mockReset()
    db.put.mockReset()
  })

  it('looks up a record by its primary key', async () => {
    db.get.mockResolvedValue({ Item: record })

    await expect(getUrlById(record.id)).resolves.toEqual(record)
    expect(db.get).toHaveBeenCalledExactlyOnceWith({
      TableName: 'test-short-links',
      Key: { id: record.id },
    })
  })

  it('returns undefined for a missing primary key', async () => {
    db.get.mockResolvedValue({})
    await expect(getUrlById('missing01')).resolves.toBeUndefined()
  })

  it('queries the long URL index and returns the first matching record', async () => {
    db.query.mockResolvedValue({ Items: [record, { ...record, id: 'another01' }] })

    await expect(getUrlByLongUrl(record.longUrl)).resolves.toEqual(record)
    expect(db.query).toHaveBeenCalledExactlyOnceWith({
      TableName: 'test-short-links',
      IndexName: 'long-url-index',
      ExpressionAttributeValues: { ':longUrl': record.longUrl },
      KeyConditionExpression: 'longUrl = :longUrl',
    })
  })

  it.each([{}, { Items: [] }])(
    'returns undefined when the query has no matches: %j',
    async (result) => {
      db.query.mockResolvedValue(result)
      await expect(getUrlByLongUrl(record.longUrl)).resolves.toBeUndefined()
    }
  )

  it('persists the complete record in the configured table', async () => {
    db.put.mockResolvedValue({})
    await createShortenUrl(record)
    expect(db.put).toHaveBeenCalledExactlyOnceWith({ TableName: 'test-short-links', Item: record })
  })

  it.each(['get', 'query', 'put'] as const)('propagates %s failures', async (operation) => {
    const error = new Error('database unavailable')
    db[operation].mockRejectedValue(error)
    const actions = {
      get: () => getUrlById(record.id),
      query: () => getUrlByLongUrl(record.longUrl),
      put: () => createShortenUrl(record),
    }
    await expect(actions[operation]()).rejects.toBe(error)
  })
})
