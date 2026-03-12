/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { 
  Sofa, 
  Search, 
  ShoppingBag, 
  User, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare, 
  X, 
  Send, 
  Image as ImageIcon, 
  Upload,
  ChevronDown,
  Menu,
  Heart,
  Sparkles,
  Loader2,
  Star
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Markdown from 'react-markdown';
import { chatWithGemini, analyzeFurnitureImage } from './services/geminiService';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  CollectionsPage, 
  CraftPage, 
  BespokePage, 
  ShowroomPage, 
  LivingRoomPage, 
  BedroomPage, 
  DiningPage, 
  StoryPage, 
  ContactPage,
  SustainabilityPage,
  FAQPage
} from './pages';

import { CartProvider, useCart } from './context/CartContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Cart Drawer Component ---
const CartDrawer = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[150]"
          />
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-[#120e0a] border-l border-white/10 z-[160] shadow-2xl flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <ShoppingBag className="w-6 h-6 text-[#d48311]" />
                <h2 className="text-xl font-bold text-white">Your Cart ({totalItems})</h2>
              </div>
              <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center">
                    <ShoppingBag className="w-10 h-10 text-slate-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Your cart is empty</h3>
                    <p className="text-slate-500 text-sm">Start adding some luxury pieces to your space.</p>
                  </div>
                  <button onClick={onClose} className="px-8 py-3 bg-[#d48311] text-white rounded-full font-bold">
                    Browse Collections
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-24 h-24 rounded-xl overflow-hidden flex-shrink-0 border border-white/10">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <h4 className="text-white font-bold text-sm">{item.name}</h4>
                          <button onClick={() => removeFromCart(item.id)} className="text-slate-500 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <p className="text-[#d48311] text-sm font-medium mt-1">{item.price}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-white/5 rounded-lg border border-white/10 px-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="p-1 text-slate-400 hover:text-white">-</button>
                          <span className="px-3 text-white text-xs font-bold">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="p-1 text-slate-400 hover:text-white">+</button>
                        </div>
                        <p className="text-white text-sm font-bold">₹{(parseInt(item.price.replace(/[^0-9]/g, '')) * item.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-6 border-t border-white/10 bg-[#1a1612]/50 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-2xl font-bold text-white">₹{totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-slate-500">Shipping and taxes calculated at checkout.</p>
                <button className="w-full py-4 bg-[#d48311] text-white rounded-xl font-bold hover:bg-[#d48311]/90 transition-all shadow-xl shadow-[#d48311]/20">
                  Proceed to Checkout
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

// --- Scroll To Top on Route Change ---
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// --- Types ---

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  image?: string;
}

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const location = useLocation();
  const { totalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Collections', path: '/collections' },
    { name: 'The Craft', path: '/craft' },
    { name: 'Bespoke', path: '/bespoke' },
    { name: 'Showroom', path: '/showroom' },
  ];

  const categories = [
    { name: 'Living Room', path: '/living-room' },
    { name: 'Bedroom', path: '/bedroom' },
    { name: 'Dining', path: '/dining' },
  ];

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 px-6 py-4",
        isScrolled ? "bg-[#120e0a]/90 backdrop-blur-xl py-3" : "bg-transparent"
      )}>
        <nav className="max-w-7xl mx-auto flex items-center justify-between bg-[#120e0a]/70 backdrop-blur-xl border border-white/10 rounded-full px-4 md:px-8 py-2 md:py-3">
          <div className="flex items-center gap-4 md:gap-12">
            <Link to="/" className="flex items-center gap-2 text-[#d48311] group">
              <Sofa className="w-5 h-5 md:w-6 md:h-6 transition-transform group-hover:rotate-12" />
              <h2 className="text-slate-100 text-lg md:text-xl font-extrabold tracking-tight">NAYYER</h2>
            </Link>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((item) => (
                <Link 
                  key={item.name} 
                  to={item.path} 
                  className={cn(
                    "transition-colors text-sm font-medium",
                    location.pathname === item.path ? "text-[#d48311]" : "text-slate-300 hover:text-[#d48311]"
                  )}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3 md:gap-6">
            <div className="hidden lg:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search curated pieces..." 
                className="bg-transparent border-none focus:ring-0 text-sm w-48 text-slate-100 placeholder:text-slate-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-3 md:gap-4">
              <button 
                onClick={() => setIsCartOpen(true)}
                className="text-slate-300 hover:text-[#d48311] transition-colors relative p-1"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute top-0 right-0 w-3.5 h-3.5 bg-[#d48311] text-white text-[8px] font-bold rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
              <Link to="/contact" className="text-slate-300 hover:text-[#d48311] transition-colors p-1">
                <User className="w-5 h-5" />
              </Link>
              <button className="md:hidden text-slate-300 p-1" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </nav>
        
        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="md:hidden absolute top-full left-6 right-6 mt-4 bg-[#120e0a] border border-white/10 rounded-3xl p-6 shadow-2xl"
            >
              <div className="flex flex-col gap-4">
                {[...categories, ...navLinks].map((link) => (
                  <Link 
                    key={link.name} 
                    to={link.path} 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-lg font-bold text-slate-100 hover:text-[#d48311] transition-colors"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

const Hero = () => (
  <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
    <div className="absolute inset-0 z-0">
      <div className="absolute inset-0 bg-black/40 z-10"></div>
      <img 
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=2000" 
        alt="Luxury Interior" 
        className="w-full h-full object-cover scale-105 animate-slow-zoom"
        referrerPolicy="no-referrer"
      />
    </div>
    <div className="relative z-20 text-center px-4 max-w-4xl">
      <motion.span 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-[0.2em] uppercase text-[#d48311] bg-[#d48311]/10 border border-[#d48311]/20 rounded-full"
      >
        Est. 1984 • Indian Heritage
      </motion.span>
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-4xl sm:text-5xl md:text-7xl font-bold text-slate-100 mb-6 leading-[1.1] tracking-tight"
      >
        Luxury Living, <span className="italic font-light">Redefined.</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="text-base md:text-xl text-slate-300 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
      >
        Experience the harmony of Deep Charcoal, Warm Teak, and Artisanal Craftsmanship.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-4"
      >
        <Link to="/collections" className="w-full sm:w-auto px-10 py-4 bg-[#d48311] text-white rounded-full font-bold hover:bg-[#d48311]/90 transition-all transform hover:scale-105 shadow-xl shadow-[#d48311]/20 text-center">
          Explore Collections
        </Link>
        <Link to="/bespoke" className="w-full sm:w-auto px-10 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 rounded-full font-bold hover:bg-white/20 transition-all text-center">
          Book a Viewing
        </Link>
      </motion.div>
    </div>
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 animate-bounce">
      <ChevronDown className="w-8 h-8 text-white/50" />
    </div>
  </section>
);

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'model', text: 'Namaste! I am the Nayyer AI Concierge. How can I help you design your perfect space today?' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async () => {
    if ((!input.trim() && !previewImage) || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      image: previewImage || undefined
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = '';
      if (previewImage) {
        responseText = await analyzeFurnitureImage(previewImage, input || undefined);
        setPreviewImage(null);
      } else {
        const history = messages.map(m => ({
          role: m.role,
          parts: [{ text: m.text }]
        }));
        responseText = await chatWithGemini(input, history);
      }

      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText
      }]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-10 md:right-10 z-[9999]">
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-16 right-0 w-[280px] sm:w-[350px] md:w-[400px] max-w-[calc(100vw-32px)] h-[450px] sm:h-[500px] md:h-[600px] bg-[#1a1612] border border-white/10 rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 border-b border-white/10 bg-[#120e0a] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#d48311]/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-[#d48311]" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">Nayyer Concierge</h3>
                  <p className="text-[10px] text-[#d48311] uppercase tracking-widest">Always Online</p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((m) => (
                <div key={m.id} className={cn("flex flex-col", m.role === 'user' ? "items-end" : "items-start")}>
                  <div className={cn(
                    "max-w-[85%] rounded-2xl px-4 py-2 text-sm",
                    m.role === 'user' 
                      ? "bg-[#d48311] text-white rounded-tr-none" 
                      : "bg-white/5 text-slate-200 border border-white/10 rounded-tl-none"
                  )}>
                    {m.image && (
                      <img src={m.image} alt="Uploaded" className="w-full rounded-lg mb-2" />
                    )}
                    <div className="markdown-body prose prose-invert prose-sm">
                      <Markdown>{m.text}</Markdown>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex items-start gap-2">
                  <div className="bg-white/5 border border-white/10 rounded-2xl rounded-tl-none px-4 py-2">
                    <Loader2 className="w-4 h-4 text-[#d48311] animate-spin" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-white/10 bg-[#120e0a]">
              {previewImage && (
                <div className="relative w-20 h-20 mb-2 group">
                  <img src={previewImage} className="w-full h-full object-cover rounded-lg border border-[#d48311]" />
                  <button 
                    onClick={() => setPreviewImage(null)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-lg"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="p-2 text-slate-400 hover:text-[#d48311] transition-colors"
                >
                  <Upload className="w-5 h-5" />
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <input 
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about design or upload a photo..."
                  className="flex-1 bg-white/5 border-white/10 rounded-xl text-sm text-white placeholder:text-slate-500 focus:ring-[#d48311] focus:border-[#d48311]"
                />
                <button 
                  onClick={handleSend}
                  disabled={isLoading}
                  className="p-2 bg-[#d48311] text-white rounded-xl hover:bg-[#d48311]/90 transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-12 h-12 sm:w-16 sm:h-16 bg-[#d48311] text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all group relative z-[9999] animate-pulse-slow"
      >
        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7" />
        <span className="absolute -top-1 -right-1 w-4 h-4 sm:w-5 sm:h-5 bg-red-500 text-[8px] sm:text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#120e0a]">1</span>
      </button>
    </div>
  );
};

const BrandMarquee = () => (
  <div className="py-12 bg-[#120e0a] border-y border-white/5 overflow-hidden">
    <div className="flex whitespace-nowrap animate-marquee">
      {[...Array(2)].map((_, i) => (
        <div key={i} className="flex items-center gap-20 px-10">
          {['VOGUE', 'ARCHITECTURAL DIGEST', 'ELLE DECOR', 'DWELL', 'LUXE', 'WALLPAPER*'].map((brand) => (
            <span key={brand} className="text-2xl md:text-4xl font-bold text-white/20 tracking-tighter italic">{brand}</span>
          ))}
        </div>
      ))}
    </div>
  </div>
);

const FeaturedCollections = () => {
  const [addedItems, setAddedItems] = useState<number[]>([]);
  const { addToCart } = useCart();

  const handleAddToCart = (product: any) => {
    addToCart(product);
    setAddedItems(prev => [...prev, product.id]);
    setTimeout(() => {
      setAddedItems(prev => prev.filter(item => item !== product.id));
    }, 2000);
  };

  const products = [
    { id: 1, name: 'Aura Velvet Chair', price: '₹48,500', category: 'Living Room', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' },
    { id: 2, name: 'Doon Teak Table', price: '₹1,25,000', category: 'Dining Room', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800' },
    { id: 3, name: 'Nirvana Bed Frame', price: '₹89,900', category: 'Bedroom', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800' },
    { id: 4, name: 'Veda Walnut Shelf', price: '₹32,000', category: 'Office', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <section className="py-24 px-6 bg-[#1a1612]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-100 mb-4">Featured Collections</h2>
          <p className="text-slate-400 max-w-xl mx-auto">Curated sets designed to bring sophisticated warmth to your home.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((p, i) => (
            <motion.div 
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-[#120e0a] border border-white/5 rounded-2xl overflow-hidden group"
            >
              <div className="relative aspect-square overflow-hidden">
                <img 
                  src={p.image} 
                  alt={p.name} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <button className="absolute top-4 right-4 w-10 h-10 bg-black/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-[#d48311] transition-colors">
                  <Heart className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6">
                <p className="text-[#d48311] text-xs font-bold uppercase tracking-widest mb-2">{p.category}</p>
                <h4 className="text-lg font-bold text-slate-100 mb-1">{p.name}</h4>
                <p className="text-2xl font-light text-slate-100 mb-4">{p.price}</p>
                <button 
                  onClick={() => handleAddToCart(p)}
                  className={cn(
                    "w-full py-3 border rounded-lg text-sm font-bold transition-all duration-300",
                    addedItems.includes(p.id) 
                      ? "bg-[#d48311] border-[#d48311] text-white" 
                      : "bg-white/5 hover:bg-white/10 border-white/10 text-white"
                  )}
                >
                  {addedItems.includes(p.id) ? "Added to Cart" : "Add to Cart"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="mt-16 text-center">
          <Link to="/collections" className="inline-block px-12 py-4 bg-[#d48311] text-white rounded-full font-bold hover:shadow-lg hover:shadow-[#d48311]/20 transition-all">
            View Entire Catalog
          </Link>
        </div>
      </div>
    </section>
  );
};

const CraftSection = () => (
  <section className="py-24 px-6 bg-white dark:bg-[#120e0a]">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <h3 className="text-[#d48311] font-bold tracking-widest text-sm uppercase mb-4">The Craft</h3>
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">Artisanal Heritage meets Modern Precision</h2>
          <p className="text-slate-600 dark:text-slate-400 text-lg leading-relaxed">
            Every piece is a testament to timeless Indian craftsmanship merged with minimalist aesthetics. We source premium teak and rosewood to create ergonomic masterpieces.
          </p>
        </div>
        <Link to="/craft" className="group flex items-center gap-2 text-[#d48311] font-bold border-b border-[#d48311]/30 pb-1 hover:border-[#d48311] transition-all">
          Discover Our Process <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: 'Master Artisans', desc: 'Handcrafted by generations of skilled woodworkers from Rajasthan.', img: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=800' },
          { title: 'Sustainably Sourced', desc: 'Premium teak and rosewood from certified, eco-conscious forests.', img: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800' },
          { title: 'Precision Design', desc: 'Clean lines meeting ergonomic perfection for ultimate comfort.', img: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800' },
        ].map((item, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="group cursor-pointer"
          >
            <div className="aspect-[4/5] overflow-hidden rounded-2xl mb-6">
              <img 
                src={item.img} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <h4 className="text-xl font-bold mb-2 text-slate-900 dark:text-slate-100">{item.title}</h4>
            <p className="text-slate-500 dark:text-slate-400">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const BespokeSection = () => {
  const [requested, setRequested] = useState(false);

  const handleConsult = () => {
    setRequested(true);
    setTimeout(() => setRequested(false), 3000);
  };

  return (
    <section className="py-24 px-6 bg-[#f5f2ed] dark:bg-[#1a1612]/50">
      <div className="max-w-7xl mx-auto rounded-3xl overflow-hidden relative">
        <div className="grid grid-cols-1 lg:grid-cols-2">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="p-12 lg:p-20 flex flex-col justify-center bg-white dark:bg-[#120e0a]"
          >
            <h2 className="text-4xl font-bold mb-6 text-slate-900 dark:text-slate-100">Bespoke Design Service</h2>
            <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
              Looking for something uniquely yours? Our master designers work with you to create custom pieces tailored to your space and lifestyle.
            </p>
            <ul className="space-y-4 mb-10">
              {['Personalized consultation', 'Material & fabric selection', '3D space visualization'].map((item) => (
                <li key={item} className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-[#d48311]" />
                  {item}
                </li>
              ))}
            </ul>
            <button 
              onClick={handleConsult}
              className={cn(
                "w-fit px-8 py-3 rounded-full font-bold transition-all duration-300 transform hover:scale-105",
                requested ? "bg-green-600 text-white" : "bg-slate-900 dark:bg-[#d48311] text-white"
              )}
            >
              {requested ? "Request Received" : "Consult an Expert"}
            </button>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="relative h-[400px] lg:h-auto"
          >
            <img 
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
              alt="Design Service" 
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-[#120e0a] border-t border-white/5 pt-20 pb-10 px-6">
    <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
      <div className="flex flex-col gap-6">
        <Link to="/" className="flex items-center gap-2 text-[#d48311]">
          <Sofa className="w-6 h-6" />
          <h2 className="text-slate-100 text-xl font-extrabold tracking-tight">NAYYER</h2>
        </Link>
        <p className="text-slate-500 leading-relaxed">Crafting luxury experiences through timeless furniture since 1984. From our workshop to your home.</p>
      </div>
      <div>
        <h5 className="text-slate-100 font-bold mb-6">Explore</h5>
        <ul className="space-y-4 text-slate-500">
          {[
            { name: 'Collections', path: '/collections' },
            { name: 'Living Room', path: '/living-room' },
            { name: 'Bedroom', path: '/bedroom' },
            { name: 'Dining', path: '/dining' }
          ].map(item => (
            <li key={item.name}><Link to={item.path} className="hover:text-[#d48311] transition-colors">{item.name}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h5 className="text-slate-100 font-bold mb-6">Company</h5>
        <ul className="space-y-4 text-slate-500">
          {[
            { name: 'Our Story', path: '/story' },
            { name: 'The Craft', path: '/craft' },
            { name: 'Showrooms', path: '/showroom' },
            { name: 'Sustainability', path: '/sustainability' },
            { name: 'FAQ', path: '/faq' },
            { name: 'Contact Us', path: '/contact' }
          ].map(item => (
            <li key={item.name}><Link to={item.path} className="hover:text-[#d48311] transition-colors">{item.name}</Link></li>
          ))}
        </ul>
      </div>
      <div>
        <h5 className="text-slate-100 font-bold mb-6">Stay Inspired</h5>
        <p className="text-slate-500 mb-6 text-sm">Join our mailing list for curated design trends.</p>
        <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
          <input 
            type="email" 
            placeholder="Email address" 
            className="flex-1 bg-white/5 border-white/10 rounded-lg text-sm px-4 focus:ring-[#d48311] text-white"
          />
          <button className="px-6 py-2 bg-[#d48311] text-white font-bold rounded-lg text-sm">Join</button>
        </form>
      </div>
    </div>
    <div className="max-w-7xl mx-auto pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-600 text-sm">
      <p>© 2024 Nayyer Furniture Private Ltd. All rights reserved.</p>
      <div className="flex gap-8">
        <Link to="/" className="hover:text-slate-400">Privacy Policy</Link>
        <Link to="/" className="hover:text-slate-400">Terms of Service</Link>
      </div>
    </div>
  </footer>
);

const Testimonials = () => (
  <section className="py-24 px-6 bg-[#120e0a]">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-white text-center mb-16 italic">"Nayyer pieces aren't just furniture; they are heirlooms."</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {[
          { name: 'Ananya Sharma', role: 'Interior Architect', text: "The attention to detail in the joinery is something you rarely see in modern furniture. Truly world-class." },
          { name: 'Vikram Malhotra', role: 'Homeowner', text: "Our living room was transformed. The warm teak brings a soul to the space that we couldn't find elsewhere." },
          { name: 'Siddharth Roy', role: 'Design Enthusiast', text: "The bespoke service was seamless. They understood my vision and executed it with absolute precision." },
        ].map((t, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-8 bg-white/5 rounded-3xl border border-white/10"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 text-[#d48311] fill-[#d48311]" />)}
            </div>
            <p className="text-slate-300 mb-6 italic">"{t.text}"</p>
            <div>
              <p className="text-white font-bold">{t.name}</p>
              <p className="text-[#d48311] text-xs uppercase tracking-widest">{t.role}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const HomePage = () => (
  <>
    <Hero />
    <BrandMarquee />
    <CraftSection />
    <FeaturedCollections />
    <Testimonials />
    <BespokeSection />
  </>
);

export default function App() {
  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-[#f8f7f6] dark:bg-[#120e0a] text-slate-900 dark:text-slate-100 font-display selection:bg-[#d48311]/30">
          <ChatBot />
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/collections" element={<CollectionsPage />} />
              <Route path="/craft" element={<CraftPage />} />
              <Route path="/bespoke" element={<BespokePage />} />
              <Route path="/showroom" element={<ShowroomPage />} />
              <Route path="/living-room" element={<LivingRoomPage />} />
              <Route path="/bedroom" element={<BedroomPage />} />
              <Route path="/dining" element={<DiningPage />} />
              <Route path="/story" element={<StoryPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/sustainability" element={<SustainabilityPage />} />
              <Route path="/faq" element={<FAQPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
