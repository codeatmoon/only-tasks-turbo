"use client";

import { useState } from "react";
import "@scss-theming/design-system-2/scss/index.scss";

export default function CSSPropsDemo() {
  const [theme, setTheme] = useState("theme-1");
  const [brand, setBrand] = useState("brand-a");
  const [mode, setMode] = useState("light-mode");

  return (
    <div
      className={`min-h-screen p-8 ${mode} ${theme} ${brand}`}
      style={{ backgroundColor: "var(--background-color)" }}
    >
      <div className="max-w-6xl mx-auto">
        <header className="mb-8">
          <h1
            className="text-4xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Design System 2: CSS Custom Properties with Light/Dark Mode
          </h1>
          <p
            className="text-lg mb-6"
            style={{ color: "var(--text-secondary)" }}
          >
            This approach uses CSS custom properties (CSS variables) with
            multi-level classes. Themes, brands, and light/dark modes are
            combined using CSS class combinations.
          </p>

          <div className="flex gap-4 mb-6 flex-wrap">
            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Mode:
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value)}
                className="border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--surface-color)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <option value="light-mode">Light Mode</option>
                <option value="dark-mode">Dark Mode</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Theme:
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--surface-color)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <option value="theme-1">Theme 1</option>
                <option value="theme-2">Theme 2</option>
              </select>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--text-primary)" }}
              >
                Brand:
              </label>
              <select
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                className="border rounded-md px-3 py-2"
                style={{
                  backgroundColor: "var(--surface-color)",
                  color: "var(--text-primary)",
                  borderColor: "var(--border-color)",
                }}
              >
                <option value="brand-a">Brand A</option>
                <option value="brand-b">Brand B</option>
              </select>
            </div>
          </div>
        </header>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Navigation Bar</h2>
          <nav className="navbar">
            <div className="navbar-brand">Brand Logo</div>
            <div className="navbar-nav">
              <a href="#" className="nav-link">
                Home
              </a>
              <a href="#" className="nav-link">
                About
              </a>
              <a href="#" className="nav-link nav-link-brand">
                Services
              </a>
              <a href="#" className="nav-link">
                Contact
              </a>
            </div>
          </nav>
        </section>

        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Buttons & Typography
          </h2>
          <div className="flex gap-4 flex-wrap mb-6">
            <button className="btn btn-sm">Small Button</button>
            <button className="btn">Default Button</button>
            <button className="btn btn-lg">Large Button</button>
            <button className="btn btn-secondary">Secondary</button>
            <button className="btn btn-accent">Accent</button>
            <button className="btn btn-brand">Brand Button</button>
          </div>

          <div className="space-y-4">
            <h1 className="heading-1">Heading 1 - Primary Font</h1>
            <h2 className="heading-2">Heading 2 - Primary Font</h2>
            <h3 className="heading-3">Heading 3 - Primary Font</h3>
            <p className="body-text">
              This is body text using the secondary font family. Notice how
              different themes apply different font families, weights, and
              spacing to create distinct personalities.
            </p>
            <code className="code-text">
              const theme = &apos;theme-1.brand-a.light-mode&apos;;
            </code>
          </div>
        </section>

        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Cards & Spacing
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="card">
              <div className="card-title">Standard Card</div>
              <div className="card-content">
                This card uses the standard theme spacing and typography. Notice
                how different themes apply different padding, font families, and
                border radius to create unique experiences. The card padding is
                controlled by <code className="code-text">--card-padding</code>.
              </div>
              <div className="card-footer">
                <button className="btn btn-accent">Learn More</button>
              </div>
            </div>

            <div className="card card-branded">
              <div className="card-title">Branded Card</div>
              <div className="card-content">
                This card uses the branded styling with theme-specific border
                radius and brand-specific title color. Each brand can override
                spacing and typography variables.
              </div>
              <div className="card-footer">
                <button className="btn btn-brand">Get Started</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card card-compact">
              <div className="card-title">Compact Card</div>
              <div className="card-content">
                This is a compact card variant with reduced padding and smaller
                typography.
              </div>
            </div>

            <div className="card card-compact card-branded">
              <div className="card-title">Compact + Branded</div>
              <div className="card-content">
                Combining multiple modifiers creates flexible design variations.
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            How It Works
          </h2>
          <div className="card">
            <div className="card-title">
              Comprehensive CSS Custom Properties Theming
            </div>
            <div className="card-content">
              <ul className="space-y-2">
                <li>
                  <strong>Base Variables:</strong> :root defines default design
                  tokens (colors, typography, spacing)
                </li>
                <li>
                  <strong>Mode Classes:</strong> .light-mode, .dark-mode
                  override base color schemes and shadows
                </li>
                <li>
                  <strong>Theme Classes:</strong> .theme-1, .theme-2 override
                  fonts, spacing, transitions, and components
                </li>
                <li>
                  <strong>Brand Modifiers:</strong> .theme-1.brand-a uses nested
                  selectors for brand-specific overrides
                </li>
                <li>
                  <strong>Class Combination:</strong> Apply all classes:
                  &quot;light-mode theme-1 brand-a&quot;
                </li>
                <li>
                  <strong>Runtime Switching:</strong> Change classes dynamically
                  with JavaScript
                </li>
                <li>
                  <strong>Fallback Values:</strong> var(--brand-accent,
                  var(--accent-color))
                </li>
                <li>
                  <strong>Design Tokens:</strong> Spacing, typography, borders,
                  shadows, and transitions
                </li>
                <li>
                  <strong>Component Variants:</strong> btn-sm, card-compact with
                  theme-aware styling
                </li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Theming System Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-title">Typography & Fonts</div>
              <div className="card-content">
                <ul className="space-y-1 text-sm">
                  <li>✅ Theme-specific font families</li>
                  <li>✅ Brand-specific font weights</li>
                  <li>✅ Responsive font sizes</li>
                  <li>✅ Line height variations</li>
                  <li>✅ Primary, secondary, and mono fonts</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Spacing & Layout</div>
              <div className="card-content">
                <ul className="space-y-1 text-sm">
                  <li>✅ Theme-specific spacing scales</li>
                  <li>✅ Component padding variations</li>
                  <li>✅ Brand-specific generous spacing</li>
                  <li>✅ Navbar height customization</li>
                  <li>✅ Card padding variations</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Visual Design</div>
              <div className="card-content">
                <ul className="space-y-1 text-sm">
                  <li>✅ Theme-specific border radius</li>
                  <li>✅ Multi-level shadow system</li>
                  <li>✅ Brand-specific transitions</li>
                  <li>✅ Light/dark shadow adaptation</li>
                  <li>✅ Component size variants</li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Developer Experience</div>
              <div className="card-content">
                <ul className="space-y-1 text-sm">
                  <li>✅ CSS-only implementation</li>
                  <li>✅ Runtime theme switching</li>
                  <li>✅ Nested class combinations</li>
                  <li>✅ Fallback value support</li>
                  <li>✅ Type-safe design tokens</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Current Design Tokens
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card">
              <div className="card-title">Colors & Typography</div>
              <div className="card-content">
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    --primary-color:{" "}
                    <span style={{ color: "var(--primary-color)" }}>■</span>
                  </div>
                  <div>
                    --accent-color:{" "}
                    <span style={{ color: "var(--accent-color)" }}>■</span>
                  </div>
                  <div>
                    --brand-accent:{" "}
                    <span
                      style={{
                        color: "var(--brand-accent, var(--accent-color))",
                      }}
                    >
                      ■
                    </span>
                  </div>
                  <div>
                    --surface-color:{" "}
                    <span style={{ color: "var(--surface-color)" }}>■</span>
                  </div>
                  <div>
                    --font-family-primary:{" "}
                    <span style={{ fontFamily: "var(--font-family-primary)" }}>
                      Sample Text
                    </span>
                  </div>
                  <div>
                    --font-family-secondary:{" "}
                    <span
                      style={{ fontFamily: "var(--font-family-secondary)" }}
                    >
                      Sample Text
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Spacing & Layout</div>
              <div className="card-content">
                <div className="space-y-2 text-sm">
                  <div>Spacing Scale:</div>
                  <div className="flex gap-1 items-end">
                    <div
                      style={{
                        width: "var(--spacing-xs)",
                        height: "var(--spacing-xs)",
                        backgroundColor: "var(--accent-color)",
                      }}
                      title="xs"
                    ></div>
                    <div
                      style={{
                        width: "var(--spacing-sm)",
                        height: "var(--spacing-sm)",
                        backgroundColor: "var(--accent-color)",
                      }}
                      title="sm"
                    ></div>
                    <div
                      style={{
                        width: "var(--spacing-md)",
                        height: "var(--spacing-md)",
                        backgroundColor: "var(--accent-color)",
                      }}
                      title="md"
                    ></div>
                    <div
                      style={{
                        width: "var(--spacing-lg)",
                        height: "var(--spacing-lg)",
                        backgroundColor: "var(--accent-color)",
                      }}
                      title="lg"
                    ></div>
                    <div
                      style={{
                        width: "var(--spacing-xl)",
                        height: "var(--spacing-xl)",
                        backgroundColor: "var(--accent-color)",
                      }}
                      title="xl"
                    ></div>
                  </div>
                  <div className="mt-2">Border Radius:</div>
                  <div className="flex gap-2">
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "var(--accent-color)",
                        borderRadius: "var(--radius-sm)",
                      }}
                      title="sm"
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "var(--accent-color)",
                        borderRadius: "var(--radius-md)",
                      }}
                      title="md"
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "var(--accent-color)",
                        borderRadius: "var(--radius-lg)",
                      }}
                      title="lg"
                    ></div>
                    <div
                      style={{
                        width: "20px",
                        height: "20px",
                        backgroundColor: "var(--accent-color)",
                        borderRadius: "var(--radius-xl)",
                      }}
                      title="xl"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Dynamic Styling
          </h2>
          <div className="card">
            <div className="card-title">
              Active Configuration: {mode}.{theme}.{brand}
            </div>
            <div className="card-content">
              <p className="mb-4" style={{ color: "var(--text-secondary)" }}>
                The entire page theme is controlled by CSS classes applied to
                the root element. This allows for dynamic theme switching
                without page reloads, supporting light/dark modes, different
                themes, and brand variations.
              </p>
              <div className="flex gap-2 flex-wrap">
                <div
                  className="w-16 h-16 rounded border-2"
                  style={{
                    backgroundColor: "var(--primary-color)",
                    borderColor: "var(--border-color)",
                  }}
                  title="Primary Color"
                ></div>
                <div
                  className="w-16 h-16 rounded border-2"
                  style={{
                    backgroundColor: "var(--accent-color)",
                    borderColor: "var(--border-color)",
                  }}
                  title="Accent Color"
                ></div>
                <div
                  className="w-16 h-16 rounded border-2"
                  style={{
                    backgroundColor: "var(--brand-accent, var(--accent-color))",
                    borderColor: "var(--border-color)",
                  }}
                  title="Brand Accent"
                ></div>
                <div
                  className="w-16 h-16 rounded border-2"
                  style={{
                    backgroundColor: "var(--surface-color)",
                    borderColor: "var(--border-color)",
                  }}
                  title="Surface Color"
                ></div>
                <div
                  className="w-16 h-16 rounded border-2"
                  style={{
                    backgroundColor: "var(--background-color)",
                    borderColor: "var(--border-color)",
                  }}
                  title="Background Color"
                ></div>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-8">
          <h2
            className="text-2xl font-semibold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            Theme Characteristics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <div className="card-title">Theme 1 - Modern Tech</div>
              <div className="card-content">
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Typography:</strong> Inter, SF Pro Display (clean,
                    modern)
                  </li>
                  <li>
                    <strong>Spacing:</strong> Compact, efficient spacing scale
                  </li>
                  <li>
                    <strong>Border Radius:</strong> Sharp, minimal corners
                  </li>
                  <li>
                    <strong>Transitions:</strong> Snappy, quick (120-280ms)
                  </li>
                  <li>
                    <strong>Personality:</strong> Technical, precise, efficient
                  </li>
                  <li>
                    <strong>Brand A:</strong> Poppins font, extra bold weights,
                    generous padding
                  </li>
                  <li>
                    <strong>Brand B:</strong> Roboto font, more rounded corners
                  </li>
                </ul>
              </div>
            </div>

            <div className="card">
              <div className="card-title">Theme 2 - Elegant Premium</div>
              <div className="card-content">
                <ul className="space-y-2 text-sm">
                  <li>
                    <strong>Typography:</strong> Playfair Display, Source Sans
                    Pro (elegant)
                  </li>
                  <li>
                    <strong>Spacing:</strong> Generous, luxurious spacing scale
                  </li>
                  <li>
                    <strong>Border Radius:</strong> Soft, rounded edges
                  </li>
                  <li>
                    <strong>Transitions:</strong> Smooth, elegant (200-500ms)
                  </li>
                  <li>
                    <strong>Personality:</strong> Premium, sophisticated,
                    spacious
                  </li>
                  <li>
                    <strong>Brand A:</strong> Crimson Text, extra luxurious
                    spacing
                  </li>
                  <li>
                    <strong>Brand B:</strong> Lora font, very rounded corners
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
