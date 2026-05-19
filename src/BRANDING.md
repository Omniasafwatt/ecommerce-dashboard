# Mobile 2000 Branding Guide

## Overview
Mobile 2000 is a premium mobile shopping dashboard with a modern, professional light blue color palette designed for elegance and clarity.

## Primary Brand Colors

### Light Blue (Primary) - `#0EA5E9`
- **Usage**: Primary buttons, headers, links, active states
- **Shade Range**: 50-900
- **Description**: The signature light blue from the Mobile 2000 branding, representing trust, clarity, and modern technology

### Sky Blue (Secondary) - `#0EA5E9`
- **Usage**: Secondary actions, accents, hover states
- **Shade Range**: 50-900
- **Description**: Sky blue tones that complement the primary light blue

### Neutral Colors
- **Dark Gray** (`#111827` - 900): Primary text
- **Light Gray** (`#6B7280` - 500): Secondary text
- **White** (`#FFFFFF`): Backgrounds and text on dark

## Color Usage Guidelines

### UI Components
- **Buttons**: Light blue (`#0EA5E9`) for main actions
- **Links**: Light blue with underline
- **Inputs**: Neutral borders, light blue focus ring
- **Cards**: White background with subtle neutral border
- **Sidebar**: Dark gray/black with light blue accents
- **Success**: `#10B981`
- **Warning**: `#F59E0B`
- **Error**: `#EF4444`
- **Info**: `#0EA5E9`

### Gradients
- **Primary Gradient**: `linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)`
- **Sky Gradient**: `linear-gradient(135deg, #38BDF8 0%, #0EA5E9 100%)`

## Components

### MobileLogo2000
Component for displaying the Mobile 2000 branding throughout the application.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `variant`: 'full' | 'mark' | 'text' (default: 'full')
- `className`: Custom CSS classes

**Variants:**
- `mark`: Just the logo box with "M"
- `text`: Just the text name and tagline
- `full`: Logo + text together

**Example:**
```tsx
import MobileLogo2000 from '@/components/MobileLogo2000'

<MobileLogo2000 size="lg" variant="full" />
<MobileLogo2000 size="md" variant="mark" />
```

### DashboardHeader
A branded header component for page headers.

**Props:**
- `title`: Page title (optional)
- `showBrand`: Show brand logo (default: true)
- `compact`: Compact mode (default: false)

**Example:**
```tsx
import DashboardHeader from '@/components/DashboardHeader'

<DashboardHeader title="Dashboard" showBrand={true} />
```

### BrandButton
A button component styled with Mobile 2000 colors.

**Props:**
- `variant`: 'primary' | 'secondary' | 'outline' | 'ghost' (default: 'primary')
- `size`: 'sm' | 'md' | 'lg' (default: 'md')
- Standard HTML button attributes

**Example:**
```tsx
import BrandButton from '@/components/BrandButton'

<BrandButton variant="primary" size="md">Click Me</BrandButton>
<BrandButton variant="outline" size="lg">Outline</BrandButton>
```

## Tailwind Classes

Custom color classes are available in Tailwind:

```html
<!-- Mobile 2000 Colors -->
<div class="bg-m2000-500">Primary Light Blue</div>
<div class="text-m2000-700">Dark Blue Text</div>

<!-- Sky Blue -->
<div class="bg-m2000-cyan-500">Sky Blue Background</div>

<!-- Gradients -->
<div class="bg-m2000-gradient">Gradient Background</div>

<!-- Dark -->
<div class="bg-m2000-dark text-white">Dark Background</div>
```

## Brand Configuration

All brand settings are centralized in `/src/config/branding.ts`:

```typescript
import { BRAND, COLORS, BRANDING, THEME } from '@/config/branding'

// Access brand name
console.log(BRAND.name) // "Mobile 2000"

// Access colors
const primaryBlue = COLORS.primary[500] // "#0EA5E9"

// Access branding config
const gradientBg = BRANDING.gradients.primary
```

## Accessibility

- Light blue (`#0EA5E9`) has excellent contrast with white text
- Dark gray (`#111827`) has excellent contrast with white backgrounds
- Focus states use a 2px ring around interactive elements
- All interactive elements have proper hover/active states

## Mobile Responsive

All branding components are fully responsive and work seamlessly across device sizes.

---

**Last Updated**: May 14, 2026
**Theme**: Light Blue Professional
