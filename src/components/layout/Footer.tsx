import { Link } from 'react-router-dom';
import { LayoutGrid } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-700 mt-auto">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid size={18} className="text-blue-400" />
              <span className="text-white font-semibold text-sm">Book Worm</span>
            </div>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Your favourite eBook store. Discover, read, and grow with thousands of titles across every genre.
            </p>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-3">Browse</h4>
            <ul className="space-y-2">
              {['Catalog', 'New Arrivals', 'Bestsellers', 'Recommended'].map((item) => (
                <li key={item}>
                  <Link to="/catalog" className="text-neutral-400 text-sm hover:text-white transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-3">Account</h4>
            <ul className="space-y-2">
              {['My Orders', 'My Wishlist', 'My Writers', 'Profile'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-medium text-sm mb-3">Support</h4>
            <ul className="space-y-2">
              {['Help Centre', 'Returns', 'Contact Us', 'Privacy Policy'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-neutral-400 text-sm hover:text-white transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-neutral-700 mt-6 pt-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-neutral-500 text-xs">© 2024 Book Worm. All rights reserved.</p>
          <p className="text-neutral-500 text-xs">Built with React + TypeScript + Tailwind CSS</p>
        </div>
      </div>
    </footer>
  );
}
