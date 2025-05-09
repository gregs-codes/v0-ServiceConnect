import Link from "next/link"
import { ArrowRight, CheckCircle } from "lucide-react"
import SearchForm from "@/components/search-form"

export default function Home() {
  // Sample services data
  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies.",
      features: ["Responsive Design", "SEO Optimization", "Fast Loading Times"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      features: ["User-friendly Interface", "Offline Capabilities", "Push Notifications"],
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment services.",
      features: ["Auto-scaling", "High Availability", "Cost Optimization"],
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Connect with the Right Services</h1>
            <p className="text-xl mb-8">Find and connect with professional services tailored to your needs</p>
            <div className="max-w-4xl mx-auto mb-8">
              <SearchForm darkMode={true} />
            </div>
            <Link
              href="/services"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium inline-flex items-center hover:bg-blue-50 transition-colors"
            >
              Explore Services <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
              >
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <ul className="mb-4">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center mb-1 text-gray-700">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${service.id}`}
                    className="text-blue-600 font-medium inline-flex items-center hover:text-blue-800"
                  >
                    Learn more <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Connect with our team to discuss your service needs and how we can help you achieve your goals.
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors"
          >
            Contact Us
          </Link>
        </div>
      </section>
    </main>
  )
}
