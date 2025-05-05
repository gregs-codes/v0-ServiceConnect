import Link from "next/link"
import MainNav from "@/components/main-nav"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function SiteHeader() {
  // In a real app, this would come from authentication
  const user = {
    name: "Mike Johnson",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="font-bold text-xl">ServiceConnect</span>
          </Link>
          <MainNav />
        </div>

        <div className="flex items-center gap-4">
          <Button asChild variant="outline">
            <Link href="/projects/create">Post a Project</Link>
          </Button>

          <Link href="/profile">
            <Avatar>
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
              <AvatarFallback>MJ</AvatarFallback>
            </Avatar>
          </Link>
        </div>
      </div>
    </header>
  )
}
