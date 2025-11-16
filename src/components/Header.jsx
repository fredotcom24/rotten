import Link from 'next/link';
import Image from 'next/image';

export default function Header() {
  return (
    <header className="bg-[#020d18] border-b border-[#405266]">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="block">
              <Image 
                src="/uploads/logo.png" 
                alt="Open Pediatrics" 
                width={119} 
                height={58}
                className="w-[119px] h-[58px]"
              />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="lg:hidden flex flex-col gap-1 w-8 h-8 items-center justify-center"
            aria-label="Toggle navigation"
          >
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
            <span className="block w-6 h-0.5 bg-white"></span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8 flex-1 justify-center">
            {/* Left Menu */}
            <ul className="flex items-center gap-6">
              <li className="relative group">
                <button className="text-white hover:text-[#dcf836] transition-colors flex items-center gap-2 text-sm uppercase font-medium">
                  Home
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <ul className="absolute top-full left-0 mt-2 bg-[#020d18] border border-[#405266] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] z-50">
                  <li><Link href="/" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Home 01</Link></li>
                  <li><Link href="/homev2" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Home 02</Link></li>
                  <li><Link href="/homev3" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Home 03</Link></li>
                </ul>
              </li>

              <li className="relative group">
                <button className="text-white hover:text-[#dcf836] transition-colors flex items-center gap-2 text-sm uppercase font-medium">
                  Movies
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <ul className="absolute top-full left-0 mt-2 bg-[#020d18] border border-[#405266] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] z-50">
                  <li><Link href="/moviegrid" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Movie grid</Link></li>
                  <li><Link href="/moviegridfw" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Movie grid full width</Link></li>
                  <li><Link href="/movielist" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Movie list</Link></li>
                  <li><Link href="/moviesingle" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Movie single</Link></li>
                </ul>
              </li>

              <li className="relative group">
                <button className="text-white hover:text-[#dcf836] transition-colors flex items-center gap-2 text-sm uppercase font-medium">
                  Celebrities
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <ul className="absolute top-full left-0 mt-2 bg-[#020d18] border border-[#405266] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] z-50">
                  <li><Link href="/celebritygrid01" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Celebrity grid 01</Link></li>
                  <li><Link href="/celebritygrid02" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Celebrity grid 02</Link></li>
                  <li><Link href="/celebritylist" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Celebrity list</Link></li>
                  <li><Link href="/celebritysingle" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Celebrity single</Link></li>
                </ul>
              </li>

              <li className="relative group">
                <button className="text-white hover:text-[#dcf836] transition-colors flex items-center gap-2 text-sm uppercase font-medium">
                  News
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <ul className="absolute top-full left-0 mt-2 bg-[#020d18] border border-[#405266] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] z-50">
                  <li><Link href="/bloglist" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Blog List</Link></li>
                  <li><Link href="/bloggrid" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Blog Grid</Link></li>
                  <li><Link href="/blogdetail" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Blog Detail</Link></li>
                </ul>
              </li>

              <li className="relative group">
                <button className="text-white hover:text-[#dcf836] transition-colors flex items-center gap-2 text-sm uppercase font-medium">
                  Community
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <ul className="absolute top-full left-0 mt-2 bg-[#020d18] border border-[#405266] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] z-50">
                  <li><Link href="/userfavoritegrid" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">User favorite grid</Link></li>
                  <li><Link href="/userfavoritelist" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">User favorite list</Link></li>
                  <li><Link href="/userprofile" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">User profile</Link></li>
                  <li><Link href="/userrate" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">User rate</Link></li>
                </ul>
              </li>
            </ul>

            {/* Right Menu */}
            <ul className="flex items-center gap-4">
              <li className="relative group">
                <button className="text-white hover:text-[#dcf836] transition-colors flex items-center gap-2 text-sm uppercase font-medium">
                  Pages
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
                <ul className="absolute top-full left-0 mt-2 bg-[#020d18] border border-[#405266] rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 min-w-[200px] z-50">
                  <li><Link href="/landing" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Landing</Link></li>
                  <li><Link href="/404" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">404 Page</Link></li>
                  <li><Link href="/comingsoon" className="block px-4 py-2 text-white hover:bg-[#dd003f] hover:text-white transition-colors text-sm">Coming soon</Link></li>
                </ul>
              </li>
              <li><Link href="/help" className="text-white hover:text-[#dcf836] transition-colors text-sm uppercase font-medium">Help</Link></li>
              <li><Link href="/login" className="text-white hover:text-[#dcf836] transition-colors text-sm uppercase font-medium">Log In</Link></li>
              <li>
                <Link 
                  href="/signup" 
                  className="bg-[#dd003f] hover:bg-[#ff0f4f] text-white px-6 py-2 rounded-full text-sm uppercase font-medium transition-colors"
                >
                  Sign Up
                </Link>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
}
