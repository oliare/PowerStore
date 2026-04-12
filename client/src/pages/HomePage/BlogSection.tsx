import { User, MessageCircle, ArrowRight } from "lucide-react";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  date: string;
  comments: number;
  image: string;
  category: string;
}

export const BlogSection = () => {
  const posts: BlogPost[] = [
    {
      id: 1,
      title: "Як обрати надійний стабілізатор напруги для будинку",
      excerpt:
        "Розбираємо основні типи стабілізаторів та на що звернути увагу при купівлі у 2024 році...",
      author: "Admin",
      date: "18 Лис",
      comments: 12,
      image:
        "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=800",
      category: "Поради",
    },
    {
      id: 2,
      title: "Топ 5 систем розумного освітлення для квартири",
      excerpt:
        "Автоматизація світла: від простих датчиків руху до складних систем керування зі смартфона.",
      author: "Експерт",
      date: "23 Січ",
      comments: 8,
      image:
        "https://images.unsplash.com/photo-1558402529-d26c8a7023e9?q=80&w=800",
      category: "Огляди",
    },
    {
      id: 3,
      title: "Нові стандарти безпеки в електромонтажі",
      excerpt:
        "Зміни в законодавстві та нові вимоги до захисного обладнання в житлових приміщеннях.",
      author: "Admin",
      date: "10 Лют",
      comments: 45,
      image:
        "https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?q=80&w=800",
      category: "Новини",
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('/electricity-bg.svg')]"></div>

      <div className="max-w-7xl mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <span className="text-brand-primary font-bold uppercase tracking-widest text-sm italic">
            Блог
          </span>
          <h2 className="text-4xl font-black text-gray-900 mt-2">
            Останні новини
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="group bg-white rounded-2xl h-[450px] overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500"
            >
              <div className="relative h-[65%] overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute bottom-4 left-4 bg-white rounded-lg p-2 px-3 shadow-lg text-center min-w-[55px] z-20">
                  <span className="block text-lg font-bold leading-none text-gray-900">
                    {post.date.split(" ")[0]}
                  </span>
                  <span className="block text-[10px] uppercase font-bold text-gray-500 mt-1">
                    {post.date.split(" ")[1]}
                  </span>
                </div>
              </div>

              <div className="p-6 h-[35%] flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <div className="flex items-center gap-1.5 hover:text-brand-primary cursor-pointer transition-colors">
                      <User size={14} className="text-gray-400" />
                      <span>By {post.author}</span>
                    </div>
                    <div className="flex items-center gap-1.5 hover:text-brand-primary cursor-pointer transition-colors">
                      <MessageCircle size={14} className="text-gray-400" />
                      <span>{post.comments} Коментарів</span>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-gray-950 mb-2 group-hover:text-brand-primary transition-colors line-clamp-2 leading-snug">
                    {post.title}
                  </h3>
                </div>

                <button className="flex items-center gap-2 text-brand-primary font-bold text-sm group/btn mt-auto">
                  Читати далі
                  <ArrowRight
                    size={18}
                    className="group-hover/btn:translate-x-2 transition-transform"
                  />
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
