const fs = require('fs');
const path = require('path');

const srcDir = __dirname;
const destDir = path.join(__dirname, 'www');
const androidAssetsDir = path.join(__dirname, 'android', 'app', 'src', 'main', 'assets', 'public');

function copyRecursive(src, dest) {
    if (!fs.existsSync(src)) return;
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

// Ensure dest dirs exist
[destDir, androidAssetsDir].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Copy to both www and android assets
[destDir, androidAssetsDir].forEach(target => {
    ['index.html', 'style.css', 'manifest.json', 'sw.js'].forEach(file => {
        const p = path.join(srcDir, file);
        if (fs.existsSync(p)) {
            fs.copyFileSync(p, path.join(target, file));
        }
    });

    if (fs.existsSync(path.join(srcDir, 'js'))) {
        copyRecursive(path.join(srcDir, 'js'), path.join(target, 'js'));
    }

    if (fs.existsSync(path.join(srcDir, 'icons'))) {
        copyRecursive(path.join(srcDir, 'icons'), path.join(target, 'icons'));
    }
});

console.log('Successfully prepared web assets for both www and android assets!');
