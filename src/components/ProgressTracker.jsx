import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Zap, Target, TrendingUp, Star, Crown, Trophy } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';

const ProgressTracker = () => {
  const { userProgress } = useGame();
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [previousLevel, setPreviousLevel] = useState(1);

  const calculateLevel = (xp) => {
    return Math.floor(xp / 100) + 1;
  };

  const getXpForNextLevel = (level) => {
    return level * 100;
  };

  const currentLevel = calculateLevel(userProgress.xp);
  const xpForNextLevel = getXpForNextLevel(currentLevel);
  const xpProgress = userProgress.xp % 100;
  const progressPercentage = (xpProgress / 100) * 100;

  // Check for level up
  useEffect(() => {
    if (currentLevel > previousLevel) {
      setShowLevelUp(true);
      setTimeout(() => setShowLevelUp(false), 3000);
    }
    setPreviousLevel(currentLevel);
  }, [currentLevel, previousLevel]);

  const getLevelTitle = (level) => {
    if (level >= 20) return 'Git Master';
    if (level >= 15) return 'Git Expert';
    if (level >= 10) return 'Git Pro';
    if (level >= 5) return 'Git Intermediate';
    return 'Git Beginner';
  };

  const stats = [
    {
      label: 'Level',
      value: currentLevel,
      icon: User,
      color: 'text-primary',
      description: getLevelTitle(currentLevel)
    },
    {
      label: 'Total XP',
      value: userProgress.xp.toLocaleString(),
      icon: Zap,
      color: 'text-accent',
      description: `${xpProgress}/100 to next level`
    },
    {
      label: 'Accuracy',
      value: userProgress.totalCommands > 0 ? `${Math.round((userProgress.correctCommands / userProgress.totalCommands) * 100)}%` : '0%',
      icon: Target,
      color: 'text-primary',
      description: `${userProgress.correctCommands}/${userProgress.totalCommands} correct`
    },
    {
      label: 'Streak',
      value: `${userProgress.streak}d`,
      icon: TrendingUp,
      color: 'text-accent',
      description: userProgress.streak > 0 ? 'Keep it up!' : 'Start your streak!'
    }
  ];

  const achievements = [
    { id: 'first-command', condition: userProgress.totalCommands >= 1, icon: Star, title: 'First Command' },
    { id: 'perfect-accuracy', condition: userProgress.totalCommands >= 10 && userProgress.correctCommands === userProgress.totalCommands, icon: Target, title: 'Perfect Accuracy' },
    { id: 'streak-7', condition: userProgress.streak >= 7, icon: TrendingUp, title: 'Week Warrior' },
    { id: 'level-5', condition: currentLevel >= 5, icon: Crown, title: 'Git Intermediate' },
    { id: 'level-10', condition: currentLevel >= 10, icon: Trophy, title: 'Git Pro' },
  ];

  const unlockedAchievements = achievements.filter(a => a.condition);

  return (
    <div className="card p-6 relative">
      {/* Level Up Animation */}
      <AnimatePresence>
        {showLevelUp && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.2 }}
            className="absolute inset-0 bg-accent/10 flex items-center justify-center z-10 rounded-lg"
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: 2 }}
              className="text-center"
            >
              <Crown className="h-12 w-12 text-accent mx-auto mb-2" />
              <h3 className="text-xl font-semibold text-accent">Level Up!</h3>
              <p className="text-accent">You reached level {currentLevel}!</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Progress Section */}
      <div className="flex items-center gap-6 mb-6">
        <div className="relative">
          <motion.div 
            className="w-16 h-16 rounded-full bg-primary flex items-center justify-center shadow-md"
            animate={showLevelUp ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            <User className="h-8 w-8 text-white" />
          </motion.div>
          <motion.div 
            className="absolute -bottom-1 -right-1 bg-accent text-white text-sm font-semibold px-2 py-1 rounded-full shadow-md"
            animate={showLevelUp ? { scale: [1, 1.3, 1] } : {}}
            transition={{ duration: 0.5 }}
          >
            {currentLevel}
          </motion.div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold text-foreground">
              {getLevelTitle(currentLevel)}
            </h3>
            {currentLevel >= 5 && (
              <Crown className="h-4 w-4 text-accent" />
            )}
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progress to Level {currentLevel + 1}</span>
              <span className="text-muted-foreground font-semibold">{xpProgress}/100 XP</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <motion.div
                className="progress-bar h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercentage}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
            </div>
          </div>

          {/* XP to next level indicator */}
          {xpProgress > 80 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-sm text-accent"
            >
              <Star className="h-4 w-4" />
              <span className="font-semibold">
                Almost there! {100 - xpProgress} XP to level {currentLevel + 1}!
              </span>
            </motion.div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="card p-4 text-center group hover:scale-105 transition-transform cursor-pointer"
            >
              <div className={`${stat.color} mb-2 flex justify-center group-hover:scale-110 transition-transform`}>
                <IconComponent className="h-5 w-5" />
              </div>
              <div className="text-lg font-semibold text-foreground mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground font-medium">{stat.label}</div>
              <div className="text-xs text-muted-foreground mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {stat.description}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Achievements Section */}
      {unlockedAchievements.length > 0 && (
        <div className="border-t border-border pt-4">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Trophy className="h-4 w-4" />
            Recent Achievements
          </h4>
          <div className="flex flex-wrap gap-2">
            {unlockedAchievements.slice(-3).map((achievement) => {
              const IconComponent = achievement.icon;
              return (
                <motion.div
                  key={achievement.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 px-3 py-2 bg-accent/10 border border-accent/20 rounded-full text-xs"
                >
                  <IconComponent className="h-3 w-3 text-accent" />
                  <span className="text-accent font-medium">{achievement.title}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* Motivation Message */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20"
      >
        <p className="text-sm text-center text-muted-foreground">
          {userProgress.streak > 0 
            ? `🔥 ${userProgress.streak} day streak! Keep the momentum going!`
            : "Ready to start your Git journey? Every command brings you closer to mastery!"
          }
        </p>
      </motion.div>
    </div>
  );
};

export default ProgressTracker;
