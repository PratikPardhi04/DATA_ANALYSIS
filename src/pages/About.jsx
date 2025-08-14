import { motion } from 'framer-motion'
import { 
  Users, 
  Target, 
  Award, 
  Globe, 
  Zap, 
  Shield, 
  Brain,
  TrendingUp,
  Heart,
  Star
} from 'lucide-react'
import Card from '../components/Card'

const About = () => {
  const stats = [
    { label: 'Active Users', value: '50K+', icon: Users },
    { label: 'Countries', value: '25+', icon: Globe },
    { label: 'Data Processed', value: '1B+', icon: Brain },
    { label: 'Accuracy Rate', value: '99.5%', icon: Award },
  ]

  const values = [
    {
      icon: Target,
      title: 'Innovation',
      description: "We constantly push the boundaries of what's possible with AI and data analytics.",
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Shield,
      title: 'Security',
      description: 'Your data security is our top priority with enterprise-grade encryption and compliance.',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'We build solutions that solve real problems and deliver measurable value.',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: Zap,
      title: 'Performance',
      description: 'Lightning-fast processing and real-time insights when you need them most.',
      color: 'from-yellow-500 to-orange-500'
    }
  ]

  const team = [
    {
      name: 'Dr. Sarah Chen',
      role: 'CEO & Co-founder',
      bio: 'Former Google AI researcher with 15+ years in machine learning and data science.',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Michael Rodriguez',
      role: 'CTO & Co-founder',
      bio: 'Ex-Microsoft engineer specializing in scalable data infrastructure and cloud architecture.',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Emily Johnson',
      role: 'Head of Product',
      bio: 'Product leader with experience at Stripe and Airbnb, focused on user-centric design.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'David Kim',
      role: 'Lead Data Scientist',
      bio: 'PhD in Statistics from Stanford, expert in predictive modeling and AI algorithms.',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face'
    }
  ]

  const milestones = [
    {
      year: '2020',
      title: 'Company Founded',
      description: 'Started with a vision to democratize AI-powered analytics for businesses of all sizes.'
    },
    {
      year: '2021',
      title: 'First Product Launch',
      description: 'Released our core analytics platform with basic AI insights and visualization tools.'
    },
    {
      year: '2022',
      title: 'Series A Funding',
      description: 'Raised $15M to scale our team and expand our product capabilities.'
    },
    {
      year: '2023',
      title: 'Enterprise Launch',
      description: 'Launched enterprise features with advanced security and compliance standards.'
    },
    {
      year: '2024',
      title: 'Global Expansion',
      description: 'Expanded to 25+ countries with localized support and multi-language interface.'
    }
  ]

  return (
    <div className="p-6 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
        >
          About DataWise AI
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl text-gray-600 dark:text-gray-300 mb-8"
        >
          We're on a mission to democratize AI-powered analytics and help businesses make 
          data-driven decisions with confidence. Our platform combines cutting-edge machine 
          learning with intuitive design to transform how organizations understand and act on their data.
        </motion.p>
      </div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="text-center p-6">
              <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-neon-purple rounded-lg flex items-center justify-center mx-auto mb-4">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </p>
            </Card>
          )
        })}
      </motion.div>

      {/* Mission & Vision */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <Card className="p-8 h-full">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center mb-6">
              <Target className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Mission
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              To empower every business with the intelligence they need to thrive in the data-driven economy. 
              We believe that advanced analytics should be accessible, actionable, and affordable for organizations 
              of all sizes.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                Democratize AI-powered analytics
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                Make data insights actionable
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                Drive business transformation
              </li>
            </ul>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          <Card className="p-8 h-full">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center mb-6">
              <TrendingUp className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Our Vision
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              A world where every decision is informed by intelligent data analysis. We envision a future where 
              businesses can predict trends, identify opportunities, and optimize operations with unprecedented precision.
            </p>
            <ul className="space-y-3">
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                Predictive analytics for all
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                Real-time business intelligence
              </li>
              <li className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                <Star className="w-4 h-4 text-yellow-500 mr-2 flex-shrink-0" />
                AI-driven decision making
              </li>
            </ul>
          </Card>
        </motion.div>
      </div>

      {/* Values */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.0 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Values
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            These core values guide everything we do, from product development to customer support.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {values.map((value, index) => {
            const Icon = value.icon
            return (
              <Card key={value.title} className="text-center p-6 group hover:scale-105 transition-transform duration-300">
                <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">
                  {value.description}
                </p>
              </Card>
            )
          })}
        </div>
      </motion.div>

      {/* Team */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.2 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Meet Our Team
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            The brilliant minds behind DataWise AI, dedicated to transforming how businesses use data.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {team.map((member, index) => (
            <Card key={member.name} className="text-center p-6 group hover:scale-105 transition-transform duration-300">
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {member.name}
              </h3>
              <p className="text-primary-600 dark:text-primary-400 text-sm font-medium mb-3">
                {member.role}
              </p>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                {member.bio}
              </p>
            </Card>
          ))}
        </div>
      </motion.div>

      {/* Timeline */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.4 }}
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Our Journey
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            From startup to industry leader, here's how we've grown and evolved over the years.
          </p>
        </div>
        
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-px h-full w-0.5 bg-gray-200 dark:bg-dark-700"></div>
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={milestone.year} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                <div className="w-1/2 px-8">
                  <Card className="p-6">
                    <div className="flex items-center mb-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary-500 to-neon-purple rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold text-sm">{milestone.year}</span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {milestone.title}
                      </h3>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">
                      {milestone.description}
                    </p>
                  </Card>
                </div>
                <div className="w-4 h-4 bg-primary-500 rounded-full border-4 border-white dark:border-dark-900 shadow-lg"></div>
                <div className="w-1/2"></div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default About
