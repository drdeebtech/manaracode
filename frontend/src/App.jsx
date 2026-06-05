import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Stats from './components/Stats'
import Services from './components/Services'
import TechStack from './components/TechStack'
import Process from './components/Process'
import Testimonials from './components/Testimonials'
import CTA from './components/CTA'
import Footer from './components/Footer'

export default function App() {
  return (
    <div className="font-body">
      <Navbar />
      <Hero />
      <Stats />
      <Services />
      <TechStack />
      <Process />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  )
}
