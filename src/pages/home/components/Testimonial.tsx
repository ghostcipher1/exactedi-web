export default function Testimonial() {
  return (
    <section className="py-16 md:py-24 bg-stedi-gray-light">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        <div className="bg-white rounded-2xl border border-stedi-gray-border p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-stedi-green/5 rounded-full blur-2xl" />
          <div className="relative z-10">
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ri-star-fill text-stedi-green text-sm" />
              ))}
            </div>
            <blockquote className="text-lg md:text-xl text-stedi-dark-text leading-relaxed mb-8">
              "Data exchange in the healthcare space is unbelievably complicated. Every partner has their own way of doing things, and ExactEDI helped us accommodate that without cluttering our systems with all of the complexity."
            </blockquote>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-stedi-gray flex items-center justify-center shrink-0">
                <img
                  src="https://framerusercontent.com/images/nYMfpDkTEmoAAII9y7EkqG7h0.webp?width=140&height=140"
                  alt="Pam Beardsell"
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-stedi-dark-text">
                  Pam Beardsell
                </p>
                <p className="text-xs text-stedi-gray-text">
                  Lead Engineer at Yuzu Health
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}