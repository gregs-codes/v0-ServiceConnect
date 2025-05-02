import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function Services() {
  // Sample services data
  const services = [
    {
      id: 1,
      title: "Web Development",
      description: "Custom websites and web applications built with modern technologies.",
      longDescription:
        "Our web development services include everything from simple landing pages to complex web applications. We use the latest technologies and frameworks to ensure your website is fast, responsive, and user-friendly.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 2,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications for iOS and Android.",
      longDescription:
        "We develop high-quality mobile applications for both iOS and Android platforms. Whether you need a native app or a cross-platform solution, our team has the expertise to bring your app idea to life.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 3,
      title: "Cloud Solutions",
      description: "Scalable cloud infrastructure and deployment services.",
      longDescription:
        "Our cloud solutions help businesses leverage the power of cloud computing. From infrastructure setup to deployment and maintenance, we provide comprehensive cloud services to optimize your operations.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 4,
      title: "UI/UX Design",
      description: "User-centered design services for digital products.",
      longDescription:
        "Our design team creates intuitive and engaging user interfaces that enhance user experience. We follow a user-centered design approach to ensure your digital products are both beautiful and functional.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 5,
      title: "Digital Marketing",
      description: "Comprehensive digital marketing strategies to grow your business.",
      longDescription:
        "Our digital marketing services help you reach your target audience and grow your business online. From SEO and content marketing to social media and paid advertising, we develop strategies tailored to your goals.",
      image: "/placeholder.svg?height=300&width=500",
    },
    {
      id: 6,
      title: "IT Consulting",
      description: "Expert advice on technology strategy and implementation.",
      longDescription:
        "Our IT consulting services provide expert guidance on technology strategy, selection, and implementation. We help businesses make informed decisions about their technology investments to drive growth and efficiency.",
      image: "/placeholder.svg?height=300&width=500",
    },
  ]

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-6">Our Services</h1>
        <p className="text-xl text-center text-gray-600 mb-12 max-w-3xl mx-auto">
          We offer a wide range of professional services to meet your business needs. Browse our services below or
          contact us for a custom solution.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img src={service.image || "/placeholder.svg"} alt={service.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <p className="text-gray-700 mb-4">{service.longDescription}</p>
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
    </main>
  )
}
