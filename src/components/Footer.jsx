import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#020d18] border-t border-[#405266] justify-between">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12 md:py-16 justify-between">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-15">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-block mb-6">
              <Image 
                src="/uploads/logo.png" 
                alt="Logo" 
                width={119} 
                height={58}
                className="w-[119px] h-[58px]"
              />
            </Link>
            <address className="not-italic text-[#abb7c4] text-sm mb-4">
              Epitech Bénin<br />
              Bénin, Cotonou, St Michel
            </address>
            <p className="text-[#abb7c4] text-sm">
              Call us: <Link href="tel:+012023426789" className="text-white hover:text-[#dcf836] transition-colors">epitech.bj</Link>
            </p>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white text-lg font-bold uppercase mb-6">Resources</h4>
            <ul className="space-y-3">
              {[
                { label: 'About', href: '/about' },
                // { label: 'Blockbuster', href: '/blockbuster' },
                // { label: 'Contact Us', href: '/contact' },
                // { label: 'Forums', href: '/forums' },
                // { label: 'Blog', href: '/blog' },
                // { label: 'Help Center', href: '/help' },
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-[#abb7c4] hover:text-[#dcf836] transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-white text-lg font-bold uppercase mb-6">Account</h4>
            <ul className="space-y-3">
              {[
                { label: 'My Account', href: '/profile' },
                { label: 'Watchlist', href: '/movies' },
              ].map((item) => (
                <li key={item.href}>
                  <Link 
                    href={item.href}
                    className="text-[#abb7c4] hover:text-[#dcf836] transition-colors text-sm"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white text-lg font-bold uppercase mb-6">Newsletter</h4>
            <p className="text-[#abb7c4] text-sm mb-4">
              Subscribe to our newsletter system now<br />to get latest news from us.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email..."
                className="w-full bg-[#0b1b2b] border border-[#405266] rounded-full px-4 py-3 text-white text-sm placeholder:text-[#4b5661] focus:outline-none focus:border-[#dcf836] transition-colors"
              />
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-[#dd003f] hover:bg-[#ff0f4f] text-white py-3 px-6 rounded-full transition-colors text-sm font-medium"
              >
                Subscribe now
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="border-t border-[#405266]">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            {/* Copyright */}
            <p className="text-[#abb7c4] text-sm text-center md:text-left">
              © 2025 Unreconized. All Rights Reserved. Designed by Unreconized.
            </p>

            {/* Back to Top */}
            <Link 
              href="#"
              className="flex items-center gap-2 text-[#abb7c4] hover:text-[#dcf836] transition-colors text-sm"
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              Back to top
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}