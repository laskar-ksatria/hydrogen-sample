import {Link} from 'react-router';

export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 font-mono">
      <div className="container mx-auto px-4 pt-10 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="text-xl font-bold text-gray-900 tracking-wide">
              LOGO
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Premium quality products crafted with care. We bring you the
              finest selection of curated items.
            </p>

            {/* Social Links */}
            <div className="flex space-x-4">
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.219-.359-1.219c0-1.142.662-1.995 1.482-1.995.699 0 1.037.219 1.037 1.037 0 .631-.399 1.574-.609 2.45-.173.73.367 1.32 1.084 1.32 1.301 0 2.301-1.375 2.301-3.35 0-1.75-1.26-2.971-3.063-2.971-2.087 0-3.314 1.566-3.314 3.184 0 .631.242 1.306.545 1.674a.33.33 0 0 1 .076.317c-.083.349-.266 1.077-.303 1.228a.243.243 0 0 1-.35.175c-.979-.456-1.593-1.884-1.593-3.033 0-2.305 1.676-4.426 4.834-4.426 2.54 0 4.515 1.805 4.515 4.218 0 2.516-1.586 4.540-3.79 4.540-.741 0-1.438-.386-1.676-.851 0 0-.367 1.398-.456 1.742-.165.636-.612 1.436-.913 1.923a12 12 0 0 0 3.538.531c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001.017 0z" />
                </svg>
              </button>
              <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                <svg
                  className="w-5 h-5"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/collections"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Collections
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/new-arrivals"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/bestsellers"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Bestsellers
                </Link>
              </li>
              <li>
                <Link
                  to="/collections/sale"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Sale Items
                </Link>
              </li>
              <li>
                <Link
                  to="/blogs"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
              Customer Service
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/pages/contact"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/faq"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/shipping"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/returns"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Returns & Exchanges
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/size-guide"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Size Guide
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-900 uppercase tracking-wide">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/policies/privacy-policy"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/terms-of-service"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/refund-policy"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/policies/shipping-policy"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/pages/about"
                  className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200"
                >
                  About Us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-200 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-500">
              © 2024 LOGO. All rights reserved.
            </div>
            <div className="flex space-x-6">
              <Link
                to="/pages/accessibility"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                Accessibility
              </Link>
              <Link
                to="/pages/sitemap"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                Sitemap
              </Link>
              <Link
                to="/pages/careers"
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-200"
              >
                Careers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
