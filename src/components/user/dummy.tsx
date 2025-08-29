

export default function SimpleNotFoundPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      
      <main className="container mx-auto py-16 px-4">
        <div className="max-w-lg mx-auto text-center">
          {/* Simple animated illustration */}
          <div className="mb-10 relative h-64">
            {/* Paper plane animation */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-30 h-26 animate-bounce">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21.7 2.3C21.5 2.1 21.2 2 21 2H3C2.8 2 2.5 2.1 2.3 2.3C2.1 2.5 2 2.8 2 3C2 3.2 2.1 3.5 2.3 3.7L8.7 10.1L10.5 18.1C10.6 18.5 10.9 18.8 11.3 18.9C11.4 19 11.5 19 11.6 19C11.9 19 12.1 18.9 12.3 18.7L21.7 9.3C21.9 9.1 22 8.8 22 8.5V3C22 2.8 21.9 2.5 21.7 2.3Z" fill="#4F46E5"/>
                </svg>
              </div>
            </div>
            
            {/* 404 text */}
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-9xl font-bold text-gray-400 animate-pulse">404</h1>
            </div>
            
            {/* Dotted path animation */}
            <div className="absolute w-full h-24 bottom-0 overflow-hidden">
              <svg viewBox="0 0 200 50" className="w-full">
                <path 
                  d="M0,25 Q50,5 100,25 T200,25" 
                  stroke="#E0E7FF" 
                  strokeWidth="2" 
                  strokeDasharray="5,5" 
                  fill="none"
                  className="animate-dash"
                />
              </svg>
            </div>
          </div>
          
          {/* Content */}
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              We couldn't find the page you're looking for. The page may have been moved or no longer exists.
            </p>
            <div className="flex justify-center space-x-4">
              <a 
                href="/" 
                className="px-6 py-3 bg-indigo-600 text-white rounded-md shadow-sm hover:bg-indigo-700 transition-colors"
              >
                Go Home
              </a>
              <button 
                onClick={() => window.history.back()} 
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </main>
      
      
      {/* Animation styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes dash {
          to {
            stroke-dashoffset: -20;
          }
        }
        
        .animate-dash {
          animation: dash 10s linear infinite;
        }
      `}} />
    </div>
  );
}