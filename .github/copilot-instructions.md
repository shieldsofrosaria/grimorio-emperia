# Grimorio Emperia - AI Coding Agent Guide

## Project Overview
A **client-side only**, gamified digital grimoire (magical practice journal) themed around "low fantasy / sword & sorcery" natural philosophy. No backend, no build process—pure HTML/CSS/JS using localStorage for persistence.

**Three Virtues System:**
- 🌙 **Thoth** (blue): Wisdom, study, accumulated knowledge
- ⚖️ **Ma'at** (silver/white): Balance, ethics, cleansing
- ⚡ **Caerus** (gold): Perfect timing, lunar cycles, opportunity

## Architecture & Data Flow

### localStorage-First Design
All user data persists in `localStorage` under the key `grimorioProfile`. No server, no build step. **Critical Pattern:** 
1. Load from localStorage with `loadProfile()` 
2. Mutate object in memory
3. Save immediately with `saveProfile()` 
4. Refresh UI from updated data

All manager classes ([ProfileManager](profile.js), [QuestManager](quests.js), [GrimorioRPG](js/rpg-system.js)) use this same pattern.

**Profile/Quest schema** (defined in [profile.js getDefaultProfile()](profile.js#L22)):
- Identity/status: `scribeName`, `overallRank` (1-6), `totalPoints`, `totalWorkings`, `currentStreak`, `longestStreak`, `lastPracticeDate`
- Virtues: `thoth|maat|caerus.{points, level}` plus tracking: `volumesRead`, `cleansingRituals`, `planetaryHours`, etc.
- Specializations: map with `{herbalist, astrologer, alchemist, guardian, scholar, polyglot}` each having `{unlocked: bool, progress: num}`
- Practice stats: `workingsByType` (protection/healing/cleansing/manifestation), `herbUsage`, `moonPhasePreference`, `dayOfWeekActivity`, `successfulWorkings`
- Quest tracking: `lastDailyReset|lastWeeklyReset|lastMonthlyReset` (date strings), `completedQuests.{daily,weekly,monthly}` (arrays of quest IDs)

**Dashboard sync (separate layer):** Dashboard maintains its own simplified profile snapshot for cloud sync via JSONBin. When editing dashboard.html sync logic, preserve rich profile fields from profile.js—avoid overwriting with flattened data.

## Visual Design System

### Divine Baroque Theme
**CSS Variables** in [css/divine-baroque.css](css/divine-baroque.css):
- `--void-black`, `--deep-night`, `--night-blue` (dark celestial backgrounds)
- `--thoth-deep` through `--thoth-glow` (blue gradient for wisdom)
- `--maat-silver` through `--maat-glow` (white/silver for balance)
- `--caerus-deep` through `--caerus-glow` (gold gradient for timing)

**Typography Stack:**
1. **Cinzel Decorative** - Hero titles and major headings
2. **Cormorant Garamond** - Body text (default)
3. **IM Fell English** - Subheadings, labels, accents

**Animation Conventions:**
- `candleFlicker` - Used for decorative symbols (✦)
- `twinkle` - Starfield effect on body::before
- `float` - Hover states on cards

### Responsive Breakpoints
Desktop enhancements live in [css/desktop-grimoire.css](css/desktop-grimoire.css). Mobile-first base in [css/divine-baroque.css](css/divine-baroque.css).

## Key Components

### Quest System ([quests.html](quests.html) + [quests.js](quests.js))
- **Time-based resets**: Daily (midnight), Weekly (Monday), Monthly (1st) checked via `checkResets()` on page load
- **Data attributes**: `data-quest="quest-id"` (e.g., `daily-intention`, `weekly-working`), `data-virtue` is NOT used—virtue mapping happens in `awardQuestReward()` object in quests.js
- **Reward system**: Each quest ID maps to virtue points in `awardQuestReward()` rewards object (lines ~155-175)
- **Completion tracking**: Checking `.quest-checkbox` adds quest ID to `profileData.completedQuests[type]` array, triggers validation and UI updates
- **Daily bonus**: Complete 3 daily quests for +5 Ma'at bonus via `checkDailyBonus()`

### Profile System ([profile.html](profile.html) + [profile.js](profile.js))
- **ProfileManager class**: All character data CRUD, virtue level progression (100pts = +1 level), rank progression tied to `totalPoints`
- **Rank formula**: Rank 1-6 based on cumulative points (Initiate→Apprentice→Journeyman→Adept→Master→Grandmaster)
- **Specializations**: Unlocked when `totalPoints >= 500` (Journeyman rank reached)
- **Key methods**: `calculateRankProgress()`, `checkRankProgress()`, `updateVirtueDisplay(virtue)`, `awardQuestReward()`

### RPG System ([js/rpg-system.js](js/rpg-system.js))
- **Alternative character system**: More complex RPG rules with mastery (0-100), teachings, and experience tiers
- **Not currently used** by main pages (profile.js, quests.js use their own schema), but provides extended features for future expansion
- **Key classes**: `GrimorioRPG` with achievement/milestone/quest initialization; may be integrated into dashboard

### Dashboard ([dashboard.html](dashboard.html))
- **Rich single-page gamified interface** with tabbed sections: Dashboard, Study, Practice, You, Volumes
- **Cloud sync (JSONBin)**: Dual modes—auto-sync (interval-based with `deviceId`, `cloudBinId`) + manual code/QR (`GE-XXXXX` format)
- **ImgBB integration**: Avatar uploads via ImgBB API key; supports emoji or image avatars
- **Embedded volumes**: Tabs for Volumes I–V with cleaned content from `volumes/volume*.html` (avoid duplicate headers)
- **Sync gotchas**: Preserve `lastModified` timestamp to prevent stale overwrites; device-scoped bin IDs stored per-device

### Working Logger ([logger.html](logger.html) + future `js/logger.js`)
Structured form for recording magical practice:
- Form fields: Date, moon phase, planetary hour, working type, materials, outcome
- **On submission**: Updates `workingsByType`, `herbUsage`, `moonPhasePreference`, `dayOfWeekActivity` in profile
- Pattern: All form handlers call `saveProfile()` after mutation

### Achievements & Milestones ([achievements.html](achievements.html) + future `js/achievements.js`)
- Achievement system for unlocking badges/unlocks based on practice milestones
- Not yet deeply integrated with main profile/quest system; hooks available for expansion
- Currently placeholder; can reference `rpg-system.js` achievement structure for implementation patterns

### Volume Pages ([volumes/volume*.html](volumes/volume1.html))
- Educational content about the Three Virtues and practices
- Standard navigation structure (see [EXAMPLE_VOLUME_TEMPLATE.html](EXAMPLE_VOLUME_TEMPLATE.html))
- Sequential navigation: Volume I → II → III → IV → V
- Embedded versions in [files/](files/) for dashboard integration (auto-generated; keep volumes/ as source of truth)

## Development Patterns

### localStorage & Data Consistency
**CRITICAL:** If modifying any manager class (profile.js, quests.js, rpg-system.js):
1. Always pair mutations with `saveProfile()` call immediately after
2. Verify schema consistency—if adding a new field, update `getDefaultProfile()` in **both** [profile.js](profile.js) and [quests.js](quests.js)
3. Test across page navigation: load profile page → navigate to quests → return to profile (data must persist and match)
4. Check browser console for `localStorage.getItem('grimorioProfile')` to validate JSON structure after changes

### Quest Reward Mapping
- Quest IDs follow pattern: `{daily|weekly|monthly}-{action}` (e.g., `daily-study`, `weekly-cleanse`)
- Rewards are NOT declarative (no `data-points` attribute); they're in `awardQuestReward()` object in [quests.js](quests.js#L155)
- When adding a new quest, MUST add corresponding entry in rewards object or points won't be awarded
- Virtue assignment happens at award time, not at quest definition time

### Page-Level Initialization
Each page that loads profile data follows this pattern:
```javascript
const profileManager = new ProfileManager(); // loads from localStorage
// ProfileManager.init() auto-calls updateDisplay(), so UI updates immediately
// On user action: profileManager.profileData.field = newValue; profileManager.saveProfile();
```
**Critical:** If a page doesn't update after localStorage changes, check if it's calling `loadProfile()` on init vs using stale reference.

### CSS Variable & Theme Consistency
When adding new UI elements:
1. Use `--thoth-*`, `--maat-*`, `--caerus-*` CSS vars from [css/divine-baroque.css](css/divine-baroque.css) for color consistency
2. Desktop enhancements go in [css/desktop-grimoire.css](css/desktop-grimoire.css), NOT in component styles
3. Avoid inline styles; use CSS classes and the existing animation keyframes (`twinkle`, `glow`, `candleFlicker`)

### Adding New Features
1. **HTML Structure**: Use `.card` → `.card-content` wrapper pattern
2. **Color Coding**: Map UI to virtues (`--thoth-bright`, `--maat-silver`, `--caerus-bright`)
3. **Icons**: Unicode symbols preferred (🌙 ⚖️ ⚡ ✦ 📜)
4. **Data Persistence**: Always sync to `localStorage` immediately after changes; keep profile.js/quests.js schema in sync when adding fields
5. **Dashboard Sync**: When touching dashboard sync logic, preserve JSONBin headers (`X-Master-Key`, optional `X-Collection-Id`), device-scoped bin IDs, and do not overwrite richer profile fields unless intentionally mapping them

### File Organization
```
/                      # Core pages (index, profile, quests, logger, etc.)
css/                   # Shared stylesheets
  divine-baroque.css   # Main theme (required on all pages)
  desktop-grimoire.css # Desktop enhancements (optional but recommended)
volumes/               # Educational content pages
inspo/                 # Design references (not deployed)
```

### Navigation Structure
All pages include the same nav block:
```html
<li><a href="index.html">Home</a></li>
<li><a href="profile.html">Profile</a></li>
<li><a href="quests.html">Quests</a></li>
<!-- etc. -->
```
Volume pages use `../` for root links: `<a href="../index.html">Home</a>`

## Content Philosophy

**Low Fantasy / Empirical Magic:**
- Treat magic as natural law observation, not supernatural commanding
- Physical materials: herbs, stones, water, timing
- Observable results through journaling and tracking
- Personal power through study and practice

**Avoid:**
- High fantasy tropes (spells as reality manipulation)
- Religious or deity worship framing
- Supernatural "energy" without physical grounding

## Common Tasks

### Debugging Common Issues
- **Profile data not persisting:** Check browser console → `localStorage.getItem('grimorioProfile')` returns `null` or invalid JSON? Clear localStorage and reload, or verify `saveProfile()` is called after mutation
- **Quest rewards not showing:** Verify quest ID exists in `awardQuestReward()` rewards object; check console for reward assignment logs
- **UI not updating after quest completion:** Ensure `saveProfile()` is called AND page calls quest/profile manager init (not relying on stale page state)
- **Virtue points mismatch:** Check if multiple pages are updating same profile—sync logic issue if dashboard and profile page both add points
- **Resets not firing:** Verify `lastDailyReset` is stored as date string (`new Date().toDateString()`); if timezone differs, reset may not trigger on expected day

### Add a New Quest
1. Edit [quests.html](quests.html), find appropriate panel (`#dailyQuests`, `#weeklyQuests`, etc.)
2. Clone a `.quest-item` div, update:
   - `data-quest="unique-id"` (e.g., `daily-harvest`, `weekly-ritual`)
   - Quest title and description HTML
3. Add reward entry in [quests.js](quests.js#L155) `awardQuestReward()` function:
   ```javascript
   'daily-harvest': { thoth: 3, maat: 2 },  // virtue: points
   ```
4. Test: Verify checkbox toggles, points award correctly, UI updates without page refresh

### Track New Statistics
1. Add field to `getDefaultProfile()` in both [profile.js](profile.js) and [quests.js](quests.js)
2. Update save/load logic to persist new field
3. Create UI element in [profile.html](profile.html) to display it
4. Update value on relevant user actions

### Extend Dashboard
1. Add display hooks in [dashboard.html](dashboard.html) and wire to `updateUI`
2. Persist in the dashboard profile object or map to `grimorioProfile` carefully; avoid wiping fields from profile.js/quests.js
3. If new sync payload fields are needed, update both `syncToCloud` and `loadFromCloud`/`loadFromCode`

### Create New Volume
1. Copy [EXAMPLE_VOLUME_TEMPLATE.html](EXAMPLE_VOLUME_TEMPLATE.html)
2. Replace placeholder content between `<main>` tags
3. Update `<title>`, `.site-title`, `.site-subtitle`
4. Ensure navigation links use `../` prefix for root pages
5. Add link to new volume in all existing nav blocks

### Embed Volume Content in Dashboard
1. Each volume has a dedicated tab container in [dashboard.html](dashboard.html) (Volume I–V). Embed cleaned inner content (from each `volumes/volume*.html` main section) into the matching tab content block to avoid duplicate headers/nav.
2. Preserve virtue-themed styling; keep links pointing to `../` paths if reusing existing anchors.
3. Keep dashboard’s container structure intact (do not remove tab wrappers or `main-tab-content` classes); only replace the inner content area for the target volume tab.

## Testing Checklist
- ✅ Test in mobile viewport (320px+)
- ✅ Verify localStorage persistence across page refreshes
- ✅ Check virtue point math (quest completion → total points)
- ✅ Confirm quest resets trigger at correct times
- ✅ Validate color contrast for accessibility (gold on dark backgrounds)

## Philosophy Note
This project values **aesthetic coherence** and **thematic immersion**. When adding features, prioritize maintaining the "divine baroque" visual language and the "empirical natural philosophy" tone over modern web app conventions.
