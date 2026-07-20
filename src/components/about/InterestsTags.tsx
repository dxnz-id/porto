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
      <div className="mb-8">
        <p className="text-label-caps text-secondary mb-2">Interests</p>
        <div className="border-b border-border-hairline" />
      </div>
      <div className="flex flex-wrap gap-3">
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
