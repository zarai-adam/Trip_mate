import { motion } from "motion/react";
import { Search, Clock, User, ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const posts = [
  {
    title: "How to backpack Morocco on $30 a day",
    excerpt: "The ultimate guide to navigating the souks of Marrakech and the dunes of Merzouga without breaking the bank.",
    author: "Adem Z.",
    date: "May 12, 2026",
    category: "Budget Tips",
    img: "https://images.unsplash.com/photo-1539020253777-4856a57d8ea9?auto=format&fit=crop&q=80&w=800",
    slug: "backpack-morocco-budget"
  },
  {
    title: "Why solo travel is the ultimate self-care",
    excerpt: "Breaking myths about loneliness and exploring why hitting the road alone is the best thing you can do for your soul.",
    author: "Sarah L.",
    date: "May 08, 2026",
    category: "Solo Travel",
    img: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b?auto=format&fit=crop&q=80&w=800",
    slug: "solo-travel-self-care"
  },
  {
    title: "10 things I wish I knew before leading my first trip",
    excerpt: "Insights from a Trip Mate guide on managing group dynamics and ensuring every traveler has a story to tell.",
    author: "Malik T.",
    date: "May 01, 2026",
    category: "Guide Tips",
    img: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&q=80&w=800",
    slug: "guide-tips-group-dynamics"
  }
];

export default function Blog() {
  const categories = ["All", "Solo Travel", "Budget Tips", "Guide Tips", "Destinations"];

  return (
    <div className="bg-white min-h-screen font-sans">
      <section className="pt-32 md:pt-48 pb-16 px-6 bg-offwhite">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
             <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-forest/5 rounded-full mb-8 border border-forest/10">
               <Sparkles size={14} className="text-forest" />
               <span className="text-[10px] font-bold uppercase tracking-widest text-forest">The Journal</span>
            </div>
            <h1 className="text-5xl md:text-8xl font-heading font-black text-forest uppercase tracking-tighter leading-none mb-8">Travel <br/>Insights.</h1>
            <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto italic">Raw stories, budget hacks, and unfiltered advice from the global backpacker community.</p>
          </motion.div>
        </div>
      </section>

      <section className="py-12 px-6 border-b border-gray-100">
        <div className="container-wide overflow-x-auto no-scrollbar flex items-center justify-center gap-8 py-2">
          {categories.map(cat => (
            <button key={cat} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-forest transition-colors whitespace-nowrap">{cat}</button>
          ))}
        </div>
      </section>

      <section className="py-20 md:py-32 px-6">
        <div className="container-wide grid grid-cols-1 lg:grid-cols-3 gap-12">
          {posts.map((post, idx) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="group"
            >
              <Link to={`/blog/${post.slug}`} className="block mb-8 relative aspect-video rounded-[2.5rem] overflow-hidden shadow-sleek">
                <img 
                  src={post.img} 
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0" 
                  alt={post.title}
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full">
                  <span className="text-[10px] font-black uppercase tracking-widest text-forest">{post.category}</span>
                </div>
              </Link>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 text-gray-400 text-[10px] font-bold uppercase tracking-widest">
                  <span className="flex items-center gap-1.5"><Clock size={12} /> {post.date}</span>
                  <span className="flex items-center gap-1.5"><User size={12} /> {post.author}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-heading font-black text-forest group-hover:text-sage transition-colors leading-tight">
                  {post.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed italic">{post.excerpt}</p>
                <Link to={`/blog/${post.slug}`} className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-forest group-hover:gap-4 transition-all pt-4">
                  Read Journal <ArrowRight size={14} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="py-32 px-6">
        <div className="container-wide bg-offwhite rounded-[4rem] p-12 md:p-24 text-center border border-sage/10 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-heading font-black text-forest mb-8 tracking-tighter uppercase">Contributor?</h2>
            <p className="text-gray-400 text-lg mb-12 font-medium italic max-w-xl mx-auto">Have a story that needs to be told? We're always looking for authentic voices from the road.</p>
            <button className="bg-forest text-white px-12 h-16 rounded-full font-black text-xl hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-forest/20">Apply to Write</button>
          </div>
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-sage/5 rounded-full translate-y-1/2 translate-x-1/2 blur-3xl"></div>
        </div>
      </section>
    </div>
  );
}
