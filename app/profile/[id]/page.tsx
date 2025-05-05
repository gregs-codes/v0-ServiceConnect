import { createServerClient } from "@/utils/supabase/server"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface ProfilePageProps {
  params: {
    id: string
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = params
  const supabase = createServerClient()

  // Fetch user and profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select(`
      *,
      users:user_id(
        id,
        first_name,
        last_name,
        email,
        avatar_url
      )
    `)
    .eq("id", id)
    .single()

  if (error || !profile) {
    notFound()
  }

  // Fetch certifications
  const { data: certifications } = await supabase
    .from("certifications")
    .select("*")
    .eq("profile_id", id)
    .order("issue_date", { ascending: false })

  // Fetch services
  const { data: services } = await supabase
    .from("provider_services")
    .select(`
      *,
      service_categories(
        name,
        icon
      )
    `)
    .eq("provider_id", id)

  const user = profile.users

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <Card>
            <CardHeader className="text-center">
              <Avatar className="w-24 h-24 mx-auto">
                <AvatarImage src={user.avatar_url || ""} alt={`${user.first_name} ${user.last_name}`} />
                <AvatarFallback className="text-2xl">
                  {user.first_name[0]}
                  {user.last_name[0]}
                </AvatarFallback>
              </Avatar>
              <CardTitle className="mt-4">
                {user.first_name} {user.last_name}
              </CardTitle>
              {profile.is_service_provider && (
                <div className="flex items-center justify-center mt-2">
                  <Badge variant="secondary">Service Provider</Badge>
                </div>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.average_rating && (
                  <div className="flex items-center justify-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < Math.round(profile.average_rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }
                        />
                      ))}
                    </div>
                    <span className="ml-2 text-sm">
                      {profile.average_rating.toFixed(1)} ({profile.total_reviews} reviews)
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t">
                  <h3 className="font-medium mb-2">Contact Information</h3>
                  <p className="text-sm text-gray-500">{user.email}</p>
                  {profile.phone && <p className="text-sm text-gray-500">{profile.phone}</p>}
                  {profile.location && <p className="text-sm text-gray-500">{profile.location}</p>}
                  {profile.website && (
                    <p className="text-sm">
                      <a
                        href={profile.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        Website
                      </a>
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">{profile.bio}</p>
            </CardContent>
          </Card>

          {profile.is_service_provider && services && services.length > 0 && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Services</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {services.map((service) => (
                    <div key={service.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <div className="flex justify-between">
                        <h3 className="font-medium">{service.service_categories.name}</h3>
                        {service.hourly_rate && <span className="font-medium">${service.hourly_rate}/hr</span>}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{service.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {service.years_experience && (
                          <Badge variant="outline">{service.years_experience} years experience</Badge>
                        )}
                        {service.is_certified && <Badge variant="secondary">Certified</Badge>}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {certifications && certifications.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Certifications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {certifications.map((cert) => (
                    <div key={cert.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                      <h3 className="font-medium">{cert.name}</h3>
                      <p className="text-sm text-gray-500">
                        {cert.issuing_organization} • {new Date(cert.issue_date).getFullYear()}
                        {cert.expiry_date && ` - ${new Date(cert.expiry_date).getFullYear()}`}
                      </p>
                      {cert.credential_id && (
                        <p className="text-xs text-gray-500 mt-1">Credential ID: {cert.credential_id}</p>
                      )}
                      {cert.credential_url && (
                        <a
                          href={cert.credential_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        >
                          View Credential
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
