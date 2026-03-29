import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="mt-auto bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500 dark:text-gray-400">© 2023 OmniCart Inc. All rights reserved.</p>
          </div>
          <div className="flex gap-6 text-sm text-gray-500 dark:text-gray-400">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;