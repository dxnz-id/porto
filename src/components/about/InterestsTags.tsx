const interests = [
  "Web Development",
  "System Design",
  "Linux",
  "UI/UX",
  "Open Source",
  "Performance Optimization",
];

export default function InterestsTags() {
  return (
    <section>
      <h2 className="text-headline-lg-mobile text-primary mb-8 border-b border-border-hairline pb-4">
        Interests
      </h2>
      <div className="flex flex-wrap gap-4">
        {interests.map((interest) => (
          <span
            key={interest}
            className="text-label-mono text-primary border border-border-hairline px-6 py-2 bg-surface hover:bg-bg-off-white transition-colors duration-150"
          >
            {interest}
          </span>
        ))}
      </div>
    </section>
  );
}
