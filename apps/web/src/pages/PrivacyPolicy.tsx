import { Mail, Phone, MapPin, Clock, CheckCircle } from 'lucide-react'

export default function PrivacyPolicy() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">Privacy Policy</h1>
        <p className="mt-4 text-lg text-gray-600">
          Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div className="prose max-w-none text-gray-600">
        <h2 className="text-2xl font-bold text-gray-900">Information We Collect</h2>
        <p>
          We collect information you provide directly to us when you:
        </p>
        <ul>
          <li>Subscribe to our newsletter</li>
          <li>Contact us through our website</li>
          <li>Submit content or comments</li>
          <li>Use or interact with our services</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900">How We Use Your Information</h2>
        <p>
          We use the information we collect to:
        </p>
        <ul>
          <li>Provide and improve our services</li>
          <li>Send you updates and news</li>
          <li>Communicate with you</li>
          <li>Monitor and analyze usage of our services</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900">Data Security</h2>
        <p>
          We take the security of your information seriously and implement appropriate technical and organizational measures to protect it against unauthorized access, disclosure, alteration, or destruction.
        </p>

        <h2 className="text-2xl font-bold text-gray-900">Your Rights</h2>
        <p>
          You have the right to:
        </p>
        <ul>
          <li>Access your personal information</li>
          <li>Corrections to your personal information</li>
          <li>Deletion of your personal information</li>
          <li>Objection to our processing of your personal information</li>
          <li>Data portability</li>
        </ul>

        <h2 className="text-2xl font-bold text-gray-900">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at:
        </p>
        <div className="mt-6 rounded-lg bg-gray-50 p-6">
          <div className="flex items-center gap-3 mb-4">
            <Mail className="h-5 w-5 text-gray-500" />
            <span>privacy@pebnews.com</span>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-gray-500" />
            <span>+234 (0) 800 000 0000</span>
          </div>
        </div>
      </div>
    </div>
  )
}
