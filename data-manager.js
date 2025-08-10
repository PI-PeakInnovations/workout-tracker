// Data Management with IndexedDB fallback to localStorage
class DataManager {
    constructor() {
        this.dbName = 'WorkoutTrackerDB';
        this.dbVersion = 1;
        this.db = null;
        this.initialized = false;
    }

    async init() {
        if (this.initialized) return;
        
        try {
            this.db = await this.openIndexedDB();
            this.initialized = true;
        } catch (error) {
            console.warn('IndexedDB not available, falling back to localStorage:', error);
            this.initialized = true;
        }
    }

    async openIndexedDB() {
        return new Promise((resolve, reject) => {
            if (!window.indexedDB) {
                reject(new Error('IndexedDB not supported'));
                return;
            }

            const request = indexedDB.open(this.dbName, this.dbVersion);

            request.onerror = () => reject(request.error);
            request.onsuccess = () => resolve(request.result);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                
                // Create object stores
                if (!db.objectStoreNames.contains('workouts')) {
                    db.createObjectStore('workouts', { keyPath: 'id' });
                }
                if (!db.objectStoreNames.contains('history')) {
                    db.createObjectStore('history', { keyPath: 'date' });
                }
                if (!db.objectStoreNames.contains('settings')) {
                    db.createObjectStore('settings', { keyPath: 'key' });
                }
            };
        });
    }

    async save(key, data) {
        await this.init();
        
        if (this.db) {
            return this.saveToIndexedDB(key, data);
        } else {
            return this.saveToLocalStorage(key, data);
        }
    }

    async load(key) {
        await this.init();
        
        if (this.db) {
            return this.loadFromIndexedDB(key);
        } else {
            return this.loadFromLocalStorage(key);
        }
    }

    async saveToIndexedDB(key, data) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['workouts'], 'readwrite');
            const store = transaction.objectStore('workouts');
            const request = store.put({ id: key, data: data, timestamp: Date.now() });

            request.onsuccess = () => resolve();
            request.onerror = () => reject(request.error);
        });
    }

    async loadFromIndexedDB(key) {
        return new Promise((resolve, reject) => {
            const transaction = this.db.transaction(['workouts'], 'readonly');
            const store = transaction.objectStore('workouts');
            const request = store.get(key);

            request.onsuccess = () => {
                const result = request.result;
                resolve(result ? result.data : null);
            };
            request.onerror = () => reject(request.error);
        });
    }

    saveToLocalStorage(key, data) {
        try {
            localStorage.setItem(`workout-tracker-${key}`, JSON.stringify({
                data: data,
                timestamp: Date.now()
            }));
            return Promise.resolve();
        } catch (error) {
            return Promise.reject(error);
        }
    }

    loadFromLocalStorage(key) {
        try {
            const stored = localStorage.getItem(`workout-tracker-${key}`);
            if (stored) {
                const parsed = JSON.parse(stored);
                return Promise.resolve(parsed.data);
            }
            return Promise.resolve(null);
        } catch (error) {
            return Promise.reject(error);
        }
    }

    async exportData() {
        const data = {
            workoutData: await this.load('workoutData'),
            workoutHistory: await this.load('workoutHistory'),
            workoutProgress: await this.load('workoutProgress'),
            userSettings: await this.load('userSettings'),
            exportedAt: new Date().toISOString()
        };
        return data;
    }

    async importData(data) {
        if (data.workoutData) await this.save('workoutData', data.workoutData);
        if (data.workoutHistory) await this.save('workoutHistory', data.workoutHistory);
        if (data.workoutProgress) await this.save('workoutProgress', data.workoutProgress);
        if (data.userSettings) await this.save('userSettings', data.userSettings);
    }

    async clearAllData() {
        if (this.db) {
            const transaction = this.db.transaction(['workouts'], 'readwrite');
            const store = transaction.objectStore('workouts');
            await store.clear();
        } else {
            const keys = Object.keys(localStorage).filter(key => key.startsWith('workout-tracker-'));
            keys.forEach(key => localStorage.removeItem(key));
        }
    }
}