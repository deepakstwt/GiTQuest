import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GitBranch, GitCommit, GitMerge, GitPullRequest, GitFork, 
  RefreshCw, Play, Pause, RotateCcw, Search, Filter, 
  BarChart3, Share2, Download, Eye, EyeOff, Users, 
  Clock, Calendar, FileText, Code, GitGraph, 
  ChevronLeft, ChevronRight, Maximize2, Minimize2,
  Info, HelpCircle, Settings, Zap, TrendingUp
} from 'lucide-react';
import { useGame } from '@/contexts/GameContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const GitVisualizer = () => {
  const { userProgress } = useGame();
  const { toast } = useToast();
  const containerRef = useRef(null);
  
  // Core state
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedCommit, setSelectedCommit] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [visualizationSpeed, setVisualizationSpeed] = useState(2000);
  
  // View modes and settings
  const [viewMode, setViewMode] = useState('timeline'); // timeline, graph, network, 3d
  const [showBranches, setShowBranches] = useState(true);
  const [showMerges, setShowMerges] = useState(true);
  const [showFiles, setShowFiles] = useState(true);
  const [showAuthors, setShowAuthors] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Filtering and search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBranches, setSelectedBranches] = useState([]);
  const [selectedAuthors, setSelectedAuthors] = useState([]);
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [commitTypes, setCommitTypes] = useState(['commit', 'branch', 'merge', 'revert']);
  
  // Analytics and insights
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showInsights, setShowInsights] = useState(false);
  
  // Tutorial and help
  const [showTutorial, setShowTutorial] = useState(false);
  const [tutorialStep, setTutorialStep] = useState(0);
  
  // Enhanced Git history with more realistic data
  const gitHistory = useMemo(() => [
    {
      id: 'c1',
      hash: 'a1b2c3d',
      message: 'Initial project setup',
      author: 'Alice Developer',
      email: 'alice@company.com',
      date: '2024-01-01T10:00:00Z',
      branch: 'main',
      files: ['package.json', 'README.md', '.gitignore'],
      type: 'commit',
      parent: null,
      additions: 45,
      deletions: 0,
      impact: 'high',
      tags: ['setup', 'initial']
    },
    {
      id: 'c2',
      hash: 'd4e5f6g',
      message: 'Add basic UI components',
      author: 'Bob Designer',
      email: 'bob@company.com',
      date: '2024-01-02T14:30:00Z',
      branch: 'main',
      files: ['src/components/Button.jsx', 'src/components/Card.jsx', 'src/styles/main.css'],
      type: 'commit',
      parent: 'c1',
      additions: 120,
      deletions: 0,
      impact: 'medium',
      tags: ['ui', 'components']
    },
    {
      id: 'c3',
      hash: 'g7h8i9j',
      message: 'Create feature branch for authentication',
      author: 'Alice Developer',
      email: 'alice@company.com',
      date: '2024-01-03T09:15:00Z',
      branch: 'feature/auth',
      files: [],
      type: 'branch',
      parent: 'c2',
      additions: 0,
      deletions: 0,
      impact: 'low',
      tags: ['feature', 'auth']
    },
    {
      id: 'c4',
      hash: 'j1k2l3m',
      message: 'Implement user authentication system',
      author: 'Charlie Backend',
      email: 'charlie@company.com',
      date: '2024-01-04T16:45:00Z',
      branch: 'feature/auth',
      files: ['src/auth/AuthProvider.jsx', 'src/auth/login.js', 'src/utils/jwt.js'],
      type: 'commit',
      parent: 'c3',
      additions: 280,
      deletions: 0,
      impact: 'high',
      tags: ['auth', 'security']
    },
    {
      id: 'c5',
      hash: 'm4n5o6p',
      message: 'Fix navigation bug in mobile view',
      author: 'Bob Designer',
      email: 'bob@company.com',
      date: '2024-01-05T11:20:00Z',
      branch: 'main',
      files: ['src/components/Navigation.jsx', 'src/styles/responsive.css'],
      type: 'commit',
      parent: 'c2',
      additions: 15,
      deletions: 8,
      impact: 'medium',
      tags: ['bugfix', 'mobile']
    },
    {
      id: 'c6',
      hash: 'p7q8r9s',
      message: 'Add unit tests for auth system',
      author: 'Alice Developer',
      email: 'alice@company.com',
      date: '2024-01-06T13:10:00Z',
      branch: 'feature/auth',
      files: ['tests/auth.test.js', 'tests/utils.test.js'],
      type: 'commit',
      parent: 'c4',
      additions: 95,
      deletions: 0,
      impact: 'medium',
      tags: ['tests', 'coverage']
    },
    {
      id: 'c7',
      hash: 's1t2u3v',
      message: 'Merge authentication feature',
      author: 'Alice Developer',
      email: 'alice@company.com',
      date: '2024-01-07T15:30:00Z',
      branch: 'main',
      files: ['src/auth/AuthProvider.jsx', 'src/auth/login.js', 'src/utils/jwt.js', 'tests/auth.test.js'],
      type: 'merge',
      parent: 'c5',
      mergeParent: 'c6',
      additions: 375,
      deletions: 0,
      impact: 'high',
      tags: ['merge', 'feature-complete']
    },
    {
      id: 'c8',
      hash: 'v4w5x6y',
      message: 'Add performance monitoring',
      author: 'David DevOps',
      email: 'david@company.com',
      date: '2024-01-08T10:45:00Z',
      branch: 'main',
      files: ['src/monitoring/analytics.js', 'src/utils/performance.js'],
      type: 'commit',
      parent: 'c7',
      additions: 65,
      deletions: 0,
      impact: 'medium',
      tags: ['monitoring', 'performance']
    },
    {
      id: 'c9',
      hash: 'y7z8a9b',
      message: 'Revert performance monitoring due to conflicts',
      author: 'Alice Developer',
      email: 'alice@company.com',
      date: '2024-01-09T14:20:00Z',
      branch: 'main',
      files: ['src/monitoring/analytics.js', 'src/utils/performance.js'],
      type: 'revert',
      parent: 'c8',
      additions: 0,
      deletions: 65,
      impact: 'medium',
      tags: ['revert', 'conflict']
    },
    {
      id: 'c10',
      hash: 'b1c2d3e',
      message: 'Add comprehensive documentation',
      author: 'Eve Technical Writer',
      email: 'eve@company.com',
      date: '2024-01-10T16:00:00Z',
      branch: 'main',
      files: ['docs/API.md', 'docs/SETUP.md', 'docs/CONTRIBUTING.md'],
      type: 'commit',
      parent: 'c9',
      additions: 420,
      deletions: 0,
      impact: 'high',
      tags: ['documentation', 'docs']
    }
  ], []);

  // Derived data
  const branches = useMemo(() => {
    const branchMap = new Map();
    gitHistory.forEach(commit => {
      if (!branchMap.has(commit.branch)) {
        branchMap.set(commit.branch, {
          name: commit.branch,
          commits: [],
          color: getBranchColor(commit.branch),
          author: commit.author,
          lastCommit: commit.date
        });
      }
      branchMap.get(commit.branch).commits.push(commit.id);
    });
    return Array.from(branchMap.values());
  }, [gitHistory]);

  const authors = useMemo(() => {
    const authorSet = new Set(gitHistory.map(commit => commit.author));
    return Array.from(authorSet);
  }, [gitHistory]);

  const filteredHistory = useMemo(() => {
    return gitHistory.filter(commit => {
      // Search filter
      if (searchQuery && !commit.message.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !commit.hash.toLowerCase().includes(searchQuery.toLowerCase()) &&
          !commit.author.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Branch filter
      if (selectedBranches.length > 0 && !selectedBranches.includes(commit.branch)) {
        return false;
      }
      
      // Author filter
      if (selectedAuthors.length > 0 && !selectedAuthors.includes(commit.author)) {
        return false;
      }
      
      // Type filter
      if (!commitTypes.includes(commit.type)) {
        return false;
      }
      
      // Date range filter
      if (dateRange.start && new Date(commit.date) < new Date(dateRange.start)) {
        return false;
      }
      if (dateRange.end && new Date(commit.date) > new Date(dateRange.end)) {
        return false;
      }
      
      return true;
    });
  }, [gitHistory, searchQuery, selectedBranches, selectedAuthors, commitTypes, dateRange]);

  // Analytics calculations
  const analytics = useMemo(() => {
    const totalCommits = gitHistory.length;
    const totalAdditions = gitHistory.reduce((sum, commit) => sum + commit.additions, 0);
    const totalDeletions = gitHistory.reduce((sum, commit) => sum + commit.deletions, 0);
    const authorStats = {};
    const branchStats = {};
    
    gitHistory.forEach(commit => {
      authorStats[commit.author] = (authorStats[commit.author] || 0) + 1;
      branchStats[commit.branch] = (branchStats[commit.branch] || 0) + 1;
    });
    
    const mostActiveAuthor = Object.entries(authorStats).sort(([,a], [,b]) => b - a)[0];
    const mostActiveBranch = Object.entries(branchStats).sort(([,a], [,b]) => b - a)[0];
    
    return {
      totalCommits,
      totalAdditions,
      totalDeletions,
      netChanges: totalAdditions - totalDeletions,
      authorStats,
      branchStats,
      mostActiveAuthor: mostActiveAuthor ? { name: mostActiveAuthor[0], commits: mostActiveAuthor[1] } : null,
      mostActiveBranch: mostActiveBranch ? { name: mostActiveBranch[0], commits: mostActiveBranch[1] } : null,
      averageCommitSize: Math.round((totalAdditions + totalDeletions) / totalCommits),
      commitTypes: gitHistory.reduce((acc, commit) => {
        acc[commit.type] = (acc[commit.type] || 0) + 1;
        return acc;
      }, {})
    };
  }, [gitHistory]);

  // Effects
  useEffect(() => {
    let interval;
    if (isPlaying && currentStep < filteredHistory.length - 1) {
      interval = setInterval(() => {
        setCurrentStep(prev => prev + 1);
      }, visualizationSpeed);
    } else if (currentStep >= filteredHistory.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStep, visualizationSpeed, filteredHistory.length]);

  // Utility functions
  const getBranchColor = (branch) => {
    const colors = {
      'main': '#3B82F6',
      'feature/auth': '#10B981',
      'feature/ui': '#F59E0B',
      'hotfix': '#EF4444',
      'release': '#8B5CF6'
    };
    return colors[branch] || `hsl(${branch.length * 30 % 360}, 70%, 60%)`;
  };

  const getCommitIcon = (type) => {
    switch (type) {
      case 'commit': return <GitCommit className="h-4 w-4" />;
      case 'branch': return <GitBranch className="h-4 w-4" />;
      case 'merge': return <GitMerge className="h-4 w-4" />;
      case 'revert': return <RotateCcw className="h-4 w-4" />;
      default: return <GitCommit className="h-4 w-4" />;
    }
  };

  const getCommitColor = (type, impact) => {
    const baseColors = {
      'commit': 'bg-blue-500',
      'branch': 'bg-green-500',
      'merge': 'bg-purple-500',
      'revert': 'bg-red-500'
    };
    
    const impactModifiers = {
      'high': 'shadow-lg shadow-blue-500/25',
      'medium': 'shadow-md shadow-blue-500/15',
      'low': 'shadow-sm shadow-blue-500/10'
    };
    
    return `${baseColors[type] || 'bg-blue-500'} ${impactModifiers[impact] || ''}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const getRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return `${Math.floor(diffInHours / 168)}w ago`;
  };

  // Control functions
  const togglePlay = () => setIsPlaying(!isPlaying);
  const resetVisualization = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    setSelectedCommit(null);
  };
  const nextStep = () => {
    if (currentStep < filteredHistory.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Export functions
  const exportData = () => {
    const data = {
      history: gitHistory,
      analytics,
      exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'git-history-export.json';
    a.click();
    URL.revokeObjectURL(url);
    
    toast({
      title: "Data Exported!",
      description: "Git history exported successfully",
      className: "border-green-500 bg-green-500/10"
    });
  };

  const shareVisualization = () => {
    const shareData = {
      title: 'Git History Visualization',
      text: 'Check out this amazing Git history visualization!',
      url: window.location.href
    };
    
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link Copied!",
        description: "Visualization link copied to clipboard",
        className: "border-blue-500 bg-blue-500/10"
      });
    }
  };

  // Tutorial steps
  const tutorialSteps = [
    {
      title: "Welcome to Git Visualizer!",
      content: "This tool helps you understand Git history through interactive visualizations. Let's explore the features together.",
      target: null
    },
    {
      title: "Timeline View",
      content: "This is the main timeline view showing your Git history chronologically. Each circle represents a commit.",
      target: ".timeline-view"
    },
    {
      title: "Commit Details",
      content: "Click on any commit to see detailed information including files changed, author, and impact.",
      target: ".commit-node"
    },
    {
      title: "Controls",
      content: "Use the play/pause button to animate through the history, or step through manually.",
      target: ".controls"
    },
    {
      title: "Filters",
      content: "Use the search and filter options to focus on specific commits, authors, or branches.",
      target: ".filters"
    },
    {
      title: "Analytics",
      content: "View detailed analytics about your repository including commit patterns and author activity.",
      target: ".analytics"
    }
  ];

  return (
    <div className={`card p-6 transition-all duration-300 ${isFullscreen ? 'fixed inset-0 z-50 m-0 rounded-none' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <GitGraph className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Advanced Git History Visualizer</h2>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
              {filteredHistory.length} commits
            </span>
            {showAnalytics && (
              <span className="text-xs bg-green-500/10 text-green-600 px-2 py-1 rounded-full">
                Analytics
              </span>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowTutorial(!showTutorial)}
            className="flex items-center gap-2"
          >
            <HelpCircle className="h-4 w-4" />
            Help
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setIsFullscreen(!isFullscreen)}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="filters mb-6 space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search commits, hashes, or authors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground"
            />
          </div>
          
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowAnalytics(!showAnalytics)}
            className="flex items-center gap-2"
          >
            <BarChart3 className="h-4 w-4" />
            Analytics
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={exportData}
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </Button>
          
          <Button
            size="sm"
            variant="outline"
            onClick={shareVisualization}
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Branches:</span>
            {branches.map(branch => (
              <button
                key={branch.name}
                onClick={() => {
                  if (selectedBranches.includes(branch.name)) {
                    setSelectedBranches(prev => prev.filter(b => b !== branch.name));
                  } else {
                    setSelectedBranches(prev => [...prev, branch.name]);
                  }
                }}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedBranches.includes(branch.name) || selectedBranches.length === 0
                    ? 'bg-primary text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
                style={{
                  backgroundColor: selectedBranches.includes(branch.name) || selectedBranches.length === 0
                    ? branch.color
                    : undefined
                }}
              >
                {branch.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Authors:</span>
            {authors.map(author => (
              <button
                key={author}
                onClick={() => {
                  if (selectedAuthors.includes(author)) {
                    setSelectedAuthors(prev => prev.filter(a => a !== author));
                  } else {
                    setSelectedAuthors(prev => [...prev, author]);
                  }
                }}
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  selectedAuthors.includes(author) || selectedAuthors.length === 0
                    ? 'bg-accent text-white'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {author.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Analytics Panel */}
      <AnimatePresence>
        {showAnalytics && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="analytics mb-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-lg border"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{analytics.totalCommits}</div>
                <div className="text-sm text-muted-foreground">Total Commits</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">+{analytics.totalAdditions}</div>
                <div className="text-sm text-muted-foreground">Additions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">-{analytics.totalDeletions}</div>
                <div className="text-sm text-muted-foreground">Deletions</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{analytics.averageCommitSize}</div>
                <div className="text-sm text-muted-foreground">Avg. Changes</div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Most Active Author</h4>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{analytics.mostActiveAuthor?.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({analytics.mostActiveAuthor?.commits} commits)
                  </span>
                </div>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Most Active Branch</h4>
                <div className="flex items-center gap-2">
                  <GitBranch className="h-4 w-4 text-muted-foreground" />
                  <span>{analytics.mostActiveBranch?.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({analytics.mostActiveBranch?.commits} commits)
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Controls */}
      <div className="controls flex items-center justify-center gap-4 mb-6">
        <Button
          size="sm"
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>
        
        <Button
          size="sm"
          onClick={togglePlay}
          disabled={currentStep >= filteredHistory.length - 1}
          className="flex items-center gap-2"
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          {isPlaying ? 'Pause' : 'Play'}
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={nextStep}
          disabled={currentStep >= filteredHistory.length - 1}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        <Button
          size="sm"
          variant="outline"
          onClick={resetVisualization}
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </Button>

        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Speed:</span>
          <select
            value={visualizationSpeed}
            onChange={(e) => setVisualizationSpeed(Number(e.target.value))}
            className="text-xs border border-border rounded px-2 py-1 bg-background"
          >
            <option value={1000}>Fast</option>
            <option value={2000}>Normal</option>
            <option value={4000}>Slow</option>
          </select>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-muted-foreground mb-2">
          <span>Step {currentStep + 1} of {filteredHistory.length}</span>
          <span>{Math.round(((currentStep + 1) / filteredHistory.length) * 100)}%</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="progress-bar h-2 rounded-full bg-gradient-to-r from-primary to-accent"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / filteredHistory.length) * 100}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </div>

      {/* Git History Visualization */}
      <div className="timeline-view relative min-h-[500px] overflow-hidden">
        {/* Branch Lines */}
        <div className="absolute left-6 top-0 w-full h-full">
          {branches.map((branch) => {
            const branchCommits = filteredHistory.filter(commit => commit.branch === branch.name);
            if (branchCommits.length === 0) return null;
            
            const firstCommit = branchCommits[0];
            const lastCommit = branchCommits[branchCommits.length - 1];
            const firstIndex = filteredHistory.indexOf(firstCommit);
            const lastIndex = filteredHistory.indexOf(lastCommit);
            
            return (
              <div
                key={branch.name}
                className="absolute left-0 w-0.5 transition-all duration-500"
                style={{
                  backgroundColor: branch.color,
                  height: `${((lastIndex - firstIndex + 1) / filteredHistory.length) * 100}%`,
                  top: `${(firstIndex / filteredHistory.length) * 100}%`,
                  zIndex: 0
                }}
              />
            );
          })}
        </div>

        {/* Commits */}
        <div className="relative z-10">
          {filteredHistory.slice(0, currentStep + 1).map((commit, index) => {
            const isSelected = selectedCommit?.id === commit.id;
            const isCurrent = index === currentStep;
            const branch = branches.find(b => b.name === commit.branch);
            
            return (
              <motion.div
                key={commit.id}
                initial={{ opacity: 0, x: -20, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
                className={`relative flex items-center gap-4 mb-8 ${
                  isCurrent ? 'scale-105' : ''
                }`}
              >
                {/* Commit Node */}
                <div className="relative">
                  <motion.div
                    className={`commit-node w-12 h-12 rounded-full flex items-center justify-center text-white cursor-pointer transition-all duration-300 ${
                      getCommitColor(commit.type, commit.impact)
                    } ${isSelected ? 'ring-4 ring-primary/50 scale-110' : ''}`}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    onClick={() => {
                      setSelectedCommit(commit);
                      setShowDetails(true);
                    }}
                  >
                    {getCommitIcon(commit.type)}
                  </motion.div>
                  
                  {/* Branch Label */}
                  {branch && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-medium px-2 py-1 rounded shadow-sm"
                      style={{ backgroundColor: branch.color, color: 'white' }}
                    >
                      {branch.name}
                    </motion.div>
                  )}

                  {/* Impact Indicator */}
                  {commit.impact === 'high' && (
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white"
                    />
                  )}
                </div>

                {/* Commit Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground">{commit.message}</h4>
                    <span className="text-xs text-muted-foreground font-mono bg-muted px-2 py-1 rounded">
                      {commit.hash}
                    </span>
                    {commit.tags.map(tag => (
                      <span key={tag} className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{commit.author}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>{getRelativeTime(commit.date)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      <span>{commit.files.length} file(s)</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span className="text-green-600">+{commit.additions}</span>
                      {commit.deletions > 0 && (
                        <span className="text-red-600">-{commit.deletions}</span>
                      )}
                    </div>
                  </div>

                  {/* Files Changed */}
                  {commit.files.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {commit.files.slice(0, 3).map((file, fileIndex) => (
                        <span
                          key={fileIndex}
                          className="text-xs bg-muted px-2 py-1 rounded flex items-center gap-1"
                        >
                          <Code className="h-3 w-3" />
                          {file}
                        </span>
                      ))}
                      {commit.files.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{commit.files.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Current Step Indicator */}
                {isCurrent && (
                  <motion.div
                    className="absolute -right-2 top-1/2 transform -translate-y-1/2"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    <div className="w-3 h-3 bg-accent rounded-full shadow-lg" />
                  </motion.div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 p-4 bg-muted rounded-lg">
        <h4 className="font-semibold mb-3 flex items-center gap-2">
          <Info className="h-4 w-4" />
          Legend
        </h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full shadow-md" />
            <span className="text-sm">Commit</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded-full shadow-md" />
            <span className="text-sm">Branch</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-purple-500 rounded-full shadow-md" />
            <span className="text-sm">Merge</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded-full shadow-md" />
            <span className="text-sm">Revert</span>
          </div>
        </div>
        <div className="mt-3 text-xs text-muted-foreground">
          <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
          High impact commits are highlighted
        </div>
      </div>

      {/* Tutorial Overlay */}
      <AnimatePresence>
        {showTutorial && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowTutorial(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold">{tutorialSteps[tutorialStep].title}</h3>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowTutorial(false)}
                  >
                    ×
                  </Button>
                </div>
                
                <p className="text-muted-foreground mb-4">
                  {tutorialSteps[tutorialStep].content}
                </p>
                
                <div className="flex justify-between">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setTutorialStep(Math.max(0, tutorialStep - 1))}
                    disabled={tutorialStep === 0}
                  >
                    Previous
                  </Button>
                  
                  <div className="flex gap-2">
                    {tutorialSteps.map((_, index) => (
                      <div
                        key={index}
                        className={`w-2 h-2 rounded-full ${
                          index === tutorialStep ? 'bg-primary' : 'bg-muted'
                        }`}
                      />
                    ))}
                  </div>
                  
                  <Button
                    size="sm"
                    onClick={() => {
                      if (tutorialStep < tutorialSteps.length - 1) {
                        setTutorialStep(tutorialStep + 1);
                      } else {
                        setShowTutorial(false);
                      }
                    }}
                  >
                    {tutorialStep < tutorialSteps.length - 1 ? 'Next' : 'Finish'}
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Commit Details Modal */}
      <AnimatePresence>
        {showDetails && selectedCommit && (
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
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${getCommitColor(selectedCommit.type, selectedCommit.impact)}`}>
                      {getCommitIcon(selectedCommit.type)}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground">{selectedCommit.message}</h3>
                      <p className="text-sm text-muted-foreground">{selectedCommit.hash}</p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setShowDetails(false)}
                  >
                    ×
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm text-muted-foreground">Author:</span>
                      <p className="text-sm font-medium">{selectedCommit.author}</p>
                      <p className="text-xs text-muted-foreground">{selectedCommit.email}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Date:</span>
                      <p className="text-sm">{formatDate(selectedCommit.date)}</p>
                      <p className="text-xs text-muted-foreground">{getRelativeTime(selectedCommit.date)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Branch:</span>
                      <p className="text-sm">{selectedCommit.branch}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Type:</span>
                      <p className="text-sm capitalize">{selectedCommit.type}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Impact:</span>
                      <p className="text-sm capitalize">{selectedCommit.impact}</p>
                    </div>
                    <div>
                      <span className="text-sm text-muted-foreground">Changes:</span>
                      <p className="text-sm">
                        <span className="text-green-600">+{selectedCommit.additions}</span>
                        {selectedCommit.deletions > 0 && (
                          <span className="text-red-600"> -{selectedCommit.deletions}</span>
                        )}
                      </p>
                    </div>
                  </div>

                  {selectedCommit.tags.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Tags:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedCommit.tags.map((tag, index) => (
                          <span key={index} className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCommit.files.length > 0 && (
                    <div>
                      <h4 className="font-semibold mb-2">Files Changed:</h4>
                      <div className="space-y-1">
                        {selectedCommit.files.map((file, index) => (
                          <div key={index} className="text-sm bg-muted px-3 py-2 rounded flex items-center gap-2">
                            <Code className="h-4 w-4 text-muted-foreground" />
                            {file}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {selectedCommit.type === 'merge' && selectedCommit.mergeParent && (
                    <div>
                      <h4 className="font-semibold mb-2">Merge Details:</h4>
                      <p className="text-sm text-muted-foreground">
                        Merged from commit: {selectedCommit.mergeParent}
                      </p>
                    </div>
                  )}

                  <Button
                    variant="outline"
                    onClick={() => setShowDetails(false)}
                    className="w-full"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GitVisualizer; 