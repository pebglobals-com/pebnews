import { useState } from 'react'

export default function Advertise() {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const tiers = [
    {
      id: 'sidebar-banner',
      title: 'Sidebar Banner',
      description: 'Eye-catching rectangle sidebar ad',
      price: '$500/month',
      features: [
        'Full width sidebar (300x250)',
        'Rotating monthly placement',
        'Monthly performance report',
        'Dedicated account manager',
      ],
      placements: [
        'Homepage sidebar (left/right)',
        'Section pages sidebar',
      ],
    },
    {
      id: 'homepage-featured',
      title: 'Homepage Featured Slot',
      description: 'Premium homepage positioning',
      price: '$1,500/month',
      features: [
        'Above-the-fold placement',
        'Homepage hero companion',
        'High visibility for 24 hours',
        'Priority rotation in carousel',
        'Full performance analytics',
      ],
      placements: [
        'Homepage hero companion',
        'Breaking News section',
        'Top of homepage story carousel',
      ],
    },
    {
      id: 'breaking-news-sponsor',
      title: 'Breaking News Sponsor',
      description: 'Sponsor breaking news strips',
      price: '$2,000/month',
      features: [
        'Logo + tagline in breaking ticker',
        'Branding across all breaking news',
        'Featured in email newsletter',
        'Prime social media mentions',
        'Custom domain credit',
        'Quarterly reports',
      ],
      placements: [
        'Breaking News Strip (top of site)',
        'Email newsletter header',
        'Social media posts',
        'Custom domain subdomain',
      ],
    },
  ]

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Advertise with PEB News</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Reach our audience of engaged readers with targeted advertising solutions designed for maximum impact and measurable results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        {tiers.map((tier) => (
          <div
            key={tier.id}
            className={`rounded-2xl border-2 border-gray-200 bg-white p-8 transition-all duration-200 hover:shadow-lg ${selectedTier === tier.id ? 'border-amber-500 bg-amber-50' : ''}`}
            onClick={() => setSelectedTier(tier.id)}
          >
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{tier.title}</h3>
              <p className="text-sm text-gray-600 mb-6">{tier.description}</p>
              
              <div className="text-3xl font-bold text-amber-600 mb-6">
                {tier.price}
              </div>
              
              <div className="space-y-3 mb-8">
                {tier.features.map((feature, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-sm text-gray-700">{feature}</span>
                  </div>
                ))}
              </div>
              
              <div className="space-y-2 mb-6">
                <h4 className="text-sm font-semibold text-gray-900">Available Placements:</h4>
                {tier.placements.map((placement, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0" />
                    <span className="text-xs text-gray-600">{placement}</span>
                  </div>
                ))}
              </div>
              
              <button
                className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${selectedTier === tier.id
                  ? 'bg-amber-500 text-white hover:bg-amber-600'
                  : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                }`}
              >
                {selectedTier === tier.id ? 'Selected' : 'Select Package'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-gray-50 rounded-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
        <p className="text-gray-600 mb-6">Contact our sales team to discuss your advertising needs and get a custom quote.</p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="/contact"
            className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors"
          >
            Contact Sales
          </a>
          <a
            href="mailto:sales@pebnews.com"
            className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
          >
            Email: sales@pebnews.com
          </a>
        </div>
      </div>
    </div>
  )
}