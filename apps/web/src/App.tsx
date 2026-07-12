import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import BreakingNewsStrip from './components/BreakingNewsStrip'
import Home from './pages/Home'
import Section from './pages/Section'
import Article from './pages/Article'
import ReaderLogin from './pages/ReaderLogin'
import ReaderSignup from './pages/ReaderSignup'

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
          <Route path="/login" element={<ReaderLogin />} />
          <Route path="/signup" element={<ReaderSignup />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
