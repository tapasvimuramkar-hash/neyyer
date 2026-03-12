import React from 'react';
import { motion } from 'motion/react';
import { 
  Sofa, 
  ArrowRight, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock,
  Star,
  Shield,
  Truck,
  Hammer,
  Palette,
  Users
} from 'lucide-react';

import { useCart } from './context/CartContext';

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Shared Components ---
const PageHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <section className="pt-24 md:pt-32 pb-12 md:pb-16 px-6 bg-[#120e0a]">
    <div className="max-w-7xl mx-auto text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl sm:text-4xl md:text-6xl font-bold text-white mb-4"
      >
        {title}
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-sm md:text-base text-slate-400 max-w-2xl mx-auto"
      >
        {subtitle}
      </motion.p>
    </div>
  </section>
);

// --- 1. Home Page (Already in App.tsx, but we'll move it to a component) ---
// We'll keep Home in App.tsx for now or move it later.

// --- 2. Collections Page ---
export const CollectionsPage = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setProducts(data))
      .catch(err => {
        console.error("Failed to fetch products:", err);
        // Fallback data if API fails
        setProducts([
          { id: 'aura-velvet-chair', name: 'Aura Velvet Chair', price: '₹48,500', category: 'Living Room', image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' },
          { id: 'doon-teak-table', name: 'Doon Teak Table', price: '₹1,25,000', category: 'Dining Room', image: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800' },
          { id: 'nirvana-bed-frame', name: 'Nirvana Bed Frame', price: '₹89,900', category: 'Bedroom', image: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800' },
          { id: 'veda-walnut-shelf', name: 'Veda Walnut Shelf', price: '₹32,000', category: 'Office', image: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800' },
          { id: 'zenith-sofa', name: 'Zenith Sofa', price: '₹1,85,000', category: 'Living Room', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
          { id: 'lumina-lamp', name: 'Lumina Lamp', price: '₹12,500', category: 'Decor', image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
        ]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1612]">
      <PageHeader title="Our Collections" subtitle="Explore our curated sets designed to bring sophisticated warmth to your home." />
      
      {/* Moving Images Section */}
      <section className="py-8 md:py-12 bg-[#120e0a] overflow-hidden">
        <div className="flex whitespace-nowrap animate-marquee">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-4 md:gap-8 px-2 md:px-4">
              {products.map((p, idx) => (
                <div key={`${i}-${idx}`} className="w-48 h-64 md:w-64 md:h-80 flex-shrink-0 rounded-2xl overflow-hidden relative group">
                  <img src={p.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                    <p className="text-white font-bold text-sm md:text-base">{p.name}</p>
                    <p className="text-[#d48311] text-[10px] md:text-xs uppercase font-bold">{p.category}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </section>

      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((p, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="bg-[#120e0a] border border-white/5 rounded-2xl overflow-hidden group"
            >
              <div className="aspect-square overflow-hidden">
                <img src={p.image} alt={p.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" referrerPolicy="no-referrer" />
              </div>
              <div className="p-6">
                <p className="text-[#d48311] text-xs font-bold uppercase mb-2">{p.category}</p>
                <h3 className="text-xl font-bold text-white mb-2">{p.name}</h3>
                <p className="text-2xl font-light text-white mb-4">{p.price}</p>
                <div className="flex gap-2">
                  <button className="flex-1 py-3 bg-[#d48311] text-white rounded-lg font-bold hover:bg-[#d48311]/90 transition-all">View Details</button>
                  <button 
                    onClick={(e) => {
                      addToCart(p);
                      const btn = e.currentTarget;
                      const originalText = btn.innerText;
                      btn.innerText = "Added";
                      btn.classList.add("bg-green-600");
                      setTimeout(() => {
                        btn.innerText = originalText;
                        btn.classList.remove("bg-green-600");
                      }, 2000);
                    }}
                    className="px-4 py-3 bg-white/10 text-white rounded-lg font-bold hover:bg-white/20 transition-all"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- 3. The Craft Page ---
export const CraftPage = () => (
  <div className="min-h-screen bg-[#120e0a]">
    <PageHeader title="The Craft" subtitle="A legacy of artisanal excellence passed down through generations." />
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Hand-Selected Materials</h2>
          <p className="text-sm md:text-base text-slate-400 mb-8 leading-relaxed">
            We source only the finest Grade-A teak and rosewood from sustainable plantations. Each log is inspected for grain consistency and moisture content before it ever reaches our workshop.
          </p>
          <div className="grid grid-cols-2 gap-4 md:gap-6">
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <Shield className="w-6 h-6 md:w-8 md:h-8 text-[#d48311] mb-2" />
              <h4 className="text-white font-bold text-sm md:text-base">Durability</h4>
              <p className="text-[10px] md:text-xs text-slate-500">Built to last for generations.</p>
            </div>
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <Hammer className="w-6 h-6 md:w-8 md:h-8 text-[#d48311] mb-2" />
              <h4 className="text-white font-bold text-sm md:text-base">Precision</h4>
              <p className="text-[10px] md:text-xs text-slate-500">Millimeter-perfect joinery.</p>
            </div>
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="rounded-3xl overflow-hidden h-[300px] md:h-[500px]">
          <img src="https://images.unsplash.com/photo-1504148455328-c376907d081c?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </motion.div>
      </div>
    </section>
  </div>
);

// --- 4. Bespoke Page ---
export const BespokePage = () => (
  <div className="min-h-screen bg-[#1a1612]">
    <PageHeader title="Bespoke Services" subtitle="Your vision, our craftsmanship. Create furniture that is uniquely yours." />
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
        <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }}>
          <img 
            src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200" 
            className="rounded-3xl shadow-2xl w-full h-[300px] md:h-[600px] object-cover" 
            referrerPolicy="no-referrer" 
          />
        </motion.div>
        <div className="bg-[#120e0a] p-6 md:p-12 rounded-3xl border border-white/10">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 md:mb-8">Start Your Custom Project</h2>
          <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            <input type="text" placeholder="Full Name" className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none" />
            <input type="email" placeholder="Email Address" className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none" />
            <select className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none md:col-span-2">
              <option>Select Room Type</option>
              <option>Living Room</option>
              <option>Bedroom</option>
              <option>Dining Room</option>
              <option>Office</option>
            </select>
            <textarea placeholder="Tell us about your vision..." className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none md:col-span-2 h-32"></textarea>
            <button className="md:col-span-2 py-3 md:py-4 bg-[#d48311] text-white rounded-xl font-bold hover:bg-[#d48311]/90 transition-all">Submit Inquiry</button>
          </form>
        </div>
      </div>
    </section>
  </div>
);

// --- 5. Showroom Page ---
export const ShowroomPage = () => (
  <div className="min-h-screen bg-[#120e0a]">
    <PageHeader title="Our Showrooms" subtitle="Visit us to experience the texture and comfort of Nayyer furniture in person." />
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {[
          { city: 'Mumbai', address: '123 Luxury Lane, Worli, Mumbai 400018', phone: '+91 22 1234 5678', img: 'https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&q=80&w=800' },
          { city: 'New Delhi', address: '45 Heritage Block, Mehrauli, New Delhi 110030', phone: '+91 11 8765 4321', img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800' },
        ].map((loc, i) => (
          <motion.div key={i} whileHover={{ y: -10 }} className="bg-white/5 rounded-3xl overflow-hidden border border-white/10">
            <img src={loc.img} className="w-full h-48 md:h-64 object-cover" referrerPolicy="no-referrer" />
            <div className="p-6 md:p-8">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-4">{loc.city} Flagship</h3>
              <div className="space-y-3 text-sm md:text-base text-slate-400">
                <p className="flex items-center gap-3"><MapPin className="w-4 h-4 md:w-5 md:h-5 text-[#d48311]" /> {loc.address}</p>
                <p className="flex items-center gap-3"><Phone className="w-4 h-4 md:w-5 md:h-5 text-[#d48311]" /> {loc.phone}</p>
                <p className="flex items-center gap-3"><Clock className="w-4 h-4 md:w-5 md:h-5 text-[#d48311]" /> Mon - Sat: 10:00 AM - 8:00 PM</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  </div>
);

// --- 6. Living Room Page ---
export const LivingRoomPage = () => {
  const [added, setAdded] = React.useState(false);
  const { addToCart } = useCart();
  return (
    <div className="min-h-screen bg-[#1a1612]">
      <PageHeader title="Living Room" subtitle="The heart of your home, designed for comfort and conversation." />
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <img src="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200" className="rounded-3xl h-[300px] md:h-[400px] w-full object-cover" referrerPolicy="no-referrer" />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Sophisticated Comfort</h2>
            <p className="text-sm md:text-base text-slate-400 mb-6">Our living room collection features ergonomic sofas, handcrafted coffee tables, and accent chairs that define modern luxury.</p>
            <button 
              onClick={() => { 
                addToCart({ id: 'living-room-collection', name: 'Living Room Collection', price: '₹1,85,000', image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=1200' });
                setAdded(true); 
                setTimeout(() => setAdded(false), 2000); 
              }}
              className={cn("w-full sm:w-fit px-8 py-3 rounded-full font-bold transition-all", added ? "bg-green-600 text-white" : "bg-[#d48311] text-white")}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- 7. Bedroom Page ---
export const BedroomPage = () => {
  const [added, setAdded] = React.useState(false);
  const { addToCart } = useCart();
  return (
    <div className="min-h-screen bg-[#120e0a]">
      <PageHeader title="Bedroom" subtitle="Your personal sanctuary, crafted for restful nights and peaceful mornings." />
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <div className="flex flex-col justify-center order-2 md:order-1">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Timeless Serenity</h2>
            <p className="text-sm md:text-base text-slate-400 mb-6">From solid teak bed frames to walnut nightstands, every piece is designed to create a calming atmosphere.</p>
            <button 
              onClick={() => { 
                addToCart({ id: 'bedroom-collection', name: 'Bedroom Collection', price: '₹89,900', image: 'https://images.unsplash.com/photo-1505693419173-42b92568f01a?auto=format&fit=crop&q=80&w=1200' });
                setAdded(true); 
                setTimeout(() => setAdded(false), 2000); 
              }}
              className={cn("w-full sm:w-fit px-8 py-3 rounded-full font-bold transition-all", added ? "bg-green-600 text-white" : "bg-[#d48311] text-white")}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
          <img src="https://images.unsplash.com/photo-1505693419173-42b92568f01a?auto=format&fit=crop&q=80&w=1200" className="rounded-3xl h-[300px] md:h-[400px] w-full object-cover order-1 md:order-2" referrerPolicy="no-referrer" />
        </div>
      </section>
    </div>
  );
};

// --- 8. Dining Page ---
export const DiningPage = () => {
  const [added, setAdded] = React.useState(false);
  const { addToCart } = useCart();
  return (
    <div className="min-h-screen bg-[#1a1612]">
      <PageHeader title="Dining Room" subtitle="Where memories are made over shared meals and elegant settings." />
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          <img src="https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=1200" className="rounded-3xl h-[300px] md:h-[400px] w-full object-cover" referrerPolicy="no-referrer" />
          <div className="flex flex-col justify-center">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Artisanal Dining</h2>
            <p className="text-sm md:text-base text-slate-400 mb-6">Our dining tables are carved from single slabs of premium wood, paired with chairs that offer both style and support.</p>
            <button 
              onClick={() => { 
                addToCart({ id: 'dining-collection', name: 'Dining Collection', price: '₹1,25,000', image: 'https://images.unsplash.com/photo-1577146333359-b9fdd1b49d0d?auto=format&fit=crop&q=80&w=1200' });
                setAdded(true); 
                setTimeout(() => setAdded(false), 2000); 
              }}
              className={cn("w-full sm:w-fit px-8 py-3 rounded-full font-bold transition-all", added ? "bg-green-600 text-white" : "bg-[#d48311] text-white")}
            >
              {added ? "Added to Cart" : "Add to Cart"}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

// --- 9. Our Story Page ---
export const StoryPage = () => (
  <div className="min-h-screen bg-[#120e0a]">
    <PageHeader title="Our Story" subtitle="A journey of passion, wood, and timeless design since 1984." />
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">The Nayyer Legacy</h2>
          <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-8">
            Founded in the heart of Rajasthan, Nayyer Furniture began as a small workshop dedicated to preserving traditional carving techniques. Today, we are a global brand that stays true to its roots.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#d48311] mb-2">40+</h3>
              <p className="text-slate-500 text-[10px] md:text-sm uppercase tracking-widest">Years of Craft</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#d48311] mb-2">150+</h3>
              <p className="text-slate-500 text-[10px] md:text-sm uppercase tracking-widest">Master Artisans</p>
            </div>
            <div>
              <h3 className="text-3xl md:text-4xl font-bold text-[#d48311] mb-2">10k+</h3>
              <p className="text-slate-500 text-[10px] md:text-sm uppercase tracking-widest">Homes Transformed</p>
            </div>
          </div>
        </motion.div>
        <img src="https://images.unsplash.com/photo-1519710164239-da123dc03ef4?auto=format&fit=crop&q=80&w=1200" className="rounded-3xl w-full h-[250px] md:h-[400px] object-cover mb-12 md:mb-16" referrerPolicy="no-referrer" />
      </div>
    </section>
  </div>
);

// --- 11. Sustainability Page ---
export const SustainabilityPage = () => (
  <div className="min-h-screen bg-[#120e0a]">
    <PageHeader title="Sustainability" subtitle="Our commitment to the planet and future generations." />
    <section className="py-12 md:py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 items-center mb-12 md:mb-20">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }}>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-6">Ethical Sourcing</h2>
            <p className="text-sm md:text-base text-slate-400 leading-relaxed mb-6">
              We only use wood from FSC-certified forests. For every tree we use, we plant ten more in our dedicated reforestation zones in Rajasthan and Madhya Pradesh.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="text-xl md:text-2xl text-[#d48311] font-bold mb-1 md:mb-2">100%</h4>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase">Certified Wood</p>
              </div>
              <div className="flex-1 p-4 md:p-6 bg-white/5 rounded-2xl border border-white/10">
                <h4 className="text-xl md:text-2xl text-[#d48311] font-bold mb-1 md:mb-2">Zero</h4>
                <p className="text-[10px] md:text-xs text-slate-500 uppercase">Waste Policy</p>
              </div>
            </div>
          </motion.div>
          <div className="rounded-3xl overflow-hidden h-[300px] md:h-[400px]">
            <img src="https://images.unsplash.com/photo-1542601906990-b4d3fb773b09?auto=format&fit=crop&q=80&w=1200" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </div>
        </div>
      </div>
    </section>
  </div>
);

// --- 12. FAQ Page ---
export const FAQPage = () => {
  const faqs = [
    { q: 'Do you offer international shipping?', a: 'Yes, we ship our artisanal pieces worldwide. Shipping costs and delivery times vary by location.' },
    { q: 'What is your return policy?', a: 'We offer a 30-day return policy for standard collection items. Bespoke pieces are non-refundable but come with a lifetime warranty.' },
    { q: 'How do I care for my teak furniture?', a: 'We recommend using a damp cloth for regular cleaning and applying a high-quality teak oil every 6 months to maintain the luster.' },
    { q: 'Can I visit the workshop?', a: 'Yes, we offer guided tours of our Rajasthan workshop by appointment. Please contact our concierge to book.' },
  ];

  return (
    <div className="min-h-screen bg-[#1a1612]">
      <PageHeader title="Frequently Asked Questions" subtitle="Everything you need to know about Nayyer craftsmanship and services." />
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-4 md:space-y-6">
          {faqs.map((faq, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-[#120e0a] border border-white/10 p-6 md:p-8 rounded-3xl"
            >
              <h3 className="text-lg md:text-xl font-bold text-white mb-4">{faq.q}</h3>
              <p className="text-sm md:text-base text-slate-400 leading-relaxed">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

// --- 10. Contact Page ---
export const ContactPage = () => {
  const [submitted, setSubmitted] = React.useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-[#1a1612]">
      <PageHeader title="Contact Us" subtitle="We're here to help you create your perfect home." />
      <section className="py-12 md:py-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          <div className="lg:col-span-1 space-y-6 md:space-y-8">
            <div className="bg-[#120e0a] p-6 md:p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold text-white mb-6">Get in Touch</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#d48311]/20 rounded-full flex items-center justify-center text-[#d48311]">
                    <Mail className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold">Email</p>
                    <p className="text-sm md:text-base text-white">concierge@nayyer.com</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-[#d48311]/20 rounded-full flex items-center justify-center text-[#d48311]">
                    <Phone className="w-5 h-5 md:w-6 md:h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] md:text-xs text-slate-500 uppercase font-bold">Phone</p>
                    <p className="text-sm md:text-base text-white">+91 22 1234 5678</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-[#120e0a] p-6 md:p-12 rounded-3xl border border-white/10">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-8">Send a Message</h3>
            {submitted ? (
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-8 md:p-12 text-center">
                <CheckCircle2 className="w-12 h-12 md:w-16 md:h-16 text-[#d48311] mx-auto mb-4" />
                <h4 className="text-xl md:text-2xl font-bold text-white mb-2">Message Sent!</h4>
                <p className="text-sm md:text-base text-slate-400">We will get back to you within 24 hours.</p>
              </motion.div>
            ) : (
              <form className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6" onSubmit={handleSubmit}>
                <input required type="text" placeholder="Name" className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none" />
                <input required type="email" placeholder="Email" className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none" />
                <input required type="text" placeholder="Subject" className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none md:col-span-2" />
                <textarea required placeholder="Message" className="bg-white/5 border-white/10 rounded-xl p-3 md:p-4 text-sm md:text-base text-white focus:ring-[#d48311] outline-none md:col-span-2 h-32"></textarea>
                <button type="submit" className="md:col-span-2 py-3 md:py-4 bg-[#d48311] text-white rounded-xl font-bold hover:bg-[#d48311]/90 transition-all">Send Message</button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
