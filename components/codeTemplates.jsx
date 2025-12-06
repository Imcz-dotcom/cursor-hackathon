// Pre-defined code templates for demo purposes
export const codeTemplates = {
    vacationLandingPage: {
        'vacation-landing.js': {
            language: 'javascript',
            content: `export default function VacationLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-100">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center">
        <div className="absolute inset-0 bg-black/30 z-10"></div>
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1506929562872-bb421503ef21?w=1920')" }}
        ></div>
        
        <div className="relative z-20 text-center text-white px-4">
          <h1 className="text-6xl font-bold mb-4">Discover Paradise</h1>
          <p className="text-2xl mb-8 opacity-90">Your dream vacation awaits</p>
          <button className="bg-cyan-500 hover:bg-cyan-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all transform hover:scale-105 shadow-xl">
            Explore Destinations
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Why Choose Us</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🏖️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Best Beaches</h3>
              <p className="text-gray-600">Pristine beaches with crystal clear waters.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">🏨</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Luxury Hotels</h3>
              <p className="text-gray-600">5-star accommodations with world-class amenities.</p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition-shadow">
              <div className="text-5xl mb-4">✈️</div>
              <h3 className="text-2xl font-bold mb-3 text-gray-800">Easy Booking</h3>
              <p className="text-gray-600">Simple and secure booking in just a few clicks.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-cyan-600 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Ready for Your Adventure?</h2>
          <p className="text-xl mb-8 opacity-90">Book now and get 20% off your first vacation package</p>
          <button className="bg-white text-cyan-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors shadow-xl">
            Book Now
          </button>
        </div>
      </section>
    </div>
  );
}`
        }
    }
};

// Helper function to get template by keyword
export function getTemplateByKeyword(message) {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('vacation') && lowerMessage.includes('landing')) {
        return codeTemplates.vacationLandingPage;
    }

    return null;
}
