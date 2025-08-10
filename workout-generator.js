// Intelligent Workout Generation
class WorkoutGenerator {
    constructor(setupData) {
        this.setup = setupData;
        this.exerciseDatabase = this.getExerciseDatabase();
    }

    getExerciseDatabase() {
        return {
            bodyweight: {
                push: [
                    { name: 'Push-ups', difficulty: 'beginner', targetReps: [8, 12, 15], muscles: ['chest', 'triceps', 'shoulders'] },
                    { name: 'Diamond Push-ups', difficulty: 'intermediate', targetReps: [5, 8, 12], muscles: ['triceps', 'chest'] },
                    { name: 'Pike Push-ups', difficulty: 'intermediate', targetReps: [5, 8, 12], muscles: ['shoulders', 'triceps'] },
                    { name: 'Handstand Push-ups', difficulty: 'advanced', targetReps: [3, 5, 8], muscles: ['shoulders', 'triceps'] },
                    { name: 'Archer Push-ups', difficulty: 'advanced', targetReps: [3, 5, 8], muscles: ['chest', 'triceps'] }
                ],
                pull: [
                    { name: 'Wall Slides', difficulty: 'beginner', targetReps: [10, 15, 20], muscles: ['back', 'rear-delts'] },
                    { name: 'Superman', difficulty: 'beginner', targetReps: [10, 15, 20], muscles: ['back', 'glutes'] },
                    { name: 'Reverse Snow Angels', difficulty: 'beginner', targetReps: [12, 15, 20], muscles: ['back', 'rear-delts'] }
                ],
                legs: [
                    { name: 'Squats', difficulty: 'beginner', targetReps: [12, 15, 20], muscles: ['quads', 'glutes'] },
                    { name: 'Lunges', difficulty: 'beginner', targetReps: [8, 12, 16], muscles: ['quads', 'glutes'] },
                    { name: 'Single Leg Squats', difficulty: 'advanced', targetReps: [3, 5, 8], muscles: ['quads', 'glutes'] },
                    { name: 'Calf Raises', difficulty: 'beginner', targetReps: [15, 20, 25], muscles: ['calves'] }
                ],
                core: [
                    { name: 'Plank', difficulty: 'beginner', duration: [20, 30, 45], muscles: ['core'] },
                    { name: 'Dead Bug', difficulty: 'beginner', targetReps: [8, 12, 16], muscles: ['core'] },
                    { name: 'Bicycle Crunches', difficulty: 'beginner', targetReps: [16, 20, 24], muscles: ['core'] },
                    { name: 'Mountain Climbers', difficulty: 'intermediate', targetReps: [20, 30, 40], muscles: ['core', 'shoulders'] }
                ]
            },
            'pull-up-bar': {
                pull: [
                    { name: 'Assisted Pull-ups', difficulty: 'beginner', targetReps: [3, 5, 8], muscles: ['back', 'biceps'] },
                    { name: 'Negative Pull-ups', difficulty: 'beginner', targetReps: [3, 5, 8], muscles: ['back', 'biceps'] },
                    { name: 'Pull-ups', difficulty: 'intermediate', targetReps: [5, 8, 12], muscles: ['back', 'biceps'] },
                    { name: 'Chin-ups', difficulty: 'intermediate', targetReps: [5, 8, 12], muscles: ['biceps', 'back'] },
                    { name: 'Wide Grip Pull-ups', difficulty: 'intermediate', targetReps: [4, 6, 10], muscles: ['back', 'biceps'] },
                    { name: 'Archer Pull-ups', difficulty: 'advanced', targetReps: [2, 4, 6], muscles: ['back', 'biceps'] }
                ]
            },
            dumbbells: {
                push: [
                    { name: 'Dumbbell Press', difficulty: 'beginner', targetReps: [8, 12, 15], muscles: ['chest', 'shoulders', 'triceps'], weight: [15, 25, 35] },
                    { name: 'Dumbbell Flys', difficulty: 'intermediate', targetReps: [10, 12, 15], muscles: ['chest'], weight: [10, 15, 25] },
                    { name: 'Overhead Press', difficulty: 'beginner', targetReps: [8, 10, 12], muscles: ['shoulders', 'triceps'], weight: [15, 20, 30] },
                    { name: 'Lateral Raises', difficulty: 'beginner', targetReps: [12, 15, 20], muscles: ['shoulders'], weight: [5, 10, 15] }
                ],
                pull: [
                    { name: 'Dumbbell Rows', difficulty: 'beginner', targetReps: [8, 12, 15], muscles: ['back', 'biceps'], weight: [15, 25, 35] },
                    { name: 'Dumbbell Curls', difficulty: 'beginner', targetReps: [10, 12, 15], muscles: ['biceps'], weight: [10, 15, 25] },
                    { name: 'Hammer Curls', difficulty: 'beginner', targetReps: [10, 12, 15], muscles: ['biceps'], weight: [10, 15, 25] },
                    { name: 'Reverse Flys', difficulty: 'intermediate', targetReps: [12, 15, 20], muscles: ['rear-delts', 'back'], weight: [5, 10, 15] }
                ],
                legs: [
                    { name: 'Goblet Squats', difficulty: 'beginner', targetReps: [12, 15, 20], muscles: ['quads', 'glutes'], weight: [15, 25, 35] },
                    { name: 'Dumbbell Lunges', difficulty: 'beginner', targetReps: [8, 12, 16], muscles: ['quads', 'glutes'], weight: [10, 20, 30] },
                    { name: 'Romanian Deadlifts', difficulty: 'intermediate', targetReps: [8, 10, 12], muscles: ['hamstrings', 'glutes'], weight: [20, 30, 45] }
                ]
            },
            trx: {
                push: [
                    { name: 'TRX Chest Press', difficulty: 'beginner', targetReps: [8, 12, 15], muscles: ['chest', 'triceps'] },
                    { name: 'TRX Tricep Press', difficulty: 'intermediate', targetReps: [6, 10, 12], muscles: ['triceps'] }
                ],
                pull: [
                    { name: 'TRX Rows', difficulty: 'beginner', targetReps: [8, 12, 15], muscles: ['back', 'biceps'] },
                    { name: 'TRX Face Pulls', difficulty: 'beginner', targetReps: [12, 15, 20], muscles: ['rear-delts', 'back'] },
                    { name: 'TRX Curls', difficulty: 'intermediate', targetReps: [8, 12, 15], muscles: ['biceps'] }
                ],
                legs: [
                    { name: 'TRX Squats', difficulty: 'beginner', targetReps: [12, 15, 20], muscles: ['quads', 'glutes'] },
                    { name: 'TRX Lunges', difficulty: 'intermediate', targetReps: [8, 12, 16], muscles: ['quads', 'glutes'] }
                ],
                core: [
                    { name: 'TRX Plank', difficulty: 'intermediate', duration: [20, 30, 45], muscles: ['core'] },
                    { name: 'TRX Pike', difficulty: 'intermediate', targetReps: [8, 12, 15], muscles: ['core'] },
                    { name: 'TRX Mountain Climbers', difficulty: 'intermediate', targetReps: [20, 30, 40], muscles: ['core'] }
                ]
            },
            rings: {
                push: [
                    { name: 'Ring Push-ups', difficulty: 'intermediate', targetReps: [5, 8, 12], muscles: ['chest', 'triceps', 'core'] },
                    { name: 'Ring Dips', difficulty: 'advanced', targetReps: [3, 6, 10], muscles: ['chest', 'triceps'] }
                ],
                pull: [
                    { name: 'Ring Rows', difficulty: 'beginner', targetReps: [8, 12, 15], muscles: ['back', 'biceps'] },
                    { name: 'Ring Pull-ups', difficulty: 'intermediate', targetReps: [5, 8, 12], muscles: ['back', 'biceps'] }
                ]
            },
            parallettes: {
                push: [
                    { name: 'Parallette Push-ups', difficulty: 'intermediate', targetReps: [6, 10, 15], muscles: ['chest', 'triceps'] },
                    { name: 'Parallette Dips', difficulty: 'intermediate', targetReps: [5, 8, 12], muscles: ['chest', 'triceps'] }
                ],
                core: [
                    { name: 'L-Sits', difficulty: 'advanced', duration: [5, 10, 20], muscles: ['core', 'shoulders'] },
                    { name: 'Parallette Knee Raises', difficulty: 'intermediate', targetReps: [8, 12, 15], muscles: ['core'] }
                ]
            }
        };
    }

    generatePersonalizedWorkouts() {
        switch (this.setup.workoutSplit) {
            case 'full-body':
                return this.generateFullBodyWorkouts();
            case 'upper-lower':
                return this.generateUpperLowerWorkouts();
            case 'push-pull-legs':
                return this.generatePushPullLegsWorkouts();
            default:
                return this.generateFullBodyWorkouts();
        }
    }

    generateFullBodyWorkouts() {
        const workouts = {};
        const workoutNames = ['Workout A', 'Workout B', 'Workout C'];
        
        for (let i = 0; i < 3; i++) {
            const exercises = [];
            
            // Add one exercise from each movement pattern
            exercises.push(this.selectBestExercise('push'));
            exercises.push(this.selectBestExercise('pull'));
            exercises.push(this.selectBestExercise('legs'));
            exercises.push(this.selectBestExercise('core'));
            
            // Add variety for different workout days
            if (i === 1) {
                exercises.push(this.selectBestExercise('push', exercises.map(ex => ex.name)));
            } else if (i === 2) {
                exercises.push(this.selectBestExercise('pull', exercises.map(ex => ex.name)));
            }
            
            workouts[`Day${i + 1}`] = {
                name: workoutNames[i],
                exercises: exercises.map(ex => this.formatExerciseForWorkout(ex)),
                category: 'Full Body'
            };
        }
        
        return workouts;
    }

    generateUpperLowerWorkouts() {
        const workouts = {};
        
        // Upper Body Workout
        const upperExercises = [];
        upperExercises.push(this.selectBestExercise('push'));
        upperExercises.push(this.selectBestExercise('pull'));
        upperExercises.push(this.selectBestExercise('push', [upperExercises[0].name]));
        upperExercises.push(this.selectBestExercise('pull', [upperExercises[1].name]));
        
        workouts['Upper'] = {
            name: 'Upper Body',
            exercises: upperExercises.map(ex => this.formatExerciseForWorkout(ex)),
            category: 'Upper'
        };
        
        // Lower Body Workout
        const lowerExercises = [];
        lowerExercises.push(this.selectBestExercise('legs'));
        lowerExercises.push(this.selectBestExercise('legs', [lowerExercises[0].name]));
        lowerExercises.push(this.selectBestExercise('core'));
        
        workouts['Lower'] = {
            name: 'Lower Body',
            exercises: lowerExercises.map(ex => this.formatExerciseForWorkout(ex)),
            category: 'Lower'
        };
        
        return workouts;
    }

    generatePushPullLegsWorkouts() {
        const workouts = {};
        
        // Push Day
        const pushExercises = [];
        pushExercises.push(this.selectBestExercise('push'));
        pushExercises.push(this.selectBestExercise('push', [pushExercises[0].name]));
        pushExercises.push(this.selectBestExercise('push', pushExercises.map(ex => ex.name)));
        
        workouts['Push'] = {
            name: 'Push Day',
            exercises: pushExercises.map(ex => this.formatExerciseForWorkout(ex)),
            category: 'Push'
        };
        
        // Pull Day
        const pullExercises = [];
        pullExercises.push(this.selectBestExercise('pull'));
        pullExercises.push(this.selectBestExercise('pull', [pullExercises[0].name]));
        pullExercises.push(this.selectBestExercise('pull', pullExercises.map(ex => ex.name)));
        
        workouts['Pull'] = {
            name: 'Pull Day',
            exercises: pullExercises.map(ex => this.formatExerciseForWorkout(ex)),
            category: 'Pull'
        };
        
        // Leg Day
        const legExercises = [];
        legExercises.push(this.selectBestExercise('legs'));
        legExercises.push(this.selectBestExercise('legs', [legExercises[0].name]));
        legExercises.push(this.selectBestExercise('core'));
        
        workouts['Legs'] = {
            name: 'Leg Day',
            exercises: legExercises.map(ex => this.formatExerciseForWorkout(ex)),
            category: 'Legs'
        };
        
        return workouts;
    }

    selectBestExercise(movementPattern, excludeExercises = []) {
        const availableExercises = [];
        
        // Collect exercises from all available equipment
        this.setup.equipment.forEach(equipment => {
            if (this.exerciseDatabase[equipment] && this.exerciseDatabase[equipment][movementPattern]) {
                availableExercises.push(...this.exerciseDatabase[equipment][movementPattern]);
            }
        });
        
        // Filter out excluded exercises
        const filteredExercises = availableExercises.filter(ex => !excludeExercises.includes(ex.name));
        
        if (filteredExercises.length === 0) {
            // Fallback to bodyweight if no equipment exercises available
            return this.exerciseDatabase.bodyweight[movementPattern]?.[0] || { 
                name: 'Rest', 
                difficulty: 'beginner', 
                targetReps: [0], 
                muscles: [] 
            };
        }
        
        // Select based on fitness level
        const levelMatch = filteredExercises.filter(ex => ex.difficulty === this.setup.fitnessLevel);
        if (levelMatch.length > 0) {
            return levelMatch[0];
        }
        
        // Fallback to first available exercise
        return filteredExercises[0];
    }

    formatExerciseForWorkout(exercise) {
        const difficultyIndex = { beginner: 0, intermediate: 1, advanced: 2 }[this.setup.fitnessLevel] || 0;
        
        let sets, targetReps, type = 'bodyweight';
        
        if (exercise.duration) {
            // Duration-based exercise (like planks)
            const duration = exercise.duration[difficultyIndex] || exercise.duration[0];
            sets = '3x' + duration + 's';
            targetReps = duration;
        } else {
            // Rep-based exercise
            targetReps = exercise.targetReps[difficultyIndex] || exercise.targetReps[0];
            sets = '3x' + targetReps;
        }
        
        const result = {
            name: exercise.name,
            sets: sets,
            type: type,
            targetReps: targetReps,
            muscles: exercise.muscles
        };
        
        // Add weight for dumbbell exercises
        if (exercise.weight) {
            result.type = 'weighted';
            result.weight = exercise.weight[difficultyIndex] + 'lbs';
        }
        
        return result;
    }
}

// Better Exercise Selection UX (replaces drag-and-drop)
class ExerciseSelector {
    constructor(app) {
        this.app = app;
        this.isOpen = false;
        this.currentWorkoutId = null;
        this.searchTerm = '';
        this.selectedCategory = 'all';
    }

    openSelector(workoutId) {
        this.currentWorkoutId = workoutId;
        this.isOpen = true;
        this.showExerciseSelectorModal();
    }

    closeSelector() {
        this.isOpen = false;
        const modal = document.getElementById('exerciseSelectorModal');
        if (modal) {
            modal.remove();
        }
    }

    showExerciseSelectorModal() {
        const modalHTML = `
            <div id="exerciseSelectorModal" class="modal-overlay">
                <div class="modal-content exercise-selector">
                    <div class="modal-header">
                        <h2>Add Exercise</h2>
                        <button class="modal-close" onclick="app.exerciseSelector.closeSelector()">×</button>
                    </div>
                    
                    <div class="exercise-selector-controls">
                        <input type="text" 
                               id="exerciseSearch" 
                               placeholder="Search exercises..." 
                               class="search-input"
                               oninput="app.exerciseSelector.updateSearch(this.value)">
                        
                        <div class="category-filters">
                            <button class="filter-btn active" onclick="app.exerciseSelector.filterCategory('all')">All</button>
                            <button class="filter-btn" onclick="app.exerciseSelector.filterCategory('push')">Push</button>
                            <button class="filter-btn" onclick="app.exerciseSelector.filterCategory('pull')">Pull</button>
                            <button class="filter-btn" onclick="app.exerciseSelector.filterCategory('legs')">Legs</button>
                            <button class="filter-btn" onclick="app.exerciseSelector.filterCategory('core')">Core</button>
                        </div>
                    </div>
                    
                    <div class="exercise-selector-content">
                        ${this.getFilteredExercisesHTML()}
                    </div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', modalHTML);
    }

    getFilteredExercisesHTML() {
        const allExercises = this.getAllAvailableExercises();
        const filteredExercises = allExercises.filter(ex => {
            const matchesSearch = ex.name.toLowerCase().includes(this.searchTerm.toLowerCase());
            const matchesCategory = this.selectedCategory === 'all' || ex.category === this.selectedCategory;
            return matchesSearch && matchesCategory;
        });

        return `
            <div class="exercise-list">
                ${filteredExercises.map(exercise => `
                    <div class="exercise-option" onclick="app.exerciseSelector.addExercise('${exercise.name}')">
                        <div class="exercise-info">
                            <div class="exercise-name">${exercise.name}</div>
                            <div class="exercise-details">${exercise.muscles.join(', ')} • ${exercise.difficulty}</div>
                        </div>
                        <div class="add-button">+</div>
                    </div>
                `).join('')}
            </div>
        `;
    }

    getAllAvailableExercises() {
        const generator = new WorkoutGenerator(this.app.userSettings);
        const database = generator.exerciseDatabase;
        const exercises = [];
        
        // Get exercises for user's equipment
        this.app.userSettings.equipment?.forEach(equipment => {
            if (database[equipment]) {
                Object.keys(database[equipment]).forEach(category => {
                    database[equipment][category].forEach(exercise => {
                        exercises.push({
                            ...exercise,
                            category: category,
                            equipment: equipment
                        });
                    });
                });
            }
        });
        
        return exercises;
    }

    updateSearch(searchTerm) {
        this.searchTerm = searchTerm;
        const content = document.querySelector('.exercise-selector-content');
        if (content) {
            content.innerHTML = this.getFilteredExercisesHTML();
        }
    }

    filterCategory(category) {
        this.selectedCategory = category;
        
        // Update active button
        document.querySelectorAll('.category-filters .filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        // Update content
        const content = document.querySelector('.exercise-selector-content');
        if (content) {
            content.innerHTML = this.getFilteredExercisesHTML();
        }
    }

    addExercise(exerciseName) {
        const generator = new WorkoutGenerator(this.app.userSettings);
        const allExercises = this.getAllAvailableExercises();
        const selectedExercise = allExercises.find(ex => ex.name === exerciseName);
        
        if (selectedExercise && this.currentWorkoutId) {
            const formattedExercise = generator.formatExerciseForWorkout(selectedExercise);
            
            // Add to current workout
            if (!this.app.workoutData[this.currentWorkoutId]) {
                this.app.workoutData[this.currentWorkoutId] = {
                    name: 'Custom Workout',
                    exercises: []
                };
            }
            
            this.app.workoutData[this.currentWorkoutId].exercises.push(formattedExercise);
            this.app.saveData();
            
            // Close selector and refresh view
            this.closeSelector();
            this.app.render();
        }
    }
}

// Add to main app
WorkoutTracker.prototype.initializeExerciseSelector = function() {
    if (!this.exerciseSelector) {
        this.exerciseSelector = new ExerciseSelector(this);
    }
};