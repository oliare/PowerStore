export const MailingSection = () => {
  return (
    <section className="bg-[#F2F2F2] py-10 px-4">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8">
        <div className="text-center lg:text-left">
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight font-montserrat">
            Підпишіться на розсилку
          </h3>
          <p className="text-gray-500 text-sm mt-1 font-montserrat">
            Отримуйте актуальні новини та акції.
          </p>
        </div>

        <form
          className="relative w-full max-w-xl flex items-center"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative w-full">
            <input
              type="email"
              placeholder="Ваша електронна адреса"
              className="w-full pl-6 pr-40 py-4 rounded-full bg-white border border-gray-200 outline-none focus:ring-2 focus:ring-brand-primary/20 transition-all text-gray-800 font-montserrat"
            />
            <button className="absolute right-1.5 top-1/2 -translate-y-1/2 px-8 py-3 rounded-full bg-brand-primary text-white font-bold text-sm hover:bg-brand-dark transition-all active:scale-95 shadow-md font-montserrat">
              Підписатися
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};
