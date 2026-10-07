import { useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { BOOKS, CATEGORIES } from '../data/books';
import BookCard from '../components/book/BookCard';
import SearchBar from '../components/ui/SearchBar';
import Button from '../components/ui/Button';

export default function HomePage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/catalog?q=${encodeURIComponent(search.trim())}`);
    } else {
      navigate('/catalog');
    }
  };

  const featured = BOOKS.find((b) => b.id === '1')!;
  const bestsellers = BOOKS.filter((b) => ['3', '5', '11', '12'].includes(b.id));
  const newArrivals = BOOKS.filter((b) => ['7', '8', '9'].includes(b.id));

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-neutral-800 via-neutral-900 to-blue-950 px-4 py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'radial-gradient(circle at 80% 20%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 20% 80%, #0d9488 0%, transparent 50%)',
          }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight mb-4">
            Discover Your Next<br />
            <span className="text-blue-400">Favourite Book</span>
          </h1>
          <p className="text-neutral-300 text-lg mb-8 max-w-xl mx-auto">
            Browse thousands of eBooks across every genre. Buy, read, and grow — all in one place.
          </p>
          <div className="flex gap-3 max-w-md mx-auto">
            <SearchBar
              value={search}
              onChange={setSearch}
              placeholder="Search for books, authors..."
              className="flex-1"
              onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleSearch()}
            />
            <Button onClick={handleSearch} size="md">Search</Button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Self Help', 'Fiction', 'Mystery', 'Biography', 'Science'].map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/catalog`)}
                className="text-xs px-3 py-1 rounded-full border border-neutral-600 text-neutral-300 hover:border-blue-500 hover:text-blue-400 transition-colors"
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Categories strip */}
      <section className="bg-neutral-800 border-b border-neutral-700 px-4 py-4 overflow-x-auto">
        <div className="max-w-screen-xl mx-auto flex gap-3 min-w-max">
          {CATEGORIES.slice(0, 12).map((cat) => (
            <button
              key={cat}
              onClick={() => navigate('/catalog')}
              className="text-xs px-4 py-2 rounded-full bg-neutral-700 hover:bg-blue-600 text-neutral-300 hover:text-white transition-colors whitespace-nowrap"
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-4 py-8 space-y-12">
        {/* Featured Book */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Featured Book</h2>
          </div>
          <div className="bg-neutral-800 rounded-xl overflow-hidden flex flex-col md:flex-row gap-0">
            <div
              className="md:w-60 h-64 md:h-auto flex items-center justify-center p-8"
              style={{ backgroundColor: featured.coverColor }}
            >
              <div className="text-center" style={{ color: featured.coverTextColor }}>
                <p className="text-xl font-black uppercase leading-tight">{featured.title}</p>
                <p className="text-sm mt-2 opacity-80 uppercase tracking-widest">{featured.author}</p>
              </div>
            </div>
            <div className="flex-1 p-6 md:p-8">
              <span className="inline-block bg-blue-600 text-white text-xs px-2 py-1 rounded mb-3">Featured</span>
              <h3 className="text-white text-2xl font-bold mb-1">{featured.title}</h3>
              <p className="text-blue-400 mb-3">by {featured.author}</p>
              <p className="text-neutral-300 text-sm leading-relaxed mb-4 max-w-lg">{featured.description}</p>
              <div className="flex items-center gap-4">
                <span className="text-white text-2xl font-bold">₹{featured.price}</span>
                <Button onClick={() => navigate(`/book/${featured.id}`)} iconRight={<ChevronRight size={16} />}>
                  View Details
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Bestsellers */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">Bestsellers</h2>
            <button
              onClick={() => navigate('/catalog')}
              className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {bestsellers.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* New Arrivals */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-white font-semibold text-lg">New Arrivals</h2>
            <button
              onClick={() => navigate('/catalog')}
              className="text-blue-400 text-sm flex items-center gap-1 hover:text-blue-300 transition-colors"
            >
              View all <ChevronRight size={14} />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {newArrivals.map((book) => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-gradient-to-r from-blue-900 to-teal-900 rounded-xl p-8 text-center">
          <h2 className="text-white text-2xl font-bold mb-2">Start Reading Today</h2>
          <p className="text-blue-200 mb-6 max-w-md mx-auto">
            Join thousands of readers. Access your library anywhere, anytime.
          </p>
          <Button size="lg" onClick={() => navigate('/catalog')} iconRight={<ChevronRight size={18} />}>
            Browse All Books
          </Button>
        </section>
      </div>
    </div>
  );
}
