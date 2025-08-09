// Generate static params for Firebase hosting
export async function generateStaticParams() {
  // Generate some example space IDs for demo purposes
  return [
    { spaceid: 'demo' },
    { spaceid: 'sample' },
    { spaceid: 'example' },
  ]
}

export default function SpaceLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}