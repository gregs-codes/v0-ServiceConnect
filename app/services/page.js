import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function Services() {
  // Sample services data with various service categories
  const services = [
    {
      id: "electrical",
      title: "Electrical Services",
      description: "Professional electrical installation, repair, and maintenance services.",
      features: [
        "Residential and commercial wiring",
        "Lighting installation and repair",
        "Panel upgrades and circuit installation",
        "Electrical troubleshooting and safety inspections",
      ],
      image: "/electrician-working.png",
    },
    {
      id: "plumbing",
      title: "Plumbing Services",
      description: "Expert plumbing solutions for residential and commercial properties.",
      features: [
        "Pipe installation and repair",
        "Fixture installation and replacement",
        "Drain cleaning and maintenance",
        "Water heater services",
      ],
      image: "/plumber-working.png",
    },
    {
      id: "carpentry",
      title: "Carpentry Services",
      description: "Skilled carpentry work for construction and home improvement projects.",
      features: [
        "Custom furniture and cabinetry",
        "Framing and structural work",
        "Finish carpentry and trim",
        "Deck and fence construction",
      ],
      image: "/carpenter-working.png",
    },
    {
      id: "welding",
      title: "Welding Services",
      description: "Professional welding for industrial, commercial, and residential needs.",
      features: [
        "TIG, MIG, and stick welding",
        "Metal fabrication and repair",
        "Structural and pipe welding",
        "Custom metal projects",
      ],
      image: "/placeholder.svg?key=mbnj8",
    },
    {
      id: "painting",
      title: "Painting Services",
      description: "Professional interior and exterior painting services.",
      features: [
        "Residential and commercial painting",
        "Interior and exterior surfaces",
        "Decorative finishes and textures",
        "Cabinet and furniture refinishing",
      ],
      image: "/painter-at-work.png",
    },
    {
      id: "landscaping",
      title: "Landscaping Services",
      description: "Complete landscaping solutions for beautiful outdoor spaces.",
      features: [
        "Landscape design and installation",
        "Lawn maintenance and care",
        "Hardscaping and outdoor structures",
        "Irrigation systems and water features",
      ],
      image: "/placeholder.svg?key=l93pr",
    },
  ]

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Professional Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform connects you with skilled professionals offering a wide range of services for any project, big
            or small.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h2 className="text-xl font-bold mb-2">{service.title}</h2>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <ul className="mb-6 space-y-2">
                  {service.features.map((feature, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/providers?service=${service.id}`}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors inline-block w-full text-center"
                >
                  Find Service Providers
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Services */}
        <div className="mt-16 bg-blue-700 text-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Need a Specialized Service?</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Can't find what you're looking for? Our network includes professionals with expertise in many specialized
              services. Contact us to discuss your unique project needs.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/contact"
              className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors text-center"
            >
              Contact Us
            </Link>
            <Link
              href="/providers"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors text-center"
            >
              Browse All Providers
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">How do I choose the right service provider?</h3>
              <p className="text-gray-700">
                Consider your specific needs, project requirements, and budget. Our platform allows you to filter
                providers by specialty, location, and ratings to find the perfect match for your project.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">What information should I provide to get an accurate quote?</h3>
              <p className="text-gray-700">
                Include detailed project specifications, timeline, location, and any specific requirements or
                challenges. Photos or drawings are also helpful for service providers to give you an accurate estimate.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Are the service providers on your platform certified?</h3>
              <p className="text-gray-700">
                Many providers on our platform hold various professional certifications. You can filter for certified
                professionals and view their credentials on their profiles.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Can service providers travel to my location?</h3>
              <p className="text-gray-700">
                Yes, many providers offer mobile services. When searching, you can specify your location to find
                professionals who service your area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
