import { useEffect, useState } from "react";
import { User, ExternalLink, Loader2 } from "lucide-react";

const HN_SEARCH_URL =
  "https://hn.algolia.com/api/v1/search?tags=story&query=electronics+OR+power+OR+battery+OR+circuit&hitsPerPage=6";

type HnHit = {
  objectID: string;
  title: string | null;
  url: string | null;
  story_url?: string | null;
  points?: number | null;
  author: string | null;
  created_at_i: number;
};

type BlogCard = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  dateLabel: string;
  href: string;
  score: number;
  image: string;
};

function hitToCard(hit: HnHit): BlogCard | null {
  const title = (hit.title || "").trim();
  if (!title) return null;

  const href =
    hit.url && hit.url.startsWith("http")
      ? hit.url
      : hit.story_url && hit.story_url.startsWith("http")
        ? hit.story_url
        : `https://news.ycombinator.com/item?id=${hit.objectID}`;

  const d = new Date(hit.created_at_i * 1000);
  const dateLabel = d.toLocaleDateString("uk-UA", {
    day: "numeric",
    month: "short",
  });

  const excerpt =
    "Матеріал з Hacker News про техніку, електроніку та інженерію — відкриється на зовнішньому сайті.";

  return {
    id: hit.objectID,
    title,
    excerpt,
    author: hit.author || "HN",
    dateLabel,
    href,
    score: hit.points ?? 0,
    image: `https://picsum.photos/seed/hn${hit.objectID}/800/500`,
  };
}

const getDynamicFallbackCards = (): BlogCard[] => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const targetDate = new Date(today);
  targetDate.setDate(targetDate.getDate() - 3);

  const formatDate = (d: Date) =>
    d.toLocaleDateString("uk-UA", { day: "numeric", month: "short" });

  // Розділ 3.
  return [
    {
      id: "fb-1",
      title: "Що варто знати про стабілізатори напруги для дому",
      excerpt:
        "Огляд типів стабілізаторів і типових помилок при підборі потужності для побутових приладів.",
      author: "PowerStore",
      dateLabel: formatDate(today),
      href: "https://www.energy.gov/energysaver/voltage-regulators",
      score: 42,
      image: `https://media.istockphoto.com/id/1025303198/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%82%D0%B5%D1%85%D0%BD%D0%BE%D0%BB%D0%BE%D0%B3%D1%96%D1%97-%D0%B2-%D0%B4%D0%BE%D0%BC%D0%B0%D1%88%D0%BD%D1%96%D1%85-%D1%83%D0%BC%D0%BE%D0%B2%D0%B0%D1%85.jpg?s=612x612&w=0&k=20&c=wOjy9e-xgrgxNbC761mi2AbMchA1Ess85UvQMwgMWEs=`,
    },
    {
      id: "fb-2",
      title: "Безпека електромонтажу в побуті та офісі",
      excerpt:
        "Рекомендації щодо заземлення, ПЗВ (УЗО) та вибір перерізу кабелю під навантаження.",
      author: "PowerStore",
      dateLabel: formatDate(yesterday),
      href: "https://www.osha.gov/electrical",
      score: 28,
      image: `https://media.istockphoto.com/id/1180979241/uk/%D1%84%D0%BE%D1%82%D0%BE/%D0%B2%D1%96%D0%B4%D0%BA%D1%80%D0%B8%D1%82%D0%B0-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%BD%D0%B0-%D0%BA%D0%BE%D1%80%D0%BE%D0%B1%D0%BA%D0%B0-%D0%B7-%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%BE%D0%B0%D0%B2%D1%82%D0%BE%D0%BC%D0%B0%D1%82%D0%B8%D0%BA%D0%BE%D1%8E-%D1%96-%D1%80%D1%83%D0%BA%D0%B0-%D0%B2-%D0%B4%D1%96%D0%B5%D0%BB%D0%B5%D0%BA%D1%82%D1%80%D0%B8%D1%87%D0%BD%D1%96%D0%B9-%D1%81%D0%B8%D0%BB%D1%96%D0%BA%D0%BE%D0%BD%D0%BE%D0%B2%D1%96%D0%B9-%D1%80%D1%83%D0%BA%D0%B0%D0%B2%D0%B8%D1%86%D1%96-%D0%B7.jpg?s=612x612&w=0&k=20&c=v4ru-pla6_Uz_OSOji2OepShAjObo31-Akk3Y1kpNYY=`,
    },
    {
      id: "fb-3",
      title: "Розумне освітлення та енергоефективність будинку",
      excerpt:
        "Як сучасні LED-рішення та датчики руху допомагають суттєво зменшити споживання електроенергії.",
      author: "PowerStore",
      dateLabel: formatDate(targetDate),
      href: "https://www.energy.gov/energysaver/lighting-choices-save-you-money",
      score: 56,
      image: `https://media.istockphoto.com/id/1679580701/uk/%D1%84%D0%BE%D1%82%D0%BE/%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0-%D1%83%D0%BF%D1%80%D0%B0%D0%B2%D0%BB%D1%96%D0%BD%D0%BD%D1%8F-%D1%80%D0%BE%D0%B7%D1%83%D0%BC%D0%BD%D0%B8%D0%BC-%D0%B1%D1%83%D0%B4%D0%B8%D0%BD%D0%BA%D0%BE%D0%BC-%D0%B7-%D1%96%D0%BA%D0%BE%D0%BD%D0%BA%D0%B0%D0%BC%D0%B8-%D0%B4%D0%BE%D0%B4%D0%B0%D1%82%D0%BA%D1%96%D0%B2-%D0%BD%D0%B0-%D0%BA%D1%83%D1%85%D0%BD%D1%96-%D0%BA%D1%80%D1%83%D0%BF%D0%BD%D0%B8%D0%B9-%D0%BF%D0%BB%D0%B0%D0%BD-%D1%86%D0%B8%D1%84%D1%80%D0%BE%D0%B2%D0%BE%D0%B3%D0%BE.jpg?s=612x612&w=0&k=20&c=LlEakxnoabQfF9gvrjavw43ObvwySlMd8_VnVP_vafs=`,
    },
  ];
};

export const BlogSection = () => {
  const [cards, setCards] = useState<BlogCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [usedFallback, setUsedFallback] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(HN_SEARCH_URL);
        if (!res.ok) throw new Error(String(res.status));
        const json: { hits?: HnHit[] } = await res.json();
        const mapped =
          json.hits
            ?.map((h) => hitToCard(h))
            .filter((c): c is BlogCard => c != null) ?? [];

        if (!cancelled) {
          if (mapped.length >= 3) {
            setCards(mapped.slice(0, 6));
            setUsedFallback(false);
          } else {
            setCards(getDynamicFallbackCards());
            setUsedFallback(true);
          }
        }
      } catch {
        if (!cancelled) {
          setCards(getDynamicFallbackCards());
          setUsedFallback(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const displayCards = cards.length > 0 ? cards : getDynamicFallbackCards();

  return (
    <section className="py-20 relative overflow-hidden font-montserrat">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/electricity-bg.svg')]"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-brand-primary font-bold uppercase tracking-widest text-sm italic">
            Блог і новини
          </span>
          <h2 className="text-4xl font-semibold text-gray-900 mt-2">
            Корисне про техніку
          </h2>
          <p className="text-gray-500 text-sm mt-3 max-w-2xl mx-auto">
            Підбірка статей з відкритого API Hacker News (тематика електроніки
            та інженерії). Натисніть «Читати далі», щоб відкрити оригінал на
            зовнішньому сайті.
            {usedFallback && (
              <span className="block mt-1 text-amber-700/90 text-xs">
                Зараз показано резервні матеріали — не вдалося завантажити живу
                стрічку.
              </span>
            )}
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-gray-500">
            <Loader2 className="animate-spin text-brand-primary" size={36} />
            <span className="text-sm">Завантаження матеріалів…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayCards.map((post) => (
              <article
                key={post.id}
                className="group bg-white rounded-2xl h-[450px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 flex flex-col"
              >
                <a
                  href={post.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative h-[55%] overflow-hidden block shrink-0"
                >
                  <img
                    src={post.image}
                    alt=""
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 px-3 shadow-lg text-center min-w-[55px] z-20">
                    <span className="block text-sm font-semibold leading-none text-gray-900">
                      {post.dateLabel}
                    </span>
                  </div>
                </a>

                <div className="p-6 flex flex-col flex-1 min-h-0">
                  <div className="flex items-center gap-3 text-xs text-gray-500 mb-2 shrink-0">
                    <div className="flex items-center gap-1.5">
                      <User size={14} className="text-gray-400" />
                      <span className="truncate">{post.author}</span>
                    </div>
                    {post.score > 0 && (
                      <span className="text-gray-400">
                        · {post.score} балів
                      </span>
                    )}
                  </div>

                  <h3 className="text-md font-semibold text-gray-950 mb-2 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug shrink-0">
                    {post.title}
                  </h3>

                  <p className="text-xs text-gray-500 line-clamp-3 mb-4 flex-1 min-h-0">
                    {post.excerpt}
                  </p>

                  <a
                    href={post.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-brand-primary font-semibold text-sm mt-auto shrink-0"
                  >
                    Читати далі
                    <ExternalLink
                      size={14}
                      className="group-hover:translate-x-1 transition-transform"
                    />
                  </a>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
