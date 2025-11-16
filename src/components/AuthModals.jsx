'use client';

import { useState } from 'react';

export default function AuthModals() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return (
    <>
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#0b1b2b] rounded-lg p-8 max-w-md w-full relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-white hover:text-[#dcf836] transition-colors text-2xl"
            >
              ×
            </button>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white uppercase mb-6">Login</h3>

            {/* Login Form */}
            <form method="post" action="/login.php" className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-white text-sm font-medium mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  id="username"
                  placeholder="Hugh Jackman"
                  pattern="^[a-zA-Z][a-zA-Z0-9-_\.]{8,20}$"
                  required
                  className="w-full bg-[#020d18] border border-[#405266] rounded-lg px-4 py-3 text-white placeholder:text-[#4b5661] focus:outline-none focus:border-[#dcf836] transition-colors"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="******"
                  pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                  required
                  className="w-full bg-[#020d18] border border-[#405266] rounded-lg px-4 py-3 text-white placeholder:text-[#4b5661] focus:outline-none focus:border-[#dcf836] transition-colors"
                />
              </div>

              {/* Remember & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="remember"
                    className="w-4 h-4 accent-[#dd003f]"
                  />
                  <span className="text-white text-sm">Remember me</span>
                </label>
                <a href="#" className="text-[#dcf836] hover:text-white transition-colors text-sm">
                  Forget password?
                </a>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#dd003f] hover:bg-[#ff0f4f] text-white py-3 rounded-full font-medium transition-colors"
              >
                Login
              </button>
            </form>

            {/* Social Login */}
            <div className="mt-6">
              <p className="text-center text-[#abb7c4] text-sm mb-4">Or via social</p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#3b5998] hover:bg-[#4c6baf] text-white py-3 rounded-full transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M20 10c0-5.523-4.477-10-10-10S0 4.477 0 10c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V10h2.54V7.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V10h2.773l-.443 2.89h-2.33v6.988C16.343 19.128 20 14.991 20 10z" clipRule="evenodd" />
                  </svg>
                  Facebook
                </a>
                <a
                  href="#"
                  className="flex-1 flex items-center justify-center gap-2 bg-[#1da1f2] hover:bg-[#3aaffc] text-white py-3 rounded-full transition-colors text-sm font-medium"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                  Twitter
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Signup Modal */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 px-4">
          <div className="bg-[#0b1b2b] rounded-lg p-8 max-w-md w-full relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-white hover:text-[#dcf836] transition-colors text-2xl"
            >
              ×
            </button>

            {/* Title */}
            <h3 className="text-2xl font-bold text-white uppercase mb-6">Sign Up</h3>

            {/* Signup Form */}
            <form method="post" action="/signup.php" className="space-y-5">
              {/* Username Field */}
              <div>
                <label htmlFor="username-2" className="block text-white text-sm font-medium mb-2">
                  Username:
                </label>
                <input
                  type="text"
                  name="username"
                  id="username-2"
                  placeholder="Hugh Jackman"
                  pattern="^[a-zA-Z][a-zA-Z0-9-_\.]{8,20}$"
                  required
                  className="w-full bg-[#020d18] border border-[#405266] rounded-lg px-4 py-3 text-white placeholder:text-[#4b5661] focus:outline-none focus:border-[#dcf836] transition-colors"
                />
              </div>

              {/* Email Field */}
              <div>
                <label htmlFor="email-2" className="block text-white text-sm font-medium mb-2">
                  Your Email:
                </label>
                <input
                  type="email"
                  name="email"
                  id="email-2"
                  placeholder="example@email.com"
                  required
                  className="w-full bg-[#020d18] border border-[#405266] rounded-lg px-4 py-3 text-white placeholder:text-[#4b5661] focus:outline-none focus:border-[#dcf836] transition-colors"
                />
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password-2" className="block text-white text-sm font-medium mb-2">
                  Password:
                </label>
                <input
                  type="password"
                  name="password"
                  id="password-2"
                  placeholder="******"
                  pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                  required
                  className="w-full bg-[#020d18] border border-[#405266] rounded-lg px-4 py-3 text-white placeholder:text-[#4b5661] focus:outline-none focus:border-[#dcf836] transition-colors"
                />
              </div>

              {/* Re-type Password Field */}
              <div>
                <label htmlFor="repassword-2" className="block text-white text-sm font-medium mb-2">
                  Re-type Password:
                </label>
                <input
                  type="password"
                  name="repassword"
                  id="repassword-2"
                  placeholder="******"
                  pattern="(?=^.{8,}$)((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$"
                  required
                  className="w-full bg-[#020d18] border border-[#405266] rounded-lg px-4 py-3 text-white placeholder:text-[#4b5661] focus:outline-none focus:border-[#dcf836] transition-colors"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-[#dd003f] hover:bg-[#ff0f4f] text-white py-3 rounded-full font-medium transition-colors"
              >
                Sign Up
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Trigger Buttons - Export these functions for use in Header */}
      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </>
  );
}

// Export functions to control modals
export function useAuthModals() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  return {
    showLogin,
    setShowLogin,
    showSignup,
    setShowSignup,
  };
}
