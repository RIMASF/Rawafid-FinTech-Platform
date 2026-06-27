import { useLang } from "@/i18n/LanguageContext";

const SponsorsSection = () => {
  const { t } = useLang();

  return (
    <section id="partners" className="py-24 md:py-32 relative bg-[#05241b]">
      {/* Minimalist Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/5 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

        {/* Section Header */}
        <div className="text-center mb-24 md:mb-32 animate-fade-up">
          <span className="text-primary font-bold tracking-[0.4em] uppercase text-xs md:text-sm mb-6 block">
            {t.sponsors.kicker}
          </span>
          <h2 className="display-font text-3xl sm:text-5xl md:text-7xl font-bold text-white leading-tight">
            {t.sponsors.title1} <span className="text-gradient">{t.sponsors.title2}</span>
          </h2>
        </div>

        <div className="flex flex-col gap-16 md:gap-24">
          {t.sponsors.tiers.map((tier, i) => {
            const isOfficial = i === 0;

            return (
              <div
                key={i}
                className="flex flex-col items-center animate-fade-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Elegant Minimalist Tier Header */}
                <div className="flex flex-col items-center mb-8 md:mb-12">
                  <h3 className={`font-medium tracking-[0.3em] uppercase text-center
                    ${i === 0 ? 'text-primary text-sm md:text-base drop-shadow-md' : 'text-xs md:text-sm'}
                    ${i === 1 ? 'text-white drop-shadow-sm' : ''}
                    ${i === 2 ? 'text-yellow-500' : ''}
                    ${i === 3 ? 'text-blue-300' : ''}
                    ${i === 4 ? 'text-purple-300' : ''}
                  `}>
                    {tier.name}
                  </h3>
                  {isOfficial && (
                    <div className="w-12 h-[1px] bg-primary/50 mt-4" />
                  )}
                </div>

                {/* Logo Layout — static if single item, marquee if multiple */}
                {tier.items.length === 1 ? (
                  <div className="flex justify-center">
                    {tier.items[0].logo ? (
                      <img
                        src={tier.items[0].logo}
                        alt={tier.items[0].name}
                        className="object-contain transition-all duration-500 filter brightness-0 invert opacity-50 hover:opacity-100 hover:scale-110 cursor-pointer drop-shadow-md"
                        style={{ width: (tier.items[0] as any).width || "50px", height: "auto" }}
                      />
                    ) : (
                      <span className="text-white/30 font-medium uppercase tracking-[0.2em] text-[10px] md:text-xs">
                        {tier.items[0].name || "Partner"}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="overflow-hidden w-full" dir="ltr">
                    <div className="animate-marquee items-center">
                      {[...tier.items, ...tier.items].map((partner, k) => (
                        <div key={k} className="flex items-center justify-center shrink-0 px-8 md:px-12">
                          {partner.logo ? (
                            <img
                              src={partner.logo}
                              alt={partner.name}
                              className="object-contain transition-all duration-500 filter brightness-0 invert opacity-50 hover:opacity-100 hover:scale-110 cursor-pointer drop-shadow-md"
                              style={{ width: (partner as any).width || "50px", height: "auto" }}
                            />
                          ) : (
                            <span className="text-white/30 font-medium uppercase tracking-[0.2em] text-[10px] md:text-xs text-center transition-opacity hover:text-white hover:opacity-100">
                              {partner.name || "Partner"}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

export default SponsorsSection;
