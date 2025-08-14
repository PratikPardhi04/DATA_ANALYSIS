import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  MessageSquare, 
  Send,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Card from '../components/Card'
import Button from '../components/Button'

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      setIsSubmitting(false)
      setSubmitStatus('success')
      setFormData({
        name: '',
        email: '',
        company: '',
        subject: '',
        message: ''
      })
      
      // Reset status after 5 seconds
      setTimeout(() => setSubmitStatus(null), 5000)
    }, 2000)
  }

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: ['hello@datawise.ai', 'support@datawise.ai'],
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: ['+1 (555) 123-4567', '+1 (555) 987-6543'],
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      details: ['123 Data Street', 'San Francisco, CA 94105'],
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Clock,
      title: 'Business Hours',
      details: ['Mon-Fri: 9AM-6PM PST', 'Sat-Sun: 10AM-4PM PST'],
      color: 'from-orange-500 to-red-500'
    }
  ]

  const supportTopics = [
    {
      title: 'Technical Support',
      description: 'Get help with platform features and technical issues',
      icon: MessageSquare,
      color: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Account & Billing',
      description: 'Questions about your account, billing, or subscription',
      icon: MessageSquare,
      color: 'from-green-500 to-emerald-500'
    },
    {
      title: 'Sales & Partnerships',
      description: 'Learn about our enterprise solutions and partnerships',
      icon: MessageSquare,
      color: 'from-purple-500 to-pink-500'
    },
    {
      title: 'Feature Requests',
      description: 'Suggest new features or improvements to our platform',
      icon: MessageSquare,
      color: 'from-orange-500 to-red-500'
    }
  ]

  return (
    <div className="p-6 space-y-12">
      {/* Header */}
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
        >
          Get in Touch
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-300"
        >
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </motion.p>
      </div>

      {/* Contact Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {contactInfo.map((info, index) => {
          const Icon = info.icon
          return (
            <Card key={info.title} className="text-center p-6 group hover:scale-105 transition-transform duration-300">
              <div className={`w-16 h-16 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                {info.title}
              </h3>
              <div className="space-y-1">
                {info.details.map((detail, i) => (
                  <p key={i} className="text-gray-600 dark:text-gray-300 text-sm">
                    {detail}
                  </p>
                ))}
              </div>
            </Card>
          )
        })}
      </motion.div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              Send us a Message
            </h2>
            
            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg flex items-center space-x-3"
              >
                <CheckCircle className="w-5 h-5 text-green-500" />
                <p className="text-green-700 dark:text-green-300">
                  Thank you! Your message has been sent successfully. We'll get back to you soon.
                </p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="input"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Company
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter your company name"
                />
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="input"
                  placeholder="What's this about?"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  className="input resize-none"
                  placeholder="Tell us more about your inquiry..."
                />
              </div>

              <Button
                type="submit"
                loading={isSubmitting}
                icon={Send}
                size="lg"
                className="w-full"
              >
                {isSubmitting ? 'Sending Message...' : 'Send Message'}
              </Button>
            </form>
          </Card>
        </motion.div>

        {/* Support Topics & FAQ */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="space-y-8"
        >
          {/* Support Topics */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              How can we help?
            </h3>
            <div className="space-y-4">
              {supportTopics.map((topic, index) => {
                const Icon = topic.icon
                return (
                  <div
                    key={topic.title}
                    className="p-4 border border-gray-200 dark:border-dark-700 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors duration-200 cursor-pointer group"
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${topic.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                          {topic.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                          {topic.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* FAQ */}
          <Card className="p-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4">
              <div className="border-b border-gray-200 dark:border-dark-700 pb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  How quickly can I get started?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  You can start using DataWise AI immediately after signing up. Our platform is designed to be intuitive and requires no technical setup.
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-700 pb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  What data formats do you support?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  We support CSV, Excel, JSON, and TXT files. Our AI can automatically detect and process most common data formats.
                </p>
              </div>
              <div className="border-b border-gray-200 dark:border-dark-700 pb-4">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Is my data secure?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Absolutely. We use enterprise-grade encryption and follow strict security protocols to ensure your data is always protected.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                  Do you offer custom integrations?
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Yes, we offer custom integrations and API access for enterprise customers. Contact our sales team for more information.
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Office Locations */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <Card className="p-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Our Offices
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                San Francisco
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                123 Data Street<br />
                San Francisco, CA 94105
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                Headquarters
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                New York
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                456 Analytics Ave<br />
                New York, NY 10001
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                East Coast Hub
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                London
              </h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">
                789 Intelligence Rd<br />
                London, UK EC1A 1BB
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                European Office
              </p>
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

export default Contact
