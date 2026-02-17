import { ShortenForm } from '@/components/shorten-form'

export default function Home() {
  return (
    <main className="relative isolate min-h-screen overflow-hidden bg-slate-100">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(56,189,248,0.25),transparent_42%),radial-gradient(circle_at_85%_18%,rgba(14,165,233,0.2),transparent_35%),linear-gradient(180deg,#f8fafc_0%,#eef4ff_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-cyan-200/40 blur-3xl"
      />
      <ShortenForm />
    </main>
  )
}
