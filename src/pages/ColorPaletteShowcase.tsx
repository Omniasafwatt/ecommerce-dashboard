import { COLORS, BRAND, BRANDING } from '@/config/branding'

/**
 * Mobile 2000 Color Palette Showcase
 * Displays all available light blue colors in the brand palette
 */
export default function ColorPaletteShowcase() {
  const ColorSwatch = ({ name, hex }: { name: string; hex: string }) => (
    <div className="flex flex-col items-center gap-2">
      <div
        className="w-16 h-16 rounded-lg shadow-md border border-gray-200"
        style={{ backgroundColor: hex }}
      />
      <div className="text-center text-xs">
        <p className="font-semibold">{name}</p>
        <p className="text-gray-500 font-mono">{hex}</p>
      </div>
    </div>
  )

  const ColorRow = ({ title, colors }: { title: string; colors: Record<string, string> }) => (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-4">
        {Object.entries(colors).map(([key, value]) => (
          <ColorSwatch key={key} name={key} hex={value} />
        ))}
      </div>
    </div>
  )

  return (
    <div className="p-6 bg-white">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">
          <span style={{ color: COLORS.primary[500] }}>Mobile 2000</span>
        </h1>
        <p className="text-gray-600 text-lg">{BRAND.tagline}</p>
      </div>

      <div className="mb-8 p-6 rounded-lg" style={{ background: BRANDING.gradients.primary }}>
        <h2 className="text-white text-2xl font-bold">Light Blue Premium Theme</h2>
        <p className="text-blue-100 mt-2">Modern, Professional, Elegant Design</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-8">
        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Primary Light Blue</h3>
          <p className="text-sm text-gray-600 mb-4">
            The signature light blue from Mobile 2000. Use for primary actions, headers, and main interactions.
          </p>
          <div className="inline-block px-4 py-2 rounded text-white" style={{ background: COLORS.primary[500] }}>
            Primary Button
          </div>
        </div>

        <div className="p-6 bg-gray-50 rounded-lg">
          <h3 className="font-semibold mb-4">Secondary Sky Blue</h3>
          <p className="text-sm text-gray-600 mb-4">
            Complementary sky blue tones. Use for secondary actions and accents.
          </p>
          <div className="inline-block px-4 py-2 rounded text-white" style={{ background: COLORS.sky[500] }}>
            Secondary Button
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-6">Color Palette</h2>

        <ColorRow title="Primary Light Blue" colors={COLORS.primary} />
        <ColorRow title="Secondary Sky Blue" colors={COLORS.sky} />

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Neutral Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            <ColorSwatch name="White" hex={COLORS.neutral.white} />
            <ColorSwatch name="50" hex={COLORS.neutral[50]} />
            <ColorSwatch name="100" hex={COLORS.neutral[100]} />
            <ColorSwatch name="200" hex={COLORS.neutral[200]} />
            <ColorSwatch name="300" hex={COLORS.neutral[300]} />
            <ColorSwatch name="400" hex={COLORS.neutral[400]} />
            <ColorSwatch name="500" hex={COLORS.neutral[500]} />
            <ColorSwatch name="600" hex={COLORS.neutral[600]} />
            <ColorSwatch name="700" hex={COLORS.neutral[700]} />
            <ColorSwatch name="800" hex={COLORS.neutral[800]} />
            <ColorSwatch name="900" hex={COLORS.neutral[900]} />
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold mb-4">Status Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <ColorSwatch name="Success" hex={COLORS.success} />
            <ColorSwatch name="Warning" hex={COLORS.warning} />
            <ColorSwatch name="Error" hex={COLORS.error} />
            <ColorSwatch name="Info" hex={COLORS.info} />
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Gradients</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div
            className="h-24 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ background: BRANDING.gradients.primary }}
          >
            Primary Gradient
          </div>
          <div
            className="h-24 rounded-lg flex items-center justify-center text-white font-bold"
            style={{ background: BRANDING.gradients.accent }}
          >
            Accent Gradient
          </div>
        </div>
      </div>

      <div className="p-6 bg-blue-50 rounded-lg border-l-4" style={{ borderColor: COLORS.primary[500] }}>
        <h3 className="font-semibold mb-2">Usage Guide</h3>
        <ul className="text-sm text-gray-700 space-y-1">
          <li>• <strong>Primary Cyan:</strong> Main buttons, headers, active states, links</li>
          <li>• <strong>Secondary Teal:</strong> Secondary actions, hover states, accents</li>
          <li>• <strong>Neutral:</strong> Text, backgrounds, borders</li>
          <li>• <strong>Status Colors:</strong> Success, warning, error, info messages</li>
        </ul>
      </div>
    </div>
  )
}
