// Math Games - Complete Curriculum, Multi-Grade Tiers, & 9 Game Modes

// User Profile Avatars
const AVATARS = [
    { id: 'owl', emoji: '🦉', name: 'ទីទុយឆ្លាត (Smart Owl)' },
    { id: 'lion', emoji: '🦁', name: 'ស្តេចតោ (Brave Lion)' },
    { id: 'fox', emoji: '🦊', name: 'កញ្ជ្រោងឆ្លាត (Clever Fox)' },
    { id: 'panda', emoji: '🐼', name: 'ខ្លាឃ្មុំផេនដា (Panda Hero)' },
    { id: 'unicorn', emoji: '🦄', name: 'សេះវេទមន្ត (Magic Unicorn)' },
    { id: 'robot', emoji: '🤖', name: 'មនុស្សយន្ត (Robo-Kid)' }
];

// Difficulty Tiers Definition
const TIERS = [
    { id: 'all', name: 'ទាំងអស់ (All Games)', icon: '🌟', desc: 'បង្ហាញគ្រប់ហ្គេម និងគ្រប់កម្រិត' },
    { id: 'junior', name: 'កុមារតូច (មត្តេយ្យ - ថ្នាក់ទី២)', icon: '🟢', sub: 'វ័យ ៤-៧ ឆ្នាំ', desc: 'រាប់ចំនួន បូកដកងាយៗ ១-២០ ប្រៀបធៀបលេខ រូបភាព' },
    { id: 'mid', name: 'កុមារមធ្យម (ថ្នាក់ទី៣ - ថ្នាក់ទី៤)', icon: '🟡', sub: 'វ័យ ៨-១០ ឆ្នាំ', desc: 'មេគុណ វិធីចែក ប្រភាគ រថភ្លើងលំដាប់ គំរូបារ' },
    { id: 'senior', name: 'កុមារជាន់ខ្ពស់ (ថ្នាក់ទី៥ - ថ្នាក់ទី៦)', icon: '🔴', sub: 'វ័យ ១១-១៣ ឆ្នាំ', desc: 'ភាគរយ ទសភាគ សមីការពីជគណិត ប្រភាគចម្រុះ' }
];

// Achievements / Trophies
const TROPHIES = [
    { id: 'first_win', name: 'ជ័យជម្នះដំបូង', desc: 'ឆ្លើយត្រូវ ១០ សំណួរដំបូង', icon: '🥉' },
    { id: 'speed_demon', name: 'អ្នកគិតលេខល្បឿនផ្លេកបន្ទោរ', desc: 'ទទួលបាន 15+ ពិន្ទុក្នុង Speed Blitz', icon: '⚡' },
    { id: 'monster_slayer', name: 'អ្នកបង្ក្រាបបិសាច', desc: 'ផ្តួលសត្វចម្លែកក្នុង Monster Battle', icon: '⚔️' },
    { id: 'balloon_master', name: 'អ្នកបាញ់ប៉េងប៉ោងឆ្នើម', desc: 'បាញ់ប៉េងប៉ោងបាន 20 គ្រាប់ក្នុងមួយជុំ', icon: '🎈' },
    { id: 'memory_genius', name: 'ខួរក្បាលឆ្លាតវៃ', desc: 'ផ្គូផ្គងសន្លឹកបៀបានជោគជ័យ', icon: '🧠' },
    { id: 'fisherman', name: 'អ្នកស្ទូចត្រីឆ្នើម', desc: 'ស្ទូចត្រីបាន ១០ ក្បាលត្រឹមត្រូវ', icon: '🎣' },
    { id: 'croc_master', name: 'មិត្តភក្តិក្រពើ', desc: 'ប្រៀបធៀបលេខបានត្រឹមត្រូវ ៨ លើក', icon: '🐊' },
    { id: 'train_driver', name: 'អ្នកបើករថភ្លើងគណិត', desc: 'រៀបលំដាប់រថភ្លើងបានជោគជ័យ', icon: '🚂' },
    { id: 'pizza_chef', name: 'កំពូលចុងភៅភីហ្សា', desc: 'ធ្វើភីហ្សាប្រភាគបានយ៉ាងត្រឹមត្រូវ', icon: '🍕' },
    { id: 'streak_10', name: 'កំពូលជាប់គ្នា ១០', desc: 'ឆ្លើយត្រូវជាប់គ្នា 10 សំណួរ', icon: '🔥' },
    { id: 'math_master', name: 'ម្ចាស់ជើងឯកគណិតវិទ្យា', desc: 'ឡើងដល់កម្រិត Level 5', icon: '🏆' }
];

// Utility: Random Integer
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate distinct options containing the correct answer
function generateOptions(correctAnswer, offsetRange = 5) {
    let options = new Set();
    const isDecimal = typeof correctAnswer === 'number' && !Number.isInteger(correctAnswer);
    const ansVal = isDecimal ? parseFloat(correctAnswer.toFixed(1)) : correctAnswer;
    options.add(ansVal);

    let attempts = 0;
    while (options.size < 4 && attempts < 50) {
        attempts++;
        let offset = randInt(1, Math.max(2, offsetRange));
        if (Math.random() > 0.5) offset = -offset;
        
        let wrong = isDecimal ? parseFloat((ansVal + (offset * 0.5)).toFixed(1)) : (ansVal + offset);
        if (wrong >= 0) {
            options.add(wrong);
        }
    }

    let counter = 1;
    while (options.size < 4) {
        options.add(ansVal + counter);
        counter++;
    }

    return Array.from(options).sort(() => Math.random() - 0.5);
}

// 1. SINGAPORE MATH ADVENTURE LEVELS (Grades K to 6)
const LEVELS = [
    { id: 'k', name: 'មត្តេយ្យ', subtitle: 'Kindergarten', tier: 'junior', desc: 'រាប់ចំនួន និងរូបភាព (1-10)', icon: '🍎', color: '#ff6b6b' },
    { id: '1', name: 'ថ្នាក់ទី១', subtitle: 'Grade 1', tier: 'junior', desc: 'បូក/ដក & គំរូតាងរបារ (1-20)', icon: '✏️', color: '#f59e0b' },
    { id: '2', name: 'ថ្នាក់ទី២', subtitle: 'Grade 2', tier: 'junior', desc: 'បូក/ដក & គំរូ Bar Model (1-100)', icon: '📏', color: '#10b981' },
    { id: '3', name: 'ថ្នាក់ទី៣', subtitle: 'Grade 3', tier: 'mid', desc: 'មេគុណ & វិធីចែក (Times Tables)', icon: '✖️', color: '#06b6d4' },
    { id: '4', name: 'ថ្នាក់ទី៤', subtitle: 'Grade 4', tier: 'mid', desc: 'ប្រភាគ (Fractions) & ទសភាគ', icon: '🍕', color: '#8b5cf6' },
    { id: '5', name: 'ថ្នាក់ទី៥', subtitle: 'Grade 5', tier: 'senior', desc: 'ភាគរយ (%) & សមាមាត្រ', icon: '📊', color: '#ec4899' },
    { id: '6', name: 'ថ្នាក់ទី៦', subtitle: 'Grade 6', tier: 'senior', desc: 'ពីជគណិត និងជញ្ជីងសមីការ (x)', icon: '⚖️', color: '#3b82f6' }
];

// Problem Generators with Visual Singapore Math Enhancements
const problemGenerators = {
    'k': () => {
        const count = randInt(2, 9);
        const fruitIcons = ['🍎', '🍌', '🍓', '🎈', '⭐', '🐱', '🚗', '🦁'];
        const icon = fruitIcons[randInt(0, fruitIcons.length - 1)];
        
        let visualItems = '';
        for (let i = 0; i < count; i++) {
            visualItems += `<span class="count-item bounce-anim" style="animation-delay: ${i * 0.08}s">${icon}</span>`;
        }

        return {
            title: 'រាប់ចំនួនរូបភាព (How many?)',
            visual: `<div class="visual-counting-box">${visualItems}</div>`,
            question: `តើមាន ${icon} ចំនួនប៉ុន្មាន?`,
            answer: count,
            options: generateOptions(count, 3)
        };
    },
    '1': () => {
        const isAdd = Math.random() > 0.45;
        if (isAdd) {
            const a = randInt(2, 10);
            const b = randInt(1, 10);
            const ans = a + b;
            return {
                title: 'គំរូបូកចំនួន (Singapore Number Bonds)',
                visual: `
                    <div class="bar-model-container">
                        <div class="bar-row">
                            <div class="bar-part part-a" style="flex: ${a}">${a}</div>
                            <div class="bar-part part-b" style="flex: ${b}">${b}</div>
                        </div>
                        <div class="bar-total-label">សរុប = ?</div>
                    </div>
                `,
                question: `${a} + ${b} = ?`,
                answer: ans,
                options: generateOptions(ans, 4)
            };
        } else {
            const a = randInt(8, 18);
            const b = randInt(2, a - 1);
            const ans = a - b;
            return {
                title: 'គំរូដកចំនួន (Bar Model Subtraction)',
                visual: `
                    <div class="bar-model-container">
                        <div class="bar-row">
                            <div class="bar-part part-a" style="flex: ${ans}">?</div>
                            <div class="bar-part part-b" style="flex: ${b}">${b}</div>
                        </div>
                        <div class="bar-total-label">សរុបទាំងអស់ = ${a}</div>
                    </div>
                `,
                question: `${a} - ${b} = ?`,
                answer: ans,
                options: generateOptions(ans, 4)
            };
        }
    },
    '2': () => {
        const isAdd = Math.random() > 0.5;
        if (isAdd) {
            const a = randInt(15, 60);
            const b = randInt(10, 35);
            const ans = a + b;
            return {
                title: 'វិធីបូកលេខ ២ ខ្ទង់ (Addition up to 100)',
                visual: `
                    <div class="bar-model-container">
                        <div class="bar-row">
                            <div class="bar-part" style="flex: ${a}; background: #3b82f6;">${a}</div>
                            <div class="bar-part" style="flex: ${b}; background: #10b981;">${b}</div>
                        </div>
                        <div class="bar-total-label">ផលបូកសរុប = ?</div>
                    </div>
                `,
                question: `${a} + ${b} = ?`,
                answer: ans,
                options: generateOptions(ans, 8)
            };
        } else {
            const a = randInt(40, 95);
            const b = randInt(12, a - 10);
            const ans = a - b;
            return {
                title: 'វិធីដកលេខ ២ ខ្ទង់ (Subtraction)',
                visual: `
                    <div class="bar-model-container">
                        <div class="bar-row">
                            <div class="bar-part" style="flex: ${ans}; background: #8b5cf6;">?</div>
                            <div class="bar-part" style="flex: ${b}; background: #f59e0b;">${b}</div>
                        </div>
                        <div class="bar-total-label">ចំនួនសរុប = ${a}</div>
                    </div>
                `,
                question: `${a} - ${b} = ?`,
                answer: ans,
                options: generateOptions(ans, 8)
            };
        }
    },
    '3': () => {
        const isMult = Math.random() > 0.45;
        if (isMult) {
            const a = randInt(3, 9);
            const b = randInt(2, 9);
            const ans = a * b;
            return {
                title: 'មេគុណ (Multiplication)',
                visual: `
                    <div class="groups-visual">
                        <span class="badge-tag">${a} ក្រុម នៃ ${b}</span>
                    </div>
                `,
                question: `${a} × ${b} = ?`,
                answer: ans,
                options: generateOptions(ans, 8)
            };
        } else {
            const b = randInt(2, 9);
            const ans = randInt(2, 9);
            const a = b * ans;
            return {
                title: 'វិធីចែក (Division)',
                visual: `
                    <div class="groups-visual">
                        <span class="badge-tag">ចែក ${a} ជា ${b} ចំណែកស្មើគ្នា</span>
                    </div>
                `,
                question: `${a} ÷ ${b} = ?`,
                answer: ans,
                options: generateOptions(ans, 4)
            };
        }
    },
    '4': () => {
        const denom = randInt(4, 8);
        const n1 = randInt(1, 2);
        const n2 = randInt(1, denom - n1 - 1);
        const sumNumerator = n1 + n2;

        let fractionVisual = `<div class="fraction-bars">`;
        for (let i = 0; i < denom; i++) {
            const isN1 = i < n1;
            const isN2 = i >= n1 && i < (n1 + n2);
            fractionVisual += `<div class="frac-cell ${isN1 ? 'cell-a' : isN2 ? 'cell-b' : 'cell-empty'}"></div>`;
        }
        fractionVisual += `</div>`;

        return {
            title: 'ប្រភាគ (Fractions Visual)',
            visual: fractionVisual,
            question: `${n1}/${denom} + ${n2}/${denom} = ?`,
            answer: `${sumNumerator}/${denom}`,
            options: [
                `${sumNumerator}/${denom}`,
                `${sumNumerator + 1}/${denom}`,
                `${Math.max(1, sumNumerator - 1)}/${denom}`,
                `${sumNumerator}/${denom * 2}`
            ].sort(() => Math.random() - 0.5)
        };
    },
    '5': () => {
        const percents = [10, 20, 25, 50, 75];
        const p = percents[randInt(0, percents.length - 1)];
        const base = randInt(2, 8) * 20;
        const ans = (p / 100) * base;

        return {
            title: 'ភាគរយ (Percentage Bar)',
            visual: `
                <div class="percent-bar-container">
                    <div class="percent-track">
                        <div class="percent-fill" style="width: ${p}%">${p}%</div>
                    </div>
                    <div class="percent-labels">
                        <span>0%</span>
                        <span>100% (${base})</span>
                    </div>
                </div>
            `,
            question: `តើ ${p}% នៃ ${base} ស្មើនឹងប៉ុន្មាន?`,
            answer: ans,
            options: generateOptions(ans, 10)
        };
    },
    '6': () => {
        const x = randInt(3, 10);
        const a = randInt(2, 4);
        const b = randInt(2, 12);
        const total = a * x + b;

        return {
            title: 'ពីជគណិតរកតម្លៃ x (Algebra Balance)',
            visual: `
                <div class="algebra-scale">
                    <div class="scale-side left-side">
                        <span class="mystery-box">${a}📦</span> + <span class="val-pill">${b}</span>
                    </div>
                    <div class="scale-pivot">⚖️ ស្មើនឹង</div>
                    <div class="scale-side right-side">
                        <span class="val-pill highlight">${total}</span>
                    </div>
                </div>
            `,
            question: `${a}x + ${b} = ${total}<br><span style="font-size:1.3rem; color:#6366f1;">x = ?</span>`,
            answer: x,
            options: generateOptions(x, 4)
        };
    }
};

// 2. MONSTER BATTLE RPG DATA
const MONSTERS = [
    {
        id: 'slime',
        name: 'Slimey ជែលលីបៃតង',
        title: 'កម្រិតងាយ (Junior)',
        tier: 'junior',
        emoji: '🟢',
        maxHp: 80,
        atk: 8,
        gradeLevel: '1',
        intro: 'ជែលលីបៃតងរៀនបូកដកលេខងាយៗ! ជួយគិតលេខដើម្បីបង្ក្រាបវា!'
    },
    {
        id: 'rocky',
        name: 'Rocky យក្សថ្ម',
        title: 'កម្រិតមធ្យម (Mid)',
        tier: 'mid',
        emoji: '🗿',
        maxHp: 120,
        atk: 12,
        gradeLevel: '2',
        intro: 'យក្សថ្មមានស្បែករឹងដូចថ្ម! ប្រើកម្លាំងគុណនិងបូកលេខកម្ទេចវា!'
    },
    {
        id: 'dragon',
        name: 'Flame Drake នាគភ្លើង',
        title: 'កម្រិតមធ្យម-ខ្ពស់ (Mid-Senior)',
        tier: 'mid',
        emoji: '🐲',
        maxHp: 160,
        atk: 18,
        gradeLevel: '3',
        intro: 'នាគភ្លើងបញ្ចេញអណ្ដាតភ្លើង! ដោះស្រាយផលគុណនិងចែកដើម្បីការពារ!'
    },
    {
        id: 'boss',
        name: 'Mecha-Titan មនុស្សយន្តយក្ស',
        title: 'កំពូលមេ Boss (Senior)',
        tier: 'senior',
        emoji: '🤖',
        maxHp: 200,
        atk: 22,
        gradeLevel: '4',
        intro: 'មនុស្សយន្តគណិតវិទ្យាដ៏មានឥទ្ធិពល! ប្រើប្រភាគ និងទសភាគដើម្បីយកឈ្នះ!'
    }
];

const SPELLS = [
    { name: '🔥 បាល់ភ្លើង (Fireball)', power: 25 },
    { name: '⚡ ផ្លេកបន្ទោរ (Thunderbolt)', power: 30 },
    { name: '💧 ទឹកកក (Frost Blast)', power: 24 },
    { name: '⭐ ផ្កាយពន្លឺ (Star Strike)', power: 35 }
];

// 3. BALLOON POP RUSH DATA BY TIER
const BALLOON_MODES_BY_TIER = {
    junior: [
        {
            id: 'j_count',
            instruction: 'ប៉ះប៉េងប៉ោងដែលជា 【ចំនួនគូ (2, 4, 6, 8, 10)】!',
            filter: n => n % 2 === 0,
            pool: () => [2, 4, 6, 8, 10],
            distractorPool: () => [1, 3, 5, 7, 9]
        },
        {
            id: 'j_lt10',
            instruction: 'ប៉ះប៉េងប៉ោងដែល 【តូចជាង 6 (< 6)】!',
            filter: n => n < 6,
            pool: () => [1, 2, 3, 4, 5],
            distractorPool: () => [6, 7, 8, 9, 10]
        },
        {
            id: 'j_sum5',
            instruction: 'ប៉ះប៉េងប៉ោងណាដែល 【ស្មើនឹង 5】!',
            filter: item => item.val === 5,
            isEquation: true,
            pool: () => [
                { label: '2+3', val: 5 },
                { label: '4+1', val: 5 },
                { label: '5+0', val: 5 },
                { label: '6-1', val: 5 }
            ],
            distractorPool: () => [
                { label: '3+3', val: 6 },
                { label: '2+2', val: 4 },
                { label: '1+3', val: 4 }
            ]
        }
    ],
    mid: [
        {
            id: 'm_even',
            instruction: 'ប៉ះប៉េងប៉ោងដែលជា 【ចំនួនគូ (Even Numbers)】!',
            filter: n => n % 2 === 0,
            pool: () => [12, 16, 24, 28, 32, 40],
            distractorPool: () => [11, 15, 23, 27, 31, 39]
        },
        {
            id: 'm_mult5',
            instruction: 'ប៉ះប៉េងប៉ោងដែលជា 【ពហុគុណនៃ 5】!',
            filter: n => n % 5 === 0,
            pool: () => [15, 25, 30, 35, 45, 50],
            distractorPool: () => [14, 22, 28, 33, 41, 48]
        },
        {
            id: 'm_target24',
            instruction: 'ប៉ះប៉េងប៉ោងដែល 【ស្មើនឹង 24】!',
            filter: item => item.val === 24,
            isEquation: true,
            pool: () => [
                { label: '6×4', val: 24 },
                { label: '8×3', val: 24 },
                { label: '12×2', val: 24 },
                { label: '20+4', val: 24 }
            ],
            distractorPool: () => [
                { label: '5×5', val: 25 },
                { label: '6×3', val: 18 },
                { label: '7×4', val: 28 }
            ]
        }
    ],
    senior: [
        {
            id: 's_mult8',
            instruction: 'ប៉ះប៉េងប៉ោងដែល 【ចែកដាច់នឹង 4】!',
            filter: n => n % 4 === 0,
            pool: () => [16, 24, 36, 44, 52, 64],
            distractorPool: () => [15, 23, 33, 45, 55, 63]
        },
        {
            id: 's_gt50',
            instruction: 'ប៉ះប៉េងប៉ោងដែល 【ធំជាង 50】!',
            filter: n => n > 50,
            pool: () => [52, 68, 75, 84, 96],
            distractorPool: () => [32, 45, 28, 49, 39]
        },
        {
            id: 's_target50',
            instruction: 'ប៉ះប៉េងប៉ោងដែល 【ស្មើនឹង 50】!',
            filter: item => item.val === 50,
            isEquation: true,
            pool: () => [
                { label: '25×2', val: 50 },
                { label: '100÷2', val: 50 },
                { label: '5×10', val: 50 },
                { label: '50% នៃ 100', val: 50 }
            ],
            distractorPool: () => [
                { label: '20×3', val: 60 },
                { label: '40+15', val: 55 },
                { label: '90÷2', val: 45 }
            ]
        }
    ]
};

// 4. SPEED MATH BLITZ BY TIER
function generateSpeedQuestion(tier = 'mid') {
    const isCorrect = Math.random() > 0.45;
    let qText = '';
    let realAns = 0;
    let displayedAns = 0;

    if (tier === 'junior') {
        const type = randInt(1, 2);
        if (type === 1) { // 1-digit addition
            const a = randInt(1, 9);
            const b = randInt(1, 9);
            realAns = a + b;
            displayedAns = isCorrect ? realAns : realAns + (Math.random() > 0.5 ? 1 : -1);
            qText = `${a} + ${b} = ${displayedAns}`;
        } else { // 1-digit subtraction
            const a = randInt(5, 12);
            const b = randInt(1, 5);
            realAns = a - b;
            displayedAns = isCorrect ? realAns : realAns + (Math.random() > 0.5 ? 1 : -1);
            qText = `${a} - ${b} = ${displayedAns}`;
        }
    } else if (tier === 'mid') {
        const type = randInt(1, 3);
        if (type === 1) { // 2-digit addition
            const a = randInt(12, 40);
            const b = randInt(10, 30);
            realAns = a + b;
            displayedAns = isCorrect ? realAns : realAns + (Math.random() > 0.5 ? 2 : -2);
            qText = `${a} + ${b} = ${displayedAns}`;
        } else if (type === 2) { // 1-digit multiplication
            const a = randInt(3, 9);
            const b = randInt(2, 9);
            realAns = a * b;
            displayedAns = isCorrect ? realAns : realAns + (Math.random() > 0.5 ? 2 : -2);
            qText = `${a} × ${b} = ${displayedAns}`;
        } else { // Simple division
            const b = randInt(2, 8);
            const ans = randInt(2, 8);
            const a = b * ans;
            realAns = ans;
            displayedAns = isCorrect ? realAns : realAns + 1;
            qText = `${a} ÷ ${b} = ${displayedAns}`;
        }
    } else { // Senior
        const type = randInt(1, 3);
        if (type === 1) { // Multiplication / Division
            const a = randInt(6, 12);
            const b = randInt(6, 12);
            realAns = a * b;
            displayedAns = isCorrect ? realAns : realAns + (Math.random() > 0.5 ? 4 : -4);
            qText = `${a} × ${b} = ${displayedAns}`;
        } else if (type === 2) { // Decimals
            const a = (randInt(1, 5) + 0.5).toFixed(1);
            const b = (randInt(1, 4) + 0.5).toFixed(1);
            realAns = (parseFloat(a) + parseFloat(b)).toFixed(1);
            displayedAns = isCorrect ? realAns : (parseFloat(realAns) + 0.5).toFixed(1);
            qText = `${a} + ${b} = ${displayedAns}`;
        } else { // Percentages
            const p = randInt(1, 4) * 25; // 25, 50, 75, 100
            const num = randInt(2, 6) * 20;
            realAns = (p / 100) * num;
            displayedAns = isCorrect ? realAns : realAns + 10;
            qText = `${p}% នៃ ${num} = ${displayedAns}`;
        }
    }

    return {
        question: qText,
        isTrue: String(displayedAns) === String(realAns)
    };
}

// 5. MEMORY CARD MATCH BY TIER
function generateMemoryCards(pairCount = 6, tier = 'mid') {
    let candidatePairs = [];

    if (tier === 'junior') {
        candidatePairs = [
            { q: '2 + 3', a: '5' },
            { q: '4 + 4', a: '8' },
            { q: '6 + 1', a: '7' },
            { q: '10 - 2', a: '8' },
            { q: '9 - 5', a: '4' },
            { q: '1 + 5', a: '6' },
            { q: '3 + 3', a: '6' },
            { q: '8 - 4', a: '4' },
            { q: '5 + 5', a: '10' }
        ];
    } else if (tier === 'mid') {
        candidatePairs = [
            { q: '6 × 7', a: '42' },
            { q: '8 × 9', a: '72' },
            { q: '25 + 15', a: '40' },
            { q: '100 - 35', a: '65' },
            { q: '1/2', a: '50%' },
            { q: '1/4', a: '25%' },
            { q: '7 × 7', a: '49' },
            { q: '54 ÷ 6', a: '9' },
            { q: '9 × 4', a: '36' }
        ];
    } else { // Senior
        candidatePairs = [
            { q: '3/4', a: '75%' },
            { q: '12 × 12', a: '144' },
            { q: '√64', a: '8' },
            { q: '0.5 + 0.25', a: '0.75' },
            { q: '20% នៃ 80', a: '16' },
            { q: '2x = 18', a: 'x = 9' },
            { q: '4³', a: '64' },
            { q: '2.5 × 4', a: '10' }
        ];
    }

    const shuffled = candidatePairs.sort(() => Math.random() - 0.5).slice(0, pairCount);
    const cards = [];

    shuffled.forEach((pair, idx) => {
        cards.push({ id: `q-${idx}`, pairId: idx, text: pair.q, type: 'q' });
        cards.push({ id: `a-${idx}`, pairId: idx, text: pair.a, type: 'a' });
    });

    return cards.sort(() => Math.random() - 0.5);
}

// 6. NEW GAME: MATH FISHING ADVENTURE DATA
function generateFishingQuestion(tier = 'junior') {
    if (tier === 'junior') {
        const isAdd = Math.random() > 0.4;
        let prompt = '';
        let target = 0;
        if (isAdd) {
            const a = randInt(1, 5);
            const b = randInt(1, 5);
            target = a + b;
            prompt = `ស្ទូចត្រីដែលស្មើនឹង៖ ${a} + ${b} = ?`;
        } else {
            const a = randInt(4, 10);
            const b = randInt(1, 3);
            target = a - b;
            prompt = `ស្ទូចត្រីដែលស្មើនឹង៖ ${a} - ${b} = ?`;
        }
        const fishNumbers = generateOptions(target, 3);
        return { prompt, target, fishNumbers };
    } else if (tier === 'mid') {
        const a = randInt(3, 9);
        const b = randInt(2, 9);
        const target = a * b;
        const prompt = `ស្ទូចត្រីផលគុណ៖ ${a} × ${b} = ?`;
        const fishNumbers = generateOptions(target, 6);
        return { prompt, target, fishNumbers };
    } else { // Senior
        const a = randInt(3, 8) * 10;
        const p = [10, 20, 50][randInt(0, 2)];
        const target = (p / 100) * a;
        const prompt = `ស្ទូចត្រី ${p}% នៃ ${a} = ?`;
        const fishNumbers = generateOptions(target, 8);
        return { prompt, target, fishNumbers };
    }
}

// 7. NEW GAME: HUNGRY CROCODILE (<, =, >) DATA
function generateCrocodileQuestion(tier = 'junior') {
    let left = 0;
    let right = 0;
    let leftDisplay = '';
    let rightDisplay = '';

    if (tier === 'junior') {
        const mode = randInt(1, 3);
        if (mode === 1) { // Same
            left = randInt(2, 15);
            right = left;
        } else {
            left = randInt(1, 20);
            right = randInt(1, 20);
        }
        leftDisplay = `${left}`;
        rightDisplay = `${right}`;
    } else if (tier === 'mid') {
        const isEquation = Math.random() > 0.4;
        if (isEquation) {
            const a = randInt(3, 8);
            const b = randInt(2, 6);
            left = a * b;
            leftDisplay = `${a} × ${b}`;
            right = randInt(left - 3, left + 3);
            rightDisplay = `${right}`;
        } else {
            left = randInt(25, 90);
            right = randInt(25, 90);
            leftDisplay = `${left}`;
            rightDisplay = `${right}`;
        }
    } else { // Senior
        const mode = randInt(1, 2);
        if (mode === 1) { // Decimals
            const l = (randInt(10, 50) / 10).toFixed(1);
            const r = (randInt(10, 50) / 10).toFixed(1);
            left = parseFloat(l);
            right = parseFloat(r);
            leftDisplay = `${l}`;
            rightDisplay = `${r}`;
        } else { // Percent vs Number
            const p = 50;
            const base = randInt(2, 8) * 10;
            left = (p / 100) * base;
            leftDisplay = `50% នៃ ${base}`;
            right = randInt(left - 5, left + 5);
            rightDisplay = `${right}`;
        }
    }

    let correctSymbol = '=';
    if (left > right) correctSymbol = '>';
    if (left < right) correctSymbol = '<';

    return {
        leftDisplay,
        rightDisplay,
        leftValue: left,
        rightValue: right,
        answer: correctSymbol
    };
}

// 8. NEW GAME: NUMBER TRAIN EXPRESS DATA
function generateTrainQuestion(tier = 'junior') {
    let step = 1;
    let start = 1;
    let length = 5;

    if (tier === 'junior') {
        step = randInt(1, 2); // Count by 1 or 2
        start = randInt(1, 6);
    } else if (tier === 'mid') {
        step = [2, 3, 5, 10][randInt(0, 3)];
        start = randInt(2, 15);
    } else { // Senior
        step = [4, 6, 7, 8, 9, 12][randInt(0, 5)];
        start = randInt(10, 30);
    }

    const sequence = [];
    for (let i = 0; i < length; i++) {
        sequence.push(start + (i * step));
    }

    const missingIdx = randInt(1, length - 2);
    const target = sequence[missingIdx];
    const options = generateOptions(target, step * 2);

    return {
        sequence,
        missingIdx,
        target,
        options,
        stepHint: `លំនាំកើនម្តង៖ +${step}`
    };
}

// 9. NEW GAME: PIZZA FRACTION MASTER DATA
function generatePizzaQuestion(tier = 'junior') {
    let totalSlices = 4;
    if (tier === 'mid') totalSlices = [4, 6, 8][randInt(0, 2)];
    if (tier === 'senior') totalSlices = [6, 8, 10][randInt(0, 2)];

    const targetSlices = randInt(1, totalSlices - 1);
    const toppingTypes = [
        { name: 'Pepperoni 🍕', icon: '🔴', color: '#ef4444' },
        { name: 'ផ្សិតបំពង 🍄', icon: '🍄', color: '#f59e0b' },
        { name: 'ឈីសផ្កាយ ⭐', icon: '⭐', color: '#fbbf24' },
        { name: 'អូលីវខ្មៅ 🫒', icon: '🟢', color: '#10b981' }
    ];
    const topping = toppingTypes[randInt(0, toppingTypes.length - 1)];

    return {
        totalSlices,
        targetSlices,
        topping,
        instruction: `ដាក់គ្រឿង ${topping.name} លើចំនួន <span class="highlight-frac">${targetSlices}/${totalSlices}</span> នៃចំណិតភីហ្សា!`
    };
}

// Global Export
window.GAME_DATA = {
    AVATARS,
    TIERS,
    TROPHIES,
    LEVELS,
    problemGenerators,
    MONSTERS,
    SPELLS,
    BALLOON_MODES_BY_TIER,
    generateSpeedQuestion,
    generateMemoryCards,
    generateFishingQuestion,
    generateCrocodileQuestion,
    generateTrainQuestion,
    generatePizzaQuestion
};
