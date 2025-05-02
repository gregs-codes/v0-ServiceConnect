import Link from "next/link"
import { CheckCircle } from "lucide-react"

export default function Services() {
  // Sample services data
  const services = [
    {
      id: "tig-welding",
      title: "TIG Welding",
      description: "Precision welding for thin materials and detailed work.",
      features: [
        "High-quality, clean welds",
        "Ideal for thin materials",
        "Perfect for visible or decorative welds",
        "Works with stainless steel, aluminum, and more",
      ],
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "mig-welding",
      title: "MIG Welding",
      description: "Fast and versatile welding for a wide range of materials and thicknesses.",
      features: [
        "Quick and efficient process",
        "Suitable for various material thicknesses",
        "Less skill required than TIG welding",
        "Great for production and fabrication work",
      ],
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "stick-welding",
      title: "Stick Welding",
      description: "Robust welding method for outdoor and construction applications.",
      features: [
        "Works well in windy or outdoor conditions",
        "Effective on dirty or rusty materials",
        "Ideal for thick materials and structural work",
        "Portable and requires minimal equipment",
      ],
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "flux-core-welding",
      title: "Flux Core Welding",
      description: "Self-shielded welding process ideal for outdoor and windy conditions.",
      features: [
        "No external shielding gas required",
        "Excellent for outdoor welding",
        "Works well on dirty or rusty materials",
        "Good penetration on thick materials",
      ],
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "pipe-welding",
      title: "Pipe Welding",
      description: "Specialized welding for pipes and tubes in various industries.",
      features: [
        "High-pressure pipe systems",
        "Industrial piping installations",
        "Oil and gas pipeline work",
        "Certified pipe welders available",
      ],
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: "structural-welding",
      title: "Structural Welding",
      description: "Heavy-duty welding for construction and building frameworks.",
      features: [
        "Building frameworks and supports",
        "Steel beam construction",
        "Bridge components",
        "Certified structural welders",
      ],
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Welding Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our platform connects you with skilled welders offering a wide range of welding services for any project,
            big or small.
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
                  href={`/welders?service=${service.id}`}
                  className="bg-blue-700 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-800 transition-colors inline-block w-full text-center"
                >
                  Find Welders
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom Services */}
        <div className="mt-16 bg-blue-700 text-white rounded-lg shadow-md p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Need a Custom Welding Service?</h2>
            <p className="text-xl max-w-3xl mx-auto">
              Can't find what you're looking for? Our network includes welders with expertise in specialized and custom
              welding services. Contact us to discuss your unique project needs.
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
              href="/welders"
              className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-700 transition-colors text-center"
            >
              Browse All Welders
            </Link>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">How do I choose the right welding service?</h3>
              <p className="text-gray-700">
                Consider the material type, thickness, and project requirements. Our platform allows you to filter
                welders by specialty to find the perfect match for your project.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">What information should I provide to get an accurate quote?</h3>
              <p className="text-gray-700">
                Include material type and thickness, project dimensions, location, timeline, and any specific
                requirements or challenges. Photos or drawings are also helpful.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Are the welders on your platform certified?</h3>
              <p className="text-gray-700">
                Many welders on our platform hold various certifications. You can filter for certified welders and view
                their credentials on their profiles.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Can welders travel to my location?</h3>
              <p className="text-gray-700">
                Yes, many welders offer mobile services. When searching, you can specify your location to find welders
                who service your area.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
