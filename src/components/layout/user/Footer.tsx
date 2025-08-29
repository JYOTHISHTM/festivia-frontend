import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#ECE7E7] p-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">


      <div>
        <h2 className="text-xl font-bold mb-4">GizmoSphere</h2>
        <p className="text-sm text-gray-800 leading-relaxed">
          Unleash Innovation With Cutting-Edge Tech. Your One-Stop Source For Gadgets And Gizmos.
        </p>
      </div>



      <div>
        <h3 className="text-lg font-bold mb-5">Contact Us</h3>
        <p className="text-sm text-gray-800 mb-3">1800-124-123</p>
        <p className="text-sm text-gray-800 mb-3">GizmoSphere@gmail.com</p>
        <p className="text-sm text-gray-800">
          Self-building Kakkanchery, Ramanattukara 451236
        </p>
      </div>



      <div>
        <h3 className="text-lg font-bold mb-5">Social Media</h3>
        <a href="#" className="flex items-center gap-2 text-gray-800 hover:text-gray-600 mb-3">
          <i className="ri-linkedin-fill text-xl"></i>
          <span className="text-sm">link.com</span>
        </a>
        <a href="#" className="flex items-center gap-2 text-gray-800 hover:text-gray-600 mb-3">
          <i className="ri-instagram-line text-xl"></i>
          <span className="text-sm">instagram.com</span>
        </a>
        <a href="#" className="flex items-center gap-2 text-gray-800 hover:text-gray-600">
          <i className="ri-twitter-x-line text-xl"></i>
          <span className="text-sm">Twitter.com</span>
        </a>
      </div>



      <div>
        <h3 className="text-lg font-bold mb-5">Service</h3>
        <a href="#" className="text-sm text-gray-800 hover:text-gray-600 block mb-3">Wedding events</a>
        <a href="#" className="text-sm text-gray-800 hover:text-gray-600 block mb-3">Birthday events</a>
        <a href="#" className="text-sm text-gray-800 hover:text-gray-600 block mb-3">Music events</a>
        <a href="#" className="text-sm text-gray-800 hover:text-gray-600">Sports events</a>
      </div>
    </footer>
  );
};

export default Footer;
