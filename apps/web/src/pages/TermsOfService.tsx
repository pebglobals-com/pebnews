import { Mail, Phone, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react'

export default function TermsOfService() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Terms of Service</h1>
        <p className="mt-4 text-lg text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-gray-900">Acceptance of Terms</h2>
        <p>
          By accessing and using PEB News website and services, you acknowledge and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">User Accounts</h2>
        <p>
          When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and for all activities that occur under your account.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">Content Guidelines</h2>
        <p>
          Our platform is intended for lawful, respectful communication. You agree not to:
        </p>
        <ul>
          <li>Post content that is illegal, harmful, threatening, abusive, harassing, defamatory, or obscene</li>
          <li>Impersonate any person or entity</li>
          <li>Collect or store personal information about others without consent</li>
          <li>Interfere with or disrupt the integrity of our systems</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900">Intellectual Property</h2>
        <p>
          All content on PEB News, including text, graphics, logos, and software, is the property of PEB News or our licensors and is protected by copyright and other intellectual property laws.
        </p>

        <h2 className="text-al font-bold text-gray-900">Limitation of Liability</h2>
        <p>
          PEB News shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law provisions.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. We will provide notice of significant changes through our website or by other means.
        </p>
      </div>
    </div>
  )
}
