# Design System Documentation

## 1. Color Scheme

- **Main Gradient:** Purple (`purple-600`) to Pink (`pink-600`)
- **Additional Gradients:**
  - Purple → Indigo (`purple-600` → `indigo-600`)
  - Pink → Purple (`pink-600` → `purple-600`)
- **Neutral Colors:**
  - Text: `text-gray-600`
  - Background: `bg-white`
  - Dividers: `border-gray-100`

## 2. Typography

### Headings

- Size: `text-4xl`/`text-5xl`
- Weight: `font-bold`
- Gradient Text: `bg-clip-text text-transparent`
- Tracking: `tracking-tight`

### Subheadings

- Size: `text-2xl`
- Case: `uppercase`
- Tracking: `tracking-widest`

### Body Text

- Size: `text-lg`
- Line Height: `leading-relaxed`
- Color: `text-gray-700`

## 3. Animations & Transitions

- Smooth Transitions: `transition-all duration-300`
- Entrance Animations:
  - Top to Bottom: `initial={{ y: -100 }}`
  - Left to Right: `initial={{ x: -20 }}`
  - Fade In: `initial={{ opacity: 0 }}`
- Animation Delays: `transition={{ delay: 0.2 }}`
- Hover Effects:
  - Scale: `hover:scale-[1.02]`
  - Color Change: `hover:text-purple-600`
  - Underline Expansion: `group-hover:w-full`

## 4. Components

### Buttons

- Gradient Background
- Shadows: `shadow-xl`
- Border Radius: `rounded-xl`
- Icons and Text

### Cards

- White Background
- Shadows: `shadow-xl`
- Hover Effect
- Rounded Corners

## 5. Effects & Features

- Blur Effects: `backdrop-blur-md`
- Semi-transparency: `bg-white/80`
- Gradient Overlays
- Hover Underlines
- Sticky Positioning

## 6. Responsive Design

### Breakpoints

- Mobile: `max-md`
- Tablet: `max-lg`
- Desktop: Default

### Grid Systems

- Two Columns: `grid-cols-2`
- Three Columns: `grid-cols-3`
- Adaptive Spacing

## 7. Interactive Elements

### Links

- Hover Underline
- Color Change
- Smooth Transitions

### Buttons

- Scale on Hover
- Shadow Changes
- Gradient Effects

## 8. Structure & Spacing

### Containers

- Max Width
- Padding: `px-4`
- Centering: `mx-auto`

### Spacing

- Section Spacing: `py-16`
- Element Spacing: `gap-8`
- Internal Padding: `p-8`

## 9. Special Effects

- Gradient Text
- Variable Shadow Intensity
- Transparency & Blur
- Animated Underlines
- Hover Scaling

## 10. Consistency

- Unified Color Scheme
- Consistent Transitions
- Similar Hover Effects
- Standardized Spacing
- Typography System

## Implementation Notes

This design system creates a modern, professional look with emphasis on interactivity and visual
appeal while maintaining good readability and user experience. The system uses a combination of
gradients, animations, and interactive elements to create an engaging interface that remains
functional and accessible.

### Best Practices

1. Always use the predefined color gradients for consistency
2. Maintain proper spacing hierarchy
3. Ensure animations are subtle and purposeful
4. Keep text readable with appropriate contrast
5. Use responsive breakpoints consistently
6. Implement hover states for interactive elements
7. Maintain consistent component styling
8. Use blur effects sparingly and purposefully
9. Ensure proper contrast for accessibility
10. Keep animations performant and smooth
