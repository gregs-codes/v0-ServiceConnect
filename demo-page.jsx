import ServiceCard from "./service-card"

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-md mx-auto mb-8">
        <h1 className="text-2xl font-bold text-center mb-2">ServiceConnect Preview</h1>
        <p className="text-gray-600 text-center">Connect with skilled professionals for all your service needs</p>
      </div>

      <ServiceCard />
    </div>
  )
}
