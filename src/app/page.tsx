import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function Home() {
  return (
    <main>
      <div className="flex min-w-full min-h-screen flex-col items-start justify-center gap-4 lg:p-24 sm:p-12 p-8">
        <div className="text-2xl md:text-5xl">Free URL Shortener</div>
        <div className="flex min-w-full flex-col md:flex-row items-start justify-between gap-4">
          <Input
            type="url"
            placeholder="Example: https://super-long-link.com/shorten-it"
            className="h-10 text-lg"
          />
          <Button type="submit" size="lg" className="h-10 text-lg">
            Shorten!
          </Button>
        </div>
        <div>TTTTTTTTTTTTTT</div>
      </div>
    </main>
  )
}
