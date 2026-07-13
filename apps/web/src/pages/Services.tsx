import { Users, Award, Target, Globe, Clock, CheckCircle, ArrowRight, Phone, Mail, Briefcase } from 'lucide-react'

export default function Services() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Our Services</h1>
        <p className="mt-4 text-lg text-gray-600">
          Comprehensive media solutions designed to meet your communication needs
        </p>
      </div>

      {/* Service Tiers */}
      <div className="mb-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Breaking News Coverage</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Real-time breaking news updates with live reporting and rapid response capabilities.
          </p>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>24/7 monitoring and rapid response</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Live updates via mobile app and web</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Multimedia coverage (photos, video, audio)</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Local Correspondent Network</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Network of trusted local correspondents providing hyperlocal coverage and community insights.
          </p>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>640+ community correspondents across the region</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Verified sources and insider access</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Regular community event coverage</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
            <Award className="h-6 w-6 text-amber-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Investigative Reporting</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            In-depth investigative journalism and data-driven reporting on critical issues.
          </p>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Long-form investigative pieces</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Database-driven data journalism</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Cross-platform distribution</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
            <Globe className="h-6 w-6 text-green-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Multi-Platform Distribution</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Strategic distribution across all major platforms and formats.
          </p>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Web and mobile optimization</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Social media integration</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>PDF and print editions</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100">
            <Clock className="h-6 w-6 text-purple-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Continuous Updates</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Real-time updates and breaking news notifications throughout the day.
          </p>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>24/7 newsroom operations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Live weather and traffic updates</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Emergency alerts and notifications</span>
            </li>
          </ul>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
            <Briefcase className="h-6 w-6 text-red-600" />
          </div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">Analytics & Insights</h2>
          <p className="text-sm text-gray-600 leading-relaxed mb-4">
            Data-driven insights and analytics for better decision-making.
          </p>
          <ul className="text-xs text-gray-500 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Reader engagement analytics</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Content performance tracking</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Audience demographics analysis</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Contact Section */}
      <div className="rounded-lg bg-gray-50 p-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Ready to Get Started?</h2>
        <p className="mb-8 text-lg text-gray-600 max-w-2xl mx-auto">
          Contact our team to discuss your media needs and find the perfect solution for your organization.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-3 bg-gray-900 text-white rounded-lg font-medium hover:bg-gray-800 transition-colors flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Call Us: (555) 123-4567
          </button>
          <button className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Mail className="h-5 w-5" />
            Email: info@pebnews.com
          </button>
        </div>
      </div>
    </div>
  )
}
