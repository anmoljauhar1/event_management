import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="relative bg-indigo-900 h-[500px] flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-indigo-600 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Host and Discover</span>
            <span className="block text-indigo-400">Unforgettable Events</span>
          </h1>
          <p className="mt-3 text-base text-indigo-200 sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
            The all-in-one platform for event management. From booking halls to managing attendees, we've got you covered.
          </p>
          <div className="mt-8 sm:flex sm:justify-start">
            <div className="rounded-md shadow">
              <Link
                to="/events"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
              >
                Explore Events
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
