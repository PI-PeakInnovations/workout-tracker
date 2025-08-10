// User Onboarding and Setup Flow
class OnboardingFlow {
    constructor(app) {
        this.app = app;
        this.setupData = {
            isFirstTime: true,
            equipment: [],
            fitnessLevel: 'beginner',
            goals: [],
            workoutSplit: 'full-body',
            daysPerWeek: 3
        };
    }

    checkIfFirstTime() {
        const hasHistory = Object.keys(this.app.workoutHistory).length > 0;
        const hasCompletedOnboarding = this.app.userSettings.completedOnboarding;
        
        // Check if we only have default workouts (Day1, Day2)
        const workoutKeys = Object.keys(this.app.workoutData);
        const hasOnlyDefaultWorkouts = workoutKeys.length <= 2 && 
                                       workoutKeys.every(key => key === 'Day1' || key === 'Day2');
        
        return hasOnlyDefaultWorkouts && !hasHistory && !hasCompletedOnboarding;
    }

    startOnboarding() {
        this.app.currentView = 'onboarding';
        this.app.onboardingStep = 1;
        this.app.render();
    }

    getOnboardingHTML() {
        const step = this.app.onboardingStep || 1;
        
        switch (step) {
            case 1:
                return this.getWelcomeStepHTML();
            case 2:
                return this.getEquipmentStepHTML();
            case 3:
                return this.getFitnessLevelStepHTML();
            case 4:
                return this.getGoalsStepHTML();
            case 5:
                return this.getWorkoutSplitStepHTML();
            case 6:
                return this.getGenerateWorkoutsStepHTML();
            default:
                return this.getWelcomeStepHTML();
        }
    }

    getWelcomeStepHTML() {
        return `
            <div class="onboarding-step">
                <div class="onboarding-header">
                    <h1>Welcome to CalTracker! 💪</h1>
                    <p>Let's set up your personalized workout plan in just a few steps.</p>
                </div>
                
                <div class="onboarding-content">
                    <div class="welcome-features">
                        <div class="feature-item">
                            <div class="feature-icon">🎯</div>
                            <div class="feature-text">
                                <h3>Personalized Workouts</h3>
                                <p>Based on your equipment and goals</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📈</div>
                            <div class="feature-text">
                                <h3>Track Progress</h3>
                                <p>See your strength gains over time</p>
                            </div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">📱</div>
                            <div class="feature-text">
                                <h3>Works Offline</h3>
                                <p>Use anywhere, anytime</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="onboarding-actions">
                    <button data-action="next-onboarding-step" class="primary-btn large-btn">Let's Get Started!</button>
                </div>
            </div>
        `;
    }

    getEquipmentStepHTML() {
        const equipment = [
            { id: 'bodyweight', name: 'Bodyweight Only', icon: '🏃', description: 'No equipment needed' },
            { id: 'pull-up-bar', name: 'Pull-up Bar', icon: '━━', description: 'Mounted or doorway' },
            { id: 'dumbbells', name: 'Dumbbells', icon: '🏋️', description: 'Adjustable or fixed' },
            { id: 'trx', name: 'TRX/Suspension', icon: '⟆⟇', description: 'Suspension trainer' },
            { id: 'rings', name: 'Gymnastic Rings', icon: '◯◯', description: 'Hanging rings' },
            { id: 'parallettes', name: 'Parallettes', icon: '┃┃', description: 'Low parallel bars' },
            { id: 'resistance-bands', name: 'Resistance Bands', icon: '〰️', description: 'Elastic bands' },
            { id: 'kettlebell', name: 'Kettlebell', icon: '🔔', description: 'Weighted ball with handle' }
        ];

        return `
            <div class="onboarding-step">
                <div class="onboarding-header">
                    <h2>What equipment do you have? 🏠</h2>
                    <p>Select all that you have access to (select multiple)</p>
                </div>
                
                <div class="equipment-grid">
                    ${equipment.map(eq => `
                        <div class="equipment-card ${this.setupData.equipment.includes(eq.id) ? 'selected' : ''}" 
                             data-action="toggle-equipment" data-equipment="${eq.id}">
                            <div class="equipment-icon">${eq.icon}</div>
                            <div class="equipment-name">${eq.name}</div>
                            <div class="equipment-description">${eq.description}</div>
                            <div class="selection-indicator">✓</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="onboarding-actions">
                    <button data-action="prev-onboarding-step" class="secondary-btn">Back</button>
                    <button data-action="next-onboarding-step" class="primary-btn" ${this.setupData.equipment.length === 0 ? 'disabled' : ''}>
                        Continue (${this.setupData.equipment.length} selected)
                    </button>
                </div>
            </div>
        `;
    }

    getFitnessLevelStepHTML() {
        const levels = [
            {
                id: 'beginner',
                name: 'Beginner',
                description: 'New to working out or getting back into it',
                examples: 'Can do: 1-5 push-ups, assisted pull-ups'
            },
            {
                id: 'intermediate',
                name: 'Intermediate',
                description: 'Been working out for a few months consistently',
                examples: 'Can do: 10+ push-ups, 1-5 pull-ups'
            },
            {
                id: 'advanced',
                name: 'Advanced',
                description: 'Training regularly for 6+ months',
                examples: 'Can do: 20+ push-ups, 10+ pull-ups'
            }
        ];

        return `
            <div class="onboarding-step">
                <div class="onboarding-header">
                    <h2>What's your current fitness level? 📊</h2>
                    <p>This helps us set appropriate starting weights and reps</p>
                </div>
                
                <div class="fitness-level-options">
                    ${levels.map(level => `
                        <div class="level-card ${this.setupData.fitnessLevel === level.id ? 'selected' : ''}" 
                             data-action="select-fitness-level" data-level="${level.id}">
                            <h3>${level.name}</h3>
                            <p class="level-description">${level.description}</p>
                            <p class="level-examples">${level.examples}</p>
                        </div>
                    `).join('')}
                </div>
                
                <div class="onboarding-actions">
                    <button data-action="prev-onboarding-step" class="secondary-btn">Back</button>
                    <button data-action="next-onboarding-step" class="primary-btn">Continue</button>
                </div>
            </div>
        `;
    }

    getGoalsStepHTML() {
        const goals = [
            { id: 'strength', name: 'Build Strength', icon: '💪', description: 'Get stronger, lift heavier' },
            { id: 'muscle', name: 'Build Muscle', icon: '🏗️', description: 'Increase muscle size and definition' },
            { id: 'endurance', name: 'Improve Endurance', icon: '⚡', description: 'Last longer, do more reps' },
            { id: 'weight-loss', name: 'Lose Weight', icon: '📉', description: 'Burn calories and fat' },
            { id: 'general-fitness', name: 'General Fitness', icon: '🎯', description: 'Overall health and wellness' },
            { id: 'sport-specific', name: 'Sport Performance', icon: '🏃', description: 'Improve athletic performance' }
        ];

        return `
            <div class="onboarding-step">
                <div class="onboarding-header">
                    <h2>What are your fitness goals? 🎯</h2>
                    <p>Select your main goals (you can choose multiple)</p>
                </div>
                
                <div class="goals-grid">
                    ${goals.map(goal => `
                        <div class="goal-card ${this.setupData.goals.includes(goal.id) ? 'selected' : ''}" 
                             data-action="toggle-goal" data-goal="${goal.id}">
                            <div class="goal-icon">${goal.icon}</div>
                            <div class="goal-name">${goal.name}</div>
                            <div class="goal-description">${goal.description}</div>
                            <div class="selection-indicator">✓</div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="onboarding-actions">
                    <button data-action="prev-onboarding-step" class="secondary-btn">Back</button>
                    <button data-action="next-onboarding-step" class="primary-btn" ${this.setupData.goals.length === 0 ? 'disabled' : ''}>
                        Continue (${this.setupData.goals.length} selected)
                    </button>
                </div>
            </div>
        `;
    }

    getWorkoutSplitStepHTML() {
        const splits = [
            {
                id: 'full-body',
                name: 'Full Body',
                description: 'Work all muscles each session',
                frequency: '3 days per week',
                good_for: 'Beginners, time-efficient'
            },
            {
                id: 'upper-lower',
                name: 'Upper/Lower',
                description: 'Alternate upper and lower body days',
                frequency: '4 days per week',
                good_for: 'Intermediate, balanced approach'
            },
            {
                id: 'push-pull-legs',
                name: 'Push/Pull/Legs',
                description: 'Push muscles, pull muscles, legs',
                frequency: '3-6 days per week',
                good_for: 'Advanced, high volume'
            }
        ];

        return `
            <div class="onboarding-step">
                <div class="onboarding-header">
                    <h2>Choose your workout split 📅</h2>
                    <p>How do you want to organize your training?</p>
                </div>
                
                <div class="split-options">
                    ${splits.map(split => `
                        <div class="split-card ${this.setupData.workoutSplit === split.id ? 'selected' : ''}" 
                             data-action="select-workout-split" data-split="${split.id}">
                            <h3>${split.name}</h3>
                            <p class="split-description">${split.description}</p>
                            <div class="split-details">
                                <span class="split-frequency">${split.frequency}</span>
                                <span class="split-good-for">Good for: ${split.good_for}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
                
                <div class="onboarding-actions">
                    <button data-action="prev-onboarding-step" class="secondary-btn">Back</button>
                    <button data-action="next-onboarding-step" class="primary-btn">Generate My Workouts!</button>
                </div>
            </div>
        `;
    }

    getGenerateWorkoutsStepHTML() {
        return `
            <div class="onboarding-step">
                <div class="onboarding-header">
                    <h2>🎉 Your Workouts Are Ready!</h2>
                    <p>We've created personalized workouts based on your preferences</p>
                </div>
                
                <div class="setup-summary">
                    <div class="summary-item">
                        <strong>Equipment:</strong> ${this.setupData.equipment.map(eq => eq.charAt(0).toUpperCase() + eq.slice(1).replace('-', ' ')).join(', ')}
                    </div>
                    <div class="summary-item">
                        <strong>Level:</strong> ${this.setupData.fitnessLevel.charAt(0).toUpperCase() + this.setupData.fitnessLevel.slice(1)}
                    </div>
                    <div class="summary-item">
                        <strong>Split:</strong> ${this.setupData.workoutSplit.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                    </div>
                </div>
                
                <div class="onboarding-actions">
                    <button data-action="complete-onboarding" class="primary-btn large-btn">Start My First Workout! 🚀</button>
                    <button data-action="customize-workouts" class="secondary-btn">Customize First</button>
                </div>
            </div>
        `;
    }

    // Handle onboarding actions
    handleOnboardingAction(action, data) {
        switch (action) {
            case 'next-onboarding-step':
                this.nextStep();
                break;
            case 'prev-onboarding-step':
                this.prevStep();
                break;
            case 'toggle-equipment':
                this.toggleEquipment(data.equipment);
                break;
            case 'select-fitness-level':
                this.setupData.fitnessLevel = data.level;
                this.app.render();
                break;
            case 'toggle-goal':
                this.toggleGoal(data.goal);
                break;
            case 'select-workout-split':
                this.setupData.workoutSplit = data.split;
                this.app.render();
                break;
            case 'complete-onboarding':
                this.completeOnboarding();
                break;
            case 'customize-workouts':
                this.completeOnboarding(true);
                break;
        }
    }

    nextStep() {
        this.app.onboardingStep = (this.app.onboardingStep || 1) + 1;
        this.app.render();
    }

    prevStep() {
        this.app.onboardingStep = Math.max(1, (this.app.onboardingStep || 1) - 1);
        this.app.render();
    }

    toggleEquipment(equipmentId) {
        const index = this.setupData.equipment.indexOf(equipmentId);
        if (index > -1) {
            this.setupData.equipment.splice(index, 1);
        } else {
            this.setupData.equipment.push(equipmentId);
        }
        this.app.render();
    }

    toggleGoal(goalId) {
        const index = this.setupData.goals.indexOf(goalId);
        if (index > -1) {
            this.setupData.goals.splice(index, 1);
        } else {
            this.setupData.goals.push(goalId);
        }
        this.app.render();
    }

    generateWorkouts() {
        // This will generate workouts based on setupData
        const workoutGenerator = new WorkoutGenerator(this.setupData);
        return workoutGenerator.generatePersonalizedWorkouts();
    }

    completeOnboarding(goToBuilder = false) {
        // Save setup preferences
        this.app.userSettings.completedOnboarding = true;
        this.app.userSettings.equipment = this.setupData.equipment;
        this.app.userSettings.fitnessLevel = this.setupData.fitnessLevel;
        this.app.userSettings.goals = this.setupData.goals;
        this.app.userSettings.workoutSplit = this.setupData.workoutSplit;

        // Generate personalized workouts
        const generatedWorkouts = this.generateWorkouts();
        Object.assign(this.app.workoutData, generatedWorkouts);

        // Save everything
        this.app.saveData();

        // Navigate to builder or workout view
        if (goToBuilder) {
            this.app.router.navigate('/builder');
        } else {
            this.app.router.navigate('/workout');
        }
    }
}

// Add to main app
WorkoutTracker.prototype.initializeOnboarding = function() {
    if (!this.onboardingFlow) {
        this.onboardingFlow = new OnboardingFlow(this);
        
        // Check if this is a first-time user
        if (this.onboardingFlow.checkIfFirstTime()) {
            this.onboardingFlow.startOnboarding();
        }
    }
};