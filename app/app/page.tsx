import { RenoApp } from '@/components/reno/app/reno-app'

export default async function AppPage({
  searchParams,
}: {
  searchParams: Promise<{ start?: string }>
}) {
  const { start } = await searchParams
  return <RenoApp initialStage={start ? 'onboarding' : 'app'} />
}
