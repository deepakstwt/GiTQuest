import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, Target, Clock, Star, Lock, CheckCircle, Play, BookOpen, Zap, TrendingUp } from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';

const MissionMap = () => {
  const { userProgress, updateProgress } = useGame();
  const [selectedMission, setSelectedMission] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const chapters = [
    {
      id: 1,
      title: "Git Basics",
      description: "Learn the fundamentals of Git version control",
      difficulty: "Beginner",
      estimatedTime: "30-45 min",
      color: "from-blue-500 to-cyan-500",
      missions: [
        {
          id: "1.1",
          title: "Initialize Repository",
          description: "Create your first Git repository",
          commands: ["git init"],
          xp: 20,
          difficulty: 1,
          estimatedTime: "5 min",
          prerequisites: [],
          tips: ["Use 'git init' to start a new repository", "This creates a .git folder in your project"],
          completed: userProgress.completedMissions.includes("1.1")
        },
        {
          id: "1.2",
          title: "First Commit",
          description: "Make your first commit with a meaningful message",
          commands: ["git add .", "git commit -m \"Initial commit\""],
          xp: 30,
          difficulty: 1,
          estimatedTime: "8 min",
          prerequisites: ["1.1"],
          tips: ["Always use descriptive commit messages", "Use present tense in commit messages"],
          completed: userProgress.completedMissions.includes("1.2")
        },
        {
          id: "1.3",
          title: "Check Status",
          description: "Learn to check the status of your repository",
          commands: ["git status"],
          xp: 15,
          difficulty: 1,
          estimatedTime: "3 min",
          prerequisites: ["1.1"],
          tips: ["git status shows working tree status", "Use it before making commits"],
          completed: userProgress.completedMissions.includes("1.3")
        }
      ]
    },
    {
      id: 2,
      title: "Branching & Merging",
      description: "Master the art of branching and merging",
      difficulty: "Intermediate",
      estimatedTime: "45-60 min",
      color: "from-green-500 to-emerald-500",
      missions: [
        {
          id: "2.1",
          title: "Create Branch",
          description: "Create and switch to a new branch",
          commands: ["git checkout -b feature"],
          xp: 25,
          difficulty: 2,
          estimatedTime: "6 min",
          prerequisites: ["1.2"],
          tips: ["Branches allow parallel development", "Use descriptive branch names"],
          completed: userProgress.completedMissions.includes("2.1")
        },
        {
          id: "2.2",
          title: "Switch Branches",
          description: "Navigate between different branches",
          commands: ["git checkout main", "git checkout feature"],
          xp: 20,
          difficulty: 2,
          estimatedTime: "5 min",
          prerequisites: ["2.1"],
          tips: ["Use 'git branch' to see all branches", "The current branch is marked with *"],
          completed: userProgress.completedMissions.includes("2.2")
        },
        {
          id: "2.3",
          title: "Merge Branches",
          description: "Merge changes from one branch to another",
          commands: ["git merge feature"],
          xp: 35,
          difficulty: 2,
          estimatedTime: "10 min",
          prerequisites: ["2.2"],
          tips: ["Always merge into the target branch", "Resolve conflicts if they occur"],
          completed: userProgress.completedMissions.includes("2.3")
        }
      ]
    },
    {
      id: 3,
      title: "Advanced Git",
      description: "Explore advanced Git concepts and workflows",
      difficulty: "Advanced",
      estimatedTime: "60-90 min",
      color: "from-purple-500 to-pink-500",
      missions: [
        {
          id: "3.1",
          title: "View History",
          description: "Explore commit history and changes",
          commands: ["git log", "git log --oneline"],
          xp: 20,
          difficulty: 3,
          estimatedTime: "8 min",
          prerequisites: ["1.2"],
          tips: ["Use --oneline for compact view", "git log shows commit history"],
          completed: userProgress.completedMissions.includes("3.1")
        },
        {
          id: "3.2",
          title: "Compare Changes",
          description: "See differences between commits and files",
          commands: ["git diff", "git diff --staged"],
          xp: 30,
          difficulty: 3,
          estimatedTime: "12 min",
          prerequisites: ["3.1"],
          tips: ["git diff shows unstaged changes", "git diff --staged shows staged changes"],
          completed: userProgress.completedMissions.includes("3.2")
        },
        {
          id: "3.3",
          title: "Reset Changes",
          description: "Undo changes and reset to previous states",
          commands: ["git reset HEAD~1", "git reset --hard HEAD~1"],
          xp: 40,
          difficulty: 3,
          estimatedTime: "15 min",
          prerequisites: ["3.2"],
          tips: ["Be careful with --hard reset", "Use --soft to keep changes staged"],
          completed: userProgress.completedMissions.includes("3.3")
        }
      ]
    },
    {
      id: 4,
      title: "Remote Collaboration",
      description: "Work with remote repositories and collaborate",
      difficulty: "Intermediate",
      estimatedTime: "45-60 min",
      color: "from-orange-500 to-red-500",
      missions: [
        {
          id: "4.1",
          title: "Clone Repository",
          description: "Clone an existing repository from remote",
          commands: ["git clone https://github.com/user/repo.git"],
          xp: 25,
          difficulty: 2,
          estimatedTime: "8 min",
          prerequisites: ["1.1"],
          tips: ["Clone creates a local copy", "Use HTTPS or SSH URLs"],
          completed: userProgress.completedMissions.includes("4.1")
        },
        {
          id: "4.2",
          title: "Push Changes",
          description: "Upload your changes to remote repository",
          commands: ["git push origin main"],
          xp: 30,
          difficulty: 2,
          estimatedTime: "10 min",
          prerequisites: ["4.1"],
          tips: ["Push uploads commits to remote", "Use -u to set upstream branch"],
          completed: userProgress.completedMissions.includes("4.2")
        },
        {
          id: "4.3",
          title: "Pull Updates",
          description: "Download and merge changes from remote",
          commands: ["git pull origin main"],
          xp: 25,
          difficulty: 2,
          estimatedTime: "8 min",
          prerequisites: ["4.2"],
          tips: ["Pull fetches and merges changes", "Always pull before pushing"],
          completed: userProgress.completedMissions.includes("4.3")
        }
      ]
    },
    {
      id: 5,
      title: "Git Workflows",
      description: "Master professional Git workflows and best practices",
      difficulty: "Expert",
      estimatedTime: "90-120 min",
      color: "from-indigo-500 to-purple-500",
      missions: [
        {
          id: "5.1",
          title: "Feature Branch Workflow",
          description: "Implement a complete feature branch workflow",
          commands: ["git checkout -b feature", "git add .", "git commit -m \"Add feature\"", "git push -u origin feature"],
          xp: 50,
          difficulty: 4,
          estimatedTime: "20 min",
          prerequisites: ["2.3", "4.2"],
          tips: ["Create branch for each feature", "Use descriptive branch names"],
          completed: userProgress.completedMissions.includes("5.1")
        },
        {
          id: "5.2",
          title: "Code Review Process",
          description: "Learn to review and merge pull requests",
          commands: ["git fetch origin", "git checkout -b review-branch", "git merge origin/feature"],
          xp: 45,
          difficulty: 4,
          estimatedTime: "25 min",
          prerequisites: ["5.1"],
          tips: ["Always review code before merging", "Test changes locally"],
          completed: userProgress.completedMissions.includes("5.2")
        },
        {
          id: "5.3",
          title: "Release Management",
          description: "Create and manage releases with tags",
          commands: ["git tag v1.0.0", "git push origin v1.0.0"],
          xp: 60,
          difficulty: 4,
          estimatedTime: "15 min",
          prerequisites: ["5.2"],
          tips: ["Use semantic versioning", "Tag important releases"],
          completed: userProgress.completedMissions.includes("5.3")
        }
      ]
    }
  ];

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 1: return "text-green-600 bg-green-100";
      case 2: return "text-blue-600 bg-blue-100";
      case 3: return "text-orange-600 bg-orange-100";
      case 4: return "text-red-600 bg-red-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getDifficultyText = (difficulty) => {
    switch (difficulty) {
      case 1: return "Easy";
      case 2: return "Medium";
      case 3: return "Hard";
      case 4: return "Expert";
      default: return "Unknown";
    }
  };

  const canStartMission = (mission) => {
    if (mission.completed) return false;
    return mission.prerequisites.every(prereq => 
      userProgress.completedMissions.includes(prereq)
    );
  };

  const startMission = (mission) => {
    setSelectedMission(mission);
    setShowDetails(true);
  };

  const completeMission = (mission) => {
    if (!userProgress.completedMissions.includes(mission.id)) {
      updateProgress({
        completedMissions: [...userProgress.completedMissions, mission.id],
        xp: userProgress.xp + mission.xp
      });
    }
    setShowDetails(false);
  };

  const totalMissions = chapters.reduce((sum, chapter) => sum + chapter.missions.length, 0);
  const completedMissions = userProgress.completedMissions.length;
  const progressPercentage = (completedMissions / totalMissions) * 100;

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Map className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Learning Path</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <Target className="h-4 w-4 text-accent" />
            <span className="text-muted-foreground">Progress:</span>
            <span className="font-semibold text-accent">{completedMissions}/{totalMissions}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">{Math.round(progressPercentage)}%</span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="w-full bg-muted rounded-full h-3">
          <motion.div
            className="progress-bar h-3 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Chapters */}
      <div className="space-y-8">
        {chapters.map((chapter, chapterIndex) => (
          <motion.div
            key={chapter.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: chapterIndex * 0.1 }}
            className="relative"
          >
            {/* Chapter Header */}
            <div className={`p-4 rounded-lg bg-gradient-to-r ${chapter.color} text-white mb-4`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold mb-1">Chapter {chapter.id}: {chapter.title}</h3>
                  <p className="text-white/90 text-sm">{chapter.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2 mb-1">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">{chapter.difficulty}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">{chapter.estimatedTime}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Missions */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chapter.missions.map((mission, missionIndex) => (
                <motion.div
                  key={mission.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: (chapterIndex * 0.1) + (missionIndex * 0.05) }}
                  className={`mission-card p-4 relative ${
                    mission.completed ? 'ring-2 ring-accent bg-accent/5' : ''
                  }`}
                >
                  {/* Mission Status */}
                  {mission.completed && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="h-5 w-5 text-accent" />
                    </div>
                  )}

                  {/* Mission Header */}
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{mission.title}</h4>
                      <span className={`px-2 py-1 text-xs rounded-full ${getDifficultyColor(mission.difficulty)}`}>
                        {getDifficultyText(mission.difficulty)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{mission.description}</p>
                  </div>

                  {/* Mission Details */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Zap className="h-3 w-3" />
                      <span>{mission.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{mission.estimatedTime}</span>
                    </div>
                  </div>

                  {/* Commands Preview */}
                  <div className="mb-4">
                    <div className="text-xs text-muted-foreground mb-1">Commands:</div>
                    <div className="space-y-1">
                      {mission.commands.slice(0, 2).map((cmd, index) => (
                        <div key={index} className="text-xs bg-muted px-2 py-1 rounded font-mono">
                          {cmd}
                        </div>
                      ))}
                      {mission.commands.length > 2 && (
                        <div className="text-xs text-muted-foreground">
                          +{mission.commands.length - 2} more...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={mission.completed ? "outline" : "default"}
                      onClick={() => startMission(mission)}
                      disabled={!canStartMission(mission) && !mission.completed}
                      className="flex-1"
                    >
                      {mission.completed ? (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Completed
                        </>
                      ) : canStartMission(mission) ? (
                        <>
                          <Play className="h-4 w-4 mr-1" />
                          Start
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-1" />
                          Locked
                        </>
                      )}
                    </Button>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setSelectedMission(mission);
                        setShowDetails(true);
                      }}
                    >
                      <BookOpen className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Mission Details Modal */}
      <AnimatePresence>
        {showDetails && selectedMission && (
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
                  <h3 className="text-xl font-semibold text-foreground">{selectedMission.title}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDetails(false)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <p className="text-muted-foreground">{selectedMission.description}</p>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Zap className="h-4 w-4 text-accent" />
                      <span className="text-sm">{selectedMission.xp} XP</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-primary" />
                      <span className="text-sm">{selectedMission.estimatedTime}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2">Commands to Learn:</h4>
                    <div className="space-y-2">
                      {selectedMission.commands.map((cmd, index) => (
                        <div key={index} className="bg-muted p-3 rounded font-mono text-sm">
                          {cmd}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedMission.tips.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Pro Tips:</h4>
                      <ul className="space-y-1">
                        {selectedMission.tips.map((tip, index) => (
                          <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-accent mt-1">•</span>
                            {tip}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedMission.prerequisites.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Prerequisites:</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedMission.prerequisites.map((prereq) => (
                          <span
                            key={prereq}
                            className={`px-2 py-1 text-xs rounded ${
                              userProgress.completedMissions.includes(prereq)
                                ? 'bg-accent/10 text-accent'
                                : 'bg-muted text-muted-foreground'
                            }`}
                          >
                            {prereq}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-4">
                    {!selectedMission.completed && canStartMission(selectedMission) && (
                      <Button
                        onClick={() => completeMission(selectedMission)}
                        className="flex-1"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Start Mission
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      onClick={() => setShowDetails(false)}
                      className="flex-1"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MissionMap;
