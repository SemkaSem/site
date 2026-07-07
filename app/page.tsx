import { FloatingCats } from "@/components/floating-cats"
import { InvitationCard } from "@/components/invitation-card"

export default function Page() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-background via-background to-accent/30 p-4">
      <FloatingCats />
      <div className="relative z-10 flex w-full justify-center">
        <InvitationCard />
      </div>
    </main>
  )
}
