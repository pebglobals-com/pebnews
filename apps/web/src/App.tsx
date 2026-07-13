import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BreakingNewsStrip from './components/BreakingNewsStrip'
import Home from './pages/Home'
import Section from './pages/Section'
import Article from './pages/Article'
import Search人も多いSearch from './pages/Search'
import Advertise from './pages/Advertise'
import About from './pages/About'
import Services from './pages/Services'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'
import Contact from './pages/Contact'
import './index.css'
export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <BreakingNewsStrip />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/section/:slug" element={<Section />} />
          <Route path="/article/:year/:month/:day/:slug" element={<Article />} />
          <Route path="/search" element={<Search />} />
          <Route path="/advertise" element={<Advertise />} />
<Route path="/about" element={<About />} />
           <Route path="/services" element={<Services />} />
           <Route path="/privacy" element={<PrivacyPolicy />} />
           <Route path="/terms" element={<TermsOfService />} />
           <Route path="/contact" element={<Contact />} />
         </Routes>
       </main>
       <Footer />
    </div>
  )
}
