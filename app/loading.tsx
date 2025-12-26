import Image from 'next/image'

export default function Loading() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="mb-6">
        <Image
          src="/logo/neoLogo.png"
          alt="NeoMD Logo"
          width={150}
          height={60}
          priority
          className="object-contain"
        />
      </div>
      <p className="text-xl font-medium animate-pulse">Loading Neo Eligibility...</p>
    </div>
  )
}
