export default function Home() {
  return (
    <main className="flex-grow px-margin-mobile md:px-margin-desktop py-section-gap">
      {/* Test: Design System Validation */}
      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        <div>
          <h1 className="text-headline-xl text-primary">DXNZ</h1>
          <p className="text-body-lg text-secondary mt-4">
            Design system loaded successfully.
          </p>
        </div>

        <div className="border-t border-border-hairline pt-8 flex flex-col gap-6">
          <h2 className="text-headline-lg text-primary">Typography</h2>
          <p className="text-headline-lg-mobile text-on-surface">
            Headline LG Mobile (32px)
          </p>
          <p className="text-body-lg text-on-surface">Body Large (18px)</p>
          <p className="text-body-md text-on-surface-variant">
            Body Medium (16px)
          </p>
          <p className="text-label-mono text-secondary">
            Label Mono (14px JetBrains)
          </p>
          <p className="text-label-caps text-text-muted">
            Label Caps (12px uppercase)
          </p>
        </div>

        <div className="border-t border-border-hairline pt-8 flex flex-col gap-4">
          <h2 className="text-headline-lg text-primary">Colors</h2>
          <div className="flex flex-wrap gap-4">
            <div className="w-20 h-20 bg-primary" />
            <div className="w-20 h-20 bg-secondary" />
            <div className="w-20 h-20 bg-surface border border-border-hairline" />
            <div className="w-20 h-20 bg-surface-container" />
            <div className="w-20 h-20 bg-bg-off-white border border-border-hairline" />
            <div className="w-20 h-20 bg-error" />
          </div>
        </div>

        <div className="border-t border-border-hairline pt-8 flex flex-col gap-4">
          <h2 className="text-headline-lg text-primary">Spacing</h2>
          <div className="flex flex-wrap gap-gutter">
            <span className="text-label-mono text-secondary border border-border-hairline px-6 py-2">
              Tag / Chip
            </span>
            <span className="text-label-mono text-secondary border border-border-hairline px-6 py-2">
              Another Tag
            </span>
            <span className="text-label-mono text-secondary border border-border-hairline px-6 py-2">
              System Design
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}
