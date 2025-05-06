export default function PageHeader({ title, subtitle, children }) {
  return (
    <section className="bg-blue-700 text-white py-16">
      <div className="container mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{title}</h1>
        {subtitle && <p className="text-xl max-w-3xl mx-auto mb-6">{subtitle}</p>}
        {children}
      </div>
    </section>
  )
}
