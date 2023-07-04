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

export const ShortenForm = () => {
  const [shorUrl, setShortUrl] = useState('')
  const [error, setError] = useState()
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<Inputs>()

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    const response = await fetch('/api/v1/shorten', {
      method: 'POST',
      body: JSON.stringify({ longUrl: data.url }),
    })
    const json = await response.json()
    if (json.error) {
      setError(json.error)
    } else if (json.link) {
      setShortUrl(json.link)
      setError(undefined)
    }
  }

  console.log(watch('url')) // watch input value by passing the name of it

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex min-w-full min-h-screen flex-col items-start justify-center gap-4 lg:p-24 sm:p-12 p-8">
        <div className="text-2xl md:text-6xl">Free URL Shortener</div>
        <div className="flex min-w-full flex-col md:flex-row items-start justify-between gap-4">
          <Input
            type="url"
            {...register('url', { required: true })}
            placeholder="Example: https://super-long-link.com/shorten-it"
            className="h-10 text-lg"
          />
          <Button type="submit" size="lg" className="h-10 text-lg" disabled={isSubmitting}>
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Shorten!
          </Button>
        </div>
        {error && <ErrorMessage message={error} />}
        {!error && <ShortLink link={shorUrl} />}
      </div>
    </form>
  )
}
