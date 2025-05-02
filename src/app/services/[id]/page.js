import Link from "next/link"
import { ArrowLeft, CheckCircle } from "lucide-react"

// This would typically come from a database or API
const getServiceById = (id) => {
  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies.",
      longDescription:
        "Our web development services include everything from simple landing pages to complex web applications. We use the latest technologies and frameworks to ensure your website is fast, responsive, and user-friendly.",
      features: [
        "Responsive design for all devices",
        "SEO optimization",
        "Fast loading times",
        "Content management systems",
        "E-commerce functionality",
        "Custom web applications",
      ],
      process: [
        "Requirements gathering and analysis",
        "Design and prototyping",
        "Development and coding",
        "Testing and quality assurance",
        "Deployment and launch",
        "Maintenance and support",
      ],
      image: "/placeholder.svg?height=500&width=800",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      longDescription:
        "We develop high-quality mobile applications for both iOS and Android platforms. Whether you need a native app or a cross-platform solution, our team has the expertise to bring your app idea to life.",
      features: [
        "Native iOS and Android apps",
        "Cross-platform solutions",
        "User-friendly interfaces",
        "Offline capabilities",
        "Push notifications",
        "Integration with device features",
      ],
      process: [
        "App concept and strategy",
        "UI/UX design",
        "App development",
        "Testing on multiple devices",
        "App store submission",
        "Post-launch support and updates",
      ],
      image: "/placeholder.svg?height=500&width=800",
    },
    {
      id: 3,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment services.",
      longDescription:
        "Our cloud solutions help businesses leverage the power of cloud computing. From infrastructure setup to deployment and maintenance, we provide comprehensive cloud services to optimize your operations.",
      features: [
        "Cloud infrastructure setup",
        "Auto-scaling configurations",
        "High availability architecture",
        "Cost optimization",
        "Security and compliance",
        "Disaster recovery planning",
      ],
      process: [
        "Cloud readiness assessment",
        "Migration planning",
        "Infrastructure setup",
        "Data migration",
        "Testing and validation",
        "Ongoing management and optimization",
      ],
      image: "/placeholder.svg?height=500&width=800",
    },
  ]

  return services.find((service) => service.id === Number.parseInt(id))
}

export default function ServiceDetail({ params }) {
  const service = getServiceById(params.id)

  if (!service) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-6">Service Not Found</h1>
          <p className="mb-6">The service you're looking for doesn't exist or has been removed.</p>
          <Link href="/services" className="text-blue-600 font-medium hover:text-blue-800">
            Back to Services
          </Link>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <Link href="/services" className="inline-flex items-center text-blue-600 font-medium mb-8 hover:text-blue-800">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Services
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{service.title}</h1>
            <p className="text-xl text-gray-600 mb-6">{service.description}</p>
            <p className="text-gray-700 mb-8">{service.longDescription}</p>

            <h2 className="text-2xl font-bold mb-4">Key Features</h2>
            <ul className="mb-8">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start mb-3">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <img
              src={service.image || "/placeholder.svg"}
              alt={service.title}
              className="w-full h-auto rounded-lg shadow-lg"
            />
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-8 mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Process</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {service.process.map((step, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-md">
                <div className="bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center mb-4">
                  {index + 1}
                </div>
                <p className="font-medium">{step}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-700 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-lg mb-6">
            Contact us today to discuss your project and how we can help you achieve your goals.
          </p>
          <Link
            href="/contact"
            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-medium hover:bg-blue-50 transition-colors inline-block"
          >
            Contact Us
          </Link>
        </div>
      </div>
    </main>
  )
}
