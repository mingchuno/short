import { Check, Copy, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useCopyToClipboard } from 'usehooks-ts'

type Props = {
  link: string
}

export function ShortLink({ link }: Props) {
  const [, copy] = useCopyToClipboard()
  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    const didCopy = await copy(link)
    if (!didCopy) return
    setCopied(true)
    setTimeout(() => setCopied(false), 1600)
  }

  if (!link) return null

  return (
    <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
      <p className="text-sm font-medium text-emerald-700">Short link ready</p>
      <div className="mt-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <a
          href={link}
          target="_blank"
          rel="noreferrer"
          className="break-all text-lg font-medium text-sky-700 underline decoration-sky-300 underline-offset-4 hover:text-sky-800"
        >
          {link}
        </a>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" variant="secondary" onClick={onCopy}>
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? 'Copied' : 'Copy'}
          </Button>
          <Button asChild type="button" size="sm">
            <a href={link} target="_blank" rel="noreferrer">
              Open
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}
