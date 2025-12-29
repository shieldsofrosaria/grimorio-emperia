# Quick Testing Guide

## What Changed

### ✅ XP Formula (Exponential)
The XP requirements per level now follow a 1.2x multiplier, making early levels achievable but late levels progressively harder.

### ✅ Quest Rewards (3-5x Increase)
- Daily: 10 XP → 50-100 XP
- Weekly: 50 XP → 150-250 XP  
- Monthly: 150 XP → 500-750 XP

### ✅ Moon Phase Weekly Quests
Weekly quests now change based on the lunar phase (New 🌑 / Waxing 🌓 / Full 🌕 / Waning 🌗)

### ✅ Single Storage Source
Virtue points now stored in `grimorioProfile` with `characterData` synced automatically

---

## How to Test

### 1. Check Moon Phase System
**Action:** Navigate to Quests > Weekly Quests
**Expected:** 
- See 3 weekly quests
- Quest names mention current moon phase (e.g., "New Moon Intentions", "Waxing Growth")
- Titles contain moon emoji (🌑 🌓 🌕 🌗)

### 2. Test Quest Rewards
**Action:** Complete a daily quest
**Expected:** 
- Notification shows "+50 XP" or higher (not 10)
- Sidebar virtue points increase by 10-20 VP (not 10)
- Progress bar updates immediately

### 3. Test Storage Sync
**Action:** 
1. Complete a quest
2. Open browser DevTools (F12)
3. Run in console: `JSON.parse(localStorage.getItem('grimorioProfile')).thoth.points`
**Expected:** Shows correct points (matches sidebar display)

### 4. Test XP Formula
**Action:**
1. Enable Debug mode
2. Complete daily quests until you level up
3. Check level progression
**Expected:**
- Level 2 requires ~120 XP
- Level 5 requires ~207 XP
- Levels get progressively harder (exponential curve)

### 5. Verify Weekly Quest Phase Changes
**Action:**
1. Clear localStorage: `localStorage.clear()`
2. Reload page
3. Check what quests appear
4. (Depends on current real-world moon phase)
**Expected:**
- Quests match current lunar phase
- Tomorrow quests will be same (within week)
- Next Monday quests may differ (if moon phase changes)

---

## Debug Commands (Console)

```javascript
// Check current moon phase
getMoonPhase()  // Returns: "new", "waxing", "full", or "waning"

// Get this week's quests
getQuestTemplates('weekly')  // Shows 3 quests for current phase

// Check virtue sync
characterData.virtues.thoth  // Should match sidebar display

// Check storage
JSON.parse(localStorage.getItem('grimorioProfile'))
JSON.parse(localStorage.getItem('characterData'))

// XP to next level
characterData.xpToNext
```

---

## Known Behavior

- **Weekly quests change based on real moon phase** (not game time)
- **Moon phase updates on page reload** (calculates current date)
- **Monday still triggers weekly reset** (existing behavior preserved)
- **Virtue points display with "pts" suffix** (styling intact)
- **All old save data still works** (backward compatible)

---

## What Still Needs Work

🔴 **High Priority:**
- Achievement System (42 achievements not yet implemented)
- Specialization System (6 types not yet implemented)
- Skill Trees (15 skills not yet implemented)

🟡 **Medium Priority:**
- Title system (Novice → Archmaster)
- Virtue rank display
- Day streak tracking

🟢 **Nice to Have:**
- Achievement unlock animations
- Lunar calendar visualization
- Specialization selection UI
