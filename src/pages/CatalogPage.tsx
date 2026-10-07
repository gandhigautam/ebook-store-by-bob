import { useState, useMemo } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BOOKS, CATEGORIES } from '../data/books';
import type { Category, SortOption, FormatFilter, LanguageFilter } from '../types';
import BookCard from '../components/book/BookCard';
import FeaturedBookCard from '../components/book/FeaturedBookCard';
import SearchBar from '../components/ui/SearchBar';

const FORMATS: FormatFilter[] = ['All', 'Paperback', 'Hardcover', 'eBook'];
const LANGUAGES: LanguageFilter[] = ['All', 'English', 'Hindi', 'Tamil', 'Telugu'];
const SORT_OPTIONS: SortOption[] = ['Relevance', 'Price: Low to High', 'Price: High to Low', 'Rating', 'New Arrivals'];

function Select({
  value,
  onChange,
  options,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  label: string;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none bg-neutral-800 border border-neutral-600 text-neutral-200 text-xs rounded px-3 py-2 pr-8 focus:outline-none focus:border-blue-500 cursor-pointer min-w-[120px]"
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt === options[0] ? `${label}: ${opt}` : opt}
          </option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none" />
    </div>
  );
}

export default function CatalogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('All');
  const [search, setSearch] = useState('');
  const [language, setLanguage] = useState<LanguageFilter>('All');
  const [format, setFormat] = useState<FormatFilter>('All');
  const [sortBy, setSortBy] = useState<SortOption>('Relevance');

  const filteredBooks = useMemo(() => {
    let books = [...BOOKS];

    if (selectedCategory !== 'All') {
      books = books.filter((b) =>
        b.categories.some((c) => c.toLowerCase() === selectedCategory.toLowerCase())
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      books = books.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (language !== 'All') {
      books = books.filter((b) => b.language === language);
    }

    if (format !== 'All') {
      books = books.filter((b) => b.format.toLowerCase().includes(format.toLowerCase()));
    }

    switch (sortBy) {
      case 'Price: Low to High':
        books.sort((a, b) => a.price - b.price);
        break;
      case 'Price: High to Low':
        books.sort((a, b) => b.price - a.price);
        break;
      case 'Rating':
        books.sort((a, b) => b.rating - a.rating);
        break;
    }

    return books;
  }, [selectedCategory, search, language, format, sortBy]);

  // Sections from the screenshot
  const recommended = BOOKS.filter((b) => ['1', '2', '3'].includes(b.id));
  const featuredLarge = BOOKS.find((b) => b.id === '1')!;
  const bestsellers = BOOKS.filter((b) => ['4', '5', '6'].includes(b.id));
  const newLaunches = BOOKS.filter((b) => ['7', '8', '9'].includes(b.id));

  const isSearching = search.trim() !== '' || selectedCategory !== 'All' || language !== 'All' || format !== 'All';

  return (
    <div className="min-h-screen bg-neutral-900 text-white flex">
      {/* Left Sidebar — Categories */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 border-r border-neutral-700">
        <div className="sticky top-12 max-h-[calc(100vh-3rem)] overflow-y-auto p-3 space-y-0.5">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category)}
              className={`w-full text-left text-xs px-3 py-1.5 rounded transition-colors ${
                selectedCategory === cat
                  ? 'bg-neutral-600 text-white font-semibold'
                  : 'text-neutral-400 hover:bg-neutral-800 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-4 overflow-x-hidden">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search you want to read here"
            className="flex-1 min-w-[180px] max-w-xs"
          />
          <Select value={language} onChange={(v) => setLanguage(v as LanguageFilter)} options={LANGUAGES} label="Language" />
          <Select value={format} onChange={(v) => setFormat(v as FormatFilter)} options={FORMATS} label="Format" />
          <Select value={sortBy} onChange={(v) => setSortBy(v as SortOption)} options={SORT_OPTIONS} label="Sort by" />
        </div>

        {/* Mobile category pills */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {CATEGORIES.slice(0, 10).map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat as Category)}
              className={`shrink-0 text-xs px-3 py-1.5 rounded-full border transition-colors ${
                selectedCategory === cat
                  ? 'bg-blue-600 border-blue-600 text-white'
                  : 'border-neutral-600 text-neutral-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {isSearching ? (
          /* Search / filter results */
          <section>
            <h2 className="text-white font-semibold text-sm mb-3">
              {filteredBooks.length} {filteredBooks.length === 1 ? 'result' : 'results'} found
            </h2>
            {filteredBooks.length === 0 ? (
              <div className="text-neutral-400 text-sm py-12 text-center">No books found. Try a different search or filter.</div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {filteredBooks.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* Recommended for You */}
            <section className="mb-8">
              <h2 className="text-white font-semibold text-sm mb-3">Recommended for You</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Featured large card */}
                <div className="lg:row-span-1">
                  <FeaturedBookCard book={featuredLarge} />
                </div>
                {/* Other recommended */}
                {recommended.filter((b) => b.id !== '1').map((book) => (
                  <FeaturedBookCard key={book.id} book={book} />
                ))}
              </div>
            </section>

            {/* Bestsellers this Month */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-sm">Bestsellers this Month</h2>
                <button className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300 transition-colors">
                  View all <ChevronRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {bestsellers.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
                {/* fill extra */}
                {BOOKS.filter((b) => ['10', '11'].includes(b.id)).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>

            {/* New Launches */}
            <section className="mb-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-white font-semibold text-sm">New Launches</h2>
                <button className="text-blue-400 text-xs flex items-center gap-1 hover:text-blue-300 transition-colors">
                  View all <ChevronRight size={13} />
                </button>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-3">
                {newLaunches.map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
                {BOOKS.filter((b) => ['12'].includes(b.id)).map((book) => (
                  <BookCard key={book.id} book={book} />
                ))}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
