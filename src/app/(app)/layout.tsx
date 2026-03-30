import BottomNavWrapper from '@/components/BottomNavWrapper'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <BottomNavWrapper />
    </>
  )
}
