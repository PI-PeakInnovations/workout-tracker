// View Templates and Components
WorkoutTracker.prototype.getWorkoutViewHTML = function() {
    const workoutKey = this.getCurrentWorkoutKey();
    const workout = this.workoutData[workoutKey];
    const today = this.formatDate(this.currentDate);
    const todayHistory = this.workoutHistory[today];

    return `
        <div class="view workout-view">
            ${this.getNavigationHTML()}
            
            <div class="workout-header">
                <div class="date-navigation">
                    <button data-action="prev-day" class="nav-btn">‹</button>
                    <div class="date-display">${this.formatDisplayDate(this.currentDate)}</div>
                    <button data-action="next-day" class="nav-btn">›</button>
                </div>
                <h1 class="workout-title">${workout?.name || 'No Workout'}</h1>
                ${todayHistory ? '<div class="completion-badge">✓ Completed</div>' : ''}
            </div>

            <div class="workout-content">
                ${workout ? this.getExerciseListHTML(workout.exercises, workoutKey) : this.getNoWorkoutHTML()}
            </div>

            <div class="workout-actions">
                <button data-action="save-workout" class="primary-btn">Save Progress</button>
                <button data-navigate="/builder" class="secondary-btn">Edit Workout</button>
            </div>
        </div>
    `;
};

WorkoutTracker.prototype.getBuilderViewHTML = function() {
    const availableWorkouts = Object.keys(this.workoutData);
    
    return `
        <div class="view builder-view">
            ${this.getNavigationHTML()}
            
            <div class="builder-header">
                <h1>Workout Builder</h1>
                <button data-action="create-new-workout" class="primary-btn">+ New Workout</button>
            </div>

            <div class="builder-content">
                <!-- Workout Builder Area -->
                <div class="workout-builder-section">
                    <h2>Build Your Workout</h2>
                    <div id="workoutBuilderContainer">
                        <div class="empty-builder-state">
                            <p>Create a new workout or select one to edit from your library below.</p>
                        </div>
                    </div>
                </div>

                <!-- Workout Library -->
                <div class="workout-library-section">
                    <h2>Your Workouts</h2>
                    <div class="workout-grid">
                        ${availableWorkouts.map(workoutId => this.getWorkoutCardHTML(workoutId)).join('')}
                    </div>
                </div>

                <!-- Exercise Library -->
                <div class="exercise-library-section">
                    <h2>Exercise Library</h2>
                    <div class="exercise-filters">
                        <button class="filter-btn active" data-filter-category="all">All</button>
                        <button class="filter-btn" data-filter-category="TRX">TRX</button>
                        <button class="filter-btn" data-filter-category="Ring">Rings</button>
                        <button class="filter-btn" data-filter-category="Parallette">Parallettes</button>
                        <button class="filter-btn" data-filter-category="Pull-up">Pull-up Bar</button>
                        <button class="filter-btn" data-filter-category="Dumbbell">Dumbbells</button>
                        <button class="filter-btn" data-filter-category="Bodyweight">Bodyweight</button>
                    </div>
                    <div class="exercise-library-grid" id="exerciseLibraryGrid">
                        <!-- Exercises will be loaded by workout builder -->
                    </div>
                </div>
            </div>
        </div>
    `;
};

WorkoutTracker.prototype.getHistoryViewHTML = function() {
    const stats = this.historyCalendar?.generateStatsOverview() || {};
    const viewMode = this.historyCalendar?.viewMode || 'calendar';
    
    return `
        <div class="view history-view">
            ${this.getNavigationHTML()}
            
            <div class="history-header">
                <h1>Workout History</h1>
                <div class="view-toggle">
                    <button class="toggle-btn ${viewMode === 'calendar' ? 'active' : ''}" data-action="toggle-history-view">📅 Calendar</button>
                    <button class="toggle-btn ${viewMode === 'list' ? 'active' : ''}" data-action="toggle-history-view">📋 List</button>
                </div>
            </div>

            <div class="stats-overview">
                <div class="stat-card">
                    <div class="stat-number">${stats.totalWorkouts || 0}</div>
                    <div class="stat-label">Total Workouts</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.currentStreak || 0}</div>
                    <div class="stat-label">Current Streak</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.totalSets || 0}</div>
                    <div class="stat-label">Sets Completed</div>
                </div>
                <div class="stat-card">
                    <div class="stat-number">${stats.avgWorkoutsPerWeek || 0}</div>
                    <div class="stat-label">Per Week</div>
                </div>
            </div>

            <div class="history-content">
                ${viewMode === 'calendar' ? `
                    <div class="calendar-section">
                        ${this.historyCalendar?.generateCalendarHTML() || '<div class="loading">Loading calendar...</div>'}
                    </div>
                    
                    ${this.historyCalendar?.selectedDate ? `
                        <div class="selected-date-section">
                            ${this.historyCalendar.generateSelectedDateDetailHTML()}
                        </div>
                    ` : ''}
                ` : `
                    <div class="history-list-section">
                        ${this.historyCalendar?.generateHistoryListHTML() || '<div class="loading">Loading history...</div>'}
                    </div>
                `}
            </div>
        </div>
    `;
};

WorkoutTracker.prototype.getProgressViewHTML = function() {
    return `
        <div class="view progress-view">
            ${this.getNavigationHTML()}
            
            <div class="progress-header">
                <h1>Progress Tracking</h1>
                <div class="progress-filters">
                    <button class="filter-btn active" data-filter="overview">Overview</button>
                    <button class="filter-btn" data-filter="strength">Strength</button>
                    <button class="filter-btn" data-filter="volume">Volume</button>
                </div>
            </div>

            <div class="progress-content">
                <div class="stats-overview">
                    ${this.getStatsOverviewHTML()}
                </div>
                
                <div class="progress-charts">
                    <div class="chart-container">
                        <canvas id="strengthChart"></canvas>
                    </div>
                    <div class="chart-container">
                        <canvas id="volumeChart"></canvas>
                    </div>
                </div>

                <div class="personal-records">
                    <h2>Personal Records</h2>
                    ${this.getPersonalRecordsHTML()}
                </div>
            </div>
        </div>
    `;
};

WorkoutTracker.prototype.getSettingsViewHTML = function() {
    return `
        <div class="view settings-view">
            ${this.getNavigationHTML()}
            
            <div class="settings-header">
                <h1>Settings</h1>
            </div>

            <div class="settings-content">
                <div class="settings-section">
                    <h2>Appearance</h2>
                    <div class="setting-item">
                        <label>Theme</label>
                        <button data-action="toggle-theme" class="setting-btn">
                            ${this.userSettings.theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
                        </button>
                    </div>
                </div>

                <div class="settings-section">
                    <h2>Workout Settings</h2>
                    <div class="setting-item">
                        <label>Default Rest Time</label>
                        <input type="number" value="${this.userSettings.defaultRestTime}" data-setting="defaultRestTime" min="15" max="300">
                        <span>seconds</span>
                    </div>
                    <div class="setting-item">
                        <label>Units</label>
                        <select data-setting="units">
                            <option value="metric" ${this.userSettings.units === 'metric' ? 'selected' : ''}>Metric (kg)</option>
                            <option value="imperial" ${this.userSettings.units === 'imperial' ? 'selected' : ''}>Imperial (lbs)</option>
                        </select>
                    </div>
                </div>

                <div class="settings-section">
                    <h2>Data Management</h2>
                    <div class="setting-item">
                        <button data-action="export-data" class="setting-btn">Export Data</button>
                    </div>
                    <div class="setting-item">
                        <button data-action="import-data" class="setting-btn">Import Data</button>
                        <input type="file" id="importFile" accept=".json" style="display: none;">
                    </div>
                    <div class="setting-item">
                        <button data-action="clear-data" class="setting-btn danger">Clear All Data</button>
                    </div>
                </div>
            </div>
        </div>
    `;
};

WorkoutTracker.prototype.getNavigationHTML = function() {
    const routes = [
        { path: '/workout', icon: '💪', label: 'Workout' },
        { path: '/builder', icon: '🔧', label: 'Builder' },
        { path: '/history', icon: '📊', label: 'History' },
        { path: '/progress', icon: '📈', label: 'Progress' },
        { path: '/settings', icon: '⚙️', label: 'Settings' }
    ];

    return `
        <nav class="bottom-nav">
            ${routes.map(route => `
                <button data-navigate="${route.path}" class="nav-item ${this.router.getCurrentPath() === route.path ? 'active' : ''}">
                    <span class="nav-icon">${route.icon}</span>
                    <span class="nav-label">${route.label}</span>
                </button>
            `).join('')}
        </nav>
    `;
};

WorkoutTracker.prototype.getExerciseListHTML = function(exercises, workoutKey) {
    return exercises.map((exercise, index) => `
        <div class="exercise-card" data-exercise-index="${index}">
            <div class="exercise-header">
                <h3>${exercise.name}</h3>
                <div class="exercise-actions">
                    <button data-action="remove-exercise" data-workout-id="${workoutKey}" data-exercise-index="${index}">×</button>
                </div>
            </div>
            <div class="sets-container">
                ${this.getSetsHTML(exercise, index)}
            </div>
            <div class="exercise-notes">
                <input type="text" placeholder="Notes..." value="${exercise.notes || ''}" data-action="update-notes" data-exercise-index="${index}">
            </div>
        </div>
    `).join('');
};

WorkoutTracker.prototype.getSetsHTML = function(exercise, exerciseIndex) {
    const sets = exercise.sets ? exercise.sets.split('x') : ['3', '10'];
    const numSets = parseInt(sets[0]) || 3;
    const targetReps = parseInt(sets[1]) || exercise.targetReps || 10;
    
    return Array.from({ length: numSets }, (_, setIndex) => {
        const completed = exercise.completedSets && exercise.completedSets[setIndex];
        return `
            <div class="set-item ${completed ? 'completed' : ''}">
                <span class="set-number">${setIndex + 1}</span>
                <input type="number" class="reps-input" value="${completed ? completed.reps : targetReps}" placeholder="Reps" data-action="update-reps" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}">
                ${exercise.type === 'weighted' ? `
                    <input type="number" class="weight-input" value="${completed ? completed.weight : exercise.weight || 0}" placeholder="Weight" data-action="update-weight" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}">
                    <span class="weight-unit">${this.userSettings.units === 'metric' ? 'kg' : 'lbs'}</span>
                ` : ''}
                <button data-action="complete-set" data-exercise-index="${exerciseIndex}" data-set-index="${setIndex}" class="complete-btn">
                    ${completed ? '✓' : '○'}
                </button>
            </div>
        `;
    }).join('');
};

// Helper methods for generating HTML components
WorkoutTracker.prototype.formatDisplayDate = function(date) {
    return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

WorkoutTracker.prototype.getNoWorkoutHTML = function() {
    return `
        <div class="empty-state">
            <h2>No workout scheduled for today</h2>
            <p>Create a new workout or assign one from your library.</p>
            <button data-navigate="/builder" class="primary-btn">Create Workout</button>
        </div>
    `;
};

WorkoutTracker.prototype.getRecentHistory = function() {
    const entries = Object.entries(this.workoutHistory)
        .map(([date, workout]) => ({ date, ...workout }))
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .slice(0, 10);
    return entries;
};

// Placeholder methods for complex components
WorkoutTracker.prototype.getWorkoutCardHTML = function(workoutId) {
    const workout = this.workoutData[workoutId];
    if (!workout) return '';
    
    const exerciseCount = workout.exercises ? workout.exercises.length : 0;
    const isCustom = workout.isCustom || false;
    
    return `
        <div class="workout-card" data-workout-id="${workoutId}">
            <div class="workout-card-header">
                <h3>${workout.name}</h3>
                ${isCustom ? '<span class="custom-badge">Custom</span>' : ''}
            </div>
            <div class="workout-card-info">
                <span class="exercise-count">${exerciseCount} exercises</span>
                <span class="workout-type">${workout.category || 'Mixed'}</span>
            </div>
            <div class="workout-card-exercises">
                ${workout.exercises ? workout.exercises.slice(0, 3).map(ex => ex.name).join(' • ') : ''}
                ${exerciseCount > 3 ? ' • ...' : ''}
            </div>
            <div class="workout-card-actions">
                <button data-action="edit-workout" data-workout-id="${workoutId}" class="secondary-btn">Edit</button>
                <button data-action="assign-workout" data-workout-id="${workoutId}" class="primary-btn">Use Today</button>
            </div>
        </div>
    `;
};

WorkoutTracker.prototype.getExerciseFiltersHTML = function() {
    return '<div class="exercise-filters">Filters</div>';
};

WorkoutTracker.prototype.getExerciseLibraryHTML = function() {
    return '<div class="exercise-library">Exercise Library</div>';
};

WorkoutTracker.prototype.getCalendarHTML = function() {
    return '<div class="calendar">Calendar</div>';
};

WorkoutTracker.prototype.getHistoryEntryHTML = function(entry) {
    return `<div class="history-entry">${entry.date}</div>`;
};

WorkoutTracker.prototype.getStatsOverviewHTML = function() {
    return '<div class="stats-overview">Stats</div>';
};

WorkoutTracker.prototype.getPersonalRecordsHTML = function() {
    return '<div class="personal-records">Records</div>';
};