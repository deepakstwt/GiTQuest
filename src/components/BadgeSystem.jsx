import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Zap, Target, GitBranch, GitCommit, GitMerge, Award, Lock, Sparkles, TrendingUp, Calendar, Users } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { useToast } from '@/components/ui/use-toast';

const BadgeSystem = () => {
  const { userProgress, updateProgress } = useGame();
  const { toast } = useToast();
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [newlyUnlocked, setNewlyUnlocked] = useState([]);

  const badges = [
    // Beginner Badges
    {
      id: 'first-command',
      name: 'First Steps',
      description: 'Execute your first Git command',
      icon: GitCommit,
      category: 'Beginner',
      rarity: 'Common',
      xpReward: 50,
      requirement: { type: 'commands', value: 1 },
      unlocked: userProgress.totalCommands >= 1,
      color: 'from-green-400 to-emerald-500',
      tips: ['Try typing "git status" to get started']
    },
    {
      id: 'first-commit',
      name: 'Commit Master',
      description: 'Make your first commit',
      icon: GitCommit,
      category: 'Beginner',
      rarity: 'Common',
      xpReward: 75,
      requirement: { type: 'commits', value: 1 },
      unlocked: userProgress.completedMissions.includes('1.2'),
      color: 'from-blue-400 to-cyan-500',
      tips: ['Use descriptive commit messages', 'Commit early and often']
    },
    {
      id: 'perfect-accuracy',
      name: 'Precision',
      description: 'Execute 10 commands with 100% accuracy',
      icon: Target,
      category: 'Beginner',
      rarity: 'Rare',
      xpReward: 100,
      requirement: { type: 'accuracy', value: 10 },
      unlocked: userProgress.totalCommands >= 10 && userProgress.correctCommands === userProgress.totalCommands,
      color: 'from-purple-400 to-pink-500',
      tips: ['Take your time with each command', 'Use the help system when unsure']
    },

    // Intermediate Badges
    {
      id: 'branch-creator',
      name: 'Branch Master',
      description: 'Create and work with branches',
      icon: GitBranch,
      category: 'Intermediate',
      rarity: 'Uncommon',
      xpReward: 150,
      requirement: { type: 'missions', value: '2.1' },
      unlocked: userProgress.completedMissions.includes('2.1'),
      color: 'from-orange-400 to-red-500',
      tips: ['Use descriptive branch names', 'Keep branches focused on single features']
    },
    {
      id: 'merge-master',
      name: 'Merge Wizard',
      description: 'Successfully merge branches',
      icon: GitMerge,
      category: 'Intermediate',
      rarity: 'Uncommon',
      xpReward: 200,
      requirement: { type: 'missions', value: '2.3' },
      unlocked: userProgress.completedMissions.includes('2.3'),
      color: 'from-indigo-400 to-purple-500',
      tips: ['Always merge into the target branch', 'Resolve conflicts carefully']
    },
    {
      id: 'streak-7',
      name: 'Week Warrior',
      description: 'Maintain a 7-day learning streak',
      icon: Calendar,
      category: 'Intermediate',
      rarity: 'Rare',
      xpReward: 250,
      requirement: { type: 'streak', value: 7 },
      unlocked: userProgress.streak >= 7,
      color: 'from-yellow-400 to-amber-500',
      tips: ['Practice daily to maintain your streak', 'Even 5 minutes counts!']
    },

    // Advanced Badges
    {
      id: 'history-explorer',
      name: 'Time Traveler',
      description: 'Master Git history and log commands',
      icon: TrendingUp,
      category: 'Advanced',
      rarity: 'Rare',
      xpReward: 300,
      requirement: { type: 'missions', value: '3.1' },
      unlocked: userProgress.completedMissions.includes('3.1'),
      color: 'from-pink-400 to-rose-500',
      tips: ['Use git log --oneline for compact view', 'Explore different log formats']
    },
    {
      id: 'diff-master',
      name: 'Change Detective',
      description: 'Master Git diff and comparison tools',
      icon: Target,
      category: 'Advanced',
      rarity: 'Epic',
      xpReward: 400,
      requirement: { type: 'missions', value: '3.2' },
      unlocked: userProgress.completedMissions.includes('3.2'),
      color: 'from-cyan-400 to-blue-500',
      tips: ['git diff shows unstaged changes', 'git diff --staged shows staged changes']
    },
    {
      id: 'reset-master',
      name: 'Undo Master',
      description: 'Master Git reset and undo operations',
      icon: RotateCcw,
      category: 'Advanced',
      rarity: 'Epic',
      xpReward: 500,
      requirement: { type: 'missions', value: '3.3' },
      unlocked: userProgress.completedMissions.includes('3.3'),
      color: 'from-red-400 to-pink-500',
      tips: ['Be careful with --hard reset', 'Use --soft to keep changes staged']
    },

    // Expert Badges
    {
      id: 'remote-collaborator',
      name: 'Remote Hero',
      description: 'Master remote repository operations',
      icon: Users,
      category: 'Expert',
      rarity: 'Legendary',
      xpReward: 600,
      requirement: { type: 'missions', value: '4.3' },
      unlocked: userProgress.completedMissions.includes('4.3'),
      color: 'from-violet-400 to-purple-500',
      tips: ['Always pull before pushing', 'Use -u to set upstream branches']
    },
    {
      id: 'workflow-master',
      name: 'Workflow Architect',
      description: 'Master professional Git workflows',
      icon: Award,
      category: 'Expert',
      rarity: 'Legendary',
      xpReward: 750,
      requirement: { type: 'missions', value: '5.3' },
      unlocked: userProgress.completedMissions.includes('5.3'),
      color: 'from-emerald-400 to-green-500',
      tips: ['Follow team conventions', 'Use feature branches for new work']
    },
    {
      id: 'git-master',
      name: 'Git Master',
      description: 'Complete all missions and master Git',
      icon: Trophy,
      category: 'Expert',
      rarity: 'Mythic',
      xpReward: 1000,
      requirement: { type: 'all-missions', value: 'complete' },
      unlocked: userProgress.completedMissions.length >= 15,
      color: 'from-amber-400 to-yellow-500',
      tips: ['You\'ve mastered Git! Share your knowledge with others']
    }
  ];

  const categories = [
    { name: 'Beginner', color: 'from-green-400 to-emerald-500', count: 3 },
    { name: 'Intermediate', color: 'from-blue-400 to-cyan-500', count: 3 },
    { name: 'Advanced', color: 'from-purple-400 to-pink-500', count: 3 },
    { name: 'Expert', color: 'from-orange-400 to-red-500', count: 3 }
  ];

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'Common': return 'text-gray-600 bg-gray-100';
      case 'Uncommon': return 'text-green-600 bg-green-100';
      case 'Rare': return 'text-blue-600 bg-blue-100';
      case 'Epic': return 'text-purple-600 bg-purple-100';
      case 'Legendary': return 'text-orange-600 bg-orange-100';
      case 'Mythic': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressForBadge = (badge) => {
    switch (badge.requirement.type) {
      case 'commands':
        return Math.min(userProgress.totalCommands, badge.requirement.value);
      case 'commits':
        return userProgress.completedMissions.includes('1.2') ? 1 : 0;
      case 'accuracy':
        return Math.min(userProgress.correctCommands, badge.requirement.value);
      case 'streak':
        return Math.min(userProgress.streak, badge.requirement.value);
      case 'missions':
        return userProgress.completedMissions.includes(badge.requirement.value) ? 1 : 0;
      case 'all-missions':
        return userProgress.completedMissions.length;
      default:
        return 0;
    }
  };

  const getMaxProgressForBadge = (badge) => {
    switch (badge.requirement.type) {
      case 'commands':
      case 'accuracy':
      case 'streak':
        return badge.requirement.value;
      case 'commits':
      case 'missions':
        return 1;
      case 'all-missions':
        return 15;
      default:
        return 1;
    }
  };

  // Check for newly unlocked badges
  useEffect(() => {
    const newlyUnlockedBadges = badges.filter(badge => 
      badge.unlocked && !userProgress.unlockedBadges.includes(badge.id)
    );

    if (newlyUnlockedBadges.length > 0) {
      setNewlyUnlocked(newlyUnlockedBadges);
      
      // Update progress with new badges
      const newBadgeIds = newlyUnlockedBadges.map(badge => badge.id);
      const totalXp = newlyUnlockedBadges.reduce((sum, badge) => sum + badge.xpReward, 0);
      
      updateProgress({
        unlockedBadges: [...userProgress.unlockedBadges, ...newBadgeIds],
        xp: userProgress.xp + totalXp
      });

      // Show celebration toast
      toast({
        title: "🎉 Badge Unlocked!",
        description: `You earned ${newlyUnlockedBadges.length} new badge${newlyUnlockedBadges.length > 1 ? 's' : ''}!`,
        className: "border-accent bg-accent/10"
      });

      // Clear newly unlocked after 3 seconds
      setTimeout(() => setNewlyUnlocked([]), 3000);
    }
  }, [userProgress, badges]);

  const unlockedCount = badges.filter(badge => badge.unlocked).length;
  const totalBadges = badges.length;
  const progressPercentage = (unlockedCount / totalBadges) * 100;

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Trophy className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Achievements</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Star className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Unlocked:</span>
            <span className="font-semibold text-accent">{unlockedCount}/{totalBadges}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="w-full bg-muted rounded-full h-3">
          <motion.div
            className="progress-bar h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {categories.map((category) => {
          const categoryBadges = badges.filter(badge => badge.category === category.name);
          const unlockedInCategory = categoryBadges.filter(badge => badge.unlocked).length;
          
          return (
            <div
              key={category.name}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                unlockedInCategory > 0 
                  ? `bg-gradient-to-r ${category.color} text-white` 
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {category.name} ({unlockedInCategory}/{category.count})
            </div>
          );
        })}
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {badges.map((badge, index) => {
          const IconComponent = badge.icon;
          const progress = getProgressForBadge(badge);
          const maxProgress = getMaxProgressForBadge(badge);
          const progressPercentage = (progress / maxProgress) * 100;
          const isNewlyUnlocked = newlyUnlocked.some(b => b.id === badge.id);
          
          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`relative p-4 rounded-lg border transition-all duration-300 cursor-pointer ${
                badge.unlocked 
                  ? 'bg-gradient-to-br from-white to-gray-50 border-accent/20 shadow-md' 
                  : 'bg-muted border-border hover:border-primary/30'
              } ${isNewlyUnlocked ? 'ring-2 ring-accent animate-pulse' : ''}`}
              onClick={() => {
                setSelectedBadge(badge);
                setShowDetails(true);
              }}
            >
              {/* New Badge Indicator */}
              {isNewlyUnlocked && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 z-10"
                >
                  <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                    <Sparkles className="h-3 w-3 text-white" />
                  </div>
                </motion.div>
              )}

              {/* Badge Icon */}
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  badge.unlocked 
                    ? `bg-gradient-to-r ${badge.color} text-white` 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {badge.unlocked ? (
                    <IconComponent className="h-6 w-6" />
                  ) : (
                    <Lock className="h-6 w-6" />
                  )}
                </div>
                
                <div className="text-right">
                  <span className={`px-2 py-1 text-xs rounded-full ${getRarityColor(badge.rarity)}`}>
                    {badge.rarity}
                  </span>
                </div>
              </div>

              {/* Badge Info */}
              <div className="mb-3">
                <h4 className={`font-semibold mb-1 ${badge.unlocked ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {badge.name}
                </h4>
                <p className="text-sm text-muted-foreground mb-2">
                  {badge.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Zap className="h-3 w-3" />
                  <span>{badge.xpReward} XP</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{progress}/{maxProgress}</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <motion.div
                    className={`h-2 rounded-full ${
                      badge.unlocked ? 'bg-accent' : 'bg-primary'
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>

              {/* Category */}
              <div className="text-xs text-muted-foreground">
                {badge.category}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Badge Details Modal */}
      <AnimatePresence>
        {showDetails && selectedBadge && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      selectedBadge.unlocked 
                        ? `bg-gradient-to-r ${selectedBadge.color} text-white` 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      {selectedBadge.unlocked ? (
                        <selectedBadge.icon className="h-6 w-6" />
                      ) : (
                        <Lock className="h-6 w-6" />
                      )}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{selectedBadge.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${getRarityColor(selectedBadge.rarity)}`}>
                        {selectedBadge.rarity}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowDetails(false)}
                    className="text-muted-foreground hover:text-foreground"
                  >
                    ×
                  </button>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground">{selectedBadge.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="text-sm">{selectedBadge.xpReward} XP Reward</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      <span className="text-sm">{selectedBadge.category}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Requirement:</h4>
                    <div className="bg-muted p-3 rounded text-sm">
                      {selectedBadge.requirement.type === 'commands' && 
                        `Execute ${selectedBadge.requirement.value} Git command${selectedBadge.requirement.value > 1 ? 's' : ''}`
                      }
                      {selectedBadge.requirement.type === 'commits' && 
                        'Make your first commit'
                      }
                      {selectedBadge.requirement.type === 'accuracy' && 
                        `Execute ${selectedBadge.requirement.value} commands with 100% accuracy`
                      }
                      {selectedBadge.requirement.type === 'streak' && 
                        `Maintain a ${selectedBadge.requirement.value}-day learning streak`
                      }
                      {selectedBadge.requirement.type === 'missions' && 
                        `Complete mission ${selectedBadge.requirement.value}`
                      }
                      {selectedBadge.requirement.type === 'all-missions' && 
                        'Complete all missions in the learning path'
                      }
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Progress:</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Current Progress</span>
                        <span>{getProgressForBadge(selectedBadge)}/{getMaxProgressForBadge(selectedBadge)}</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-3">
                        <motion.div
                          className={`h-3 rounded-full ${
                            selectedBadge.unlocked ? 'bg-accent' : 'bg-primary'
                          }`}
                          initial={{ width: 0 }}
                          animate={{ width: `${(getProgressForBadge(selectedBadge) / getMaxProgressForBadge(selectedBadge)) * 100}%` }}
                          transition={{ duration: 0.8 }}
                        />
                      </div>
                    </div>
                  </div>

                  {selectedBadge.tips && selectedBadge.tips.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Pro Tips:</h4>
                      <ul className="space-y-1">
                        {selectedBadge.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <button
                    onClick={() => setShowDetails(false)}
                    className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BadgeSystem;
