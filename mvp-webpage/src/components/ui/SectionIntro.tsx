type SectionIntroProps = {
  eyebrow: string;
  title: string;
  description: string;
};

function SectionIntro({ eyebrow, title, description }: SectionIntroProps) {
  return (
    <div className="section-copy">
      <span className="eyebrow">{eyebrow}</span>
      <h2 className="mt-5 text-3xl font-extrabold tracking-[-0.05em] text-ink md:text-5xl">
        {title}
      </h2>
      <p className="mt-4 text-base leading-8 text-slate-600 md:text-lg">{description}</p>
    </div>
  );
}

export default SectionIntro;
