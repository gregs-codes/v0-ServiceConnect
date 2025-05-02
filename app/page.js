import Link from "next/link"
import WelderCard from "@/components/welder-card"
import SearchForm from "@/components/search-form"

export default function Home() {
  // Sample featured welders data
  const featuredWelders = [
    {
      id: 1,
      name: "John Smith",
      location: "New York, NY",
      rating: 4.9,
      specialties: ["TIG Welding", "MIG Welding", "Pipe Welding"],
      hourlyRate: 75,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
    },
    {
      id: 2,
      name: "Sarah Johnson",
      location: "Los Angeles, CA",
      rating: 4.8,
      specialties: ["Structural Welding", "Aluminum Welding"],
      hourlyRate: 65,
      image: "/placeholder.svg?height=300&width=300",
      verified: true,
    },
    {
      id: 3,
      name: "Michael Brown",
      location: "Chicago, IL",
      rating: 4.7,
      specialties: ["Sheet Metal Welding", "Stainless Steel Welding"],
      hourlyRate: 70,
      image: "/placeholder.svg?height=300&width=300",
      verified: false,
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Find Expert Welders Near You</h1>
            <p className="text-xl mb-8">Connect with skilled welding professionals for your projects, big or small</p>

            {/* Search Form */}
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <SearchForm />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-2">Search</h3>
              <p className="text-gray-600">
                Enter your location and welding requirements to find qualified professionals near you.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-2">Compare</h3>
              <p className="text-gray-600">
                Review profiles, ratings, and portfolios to find the perfect welder for your project.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="bg-blue-700 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-2">Connect</h3>
              <p className="text-gray-600">
                Book your welder, communicate directly, and get your project completed with confidence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Welders */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-3xl font-bold">Featured Welders</h2>
            <Link href="/welders" className="text-blue-700 font-medium hover:text-blue-800">
              View all welders
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredWelders.map((welder) => (
              <WelderCard key={welder.id} welder={welder} />
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Welding Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: "TIG Welding", icon: "🔥" },
              { name: "MIG Welding", icon: "⚡" },
              { name: "Stick Welding", icon: "🔌" },
              { name: "Flux Core Welding", icon: "🧵" },
              { name: "Pipe Welding", icon: "🔄" },
              { name: "Structural Welding", icon: "🏗️" },
              { name: "Aluminum Welding", icon: "🔧" },
              { name: "Stainless Steel Welding", icon: "✨" },
            ].map((service, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
                <div className="text-3xl mb-3">{service.icon}</div>
                <h3 className="text-lg font-bold">{service.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                name: "Robert Johnson",
                text: "Found an excellent welder for my custom motorcycle frame. Professional work and completed on time.",
                rating: 5,
              },
              {
                name: "Emily Davis",
                text: "The platform made it easy to find a specialized welder for my art installation. Great experience!",
                rating: 5,
              },
              {
                name: "David Wilson",
                text: "Quick response and quality work on my industrial equipment repair. Will definitely use again.",
                rating: 4,
              },
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="flex text-yellow-400 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>{i < testimonial.rating ? "★" : "☆"}</span>
                  ))}
                </div>
                <p className="text-gray-700 mb-4">"{testimonial.text}"</p>
                <p className="font-bold">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Find Your Welder?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of customers who have found skilled welders for their projects.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/welders"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              Find Welders
            </Link>
            <Link
              href="/signup"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors"
            >
              Join as a Welder
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
