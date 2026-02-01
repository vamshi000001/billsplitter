const fs = require('fs');

function checkBraceBalance(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let balance = 0;
    let lines = content.split('\n');
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i];
        for (let char of line) {
            if (char === '{') balance++;
            if (char === '}') balance--;
        }
        if (balance < 0) {
            console.log(`ERROR: Closing brace without opening at ${filePath}:${i + 1}`);
            balance = 0; // reset to keep going
        }
    }
    if (balance > 0) {
        console.log(`ERROR: ${balance} unclosed opening braces in ${filePath}`);
    }
}

const files = [
    'c:/Users/VAMSHI/Downloads/b tech/b tech/SplitApp/frontend/src/pages/RoomAdminDashboard.jsx',
    'c:/Users/VAMSHI/Downloads/b tech/b tech/SplitApp/frontend/src/pages/RoomMemberDashboard.jsx'
];

files.forEach(checkBraceBalance);
