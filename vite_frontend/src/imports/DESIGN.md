# Design System Document: High-End Editorial Health & Nutrition

## 1. Overview & Creative North Star
**Creative North Star: "The Vital Curator"**
This design system rejects the "utilitarian dashboard" aesthetic in favor of a premium, editorial experience. It treats health data and nutritional guidance as high-end content, using the breathing room of a boutique magazine and the technical precision of a luxury performance brand. 

To break the "template" look, we move away from standard mobile-first centered columns. We embrace **intentional asymmetry**, where large-scale `display-lg` typography sits offset against expansive `surface` areas. Elements should feel "placed" rather than "poured" into a grid, utilizing overlapping layers and subtle glassmorphism to create a sense of physical depth and atmospheric quality.

---

## 2. Colors & Tonal Depth
The palette is rooted in a deep, nocturnal foundation, allowing the emerald "Primary" tones to vibrate with life.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections or containers. Boundaries must be established exclusively through:
1.  **Background Shifts:** Placing a `surface_container_low` element against a `surface` background.
2.  **Tonal Transitions:** Using the `surface_container` tiers to denote hierarchy.
3.  **Negative Space:** Leveraging the Spacing Scale (specifically `8` to `16`) to create mental groupings.

### Surface Hierarchy & Nesting
Treat the UI as a series of stacked, semi-translucent sheets. 
- **Base Layer:** `surface` (#111319).
- **Secondary Sections:** `surface_container_low` (#191b22).
- **Interactive/Focus Elements:** `surface_container_high` (#282a30).
- **Floating Overlays:** Use `surface_bright` with a 60% opacity and a 20px `backdrop-blur` to achieve the glassmorphism effect.

### The "Glass & Gradient" Rule
Standard flat buttons are insufficient for this identity. 
- **Signature CTAs:** Use a subtle linear gradient from `primary` (#67de82) to `primary_container` (#27a551) at a 135-degree angle.
- **Glass Effects:** Apply `surface_variant` at 40% opacity with `backdrop-filter: blur(12px)` for navigation bars and floating stat widgets.

---

## 3. Typography
The typography system balances the geometric modernity of **Plus Jakarta Sans** with the rhythmic readability of **Manrope**.

- **Display & Headlines (Plus Jakarta Sans):** Used for "Hero" moments and editorial titles. Use `display-lg` for daily health scores or primary section headers. Bold weights should be used sparingly to maintain an elegant, light-touch feel.
- **Body & Labels (Manrope):** Chosen for its high legibility in dark mode. `body-lg` is the standard for nutritional insights, while `label-md` is reserved for data metadata (e.g., "Protein %" or "Timestamp").
- **Editorial Hierarchy:** Always lead with a massive `display` element, followed by a wide `body-lg` paragraph. This high-contrast scale ratio (3.5rem vs 1rem) creates the "Premium Editorial" signature.

---

## 4. Elevation & Depth
In this system, elevation is a feeling, not a drop shadow.

### The Layering Principle
Depth is achieved by "stacking" tones. 
*   **Example:** A user’s meal log entry (`surface_container_high`) sits atop a daily summary panel (`surface_container_low`), which sits on the app background (`surface`). This creates a soft, natural lift without a single drop shadow.

### Ambient Shadows
If a floating element (like a modal or dropdown) requires a shadow, it must be "Ambient":
- **Blur:** 40px - 60px.
- **Opacity:** 4% - 8%.
- **Color:** Use a tinted version of `on_surface` (a soft slate) rather than pure black. This prevents the shadow from looking "dirty" on the dark background.

### The "Ghost Border" Fallback
If a divider is technically required for accessibility, use a **Ghost Border**:
- Token: `outline_variant` at 15% opacity. It should be felt, not seen.

---

## 5. Components

### Buttons
- **Primary:** Gradient fill (`primary` to `primary_container`), `label-md` uppercase, `rounded-md` (0.375rem).
- **Secondary:** Transparent background with a `Ghost Border`. Text color is `primary`.
- **Tertiary:** No background or border. `on_surface` text with a `primary` underline on hover.

### Inputs & Fields
- **Styling:** Use `surface_container_lowest` for the input field background. 
- **States:** On focus, the background shifts to `surface_container_low` with a subtle `primary` outer glow (4px blur). No solid high-contrast stroke.

### Cards & Lists
- **The Divider Ban:** Do not use lines to separate list items. Use a vertical spacing of `spacing.4` (1.4rem) between items.
- **Card Styling:** Cards should not have "boxes." They are defined by a subtle shift to `surface_container_low` and a `rounded-xl` (0.75rem) corner.

### Signature App Components
- **The "Nutrient Gauge":** A custom progress ring using `primary` for the value and `surface_container_highest` for the track.
- **The "Editorial Hero":** A wide-format section using `display-md` typography overlapping a high-resolution, desaturated food image with a `surface` gradient overlay.

---

## 6. Do's and Don'ts

### Do:
- **Use Asymmetry:** Offset your headers. Let a chart bleed off the right edge of the grid.
- **Embrace the Dark:** Keep 80% of the screen in the `surface` to `surface_container_low` range to maintain the "High-End" mood.
- **Prioritize Breathing Room:** Use `spacing.16` and `spacing.20` between major editorial sections.

### Don't:
- **Don't use 100% white:** Use `on_surface` (#e2e2eb) for text to prevent eye strain and "blooming" on dark backgrounds.
- **Don't use default "Card" layouts:** Avoid the 3-column "blog post" grid. Use varying widths (e.g., 60% for a chart, 40% for insights) to create visual interest.
- **Don't use sharp corners:** Stick to the `md` (0.375rem) and `xl` (0.75rem) roundedness to keep the interface feeling organic and approachable.