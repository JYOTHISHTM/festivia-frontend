

import React, { useState, useEffect } from 'react';
import { Calendar, Users, MapPin, Mail, Phone, ChevronRight, Menu, X, PartyPopper, Music, Camera, Utensils, Star, Clock } from 'lucide-react';
import { useNavigate } from 'react-router';

function LandingPage() {
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [hoveredService, setHoveredService] = useState<number | null>(null);
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const services = [
    { icon: PartyPopper, title: 'Event Planning', desc: 'Comprehensive event planning and coordination services' },
    { icon: Music, title: 'Entertainment', desc: 'Top-tier entertainment and music arrangements' },
    { icon: Camera, title: 'Photography', desc: 'Professional photography and videography services' },
    { icon: Utensils, title: 'Catering', desc: 'Exquisite catering and beverage services' }
  ];

  const parallaxOffset = -scrollY * 0.5;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f0fdf4] to-white">
      {/* Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-white/90 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center group">
              <div className="relative">
                <Calendar className="h-8 w-8 text-green-600 transform group-hover:rotate-12 transition-transform" />
                <div className="absolute -inset-1 bg-green-100 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
              </div>
              <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-500 bg-clip-text text-transparent">
                FESTIVIA
              </span>
            </div>

            {/* Desktop Menu */}
            <div className=" md:flex items-center space-x-8">
              <NavLink href="#services">Services</NavLink>
              <NavLink href="#about">About</NavLink>
              <NavLink href="#contact">Contact</NavLink>
              <button
                onClick={() => navigate("/user/login")}
                className="px-6 py-2.5 text-green-600 hover:text-green-700 transition-colors relative group"
              >
                Login
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
              </button>
              <button onClick={() => navigate("/user/sign-up")}
                className="px-6 py-2.5 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full hover:shadow-lg hover:shadow-green-200 transform hover:-translate-y-0.5 transition-all">
                Create Account
              </button>
              <button onClick={() => navigate("/creator/login")}
                className="px-6 py-2.5 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full hover:shadow-lg hover:shadow-blue-200 transform hover:-translate-y-0.5 transition-all">
                TO BE A CREATOR
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden absolute w-full bg-white/95 backdrop-blur-md shadow-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <MobileNavLink href="#services">Services</MobileNavLink>
              <MobileNavLink href="#about">About</MobileNavLink>
              <MobileNavLink href="#contact">Contact</MobileNavLink>
              <MobileNavLink href="#login">Login</MobileNavLink>
              <MobileNavLink href="#signup">Create Account</MobileNavLink>
              <MobileNavLink href="#signup">TO BE A CREATOR</MobileNavLink>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative min-h-screen overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(34,197,94,0.15),rgba(255,255,255,0))]"></div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-green-100/30"
              style={{
                width: Math.random() * 300 + 50 + 'px',
                height: Math.random() * 300 + 50 + 'px',
                left: Math.random() * 100 + '%',
                top: Math.random() * 100 + '%',
                transform: `translate(-50%, -50%) translateY(${parallaxOffset * (Math.random() + 0.5)}px)`,
                animation: `float ${Math.random() * 10 + 15}s infinite ease-in-out`,
              }}
            ></div>
          ))}
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative z-10">
              <div className="inline-block px-4 py-1.5 bg-green-100 rounded-full mb-6">
                <p className="text-sm font-medium text-green-800 flex items-center">
                  <Star className="h-4 w-4 mr-1" />
                  Trusted by 10,000+ clients
                </p>
              </div>
              <h1 className="text-5xl sm:text-7xl font-bold mb-8">
                {'Create Magic'.split('').map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block hover:text-green-600 hover:scale-120 transition-all duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {letter}
                  </span>
                ))}
                <br />
                {'Together'.split('').map((letter, index) => (
                  <span
                    key={index}
                    className="inline-block text-green-600 hover:scale-120 hover:text-black transition-all duration-200"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {letter}
                  </span>
                ))}
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your dreams into unforgettable moments. Let's create experiences that last a lifetime.
              </p>
              <div className="flex flex-wrap gap-4">
                <button className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-500 text-white rounded-full text-lg font-semibold hover:shadow-lg hover:shadow-green-200 transform hover:-translate-y-0.5 transition-all flex items-center">
                  Start Planning
                  <ChevronRight className="ml-2 h-5 w-5" />
                </button>
                <button className="px-8 py-4 border-2 border-green-600 text-green-600 rounded-full text-lg font-semibold hover:bg-green-50 transition-all flex items-center group">
                  Watch Demo
                  <Clock className="ml-2 h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-green-200/50 to-transparent rounded-full animate-pulse"></div>
              <div className="grid grid-cols-2 gap-6 relative">
                {services.map((service, index) => (
                  <div
                    key={index}
                    className={`bg-white/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl hover:shadow-2xl transform transition-all duration-300 ${index % 2 === 0 ? 'hover:-translate-y-2' : 'hover:translate-y-2'
                      } hover:bg-white`}
                    style={{ marginTop: index % 2 === 0 ? '0' : '2rem' }}
                  >
                    <service.icon className="h-10 w-10 text-green-600 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <div className="w-12 h-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full mb-3"></div>
                    <p className="text-gray-600 text-sm">{service.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <section id="services" className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-green-50/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Our Services</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-green-600 to-emerald-500 rounded-full mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div
                key={index}
                className={`group bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-500 hover:scale-105 ${hoveredService === index ? 'translate-x-4' : ''
                  }`}
                onMouseEnter={() => setHoveredService(index)}
                onMouseLeave={() => setHoveredService(null)}
              >
                <div className="relative inline-block mb-6">
                  <service.icon className={`h-12 w-12 relative z-10 transform group-hover:rotate-12 transition-transform duration-300 ${hoveredService === index ? 'text-green-600' : 'text-gray-700'
                    }`} />
                  <div className="absolute inset-0 bg-green-100 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-gray-600">{service.desc}</p>
                <div className="mt-6">
                  <button className="text-green-600 font-medium flex items-center group">
                    Learn More
                    <ChevronRight className="ml-1 h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={Users}
              title="Expert Team"
              description="Professional event planners with years of experience"
            />
            <FeatureCard
              icon={MapPin}
              title="Premium Venues"
              description="Access to exclusive and stunning locations"
            />
            <FeatureCard
              icon={Calendar}
              title="Seamless Planning"
              description="End-to-end event management and coordination"
            />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-gray-900 to-gray-950 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,197,94,0.1),rgba(0,0,0,0))]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            <div>
              <div className="flex items-center mb-6">
                <Calendar className="h-8 w-8 text-green-400" />
                <span className="ml-2 text-2xl font-bold">FESTIVIA</span>
              </div>
              <p className="text-gray-400">Creating memorable events since 2020</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
              <ul className="space-y-3">
                <li><a href="#services" className="text-gray-400 hover:text-white transition-colors">Services</a></li>
                <li><a href="#about" className="text-gray-400 hover:text-white transition-colors">About</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Contact</h4>
              <div className="space-y-3">
                <p className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <Mail className="h-5 w-5 mr-2" /> info@festivia.com
                </p>
                <p className="flex items-center text-gray-400 hover:text-white transition-colors">
                  <Phone className="h-5 w-5 mr-2" /> +1 (555) 123-4567
                </p>
              </div>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-6">Newsletter</h4>
              <div className="space-y-4">
                <p className="text-gray-400">Stay updated with our latest events and offers</p>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="px-4 py-2 rounded-l-full w-full bg-gray-800 text-white border-2 border-gray-700 focus:border-green-500 focus:outline-none"
                  />
                  <button className="bg-gradient-to-r from-green-600 to-emerald-500 px-6 rounded-r-full hover:shadow-lg hover:shadow-green-500/20 transition-all">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center">
            <p className="text-gray-400">&copy; 2024 FESTIVIA. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-gray-600 hover:text-green-600 transition-colors relative group"
    >
      {children}
      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
    </a>
  );
}

function MobileNavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="block px-4 py-3 text-base font-medium text-gray-700 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all"
    >
      {children}
    </a>
  );
}

function FeatureCard({ icon: Icon, title, description }: { icon: any; title: string; description: string }) {
  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all group">
      <div className="relative inline-block mb-6">
        <Icon className="h-12 w-12 text-green-600 relative z-10 transform group-hover:rotate-12 transition-transform duration-300" />
        <div className="absolute inset-0 bg-green-100 rounded-full blur opacity-0 group-hover:opacity-75 transition-opacity"></div>
      </div>
      <h3 className="text-xl font-semibold mb-4">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}

export default LandingPage;