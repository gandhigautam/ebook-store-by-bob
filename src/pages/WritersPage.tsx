import { useNavigate } from 'react-router-dom';
import { PenLine, ChevronRight, UserMinus, BookOpen } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { AUTHORS, BOOKS } from '../data/books';
import Button from '../components/ui/Button';

export default function WritersPage() {
  const navigate = useNavigate();
  const { writers, removeWriter } = useStore();

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-white text-xl font-bold">My Writers</h1>
            <p className="text-neutral-400 text-sm mt-0.5">
              {writers.length} {writers.length === 1 ? 'author' : 'authors'} followed
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/catalog')}
            iconRight={<ChevronRight size={14} />}
          >
            Browse Books
          </Button>
        </div>

        {writers.length === 0 ? (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <PenLine size={56} className="text-neutral-600 mb-4" />
            <h2 className="text-white text-lg font-semibold mb-2">Not following any writers yet</h2>
            <p className="text-neutral-400 text-sm mb-6 max-w-xs">
              Open any book's detail page and click "Follow" next to the author's name.
            </p>
            <Button onClick={() => navigate('/catalog')} iconRight={<ChevronRight size={16} />}>
              Discover Books
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {writers.map(({ authorName, addedAt }) => {
              const authorData = AUTHORS[authorName];
              // Find books by this author from the mock catalog
              const authorBooks = BOOKS.filter((b) => b.author === authorName);
              const followedDate = new Date(addedAt).toLocaleDateString('en-IN', {
                day: 'numeric', month: 'short', year: 'numeric',
              });
              // Author initials for avatar
              const initials = authorName.split(' ').map((n) => n[0]).join('');

              return (
                <div
                  key={authorName}
                  className="bg-neutral-800 rounded-xl border border-neutral-700 p-5"
                >
                  {/* Author header */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-teal-600 shrink-0 flex items-center justify-center text-white font-bold text-sm">
                      {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-3">
                        <h2 className="text-white font-semibold text-base">{authorName}</h2>
                        <button
                          onClick={() => removeWriter(authorName)}
                          className="flex items-center gap-1.5 text-xs px-3 py-1 rounded-full border border-neutral-600 text-neutral-400 hover:border-red-500 hover:text-red-400 transition-colors shrink-0"
                        >
                          <UserMinus size={12} />
                          Unfollow
                        </button>
                      </div>
                      <p className="text-neutral-500 text-xs mt-0.5">Followed on {followedDate}</p>
                    </div>
                  </div>

                  {/* Bio (if available) */}
                  {authorData?.bio && (
                    <p className="text-neutral-400 text-xs leading-relaxed mb-4 line-clamp-3">
                      {authorData.bio}
                    </p>
                  )}

                  {/* Books by this author */}
                  {authorBooks.length > 0 && (
                    <div>
                      <p className="text-neutral-400 text-xs font-medium mb-2 flex items-center gap-1.5">
                        <BookOpen size={12} className="text-blue-400" />
                        Books by {authorName}
                      </p>
                      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
                        {authorBooks.map((book) => (
                          <div
                            key={book.id}
                            className="flex-none w-24 cursor-pointer group"
                            onClick={() => navigate(`/book/${book.id}`)}
                          >
                            {/* Cover */}
                            <div
                              className="w-24 h-32 rounded flex flex-col items-center justify-center p-2 group-hover:ring-1 group-hover:ring-blue-500 transition-all"
                              style={{ backgroundColor: book.coverColor }}
                            >
                              <p
                                className="text-[9px] font-black uppercase leading-tight text-center"
                                style={{ color: book.coverTextColor }}
                              >
                                {book.title}
                              </p>
                            </div>
                            <p className="text-neutral-300 text-[10px] mt-1.5 leading-tight line-clamp-2 group-hover:text-blue-400 transition-colors">
                              {book.title}
                            </p>
                            <p className="text-white text-[11px] font-bold">₹{book.price}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
