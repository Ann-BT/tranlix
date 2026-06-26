# Design System Master File (Tranlix)

> **LOGIC:** This is the Global Source of Truth for the Tranlix web application design.
> All pages and custom features must align with the parameters defined here to maintain a premium, state-of-the-art product aesthetic.

---

## Brand Identity & Core Values

Tranlix is a professional document translation platform that processes office documents (`.docx`, `.pptx`, `.xlsx`) via LLM engines while **strictly preserving original layout, styling, and formatting**. 

The UI must reflect:
- **Accuracy & Trust**: Clean, structural alignments, professional navy and teal colors, zero layout shifting.
- **Ease of Use**: A straightforward drag-and-drop workflow, instant validation, clear tooltips.
- **Transparency**: High-visibility progress meters, clear status descriptions, and immediate actions for success/failure.

---

## 1. Visual Tokens

### Core Color Palette
The colors are directly bound to the custom Material UI Theme (`tranlix/src/theme/theme.ts`).

| Color Role | Hex Code | Usage / Context |
| :--- | :--- | :--- |
| **Primary** | `#00949D` | Dominant brand elements, primary CTAs, focal points, focused border state. |
| **Primary Hover** | `#007B82` | Hover state for buttons and clickable primary cards. |
| **Primary Active** | `#00676D` | Active / pressed state for primary action buttons. |
| **Primary Light** | `#E6F6F7` | Soft alerts, dropzone hover highlights, selected background fills. |
| **Secondary** | `#1B4B6D` | Text highlights, secondary headers, navigation markers, review status. |
| **Secondary Hover**| `#163D59` | Hover state for secondary outline buttons. |
| **Secondary Light**| `#EAF2F8` | Soft background for details, drawer callouts, neutral highlights. |
| **Background (Default)** | `#FFFFFF` | Core content containers, white cards. |
| **Background (Paper)** | `#F8FAFC` | Main app background, sidebar fills, subtle page section contrasts. |
| **Background (Tertiary)** | `#F1F5F9` | Table header background, neutral dividers. |
| **Border** | `#D1E5E7` | Standard input borders, card boundaries, table separators. |
| **Border Focus** | `#00949D` | Active outlines for input fields, text areas, and checkboxes. |

### Semantic Colors
Mapped directly to the application's feedback mechanism:

- **Success / Completed**: `#16A34A` (Green) — Successful translation, ready to download.
- **Warning / Pending**: `#F59E0B` (Amber/Gold) — Job in queue, awaiting scheduler.
- **Info / Processing**: `#0284C7` (Sky Blue) — Uploading, parsing OOXML, or running LLM translate.
- **Error / Failed**: `#DC2626` (Crimson Red) — Pipeline crash, parsing exception, or connection issue.

---

## 2. Typography

We use Google Fonts to ensure readability, spacing consistency, and an approachable feel.

- **Headings Font**: `"Lexend", sans-serif`
  - *Attributes*: Geometric structure, friendly curves, clean weight distribution.
  - *Weights*: 600 (Semibold) for subheadings, 700 (Bold) for main titles.
- **Body & Controls Font**: `"Source Sans 3", sans-serif`
  - *Attributes*: Exceptional legibility for dense text blocks, list views, and tables.
  - *Weights*: 400 (Regular), 500 (Medium), 600 (Semibold).

---

## 3. UI Components Specification

### A. Document Upload Dropzone
- **Normal State**: Border is `2px dashed #D1E5E7`. Inner fill is `#FFFFFF`. Text is `#475569` with helper text pointing to supported formats (`.docx`, `.pptx`, `.xlsx`, etc.).
- **Drag-Over State**: Border turns solid `2px #00949D`. Inner fill shifts to `#E6F6F7` (Primary Light) with a subtle transition.
- **File Selected State**: Shows the filename in bold `"Lexend"`, a custom file icon based on extension (e.g. Word Blue, PowerPoint Orange, Excel Green), and a "Remove" button with standard hover feedback.

### B. Translation Settings & Form
- **Language Selector**: Native MUI `TextField` (select variant) mapping target languages. Uses theme borders with a `transition-color` on hover.
- **Inline Mode Toggle**: An interactive toggle button with a companion details icon.
  - **Tooltips/Popover details must specify:**
    - *Merge Mode* (Default): Gathers text paragraphs together and writes translation to the first styling block. Safest for formatting, but may lose bold styling within a sentence.
    - *Inline Mode*: Places delimiters around styles inside sentences so the LLM retains formatting (bold, color, italics) down to specific words. Best effort.
- **Action Buttons**:
  - Outlined button with custom theme border transitions.
  - Contained button with absolute brand colors (no direct `var()` hacks — styled inside theme context).

### C. Job Monitor Board
- **Linear Progress**: Clean `LinearProgress` component using the Sky Blue `#0284C7` color while running. Displays a text indicator showing progress percentage (e.g. `45%`).
- **Collapsible Detail Drawers**: When a user clicks a translation row, it slides open (or expands) to show:
  - File statistics (file size, total segments identified, processing mode).
  - Accurate date-time formats for creation and completion.
  - Error logs (if state is `failed`) formatted in a clean monospaced red alert block.

---

## 4. Interaction & UX Rules

### Do's (Required)
- **Visual Feedback**: Apply `cursor: pointer` to all clickable rows, cards, select fields, and buttons.
- **Stable Transitions**: Use `transition: all 150ms cubic-bezier(0.4, 0, 0.2, 1)` on hovers. Never allow hover transformations to scale cards in a way that shifts siblings or triggers scrollbars.
- **Keyboard accessibility**: Ensure focus rings are visible (`outline: 3px solid #00949D`) during tab navigation.

### Don'ts (Strictly Forbidden)
- ❌ **No Emoji Icons**: Do not use emojis (🚀, 📁, ⚙️) as icons. Use official SVG icons from Material Icons, Heroicons, or Lucide.
- ❌ **No Unstyled Hover States**: Interactive elements must not have sudden, sharp state switches (always require 150-300ms transitions).
- ❌ **Low Contrast Texts**: Do not use grey text lighter than `#475569` (slate-600) on white backgrounds to respect accessibility contrast ratios (4.5:1 minimum).
- ❌ **Hidden Overflow**: Ensure tables scroll horizontally on small viewports without breaking the surrounding layout grid.

---

## 5. Pre-Delivery Checklist

- [ ] Verify that Google Fonts `"Lexend"` and `"Source Sans 3"` load and display properly.
- [ ] Confirm `cursor: pointer` is set on dropzones, buttons, and clickable list headers.
- [ ] Verify that the file remove button functions and resets form values.
- [ ] Inspect status chip colors against the custom status tokens in `theme.ts`.
- [ ] Test the responsiveness on mobile viewports (minimum width `375px`) to confirm no layout breakage.
