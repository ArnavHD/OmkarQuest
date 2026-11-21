import { Sparkles, BookOpen, Flower2 } from "lucide-react";

const ComingSoon = () => {
  return (
    <div className="flex min-h-[75dvh] w-full items-center justify-center px-4 py-8 sm:px-6">
      <div
        className="
          relative w-full max-w-lg overflow-hidden
          rounded-[24px] border-2 border-[#D9A35D]
          bg-gradient-to-br from-[#FFF9ED] via-[#FFE9C8] to-[#F4CF96]
          px-6 py-9 text-center
          shadow-[0_12px_40px_rgba(105,39,11,0.25)]
          sm:rounded-[30px] sm:px-12 sm:py-12
        "
      >
        {/* Decorative corner icons */}
        <Sparkles
          className="absolute left-5 top-5 text-[#C68B35]/70"
          size={20}
        />
        <Sparkles
          className="absolute bottom-5 right-5 text-[#C68B35]/70"
          size={20}
        />

        {/* Main icon */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#E3B36D] bg-[#FFF3DA] shadow-[0_5px_20px_rgba(183,119,51,0.2)] sm:h-24 sm:w-24">
          <div className="absolute inset-2 rounded-full border border-dashed border-[#D9A257]/70" />

          <BookOpen
            className="relative z-10 h-10 w-10 text-[#87152A] sm:h-12 sm:w-12"
            strokeWidth={1.5}
          />
        </div>

        {/* Status */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#D9AC70] bg-[#FFF6E7] px-4 py-1.5 text-xs font-semibold tracking-wide text-[#8D1428] sm:text-sm">
          <Flower2 size={16} />
          Something Beautiful Is Blooming
        </div>

        {/* Heading */}
        <h2 className="font-serif text-2xl font-bold leading-tight text-[#87152A] sm:text-4xl">
          New Content Coming Soon
        </h2>

        {/* Description */}
        <p className="mx-auto mt-4 max-w-sm font-serif text-sm leading-relaxed text-[#70412D] sm:mt-5 sm:text-lg">
          A new chapter of wisdom, reflection, and spiritual discovery is on its
          way.
        </p>

        {/* Decorative divider */}
        <div className="my-6 flex items-center justify-center gap-3 sm:my-8">
          <span className="h-px w-14 bg-gradient-to-r from-transparent to-[#B97930] sm:w-20" />

          <Flower2 className="h-5 w-5 text-[#A56A2C]" />

          <span className="h-px w-14 bg-gradient-to-l from-[#B97930] to-transparent sm:w-20" />
        </div>

        {/* Closing message */}
        <p className="font-serif text-xs italic text-[#96602F] sm:text-sm">
          Stay inspired. More meaningful experiences await.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
