// Workout History and Calendar Implementation
class HistoryCalendar {
    constructor(app) {
        this.app = app;
        this.currentMonth = new Date();
        this.selectedDate = null;
        this.viewMode = 'calendar'; // 'calendar' or 'list'
    }

    generateCalendarHTML() {
        const firstDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth(), 1);
        const lastDay = new Date(this.currentMonth.getFullYear(), this.currentMonth.getMonth() + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];

        let calendarHTML = `
            <div class="calendar-widget">
                <div class="calendar-header">
                    <button class="nav-btn" data-action="prev-month">‹</button>
                    <h3>${monthNames[this.currentMonth.getMonth()]} ${this.currentMonth.getFullYear()}</h3>
                    <button class="nav-btn" data-action="next-month">›</button>
                </div>
                <div class="calendar-grid">
                    <div class="calendar-day-names">
                        <div class="day-name">Sun</div>
                        <div class="day-name">Mon</div>
                        <div class="day-name">Tue</div>
                        <div class="day-name">Wed</div>
                        <div class="day-name">Thu</div>
                        <div class="day-name">Fri</div>
                        <div class="day-name">Sat</div>
                    </div>
                    <div class="calendar-days">
        `;

        const currentDate = new Date(startDate);
        for (let week = 0; week < 6; week++) {
            for (let day = 0; day < 7; day++) {
                const dateStr = this.formatDate(currentDate);
                const workoutData = this.app.workoutHistory[dateStr];
                const isCurrentMonth = currentDate.getMonth() === this.currentMonth.getMonth();
                const isToday = this.isToday(currentDate);
                const isSelected = this.selectedDate && this.formatDate(this.selectedDate) === dateStr;

                calendarHTML += `
                    <div class="calendar-day ${!isCurrentMonth ? 'other-month' : ''} 
                                              ${isToday ? 'today' : ''}
                                              ${isSelected ? 'selected' : ''}
                                              ${workoutData ? 'has-workout' : ''}"
                         data-date="${dateStr}"
                         data-action="select-date">
                        <div class="day-number">${currentDate.getDate()}</div>
                        ${workoutData ? `
                            <div class="workout-indicator">
                                <div class="workout-dot"></div>
                                <div class="exercise-count">${workoutData.exercises ? workoutData.exercises.length : 0}</div>
                            </div>
                        ` : ''}
                    </div>
                `;
                currentDate.setDate(currentDate.getDate() + 1);
            }
        }

        calendarHTML += `
                    </div>
                </div>
            </div>
        `;

        return calendarHTML;
    }

    generateHistoryListHTML() {
        const sortedHistory = Object.entries(this.app.workoutHistory)
            .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
            .slice(0, 50); // Show last 50 workouts

        if (sortedHistory.length === 0) {
            return `
                <div class="empty-history">
                    <div class="empty-icon">📊</div>
                    <h3>No workout history yet</h3>
                    <p>Complete some workouts to see your progress here!</p>
                </div>
            `;
        }

        return `
            <div class="history-list">
                ${sortedHistory.map(([date, workout]) => this.generateHistoryEntryHTML(date, workout)).join('')}
            </div>
        `;
    }

    generateHistoryEntryHTML(date, workout) {
        const workoutDate = new Date(date);
        const dayName = workoutDate.toLocaleDateString('en-US', { weekday: 'long' });
        const formattedDate = workoutDate.toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        });

        const totalSets = workout.exercises?.reduce((total, ex) => {
            return total + (ex.completedSets?.length || 0);
        }, 0) || 0;

        const completedSets = workout.exercises?.reduce((total, ex) => {
            return total + (ex.completedSets?.filter(set => set?.completed)?.length || 0);
        }, 0) || 0;

        const completionRate = totalSets > 0 ? Math.round((completedSets / totalSets) * 100) : 0;

        return `
            <div class="history-entry" data-date="${date}" data-action="view-workout-detail">
                <div class="history-date">
                    <div class="day-name">${dayName}</div>
                    <div class="date">${formattedDate}</div>
                </div>
                <div class="history-workout">
                    <div class="workout-name">${workout.workoutId ? this.app.workoutData[workout.workoutId]?.name || 'Unknown Workout' : 'Custom Workout'}</div>
                    <div class="workout-stats">
                        <span class="exercise-count">${workout.exercises?.length || 0} exercises</span>
                        <span class="set-count">${completedSets}/${totalSets} sets</span>
                        <span class="completion-rate ${completionRate >= 80 ? 'high' : completionRate >= 50 ? 'medium' : 'low'}">${completionRate}%</span>
                    </div>
                    ${workout.duration ? `<div class="workout-duration">${this.formatDuration(workout.duration)}</div>` : ''}
                </div>
                <div class="history-actions">
                    <button data-action="repeat-workout" data-date="${date}" class="repeat-btn">🔄</button>
                </div>
            </div>
        `;
    }

    generateSelectedDateDetailHTML() {
        if (!this.selectedDate) return '';
        
        const dateStr = this.formatDate(this.selectedDate);
        const workoutData = this.app.workoutHistory[dateStr];
        
        if (!workoutData) {
            return `
                <div class="selected-date-detail">
                    <h3>${this.selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                    <p>No workout recorded for this date.</p>
                    <button data-action="create-workout-for-date" data-date="${dateStr}" class="primary-btn">Add Workout</button>
                </div>
            `;
        }

        return `
            <div class="selected-date-detail">
                <h3>${this.selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</h3>
                <div class="workout-detail">
                    <h4>${workoutData.workoutId ? this.app.workoutData[workoutData.workoutId]?.name || 'Unknown Workout' : 'Custom Workout'}</h4>
                    ${workoutData.exercises?.map((exercise, index) => `
                        <div class="exercise-summary">
                            <div class="exercise-name">${exercise.name}</div>
                            <div class="sets-summary">
                                ${exercise.completedSets?.map((set, setIndex) => `
                                    <span class="set-badge ${set?.completed ? 'completed' : 'incomplete'}">
                                        ${set?.reps || exercise.targetReps || 0}${exercise.type === 'weighted' ? `x${set?.weight || exercise.weight || '0'}` : ''}
                                    </span>
                                `).join('') || `<span class="set-badge incomplete">${exercise.sets || '3x10'}</span>`}
                            </div>
                        </div>
                    `).join('') || '<p>No exercises recorded.</p>'}
                </div>
                <div class="detail-actions">
                    <button data-action="repeat-workout" data-date="${dateStr}" class="secondary-btn">Repeat Workout</button>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-action="prev-month"]')) {
                this.changeMonth(-1);
            }
            if (e.target.matches('[data-action="next-month"]')) {
                this.changeMonth(1);
            }
            if (e.target.matches('[data-action="select-date"]')) {
                const dateStr = e.target.getAttribute('data-date');
                this.selectedDate = new Date(dateStr);
                this.app.render();
            }
            if (e.target.matches('[data-action="toggle-history-view"]')) {
                this.viewMode = this.viewMode === 'calendar' ? 'list' : 'calendar';
                this.app.render();
            }
            if (e.target.matches('[data-action="repeat-workout"]')) {
                const dateStr = e.target.getAttribute('data-date');
                this.repeatWorkout(dateStr);
            }
            if (e.target.matches('[data-action="view-workout-detail"]')) {
                const dateStr = e.target.getAttribute('data-date');
                this.selectedDate = new Date(dateStr);
                this.viewMode = 'calendar';
                this.app.render();
            }
        });
    }

    changeMonth(direction) {
        this.currentMonth.setMonth(this.currentMonth.getMonth() + direction);
        this.app.render();
    }

    repeatWorkout(dateStr) {
        const workoutData = this.app.workoutHistory[dateStr];
        if (!workoutData) return;

        // Copy the workout to today
        const today = this.app.formatDate(new Date());
        const workoutKey = this.app.getCurrentWorkoutKey();
        
        // Create a fresh copy of the exercises without completed sets
        const freshExercises = workoutData.exercises.map(exercise => ({
            ...exercise,
            completedSets: []
        }));

        this.app.workoutData[workoutKey] = {
            name: workoutData.workoutId ? this.app.workoutData[workoutData.workoutId]?.name || 'Repeated Workout' : 'Repeated Workout',
            exercises: freshExercises
        };

        this.app.saveData();
        this.app.router.navigate('/workout');
        
        // Show success message
        this.showMessage('Workout copied to today!', 'success');
    }

    showMessage(message, type = 'info') {
        const messageEl = document.createElement('div');
        messageEl.className = `message ${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: ${type === 'success' ? 'var(--success-color)' : 'var(--primary-color)'};
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

    formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    isToday(date) {
        const today = new Date();
        return date.toDateString() === today.toDateString();
    }

    formatDuration(milliseconds) {
        const minutes = Math.floor(milliseconds / (1000 * 60));
        if (minutes < 60) {
            return `${minutes}m`;
        } else {
            const hours = Math.floor(minutes / 60);
            const mins = minutes % 60;
            return `${hours}h ${mins}m`;
        }
    }

    // Generate statistics for the overview
    generateStatsOverview() {
        const history = this.app.workoutHistory;
        const entries = Object.entries(history);
        
        if (entries.length === 0) {
            return {
                totalWorkouts: 0,
                totalExercises: 0,
                totalSets: 0,
                avgWorkoutsPerWeek: 0,
                currentStreak: 0,
                longestStreak: 0
            };
        }

        const totalWorkouts = entries.length;
        const totalExercises = entries.reduce((sum, [_, workout]) => sum + (workout.exercises?.length || 0), 0);
        const totalSets = entries.reduce((sum, [_, workout]) => {
            return sum + (workout.exercises?.reduce((exerciseSum, exercise) => {
                return exerciseSum + (exercise.completedSets?.filter(set => set?.completed)?.length || 0);
            }, 0) || 0);
        }, 0);

        // Calculate average workouts per week
        const sortedDates = entries.map(([date]) => new Date(date)).sort((a, b) => a - b);
        const firstDate = sortedDates[0];
        const lastDate = sortedDates[sortedDates.length - 1];
        const daysDiff = Math.max(1, Math.ceil((lastDate - firstDate) / (1000 * 60 * 60 * 24)));
        const avgWorkoutsPerWeek = Math.round((totalWorkouts / daysDiff) * 7 * 10) / 10;

        // Calculate streaks
        const { currentStreak, longestStreak } = this.calculateStreaks(history);

        return {
            totalWorkouts,
            totalExercises,
            totalSets,
            avgWorkoutsPerWeek,
            currentStreak,
            longestStreak
        };
    }

    calculateStreaks(history) {
        const sortedDates = Object.keys(history)
            .map(date => new Date(date))
            .sort((a, b) => b - a); // Most recent first

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;
        
        const today = new Date();
        let checkDate = new Date(today);
        
        // Check current streak
        for (let i = 0; i < 30; i++) { // Check last 30 days
            const dateStr = this.formatDate(checkDate);
            if (history[dateStr]) {
                if (i === 0 || i === currentStreak) {
                    currentStreak++;
                } else {
                    break;
                }
            } else if (i === 0) {
                // No workout today, check yesterday
                checkDate.setDate(checkDate.getDate() - 1);
                continue;
            } else {
                break;
            }
            checkDate.setDate(checkDate.getDate() - 1);
        }
        
        // Calculate longest streak
        const allDates = sortedDates.map(date => this.formatDate(date)).sort();
        for (let i = 0; i < allDates.length; i++) {
            tempStreak = 1;
            for (let j = i + 1; j < allDates.length; j++) {
                const prevDate = new Date(allDates[j - 1]);
                const currDate = new Date(allDates[j]);
                const dayDiff = Math.ceil((currDate - prevDate) / (1000 * 60 * 60 * 24));
                
                if (dayDiff === 1) {
                    tempStreak++;
                } else {
                    break;
                }
            }
            longestStreak = Math.max(longestStreak, tempStreak);
        }
        
        return { currentStreak, longestStreak };
    }
}

// Add to main app
WorkoutTracker.prototype.initializeHistoryCalendar = function() {
    if (!this.historyCalendar) {
        this.historyCalendar = new HistoryCalendar(this);
        this.historyCalendar.setupEventListeners();
    }
};