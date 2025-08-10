// Calisthenic Tracker - Main Application
class WorkoutTracker {
    constructor() {
        this.currentDate = new Date();
        this.workoutData = {};
        this.workoutHistory = {};
        this.workoutProgress = {};
        this.userSettings = {
            theme: 'light',
            units: 'metric',
            defaultRestTime: 60
        };
        this.currentView = 'workout';
        this.router = new Router();
        this.dataManager = new DataManager();
        this.init();
    }

    async init() {
        await this.loadData();
        this.setupRouter();
        this.setupEventListeners();
        this.initializeOnboarding();
        this.initializeExerciseSelector();
        this.render();
    }

    async loadData() {
        this.workoutData = await this.dataManager.load('workoutData') || this.getDefaultWorkouts();
        this.workoutHistory = await this.dataManager.load('workoutHistory') || {};
        this.workoutProgress = await this.dataManager.load('workoutProgress') || {};
        this.userSettings = await this.dataManager.load('userSettings') || this.userSettings;
    }

    async saveData() {
        await this.dataManager.save('workoutData', this.workoutData);
        await this.dataManager.save('workoutHistory', this.workoutHistory);
        await this.dataManager.save('workoutProgress', this.workoutProgress);
        await this.dataManager.save('userSettings', this.userSettings);
    }

    setupRouter() {
        this.router.addRoute('/', () => this.showWorkoutView());
        this.router.addRoute('/workout', () => this.showWorkoutView());
        this.router.addRoute('/builder', () => this.showBuilderView());
        this.router.addRoute('/history', () => this.showHistoryView());
        this.router.addRoute('/progress', () => this.showProgressView());
        this.router.addRoute('/settings', () => this.showSettingsView());
        this.router.addRoute('/onboarding', () => this.showOnboardingView());
        this.router.init();
    }

    setupEventListeners() {
        // Global event delegation
        document.addEventListener('click', this.handleClick.bind(this));
        document.addEventListener('change', this.handleChange.bind(this));
        
        // Keyboard shortcuts
        document.addEventListener('keydown', this.handleKeydown.bind(this));
        
        // PWA events
        window.addEventListener('beforeinstallprompt', this.handleInstallPrompt.bind(this));
    }

    handleClick(event) {
        const target = event.target;
        
        // Navigation
        if (target.matches('[data-navigate]')) {
            event.preventDefault();
            const route = target.getAttribute('data-navigate');
            this.router.navigate(route);
        }
        
        // Workout actions
        if (target.matches('[data-action]')) {
            const action = target.getAttribute('data-action');
            const data = target.dataset;
            this.handleAction(action, data, event);
        }
    }

    handleAction(action, data, event) {
        switch (action) {
            case 'complete-set':
                this.completeSet(data.exerciseIndex, data.setIndex);
                break;
            case 'add-exercise':
                this.showExercisePicker(data.workoutId);
                break;
            case 'remove-exercise':
                this.removeExercise(data.exerciseIndex);
                break;
            case 'save-workout':
                this.saveCurrentWorkout();
                break;
            case 'create-new-workout':
                this.workoutBuilder?.createNewWorkout();
                break;
            case 'edit-workout':
                this.workoutBuilder?.loadWorkoutForEditing(data.workoutId);
                break;
            case 'assign-workout':
                this.assignWorkoutToDay(data.workoutId);
                break;
            case 'toggle-theme':
                this.toggleTheme();
                break;
            case 'prev-day':
                this.changeDay(-1);
                break;
            case 'next-day':
                this.changeDay(1);
                break;
            case 'update-reps':
                this.updateSetData(data.exerciseIndex, data.setIndex, 'reps', event.target.value);
                break;
            case 'update-weight':
                this.updateSetData(data.exerciseIndex, data.setIndex, 'weight', event.target.value);
                break;
            case 'update-notes':
                this.updateExerciseNotes(data.exerciseIndex, event.target.value);
                break;
            default:
                // Handle onboarding actions
                if (this.onboardingFlow && action.includes('onboarding')) {
                    this.onboardingFlow.handleOnboardingAction(action, data);
                } else if (action.startsWith('toggle-') || action.startsWith('select-')) {
                    // Handle onboarding selection actions
                    this.onboardingFlow?.handleOnboardingAction(action, data);
                }
                break;
        }
    }

    render() {
        const container = document.getElementById('app');
        if (!container) return;
        
        container.innerHTML = this.getCurrentViewHTML();
        this.postRender();
    }

    getCurrentViewHTML() {
        switch (this.currentView) {
            case 'onboarding':
                return this.onboardingFlow?.getOnboardingHTML() || this.getWorkoutViewHTML();
            case 'workout':
                return this.getWorkoutViewHTML();
            case 'builder':
                return this.getBuilderViewHTML();
            case 'history':
                return this.getHistoryViewHTML();
            case 'progress':
                return this.getProgressViewHTML();
            case 'settings':
                return this.getSettingsViewHTML();
            default:
                return this.getWorkoutViewHTML();
        }
    }

    postRender() {
        // Initialize any dynamic components after render
        this.initializeWorkoutBuilder();
        this.initializeHistoryCalendar();
        this.initializeCharts();
        
        // Initialize the workout builder for the builder view
        if (this.currentView === 'builder' && this.workoutBuilder) {
            this.workoutBuilder.initializeBuilder();
        }
    }

    // View Methods
    showWorkoutView() {
        this.currentView = 'workout';
        this.render();
    }

    showBuilderView() {
        this.currentView = 'builder';
        this.render();
    }

    showHistoryView() {
        this.currentView = 'history';
        this.render();
    }

    showProgressView() {
        this.currentView = 'progress';
        this.render();
    }

    showSettingsView() {
        this.currentView = 'settings';
        this.render();
    }

    showOnboardingView() {
        this.currentView = 'onboarding';
        this.render();
    }

    // Workout Management
    completeSet(exerciseIndex, setIndex) {
        const today = this.formatDate(this.currentDate);
        
        // Get or create today's workout data
        if (!this.workoutHistory[today]) {
            const workoutKey = this.getCurrentWorkoutKey();
            this.workoutHistory[today] = {
                workoutId: workoutKey,
                exercises: JSON.parse(JSON.stringify(this.workoutData[workoutKey].exercises)),
                startedAt: new Date().toISOString()
            };
        }
        
        const todayWorkout = this.workoutHistory[today];
        const exercise = todayWorkout.exercises[exerciseIndex];
        
        if (!exercise.completedSets) exercise.completedSets = [];
        
        // Toggle the set completion
        if (exercise.completedSets[setIndex]?.completed) {
            // Uncheck the set
            exercise.completedSets[setIndex] = {
                completed: false,
                timestamp: new Date().toISOString()
            };
        } else {
            // Check the set
            exercise.completedSets[setIndex] = {
                completed: true,
                timestamp: new Date().toISOString(),
                reps: exercise.targetReps || 0,
                weight: exercise.weight || 0
            };
        }

        this.saveData();
        this.render();
    }

    saveWorkoutProgress() {
        const today = this.formatDate(this.currentDate);
        const workoutKey = this.getCurrentWorkoutKey();
        
        if (!this.workoutHistory[today]) {
            this.workoutHistory[today] = {};
        }
        
        this.workoutHistory[today] = {
            workoutId: workoutKey,
            exercises: JSON.parse(JSON.stringify(this.workoutData[workoutKey].exercises)),
            completedAt: new Date().toISOString(),
            duration: this.getWorkoutDuration()
        };
        
        this.saveData();
    }

    getCurrentWorkoutKey() {
        const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
        const dayName = dayNames[this.currentDate.getDay()];
        return this.weeklyPlan?.[dayName] || (this.currentDate.getDay() % 2 === 0 ? 'Day1' : 'Day2');
    }

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    getWorkoutDuration() {
        // Calculate workout duration based on start time
        // This would need to be tracked when workout starts
        return 0;
    }

    toggleTheme() {
        this.userSettings.theme = this.userSettings.theme === 'light' ? 'dark' : 'light';
        document.body.setAttribute('data-theme', this.userSettings.theme);
        this.saveData();
        this.render(); // Re-render to update theme toggle button text
    }

    getDefaultWorkouts() {
        return {
            'Day1': {
                name: 'Push/Pull Focus A',
                exercises: [
                    { name: 'Pull-ups (Wide Grip)', sets: '3x6', type: 'bodyweight', targetReps: 6 },
                    { name: 'Parallette Push-ups', sets: '3x10', type: 'bodyweight', targetReps: 10 },
                    { name: 'TRX Rows', sets: '3x12', type: 'bodyweight', targetReps: 12 },
                    { name: 'Ring Dips', sets: '3x8', type: 'bodyweight', targetReps: 8 }
                ]
            },
            'Day2': {
                name: 'Power/Core Focus B',
                exercises: [
                    { name: 'Ring Pull-ups', sets: '4x5', type: 'bodyweight', targetReps: 5 },
                    { name: 'Pike Push-ups (Wall)', sets: '3x8', type: 'bodyweight', targetReps: 8 },
                    { name: 'TRX Y-Flys', sets: '3x10', type: 'bodyweight', targetReps: 10 },
                    { name: 'TRX Ab Pikes', sets: '3x12', type: 'bodyweight', targetReps: 12 }
                ]
            }
        };
    }

    // New action methods
    assignWorkoutToDay(workoutId) {
        const workoutKey = this.getCurrentWorkoutKey();
        this.workoutData[workoutKey] = { ...this.workoutData[workoutId] };
        this.saveData();
        this.router.navigate('/workout');
    }

    changeDay(direction) {
        const newDate = new Date(this.currentDate);
        newDate.setDate(newDate.getDate() + direction);
        this.currentDate = newDate;
        this.render();
    }

    updateSetData(exerciseIndex, setIndex, field, value) {
        const workoutKey = this.getCurrentWorkoutKey();
        const exercise = this.workoutData[workoutKey].exercises[exerciseIndex];
        
        if (!exercise.completedSets) exercise.completedSets = [];
        if (!exercise.completedSets[setIndex]) exercise.completedSets[setIndex] = {};
        
        exercise.completedSets[setIndex][field] = value;
        this.saveData();
    }

    updateExerciseNotes(exerciseIndex, notes) {
        const workoutKey = this.getCurrentWorkoutKey();
        const exercise = this.workoutData[workoutKey].exercises[exerciseIndex];
        exercise.notes = notes;
        this.saveData();
    }

    removeExercise(exerciseIndex) {
        const today = this.formatDate(this.currentDate);
        
        // If we have started today's workout, remove from today's data
        if (this.workoutHistory[today]) {
            this.workoutHistory[today].exercises.splice(exerciseIndex, 1);
        } else {
            // If we haven't started today's workout, remove from the template
            const workoutKey = this.getCurrentWorkoutKey();
            this.workoutData[workoutKey].exercises.splice(exerciseIndex, 1);
        }
        
        this.saveData();
        this.render();
    }

    // Placeholder methods for advanced features
    initializeWorkoutBuilder() {
        if (!this.workoutBuilder) {
            // Import and initialize workout builder when needed
            if (typeof WorkoutBuilder !== 'undefined') {
                this.workoutBuilder = new WorkoutBuilder(this);
            }
        }
    }

    initializeCharts() {
        // Will implement progress charts
    }

    initializeHistoryCalendar() {
        if (!this.historyCalendar && typeof HistoryCalendar !== 'undefined') {
            this.historyCalendar = new HistoryCalendar(this);
            this.historyCalendar.setupEventListeners();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.app = new WorkoutTracker();
});