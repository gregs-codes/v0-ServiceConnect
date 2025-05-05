import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Briefcase, MessageSquare, User } from "lucide-react"

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">Connect with Skilled Service Providers</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Find reliable professionals for your projects or offer your services to clients in need.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-blue-700 hover:bg-gray-100">
              <Link href="/providers">Find Providers</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-blue-800">
              <Link href="/projects">Browse Projects</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Everything You Need in One Place</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Service Providers</CardTitle>
                <CardDescription>Find skilled professionals for any job</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Browse our directory of verified service providers with ratings and reviews from real clients.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/providers">Find Providers</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <Briefcase className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Projects</CardTitle>
                <CardDescription>Post jobs or find work opportunities</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create project listings to find the right professional or browse available jobs to offer your
                  services.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/projects">Browse Projects</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <MessageSquare className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Messaging</CardTitle>
                <CardDescription>Communicate directly with clients and providers</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our built-in messaging system makes it easy to discuss project details, send files, and stay in touch.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/dashboard?tab=messages">View Messages</Link>
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <User className="h-10 w-10 text-blue-700 mb-2" />
                <CardTitle>Profile</CardTitle>
                <CardDescription>Showcase your skills and experience</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Build a comprehensive profile with your certifications, portfolio, and client reviews to stand out.
                </p>
              </CardContent>
              <CardFooter>
                <Button asChild variant="ghost" className="w-full">
                  <Link href="/profile">My Profile</Link>
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Dashboard CTA */}
      <section className="py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Access your personalized dashboard to manage your projects, messages, and notifications in one place.
          </p>
          <Button asChild size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  )
}
