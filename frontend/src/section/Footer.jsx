import { useEffect, useRef } from 'react';
import { FaInstagram, FaFacebook, FaTwitter, FaLinkedin } from 'react-icons/fa';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const titlesRef = useRef([]);

  useEffect(() => {
    gsap.fromTo(
      footerRef.current,
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play reverse play reverse'
        }
      }
    );

    gsap.fromTo(
      titlesRef.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: footerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          toggleActions: 'play reverse play reverse'
        }
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="bg-black text-white py-10 px-5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h2 className="text-xl font-bold mb-4 text-cyan-400">CalorieSensei</h2>
          <p className="text-sm">"Fuel up like a ninja, track like a shinobi."</p>
        </div>
        <div>
          <h3 ref={el => titlesRef.current[0] = el} className="text-lg font-semibold mb-3 text-cyan-400">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><a href="/workouts" className="hover:text-blue-400">Workouts</a></li>
            <li><a href="/recipes" className="hover:text-blue-400">Recipes</a></li>
            <li><a href="/chakra-tracker" className="hover:text-blue-400">Chakra Tracker</a></li>
            <li><a href="/membership" className="hover:text-blue-400">Membership</a></li>
          </ul>
        </div>
        <div>
          <h3 ref={el => titlesRef.current[1] = el} className="text-lg font-semibold mb-3 text-cyan-400">Contact Us</h3>
          <p className="text-sm">Email: support@caloriesensei.com</p>
          <p className="text-sm">Phone: +91 98765 43210</p>
        </div>
        <div>
          <h3 ref={el => titlesRef.current[2] = el} className="text-lg font-semibold mb-3 text-cyan-400">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#" className="hover:text-blue-400"><FaInstagram size={24} /></a>
            <a href="#" className="hover:text-blue-400"><FaFacebook size={24} /></a>
            <a href="#" className="hover:text-blue-400"><FaTwitter size={24} /></a>
            <a href="#" className="hover:text-blue-400"><FaLinkedin size={24} /></a>
          </div>
        </div>
      </div>
      <div className="text-center text-xs text-gray-400 mt-8">
        © {new Date().getFullYear()} CalorieSensei. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
