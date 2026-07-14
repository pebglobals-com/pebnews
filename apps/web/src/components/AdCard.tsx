import { Link } from 'react-router-dom'
import { Crown, TrendingUp, Users, BarChart3, Target, Eye } from 'lucide-react'

interface AdCardProps {
  variant?: 'default' | 'inline'
}

export default function AdCard({ variant = 'default' }: AdCardProps) {
  if (variant === 'inline') {
    return (
      <Link
        to="/advertise"
        className="group relative block cursor-pointer rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-5 shadow-sm transition-all duration-150 hover:scale-[1.01] hover:shadow-md"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            <span className="font-bold text-blue-800">Sponsor Spotlight</span>
          </div>
          <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
            AD
          </span>
        </div>
        <div className="space-y-2">
          <h3 className="text-base font-bold text-gray-900">Support PEB News</h3>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <Eye className="h-4 w-4 text-purple-600" />
              <span>Reach a growing local readership</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <BarChart3 className="h-4 w-4 text-green-600" />
              <span>Affordable rates for every budget</span>
            </div>
          </div>
        </div>
        <div className="mt-3 pt-2 border-t border-blue-200">
          <p className="text-xs text-gray-500">Contact us to discuss your campaign.</p>
        </div>
        <div className="mt-2 flex justify-center">
          <span className="text-xs font-medium text-blue-700 group-hover:text-blue-800">
            Get started &rarr;
          </span>
        </div>
      </Link>
    )
  }

  return (
    <Link
      to="/advertise"
      className="group relative block cursor-pointer rounded-xl border-2 border-amber-400 bg-gradient-to-br from-amber-50 to-yellow-50 p-6 shadow-sm transition-all duration-150 hover:scale-[1.02] hover:shadow-md"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-2">
          <Crown className="h-5 w-5 text-amber-600" />
          <span className="font-bold text-amber-800">Premium Ad Space</span>
        </div>
        <span className="rounded-full bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700">
          AD
        </span>
      </div>
      
      <div className="space-y-3">
        <h3 className="text-lg font-bold text-gray-900">Advertise with PEB News</h3>
        
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <TrendingUp className="h-4 w-4 text-green-600" />
            <span>Reach 100K+ engaged readers</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <Users className="h-4 w-4 text-blue-600" />
            <span>Targeted demographics</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-700">
            <BarChart3 className="h-4 w-4 text-purple-600" />
            <span>Measurable performance</span>
          </div>
        </div>
        
        <div className="mt-4 border-t border-amber-200 pt-3">
          <p className="text-xs text-gray-600">Starting at &#x20A6;500,000/month</p>
          <p className="text-xs text-amber-700 font-medium"> Premium placement available</p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-center">
        <span className="text-xs font-medium text-amber-800 group-hover:text-amber-900">
          View advertising options &rarr;
        </span>
      </div>
    </Link>
  )
}