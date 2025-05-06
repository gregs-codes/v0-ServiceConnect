import PageHeader from "@/components/page-header"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function ServicesPage() {
  // Sample services data
  const services = [
    {
      id: "plumbing",
      name: "Plumbing",
      description: "Professional plumbing services for residential and commercial properties.",
      image: "/plumbing-tools.png",
      features: [
        "Leak detection and repair",
        "Pipe installation and replacement",
        "Drain cleaning and maintenance",
        "Water heater installation and repair",
        "Fixture installation and repair",
      ],
    },
    {
      id: "electrical",
      name: "Electrical",
      description: "Comprehensive electrical services for all your power needs.",
      image: "/placeholder.svg?key=65r9o",
      features: [
        "Wiring installation and repair",
        "Panel upgrades and replacements",
        "Lighting installation",
        "Outlet and switch installation",
        "Electrical troubleshooting",
      ],
    },
    {
      id: "carpentry",
      name: "Carpentry",
      description: "Custom woodworking and structural carpentry services.",
      image: "/carpentry-workshop.png",
      features: [
        "Custom furniture building",
        "Cabinet installation and repair",
        "Deck and porch construction",
        "Framing and structural repairs",
        "Trim and molding installation",
      ],
    },
    {
      id: "painting",
      name: "Painting",
      description: "Interior and exterior painting services for homes and businesses.",
      image: "/abstract-colorful-painting.png",
      features: [
        "Interior painting",
        "Exterior painting",
        "Cabinet refinishing",
        "Deck and fence staining",
        "Color consultation",
      ],
    },
  ]

  return (
    <main className="min-h-screen">
      <PageHeader
        title="Our Services"
        subtitle="Discover the wide range of professional services available through our platform"
      />

      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 gap-16">
            {services.map((service, index) => (
              <div
                key={service.id}
                className={`grid grid-cols-1 md:grid-cols-2 gap-8 items-center ${
                  index % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className={index % 2 === 1 ? "md:order-2" : ""}>
                  <h2 className="text-3xl font-bold mb-4">{service.name}</h2>
                  <p className="text-gray-700 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-start">
                        <svg
                          className="h-5 w-5 text-blue-700 mr-2 mt-0.5"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`/providers?category=${service.id}`}
                    className="inline-flex items-center text-blue-700 font-medium hover:text-blue-800"
                  >
                    Find {service.name} Professionals
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </div>
                <div className={index % 2 === 1 ? "md:order-1" : ""}>
                  <img
                    src={service.image || "/placeholder.svg"}
                    alt={service.name}
                    className="rounded-lg shadow-lg w-full h-64 md:h-80 object-cover"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
            Find the perfect service professional for your project today.
          </p>
          <Link
            href="/providers"
            className="bg-blue-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-800 transition-colors inline-block"
          >
            Find Service Providers
          </Link>
        </div>
      </section>
    </main>
  )
}
