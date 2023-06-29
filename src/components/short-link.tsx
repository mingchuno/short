import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { useCopyToClipboard } from 'usehooks-ts'

type Props = {
  link: string
}

export function ShortLink({ link }: Props) {
  const [value, copy] = useCopyToClipboard()
  if (!link) return null
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="text-xl cursor-pointer hover:text-sky-500" onClick={() => copy(link)}>
            {link}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Click to copy</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
