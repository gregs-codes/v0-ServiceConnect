"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Send } from "lucide-react"

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    try {
      // In a real app, you would send the data to your API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setSubmitMessage({
        type: "success",
        text: "Your message has been sent successfully! We will get back to you soon.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setSubmitMessage({
        type: "error",
        text: "There was an error sending your message. Please try again.",
      })
    } finally {
      setIsSubmitting(false)

      // Clear message after 5 seconds
      setTimeout(() => {
        setSubmitMessage(null)
      }, 5000)
    }
  }

  return (
    <main className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-12">Contact Us</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="bg-blue-700 text-white rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Get in Touch</h2>
            <p className="mb-8">
              Have questions about our services? Need help finding the right welder? Fill out the form or contact us
              directly using the information below.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin className="h-6 w-6 mr-4 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Our Location</h3>
                  <p>123 Welding Street, Metal City, MC 12345</p>
                </div>
              </div>

              <div className="flex items-start">
                <Phone className="h-6 w-6 mr-4 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p>(123) 456-7890</p>
                </div>
              </div>

              <div className="flex items-start">
                <Mail className="h-6 w-6 mr-4 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p>info@welderfinder.com</p>
                </div>
              </div>
            </div>

            <div className="mt-12">
              <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
              <p className="mb-2">Monday - Friday: 9:00 AM - 5:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

            {submitMessage && (
              <div
                className={`p-4 mb-6 rounded-md ${submitMessage.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
              >
                {submitMessage.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="phone" className="block text-gray-700 font-medium mb-2">
                  Your Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  rows="5"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center w-full hover:bg-blue-800 transition-colors disabled:bg-blue-400"
              >
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    Send Message <Send className="ml-2 h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}
