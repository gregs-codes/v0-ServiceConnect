import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowRight, Briefcase, MessageSquare, Bell, User } from "lucide-react"

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4">Welcome to ServiceConnect</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Connect with skilled service providers or find clients for your services. Manage projects, communicate, and
          get things done.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <FeatureCard
          icon={<Briefcase className="h-8 w-8" />}
          title="Projects"
          description="Browse available projects or create your own"
          href="/projects"
        />

        <FeatureCard
          icon={<MessageSquare className="h-8 w-8" />}
          title="Messages"
          description="Communicate with clients and service providers"
          href="/messages"
        />

        <FeatureCard
          icon={<Bell className="h-8 w-8" />}
          title="Notifications"
          description="Stay updated with project and message alerts"
          href="/notifications"
        />

        <FeatureCard
          icon={<User className="h-8 w-8" />}
          title="Profile"
          description="Manage your profile and service offerings"
          href="/profile"
        />
      </div>
    </div>
  )
}

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}

function FeatureCard({ icon, title, description, href }: FeatureCardProps) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <div className="bg-primary/10 p-3 rounded-full w-fit mb-4">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter className="mt-auto">
        <Link href={href} className="w-full">
          <Button className="w-full">
            Go to {title}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
