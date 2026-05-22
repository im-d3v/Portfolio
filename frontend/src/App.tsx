import { ThemeProvider, useTheme } from '@/providers/ThemeProvider'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { ScrollProgress } from '@/components/ui/ScrollProgress'
import { Terminal } from '@/components/ui/Terminal'
import { ShortcutOverlay } from '@/components/ui/ShortcutOverlay'
import { SectionRail } from '@/components/ui/SectionRail'
import { Hero } from '@/components/sections/Hero'
import { About } from '@/components/sections/About'
import { TechStack } from '@/components/sections/TechStack'
import { Projects } from '@/components/sections/Projects'
import { Experience } from '@/components/sections/Experience'
import { ArchitectureDiagram } from '@/components/sections/ArchitectureDiagram'
import { Philosophy } from '@/components/sections/Philosophy'
import { Contact } from '@/components/sections/Contact'

function Divider() {
  return (
    <div className="max-w-6xl mx-auto px-6">
      <div className="h-px bg-border/[0.055]" />
    </div>
  )
}

function AppContent() {
  const { toggle } = useTheme()
  return (
    <div className="min-h-screen bg-primary text-content antialiased">
      <ScrollProgress />
      <Navbar />
      <SectionRail />
      <main>
        <Hero />
        <Divider />
        <About />
        <Divider />
        <TechStack />
        <Divider />
        <Projects />
        <Divider />
        <Experience />
        <Divider />
        <ArchitectureDiagram />
        <Divider />
        <Philosophy />
        <Divider />
        <Contact />
      </main>
      <Footer />
      <Terminal onToggleTheme={toggle} />
      <ShortcutOverlay />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
