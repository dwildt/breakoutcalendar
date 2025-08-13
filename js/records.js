class RecordsManager {
    constructor() {
        this.records = this.loadRecords();
    }
    
    loadRecords() {
        const saved = localStorage.getItem('breakout-calendar-records');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Error loading records:', e);
                return [];
            }
        }
        return [];
    }
    
    saveRecords() {
        try {
            localStorage.setItem('breakout-calendar-records', JSON.stringify(this.records));
        } catch (e) {
            console.error('Error saving records:', e);
        }
    }
    
    addRecord(playerName, score, blocksDestroyed) {
        const record = {
            playerName: playerName.toUpperCase(),
            score: score,
            blocksDestroyed: blocksDestroyed,
            date: new Date().toISOString(),
            timestamp: Date.now()
        };
        
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
        
        return this.isNewRecord(record);
    }
    
    isNewRecord(newRecord) {
        if (this.records.length === 0) return true;
        
        const topRecord = this.records[0];
        return newRecord.score > topRecord.score || 
               (newRecord.score === topRecord.score && newRecord.blocksDestroyed > topRecord.blocksDestroyed);
    }
    
    displayRecords() {
        const recordsList = document.getElementById('recordsList');
        if (!recordsList) return;
        
        recordsList.innerHTML = '';
        
        if (this.records.length === 0) {
            const noRecords = document.createElement('div');
            noRecords.className = 'no-records';
            noRecords.textContent = (typeof getText === 'function' ? getText('noRecords') : null) || 'Nenhum recorde ainda';
            recordsList.appendChild(noRecords);
            return;
        }
        
        this.records.forEach((record, index) => {
            const recordItem = document.createElement('div');
            recordItem.className = 'record-item';
            
            const position = document.createElement('span');
            position.className = 'record-position';
            position.textContent = `${index + 1}°`;
            
            const playerName = document.createElement('span');
            playerName.className = 'record-player';
            playerName.textContent = record.playerName;
            
            const score = document.createElement('span');
            score.className = 'record-score';
            score.textContent = `${record.score} pts`;
            
            const blocks = document.createElement('span');
            blocks.className = 'record-blocks';
            blocks.textContent = `${record.blocksDestroyed} blocos`;
            
            recordItem.appendChild(position);
            recordItem.appendChild(playerName);
            recordItem.appendChild(score);
            recordItem.appendChild(blocks);
            
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
        const message = (typeof getText === 'function' ? getText('confirmClearRecords') : null) || 'Tem certeza que deseja limpar todos os recordes?';
        if (confirm(message)) {
            this.records = [];
            this.saveRecords();
            this.displayRecords();
        }
    }
    
    exportRecords() {
        const data = {
            records: this.records,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `breakout-calendar-records-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        
        URL.revokeObjectURL(url);
    }
    
    importRecords(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.records && Array.isArray(data.records)) {
                    const confirmMessage = (typeof getText === 'function' ? getText('confirmImportRecords') : null) || 'Importar recordes? Isso substituirá os recordes atuais.';
                    if (confirm(confirmMessage)) {
                        this.records = data.records.slice(0, 10);
                        this.saveRecords();
                        this.displayRecords();
                        const successMessage = (typeof getText === 'function' ? getText('recordsImported') : null) || 'Recordes importados com sucesso!';
                        alert(successMessage);
                    }
                } else {
                    throw new Error('Invalid file format');
                }
            } catch (error) {
                const errorMessage = (typeof getText === 'function' ? getText('importError') : null) || 'Erro ao importar recordes. Verifique o arquivo.';
                alert(errorMessage);
                console.error('Import error:', error);
            }
        };
        
        reader.readAsText(file);
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
            const message = (typeof getText === 'function' ? getText('newRecord') : null) || 'Novo recorde! Parabéns!';
            alert(message);
        }, 500);
    }
}

function displayRecords() {
    recordsManager.displayRecords();
}

function clearRecords() {
    recordsManager.clearRecords();
}

function exportRecords() {
    recordsManager.exportRecords();
}

function importRecords() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            recordsManager.importRecords(file);
        }
    };
    input.click();
}