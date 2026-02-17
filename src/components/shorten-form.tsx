'use client'

import { Loader2 } from 'lucide-react'
import { useForm, SubmitHandler } from 'react-hook-form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { ShortLink } from '@/components/short-link'
import { ErrorMessage } from '@/components/error-message'

type Inputs = {
  url: string
}

type ApiError = {
  error?: string | { message?: string; issues?: Array<{ message?: string }> }
}

const validateUrl = (value: string) => {
  if (!value.trim()) return 'URL is required'
  try {
    const parsedUrl = new URL(value)
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return 'URL must start with http:// or https://'
    }
    return true
  } catch {
    return 'Enter a valid URL'
  }
}

const extractErrorMessage = (payload: ApiError | null, status: number) => {
  if (typeof payload?.error === 'string') {
    return status === 429 ? 'Rate limit reached. Please wait a few seconds and retry.' : payload.error
  }
  if (payload?.error && typeof payload.error === 'object') {
    if (payload.error.issues?.[0]?.message) {
      return payload.error.issues[0].message
    }
    if (payload.error.message) {
      return payload.error.message
    }
  }
  if (status === 429) {
    return 'Rate limit reached. Please wait a few seconds and retry.'
  }
  return 'Unable to shorten this URL right now. Please try again.'
}

export const ShortenForm = () => {
  const [shortUrl, setShortUrl] = useState('')
  const [submitError, setSubmitError] = useState<string | undefined>(undefined)
  const {
    register,
    handleSubmit,
    formState: { isSubmitting, errors, isValid },
  } = useForm<Inputs>({ mode: 'onChange' })

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setSubmitError(undefined)
    setShortUrl('')
    try {
      const response = await fetch('/api/v1/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ longUrl: data.url }),
      })

      let json: ApiError | { link?: string } | null = null
      try {
        json = await response.json()
      } catch {
        json = null
      }

      if (!response.ok) {
        setSubmitError(extractErrorMessage(json as ApiError | null, response.status))
        return
      }

      if (json && 'link' in json && typeof json.link === 'string') {
        setShortUrl(json.link)
        return
      }

      setSubmitError('Unexpected server response. Please try again.')
    } catch {
      setSubmitError('Network error. Check your connection and try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="relative z-10">
      <section className="mx-auto flex min-h-screen w-full max-w-4xl items-center px-4 py-10 sm:px-10">
        <div className="w-full rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-sky-600">Short</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            Share cleaner links in seconds
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg">
            Paste a long URL and generate a short, shareable link with one click.
          </p>

          <div className="mt-8 space-y-3">
            <label htmlFor="url" className="block text-sm font-medium text-slate-700">
              Long URL
            </label>
            <div className="flex min-w-full flex-col gap-3 md:flex-row md:items-start">
              <Input
                id="url"
                type="url"
                inputMode="url"
                autoComplete="url"
                placeholder="https://super-long-link.com/shorten-it"
                aria-invalid={errors.url ? 'true' : 'false'}
                {...register('url', { validate: validateUrl })}
                className="h-11 border-slate-300 text-base"
              />
              <Button
                type="submit"
                size="lg"
                className="h-11 w-full text-base md:w-auto md:min-w-[11rem]"
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Shortening...
                  </>
                ) : (
                  'Shorten URL'
                )}
              </Button>
            </div>
            <p className="min-h-5 text-sm text-slate-600">
              {errors.url?.message || 'Use a full URL, including http:// or https://'}
            </p>
          </div>

          <div className="mt-5 min-h-24" aria-live="polite">
            {submitError ? <ErrorMessage message={submitError} /> : <ShortLink link={shortUrl} />}
          </div>
        </div>
      </section>
    </form>
  )
}
