import { Users, Calendar, Award, MapPin, Phone, Mail, ArrowRight } from 'lucide-react';
import Image1 from '../../../assets/images/pexels-rdne-7648478.jpg'
import Image2 from '../../../assets/images/pexels-kampus-8353841.jpg'

export default function AboutPage() {
    const stats = [
        { id: 1, name: 'Events Managed', value: '500+', icon: <Calendar size={24} className="text-indigo-600" /> },
        { id: 2, name: 'Happy Clients', value: '200+', icon: <Users size={24} className="text-indigo-600" /> },
        { id: 3, name: 'Team Members', value: '25', icon: <Users size={24} className="text-indigo-600" /> },
        { id: 4, name: 'Industry Awards', value: '15', icon: <Award size={24} className="text-indigo-600" /> },
    ];

    const team = [
        {
            name: 'Sarah Johnson',
            role: 'CEO & Founder',
            bio: 'With over 15 years of experience in the events industry, Sarah leads our team with vision and creativity.',
            imageUrl: '/api/placeholder/300/300',
        },
        {
            name: 'Michael Chen',
            role: 'Creative Director',
            bio: 'Michael brings artistic flair and innovative design concepts to every event we produce.',
            imageUrl: Image1,
        },
        {
            name: 'Priya Patel',
            role: 'Senior Event Manager',
            bio: 'Priyas attention to detail and exceptional organizational skills ensure flawless event execution.',
            imageUrl: Image2,
        },
    ];

    const testimonials = [
        {
            id: 1,
            content: "Working with EventPro was the best decision we made for our company conference. Their team managed everything perfectly, from venue selection to day-of coordination.",
            author: "Jessica Williams",
            company: "TechNova Inc.",
        },
        {
            id: 2,
            content: "I was blown away by the creativity and professionalism EventPro brought to our product launch. They transformed our vision into reality and exceeded all expectations.",
            author: "Robert Chen",
            company: "Fusion Brands",
        },
    ];

    return (
        <div className="bg-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-r from-indigo-700 to-purple-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
                        About EventPro
                    </h1>
                    <p className="mt-6 text-xl text-indigo-100 max-w-3xl mx-auto">
                        Transforming ordinary occasions into extraordinary experiences since 2012
                    </p>
                </div>
            </div>

            {/* Our Story Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Story</h2>
                        <div className="mt-6 text-lg text-gray-600 space-y-6">
                            <p>
                                EventPro was founded in 2012 with a simple mission: to create meaningful, memorable events that bring people together. What started as a small team of passionate event enthusiasts has grown into a full-service event management company with a reputation for excellence.
                            </p>
                            <p>
                                Over the years, we've had the privilege of planning and executing hundreds of successful events, from intimate corporate gatherings to large-scale conferences and celebrations. Our hands-on approach and attention to detail have earned us the trust of clients across industries.
                            </p>
                            <p>
                                Today, EventPro is recognized as an industry leader, known for our creativity, reliability, and ability to transform visions into unforgettable experiences. As we continue to grow, our commitment to exceptional service and innovative solutions remains at the heart of everything we do.
                            </p>
                        </div>
                    </div>
                    <div className="relative h-64 lg:h-96">
                        <div className="absolute inset-0 bg-indigo-300 rounded-lg overflow-hidden">
                            <img
                                src="/api/placeholder/800/600"
                                alt="Team collaborating"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                        {stats.map((stat) => (
                            <div key={stat.id} className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6 flex flex-col items-center text-center">
                                    <div className="mb-3">{stat.icon}</div>
                                    <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stat.value}</dd>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Values Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Core Values</h2>
                    <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
                        The principles that guide our approach to every event and client relationship
                    </p>
                </div>
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <Award size={24} className="text-indigo-600" />
                        </div>
                        <h3 className="mt-6 text-lg font-medium text-gray-900">Excellence</h3>
                        <p className="mt-2 text-base text-gray-600">We strive for perfection in every detail, ensuring each event exceeds expectations.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <Users size={24} className="text-indigo-600" />
                        </div>
                        <h3 className="mt-6 text-lg font-medium text-gray-900">Collaboration</h3>
                        <p className="mt-2 text-base text-gray-600">We work closely with our clients, building partnerships based on trust and shared vision.</p>
                    </div>
                    <div className="bg-white p-8 rounded-lg shadow-lg text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100">
                            <Calendar size={24} className="text-indigo-600" />
                        </div>
                        <h3 className="mt-6 text-lg font-medium text-gray-900">Innovation</h3>
                        <p className="mt-2 text-base text-gray-600">We constantly seek new ideas and creative solutions to make each event unique and memorable.</p>
                    </div>
                </div>
            </div>

            {/* Team Section */}
            <div className="bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Meet Our Leadership Team</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            The talented individuals behind EventPro's success
                        </p>
                    </div>
                    <div className="mt-12 grid gap-8 md:grid-cols-3">
                        {team.map((person) => (
                            <div key={person.name} className="bg-white rounded-lg shadow-lg overflow-hidden">
                                <img
                                    className="w-full h-64 object-cover"
                                    src={person.imageUrl}
                                    alt={person.name}
                                />
                                <div className="p-6">
                                    <h3 className="text-lg font-medium text-gray-900">{person.name}</h3>
                                    <p className="text-sm text-indigo-600">{person.role}</p>
                                    <p className="mt-3 text-base text-gray-500">{person.bio}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Testimonials Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <h2 className="text-3xl font-bold text-center text-gray-900 sm:text-4xl">What Our Clients Say</h2>
                <div className="mt-12 grid gap-8 md:grid-cols-2">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="bg-white p-8 border border-gray-200 rounded-lg shadow-sm">
                            <p className="text-lg text-gray-600 italic">"{testimonial.content}"</p>
                            <div className="mt-6">
                                <p className="text-base font-medium text-gray-900">{testimonial.author}</p>
                                <p className="text-sm text-gray-500">{testimonial.company}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact CTA Section */}
            <div className="bg-indigo-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-white">Ready to Create Your Next Amazing Event?</h2>
                            <p className="mt-4 text-lg text-indigo-100">
                                Contact our team today to discuss how we can bring your vision to life.
                            </p>
                            <div className="mt-8 space-y-4">
                                <div className="flex items-center">
                                    <MapPin className="mr-3 h-5 w-5 text-indigo-200" />
                                    <span className="text-indigo-100">123 Event Street, New York, NY 10001</span>
                                </div>
                                <div className="flex items-center">
                                    <Phone className="mr-3 h-5 w-5 text-indigo-200" />
                                    <span className="text-indigo-100">(555) 123-4567</span>
                                </div>
                                <div className="flex items-center">
                                    <Mail className="mr-3 h-5 w-5 text-indigo-200" />
                                    <span className="text-indigo-100">info@eventpro.example</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-center lg:justify-end">
                            <button className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-indigo-700 bg-white hover:bg-indigo-50">
                                Contact Us <ArrowRight className="ml-2 h-5 w-5" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}