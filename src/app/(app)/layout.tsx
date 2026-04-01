import BottomNavWrapper from '@/components/BottomNavWrapper'
import CoachBubble from '@/components/CoachBubble'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CoachBubble />
      <BottomNavWrapper />
    </>
  )
}
