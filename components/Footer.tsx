import Link from "next/link";
import {  Mail, MapPin, Phone } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";


export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">YourStore</h2>
          <p className="text-gray-500 text-sm">Quality products for your daily lifestyle. Shop with confidence.</p>
        <div className="flex space-x-4">
  {/* class ထဲမှာ text-gray-400 ကို သေချာ ထည့်ပေးပါ */}
  <FaFacebook className="h-5 w-5 text-gray-400 hover:text-blue-600 cursor-pointer" />
  <FaInstagram className="h-5 w-5 text-gray-400 hover:text-pink-600 cursor-pointer" />
  <FaTwitter className="h-5 w-5 text-gray-400 hover:text-blue-400 cursor-pointer" />
</div>
        </div>

        {/* Links Column 1 */}
        <div className="space-y-4">
          <h4 className="font-semibold">Shop</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/products" className="hover:text-blue-600">All Products</Link></li>
            <li><Link href="/categories" className="hover:text-blue-600">Categories</Link></li>
            <li><Link href="/featured" className="hover:text-blue-600">Featured</Link></li>
          </ul>
        </div>

        {/* Links Column 2 */}
        <div className="space-y-4">
          <h4 className="font-semibold">Support</h4>
          <ul className="space-y-2 text-sm text-gray-500">
            <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
            <li><Link href="/shipping" className="hover:text-blue-600">Shipping Info</Link></li>
            <li><Link href="/returns" className="hover:text-blue-600">Returns</Link></li>
            <li><Link href="/contact" className="hover:text-blue-600">Contact Us</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 text-sm text-gray-500">
          <h4 className="font-semibold text-gray-900">Get In Touch</h4>
          <div className="flex items-center gap-2"><MapPin className="h-4 w-4" /> Pyay, Myanmar</div>
          <div className="flex items-center gap-2"><Phone className="h-4 w-4" /> +959 689 686 153</div>
          <div className="flex items-center gap-2"><Mail className="h-4 w-4" /> kothu@gmaill.com</div>
        </div>
      </div>

      {/* Bottom Footer & Developer Credit */}
      <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-gray-100 flex flex-col md:flex-row justify-between items-center text-xs text-gray-400">
        <p>© {new Date().getFullYear()} YourStore. All rights reserved.</p>
        
        {/* Developer Credit */}
        <div className="mt-4 md:mt-0">
          Built by{" "}
          <Link 
            href="https://thurein-portfolio-nplg.vercel.app/" 
            target="_blank" 
            className="text-gray-900 font-semibold hover:underline"
          >
            Thurein MyoMin
          </Link>
        </div>
      </div>
    </footer>
  );
}