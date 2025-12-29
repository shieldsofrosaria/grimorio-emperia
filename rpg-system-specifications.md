# Grimorio Emperia - RPG System Specifications

## Overview
A solo RPG gamification system for empirical studies practice based on the Three Virtues (Thoth, Ma'at, Caerus). Players progress through levels, complete quests, unlock achievements, and develop skill trees while tracking their spiritual and scholarly pursuits.

---

## 1. CHARACTER SYSTEM

### 1.1 Core Stats
```javascript
characterData = {
    level: 1,              // Player level (1-50)
    xp: 0,                 // Current XP
    xpToNext: 100,         // XP needed for next level
    virtues: {
        thoth: 0,          // Knowledge virtue points
        maat: 0,           // Balance virtue points
        caerus: 0          // Opportunity virtue points
    },
    specialization: null,  // Chosen specialization (unlocks at level 10)
    unlockedSkills: [],    // Array of skill IDs
    completedQuests: {
        daily: {},         // { 'date_questId': true }
        weekly: {},        // { 'week_number': true }
        monthly: {},       // { 'month_year': true }
        caerus: []         // Array of timestamps
    },
    achievements: [],      // Array of unlocked achievement IDs
    stats: {
        workingsCompleted: 0,
        studySessions: 0,
        daysActive: 0,
        lastActiveDate: null
    }
}
```

### 1.2 Level Progression

**XP Formula:**
```
XP Required for Level N = 100 * (1.2 ^ (N - 1))
```

**Level Progression Table:**
- Level 1: 100 XP
- Level 5: 207 XP
- Level 10: 516 XP
- Level 20: 3,833 XP
- Level 30: 28,423 XP
- Level 40: 210,862 XP
- Level 50: 1,563,615 XP

**Title Progression:**
- Level 1-4: Novice
- Level 5-9: Apprentice
- Level 10-19: Journeyman
- Level 20-29: Adept
- Level 30-39: Master
- Level 40-49: Grandmaster
- Level 50: Archmaster

### 1.3 Virtue System

**Virtue Points:**
- Earned through completing quests and workings
- Track progress in each of the Three Virtues
- Every 100 points = 1 Rank increase
- Ranking up grants +25 bonus XP

**Virtue Ranks:**
- 0-99: Initiate
- 100-199: Practitioner (Rank 1)
- 200-299: Adept (Rank 2)
- 300-399: Master (Rank 3)
- 400-499: Grandmaster (Rank 4)
- 500+: Archmaster (Rank 5+)

### 1.4 Specializations

**Unlock Requirement:** Level 10

**Available Specializations:**

1. **Astronomer** 🔭
   - Focus: Thoth (Knowledge/Timing)
   - Bonus: +50% Thoth VP gain
   - Theme: Celestial observation, timing, lunar cycles

2. **Herbologist** 🌿
   - Focus: Ma'at (Balance/Healing)
   - Bonus: +50% Ma'at VP gain
   - Theme: Plant wisdom, natural remedies, balance

3. **Opportunist** ⚡
   - Focus: Caerus (Opportunity/Timing)
   - Bonus: +50% Caerus VP gain
   - Theme: Seizing moments, synchronicity, fortune

4. **Philosopher** 📚
   - Focus: Balanced (All three)
   - Bonus: +25% to all VP gains
   - Theme: Universal knowledge, synthesis, wisdom

5. **Alchemist** ⚗️
   - Focus: Thoth + Ma'at
   - Bonus: +25% Thoth, +25% Ma'at
   - Theme: Transformation, brewing, material work

6. **Guardian** 🛡️
   - Focus: Ma'at + Protection
   - Bonus: +50% Ma'at VP
   - Theme: Protection, warding, boundaries

---

## 2. QUEST SYSTEM

### 2.1 Daily Quests (3 per day)

**Reset:** Daily at midnight (local time)
**Format:** `{date}_{questId}` stored in completedQuests.daily

**Quest Templates:**

1. **Morning Meditation**
   - ID: `morning-meditation`
   - Description: "Spend 10 minutes in quiet contemplation at your studiolo"
   - Reward: 50 XP, 10 Thoth VP

2. **Study Session**
   - ID: `study-session`
   - Description: "Read and document learnings from one of your volumes"
   - Reward: 75 XP, 15 Thoth VP

3. **Document a Working**
   - ID: `document-working`
   - Description: "Perform and record a working in your grimoire"
   - Reward: 100 XP, 20 Ma'at VP

### 2.2 Weekly Challenges

**Reset:** Weekly (7 days)
**Based On:** Current moon phase
**Format:** `week_{weekNumber}` stored in completedQuests.weekly

**Quest Templates by Moon Phase:**

1. **New Moon** 🌑
   - Title: "New Moon Intentions"
   - Description: "Set intentions for the lunar cycle and document them"
   - Reward: 200 XP, 40 Caerus VP

2. **Waxing Moon** 🌓
   - Title: "Waxing Growth"
   - Description: "Perform a growth or attraction working during waxing moon"
   - Reward: 150 XP, 30 Ma'at VP

3. **Full Moon** 🌕
   - Title: "Full Moon Power"
   - Description: "Charge talismans or perform peak energy working at full moon"
   - Reward: 250 XP, 50 Caerus VP

4. **Waning Moon** 🌗
   - Title: "Waning Release"
   - Description: "Perform banishing or purification during waning moon"
   - Reward: 150 XP, 30 Ma'at VP

### 2.3 Monthly Quests

**Reset:** Monthly (30 days)
**Format:** `month_{month}_{year}` stored in completedQuests.monthly

**Quest Templates:**

1. **Path of Dedication**
   - ID: `monthly-dedication`
   - Description: "Complete 20 daily quests this month"
   - Reward: 500 XP, 100 VP (all virtues)
   - Tracking: Count daily quest completions

2. **Mastery Pursuit**
   - ID: `monthly-mastery`
   - Description: "Perform 10 documented workings this month"
   - Reward: 750 XP, 150 Ma'at VP
   - Tracking: Count workings completed

### 2.4 Caerus Opportunities (Random)

**Spawn Chance:** 5% when viewing RPG tab
**One-time:** Can only complete one, then disappears
**Special:** Time-limited, high rewards

**Quest Templates:**

1. **Synchronistic Moment**
   - Description: "A perfect opportunity has presented itself. Act now!"
   - Reward: 300 XP, 60 Caerus VP

2. **Fortuitous Alignment**
   - Description: "The stars align in your favor. Seize this moment!"
   - Reward: 250 XP, 50 Caerus VP

3. **Window of Power**
   - Description: "A rare window opens. Time-sensitive working awaits!"
   - Reward: 350 XP, 70 Caerus VP

---

## 3. ACHIEVEMENT SYSTEM

### 3.1 Achievement Structure

```javascript
achievement = {
    id: 'unique-identifier',
    name: 'Achievement Name',
    description: 'What the player must do',
    icon: '🏆',
    tier: 'bronze|silver|gold|platinum',
    category: 'practice|virtue|study|workings|level|hidden',
    condition: () => boolean  // Function that checks if unlocked
}
```

### 3.2 Achievement Tiers & Rewards

- **Bronze:** 25 XP bonus
- **Silver:** 50 XP bonus
- **Gold:** 100 XP bonus
- **Platinum:** 200 XP bonus

### 3.3 Achievement List

#### Practice Dedication Category

1. **First Steps** 🌱 (Bronze)
   - Description: "Complete your first quest"
   - Condition: 1+ quest completed

2. **Dedicated Week** 📅 (Silver)
   - Description: "Complete quests for 7 days straight"
   - Condition: 7+ active days

3. **Monthly Devotion** 🗓️ (Gold)
   - Description: "Complete quests for 30 days straight"
   - Condition: 30+ active days

4. **Unbroken Path** 💯 (Platinum)
   - Description: "Complete quests for 100 days straight"
   - Condition: 100+ active days

#### Virtue Mastery Category

5. **Thoth Initiate** 🌙 (Bronze)
   - Description: "Reach 100 Thoth points"
   - Condition: Thoth VP >= 100

6. **Ma'at Initiate** ⚖️ (Bronze)
   - Description: "Reach 100 Ma'at points"
   - Condition: Ma'at VP >= 100

7. **Caerus Initiate** ⚡ (Bronze)
   - Description: "Reach 100 Caerus points"
   - Condition: Caerus VP >= 100

8. **Thoth Scholar** 🌙 (Silver)
   - Description: "Reach 500 Thoth points"
   - Condition: Thoth VP >= 500

9. **Ma'at Guardian** ⚖️ (Silver)
   - Description: "Reach 500 Ma'at points"
   - Condition: Ma'at VP >= 500

10. **Caerus Master** ⚡ (Silver)
    - Description: "Reach 500 Caerus points"
    - Condition: Caerus VP >= 500

11. **Balanced Scribe** ✨ (Gold)
    - Description: "Reach 100 in all three virtues"
    - Condition: All virtues >= 100

12. **Trinity Master** 👑 (Platinum)
    - Description: "Reach 1000 in all three virtues"
    - Condition: All virtues >= 1000

#### Study Achievements

13. **Studious Mind** 📖 (Bronze)
    - Description: "Complete 10 study sessions"
    - Condition: Study sessions >= 10

14. **Scholar** 📚 (Silver)
    - Description: "Complete 50 study sessions"
    - Condition: Study sessions >= 50

15. **Master Scholar** 🎓 (Gold)
    - Description: "Complete 200 study sessions"
    - Condition: Study sessions >= 200

16. **Eternal Student** 📜 (Platinum)
    - Description: "Complete 500 study sessions"
    - Condition: Study sessions >= 500

#### Workings Category

17. **First Working** 🔮 (Bronze)
    - Description: "Complete your first documented working"
    - Condition: Workings >= 1

18. **Apprentice Practitioner** ✨ (Bronze)
    - Description: "Complete 10 workings"
    - Condition: Workings >= 10

19. **Practitioner** 🌟 (Silver)
    - Description: "Complete 25 workings"
    - Condition: Workings >= 25

20. **Adept Practitioner** ⭐ (Silver)
    - Description: "Complete 50 workings"
    - Condition: Workings >= 50

21. **Master Practitioner** 💫 (Gold)
    - Description: "Complete 100 workings"
    - Condition: Workings >= 100

22. **Grandmaster of the Art** 🌌 (Platinum)
    - Description: "Complete 250 workings"
    - Condition: Workings >= 250

#### Level Milestones

23. **Novice Complete** ⚪ (Bronze)
    - Description: "Reach Level 5"
    - Condition: Level >= 5

24. **Apprentice Ascended** 🌟 (Silver)
    - Description: "Reach Level 10"
    - Condition: Level >= 10

25. **Journeyman Achieved** 💫 (Silver)
    - Description: "Reach Level 20"
    - Condition: Level >= 20

26. **Journeyman Rising** ⭐ (Gold)
    - Description: "Reach Level 25"
    - Condition: Level >= 25

27. **Adept Status** 🔮 (Gold)
    - Description: "Reach Level 30"
    - Condition: Level >= 30

28. **Master Status** 👑 (Gold)
    - Description: "Reach Level 40"
    - Condition: Level >= 40

29. **Grandmaster** 💎 (Platinum)
    - Description: "Reach Level 50"
    - Condition: Level >= 50

#### Hidden/Special Achievements

30. **Caerus' Favor** ⚡ (Gold)
    - Description: "Complete a Caerus opportunity quest"
    - Condition: Caerus quests completed >= 1

31. **Opportunist** 🎯 (Platinum)
    - Description: "Complete 10 Caerus opportunity quests"
    - Condition: Caerus quests completed >= 10

32. **Night Owl** 🦉 (Silver)
    - Description: "Complete a quest at midnight"
    - Condition: Quest completed between 00:00-01:00

33. **Early Riser** 🌅 (Silver)
    - Description: "Complete a quest at dawn"
    - Condition: Quest completed between 05:00-06:00

34. **Full Moon Master** 🌕 (Gold)
    - Description: "Complete 10 full moon workings"
    - Condition: Track full moon quest completions >= 10

35. **New Moon Seeker** 🌑 (Gold)
    - Description: "Complete 10 new moon workings"
    - Condition: Track new moon quest completions >= 10

36. **Lunar Devotee** 🌙 (Platinum)
    - Description: "Complete all moon phase quests 25 times each"
    - Condition: All phases >= 25 completions

37. **Perfectionist** 💯 (Gold)
    - Description: "Complete all daily quests for 7 days straight"
    - Condition: Track perfect weeks

38. **Dedication Incarnate** 🔥 (Platinum)
    - Description: "Complete all daily quests for 30 days straight"
    - Condition: Track perfect months

39. **First Specialization** 🎓 (Silver)
    - Description: "Choose your first specialization"
    - Condition: Specialization != null

40. **Skill Collector** 🌳 (Gold)
    - Description: "Unlock 10 skills across all trees"
    - Condition: Unlocked skills >= 10

41. **Master of Skills** 🏆 (Platinum)
    - Description: "Unlock all skills in one virtue tree"
    - Condition: All skills in one tree unlocked

42. **Trinity of Skills** 👑 (Platinum)
    - Description: "Unlock all skills in all three trees"
    - Condition: All skills unlocked

---

## 4. SKILL TREE SYSTEM

### 4.1 Skill Structure

```javascript
skill = {
    id: 'unique-identifier',
    name: 'Skill Name',
    description: 'What bonus/ability this provides',
    cost: 20,              // Virtue points required
    unlocked: false,
    requires: 'skill-id'   // Optional: prerequisite skill
}
```

### 4.2 Thoth Skill Tree (Knowledge Path)

**Virtue:** Thoth (Blue)
**Theme:** Study, documentation, timing, wisdom

1. **Lunar Wisdom**
   - Cost: 20 Thoth VP
   - Description: "+10% XP from study sessions"
   - Requires: None

2. **Scribal Arts**
   - Cost: 30 Thoth VP
   - Description: "+15% XP from documentation"
   - Requires: lunar-wisdom

3. **Astronomical Precision**
   - Cost: 40 Thoth VP
   - Description: "Unlock planetary hour calculations"
   - Requires: scribal-arts

4. **Sacred Geometry**
   - Cost: 50 Thoth VP
   - Description: "Advanced timing calculations unlocked"
   - Requires: astronomical-precision

5. **Master Scribe**
   - Cost: 100 Thoth VP
   - Description: "+25% to all Thoth activities"
   - Requires: sacred-geometry

### 4.3 Ma'at Skill Tree (Balance Path)

**Virtue:** Ma'at (Silver)
**Theme:** Balance, healing, ethics, natural law

1. **Balance Keeper**
   - Cost: 20 Ma'at VP
   - Description: "+10% effectiveness to all workings"
   - Requires: None

2. **Harmony Seeker**
   - Cost: 30 Ma'at VP
   - Description: "+15% XP from protection workings"
   - Requires: balance-keeper

3. **Natural Law Understanding**
   - Cost: 40 Ma'at VP
   - Description: "Enhanced herb and crystal correspondence"
   - Requires: harmony-seeker

4. **Truth Speaker**
   - Cost: 50 Ma'at VP
   - Description: "Enhanced divination accuracy"
   - Requires: natural-law-understanding

5. **Cosmic Order**
   - Cost: 100 Ma'at VP
   - Description: "+25% to all Ma'at activities"
   - Requires: truth-speaker

### 4.4 Caerus Skill Tree (Opportunity Path)

**Virtue:** Caerus (Gold)
**Theme:** Timing, opportunity, fortune, synchronicity

1. **Opportunity Sense**
   - Cost: 20 Caerus VP
   - Description: "+10% chance for Caerus quests to appear"
   - Requires: None

2. **Perfect Timing**
   - Cost: 30 Caerus VP
   - Description: "+15% XP from timed workings"
   - Requires: opportunity-sense

3. **Synchronicity Awareness**
   - Cost: 40 Caerus VP
   - Description: "Unlock hidden synchronicity tracking"
   - Requires: perfect-timing

4. **Seize the Moment**
   - Cost: 50 Caerus VP
   - Description: "Double rewards from Caerus quests"
   - Requires: synchronicity-awareness

5. **Master Opportunist**
   - Cost: 100 Caerus VP
   - Description: "+25% to all Caerus activities"
   - Requires: seize-moment

---

## 5. USER INTERFACE ELEMENTS

### 5.1 Character Display

**Components:**
- Level indicator (large, prominent)
- Current title (based on level)
- XP bar with current/required display
- Specialization icon + name
- Three virtue progress bars
- Virtue point counters

**Layout:** Grid format for stats, horizontal bars for progress

### 5.2 Quest Display

**Quest Card Elements:**
- Quest title (prominent)
- Quest description
- Reward badge (XP + VP)
- Complete button
- Visual state: Active / Completed / Locked

**Special Styling:**
- Daily quests: Blue border
- Weekly quests: Purple border
- Monthly quests: Gold border
- Caerus quests: Gold border + glow effect

### 5.3 Achievement Display

**Achievement Card Elements:**
- Large icon (emoji/symbol)
- Achievement name
- Description
- Tier badge (Bronze/Silver/Gold/Platinum)
- Locked/Unlocked visual state

**Grid Layout:** Auto-fill, minimum 250px columns

### 5.4 Skill Tree Display

**Skill Node Elements:**
- Skill name
- Cost (VP required) or ✓ if unlocked
- Description
- Visual connection lines between skills
- Locked/Unlocked/Available states

**Colors:**
- Thoth: Blue tones
- Ma'at: Silver tones
- Caerus: Gold tones

### 5.5 Notification System

**Notification Types:**
- Level Up
- Achievement Unlocked
- Quest Complete
- Skill Unlocked
- Specialization Chosen

**Behavior:**
- Slide in from right
- Display for 3 seconds
- Fade out
- Stack if multiple

---

## 6. DATA PERSISTENCE

### 6.1 LocalStorage Keys

```javascript
'rpg_character' = {
    // Full characterData object as JSON string
}
```

### 6.2 Save Triggers

- After completing quest
- After gaining XP
- After unlocking skill
- After choosing specialization
- Auto-save every 30 seconds
- Before page unload

### 6.3 Load Sequence

1. Check for existing save data
2. Parse JSON from localStorage
3. Validate data structure
4. Merge with defaults for missing fields
5. Update all UI elements
6. Generate current quests

---

## 7. GAME BALANCE & FORMULAS

### 7.1 XP Rewards Scale

**Quest Type:**
- Daily: 50-100 XP
- Weekly: 150-250 XP
- Monthly: 500-750 XP
- Caerus: 250-350 XP

**Activities:**
- Study session: 40 XP
- Documentation: 60 XP
- Working completion: 80-100 XP
- Achievement unlock: 25-200 XP (tier-based)
- Virtue rank up: +25 XP bonus

### 7.2 Virtue Point Rewards

**Quest Type:**
- Daily: 10-20 VP
- Weekly: 30-50 VP
- Monthly: 100-150 VP
- Caerus: 50-70 VP

**Distribution:**
- Thoth: Study, documentation, timing
- Ma'at: Workings, balance, healing
- Caerus: Opportunities, fortune, synchronicity

### 7.3 Time-to-Progression Estimates

**To Level 10 (Specialization unlock):**
- Minimum: ~15-20 days of active play
- Casual: ~30 days
- Intensive: ~10 days

**To Level 25 (Journeyman):**
- Minimum: ~60-90 days
- Casual: ~120 days

**To Level 50 (Grandmaster):**
- Minimum: ~365+ days
- Casual: ~500+ days

### 7.4 Skill Unlock Progression

**Early Skills (20-30 VP):**
- Unlockable within first few weeks
- Provide immediate benefits

**Mid Skills (40-50 VP):**
- Unlockable after 1-2 months per virtue
- Significant gameplay enhancements

**Master Skills (100 VP):**
- Long-term goals
- Major bonuses
- Requires dedication to specific virtue

---

## 8. TECHNICAL IMPLEMENTATION NOTES

### 8.1 Quest Reset Logic

```javascript
// Daily quest reset
currentDate = new Date().toDateString()
questKey = `${currentDate}_${questId}`

// Weekly quest reset
weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
questKey = `week_${weekNumber}`

// Monthly quest reset
month = new Date().getMonth()
year = new Date().getFullYear()
questKey = `month_${month}_${year}`
```

### 8.2 Moon Phase Calculation (Simplified)

```javascript
// Simple rotation through phases for demo
phases = ['newMoon', 'waxing', 'fullMoon', 'waning']
weekNum = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000))
currentPhase = phases[weekNum % 4]

// For production: Use actual lunar calendar API
```

### 8.3 Achievement Check Frequency

- After quest completion
- After XP gain
- After virtue point gain
- On skill unlock
- On specialization choice
- Manual "Check Achievements" button

### 8.4 Caerus Quest Spawn

```javascript
// 5% chance on RPG tab view
if (Math.random() < 0.05 && !hasActiveCaerusQuest) {
    generateCaerusQuest()
}

// With Opportunity Sense skill: 15% chance
// With Master Opportunist specialization: 20% chance
```

---

## 9. FUTURE EXPANSION IDEAS

### 9.1 Advanced Features

**Seasons & Sabbats:**
- Special quests for Wheel of the Year
- Bonus XP during seasonal alignments
- Unique rewards for sabbat celebrations

**Constellation Tracking:**
- Unlock bonuses based on zodiac positions
- Planetary hour integration
- Astrological timing recommendations

**Grimoire Integration:**
- Auto-populate working templates
- Track documented workings
- Generate statistics and insights

**Social Features:**
- Compare progress with friends
- Collaborative workings
- Shared achievement galleries

### 9.2 Additional Content

**More Specializations:**
- Diviner (focuses on scrying/tarot)
- Ritualist (ceremony focused)
- Enchanter (object consecration)

**Prestige System:**
- After level 50, "prestige" to gain special bonuses
- Keep achievements and some skills
- Harder challenges with better rewards

**Equipment System:**
- Virtual studiolo upgrades
- Tool quality affects working bonuses
- Cosmetic customization

**Challenge Modes:**
- Time trials (complete X quests in Y days)
- Virtue focus challenges
- Themed monthly events

---

## 10. VISUAL DESIGN SPECIFICATIONS

### 10.1 Color Palette

**Primary Colors:**
- Void Black: `#0a0514`
- Deep Purple: `#1a0f2e`
- Mystic Purple: `#2d1b4e`
- Royal Purple: `#4a2c6d`

**Virtue Colors:**
- Thoth Blue: `#4a7dc7`
- Ma'at Silver: `#c0d0e8`
- Caerus Gold: `#daa520`

**Accent Colors:**
- XP Green: `#4ade80`
- Level Gold: `#fbbf24`
- Quest Blue: `#60a5fa`
- Achievement Purple: `#a78bfa`

### 10.2 Typography

**Headers:**
- Font: 'Cinzel', serif
- Use for: Titles, card headers, section names

**Body:**
- Font: 'Cormorant Garamond', serif
- Use for: Descriptions, quest text, content

**Accent:**
- Font: 'MedievalSharp'
- Use for: Special emphasis (optional)

### 10.3 Animation Effects

**Glow Animation:**
- 3-second loop
- Pulsing shadow effect
- Apply to: Cards, achievement badges

**Slide In:**
- 0.5-second duration
- From right: +400px to 0
- Apply to: Notifications, modal windows

**Shimmer:**
- 2-second loop
- Sweeping gradient effect
- Apply to: XP bars, progress indicators

**Level Up:**
- Scale animation (1.0 → 1.1 → 1.0)
- Gold particle effects (optional)
- Screen flash (subtle)

### 10.4 Icons & Symbols

**Virtues:**
- Thoth: 🌙 (moon)
- Ma'at: ⚖️ (scales)
- Caerus: ⚡ (lightning)

**Specializations:**
- Astronomer: 🔭
- Herbologist: 🌿
- Opportunist: ⚡
- Philosopher: 📚
- Alchemist: ⚗️
- Guardian: 🛡️

**Quest Types:**
- Daily: 📅
- Weekly: 🌙
- Monthly: 📜
- Caerus: ⚡

**General:**
- XP: ⭐
- Level: 🌟
- Achievement: 🏆
- Skill: 🌳
- Lock: 🔒
- Check: ✓

---

## 11. TESTING CHECKLIST

### 11.1 Functionality Tests

- [ ] Character creation and initial state
- [ ] XP gain and level up calculation
- [ ] Quest generation (daily/weekly/monthly)
- [ ] Quest completion and rewards
- [ ] Caerus quest random spawn
- [ ] Achievement unlock conditions
- [ ] Skill tree unlocking
- [ ] Specialization selection
- [ ] LocalStorage save/load
- [ ] Data persistence across sessions
- [ ] UI updates after actions

### 11.2 Edge Cases

- [ ] Level 50 max (no overflow)
- [ ] Multiple level ups from single XP gain
- [ ] Quest completion on day boundary
- [ ] Achievement unlocking multiple at once
- [ ] Skill unlock without sufficient VP
- [ ] Specialization choice after already chosen
- [ ] LocalStorage quota exceeded
- [ ] Corrupted save data handling
- [ ] Browser compatibility (Chrome/Firefox/Safari/Edge)
- [ ] Mobile responsiveness

### 11.3 Balance Testing

- [ ] Time to level 10 reasonable
- [ ] Virtue progression balanced
- [ ] Skill costs appropriate
- [ ] Quest difficulty scaling
- [ ] Reward satisfaction
- [ ] Long-term engagement maintained

---

## 12. IMPLEMENTATION PRIORITY

### Phase 1: Core System (MVP)
1. Character data structure
2. XP and leveling system
3. Daily quests only
4. Basic save/load
5. Simple UI display

### Phase 2: Quest Expansion
1. Weekly quests
2. Monthly quests
3. Quest reset logic
4. Reward system refinement

### Phase 3: Progression Systems
1. Achievement system
2. Skill trees (basic)
3. Virtue tracking
4. Progress visualization

### Phase 4: Advanced Features
1. Specializations
2. Caerus opportunities
3. Advanced achievements
4. Complete skill trees

### Phase 5: Polish
1. Animations
2. Sound effects (optional)
3. Enhanced UI
4. Additional content
5. Balance adjustments

---

## APPENDIX A: Sample JSON Structures

### Character Save Data
```json
{
  "level": 12,
  "xp": 234,
  "xpToNext": 638,
  "virtues": {
    "thoth": 150,
    "maat": 120,
    "caerus": 95
  },
  "specialization": "astronomer",
  "unlockedSkills": ["lunar-wisdom", "scribal-arts"],
  "completedQuests": {
    "daily": {
      "Mon Dec 30 2024_morning-meditation": true,
      "Mon Dec 30 2024_study-session": true
    },
    "weekly": {
      "week_2845": true
    },
    "monthly": {
      "month_11_2024": true
    },
    "caerus": [1703951234567]
  },
  "achievements": [
    "first-steps",
    "thoth-initiate",
    "dedicated-week",
    "studious-mind"
  ],
  "stats": {
    "workingsCompleted": 15,
    "studySessions": 23,
    "daysActive": 8,
    "lastActiveDate": "Mon Dec 30 2024"
  }
}
```

### Quest Object
```json
{
  "id": "morning-meditation",
  "title": "Morning Meditation",
  "description": "Spend 10 minutes in quiet contemplation at your studiolo",
  "reward": {
    "xp": 50,
    "virtue": "thoth",
    "vp": 10
  },
  "completed": false
}
```

### Achievement Object
```json
{
  "id": "first-steps",
  "name": "First Steps",
  "description": "Complete your first quest",
  "icon": "🌱",
  "tier": "bronze",
  "category": "practice",
  "unlocked": true
}
```

### Skill Object
```json
{
  "id": "lunar-wisdom",
  "name": "Lunar Wisdom",
  "description": "+10% XP from study sessions",
  "cost": 20,
  "virtue": "thoth",
  "unlocked": true,
  "requires": null
}
```

---

## APPENDIX B: Suggested UI Layouts

### Dashboard Layout
```
┌─────────────────────────────────────────┐
│  [Level 12] [Apprentice] [🔭Astronomer] │
│                                         │
│  XP: [████████░░░░░░░░░] 234/638       │
│                                         │
│  🌙 Thoth:  [███████░░░] 150/200       │
│  ⚖️ Ma'at:  [██████░░░░] 120/200       │
│  ⚡ Caerus: [████░░░░░░] 95/200        │
└─────────────────────────────────────────┘
```

### Quest Card
```
┌──────────────────────────────────┐
│  Morning Meditation      +50 XP  │
│                                  │
│  Spend 10 minutes in quiet       │
│  contemplation at your studiolo  │
│                                  │
│  [      Complete Quest      ]    │
└──────────────────────────────────┘
```

### Achievement Badge
```
┌────────────────┐
│       🌱        │
│  First Steps    │
│                │
│  Complete your  │
│  first quest    │
│                │
│    [BRONZE]     │
└────────────────┘
```

---

## Document Version: 1.0
## Last Updated: December 29, 2024
## Total Word Count: ~6,000 words

This specification document contains all the RPG elements, mechanics, formulas, and implementation details for the Grimorio Emperia gamification system. Use it as a complete reference for implementing the system in your coding program.