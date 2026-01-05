export function loadFroamStorage(){
    return JSON.parse(localStorage.getItem('scoreBoard'));
}

export function saveToStorage(scoreBoard){
    localStorage.setItem('scoreBoard', JSON.stringify(scoreBoard));
}

