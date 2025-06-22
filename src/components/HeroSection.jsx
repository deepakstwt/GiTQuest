import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Play, Code, Trophy, Zap, ArrowRight } from 'lucide-react';

const HeroSection = ({ onStartLearning }) => {
  const [isHovered, setIsHovered] = useState(false);

  const features = [
    {
      icon: Code,
      title: "Interactive Terminal",
      description: "Practice Git commands in a safe environment with helpful feedback",
      color: "text-primary"
    },
    {
      icon: Trophy,
      title: "Step-by-Step Missions",
      description: "Learn Git through guided missions that build your skills gradually",
      color: "text-accent"
    },
    {
      icon: Zap,
      title: "Track Your Progress",
      description: "See your improvement with clear progress indicators and achievements",
      color: "text-primary"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeOut"
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative simple-bg">
      {/* Simple Background Pattern */}
      <div className="absolute inset-0 simple-grid opacity-30"></div>
      
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-12"
        >
          {/* Simple Title */}
          <motion.div variants={itemVariants} className="mb-8">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold simple-text-primary mb-4"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              GitQuest
            </motion.h1>
            <motion.p 
              className="text-xl md:text-2xl text-muted-foreground"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Learn Git the Easy Way
            </motion.p>
          </motion.div>

          {/* Simple Description */}
          <motion.p
            variants={itemVariants}
            className="text-lg md:text-xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Master Git version control through interactive lessons, hands-on practice, 
            and guided missions. Perfect for beginners and those wanting to improve their skills.
          </motion.p>

          {/* Simple CTA Buttons */}
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              onClick={onStartLearning}
              size="lg"
              variant="default"
              className="px-8 py-4 text-lg font-semibold group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <Play className="mr-2 h-5 w-5" />
              Start Learning
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-4 text-lg font-semibold"
              onClick={() => {
                // Demo functionality
                const demoCommands = ['git init', 'git add .', 'git commit -m "Initial commit"'];
                let index = 0;
                const interval = setInterval(() => {
                  console.log(`Demo: ${demoCommands[index]}`);
                  index++;
                  if (index >= demoCommands.length) {
                    clearInterval(interval);
                  }
                }, 1000);
              }}
            >
              <Code className="mr-2 h-5 w-5" />
              Try Demo
            </Button>
          </motion.div>
        </motion.div>

        {/* Simple Feature Cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="relative"
            >
              <div className="mission-card p-6 h-full">
                <div className="relative z-10">
                  <div className={`${feature.color} mb-4 flex justify-center`}>
                    <feature.icon className="h-12 w-12" />
                  </div>
                  
                  <h3 className="text-xl font-semibold text-foreground mb-3">
                    {feature.title}
                  </h3>
                  
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Simple Social Proof */}
        <motion.div
          variants={itemVariants}
          className="mt-16 text-center"
        >
          <div className="flex flex-wrap justify-center items-center gap-8 text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-primary border-2 border-background"
                  />
                ))}
              </div>
              <span className="text-sm">Join 10,000+ learners</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Trophy className="h-4 w-4 text-accent" />
              <span className="text-sm">50+ badges to earn</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm">Free to use</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
