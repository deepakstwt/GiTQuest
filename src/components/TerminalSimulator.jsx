import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, CheckCircle, XCircle, Lightbulb, Copy, RotateCcw, History, BookOpen, Zap, GitBranch } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useGame } from '@/contexts/GameContext';

const TerminalSimulator = () => {
  const [command, setCommand] = useState('');
  const [history, setHistory] = useState([
    { type: 'system', content: 'Welcome to GitQuest Terminal! Type "help" to see available commands.' }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [commandHistory, setCommandHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isTyping, setIsTyping] = useState(false);
  const [currentDirectory, setCurrentDirectory] = useState('~/gitquest');
  const [gitStatus, setGitStatus] = useState({ staged: [], unstaged: [], untracked: [] });
  const inputRef = useRef(null);
  const { toast } = useToast();
  const { userProgress, updateProgress } = useGame();

  const gitCommands = {
    'git init': {
      description: 'Initialize a new Git repository',
      response: 'Initialized empty Git repository in .git/',
      xp: 10,
      chapter: 1,
      category: 'Repository Setup',
      syntax: 'git init [directory]',
      examples: ['git init', 'git init my-project']
    },
    'git add .': {
      description: 'Add all files to staging area',
      response: 'Files added to staging area',
      xp: 15,
      chapter: 1,
      category: 'Staging',
      syntax: 'git add <file>',
      examples: ['git add .', 'git add index.html', 'git add src/']
    },
    'git add': {
      description: 'Add specific files to staging area',
      response: 'Usage: git add <file> or git add .',
      xp: 5,
      chapter: 1,
      category: 'Staging',
      syntax: 'git add <file>',
      examples: ['git add .', 'git add index.html', 'git add src/']
    },
    'git commit -m': {
      description: 'Commit changes with a message',
      response: 'Changes committed successfully!',
      xp: 20,
      chapter: 1,
      category: 'Committing',
      syntax: 'git commit -m "<message>"',
      examples: ['git commit -m "Initial commit"', 'git commit -m "Add new feature"']
    },
    'git status': {
      description: 'Show the working tree status',
      response: 'On branch main\nnothing to commit, working tree clean',
      xp: 5,
      chapter: 1,
      category: 'Information',
      syntax: 'git status',
      examples: ['git status', 'git status --porcelain']
    },
    'git log': {
      description: 'Show commit history',
      response: 'commit abc123 (HEAD -> main)\nAuthor: Git Learner\nDate: Now\n\n    Initial commit',
      xp: 10,
      chapter: 3,
      category: 'Information',
      syntax: 'git log [options]',
      examples: ['git log', 'git log --oneline', 'git log -p']
    },
    'git branch': {
      description: 'List, create, or delete branches',
      response: '* main',
      xp: 10,
      chapter: 2,
      category: 'Branching',
      syntax: 'git branch [branch-name]',
      examples: ['git branch', 'git branch feature', 'git branch -d feature']
    },
    'git checkout -b': {
      description: 'Create and switch to a new branch',
      response: 'Switched to a new branch',
      xp: 25,
      chapter: 2,
      category: 'Branching',
      syntax: 'git checkout -b <branch-name>',
      examples: ['git checkout -b feature', 'git checkout -b hotfix']
    },
    'git merge': {
      description: 'Merge branches',
      response: 'Merge completed successfully',
      xp: 30,
      chapter: 2,
      category: 'Branching',
      syntax: 'git merge <branch>',
      examples: ['git merge feature', 'git merge --no-ff feature']
    },
    'git clone': {
      description: 'Clone a repository',
      response: 'Cloning into repository...\nClone completed!',
      xp: 20,
      chapter: 4,
      category: 'Remote',
      syntax: 'git clone <repository>',
      examples: ['git clone https://github.com/user/repo.git', 'git clone repo.git my-folder']
    },
    'git push': {
      description: 'Push changes to remote repository',
      response: 'Changes pushed to origin/main',
      xp: 25,
      chapter: 4,
      category: 'Remote',
      syntax: 'git push [remote] [branch]',
      examples: ['git push', 'git push origin main', 'git push -u origin feature']
    },
    'git pull': {
      description: 'Pull changes from remote repository',
      response: 'Already up to date.',
      xp: 20,
      chapter: 4,
      category: 'Remote',
      syntax: 'git pull [remote] [branch]',
      examples: ['git pull', 'git pull origin main']
    },
    'git diff': {
      description: 'Show changes between commits, commit and working tree, etc.',
      response: 'diff --git a/file.txt b/file.txt\nindex 1234567..abcdefg 100644\n--- a/file.txt\n+++ b/file.txt\n@@ -1,3 +1,4 @@\n Line 1\n Line 2\n+New line\n Line 3',
      xp: 15,
      chapter: 3,
      category: 'Information',
      syntax: 'git diff [options]',
      examples: ['git diff', 'git diff --staged', 'git diff HEAD~1']
    },
    'git reset': {
      description: 'Reset current HEAD to the specified state',
      response: 'Reset completed',
      xp: 25,
      chapter: 3,
      category: 'Advanced',
      syntax: 'git reset [mode] [commit]',
      examples: ['git reset HEAD~1', 'git reset --hard HEAD~1', 'git reset --soft HEAD~1']
    },
    'help': {
      description: 'Show available commands',
      response: 'Available Git commands:\n• git init - Initialize repository\n• git add . - Add all files\n• git commit -m "message" - Commit changes\n• git status - Check status\n• git log - View history\n• git branch - List branches\n• git checkout -b <name> - Create branch\n• git merge <branch> - Merge branches\n• git clone <url> - Clone repository\n• git push - Push to remote\n• git pull - Pull from remote\n• git diff - Show changes\n• git reset - Reset commits\n• clear - Clear terminal\n• history - Show command history',
      xp: 0,
      chapter: 1,
      category: 'Help',
      syntax: 'help [command]',
      examples: ['help', 'help git add']
    },
    'clear': {
      description: 'Clear the terminal',
      response: '',
      xp: 0,
      chapter: 1,
      category: 'Utility',
      syntax: 'clear',
      examples: ['clear']
    },
    'history': {
      description: 'Show command history',
      response: '',
      xp: 0,
      chapter: 1,
      category: 'Utility',
      syntax: 'history',
      examples: ['history']
    }
  };

  const handleCommand = (cmd) => {
    const trimmedCmd = cmd.trim();
    
    if (trimmedCmd === 'clear') {
      setHistory([]);
      return;
    }

    if (trimmedCmd === 'history') {
      const historyText = commandHistory.map((cmd, index) => `${index + 1}  ${cmd}`).join('\n');
      setHistory(prev => [...prev, { type: 'system', content: historyText || 'No commands in history' }]);
      return;
    }

    // Add to command history
    if (trimmedCmd && !commandHistory.includes(trimmedCmd)) {
      setCommandHistory(prev => [...prev, trimmedCmd]);
    }

    // Add command to history
    setHistory(prev => [...prev, { type: 'command', content: `${currentDirectory}$ ${trimmedCmd}` }]);

    // Check if command exists
    let matchedCommand = null;
    let isCorrect = false;

    // Exact match first
    if (gitCommands[trimmedCmd]) {
      matchedCommand = gitCommands[trimmedCmd];
      isCorrect = true;
    } else {
      // Partial match for commands with parameters
      for (const [key, value] of Object.entries(gitCommands)) {
        if (trimmedCmd.startsWith(key) && key !== 'help' && key !== 'clear' && key !== 'history') {
          matchedCommand = value;
          isCorrect = true;
          break;
        }
      }
    }

    if (isCorrect && matchedCommand) {
      // Success response
      setHistory(prev => [...prev, { 
        type: 'success', 
        content: matchedCommand.response 
      }]);

      // Award XP
      if (matchedCommand.xp > 0) {
        updateProgress({
          xp: userProgress.xp + matchedCommand.xp,
          totalCommands: userProgress.totalCommands + 1,
          correctCommands: userProgress.correctCommands + 1
        });

        toast({
          title: "Great job!",
          description: `+${matchedCommand.xp} XP earned`,
          className: "border-accent bg-accent/10"
        });
      }
    } else {
      // Error response
      setHistory(prev => [...prev, { 
        type: 'error', 
        content: `Command not found: ${trimmedCmd}\nType "help" to see available commands.` 
      }]);

      updateProgress({
        totalCommands: userProgress.totalCommands + 1
      });

      toast({
        title: "Command not found",
        description: "Try typing 'help' to see available commands.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (command.trim()) {
      handleCommand(command);
      setCommand('');
      setShowSuggestions(false);
      setHistoryIndex(-1);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setCommand(value);
    
    // Generate suggestions
    if (value.trim()) {
      const filtered = Object.keys(gitCommands).filter(cmd => 
        cmd.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 5);
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(commandHistory[commandHistory.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      if (suggestions.length > 0) {
        setCommand(suggestions[0]);
        setShowSuggestions(false);
      }
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setCommand(suggestion);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const clearTerminal = () => {
    setHistory([]);
    toast({
      title: "Terminal cleared",
      description: "Terminal history has been cleared",
    });
  };

  const copyLastOutput = () => {
    const lastOutput = history[history.length - 1]?.content;
    if (lastOutput) {
      navigator.clipboard.writeText(lastOutput);
      toast({
        title: "Copied!",
        description: "Last output copied to clipboard",
      });
    }
  };

  const showCommandHelp = (commandName) => {
    const cmd = gitCommands[commandName];
    if (cmd) {
      const helpText = `Command: ${commandName}\nDescription: ${cmd.description}\nSyntax: ${cmd.syntax}\nExamples:\n${cmd.examples.map(ex => `  ${ex}`).join('\n')}`;
      setHistory(prev => [...prev, { type: 'system', content: helpText }]);
    }
  };

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const accuracy = userProgress.totalCommands > 0 ? Math.round((userProgress.correctCommands / userProgress.totalCommands) * 100) : 0;

  return (
    <div className="card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Terminal className="h-6 w-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Git Terminal</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <GitBranch className="h-4 w-4" />
            <span>main</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <CheckCircle className="h-4 w-4 text-accent" />
              <span className="text-muted-foreground">Accuracy:</span>
              <span className="font-semibold text-accent">{accuracy}%</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Commands:</span>
              <span className="font-semibold text-primary">{userProgress.totalCommands}</span>
            </div>
            <div className="flex items-center gap-1">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{commandHistory.length}</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={copyLastOutput}
              className="p-2 text-muted-foreground hover:text-primary transition-colors tooltip"
              data-tooltip="Copy last output"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button
              onClick={clearTerminal}
              className="p-2 text-muted-foreground hover:text-primary transition-colors tooltip"
              data-tooltip="Clear terminal"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="simple-terminal p-4 h-80 overflow-y-auto font-mono text-sm">
        <AnimatePresence>
          {history.map((entry, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-2 ${
                entry.type === 'command' ? 'text-primary' :
                entry.type === 'success' ? 'command-success' :
                entry.type === 'error' ? 'command-error' :
                'text-muted-foreground'
              }`}
            >
              <div className="flex items-start gap-2">
                {entry.type === 'command' && (
                  <span className="text-primary font-bold">$</span>
                )}
                {entry.type === 'success' && (
                  <CheckCircle className="h-4 w-4 text-accent mt-0.5 flex-shrink-0" />
                )}
                {entry.type === 'error' && (
                  <XCircle className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                )}
                <pre className="whitespace-pre-wrap break-words">{entry.content}</pre>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {/* Cursor */}
        <motion.div
          className="inline-block w-2 h-5 bg-primary ml-2"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </div>

      {/* Input Area */}
      <div className="mt-4 relative">
        <form onSubmit={handleSubmit} className="relative">
          <div className="flex items-center gap-2">
            <span className="text-primary font-bold text-lg">$</span>
            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={command}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                placeholder="Enter Git command... (Use ↑↓ for history, Tab for completion)"
                className="w-full form-input"
                autoComplete="off"
                spellCheck="false"
              />
              
              {/* Suggestions */}
              <AnimatePresence>
                {showSuggestions && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-1 z-10 max-h-48 overflow-y-auto shadow-lg"
                  >
                    {suggestions.map((suggestion, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="w-full text-left px-3 py-2 hover:bg-muted transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Lightbulb className="h-3 w-3 text-accent" />
                          <span className="text-sm">{suggestion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">
                            {gitCommands[suggestion]?.category}
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              showCommandHelp(suggestion);
                            }}
                            className="p-1 hover:bg-primary/10 rounded"
                          >
                            <BookOpen className="h-3 w-3 text-primary" />
                          </button>
                        </div>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </form>
      </div>

      {/* Quick Commands */}
      <div className="mt-4">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="h-4 w-4 text-accent" />
          <span className="text-sm font-medium text-muted-foreground">Quick Commands</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {['git status', 'git add .', 'git commit -m "message"', 'git log', 'git diff'].map((quickCmd) => (
            <button
              key={quickCmd}
              onClick={() => setCommand(quickCmd)}
              className="px-3 py-1 text-xs bg-primary/10 text-primary rounded-full hover:bg-primary/20 transition-colors border border-primary/20"
            >
              {quickCmd}
            </button>
          ))}
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>Progress</span>
          <span>Chapter {userProgress.currentChapter}/5</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2">
          <motion.div
            className="progress-bar h-2 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${(userProgress.currentChapter / 5) * 100}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

export default TerminalSimulator;
