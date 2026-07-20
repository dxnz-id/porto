---
name: Architectural Monochrome
colors:
  surface: '#f9f9f9'
  surface-dim: '#dadada'
  surface-bright: '#f9f9f9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f3f4'
  surface-container: '#eeeeee'
  surface-container-high: '#e8e8e8'
  surface-container-highest: '#e2e2e2'
  on-surface: '#1a1c1c'
  on-surface-variant: '#4c4546'
  inverse-surface: '#2f3131'
  inverse-on-surface: '#f0f1f1'
  outline: '#7e7576'
  outline-variant: '#cfc4c5'
  surface-tint: '#5e5e5e'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#1b1b1b'
  on-primary-container: '#848484'
  inverse-primary: '#c6c6c6'
  secondary: '#585f6c'
  on-secondary: '#ffffff'
  secondary-container: '#dce2f3'
  on-secondary-container: '#5e6572'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#191c1f'
  on-tertiary-container: '#818488'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c6'
  on-primary-fixed: '#1b1b1b'
  on-primary-fixed-variant: '#474747'
  secondary-fixed: '#dce2f3'
  secondary-fixed-dim: '#c0c7d6'
  on-secondary-fixed: '#151c27'
  on-secondary-fixed-variant: '#404754'
  tertiary-fixed: '#e0e2e6'
  tertiary-fixed-dim: '#c4c7ca'
  on-tertiary-fixed: '#191c1f'
  on-tertiary-fixed-variant: '#44474a'
  background: '#f9f9f9'
  on-background: '#1a1c1c'
  surface-variant: '#e2e2e2'
  border-hairline: '#E5E7EB'
  text-muted: '#6B7280'
  bg-off-white: '#F9FAFB'
typography:
  headline-xl:
    fontFamily: Hanken Grotesk
    fontSize: 72px
    fontWeight: '700'
    lineHeight: 80px
    letterSpacing: -0.04em
  headline-lg:
    fontFamily: Hanken Grotesk
    fontSize: 48px
    fontWeight: '600'
    lineHeight: 56px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Hanken Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.05em
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
spacing:
  unit: 4px
  gutter: 24px
  margin-desktop: 64px
  margin-mobile: 24px
  section-gap: 128px
---

## Brand & Style

This design system is built for the elite fullstack developer, emphasizing precision, technical mastery, and structural integrity. The aesthetic is rooted in **Minimalism** with an **Architectural** influence, prioritizing content through rigorous grid systems and high-contrast typography. 

The brand personality is authoritative yet understated, evoking an emotional response of clarity and extreme professionalism. Every element is intentional, avoiding unnecessary ornamentation like gradients or heavy shadows in favor of hairline dividers and expansive whitespace. The goal is to present code and projects as modern artifacts.

## Colors

The palette is strictly monochrome to maintain a high-end, gallery-like feel. 

- **Primary Background:** Pure `#FFFFFF` provides a clean canvas that pushes content forward.
- **Primary Text:** Deep `#000000` ensures maximum legibility and a bold, confident voice for headlines.
- **Accents & Borders:** Light grays (`#E5E7EB`) are used exclusively for structural elements like dividers and grid lines. 
- **Functional Grays:** Medium gray (`#6B7280`) is reserved for metadata, secondary labels, and supporting body copy to create a clear visual hierarchy without introducing hue.

## Typography

Typography is the primary vehicle for the design system's character. 

- **Headlines:** Use **Hanken Grotesk** for a sharp, contemporary sans-serif look. Large scales and tight letter-spacing are used for a "Swiss-style" impact.
- **Body:** **Inter** provides a highly readable, neutral canvas for long-form content and descriptions.
- **Technical/Data:** **JetBrains Mono** is utilized for code snippets, technical tags, and versioning to emphasize the fullstack nature of the portfolio.
- **Hierarchy:** High contrast is achieved through drastic size differences between headlines and body text.

## Layout & Spacing

The layout is governed by a **strict 12-column fixed grid** on desktop, shifting to a 4-column fluid grid on mobile. 

- **Whitespace:** Generous section gaps (128px+) are used to separate projects and content blocks, giving the UI an "editorial" feel.
- **Dividers:** Horizontal and vertical hairline dividers (1px, `#E5E7EB`) should be used to define the grid visually, especially between navigation items and list entries.
- **Alignment:** All elements must align to the grid edges. Text-heavy sections should utilize wide left margins to create asymmetrical interest.

## Elevation & Depth

This design system avoids traditional shadows. Depth is achieved through:

- **Flat Tonal Layers:** Different content areas may use a very light off-white (`#F9FAFB`) against the pure white background to denote containment.
- **Structural Outlines:** Components are defined by 1px solid borders rather than depth effects.
- **High-Contrast Overlays:** Modals or menus should use a solid black border or a very subtle backdrop dimming to maintain the monochrome aesthetic without introducing blur.

## Shapes

The shape language is strictly **Sharp (0px)**. 

To reinforce the architectural and professional theme, all buttons, input fields, cards, and image containers must have square corners. This creates a rigorous, engineered look that distinguishes the portfolio from consumer-grade software.

## Components

- **Buttons:** Primary buttons are solid black with white text; secondary buttons are white with a 1px black border. All buttons are rectangular with no corner radius.
- **Inputs:** Simple bottom-border only (hairline) for a minimal look, or a full 1px border. Focus state should be a thickness change to 2px black.
- **Chips/Tags:** Use the `label-mono` font style. Tags should be enclosed in a 1px gray border with significant horizontal padding.
- **Cards:** Project cards should not have background colors or shadows. Use a hairline top divider and large-scale imagery.
- **Lists:** Use `label-caps` for list headers. Each list item is separated by a full-width hairline divider.
- **Navigation:** Top-aligned, fixed, with vertical hairline dividers separating the menu items.