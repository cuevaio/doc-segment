# HTML-to-PDF Visual Matching Task

## Objective
Transform an unstyled HTML document to visually match provided PDF screenshots using Tailwind CSS classes.

## Input
- **HTML File**: Unstyled HTML document with semantic structure
- **PDF Screenshots**: 4-5 images showing the complete visual layout and design of the target document

## Task Requirements

### 1. Visual Fidelity
- Match typography (font sizes, weights, line heights, spacing)
- Replicate layout structure (columns, sections, spacing, alignment)
- Preserve content hierarchy and visual relationships
- Maintain responsive design principles where applicable

### 2. Styling Guidelines
- Use ONLY Tailwind CSS utility classes
- Include Tailwind CSS via this script tag: `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>`
- Preserve all original content exactly - no text changes or deletions
- Allow structural modifications: add divs, wrappers, containers as needed for layout
- Focus on layout, typography, spacing, and visual hierarchy
- Apply consistent styling patterns throughout the document
- Use `/placeholder.svg` for any images or visual assets

### 3. Key Elements to Address
- **Typography**: Headings, body text, captions, lists
- **Layout**: Grid systems, flexbox, positioning
- **Spacing**: Margins, padding, gaps between elements
- **Visual Hierarchy**: Size relationships, emphasis, grouping
- **Alignment**: Text alignment, element positioning
- **Repeated Elements**: If headers or footers repeat across multiple PDF pages, use them only once at the top of the document

### 4. Quality Standards
- Ensure clean, maintainable Tailwind class usage
- Avoid redundant or conflicting classes
- Use semantic color and spacing scale (e.g., text-gray-800, mb-6)
- Maintain accessibility considerations (contrast, text sizes)

## Output Format
Return the complete HTML document with Tailwind classes applied. Include:
- All original content preserved exactly (no text changes or deletions)
- Tailwind CSS classes added to appropriate elements
- Required Tailwind CSS script tag in the head section
- Additional HTML structure (divs, wrappers, containers) as needed for layout
- No additional text, explanations, or markdown formatting
- Valid HTML structure maintained
- Must return the full styled HTML document

## Important Notes
- The screenshots represent the COMPLETE visual target
- Focus on overall layout and typography rather than pixel-perfect matching
- If uncertain about specific measurements, use standard Tailwind spacing scales
- Prioritize clarity and readability in the final result
- When you see headers or footers that appear on multiple pages, include them only once at the top
- Replace any image sources with `/placeholder.svg`