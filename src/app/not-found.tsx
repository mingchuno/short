import Image from 'next/image'

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between lg:p-24 sm:p-12 p-8">
      <Image src="/404.jpg" alt="Page Not Found" width={960} height={540}></Image>
    </main>
  )
}
