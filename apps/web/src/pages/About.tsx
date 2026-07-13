import { Users, Award, Target, Globe, Clock, CheckCircle, ArrowRight, Phone, Mail } from 'lucide-react'

export default function About() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">About PEB News</h1>
        <p className="mt-4 text-lg text-gray-600">
          Independent journalism dedicated to serving the communities of the Pacific Northwest
        </p>
      </div>

      {/* Mission */}
      <div className="mb-16 grid gap-8 md:grid-cols-2">
        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
            <Target className="h-6 w-6 text-blue-600" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed">
            To provide unbiased, fact-checked news and storytelling that matters to the people who need it most. We believe in the power of local journalism to hold power accountable, give voice to underserved communities, and build stronger connections across our diverse region.
          </p>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-8">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
            <Users className="h-6 w-6 text-primary-600" />
          </div>
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Our Team</h2>
          <p className="text-gray-600 leading-relaxed">
            A diverse team of professional journalists, editors, and technologists united by a commitment to excellence and the democratic ideal that an informed public is the foundation of a healthy society. Our newsroom operates with integrity, transparency, and a dedication to going beyond the headline.
          </p>
        </div>
      </div>

      {/* Values */}
      <div className="mb-16">
        <h2 className="mb-8 text-3xl font-bold text-gray-900 text-center">Our Values</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-blue-200 bg-blue-50 mx-auto">
              <CheckCircle className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Integrity</h3>
            <p className="text-sm text-gray-600">
              We stick to the facts and maintain editorial independence in all our reporting.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-green-200 bg-green-50 mx-auto">
              <Globe className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Community</h3>
            <p className="text-sm text-gray-600">
              We serve the communities we cover, listening to their voices and amplifying their stories.
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full border-2 border-amber-200 bg-amber-50 mx-auto">
              <Award className="h-8 w-8 text-amber-600" />
            </div>
            <h3 className="mb-2 text-xl font-semibold text-gray-900">Excellence</h3>
            <p className="text-sm text-gray-600">
              We strive for the highest standards in journalism and continuously improve our craft.
            </p>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="rounded-lg bg-gray-50 p-12 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Our Story</h2>
        <div className="mx-auto max-w-2xl space-y-4 text-gray-600">
          <p>
            Founded in 2020, PEB News began as a small team of passionate journalists who saw a need for comprehensive local coverage in an era of declining traditional media presence. What started as a modest operation serving the Pacific Northwest has grown into a trusted source for news, investigation, and community storytelling.
          </p>
          <p>
            Over the years, we've expanded our reach while staying true to our core mission: providing deeply reported, locally relevant news that matters to the everyday person. Today, we serve readers across the region with professional journalism that holds power accountable and gives voice to those often overlooked by larger media outlets.
          </p>
          <p>
            Our commitment to the community is reflected in every decision we make, from our editorial choices to our partnerships and the way we engage with the people we serve. Thank you for being part of our journey and for helping us continue to make a difference.
          </p>
        </div>
      </div>
    </div>
  )
}
