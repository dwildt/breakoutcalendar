// Mock da classe RecordsManager para teste
class RecordsManager {
    constructor() {
        this.records = this.loadRecords();
    }
    
    loadRecords() {
        const saved = localStorage.getItem('breakout-calendar-records');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (_e) {
                return [];
            }
        }
        return [];
    }
    
    saveRecords() {
        localStorage.setItem('breakout-calendar-records', JSON.stringify(this.records));
    }
    
    addRecord(playerName, score, blocksDestroyed) {
        const record = {
            playerName: playerName.toUpperCase(),
            score: score,
            blocksDestroyed: blocksDestroyed,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
        const isNewRecord = this.isNewRecord(record);
        
        this.records.push(record);
        
        this.records.sort((a, b) => {
            if (b.score !== a.score) {
                return b.score - a.score;
            }
            return b.blocksDestroyed - a.blocksDestroyed;
        });
        
        this.records = this.records.slice(0, 10);
        
        this.saveRecords();
        this.displayRecords();
        
        return isNewRecord;
    }
    
    isNewRecord(newRecord) {
        if (this.records.length === 0) return true;
        
        // Check if this record would be in the sorted list before calling
        const wouldBeFirst = this.records.length === 0 || 
                           newRecord.score > this.records[0].score ||
                           (newRecord.score === this.records[0].score && 
                            newRecord.blocksDestroyed > this.records[0].blocksDestroyed);
        
        return wouldBeFirst;
    }
    
    displayRecords() {
        const recordsList = document.getElementById('recordsList');
        if (!recordsList) return;
        
        recordsList.innerHTML = '';
        
        if (this.records.length === 0) {
            const noRecords = document.createElement('div');
            noRecords.textContent = 'Nenhum recorde ainda';
            recordsList.appendChild(noRecords);
            return;
        }
        
        this.records.forEach((record, index) => {
            const recordItem = document.createElement('div');
            recordItem.className = 'record-item';
            recordItem.innerHTML = `${index + 1}° ${record.playerName} ${record.score} pts ${record.blocksDestroyed} blocos`;
            recordsList.appendChild(recordItem);
        });
    }
    
    getTopScore() {
        if (this.records.length === 0) return 0;
        return this.records[0].score;
    }
    
    getPlayerBest(playerName) {
        const playerRecords = this.records.filter(
            record => record.playerName === playerName.toUpperCase()
        );
        
        if (playerRecords.length === 0) return null;
        return playerRecords[0];
    }
    
    clearRecords() {
        if (confirm('Tem certeza que deseja limpar todos os recordes?')) {
            this.records = [];
            this.saveRecords();
            this.displayRecords();
        }
    }
}

const recordsManager = new RecordsManager();

function saveRecord(playerName, score, blocksDestroyed) {
    if (!playerName || playerName.trim().length === 0) {
        playerName = 'AAA';
    }
    
    const isNewRecord = recordsManager.addRecord(playerName, score, blocksDestroyed);
    
    if (isNewRecord) {
        setTimeout(() => {
            alert('Novo recorde!');
        }, 500);
    }
}

describe('Records Manager', () => {
    let recordsManager;
    
    beforeEach(() => {
        localStorage.clear();
        recordsManager = new RecordsManager();
        document.body.innerHTML = '<div id="recordsList"></div>';
    });

    test('should initialize with empty records', () => {
        expect(recordsManager.records).toEqual([]);
    });

    test('should load records from localStorage', () => {
        const mockRecords = [
            { playerName: 'ABC', score: 100, blocksDestroyed: 5 }
        ];
        localStorage.setItem('breakout-calendar-records', JSON.stringify(mockRecords));
        
        const manager = new RecordsManager();
        expect(manager.records).toEqual(mockRecords);
    });

    test('should handle corrupted localStorage data', () => {
        localStorage.setItem('breakout-calendar-records', 'invalid json');
        
        const manager = new RecordsManager();
        expect(manager.records).toEqual([]);
    });

    test('should add new record', () => {
        const isNew = recordsManager.addRecord('ABC', 100, 5);
        
        expect(recordsManager.records).toHaveLength(1);
        expect(recordsManager.records[0]).toMatchObject({
            playerName: 'ABC',
            score: 100,
            blocksDestroyed: 5
        });
        expect(isNew).toBe(true);
    });

    test('should sort records by score descending', () => {
        recordsManager.addRecord('LOW', 50, 3);
        recordsManager.addRecord('HIGH', 150, 8);
        recordsManager.addRecord('MID', 100, 5);
        
        expect(recordsManager.records[0].playerName).toBe('HIGH');
        expect(recordsManager.records[1].playerName).toBe('MID');
        expect(recordsManager.records[2].playerName).toBe('LOW');
    });

    test('should sort by blocks destroyed when scores are equal', () => {
        recordsManager.addRecord('LOW', 100, 3);
        recordsManager.addRecord('HIGH', 100, 8);
        
        expect(recordsManager.records[0].playerName).toBe('HIGH');
        expect(recordsManager.records[1].playerName).toBe('LOW');
    });

    test('should limit records to top 10', () => {
        for (let i = 1; i <= 15; i++) {
            recordsManager.addRecord(`P${i.toString().padStart(2, '0')}`, i * 10, i);
        }
        
        expect(recordsManager.records).toHaveLength(10);
        expect(recordsManager.records[0].score).toBe(150);
        expect(recordsManager.records[9].score).toBe(60);
    });

    test('should identify new record correctly', () => {
        recordsManager.addRecord('OLD', 100, 5);
        
        const newRecord = { playerName: 'NEW', score: 150, blocksDestroyed: 8 };
        const isNew = recordsManager.isNewRecord(newRecord);
        
        expect(isNew).toBe(true);
    });

    test('should identify non-record correctly', () => {
        recordsManager.addRecord('HIGH', 150, 8);
        
        const newRecord = { playerName: 'LOW', score: 100, blocksDestroyed: 5 };
        const isNew = recordsManager.isNewRecord(newRecord);
        
        expect(isNew).toBe(false);
    });

    test('should get top score', () => {
        recordsManager.addRecord('ABC', 100, 5);
        recordsManager.addRecord('DEF', 200, 8);
        
        expect(recordsManager.getTopScore()).toBe(200);
    });

    test('should return 0 for top score when no records', () => {
        expect(recordsManager.getTopScore()).toBe(0);
    });

    test('should get player best record', () => {
        recordsManager.addRecord('ABC', 100, 5);
        recordsManager.addRecord('ABC', 150, 8);
        recordsManager.addRecord('DEF', 120, 6);
        
        const playerBest = recordsManager.getPlayerBest('ABC');
        expect(playerBest.score).toBe(150);
    });

    test('should return null for player with no records', () => {
        const playerBest = recordsManager.getPlayerBest('XYZ');
        expect(playerBest).toBe(null);
    });

    test('should save records to localStorage', () => {
        recordsManager.addRecord('ABC', 100, 5);
        const saved = localStorage.getItem('breakout-calendar-records');
        expect(saved).toContain('"playerName":"ABC"');
    });

    test('should display records in DOM', () => {
        recordsManager.addRecord('ABC', 100, 5);
        recordsManager.displayRecords();
        
        const recordsList = document.getElementById('recordsList');
        expect(recordsList.children.length).toBe(1);
        
        const recordItem = recordsList.children[0];
        expect(recordItem.textContent).toContain('ABC');
        expect(recordItem.textContent).toContain('100');
        expect(recordItem.textContent).toContain('5');
    });

    test('should display no records message when empty', () => {
        recordsManager.displayRecords();
        
        const recordsList = document.getElementById('recordsList');
        expect(recordsList.textContent).toContain('Nenhum recorde');
    });

    test('should clear all records', () => {
        recordsManager.addRecord('ABC', 100, 5);
        confirm.mockReturnValue(true);
        
        recordsManager.clearRecords();
        
        expect(recordsManager.records).toHaveLength(0);
        const saved = localStorage.getItem('breakout-calendar-records');
        expect(saved).toBe('[]');
    });

    test('should not clear records if user cancels', () => {
        recordsManager.addRecord('ABC', 100, 5);
        confirm.mockReturnValue(false);
        
        recordsManager.clearRecords();
        
        expect(recordsManager.records).toHaveLength(1);
    });
});

describe('Global Records Functions', () => {
    beforeEach(() => {
        document.body.innerHTML = '<div id="recordsList"></div>';
        global.recordsManager = new RecordsManager();
    });

    test('should save record with default name if empty', () => {
        const spy = jest.spyOn(recordsManager, 'addRecord');
        
        saveRecord('', 100, 5);
        
        expect(spy).toHaveBeenCalledWith('AAA', 100, 5);
    });

    test('should save record with provided name', () => {
        const spy = jest.spyOn(recordsManager, 'addRecord');
        
        saveRecord('ABC', 100, 5);
        
        expect(spy).toHaveBeenCalledWith('ABC', 100, 5);
    });

    test('should show alert for new record', (done) => {
        jest.spyOn(recordsManager, 'addRecord').mockReturnValue(true);
        
        saveRecord('ABC', 100, 5);
        
        setTimeout(() => {
            expect(alert).toHaveBeenCalled();
            done();
        }, 600);
    });
});