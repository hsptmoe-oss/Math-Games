const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');

if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

function copyRecursive(src, dest) {
    const stats = fs.statSync(src);
    if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
        fs.readdirSync(src).forEach(child => {
            if (child === 'node_modules' || child === 'www' || child === 'android' || child === '.git') return;
            copyRecursive(path.join(src, child), path.join(dest, child));
        });
    } else {
        fs.copyFileSync(src, dest);
    }
}

// Copy needed web assets
['index.html', 'style.css', 'manifest.json', 'sw.js'].forEach(file => {
    const p = path.join(srcDir, file);
    if (fs.existsSync(p)) {
        fs.copyFileSync(p, path.join(destDir, file));
    }
});

if (fs.existsSync(path.join(srcDir, 'js'))) {
    copyRecursive(path.join(srcDir, 'js'), path.join(destDir, 'js'));
}

if (fs.existsSync(path.join(srcDir, 'icons'))) {
    copyRecursive(path.join(srcDir, 'icons'), path.join(destDir, 'icons'));
}

console.log('Successfully prepared www/ assets for Capacitor Android build!');
