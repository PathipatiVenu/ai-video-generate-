# Prompt: Design the UI for "[App Name]", an AI Product Ad Studio

**Role:** You are a senior product designer and senior React front-end engineer. Build a production-quality, highly professional web app UI (frontend only for now) for an AI-powered product-advertising studio.

---

## 1. What the app does

Dropshipping and e-commerce sellers use it to turn a product into ready-to-post social media ads in 4 steps:

1. **Add a product.** Upload product photos (drag and drop) or import products directly from **CJdropshipping** (search by keyword, product URL or SKU).
2. **Generate images.** Write a text prompt, or let AI enhance it. The app generates polished marketing images of the product (studio shots, lifestyle scenes, banners).
3. **Generate video.** Animate the chosen image(s) into short video ads (Reels/Shorts style) with camera motion and optional music or voiceover.
4. **Publish.** Write captions and hashtags with AI, preview each platform, then post now or schedule to **Instagram, YouTube (Shorts), TikTok and Facebook**.

Build the **UI only**. All data comes from a **mock API layer** that returns realistic fake data with simulated delays and progress, so a Node.js backend can be plugged in later without changing the UI.

---

## 2. Tech stack

- React 18 + TypeScript + Vite
- Tailwind CSS (all design tokens defined in `tailwind.config`)
- Framer Motion for animation
- React Router v6 for routing
- Zustand for client state (current project, wizard step, job queue)
- TanStack Query for data fetching against the mock API
- Radix UI primitives (Dialog, Popover, Tooltip, Tabs, Select, Slider, Switch), styled with Tailwind
- lucide-react for icons, react-dropzone for uploads, Recharts for charts
- Put the frontend in `client/`. Do **not** build the backend yet.

---

## 3. Visual design: "Cream Glass"

**Mood:** premium, calm, airy and editorial, like the dashboard of a luxury skincare brand. No neon, no dark backgrounds, no clutter.

### Color tokens
| Token | Hex | Use |
|---|---|---|
| cream (base) | `#FAF7F2` | page background |
| ivory | `#FFFDF9` | solid surfaces, glass fallback |
| sand | `#F2EBE0` | subtle fills, hover states |
| linen | `#E8DFD2` | borders, dividers |
| espresso | `#2A2420` | primary text, primary buttons |
| text-secondary | `#6F655C` | secondary text |
| text-muted | `#9A8F85` | non-essential text only (check contrast) |
| champagne (accent) | `#B8915A` | accent, focus rings, key actions |
| champagne-hover | `#A27D49` | accent hover |
| champagne-soft | `#F1E6D3` | accent backgrounds, selected states |
| success / warning / error / info | `#5E8C6A` / `#C58B3A` / `#B5544A` / `#5B7A99` | muted, earthy status colors |

### Background (this is what makes the glass visible)
- Never use a flat background. Use a full-page soft **gradient mesh**: a cream base with 3–4 large blurred blobs (peach `#F6E3D3`, champagne `#EFE2C8`, blush `#F3DCD6`, soft white) that drift slowly on a 40–60s loop. Turn the drift off under `prefers-reduced-motion`.
- Add a very subtle noise/grain overlay (2–3% opacity) for a tactile, premium feel.

### Glass recipe (create `glass`, `glass-strong`, `glass-subtle` utility classes)
- Background: `rgba(255,255,255,0.55)` for cards, `0.70` for the sidebar and modals, `0.40` for subtle tiles
- `backdrop-filter: blur(24px) saturate(160%)`
- Border: `1px solid rgba(255,255,255,0.75)`
- Inner top highlight: `inset 0 1px 0 rgba(255,255,255,0.9)`
- Shadow: `0 10px 40px -12px rgba(110,85,60,0.18)`
- Radius: 24px for cards and panels, 16px for inner tiles, 12px for inputs and buttons, full for pills
- Fallback: solid `#FFFDF9` at 92% when `backdrop-filter` is not supported

### Typography
- Display and headings: **Fraunces** (or Playfair Display), weight 500–600, slight negative letter-spacing
- UI and body: **Inter**, weights 400/500/600; body text 14–15px, line-height 1.5
- Type scale: 40 / 32 / 24 / 20 / 16 / 14 / 12 px; use tabular figures for numbers and stats

### Buttons
- **Primary:** espresso fill, cream text, soft gold glow on hover
- **Accent:** champagne gradient (`#C9A46A` → `#B08850`), white text. Use it only for the main "Generate" and "Publish" actions.
- **Secondary:** glass with a linen border. **Ghost:** text only. **Icon:** 40px round glass.
- All buttons: minimum height 44px, a 2px champagne focus ring with offset, and scale to 0.98 when pressed

### Motion
- 200–300ms ease-out transitions. Cards lift 2px on hover and get a stronger shadow. Page transitions fade in with an 8px slide.
- While AI is generating, show a soft champagne **shimmer** sweeping across placeholder tiles.
- Images load with a blur-up effect. Keep motion subtle and expensive-feeling, never bouncy.

### Accessibility
- All text on glass must meet WCAG AA contrast. Use a stronger glass behind text-heavy areas.
- Visible focus states, a keyboard-navigable wizard, aria-labels on every icon button, and support for `prefers-reduced-motion`.

---

## 4. App shell

- **Left sidebar** (`glass-strong`, 264px, collapsible to a 76px icon rail)
  - Top: logo and app name
  - Nav items: Dashboard, Create Ad, Products, Library, Publisher, Analytics, Integrations, Settings
  - Bottom: a credits card with a progress bar ("1,240 / 2,000 credits") and an Upgrade link, then the user avatar
- **Top bar** (glass, sticky)
  - Page title and breadcrumb
  - Global search that opens a ⌘K command palette
  - An accent **"+ New Ad"** button
  - A jobs indicator: a spinner badge with the number of running generations, which opens the Jobs drawer
  - Notifications bell and avatar menu
- **Jobs drawer** (right side)
  - Lists running and finished AI jobs, each with a thumbnail, type (Image/Video), model, progress bar, ETA and status
  - Clicking a job opens its result
- **Responsive behavior**
  - At 1280px and wider: the full layout
  - From 768px to 1279px: the sidebar collapses to the icon rail
  - Below 768px: the sidebar becomes a bottom tab bar with 5 items, and the wizard becomes full-screen steps

---

## 5. Screens

### 5.1 Dashboard
- Greeting header ("Good morning, Alex" plus the date)
- Hero glass card: the headline *"Turn any product into a scroll-stopping ad"*, a **Create new ad** button and a small looping sample-video thumbnail
- 4 KPI glass cards, each with a sparkline and a % change chip: Ads created, Videos generated, Posts published, Total views
- **Continue where you left off:** a carousel of draft projects, each showing a product thumbnail and progress ("Step 3 of 4 · Video")
- **Recent creations:** a grid of images and videos; videos autoplay muted on hover
- Connected-accounts strip for CJdropshipping, Instagram, YouTube, TikTok and Facebook, each with a status dot
- The next 5 scheduled posts

### 5.2 Create Ad: the 4-step wizard (the core screen; make it outstanding)
- **Top:** a glass stepper with the steps **1 Product · 2 Images · 3 Video · 4 Publish**. Completed steps get a checkmark, and users can step back.
- **Right:** a collapsible **Project summary** panel showing the product, selected images, selected video and the running credit estimate.

**Step 1: Product**

Tabs: *Upload images* | *Import from CJdropshipping* | *My products*.

- **Upload tab**
  - A large glass dropzone with a dashed champagne border: "Drag & drop product photos or browse (PNG, JPG, WEBP up to 20MB)"
  - After upload, a thumbnail grid where each image can be removed or set as main
  - A **Remove background** toggle with a before/after slider over a checkerboard
- **CJdropshipping tab**
  - A search bar that accepts a keyword, a CJ product URL or a SKU
  - Filters: category, price range, warehouse country, shipping time
  - A results grid of product cards: image, 2-line title, cost price, suggested retail price, rating and an **Import** button
  - Clicking a card opens a product detail modal: gallery, variants, description, specs and **Import to project**
- **Product details form** (auto-filled from CJ)
  - Fields: name, short description, key features as chips (with an AI **Extract features** button), target audience and price
  - Brand tone selector: Luxury, Playful, Minimal, Bold, Eco
- **Footer:** "Continue to images →"

**Step 2: Generate images**

- **Left panel: Prompt studio**
  - A large prompt textarea, pre-filled from the product info, with a character counter and a **✨ Enhance prompt** button
  - A collapsible "Advanced" section with a negative prompt
  - **Style presets** as visual tiles with sample thumbnails: Clean studio, Lifestyle, Luxury marble, Minimal pastel, Outdoor nature, Festive/seasonal, Flat lay, Model holding product
  - **Aspect ratio** segmented control: 1:1 Feed · 4:5 Portrait · 9:16 Reels/Shorts/Stories · 16:9 YouTube
  - Variations: 1 / 2 / 4
  - A **Keep product identical** toggle, which uses the uploaded photo as a reference
  - A **model picker**, with cards that show the credit cost per image:
    - GPT Image 2.6: *Best quality · Premium*
    - MAI-Image-2.7: *Great value*
    - MiniMax H3-Image: *Open-source*
    - Z-Image Turbo: *Fastest · Low cost*
  - An accent button: **"Generate images · 8 credits"**
- **Right panel: Results canvas**
  - Before the first generation: an elegant empty-state illustration
  - While generating: shimmer skeleton tiles, each with its own progress
  - Results grid. Hovering a tile shows: select, favorite, download, regenerate similar, edit, upscale and **Use for video**
  - **Edit** opens a modal with a brush mask and a text instruction
  - A history rail at the bottom with previous generation batches
- **Footer:** "{n} selected · Continue to video →"

**Step 3: Generate video**

- **Left panel: video settings**
  - **Scenes timeline:** the selected images as draggable scene cards. Each image is a first frame, with an optional end frame per scene.
  - A motion prompt textarea with AI enhance. Example: *"Slow 360° rotation on a marble pedestal, soft morning light"*
  - **Camera motion** presets as icon tiles: Static, Zoom in, Zoom out, Orbit 360°, Pan left/right, Dolly in, Tilt up, Handheld
  - Duration: 5s / 10s / 15s / 30s
  - Resolution: 720p / 1080p. The aspect ratio defaults to the one chosen in Step 2.
  - **Audio** toggles:
    - AI music, with a mood select: Upbeat, Elegant, Chill, Energetic
    - AI voiceover, with a voice select and an auto-written script
    - Native sound effects
  - **Text overlays:** headline, price tag, CTA ("Shop now") and the brand logo or watermark position
  - A **model picker** with credits per second:
    - Seedance 2.5: *Best quality · Premium*
    - MiniMax H3: *Great value · Open-source*
    - LTX-2.5: *Fast drafts*
  - An accent button: **"Generate video · 120 credits"**
- **Right panel: preview**
  - A large preview player inside a **phone-frame mockup**, switchable between 9:16, 1:1 and 16:9
  - Player states:
    - Queued
    - Generating: a progress ring with % and ETA, plus rotating tips
    - Ready: play, scrub, download, regenerate and trim
  - Thumbnails of previous versions below the player for A/B comparison

**Step 4: Caption & publish**

- **AI caption generator**
  - Tone, length and language selects
  - Generates a caption, hashtags (as editable chips) and a CTA, with a **Regenerate** button
- **Platform cards**, each with a toggle and showing the connected handle or a "Connect" button:
  - Instagram (Reel / Feed / Story)
  - YouTube (Shorts / Video)
  - TikTok
  - Facebook (Reel / Post)
- **Live previews** of each platform's post (Reel, Short, TikTok) using generic UI with simple platform icons
- **Per-platform overrides:** the YouTube title and Instagram's first comment
- **Schedule:** *Post now* or *Schedule*, with a date/time picker, a timezone select and "Best time to post" suggestion chips
- **Finish:** a final summary and an accent button **"Publish to 3 platforms"**
  - Then a success screen with a subtle cream/gold celebration animation and links to each post

### 5.3 Products
- A grid/table toggle of saved products, showing image, name, source badge (CJ / Upload), price, number of ads created and last updated
- Search, filters and bulk actions
- A product detail page listing all of that product's generated assets

### 5.4 Library (assets)
- A masonry grid of all images and videos
- Filters: type, product, aspect ratio, model, date and favorites
- Videos preview on hover; multi-select for bulk download, delete or add to a post
- A lightbox showing the prompt used, model, seed and credits spent, with a **Remix** button

### 5.5 Publisher (content calendar)
- Month, week and list views
- Scheduled posts appear as glass chips with a thumbnail and platform icon; drag a chip to reschedule
- Status colors: Draft, Scheduled, Publishing, Published, and Failed (with a retry button)
- A side panel with post details

### 5.6 Analytics
- A date range picker and KPI cards: Views, Likes, Comments, Shares, CTR and Estimated revenue
- Charts: a line chart of views over time by platform, and a bar chart by platform
- A top-performing ads table with thumbnails
- An **Insights** glass card with AI tips
- Charts use the cream/gold palette with muted platform colors

### 5.7 Integrations
- **CJdropshipping:** API key input, Connect/Test buttons and the last sync time
- **Instagram, YouTube, TikTok, Facebook:** an OAuth "Connect" button, the connected handle and a Disconnect button
- **AI providers:** a masked API key field per provider, with a Test button
- A status badge on every card

### 5.8 Settings
Tabs:
- **Profile**
- **Brand kit:** logo, brand colors, fonts, default tone, watermark and intro/outro clips
- **AI defaults:** default image model, video model, aspect ratio and quality
- **Billing & credits:** plan cards, a usage chart and an invoices table
- **Notifications**
- **Team:** invite members and assign roles

### 5.9 Auth
- A split-screen login and sign-up page
- Left: a glass form with email, password and a Google sign-in button
- Right: an animated collage of sample generated ads floating in glass frames

---

## 6. Reusable components (`src/components/ui`)

GlassCard, GlassPanel, Button (primary / accent / secondary / ghost / icon), Input, Textarea (with a counter and an AI-enhance slot), Select, SegmentedControl, Slider, Switch, Tabs, Chip/TagInput, Badge (status), Stepper, Dropzone, ImageTile, VideoPlayer (custom controls), PhoneMockup, ProgressRing, ProgressBar, Skeleton (cream shimmer), EmptyState, Modal, Drawer, Toast, Tooltip, CommandPalette, ModelPicker (with a cost badge), PlatformIcon, StatCard (with a sparkline), DataTable, Calendar.

Use these everywhere. No one-off styles.

---

## 7. Mock API layer (so the Node.js backend plugs in later)

Create `src/services/api.ts` with typed async functions and `src/types/` with shared types. For now they return mock data. Mirror these future endpoints:

- `POST /api/products/upload`: upload product images
- `GET  /api/cj/products?query=&category=&page=`: search CJdropshipping
- `POST /api/cj/import`: import a CJ product
- `POST /api/generate/image`: takes `{ productId, prompt, negativePrompt, style, aspectRatio, count, model }` and returns `{ jobId }`
- `POST /api/generate/video`: takes `{ scenes[], motionPrompt, camera, duration, resolution, audio, overlays, model }` and returns `{ jobId }`
- `GET  /api/jobs/:id`: returns `{ status: queued | running | succeeded | failed, progress, etaSeconds, resultUrls }`
- `POST /api/captions/generate`
- `POST /api/publish`: takes `{ assetId, platforms[], caption, hashtags, scheduleAt }`
- `GET  /api/assets`, `GET /api/analytics`, `GET /api/integrations`

Mock behavior:
- Simulate jobs: progress rises every ~500ms until it reaches 100%, and about 5% of jobs fail so the error state is visible.
- Switch between mocks and the real API with a single env flag, `VITE_USE_MOCKS=true`.
- Seed 8 realistic dropshipping products: wireless earbuds, ceramic pour-over coffee set, LED sunset lamp, posture corrector, pet hair remover roller, minimalist leather wallet, portable blender and silk sleep mask.
- For product images, use placeholders such as `https://picsum.photos/seed/<name>/800/800` or tasteful gradient placeholders.

---

## 8. Quality bar and acceptance criteria

- It must look like a premium, shipped SaaS product, at the quality level of Linear, Framer or Apple's marketing pages: generous whitespace, a strict 8px spacing grid and aligned edges.
- Every screen has **loading, empty, error and success** states.
- Fully responsive from **375px to 1920px**, with no horizontal scroll.
- Lighthouse accessibility score of 95 or higher. No TypeScript errors.
- Folder structure: `client/src/{app, pages, components/ui, components/features, services, store, types, hooks, styles, mocks}`
- Include a README with run steps (`npm install`, `npm run dev`).

**Build order:** design tokens and glass components → app shell → Create Ad wizard → Dashboard → the remaining pages.
