import Link from "next/link"
import SearchForm from "@/components/search-form"
import { Briefcase, MessageSquare, Bell, User } from "lucide-react"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Blue Background */}
      <section className="bg-blue-700 text-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">Find the Right Service Provider</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Connect with qualified professionals for your home, business, or personal projects
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <SearchForm darkMode={true} />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Search</h3>
              <p className="text-gray-600">
                Enter your location and service requirements to find qualified professionals near you.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Compare</h3>
              <p className="text-gray-600">
                Review profiles, ratings, and portfolios to find the perfect provider for your project.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-xl font-bold">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Connect</h3>
              <p className="text-gray-600">
                Book your service provider, communicate directly, and get your project completed with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Providers</h2>
            <Link href="/providers" className="text-blue-700 hover:text-blue-800 font-medium">
              View all providers
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Provider cards will be dynamically generated here */}
            {/* Placeholder cards for now */}
            <ProviderCard name="John Smith" category="Plumbing" image="/professional-plumber.png" verified={true} />
            <ProviderCard
              name="Sarah Johnson"
              category="Electrical"
              image="/electrician-working.png"
              verified={true}
            />
            <ProviderCard name="Mike Wilson" category="Carpentry" image="/carpenter-working.png" verified={false} />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose ServiceConnect</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon={<Briefcase className="h-8 w-8" />}
              title="Verified Professionals"
              description="All service providers are thoroughly vetted and verified"
            />
            <FeatureCard
              icon={<MessageSquare className="h-8 w-8" />}
              title="Direct Communication"
              description="Message providers directly through our platform"
            />
            <FeatureCard
              icon={<Bell className="h-8 w-8" />}
              title="Project Updates"
              description="Get real-time updates on your ongoing projects"
            />
            <FeatureCard
              icon={<User className="h-8 w-8" />}
              title="Trusted Reviews"
              description="Read honest reviews from verified customers"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function ProviderCard({ name, category, image, verified }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img src={image || "/placeholder.svg"} alt={name} className="w-full h-48 object-cover" />
        {verified && (
          <div className="absolute top-2 right-2 bg-blue-700 text-white text-xs px-2 py-1 rounded-full flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
            Verified
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-gray-600">{category}</p>
        <div className="mt-4">
          <Link
            href={`/providers/${name.toLowerCase().replace(/\s+/g, "-")}`}
            className="text-blue-700 hover:text-blue-800 font-medium"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="bg-blue-100 text-blue-700 p-3 rounded-full w-fit mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
    </Card>
  )
}
