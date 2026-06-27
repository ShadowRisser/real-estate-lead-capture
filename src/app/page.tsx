'use client';

import { useState, useEffect, useRef, useCallback, type FormEvent } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Search, MapPin, Home, Bed, Bath, Maximize, Star,
  Menu, X, Sparkles, Send, ChevronLeft, ChevronRight,
  Phone, Mail, MapPinIcon, Building2, ArrowRight,
  Loader2, Check, MessageSquare, Eye, Heart, Users,
  Globe, Trophy, Shield, Clock, Facebook, Instagram,
  Twitter, Linkedin, Quote, Bot, User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetHeader } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

/* ───────── Types ───────── */
interface Property {
  id: string; title: string; description: string; price: number;
  address: string; city: string; state: string; bedrooms: number;
  bathrooms: number; sqft: number; lotSize?: string; yearBuilt?: number;
  propertyType: string; imageUrl: string;
}

interface ChatMessage { role: 'user' | 'assistant'; content: string; }

/* ───────── Helpers ───────── */
const fmt = (n: number) => n >= 1_000_000 ? `$${(n / 1_000_000).toFixed(n % 1_000_000 === 0 ? 0 : 1)}M` : `$${(n / 1_000).toFixed(0)}K`;

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] } }) };
const stagger = { visible: { transition: { staggerChildren: 0.08 } } };

/* ───────── Data ───────── */
const TESTIMONIALS = [
  { name: 'Alexander Morrison', title: 'CEO, TechVentures Capital', quote: 'Prestige Estates found us our dream oceanfront villa in Malibu within three weeks. Their understanding of what we truly wanted was remarkable — they didn\'t just show us houses, they showed us our future home.', rating: 5 },
  { name: 'Victoria Chen', title: 'Founder, Lumière Fashion', quote: 'The level of white-glove service is unmatched. From private jet viewings to personalized property shortlists, every detail was handled with absolute sophistication. They truly understand the luxury buyer.', rating: 5 },
  { name: 'James & Sarah Rothwell', title: 'Private Equity Partners', quote: 'We\'ve worked with agencies across three continents. Prestige Estates stands apart. Their market intelligence, negotiation expertise, and post-purchase support made our $12M penthouse acquisition seamless.', rating: 5 },
  { name: 'Dr. Amara Okafor', title: 'Chief Surgeon, Cedars Medical', quote: 'Finding a home that balances privacy, proximity to the hospital, and luxury living seemed impossible — until Prestige Estates delivered exactly that. Their team\'s dedication is extraordinary.', rating: 5 },
];

const PARTNERS = ["Sotheby's", "Christie's", "Forbes", "Robb Report", "Architectural Digest", "Bloomberg"];

const STATS = [
  { icon: Home, value: 2500, suffix: '+', label: 'Properties Sold', desc: 'Luxury homes closed worldwide' },
  { icon: Trophy, value: 8.2, suffix: 'B', prefix: '$', label: 'Total Sales Volume', desc: 'In premium real estate' },
  { icon: Users, value: 150, suffix: '+', label: 'Expert Agents', desc: 'Across 45 countries' },
  { icon: Globe, value: 45, suffix: '', label: 'Countries', desc: 'Global property network' },
];

/* ══════════════════════════════════════════════════════════════
   MAIN PAGE
   ══════════════════════════════════════════════════════════════ */
export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#050505]">
      <Navigation />
      <main className="flex-1">
        <HeroSection />
        <PartnersBar />
        <FeaturedProperties />
        <StatsSection />
        <NeighborhoodsSection />
        <TestimonialsSection />
        <LeadCTASection />
      </main>
      <Footer />
      <AIChatWidget />
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════
   1. NAVIGATION
   ══════════════════════════════════════════════════════════════ */
function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', h, { passive: true });
    return () => window.removeEventListener('scroll', h);
  }, []);

  const links = [
    { label: 'Properties', href: '#properties' },
    { label: 'Neighborhoods', href: '#neighborhoods' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <motion.header
      initial={{ y: -100 }} animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'glass shadow-lg shadow-black/20' : 'bg-transparent'}`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Logo */}
        <a href="#" className="flex items-center gap-1 group">
          <span className="gold-shimmer text-xl sm:text-2xl font-bold tracking-[0.15em]">PRESTIGE</span>
          <span className="text-xl sm:text-2xl font-light tracking-[0.15em] text-white/80 group-hover:text-white transition-colors">ESTATES</span>
        </a>

        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-sm text-white/60 hover:text-white transition-colors tracking-wide">
              {l.label}
            </a>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden lg:block">
          <Button className="bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-black font-semibold hover:from-[#E8D48B] hover:to-[#C9A84C] transition-all duration-300 rounded-full px-6">
            Schedule Viewing
          </Button>
        </div>

        {/* Mobile Menu */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild className="lg:hidden">
            <Button variant="ghost" size="icon" className="text-white hover:text-[#C9A84C]">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="bg-[#0A0A0A] border-l border-[#1E1E1E] w-80">
            <SheetHeader>
              <SheetTitle className="text-left">
                <span className="text-gold-gradient font-bold">PRESTIGE</span>{' '}
                <span className="text-white/80 font-light">ESTATES</span>
              </SheetTitle>
            </SheetHeader>
            <div className="mt-8 flex flex-col gap-6">
              {links.map((l) => (
                <a
                  key={l.href} href={l.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-lg text-white/70 hover:text-[#C9A84C] transition-colors"
                >
                  {l.label}
                </a>
              ))}
              <Separator className="bg-[#1E1E1E]" />
              <Button className="bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-black font-semibold rounded-full w-full">
                Schedule Viewing
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </motion.header>
  );
}

/* ══════════════════════════════════════════════════════════════
   2. HERO SECTION
   ══════════════════════════════════════════════════════════════ */
function HeroSection() {
  const [location, setLocation] = useState('all');
  const [type, setType] = useState('all');
  const [priceRange, setPriceRange] = useState('any');

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location !== 'all') params.set('city', location);
    if (type !== 'all') params.set('type', type);
    if (priceRange !== 'any') {
      const ranges: Record<string, [string, string]> = { '1-3': ['1000000', '3000000'], '3-5': ['3000000', '5000000'], '5-10': ['5000000', '10000000'], '10+': ['10000000', '100000000'] };
      const r = ranges[priceRange];
      if (r) { params.set('minPrice', r[0]); params.set('maxPrice', r[1]); }
    }
    const el = document.getElementById('properties');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      window.dispatchEvent(new CustomEvent('hero-search', { detail: Object.fromEntries(params) }));
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero.png)' }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-black/50" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <motion.div
          initial="hidden" animate="visible" variants={stagger}
          className="flex flex-col items-center text-center"
        >
          {/* Badge */}
          <motion.div variants={fadeUp} custom={0}>
            <Badge className="bg-white/5 border border-[#C9A84C]/30 text-[#C9A84C] px-4 py-1.5 text-sm rounded-full backdrop-blur-sm mb-8">
              <Star className="w-3.5 h-3.5 mr-1.5 fill-[#C9A84C]" />
              #1 Luxury Real Estate Agency 2024
            </Badge>
          </motion.div>

          {/* Heading */}
          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight max-w-5xl">
            Where{' '}
            <span className="gold-shimmer">Extraordinary</span>
            <br />Living Begins
          </motion.h1>

          {/* Subtext */}
          <motion.p variants={fadeUp} custom={2} className="mt-6 text-base sm:text-lg md:text-xl text-white/60 max-w-2xl leading-relaxed">
            Curating the world&apos;s most exceptional residences for discerning buyers who accept nothing less than perfection.
          </motion.p>

          {/* Search Bar */}
          <motion.div variants={fadeUp} custom={3} className="mt-10 w-full max-w-4xl">
            <div className="glass rounded-2xl p-3 sm:p-4">
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                    <MapPin className="w-4 h-4 mr-2 text-[#C9A84C] shrink-0" />
                    <SelectValue placeholder="Location" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-[#1E1E1E]">
                    <SelectItem value="all">All Locations</SelectItem>
                    <SelectItem value="Malibu">Malibu, CA</SelectItem>
                    <SelectItem value="Manhattan">Manhattan, NY</SelectItem>
                    <SelectItem value="Greenwich">Greenwich, CT</SelectItem>
                    <SelectItem value="Scottsdale">Scottsdale, AZ</SelectItem>
                    <SelectItem value="Santa Barbara">Santa Barbara, CA</SelectItem>
                    <SelectItem value="Lake Tahoe">Lake Tahoe, CA</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={type} onValueChange={setType}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                    <Home className="w-4 h-4 mr-2 text-[#C9A84C] shrink-0" />
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-[#1E1E1E]">
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="Villa">Villa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Estate">Estate</SelectItem>
                    <SelectItem value="Modern">Modern</SelectItem>
                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="Lodge">Lodge</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priceRange} onValueChange={setPriceRange}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                    <span className="text-[#C9A84C] mr-2 text-sm font-semibold">$</span>
                    <SelectValue placeholder="Price Range" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-[#1E1E1E]">
                    <SelectItem value="any">Any Price</SelectItem>
                    <SelectItem value="1-3">$1M - $3M</SelectItem>
                    <SelectItem value="3-5">$3M - $5M</SelectItem>
                    <SelectItem value="5-10">$5M - $10M</SelectItem>
                    <SelectItem value="10+">$10M+</SelectItem>
                  </SelectContent>
                </Select>

                <Button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-black font-semibold h-12 rounded-xl hover:from-[#E8D48B] hover:to-[#C9A84C] transition-all duration-300"
                >
                  <Search className="w-4 h-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div variants={fadeUp} custom={4} className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 w-full max-w-4xl">
            {[
              { val: '2,500+', label: 'Properties Sold' },
              { val: '$8.2B', label: 'Total Sales' },
              { val: '15 Yrs', label: 'Excellence' },
              { val: '98%', label: 'Satisfaction' },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gold-gradient">{s.val}</div>
                <div className="text-xs sm:text-sm text-white/40 mt-1 tracking-wider uppercase">{s.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <div className="w-6 h-10 rounded-full border-2 border-white/20 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 bg-[#C9A84C] rounded-full" />
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   3. PARTNERS BAR
   ══════════════════════════════════════════════════════════════ */
function PartnersBar() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <section ref={ref} className="py-12 md:py-16">
      <div className="gold-divider mb-10" />
      <motion.div
        initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <motion.p variants={fadeUp} custom={0} className="text-center text-sm text-white/30 tracking-[0.2em] uppercase mb-8">
          Trusted by industry leaders worldwide
        </motion.p>
        <motion.div variants={fadeUp} custom={1} className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {PARTNERS.map((p) => (
            <span key={p} className="text-lg md:text-xl font-light text-white/20 hover:text-white/40 transition-colors tracking-wider">
              {p}
            </span>
          ))}
        </motion.div>
      </motion.div>
      <div className="gold-divider mt-10" />
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   4. FEATURED PROPERTIES
   ══════════════════════════════════════════════════════════════ */
function FeaturedProperties() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Property | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    const fetchProps = async () => {
      try {
        const res = await fetch('/api/properties?featured=true');
        const data = await res.json();
        if (data.success) setProperties(data.properties);
      } catch { /* fallback data */ }
      setLoading(false);
    };
    fetchProps();
  }, []);

  const openDetail = (p: Property) => { setSelected(p); setDialogOpen(true); };

  return (
    <section id="properties" className="py-20 md:py-32" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
          className="text-center mb-16"
        >
          <motion.p variants={fadeUp} custom={0} className="text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-4">Portfolio</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Curated <span className="text-gold-gradient">Collection</span>
          </motion.h2>
          <motion.p variants={fadeUp} custom={2} className="mt-4 text-white/50 max-w-xl mx-auto">
            Handpicked properties that define luxury living — each one a masterpiece of architecture and design.
          </motion.p>
        </motion.div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-[#111]">
                <Skeleton className="w-full h-56" />
                <div className="p-6 space-y-3">
                  <Skeleton className="h-6 w-24" />
                  <Skeleton className="h-5 w-48" />
                  <Skeleton className="h-4 w-32" />
                  <div className="flex gap-4 pt-2"><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /><Skeleton className="h-4 w-16" /></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <motion.div
            initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {properties.map((p, i) => (
              <motion.div key={p.id} variants={fadeUp} custom={i} className="luxury-card rounded-2xl overflow-hidden bg-[#111] cursor-pointer group" onClick={() => openDetail(p)}>
                {/* Image */}
                <div className="relative img-zoom h-56 sm:h-64">
                  <img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <Badge className="absolute top-4 left-4 bg-[#C9A84C] text-black font-semibold text-xs rounded-full px-3">
                    Featured
                  </Badge>
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={(e) => { e.stopPropagation(); toast('Added to favorites'); }}
                      className="w-9 h-9 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center hover:bg-[#C9A84C] transition-colors"
                    >
                      <Heart className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="absolute bottom-4 left-4">
                    <span className="text-2xl font-bold text-white">{fmt(p.price)}</span>
                  </div>
                </div>
                {/* Content */}
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white group-hover:text-[#C9A84C] transition-colors">{p.title}</h3>
                  <p className="text-sm text-white/40 mt-1 flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" /> {p.city}, {p.state}
                  </p>
                  <Separator className="bg-white/5 my-4" />
                  <div className="flex items-center justify-between text-sm text-white/50">
                    <span className="flex items-center gap-1.5"><Bed className="w-4 h-4 text-[#C9A84C]" /> {p.bedrooms} Beds</span>
                    <span className="flex items-center gap-1.5"><Bath className="w-4 h-4 text-[#C9A84C]" /> {p.bathrooms} Baths</span>
                    <span className="flex items-center gap-1.5"><Maximize className="w-4 h-4 text-[#C9A84C]" /> {p.sqft.toLocaleString()}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Property Detail Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl bg-[#0A0A0A] border-[#1E1E1E] max-h-[90vh] overflow-y-auto">
          {selected && (
            <>
              <div className="relative h-64 sm:h-80 -mx-6 -mt-6 mb-6 img-zoom">
                <img src={selected.imageUrl} alt={selected.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent" />
                <Badge className="absolute top-6 left-6 bg-[#C9A84C] text-black font-semibold">{selected.propertyType}</Badge>
              </div>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-white">{selected.title}</DialogTitle>
                <DialogDescription className="text-white/50 flex items-center gap-1">
                  <MapPin className="w-4 h-4" /> {selected.address}, {selected.city}, {selected.state}
                </DialogDescription>
              </DialogHeader>
              <div className="text-3xl font-bold text-gold-gradient mt-2">{fmt(selected.price)}</div>
              <p className="text-white/60 leading-relaxed mt-4">{selected.description}</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                {[
                  { icon: Bed, val: selected.bedrooms, label: 'Bedrooms' },
                  { icon: Bath, val: selected.bathrooms, label: 'Bathrooms' },
                  { icon: Maximize, val: selected.sqft.toLocaleString(), label: 'Sq Ft' },
                  { icon: CalendarIcon, val: selected.yearBuilt?.toString() || 'N/A', label: 'Year Built' },
                ].map((s) => (
                  <div key={s.label} className="bg-white/5 rounded-xl p-3 text-center">
                    <s.icon className="w-5 h-5 mx-auto text-[#C9A84C] mb-1" />
                    <div className="text-white font-semibold">{s.val}</div>
                    <div className="text-xs text-white/40">{s.label}</div>
                  </div>
                ))}
              </div>
              <div className="flex gap-3 mt-6">
                <Button className="flex-1 bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-black font-semibold rounded-xl h-12">
                  <Eye className="w-4 h-4 mr-2" /> Schedule Private Viewing
                </Button>
                <Button variant="outline" className="border-[#1E1E1E] text-white hover:bg-white/5 rounded-xl h-12">
                  <MessageSquare className="w-4 h-4 mr-2" /> Inquire
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>
    </svg>
  );
}

/* ══════════════════════════════════════════════════════════════
   5. STATS SECTION
   ══════════════════════════════════════════════════════════════ */
function AnimatedCounter({ value, prefix = '', suffix = '', inView }: { value: number; prefix?: string; suffix?: string; inView: boolean }) {
  const [count, setCount] = useState(0);
  const isInt = Number.isInteger(value);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 2000;
    const step = (timestamp: number, startTime: number) => {
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = eased * value;
      setCount(isInt ? Math.floor(current) : Math.round(current * 10) / 10);
      if (progress < 1) requestAnimationFrame((t) => step(t, startTime));
    };
    const id = requestAnimationFrame((t) => step(t, t));
    return () => cancelAnimationFrame(id);
  }, [inView, value, isInt]);

  return (
    <span>
      {prefix}{isInt ? count.toLocaleString() : count}{suffix}
    </span>
  );
}

function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section id="about" ref={ref} className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A84C]/[0.02] to-transparent" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
          className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12"
        >
          {STATS.map((s, i) => (
            <motion.div key={s.label} variants={fadeUp} custom={i} className="text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#C9A84C]/10 flex items-center justify-center mx-auto mb-4">
                <s.icon className="w-7 h-7 text-[#C9A84C]" />
              </div>
              <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white">
                <AnimatedCounter value={s.value} prefix={s.prefix || ''} suffix={s.suffix} inView={inView} />
              </div>
              <div className="text-sm font-medium text-[#C9A84C] mt-2 tracking-wide">{s.label}</div>
              <div className="text-xs text-white/30 mt-1">{s.desc}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   6. NEIGHBORHOODS
   ══════════════════════════════════════════════════════════════ */
function NeighborhoodsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  const neighborhoods = [
    { title: 'Coastal Paradise', subtitle: 'Malibu & Santa Barbara', count: '24 Properties', img: '/images/neighborhood-1.png' },
    { title: 'Urban Sophistication', subtitle: 'Manhattan & Greenwich', count: '18 Properties', img: '/images/neighborhood-2.png' },
  ];

  return (
    <section id="neighborhoods" ref={ref} className="py-20 md:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-4">Locations</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-bold">
            Explore Premier <span className="text-gold-gradient">Locations</span>
          </motion.h2>
        </motion.div>

        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {neighborhoods.map((n, i) => (
            <motion.div
              key={n.title} variants={fadeUp} custom={i}
              className="relative group rounded-2xl overflow-hidden h-72 sm:h-96 cursor-pointer luxury-card"
            >
              <div className="img-zoom absolute inset-0">
                <img src={n.img} alt={n.title} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute inset-0 bg-[#C9A84C]/0 group-hover:bg-[#C9A84C]/10 transition-colors duration-500" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
                <Badge className="bg-[#C9A84C]/20 text-[#C9A84C] border-[#C9A84C]/30 mb-3">{n.count}</Badge>
                <h3 className="text-2xl sm:text-3xl font-bold text-white">{n.title}</h3>
                <p className="text-white/50 mt-1">{n.subtitle}</p>
                <Button variant="link" className="text-[#C9A84C] p-0 mt-3 group-hover:gap-3 flex items-center gap-1 transition-all">
                  Explore <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   7. TESTIMONIALS
   ══════════════════════════════════════════════════════════════ */
function TestimonialsSection() {
  const [current, setCurrent] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  useEffect(() => {
    const interval = setInterval(() => setCurrent((c) => (c + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20 md:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#C9A84C]/[0.015] to-transparent" />
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger} className="text-center mb-16">
          <motion.p variants={fadeUp} custom={0} className="text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-4">Testimonials</motion.p>
          <motion.h2 variants={fadeUp} custom={1} className="text-3xl sm:text-4xl md:text-5xl font-bold">
            What Our <span className="text-gold-gradient">Clients</span> Say
          </motion.h2>
        </motion.div>

        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl p-8 sm:p-12 text-center"
            >
              {/* Stars */}
              <div className="flex justify-center gap-1 mb-6">
                {[...Array(TESTIMONIALS[current].rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-[#C9A84C] text-[#C9A84C]" />
                ))}
              </div>
              <Quote className="w-10 h-10 text-[#C9A84C]/30 mx-auto mb-6" />
              <p className="text-lg sm:text-xl text-white/80 leading-relaxed max-w-3xl mx-auto italic">
                &ldquo;{TESTIMONIALS[current].quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <Avatar className="h-12 w-12 border-2 border-[#C9A84C]/30">
                  <AvatarFallback className="bg-[#C9A84C]/10 text-[#C9A84C] font-semibold">
                    {TESTIMONIALS[current].name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <div className="font-semibold text-white">{TESTIMONIALS[current].name}</div>
                  <div className="text-sm text-white/40">{TESTIMONIALS[current].title}</div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Nav */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={() => setCurrent((c) => (c - 1 + TESTIMONIALS.length) % TESTIMONIALS.length)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? 'bg-[#C9A84C] w-6' : 'bg-white/20 hover:bg-white/40'}`} />
              ))}
            </div>
            <button onClick={() => setCurrent((c) => (c + 1) % TESTIMONIALS.length)} className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   8. LEAD CAPTURE CTA
   ══════════════════════════════════════════════════════════════ */
function LeadCTASection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [submitting, setSubmitting] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      firstName: fd.get('firstName') as string,
      lastName: fd.get('lastName') as string,
      email: fd.get('email') as string,
      phone: (fd.get('phone') as string) || undefined,
      propertyType: (fd.get('propertyType') as string) || undefined,
      message: (fd.get('message') as string) || undefined,
    };

    if (!data.firstName || data.firstName.length < 2) { toast.error('Please enter your first name'); return; }
    if (!data.lastName || data.lastName.length < 2) { toast.error('Please enter your last name'); return; }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) { toast.error('Please enter a valid email'); return; }

    setSubmitting(true);
    try {
      const res = await fetch('/api/leads', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      const result = await res.json();
      if (result.success) {
        toast.success('Thank you! Our team will contact you within 24 hours.');
        formRef.current?.reset();
      } else {
        toast.error(result.errors?.[0] || 'Something went wrong. Please try again.');
      }
    } catch {
      toast.error('Network error. Please check your connection.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact" ref={ref} className="py-20 md:py-32 relative">
      {/* BG */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: 'url(/images/hero.png)' }} />
        <div className="absolute inset-0 bg-black/85" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial="hidden" animate={inView ? 'visible' : 'hidden'} variants={stagger}
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left */}
          <motion.div variants={fadeUp} custom={0}>
            <p className="text-[#C9A84C] tracking-[0.3em] uppercase text-sm mb-4">Get Started</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Your Dream Home <br /><span className="text-gold-gradient">Awaits</span>
            </h2>
            <p className="mt-6 text-white/50 leading-relaxed max-w-lg">
              Schedule a private consultation with our luxury property specialists. We&apos;ll curate a personalized selection based on your unique vision and lifestyle.
            </p>
            <div className="mt-8 space-y-4">
              {[
                { icon: Shield, text: '100% confidential — your information is never shared' },
                { icon: Clock, text: 'Response within 24 hours from a dedicated specialist' },
                { icon: Trophy, text: 'Access to exclusive off-market properties' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#C9A84C]/10 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-[#C9A84C]" />
                  </div>
                  <span className="text-white/60 text-sm">{item.text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.div variants={fadeUp} custom={1}>
            <form ref={formRef} onSubmit={handleSubmit} className="glass rounded-2xl p-6 sm:p-8 space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-white/60 text-sm mb-1.5 block">First Name *</Label>
                  <Input id="firstName" name="firstName" placeholder="Alexander" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl h-12 focus:border-[#C9A84C]" required />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-white/60 text-sm mb-1.5 block">Last Name *</Label>
                  <Input id="lastName" name="lastName" placeholder="Morrison" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl h-12 focus:border-[#C9A84C]" required />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-white/60 text-sm mb-1.5 block">Email Address *</Label>
                <Input id="email" name="email" type="email" placeholder="alex@example.com" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl h-12 focus:border-[#C9A84C]" required />
              </div>
              <div>
                <Label htmlFor="phone" className="text-white/60 text-sm mb-1.5 block">Phone Number</Label>
                <Input id="phone" name="phone" type="tel" placeholder="+1 (555) 000-0000" className="bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl h-12 focus:border-[#C9A84C]" />
              </div>
              <div>
                <Label className="text-white/60 text-sm mb-1.5 block">Property Interest</Label>
                <Select name="propertyType">
                  <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-12">
                    <SelectValue placeholder="Select property type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#111] border-[#1E1E1E]">
                    <SelectItem value="Villa">Luxury Villa</SelectItem>
                    <SelectItem value="Penthouse">Penthouse</SelectItem>
                    <SelectItem value="Estate">Private Estate</SelectItem>
                    <SelectItem value="Modern">Modern Home</SelectItem>
                    <SelectItem value="Mediterranean">Mediterranean</SelectItem>
                    <SelectItem value="Lodge">Mountain Lodge</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="message" className="text-white/60 text-sm mb-1.5 block">Tell Us About Your Dream Home</Label>
                <Textarea id="message" name="message" placeholder="I'm looking for..." rows={3} className="bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl focus:border-[#C9A84C] resize-none" />
              </div>
              <Button
                type="submit" disabled={submitting}
                className="w-full bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-black font-semibold h-12 rounded-xl hover:from-[#E8D48B] hover:to-[#C9A84C] transition-all duration-300 disabled:opacity-50"
              >
                {submitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</> : 'Request Private Consultation'}
              </Button>
              <p className="text-xs text-white/25 text-center">By submitting, you agree to our Privacy Policy. We&apos;ll never share your data.</p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

/* ══════════════════════════════════════════════════════════════
   9. AI CHAT WIDGET
   ══════════════════════════════════════════════════════════════ */
function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: "Welcome to Prestige Estates! I'm Aria, your personal property concierge. Whether you're seeking an oceanfront villa or a skyline penthouse, I'm here to help you find your perfect home. What are you looking for?" },
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || typing) return;
    const userMsg = input.trim();
    setInput('');
    const updated = [...messages, { role: 'user' as const, content: userMsg }];
    setMessages(updated);
    setTyping(true);

    try {
      const res = await fetch('/api/ai-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply || "I'd love to help! Could you tell me more about what you're looking for?" }]);
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: "I'm experiencing a brief technical moment. Please try again, or I can connect you with a human agent." }]);
    } finally {
      setTyping(false);
    }
  }, [input, messages, typing]);

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="bg-[#0A0A0A] border-l border-[#1E1E1E] w-full sm:w-[420px] p-0 flex flex-col">
          <SheetHeader className="p-5 border-b border-[#1E1E1E] shrink-0">
            <SheetTitle className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A8873A] flex items-center justify-center">
                <Bot className="w-5 h-5 text-black" />
              </div>
              <div className="text-left">
                <div className="text-white font-semibold">Aria</div>
                <div className="text-xs text-[#C9A84C]">AI Property Concierge</div>
              </div>
              <Badge variant="outline" className="ml-auto border-[#C9A84C]/30 text-[#C9A84C] text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
                Online
              </Badge>
            </SheetTitle>
          </SheetHeader>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-5 space-y-4 min-h-0">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className={msg.role === 'assistant' ? 'bg-[#C9A84C]/10 text-[#C9A84C]' : 'bg-white/10 text-white'}>
                    {msg.role === 'assistant' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                  msg.role === 'assistant' ? 'bg-white/5 text-white/80 rounded-tl-md' : 'bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-black rounded-tr-md'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {typing && (
              <div className="flex gap-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-[#C9A84C]/10 text-[#C9A84C]"><Bot className="w-4 h-4" /></AvatarFallback>
                </Avatar>
                <div className="bg-white/5 rounded-2xl rounded-tl-md px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-white/30 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-[#1E1E1E] shrink-0">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Ask about properties..."
                className="bg-white/5 border-white/10 text-white placeholder:text-white/25 rounded-xl h-11 focus:border-[#C9A84C]"
                disabled={typing}
              />
              <Button
                onClick={sendMessage} disabled={typing || !input.trim()}
                className="bg-gradient-to-r from-[#C9A84C] to-[#A8873A] text-black rounded-xl h-11 w-11 p-0 shrink-0 disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* FAB */}
      <motion.button
        onClick={() => setOpen(true)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-gradient-to-br from-[#C9A84C] to-[#A8873A] flex items-center justify-center shadow-lg shadow-[#C9A84C]/20 pulse-gold group"
        aria-label="Open AI Chat"
      >
        <Sparkles className="w-6 h-6 text-black" />
        <span className="absolute -top-10 right-0 bg-[#111] text-white text-xs px-3 py-1.5 rounded-lg border border-[#1E1E1E] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Ask Aria
        </span>
      </motion.button>
    </>
  );
}

/* ══════════════════════════════════════════════════════════════
   10. FOOTER
   ══════════════════════════════════════════════════════════════ */
function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-[#1E1E1E]">
      <div className="gold-divider" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1 */}
          <div>
            <div className="flex items-center gap-1 mb-4">
              <span className="gold-shimmer text-xl font-bold tracking-[0.15em]">PRESTIGE</span>
              <span className="text-xl font-light tracking-[0.15em] text-white/80">ESTATES</span>
            </div>
            <p className="text-sm text-white/40 leading-relaxed mb-6">
              Redefining luxury real estate since 2009. We curate the world&apos;s most exceptional properties for the most discerning buyers.
            </p>
            <div className="flex gap-3">
              {[Facebook, Instagram, Twitter, Linkedin].map((Icon, i) => (
                <button key={i} className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] transition-colors text-white/40">
                  <Icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>

          {/* Col 2 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {['About Us', 'Properties', 'Our Agents', 'Blog', 'Contact'].map((l) => (
                <li key={l}><a href="#" className="text-sm text-white/40 hover:text-[#C9A84C] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 3 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">Property Types</h4>
            <ul className="space-y-3">
              {['Luxury Villas', 'Penthouses', 'Private Estates', 'Modern Homes', 'Mountain Retreats'].map((l) => (
                <li key={l}><a href="#properties" className="text-sm text-white/40 hover:text-[#C9A84C] transition-colors">{l}</a></li>
              ))}
            </ul>
          </div>

          {/* Col 4 */}
          <div>
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase mb-5">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5 text-sm text-white/40">
                <MapPin className="w-4 h-4 text-[#C9A84C] shrink-0 mt-0.5" />
                1200 Wilshire Blvd, Suite 2800<br />Los Angeles, CA 90025
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/40">
                <Phone className="w-4 h-4 text-[#C9A84C] shrink-0" />
                +1 (310) 555-0199
              </li>
              <li className="flex items-center gap-2.5 text-sm text-white/40">
                <Mail className="w-4 h-4 text-[#C9A84C] shrink-0" />
                concierge@prestigeestates.com
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-[#1E1E1E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/25">&copy; {new Date().getFullYear()} Prestige Estates. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">Privacy Policy</a>
            <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">Terms of Service</a>
            <a href="#" className="text-xs text-white/25 hover:text-white/50 transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}