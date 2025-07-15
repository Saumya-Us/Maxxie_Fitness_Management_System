import React from 'react';
import '../App';

function GymHome() {
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <a href="#home" className="text-2xl font-bold">MaxFitness Club</a>
          <div className="hidden md:flex space-x-8">
            <a href="#home" className="hover:text-red-500 transition">Home</a>
            <a href="#classes" className="hover:text-red-500 transition">Classes</a>
            <a href="#membership" className="hover:text-red-500 transition">Membership</a>
            <a href="#contact" className="hover:text-red-500 transition">Contact</a>
          </div>
          <div className="flex space-x-4">
            <a href="#contact" className="bg-transparent border border-red-500 hover:bg-red-500 px-4 py-2 rounded-full transition">
              Contact Us
            </a>
            <a href="/login" className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full transition">
              Join Now
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="home" className="container mx-auto px-6 py-20">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Transform Your Body,<br />
              <span className="text-red-500">Transform Your Life</span>
            </h1>
            <p className="text-xl mb-8 text-gray-300">
              Join our state-of-the-art facility and start your fitness journey today. 
              Expert trainers, modern equipment, and a supportive community await you.
            </p>
            <div className="space-x-4">
              <a href="#membership" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-lg transition">
                Get Started
              </a>
              <a href="#contact" className="border-2 border-white hover:bg-white hover:text-gray-900 px-8 py-3 rounded-full text-lg transition">
                Learn More
              </a>
            </div>
          </div>
          <div className="md:w-1/2 mt-10 md:mt-0">
            <img 
              src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80"
              alt="Gym"
              className="rounded-lg shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-800 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💪</div>
              <h3 className="text-xl font-bold mb-4">Expert Trainers</h3>
              <p className="text-gray-300">Professional trainers to guide you through your fitness journey</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🏋️‍♂️</div>
              <h3 className="text-xl font-bold mb-4">Modern Equipment</h3>
              <p className="text-gray-300">State-of-the-art facilities and equipment</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-4">Supportive Community</h3>
              <p className="text-gray-300">Join a community that motivates and inspires</p>
            </div>
            <div className="text-center p-6">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-bold mb-4">Premium Supplements</h3>
              <p className="text-gray-300">High-quality supplements to support your fitness goals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Special Classes Section */}
      <section id="classes" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Special Classes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-custom hover:scale transition">
              <img 
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Yoga" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Yoga</h3>
                <p className="text-gray-400 mb-4">Improve flexibility and mental well-being with our expert-led yoga sessions.</p>
                <a href="#contact" className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm transition">
                  Learn More
                </a>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-custom hover:scale transition">
              <img 
                src="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Zumba" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Zumba</h3>
                <p className="text-gray-400 mb-4">Dance your way to fitness with our energetic Zumba classes.</p>
                <a href="#contact" className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm transition">
                  Learn More
                </a>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg overflow-hidden shadow-custom hover:scale transition">
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb82f6e2c0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" 
                alt="Online Classes" 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">Online Classes</h3>
                <p className="text-gray-400 mb-4">Work out from anywhere with our live and on-demand online fitness classes.</p>
                <a href="#contact" className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-full text-sm transition">
                  Learn More
                </a>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <a href="#contact" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-lg transition">
              View All Classes
            </a>
          </div>
        </div>
      </section>

      {/* Membership Plans Section */}
      <section id="membership" className="bg-gray-800 py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Membership Plans</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Silver Plan */}
            <div className="bg-gray-900 rounded-lg p-8 shadow-custom hover:scale transition">
              <h3 className="text-2xl font-bold mb-4 text-center">Silver</h3>
              <div className="text-4xl font-bold mb-6 text-center">Rs. 1,999<span className="text-lg">/month</span></div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Access to gym equipment
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Locker room access
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Basic fitness assessment
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Access to online classes
                </li>
              </ul>
              <a href="#contact" className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-full transition">
                Select Plan
              </a>
            </div>
            {/* Gold Plan */}
            <div className="bg-gray-900 rounded-lg p-8 shadow-custom hover:scale transition border-2 border-red-500 relative">
              <div className="absolute top-0 right-0 bg-red-500 text-white px-4 py-1 rounded-tl-lg rounded-bl-lg" style={{transform: 'translateY(-50%) translateX(50%)'}}>Popular</div>
              <h3 className="text-2xl font-bold mb-4 text-center">Gold</h3>
              <div className="text-4xl font-bold mb-6 text-center">Rs. 2,999<span className="text-lg">/month</span></div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  All Silver features
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Personal trainer (2 sessions/month)
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Nutrition consultation
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Access to all group classes
                </li>
              </ul>
              <a href="#contact" className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-full transition">
                Select Plan
              </a>
            </div>
            {/* Platinum Plan */}
            <div className="bg-gray-900 rounded-lg p-8 shadow-custom hover:scale transition">
              <h3 className="text-2xl font-bold mb-4 text-center">Platinum</h3>
              <div className="text-4xl font-bold mb-6 text-center">Rs. 3,999<span className="text-lg">/month</span></div>
              <ul className="mb-8 space-y-3">
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  All Gold features
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Unlimited personal training
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Monthly massage session
                </li>
                <li className="flex items-center">
                  <span className="text-red-500 mr-2">✔️</span>
                  Priority booking for all services
                </li>
              </ul>
              <a href="#contact" className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-full transition">
                Select Plan
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12">Contact Us</h2>
          <div className="max-w-3xl mx-auto bg-gray-900 rounded-lg p-8 shadow-custom">
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium mb-2">Name</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-red-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input type="email" className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-red-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Subject</label>
                <input type="text" className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-red-500" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Message</label>
                <textarea rows="4" className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 focus:outline-none focus:border-red-500"></textarea>
              </div>
              <div className="text-center">
                <button type="submit" className="bg-red-600 hover:bg-red-700 px-8 py-3 rounded-full text-lg transition">
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <a href="#home" className="text-2xl font-bold">MaxFitness Club</a>
              <p className="text-gray-400 mt-2">Transform your body, transform your life</p>
            </div>
            <div className="flex space-x-6">
              {/* Social icons (SVGs) go here, as in your original code */}
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {new Date().getFullYear()} MaxFitness Club. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default GymHome;
