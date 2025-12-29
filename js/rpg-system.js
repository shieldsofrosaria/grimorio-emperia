class GrimorioRPG {
    constructor() {
        this.STORAGE_KEY = 'grimorioProfile';
        this.character = this.loadCharacter();
        this.achievements = this.initializeAchievements();
        this.milestones = this.initializeMilestones();
        this.quests = this.initializeQuests();
    }

    // Character Creation & Management
    createNewCharacter(scribeName) {
        return {
            // Core Identity
            scribeName: scribeName || "Unnamed Scribe",
            title: "Initiate of the Mysteries",
            rank: 1,
            rankName: "Initiate",
            createdDate: new Date().toISOString(),
            lastActive: new Date().toISOString(),
            
            // Core Stats
            level: 1,
            totalExperience: 0,
            currentStreak: 0,
            longestStreak: 0,
            daysActive: 0,
            
            // The Three Virtues (RPG Stats)
            virtues: {
                thoth: {
                    level: 1,
                    experience: 0,
                    mastery: 0, // 0-100 mastery level
                    teachings: [], // unlocked teachings
                    specializations: []
                },
                maat: {
                    level: 1,
                    experience: 0,
                    mastery: 0,
                    teachings: [],
                    specializations: []
                },
                caerus: {
                    level: 1,
                    experience: 0,
                    mastery: 0,
                    teachings: [],
                    specializations: []
                }
            },
            
            // RPG Progression
            achievements: [],
            completedQuests: [],
            activeQuests: [],
            unlockedMilestones: [],
            
            // Practice Tracking
            workings: {
                total: 0,
                byType: {},
                byMoonPhase: {},
                byDayOfWeek: {},
                successful: 0,
                failed: 0
            },
            
            // Resources & Inventory
            resources: {
                herbs: {},
                stones: {},
                tools: [],
                knowledge: []
            },
            
            // Time Tracking
            practiceSchedule: {
                preferredTime: null,
                consistency: 0,
                missedDays: 0
            },
            
            // Quest System
            questProgress: {
                daily: { completed: [], resetDate: null },
                weekly: { completed: [], resetDate: null },
                monthly: { completed: [], resetDate: null }
            }
        };
    }

    // Experience & Leveling System
    awardExperience(virtue, amount, reason = '') {
        const virtueData = this.character.virtues[virtue];
        const oldLevel = virtueData.level;
        
        virtueData.experience += amount;
        this.character.totalExperience += amount;
        
        // Level up calculation (100 XP per level, scaling)
        const newLevel = Math.floor(virtueData.experience / 100) + 1;
        if (newLevel > virtueData.level) {
            virtueData.level = newLevel;
            this.onVirtueLevelUp(virtue, oldLevel, newLevel);
        }
        
        // Overall character level (average of virtues)
        const avgLevel = Math.floor((
            this.character.virtues.thoth.level +
            this.character.virtues.maat.level +
            this.character.virtues.caerus.level
        ) / 3);
        
        if (avgLevel > this.character.level) {
            this.onCharacterLevelUp(this.character.level, avgLevel);
            this.character.level = avgLevel;
        }
        
        this.updateRank();
        this.checkAchievements();
        this.saveCharacter();
        
        return {
            virtue,
            experienceGained: amount,
            newVirtueLevel: virtueData.level,
            newCharacterLevel: this.character.level,
            leveledUp: newLevel > oldLevel,
            reason
        };
    }

    onVirtueLevelUp(virtue, oldLevel, newLevel) {
        // Unlock new teachings and specializations
        const teachings = this.getTeachingsForLevel(virtue, newLevel);
        this.character.virtues[virtue].teachings.push(...teachings);
        
        // Award achievement
        this.unlockAchievement(`${virtue}_level_${newLevel}`);
        
        console.log(`🌟 ${virtue.toUpperCase()} Level Up! ${oldLevel} → ${newLevel}`);
    }

    onCharacterLevelUp(oldLevel, newLevel) {
        this.unlockAchievement(`character_level_${newLevel}`);
        console.log(`✨ Character Level Up! ${oldLevel} → ${newLevel}`);
    }

    // Rank System (Based on Total Experience)
    updateRank() {
        const totalExp = this.character.totalExperience;
        const ranks = [
            { min: 0, name: "Initiate", title: "Seeker of Hidden Truths" },
            { min: 500, name: "Apprentice", title: "Student of the Mysteries" },
            { min: 1500, name: "Journeyman", title: "Walker of the Path" },
            { min: 3500, name: "Adept", title: "Keeper of Ancient Wisdom" },
            { min: 7500, name: "Master", title: "Weaver of Natural Law" },
            { min: 15000, name: "Grandmaster", title: "Guardian of the Eternal Flame" }
        ];
        
        const currentRank = ranks.reverse().find(rank => totalExp >= rank.min) || ranks[0];
        
        if (currentRank.name !== this.character.rankName) {
            this.character.rank = ranks.indexOf(currentRank) + 1;
            this.character.rankName = currentRank.name;
            this.character.title = currentRank.title;
            this.unlockAchievement(`rank_${currentRank.name.toLowerCase()}`);
        }
    }

    // Quest System
    initializeQuests() {
        return {
            daily: [
                {
                    id: 'daily_study',
                    name: 'Path of Contemplation',
                    description: 'Spend time in study of natural philosophy',
                    virtue: 'thoth',
                    experience: 25,
                    requirements: ['study_session']
                },
                {
                    id: 'daily_balance',
                    name: 'Moment of Harmony',
                    description: 'Practice cleansing or balancing ritual',
                    virtue: 'maat',
                    experience: 25,
                    requirements: ['cleansing_ritual']
                },
                {
                    id: 'daily_timing',
                    name: 'Seize the Hour',
                    description: 'Perform working at optimal planetary hour',
                    virtue: 'caerus',
                    experience: 25,
                    requirements: ['planetary_hour_working']
                }
            ],
            weekly: [
                {
                    id: 'weekly_lunar',
                    name: 'Lunar Observance',
                    description: 'Perform working aligned with moon phase',
                    virtue: 'caerus',
                    experience: 100,
                    requirements: ['moon_phase_working']
                },
                {
                    id: 'weekly_mastery',
                    name: 'Deepening Practice',
                    description: 'Complete 5 successful workings',
                    virtue: 'thoth',
                    experience: 150,
                    requirements: ['successful_workings', 5]
                }
            ],
            monthly: [
                {
                    id: 'monthly_dedication',
                    name: 'Unwavering Devotion',
                    description: 'Maintain daily practice for entire month',
                    virtue: 'maat',
                    experience: 300,
                    requirements: ['daily_streak', 30]
                }
            ]
        };
    }

    // Achievement System
    initializeAchievements() {
        return [
            // Virtue Achievements
            { id: 'thoth_level_5', name: 'Scholar of Mysteries', description: 'Reach Thoth Level 5', icon: '🌙', virtue: 'thoth' },
            { id: 'maat_level_5', name: 'Keeper of Balance', description: 'Reach Ma\'at Level 5', icon: '⚖️', virtue: 'maat' },
            { id: 'caerus_level_5', name: 'Master of Moments', description: 'Reach Caerus Level 5', icon: '⚡', virtue: 'caerus' },
            
            // Practice Achievements
            { id: 'first_working', name: 'First Steps', description: 'Complete your first working', icon: '✨', category: 'practice' },
            { id: 'streak_7', name: 'Weekly Devotion', description: '7-day practice streak', icon: '🔥', category: 'consistency' },
            { id: 'streak_30', name: 'Monthly Dedication', description: '30-day practice streak', icon: '💎', category: 'consistency' },
            { id: 'workings_100', name: 'Centurion', description: 'Complete 100 workings', icon: '🏛️', category: 'practice' },
            
            // Knowledge Achievements
            { id: 'volumes_read_5', name: 'Avid Reader', description: 'Read 5 volumes', icon: '📚', category: 'knowledge' },
            { id: 'specializations_3', name: 'Renaissance Practitioner', description: 'Master 3 specializations', icon: '🎭', category: 'mastery' },
            
            // Timing Achievements
            { id: 'all_moon_phases', name: 'Lunar Adept', description: 'Work with all moon phases', icon: '🌕', category: 'timing' },
            { id: 'planetary_hours_7', name: 'Planetary Devotee', description: 'Work with all 7 planetary hours', icon: '🪐', category: 'timing' }
        ];
    }

    // Milestone System
    initializeMilestones() {
        return [
            // Character Progression
            { level: 5, name: 'Apprentice Milestone', reward: 'Unlock Advanced Practices', unlocked: false },
            { level: 10, name: 'Journeyman Milestone', reward: 'Unlock Specialization Paths', unlocked: false },
            { level: 15, name: 'Adept Milestone', reward: 'Unlock Master Teachings', unlocked: false },
            { level: 20, name: 'Master Milestone', reward: 'Unlock Grandmaster Secrets', unlocked: false },
            
            // Virtue Milestones
            { virtue: 'thoth', level: 10, name: 'Sage of Ancient Wisdom', reward: 'Unlock Hermetic Texts', unlocked: false },
            { virtue: 'maat', level: 10, name: 'Guardian of Cosmic Order', reward: 'Unlock Sacred Geometry', unlocked: false },
            { virtue: 'caerus', level: 10, name: 'Temporal Sovereignty', reward: 'Unlock Time Mastery', unlocked: false }
        ];
    }

    // Teaching System
    getTeachingsForLevel(virtue, level) {
        const teachings = {
            thoth: [
                { level: 2, name: 'Elemental Correspondences', description: 'Understanding the four classical elements' },
                { level: 3, name: 'Planetary Influences', description: 'The seven classical planets and their domains' },
                { level: 4, name: 'Hermetic Principles', description: 'As above, so below - the fundamental laws' },
                { level: 5, name: 'Alchemical Processes', description: 'The great work of transformation' }
            ],
            maat: [
                { level: 2, name: 'Sacred Purification', description: 'Methods of cleansing and blessing' },
                { level: 3, name: 'Ethical Framework', description: 'The moral foundation of practice' },
                { level: 4, name: 'Balance Restoration', description: 'Techniques for harmony and equilibrium' },
                { level: 5, name: 'Truth Discernment', description: 'Seeing through illusion to reality' }
            ],
            caerus: [
                { level: 2, name: 'Lunar Timing', description: 'Working with the phases of the moon' },
                { level: 3, name: 'Planetary Hours', description: 'The optimal times for different practices' },
                { level: 4, name: 'Seasonal Awareness', description: 'Aligning with the wheel of the year' },
                { level: 5, name: 'Moment Recognition', description: 'Sensing the perfect time for action' }
            ]
        };
        
        return teachings[virtue]?.filter(t => t.level === level) || [];
    }

    // Quest Management
    completeQuest(questId) {
        const quest = this.findQuest(questId);
        if (!quest) return null;
        
        const result = this.awardExperience(quest.virtue, quest.experience, `Completed quest: ${quest.name}`);
        
        // Add to completed quests
        this.character.completedQuests.push({
            id: questId,
            name: quest.name,
            completedDate: new Date().toISOString(),
            experienceGained: quest.experience
        });
        
        this.checkAchievements();
        this.saveCharacter();
        
        return result;
    }

    findQuest(questId) {
        for (const category of Object.values(this.quests)) {
            const quest = category.find(q => q.id === questId);
            if (quest) return quest;
        }
        return null;
    }

    // Achievement Management
    unlockAchievement(achievementId) {
        if (this.character.achievements.includes(achievementId)) return false;
        
        const achievement = this.achievements.find(a => a.id === achievementId);
        if (!achievement) return false;
        
        this.character.achievements.push(achievementId);
        console.log(`🏆 Achievement Unlocked: ${achievement.name}`);
        
        this.saveCharacter();
        return true;
    }

    checkAchievements() {
        // Check various achievement conditions
        this.checkPracticeAchievements();
        this.checkStreakAchievements();
        this.checkVirtueAchievements();
    }

    checkPracticeAchievements() {
        const total = this.character.workings.total;
        
        if (total >= 1) this.unlockAchievement('first_working');
        if (total >= 100) this.unlockAchievement('workings_100');
    }

    checkStreakAchievements() {
        const streak = this.character.currentStreak;
        
        if (streak >= 7) this.unlockAchievement('streak_7');
        if (streak >= 30) this.unlockAchievement('streak_30');
    }

    checkVirtueAchievements() {
        Object.entries(this.character.virtues).forEach(([virtue, data]) => {
            if (data.level >= 5) {
                this.unlockAchievement(`${virtue}_level_5`);
            }
        });
    }

    // Working System
    recordWorking(workingData) {
        this.character.workings.total++;
        
        // Track by type
        const type = workingData.type || 'general';
        this.character.workings.byType[type] = (this.character.workings.byType[type] || 0) + 1;
        
        // Track by moon phase
        if (workingData.moonPhase) {
            this.character.workings.byMoonPhase[workingData.moonPhase] = 
                (this.character.workings.byMoonPhase[workingData.moonPhase] || 0) + 1;
        }
        
        // Award experience based on success
        if (workingData.successful) {
            this.character.workings.successful++;
            this.awardExperience('thoth', 15, 'Successful working');
            
            if (workingData.balancing) {
                this.awardExperience('maat', 10, 'Balancing aspect');
            }
            
            if (workingData.properTiming) {
                this.awardExperience('caerus', 10, 'Proper timing');
            }
        } else {
            this.character.workings.failed++;
            // Still award some experience for the attempt
            this.awardExperience('thoth', 5, 'Learning from failure');
        }
        
        this.updateStreak();
        this.checkAchievements();
        this.saveCharacter();
    }

    updateStreak() {
        const today = new Date().toDateString();
        const lastActive = new Date(this.character.lastActive).toDateString();
        
        if (today === lastActive) {
            // Same day, no change to streak
            return;
        }
        
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (yesterday.toDateString() === lastActive) {
            // Consecutive day
            this.character.currentStreak++;
            if (this.character.currentStreak > this.character.longestStreak) {
                this.character.longestStreak = this.character.currentStreak;
            }
        } else {
            // Streak broken
            this.character.currentStreak = 1;
        }
        
        this.character.lastActive = new Date().toISOString();
        this.character.daysActive++;
    }

    // Data Management
    loadCharacter() {
        const stored = localStorage.getItem(this.STORAGE_KEY);
        if (!stored) {
            return this.createNewCharacter();
        }
        
        try {
            const character = JSON.parse(stored);
            // Ensure all required properties exist (migration)
            return this.migrateCharacter(character);
        } catch (error) {
            console.error('Failed to load character:', error);
            return this.createNewCharacter();
        }
    }

    migrateCharacter(character) {
        const defaultCharacter = this.createNewCharacter(character.scribeName);
        
        // Deep merge with defaults to ensure all properties exist
        const merged = this.deepMerge(defaultCharacter, character);
        
        return merged;
    }

    deepMerge(target, source) {
        const result = { ...target };
        
        for (const key in source) {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                result[key] = this.deepMerge(target[key] || {}, source[key]);
            } else {
                result[key] = source[key];
            }
        }
        
        return result;
    }

    saveCharacter() {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.character));
            return true;
        } catch (error) {
            console.error('Failed to save character:', error);
            return false;
        }
    }

    // Utility Methods
    getVirtueProgress(virtue) {
        const virtueData = this.character.virtues[virtue];
        const currentLevelExp = (virtueData.level - 1) * 100;
        const nextLevelExp = virtueData.level * 100;
        const progress = ((virtueData.experience - currentLevelExp) / (nextLevelExp - currentLevelExp)) * 100;
        
        return Math.min(100, Math.max(0, progress));
    }

    getOverallProgress() {
        const totalProgress = (
            this.getVirtueProgress('thoth') +
            this.getVirtueProgress('maat') +
            this.getVirtueProgress('caerus')
        ) / 3;
        
        return Math.round(totalProgress);
    }

    exportCharacter() {
        return {
            character: this.character,
            exportDate: new Date().toISOString(),
            version: '2.0'
        };
    }

    importCharacter(data) {
        if (data && data.character) {
            this.character = this.migrateCharacter(data.character);
            this.saveCharacter();
            return true;
        }
        return false;
    }
}

// Global instance
window.grimorioRPG = new GrimorioRPG();
