import { Users, Award, Clock, Briefcase } from "lucide-react"

export default function About() {
  // Sample team members data
  const teamMembers = [
    {
      name: "John Smith",
      position: "CEO & Founder",
      bio: "With over 15 years of experience in the industry, John leads our company with vision and expertise.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Sarah Johnson",
      position: "CTO",
      bio: "Sarah brings technical excellence and innovation to our services with her background in software architecture.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      name: "Michael Brown",
      position: "Service Director",
      bio: "Michael ensures our service delivery exceeds client expectations with his attention to detail.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About ServiceConnect</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We connect businesses and individuals with the professional services they need to succeed.
          </p>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                Founded in 2015, ServiceConnect began with a simple mission: to bridge the gap between service providers
                and clients. We recognized the challenges both sides faced in finding the right match for their needs.
              </p>
              <p className="text-gray-700 mb-4">
                What started as a small directory of local services has grown into a comprehensive platform connecting
                thousands of professionals with clients across the country.
              </p>
              <p className="text-gray-700">
                Today, we continue to innovate and expand our offerings, always with our core mission in mind: making
                professional services accessible, transparent, and efficient for everyone.
              </p>
            </div>
            <div className="relative h-80 md:h-96">
              <img
                src="/placeholder.svg?height=400&width=600"
                alt="ServiceConnect team"
                className="rounded-lg shadow-lg object-cover w-full h-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Users className="h-12 w-12 text-blue-700 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">5,000+</h3>
              <p className="text-gray-600">Service Providers</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Briefcase className="h-12 w-12 text-blue-700 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">10,000+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Award className="h-12 w-12 text-blue-700 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">15+</h3>
              <p className="text-gray-600">Industry Awards</p>
            </div>
            <div className="bg-white p-8 rounded-lg shadow-md">
              <Clock className="h-12 w-12 text-blue-700 mx-auto mb-4" />
              <h3 className="text-4xl font-bold mb-2">8</h3>
              <p className="text-gray-600">Years of Experience</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-64 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-1">{member.name}</h3>
                  <p className="text-blue-700 font-medium mb-3">{member.position}</p>
                  <p className="text-gray-600">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <h3 className="text-xl font-bold mb-4">Excellence</h3>
              <p>
                We are committed to excellence in every service we connect you with, ensuring the highest quality
                standards.
              </p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-bold mb-4">Integrity</h3>
              <p>We operate with transparency and honesty in all our dealings with clients and service providers.</p>
            </div>
            <div className="text-center p-6">
              <h3 className="text-xl font-bold mb-4">Innovation</h3>
              <p>
                We continuously seek new ways to improve our platform and the services we offer to meet evolving needs.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
