import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import HeroSection from '@/components/HeroSection';
import TerminalSimulator from '@/components/TerminalSimulator';
import MissionMap from '@/components/MissionMap';
import BadgeSystem from '@/components/BadgeSystem';
import GitVisualizer from '@/components/GitVisualizer';
import ProgressTracker from '@/components/ProgressTracker';
import FloatingParticles from '@/components/FloatingParticles';
import { GameProvider } from '@/contexts/GameContext';
import { Home, Terminal, Map, Trophy, GitBranch, Menu, X } from 'lucide-react';

function App() {
  const [currentView, setCurrentView] = useState('hero');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userProgress, setUserProgress] = useState(() => {
    const saved = localStorage.getItem('gitquest-progress');
    return saved ? JSON.parse(saved) : {
      level: 1,
      xp: 0,
      completedMissions: [],
      unlockedBadges: [],
      currentChapter: 1,
      streak: 0,
      totalCommands: 0,
      correctCommands: 0
    };
  });

  useEffect(() => {
    localStorage.setItem('gitquest-progress', JSON.stringify(userProgress));
  }, [userProgress]);

  const updateProgress = (updates) => {
    setUserProgress(prev => ({ ...prev, ...updates }));
  };

  const navigationItems = [
    { id: 'hero', label: 'Home', icon: Home },
    { id: 'dashboard', label: 'Dashboard', icon: Terminal },
    { id: 'missions', label: 'Missions', icon: Map },
    { id: 'badges', label: 'Badges', icon: Trophy },
    { id: 'visualizer', label: 'Git Visualizer', icon: GitBranch },
  ];

  const handleNavigation = (viewId) => {
    setCurrentView(viewId);
    setIsMenuOpen(false);
  };

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 }
  };

  const pageTransition = {
    type: "tween",
    ease: "easeInOut",
    duration: 0.4
  };

  return (
    <GameProvider value={{ userProgress, updateProgress }}>
      <div className="min-h-screen simple-bg relative">
        <FloatingParticles />
        
        {/* Navigation Header */}
        {currentView !== 'hero' && (
          <motion.header
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 card border-b border-border"
          >
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">GQ</span>
                  </div>
                  <h1 className="text-xl font-semibold simple-text-primary">
                    GitQuest
                  </h1>
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-4">
                  {navigationItems.slice(1).map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleNavigation(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                        currentView === item.id
                          ? 'bg-primary text-white shadow-md'
                          : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>

                {/* Progress Display */}
                <div className="hidden md:flex items-center gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <div className="w-2 h-2 bg-accent rounded-full"></div>
                    <span className="text-muted-foreground">Level {userProgress.level}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">XP:</span>
                    <span className="font-semibold text-accent">{userProgress.xp}</span>
                  </div>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="md:hidden p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                >
                  {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden border-t border-border bg-card"
                >
                  <div className="container mx-auto px-4 py-4">
                    <nav className="flex flex-col gap-2">
                      {navigationItems.slice(1).map((item) => (
                        <button
                          key={item.id}
                          onClick={() => handleNavigation(item.id)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                            currentView === item.id
                              ? 'bg-primary text-white shadow-md'
                              : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.label}</span>
                        </button>
                      ))}
                    </nav>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.header>
        )}
        
        {/* Main Content */}
        <div className={currentView !== 'hero' ? 'pt-24' : ''}>
          <AnimatePresence mode="wait">
            {currentView === 'hero' && (
              <motion.div
                key="hero"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
              >
                <HeroSection onStartLearning={() => setCurrentView('dashboard')} />
              </motion.div>
            )}

            {currentView === 'dashboard' && (
              <motion.div
                key="dashboard"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="min-h-screen"
              >
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="mb-8"
                  >
                    <ProgressTracker />
                  </motion.div>

                  <div className="grid lg:grid-cols-2 gap-8 mb-8">
                    <motion.div
                      initial={{ x: -50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <TerminalSimulator />
                    </motion.div>
                    
                    <motion.div
                      initial={{ x: 50, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: 0.4 }}
                    >
                      <GitVisualizer />
                    </motion.div>
                  </div>

                  <div className="grid lg:grid-cols-3 gap-8">
                    <motion.div
                      className="lg:col-span-2"
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <MissionMap />
                    </motion.div>
                    
                    <motion.div
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.6 }}
                    >
                      <BadgeSystem />
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === 'missions' && (
              <motion.div
                key="missions"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="min-h-screen"
              >
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <MissionMap />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentView === 'badges' && (
              <motion.div
                key="badges"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="min-h-screen"
              >
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <BadgeSystem />
                  </motion.div>
                </div>
              </motion.div>
            )}

            {currentView === 'visualizer' && (
              <motion.div
                key="visualizer"
                variants={pageVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={pageTransition}
                className="min-h-screen"
              >
                <div className="container mx-auto px-4 py-8">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <GitVisualizer />
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Toaster />
      </div>
    </GameProvider>
  );
}

export default App;
