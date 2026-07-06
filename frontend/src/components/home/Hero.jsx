import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import heroImg from '../../assets/hero.png';
import reactImg from '../../assets/react.svg';
import viteImg from '../../assets/vite.svg';

const Hero = () => {
  const slides = [heroImg, reactImg, viteImg];
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="relative h-[500px] flex items-center overflow-hidden">
      {/* Slideshow background (absolute images with fade) */}
      <div className="absolute inset-0 -z-10">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt="background"
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              current === i ? 'opacity-100' : 'opacity-0'
            }`}
          />
        ))}
        <div className="absolute inset-0 bg-[color:rgba(7,17,31,0.55)]"></div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[color:rgba(var(--accent),0.28)] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-[color:rgba(var(--secondary),0.28)] rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-left">
          <h1 className="text-4xl tracking-tight font-extrabold text-white sm:text-5xl md:text-6xl">
            <span className="block">Host and Discover</span>
            <span className="block text-[color:var(--accent)]">Unforgettable Events</span>
          </h1>
          <p className="mt-3 text-base text-[color:var(--text-secondary)] sm:mt-5 sm:text-lg sm:max-w-xl md:mt-5 md:text-xl">
            The all-in-one platform for event management. From booking halls to managing attendees, we've got you covered.
          </p>
          <div className="mt-8 sm:flex sm:justify-start">
            <div className="rounded-md shadow">
              <Link
                to="/events"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[color:var(--primary)] hover:bg-[color:var(--primary-hover)] md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
              >
                Explore Events
              </Link>
            </div>
            <div className="mt-3 sm:mt-0 sm:ml-3">
              <Link
                to="/register"
                className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-[color:var(--primary)] bg-[color:rgba(var(--primary),0.12)] hover:bg-[color:rgba(var(--primary),0.18)] md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105"
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
