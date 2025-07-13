import { MoveRight, Twitter, MessageCircle, Globe, Github } from "lucide-react";
import Link from "next/link";
import React from "react";

const Footer = () => {
  const footerSections = {
    app: [
      { href: "/trade", name: "Trade" },
      { href: "/explore", name: "Explore" },
      { href: "/pool", name: "Pool" },
    ],
    company: [
      { href: "/careers", name: "Careers" },
      { href: "/blog", name: "Blog" },
      { href: "/brand-assets", name: "Brand assets" },
    ],
    protocol: [
      { href: "/vote", name: "Vote" },
      { href: "/governance", name: "Governance" },
    ],
    developers: [
      { href: "/developers", name: "Developers" },
    ],
    help: [
      { href: "/help-center", name: "Help center" },
      { href: "/contact", name: "Contact us" },
    ],
    legal: [
      { href: "/trademark-policy", name: "Trademark Policy" },
      { href: "/privacy-policy", name: "Privacy Policy" },
    ],
  };

  return (
    <footer className="pt-16 bg-slate-950">
      <div className="mx-auto px-4 text-white md:px-8 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 pb-8">
          {/* Logo and CTA */}
          <div className="col-span-2 lg:col-span-2">
            <img src="/logo.webp" className="w-32 mb-4" />
            <p className="text-gray-400 mb-6">Powered by the Syncron Swap Protocol</p>
            <Link
              href="/swap"
              className="inline-block py-3 px-6 text-center text-black font-medium bg-gradient-to-r from-primary via-primary to-lime-400 hover:from-primary hover:via-primary hover:to-lime-400 rounded-lg shadow-lg hover:shadow-none transition-all duration-200"
            >
              Let's get started
            </Link>
          </div>

          {/* App Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">App</h3>
            <ul className="space-y-3">
              {footerSections.app.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              {footerSections.company.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Protocol Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Protocol</h3>
            <ul className="space-y-3">
              {footerSections.protocol.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
            
            <h4 className="text-lg font-semibold mb-4 mt-8">Developers</h4>
            <ul className="space-y-3">
              {footerSections.developers.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Need Help Section */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Need help?</h3>
            <ul className="space-y-3">
              {footerSections.help.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="border-t border-slate-800 pt-8 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h4 className="text-lg font-semibold mb-3">Follow Us</h4>
              <div className="flex items-center gap-4">
                <a
                  href="https://x.com/opencryptofdn"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Twitter className="w-5 h-5" />
                  <span className="hidden sm:inline">Twitter</span>
                </a>
                <a
                  href="https://t.me/ocfcommunity"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <MessageCircle className="w-5 h-5" />
                  <span className="hidden sm:inline">Telegram</span>
                </a>
                <a
                  href="https://opencryptofoundation.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Globe className="w-5 h-5" />
                  <span className="hidden sm:inline">Website</span>
                </a>
                <a
                  href="https://github.com/syncron-labs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors duration-200"
                >
                  <Github className="w-5 h-5" />
                  <span className="hidden sm:inline">GitHub</span>
                </a>
              </div>
            </div>
            <div className="text-center md:text-right">
              <p className="text-gray-500 text-xs mb-2">Powered by Open Crypto Foundation</p>
              <p className="text-gray-500 text-xs">Building the future of DeFi</p>
            </div>
          </div>
        </div>

        {/* Bottom Footer */}
        <div className="border-t border-slate-800 pt-4 pb-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} Syncron Swap. All rights reserved.
            </p>
            <ul className="flex flex-wrap items-center gap-6 text-sm">
              {footerSections.legal.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="text-gray-400 hover:text-white transition-colors duration-200">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
