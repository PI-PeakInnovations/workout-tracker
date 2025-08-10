// Drag and Drop Workout Builder
class WorkoutBuilder {
    constructor(app) {
        this.app = app;
        this.currentWorkout = null;
        this.exerciseLibrary = this.getExerciseLibrary();
        this.draggedElement = null;
        this.currentFilter = 'all';
    }

    getExerciseLibrary() {
        return {
            'TRX': [
                { name: 'TRX Rows', sets: '3x12', type: 'bodyweight', targetReps: 12 },
                { name: 'TRX Chest Press', sets: '3x10', type: 'bodyweight', targetReps: 10 },
                { name: 'TRX Curls', sets: '3x12', type: 'bodyweight', targetReps: 12 },
                { name: 'TRX Tricep Extensions', sets: '3x10', type: 'bodyweight', targetReps: 10 },
                { name: 'TRX T-Flys', sets: '3x8', type: 'bodyweight', targetReps: 8 },
                { name: 'TRX Y-Flys', sets: '3x8', type: 'bodyweight', targetReps: 8 },
                { name: 'TRX Supermans', sets: '3x15', type: 'bodyweight', targetReps: 15 },
                { name: 'TRX Ab Pikes', sets: '3x12', type: 'bodyweight', targetReps: 12 }
            ],
            'Ring': [
                { name: 'Ring Dips', sets: '3x6', type: 'bodyweight', targetReps: 6 },
                { name: 'Ring Pull-ups', sets: '3x5', type: 'bodyweight', targetReps: 5 },
                { name: 'Ring Rows', sets: '3x10', type: 'bodyweight', targetReps: 10 },
                { name: 'Ring Push-ups', sets: '3x8', type: 'bodyweight', targetReps: 8 },
                { name: 'Ring L-Sits', sets: '3x15s', type: 'bodyweight', targetReps: 15 },
                { name: 'Ring Support Holds', sets: '3x30s', type: 'bodyweight', targetReps: 30 },
                { name: 'Ring Muscle-ups', sets: '3x2', type: 'bodyweight', targetReps: 2 }
            ],
            'Parallette': [
                { name: 'Parallette Push-ups', sets: '3x8', type: 'bodyweight', targetReps: 8 },
                { name: 'Pike Push-ups (Wall)', sets: '3x6', type: 'bodyweight', targetReps: 6 },
                { name: 'Parallette L-Sits', sets: '3x20s', type: 'bodyweight', targetReps: 20 },
                { name: 'Parallette Handstands', sets: '3x30s', type: 'bodyweight', targetReps: 30 },
                { name: 'Parallette Dips', sets: '3x10', type: 'bodyweight', targetReps: 10 }
            ],
            'Pull-up': [
                { name: 'Pull-ups (Wide Grip)', sets: '3x6', type: 'bodyweight', targetReps: 6 },
                { name: 'Pull-ups (Close Grip)', sets: '3x6', type: 'bodyweight', targetReps: 6 },
                { name: 'Chin-ups', sets: '3x8', type: 'bodyweight', targetReps: 8 },
                { name: 'Archer Pull-ups', sets: '3x4', type: 'bodyweight', targetReps: 4 },
                { name: 'L-Sit Pull-ups', sets: '3x5', type: 'bodyweight', targetReps: 5 }
            ],
            'Dumbbell': [
                { name: 'Dumbbell Curls', sets: '3x12', type: 'weighted', weight: '30lbs', targetReps: 12 },
                { name: 'Dumbbell Overhead Press', sets: '3x8', type: 'weighted', weight: '25lbs', targetReps: 8 },
                { name: 'Dumbbell Rows', sets: '3x10', type: 'weighted', weight: '35lbs', targetReps: 10 },
                { name: 'Dumbbell Flys', sets: '3x10', type: 'weighted', weight: '20lbs', targetReps: 10 }
            ],
            'Bodyweight': [
                { name: 'Push-ups', sets: '3x15', type: 'bodyweight', targetReps: 15 },
                { name: 'Diamond Push-ups', sets: '3x8', type: 'bodyweight', targetReps: 8 },
                { name: 'Pike Push-ups', sets: '3x10', type: 'bodyweight', targetReps: 10 },
                { name: 'Burpees', sets: '3x10', type: 'bodyweight', targetReps: 10 },
                { name: 'Plank', sets: '3x60s', type: 'bodyweight', targetReps: 60 },
                { name: 'Squats', sets: '3x20', type: 'bodyweight', targetReps: 20 }
            ]
        };
    }

    initializeBuilder() {
        this.setupDragAndDrop();
        this.setupEventListeners();
        this.renderExerciseLibrary();
    }

    setupEventListeners() {
        // Exercise filter buttons
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-filter-category]')) {
                const category = e.target.getAttribute('data-filter-category');
                this.filterExercises(category);
            }
            
            if (e.target.matches('[data-action="save-workout"]')) {
                this.saveWorkout();
            }
            
            if (e.target.matches('[data-action="create-new-workout"]')) {
                this.createNewWorkout();
            }
            
            if (e.target.matches('[data-action="remove-exercise"]')) {
                const exerciseIndex = parseInt(e.target.getAttribute('data-exercise-index'));
                this.removeExerciseFromWorkout(exerciseIndex);
            }
        });

        // Workout name input
        document.addEventListener('input', (e) => {
            if (e.target.matches('#workoutNameInput')) {
                if (this.currentWorkout) {
                    this.currentWorkout.name = e.target.value;
                }
            }
        });
    }

    setupDragAndDrop() {
        document.addEventListener('dragstart', (e) => {
            if (e.target.matches('.exercise-library-item')) {
                this.draggedElement = e.target;
                e.target.classList.add('dragging');
                
                const exerciseData = JSON.parse(e.target.getAttribute('data-exercise'));
                e.dataTransfer.setData('text/plain', JSON.stringify(exerciseData));
                e.dataTransfer.effectAllowed = 'copy';
            }
        });

        document.addEventListener('dragend', (e) => {
            if (e.target.matches('.exercise-library-item')) {
                e.target.classList.remove('dragging');
                this.draggedElement = null;
            }
        });

        document.addEventListener('dragover', (e) => {
            if (e.target.closest('.workout-exercises-container')) {
                e.preventDefault();
                e.dataTransfer.dropEffect = 'copy';
            }
        });

        document.addEventListener('drop', (e) => {
            if (e.target.closest('.workout-exercises-container')) {
                e.preventDefault();
                const exerciseData = JSON.parse(e.dataTransfer.getData('text/plain'));
                this.addExerciseToWorkout(exerciseData);
            }
        });

        // Also handle drag over the drop zone specifically
        document.addEventListener('dragenter', (e) => {
            if (e.target.matches('.drop-zone') || e.target.closest('.drop-zone')) {
                e.preventDefault();
                e.target.closest('.drop-zone').classList.add('drag-over');
            }
        });

        document.addEventListener('dragleave', (e) => {
            if (e.target.matches('.drop-zone') || e.target.closest('.drop-zone')) {
                e.target.closest('.drop-zone').classList.remove('drag-over');
            }
        });
    }

    filterExercises(category) {
        this.currentFilter = category;
        
        // Update active button
        document.querySelectorAll('[data-filter-category]').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-filter-category="${category}"]`)?.classList.add('active');
        
        this.renderExerciseLibrary();
    }

    renderExerciseLibrary() {
        const container = document.getElementById('exerciseLibraryGrid');
        if (!container) return;

        let exercises = [];
        if (this.currentFilter === 'all') {
            exercises = Object.values(this.exerciseLibrary).flat();
        } else {
            exercises = this.exerciseLibrary[this.currentFilter] || [];
        }

        container.innerHTML = exercises.map(exercise => `
            <div class="exercise-library-item" 
                 draggable="true" 
                 data-exercise='${JSON.stringify(exercise)}'
                 data-category="${this.getExerciseCategory(exercise)}">
                <div class="exercise-icon">${this.getExerciseIcon(exercise)}</div>
                <div class="exercise-info">
                    <div class="exercise-name">${exercise.name}</div>
                    <div class="exercise-sets">${exercise.sets}</div>
                    <div class="exercise-type">${exercise.type}${exercise.weight ? ` • ${exercise.weight}` : ''}</div>
                </div>
                <div class="drag-handle">⋮⋮</div>
            </div>
        `).join('');
    }

    getExerciseCategory(exercise) {
        for (const [category, exercises] of Object.entries(this.exerciseLibrary)) {
            if (exercises.some(ex => ex.name === exercise.name)) {
                return category;
            }
        }
        return 'Bodyweight';
    }

    getExerciseIcon(exercise) {
        const category = this.getExerciseCategory(exercise);
        const icons = {
            'TRX': '⟆⟇',
            'Ring': '◯◯',
            'Parallette': '┃┃',
            'Pull-up': '━━',
            'Dumbbell': '🏋️',
            'Bodyweight': '🏃'
        };
        return icons[category] || '🏃';
    }

    createNewWorkout() {
        this.currentWorkout = {
            id: 'custom_' + Date.now(),
            name: 'New Workout',
            exercises: []
        };
        this.renderWorkoutBuilder();
    }

    addExerciseToWorkout(exerciseData) {
        if (!this.currentWorkout) {
            this.createNewWorkout();
        }
        
        // Clone the exercise data to avoid references
        const exercise = {
            ...exerciseData,
            id: Date.now() + Math.random(),
            completedSets: []
        };
        
        this.currentWorkout.exercises.push(exercise);
        this.renderWorkoutBuilder();
    }

    removeExerciseFromWorkout(exerciseIndex) {
        if (this.currentWorkout && this.currentWorkout.exercises[exerciseIndex]) {
            this.currentWorkout.exercises.splice(exerciseIndex, 1);
            this.renderWorkoutBuilder();
        }
    }

    renderWorkoutBuilder() {
        const container = document.getElementById('workoutBuilderContainer');
        if (!container || !this.currentWorkout) return;

        container.innerHTML = `
            <div class="workout-builder-header">
                <input type="text" 
                       id="workoutNameInput" 
                       value="${this.currentWorkout.name}" 
                       placeholder="Workout Name" 
                       class="workout-name-input">
                <button data-action="save-workout" class="save-workout-btn">Save Workout</button>
            </div>
            
            <div class="workout-exercises-container">
                ${this.currentWorkout.exercises.length === 0 ? `
                    <div class="drop-zone">
                        <div class="drop-zone-content">
                            <div class="drop-zone-icon">⬇️</div>
                            <div class="drop-zone-text">Drag exercises here to build your workout</div>
                        </div>
                    </div>
                ` : ''}
                
                ${this.currentWorkout.exercises.map((exercise, index) => `
                    <div class="workout-exercise-item">
                        <div class="exercise-drag-handle">⋮⋮</div>
                        <div class="exercise-info">
                            <div class="exercise-name">${exercise.name}</div>
                            <div class="exercise-details">
                                <input type="text" 
                                       value="${exercise.sets}" 
                                       placeholder="3x10" 
                                       class="sets-input"
                                       data-exercise-index="${index}"
                                       data-field="sets">
                                ${exercise.type === 'weighted' ? `
                                    <input type="text" 
                                           value="${exercise.weight || ''}" 
                                           placeholder="Weight" 
                                           class="weight-input"
                                           data-exercise-index="${index}"
                                           data-field="weight">
                                ` : ''}
                                <select class="type-select" data-exercise-index="${index}" data-field="type">
                                    <option value="bodyweight" ${exercise.type === 'bodyweight' ? 'selected' : ''}>Bodyweight</option>
                                    <option value="weighted" ${exercise.type === 'weighted' ? 'selected' : ''}>Weighted</option>
                                </select>
                            </div>
                        </div>
                        <button data-action="remove-exercise" 
                                data-exercise-index="${index}" 
                                class="remove-exercise-btn">×</button>
                    </div>
                `).join('')}
                
                ${this.currentWorkout.exercises.length > 0 ? `
                    <div class="drop-zone drop-zone-bottom">
                        <div class="drop-zone-text">Drop here to add more exercises</div>
                    </div>
                ` : ''}
            </div>
        `;

        // Setup input listeners for exercise modifications
        this.setupExerciseInputListeners();
    }

    setupExerciseInputListeners() {
        document.addEventListener('input', (e) => {
            if (e.target.matches('.sets-input, .weight-input') && this.currentWorkout) {
                const exerciseIndex = parseInt(e.target.getAttribute('data-exercise-index'));
                const field = e.target.getAttribute('data-field');
                
                if (this.currentWorkout.exercises[exerciseIndex]) {
                    this.currentWorkout.exercises[exerciseIndex][field] = e.target.value;
                }
            }
        });

        document.addEventListener('change', (e) => {
            if (e.target.matches('.type-select') && this.currentWorkout) {
                const exerciseIndex = parseInt(e.target.getAttribute('data-exercise-index'));
                
                if (this.currentWorkout.exercises[exerciseIndex]) {
                    this.currentWorkout.exercises[exerciseIndex].type = e.target.value;
                    this.renderWorkoutBuilder(); // Re-render to show/hide weight input
                }
            }
        });
    }

    async saveWorkout() {
        if (!this.currentWorkout || this.currentWorkout.exercises.length === 0) {
            alert('Please add at least one exercise to the workout.');
            return;
        }

        if (!this.currentWorkout.name.trim()) {
            alert('Please enter a workout name.');
            return;
        }

        // Save to app data
        this.app.workoutData[this.currentWorkout.id] = {
            name: this.currentWorkout.name,
            exercises: this.currentWorkout.exercises,
            createdAt: new Date().toISOString(),
            isCustom: true
        };

        await this.app.saveData();
        
        // Show success message
        this.showSuccessMessage('Workout saved successfully!');
        
        // Reset builder
        this.currentWorkout = null;
        this.renderWorkoutBuilder();
        
        // Refresh workout library if visible
        if (this.app.currentView === 'builder') {
            this.app.render();
        }
    }

    showSuccessMessage(message) {
        // Create and show a temporary success message
        const messageEl = document.createElement('div');
        messageEl.className = 'success-message';
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--success-color);
            color: white;
            padding: 12px 24px;
            border-radius: 8px;
            z-index: 1000;
            animation: slideIn 0.3s ease-out;
        `;
        
        document.body.appendChild(messageEl);
        
        setTimeout(() => {
            messageEl.remove();
        }, 3000);
    }

    loadWorkoutForEditing(workoutId) {
        const workout = this.app.workoutData[workoutId];
        if (workout) {
            this.currentWorkout = {
                id: workoutId,
                name: workout.name,
                exercises: JSON.parse(JSON.stringify(workout.exercises)) // Deep clone
            };
            this.renderWorkoutBuilder();
        }
    }
}

// Add workout builder to main app
WorkoutTracker.prototype.initializeWorkoutBuilder = function() {
    this.workoutBuilder = new WorkoutBuilder(this);
};