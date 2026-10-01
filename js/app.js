// Math Games - Main Application Engine & 9 Multi-Tier Game Controllers

class MathArcadeApp {
    constructor() {
        this.selectedHubTier = 'all';
        this.pendingGameType = null;
        this.currentTier = 'junior'; // default fallback

        this.loadProfile();
        this.initBackgroundSymbols();
        this.bindEvents();
        this.updateProfileUI();

        // 1. Quest State
        this.questState = {
            levelId: 'k',
            currentIndex: 0,
            totalQuestions: 10,
            score: 0,
            combo: 0,
            currentProblem: null
        };

        // 2. Battle State
        this.battleState = {
            monster: null,
            monsterHp: 100,
            heroHp: 100,
            questionIndex: 0,
            currentProblem: null
        };

        // 3. Balloon State
        this.balloonState = {
            tier: 'junior',
            timer: 45,
            interval: null,
            spawnInterval: null,
            score: 0,
            combo: 1,
            mode: null
        };

        // 4. Speed State
        this.speedState = {
            tier: 'junior',
            timer: 60,
            interval: null,
            score: 0,
            lives: 3,
            streak: 0,
            currentQuestion: null,
            isRunning: false
        };

        // 5. Memory State
        this.memoryState = {
            tier: 'junior',
            cards: [],
            flippedCards: [],
            matchedPairs: 0,
            totalPairs: 6,
            moves: 0,
            timer: 0,
            interval: null,
            isLocked: false
        };

        // 6. Fishing State
        this.fishingState = {
            tier: 'junior',
            score: 0,
            questionIndex: 0,
            totalQuestions: 8,
            currentProblem: null,
            isLocked: false
        };

        // 7. Crocodile State
        this.crocState = {
            tier: 'junior',
            score: 0,
            questionIndex: 0,
            totalQuestions: 10,
            currentProblem: null
        };

        // 8. Train State
        this.trainState = {
            tier: 'junior',
            score: 0,
            questionIndex: 0,
            totalQuestions: 8,
            currentProblem: null
        };

        // 9. Pizza State
        this.pizzaState = {
            tier: 'junior',
            score: 0,
            questionIndex: 0,
            totalQuestions: 5,
            currentProblem: null,
            selectedSlices: new Set()
        };
    }

    // ================= PROFILE & REWARDS =================
    loadProfile() {
        const defaultProfile = {
            avatar: '🦉',
            avatarId: 'owl',
            name: 'ទីទុយឆ្លាត',
            level: 1,
            xp: 20,
            stars: 0,
            streak: 0,
            trophies: []
        };

        try {
            const saved = localStorage.getItem('math_arcade_profile');
            this.profile = saved ? Object.assign(defaultProfile, JSON.parse(saved)) : defaultProfile;
        } catch (e) {
            this.profile = defaultProfile;
        }
    }

    saveProfile() {
        try {
            localStorage.setItem('math_arcade_profile', JSON.stringify(this.profile));
        } catch (e) {}
        this.updateProfileUI();
    }

    addXP(amount) {
        this.profile.xp += amount;
        const xpNeeded = this.profile.level * 100;

        if (this.profile.xp >= xpNeeded) {
            this.profile.xp -= xpNeeded;
            this.profile.level++;
            this.showFloatingText(`🎉 LEVEL UP! កម្រិត ${this.profile.level}!`, window.innerWidth / 2, 120);
            window.soundManager.playWin();
            this.triggerConfetti();

            if (this.profile.level >= 5) {
                this.unlockTrophy('math_master');
            }
        }
        this.saveProfile();
    }

    addStars(amount) {
        this.profile.stars += amount;
        this.saveProfile();
    }

    incrementStreak() {
        this.profile.streak++;
        if (this.profile.streak >= 10) {
            this.unlockTrophy('streak_10');
        }
        this.saveProfile();
    }

    resetStreak() {
        this.profile.streak = 0;
        this.saveProfile();
    }

    unlockTrophy(trophyId) {
        if (!this.profile.trophies.includes(trophyId)) {
            this.profile.trophies.push(trophyId);
            const trophy = window.GAME_DATA.TROPHIES.find(t => t.id === trophyId);
            if (trophy) {
                this.showFloatingText(`🏆 មេដាយថ្មី៖ ${trophy.name}!`, window.innerWidth / 2, 80);
                window.soundManager.playStreak();
            }
            this.saveProfile();
        }
    }

    updateProfileUI() {
        document.getElementById('player-avatar').innerText = this.profile.avatar;
        document.getElementById('player-name').innerText = this.profile.name;
        document.getElementById('player-level').innerText = `Lv ${this.profile.level}`;
        document.getElementById('streak-count').innerText = this.profile.streak;
        document.getElementById('stars-count').innerText = this.profile.stars;

        const maxXP = this.profile.level * 100;
        const pct = Math.min(100, Math.round((this.profile.xp / maxXP) * 100));
        document.getElementById('xp-fill').style.width = `${pct}%`;
        document.getElementById('xp-text').innerText = `${this.profile.xp}/${maxXP}`;

        document.getElementById('sound-icon').innerText = window.soundManager.isMuted() ? '🔇' : '🔊';
    }

    // ================= BACKGROUND FLOATING SYMBOLS =================
    initBackgroundSymbols() {
        const container = document.getElementById('bg-symbols');
        if (!container) return;
        const symbols = ['➕', '➖', '✖️', '➗', 'π', '%', '½', '√', '1', '2', '3', '7', '8', '9', '⭐'];

        for (let i = 0; i < 22; i++) {
            const sym = document.createElement('div');
            sym.className = 'float-symbol';
            sym.innerText = symbols[Math.floor(Math.random() * symbols.length)];
            sym.style.left = `${Math.random() * 96}%`;
            sym.style.fontSize = `${Math.random() * 28 + 20}px`;
            sym.style.animationDuration = `${Math.random() * 14 + 14}s`;
            sym.style.animationDelay = `${Math.random() * 10}s`;
            container.appendChild(sym);
        }
    }

    // ================= HUB TIER FILTERING =================
    filterTier(tierId) {
        this.selectedHubTier = tierId;
        this.currentTier = tierId === 'all' ? 'junior' : tierId;

        // Update active tab UI
        document.querySelectorAll('.tier-tab').forEach(tab => {
            if (tab.getAttribute('data-tier') === tierId) {
                tab.classList.add('active');
            } else {
                tab.classList.remove('active');
            }
        });

        // Filter game cards
        const cards = document.querySelectorAll('#games-grid .game-card');
        let visibleCount = 0;
        cards.forEach(card => {
            const cardTiers = (card.getAttribute('data-tiers') || '').split(' ');
            if (tierId === 'all' || cardTiers.includes(tierId)) {
                card.classList.remove('hidden');
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        document.getElementById('games-count-label').innerText = `${visibleCount} ហ្គេម`;
        window.soundManager.playFlip();
    }

    // ================= SCREEN NAVIGATION & UTILITIES =================
    showScreen(screenId) {
        document.querySelectorAll('.game-screen').forEach(scr => {
            scr.classList.remove('active');
        });
        const target = document.getElementById(screenId);
        if (target) {
            target.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    }

    showFloatingText(text, x, y) {
        const el = document.createElement('div');
        el.className = 'floating-score';
        el.innerText = text;
        el.style.left = `${x || window.innerWidth / 2}px`;
        el.style.top = `${y || window.innerHeight / 2}px`;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 900);
    }

    triggerConfetti() {
        if (window.confetti) {
            window.confetti({
                particleCount: 80,
                spread: 70,
                origin: { y: 0.6 }
            });
        }
    }

    // ================= EVENTS BINDING =================
    bindEvents() {
        document.getElementById('sound-btn').addEventListener('click', () => {
            const muted = window.soundManager.toggleMute();
            document.getElementById('sound-icon').innerText = muted ? '🔇' : '🔊';
        });

        document.getElementById('home-nav-btn').addEventListener('click', () => {
            this.endBalloonGame();
            this.endSpeedBlitz();
            if (this.memoryState.interval) clearInterval(this.memoryState.interval);
            this.showScreen('screen-hub');
        });

        document.getElementById('profile-btn').addEventListener('click', () => {
            this.openAvatarModal();
        });

        document.getElementById('trophy-btn').addEventListener('click', () => {
            this.openTrophyModal();
        });

        // Keyboard support for Speed Blitz
        window.addEventListener('keydown', (e) => {
            const speedScreen = document.getElementById('screen-speed');
            if (speedScreen.classList.contains('active') && this.speedState.isRunning) {
                if (e.key === 'ArrowLeft' || e.key.toLowerCase() === 'a') {
                    this.answerSpeed(true);
                } else if (e.key === 'ArrowRight' || e.key.toLowerCase() === 'd') {
                    this.answerSpeed(false);
                }
            }
        });
    }

    // ================= DIFFICULTY MODAL FLOW =================
    promptDifficultyAndStart(gameType) {
        this.pendingGameType = gameType;

        // If the user already selected a specific tier in the Hub (not 'all'), auto-launch with that tier
        if (this.selectedHubTier !== 'all') {
            this.selectDifficultyAndLaunch(this.selectedHubTier);
            return;
        }

        // Otherwise show the friendly difficulty selector modal
        document.getElementById('difficulty-modal').classList.add('active');
    }

    selectDifficultyAndLaunch(tier) {
        this.closeDifficultyModal();
        const gameType = this.pendingGameType;

        if (gameType === 'balloon') this.startBalloonGame(tier);
        else if (gameType === 'speed') this.startSpeedBlitz(tier);
        else if (gameType === 'memory') this.startMemoryGame(tier);
        else if (gameType === 'fishing') this.startFishingGame(tier);
        else if (gameType === 'croc') this.startCrocodileGame(tier);
        else if (gameType === 'train') this.startTrainGame(tier);
        else if (gameType === 'pizza') this.startPizzaGame(tier);
    }

    closeDifficultyModal() {
        document.getElementById('difficulty-modal').classList.remove('active');
    }

    // ================= MODALS: AVATAR & TROPHIES =================
    openAvatarModal() {
        const grid = document.getElementById('avatar-options-grid');
        grid.innerHTML = window.GAME_DATA.AVATARS.map(av => `
            <div style="background:rgba(255,255,255,0.06); padding:16px; border-radius:16px; text-align:center; cursor:pointer; border:2px solid ${this.profile.avatarId === av.id ? '#6366f1' : 'transparent'}; transition:all 0.2s;"
                 onclick="window.gameApp.selectAvatar('${av.id}', '${av.emoji}', '${av.name.split(' ')[0]}')">
                <div style="font-size:3rem; margin-bottom:8px;">${av.emoji}</div>
                <div style="font-size:0.85rem; color:#fff; font-weight:700;">${av.name}</div>
            </div>
        `).join('');
        document.getElementById('avatar-modal').classList.add('active');
    }

    selectAvatar(id, emoji, shortName) {
        this.profile.avatarId = id;
        this.profile.avatar = emoji;
        this.profile.name = shortName;
        this.saveProfile();
        this.closeAvatarModal();
        window.soundManager.playCorrect();
    }

    closeAvatarModal() {
        document.getElementById('avatar-modal').classList.remove('active');
    }

    openTrophyModal() {
        const list = document.getElementById('trophies-list');
        list.innerHTML = window.GAME_DATA.TROPHIES.map(t => {
            const unlocked = this.profile.trophies.includes(t.id);
            return `
                <div class="trophy-item ${unlocked ? 'unlocked' : ''}">
                    <div class="trophy-icon">${t.icon}</div>
                    <div class="trophy-details">
                        <h4>${t.name} ${unlocked ? '✅' : '🔒'}</h4>
                        <p>${t.desc}</p>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById('trophy-modal').classList.add('active');
    }

    closeTrophyModal() {
        document.getElementById('trophy-modal').classList.remove('active');
    }

    // ================= 1. SINGAPORE MATH QUEST =================
    openQuestSelect() {
        this.showScreen('screen-quest');
        document.getElementById('quest-select-view').style.display = 'block';
        document.getElementById('quest-play-view').style.display = 'none';

        const grid = document.getElementById('quest-levels-grid');
        grid.innerHTML = window.GAME_DATA.LEVELS.map(lvl => `
            <div class="level-card" style="--level-color:${lvl.color}" onclick="window.gameApp.startQuestLevel('${lvl.id}')">
                <div class="level-card-icon">${lvl.icon}</div>
                <div class="level-card-details">
                    <h4>${lvl.name}</h4>
                    <div class="sub">${lvl.subtitle}</div>
                    <div class="desc">${lvl.desc}</div>
                </div>
            </div>
        `).join('');
    }

    startQuestLevel(levelId) {
        this.questState.levelId = levelId;
        this.questState.currentIndex = 0;
        this.questState.score = 0;
        this.questState.combo = 0;

        const levelInfo = window.GAME_DATA.LEVELS.find(l => l.id === levelId);
        document.getElementById('quest-header-title').innerText = `${levelInfo.name} - ${levelInfo.subtitle}`;
        document.getElementById('quest-header-sub').innerText = levelInfo.desc;
        document.getElementById('quest-score').innerText = this.questState.score;

        document.getElementById('quest-select-view').style.display = 'none';
        document.getElementById('quest-play-view').style.display = 'flex';

        this.renderNextQuestQuestion();
    }

    renderNextQuestQuestion() {
        if (this.questState.currentIndex >= this.questState.totalQuestions) {
            this.finishQuest();
            return;
        }

        const pct = Math.round(((this.questState.currentIndex + 1) / this.questState.totalQuestions) * 100);
        document.getElementById('quest-progress-bar').style.width = `${pct}%`;
        document.getElementById('quest-q-num').innerText = `សំណួរទី ${this.questState.currentIndex + 1} នៃ ${this.questState.totalQuestions}`;
        document.getElementById('quest-combo-tag').innerText = `Combo: x${Math.max(1, this.questState.combo)}`;

        const generator = window.GAME_DATA.problemGenerators[this.questState.levelId];
        const problem = generator();
        this.questState.currentProblem = problem;

        document.getElementById('quest-concept-title').innerText = problem.title || 'លំហាត់គណិតវិទ្យា';
        document.getElementById('quest-visual-box').innerHTML = problem.visual || '';
        document.getElementById('quest-question-text').innerHTML = problem.question;

        const optGrid = document.getElementById('quest-options-grid');
        optGrid.innerHTML = problem.options.map((opt, idx) => `
            <button class="option-btn" id="q-opt-${idx}" onclick="window.gameApp.checkQuestAnswer(${idx}, '${opt}')">
                ${opt}
            </button>
        `).join('');
    }

    checkQuestAnswer(btnIdx, selectedAns) {
        const buttons = document.querySelectorAll('#quest-options-grid .option-btn');
        buttons.forEach(btn => btn.disabled = true);

        const currentProblem = this.questState.currentProblem;
        const isCorrect = String(selectedAns) === String(currentProblem.answer);
        const clickedBtn = document.getElementById(`q-opt-${btnIdx}`);

        if (isCorrect) {
            clickedBtn.classList.add('correct');
            window.soundManager.playCorrect();
            this.questState.score++;
            this.questState.combo++;
            this.incrementStreak();
            document.getElementById('quest-score').innerText = this.questState.score;

            const bonusXP = 10 + (this.questState.combo * 2);
            this.addXP(bonusXP);
            this.showFloatingText(`+${bonusXP} XP! 🔥`, window.innerWidth / 2, 280);
        } else {
            clickedBtn.classList.add('wrong');
            window.soundManager.playWrong();
            this.questState.combo = 0;
            this.resetStreak();

            const correctIdx = currentProblem.options.findIndex(o => String(o) === String(currentProblem.answer));
            if (correctIdx !== -1) {
                const correctBtn = document.getElementById(`q-opt-${correctIdx}`);
                if (correctBtn) correctBtn.classList.add('correct');
            }
        }

        setTimeout(() => {
            this.questState.currentIndex++;
            this.renderNextQuestQuestion();
        }, 1200);
    }

    finishQuest() {
        const score = this.questState.score;
        const total = this.questState.totalQuestions;
        const earnedStars = score >= 9 ? 3 : (score >= 6 ? 2 : 1);
        this.addStars(earnedStars);

        if (score >= 8) {
            this.unlockTrophy('first_win');
        }

        this.showVictoryScreen({
            title: score >= 8 ? 'អស្ចារ្យណាស់!' : 'ធ្វើបានល្អណាស់!',
            icon: score >= 8 ? '🏆' : '🌟',
            message: `អ្នកបានឆ្លើយត្រូវ ${score} ក្នុងចំណោម ${total} សំណួរ!`,
            scoreText: `ពិន្ទុ៖ ${score} / ${total}`,
            xpGain: score * 12,
            starsGain: earnedStars,
            replayAction: () => this.startQuestLevel(this.questState.levelId)
        });
    }

    // ================= 2. MONSTER BATTLE RPG =================
    openMonsterSelect() {
        this.showScreen('screen-battle');
        document.getElementById('monster-select-view').style.display = 'block';
        document.getElementById('monster-active-view').style.display = 'none';

        const grid = document.getElementById('monsters-select-grid');
        grid.innerHTML = window.GAME_DATA.MONSTERS.map(m => `
            <div class="monster-select-card" onclick="window.gameApp.startMonsterBattle('${m.id}')">
                <div class="monster-select-avatar">${m.emoji}</div>
                <h4 style="color:#fff; font-size:1.2rem;">${m.name}</h4>
                <div style="font-size:0.85rem; color:#f59e0b; margin:4px 0;">${m.title}</div>
                <p style="font-size:0.8rem; color:var(--text-muted);">${m.intro}</p>
                <div style="margin-top:10px; font-weight:700; color:#ef4444;">HP: ${m.maxHp}</div>
            </div>
        `).join('');
    }

    startMonsterBattle(monsterId) {
        const monster = window.GAME_DATA.MONSTERS.find(m => m.id === monsterId);
        this.battleState.monster = monster;
        this.battleState.monsterHp = monster.maxHp;
        this.battleState.heroHp = 100;
        this.battleState.questionIndex = 0;

        document.getElementById('battle-hero-avatar').innerText = this.profile.avatar;
        document.getElementById('battle-hero-name').innerText = this.profile.name;
        document.getElementById('battle-monster-avatar').innerText = monster.emoji;
        document.getElementById('battle-monster-name').innerText = monster.name;

        this.updateBattleHPs();

        document.getElementById('monster-select-view').style.display = 'none';
        document.getElementById('monster-active-view').style.display = 'flex';

        this.renderNextBattleQuestion();
    }

    updateBattleHPs() {
        const monster = this.battleState.monster;
        const mPct = Math.max(0, Math.round((this.battleState.monsterHp / monster.maxHp) * 100));
        const hPct = Math.max(0, Math.round((this.battleState.heroHp / 100) * 100));

        document.getElementById('monster-hp-bar').style.width = `${mPct}%`;
        document.getElementById('monster-hp-text').innerText = `${this.battleState.monsterHp} / ${monster.maxHp} HP`;

        document.getElementById('hero-hp-bar').style.width = `${hPct}%`;
        document.getElementById('hero-hp-text').innerText = `${this.battleState.heroHp} / 100 HP`;
        document.getElementById('battle-hero-exp').innerText = `${this.battleState.heroHp} HP`;
    }

    renderNextBattleQuestion() {
        if (this.battleState.monsterHp <= 0) {
            this.finishMonsterBattle(true);
            return;
        }
        if (this.battleState.heroHp <= 0) {
            this.finishMonsterBattle(false);
            return;
        }

        const grade = this.battleState.monster.gradeLevel;
        const generator = window.GAME_DATA.problemGenerators[grade];
        const problem = generator();
        this.battleState.currentProblem = problem;

        const spell = window.GAME_DATA.SPELLS[Math.floor(Math.random() * window.GAME_DATA.SPELLS.length)];
        this.battleState.currentSpell = spell;

        document.getElementById('battle-status-prompt').innerText = `ដោះស្រាយដើម្បីបញ្ចេញ ${spell.name}!`;
        document.getElementById('battle-equation').innerHTML = problem.textQuestion || problem.question;

        const optGrid = document.getElementById('battle-options-grid');
        optGrid.innerHTML = problem.options.map((opt, idx) => `
            <button class="option-btn" id="b-opt-${idx}" onclick="window.gameApp.checkBattleAnswer(${idx}, '${opt}')">
                ${opt}
            </button>
        `).join('');
    }

    checkBattleAnswer(btnIdx, selectedAns) {
        const buttons = document.querySelectorAll('#battle-options-grid .option-btn');
        buttons.forEach(btn => btn.disabled = true);

        const currentProblem = this.battleState.currentProblem;
        const isCorrect = String(selectedAns) === String(currentProblem.answer);
        const clickedBtn = document.getElementById(`b-opt-${btnIdx}`);

        if (isCorrect) {
            clickedBtn.classList.add('correct');
            window.soundManager.playAttack();

            const damage = this.battleState.currentSpell.power + randInt(5, 10);
            this.battleState.monsterHp = Math.max(0, this.battleState.monsterHp - damage);

            const monsterEl = document.getElementById('combatant-monster');
            monsterEl.classList.add('hit');
            setTimeout(() => monsterEl.classList.remove('hit'), 450);

            this.showFloatingText(`-${damage} HP! 💥`, window.innerWidth * 0.7, 240);
            this.addXP(25);
            this.incrementStreak();
        } else {
            clickedBtn.classList.add('wrong');
            window.soundManager.playWrong();

            const damage = this.battleState.monster.atk;
            this.battleState.heroHp = Math.max(0, this.battleState.heroHp - damage);

            const heroEl = document.getElementById('combatant-hero');
            heroEl.classList.add('hit');
            setTimeout(() => heroEl.classList.remove('hit'), 450);

            this.showFloatingText(`-${damage} HP! 💔`, window.innerWidth * 0.3, 240);
            this.resetStreak();

            const correctIdx = currentProblem.options.findIndex(o => String(o) === String(currentProblem.answer));
            if (correctIdx !== -1) {
                const correctBtn = document.getElementById(`b-opt-${correctIdx}`);
                if (correctBtn) correctBtn.classList.add('correct');
            }
        }

        this.updateBattleHPs();

        setTimeout(() => {
            this.renderNextBattleQuestion();
        }, 1300);
    }

    finishMonsterBattle(victory) {
        if (victory) {
            window.soundManager.playWin();
            this.unlockTrophy('monster_slayer');
            this.addStars(5);
            this.addXP(150);

            this.showVictoryScreen({
                title: 'ជ័យជម្នះដ៏អស្ចារ្យ! ⚔️',
                icon: '👑',
                message: `អ្នកបានផ្តួល ${this.battleState.monster.name} ដោយជោគជ័យ!`,
                scoreText: 'ឈ្នះសត្វចម្លែក!',
                xpGain: 150,
                starsGain: 5,
                replayAction: () => this.startMonsterBattle(this.battleState.monster.id)
            });
        } else {
            window.soundManager.playWrong();
            this.showVictoryScreen({
                title: 'បរាជ័យលើកនេះ! 🛡️',
                icon: '🩹',
                message: 'កុំទាន់បាក់ទឹកចិត្ត! ហ្វឹកហាត់ម្តងទៀតដើម្បីឈ្នះ!',
                scoreText: 'ចាញ់សមរភូមិ',
                xpGain: 30,
                starsGain: 0,
                replayAction: () => this.startMonsterBattle(this.battleState.monster.id)
            });
        }
    }

    // ================= 3. BALLOON POP RUSH =================
    startBalloonGame(tier = 'junior') {
        this.showScreen('screen-balloon');
        this.balloonState.tier = tier;
        this.balloonState.timer = 45;
        this.balloonState.score = 0;
        this.balloonState.combo = 1;

        const tierNames = { junior: '🟢 កុមារតូច', mid: '🟡 កុមារមធ្យម', senior: '🔴 កុមារជាន់ខ្ពស់' };
        document.getElementById('balloon-tier-label').innerText = `Balloon Pop (${tierNames[tier] || 'គ្រប់វ័យ'})`;

        const modes = window.GAME_DATA.BALLOON_MODES_BY_TIER[tier] || window.GAME_DATA.BALLOON_MODES_BY_TIER.junior;
        this.balloonState.mode = modes[Math.floor(Math.random() * modes.length)];

        document.getElementById('balloon-target-instruction').innerText = this.balloonState.mode.instruction;
        document.getElementById('balloon-score').innerText = this.balloonState.score;
        document.getElementById('balloon-timer').innerText = `${this.balloonState.timer}s`;
        document.getElementById('balloon-streak-badge').innerText = `Combo: x1`;

        const sky = document.getElementById('balloon-sky');
        sky.innerHTML = '';

        clearInterval(this.balloonState.interval);
        this.balloonState.interval = setInterval(() => {
            this.balloonState.timer--;
            document.getElementById('balloon-timer').innerText = `${this.balloonState.timer}s`;
            if (this.balloonState.timer <= 0) {
                this.endBalloonGame();
            }
        }, 1000);

        clearInterval(this.balloonState.spawnInterval);
        this.balloonState.spawnInterval = setInterval(() => {
            this.spawnBalloon();
        }, 1100);

        for (let i = 0; i < 3; i++) {
            setTimeout(() => this.spawnBalloon(), i * 400);
        }
    }

    spawnBalloon() {
        const sky = document.getElementById('balloon-sky');
        if (!sky) return;

        const mode = this.balloonState.mode;
        const isTarget = Math.random() > 0.45;
        let itemData = null;

        if (mode.isEquation) {
            const pool = isTarget ? mode.pool() : mode.distractorPool();
            itemData = pool[randInt(0, pool.length - 1)];
        } else {
            const pool = isTarget ? mode.pool() : mode.distractorPool();
            const val = pool[randInt(0, pool.length - 1)];
            itemData = { label: val, val: val };
        }

        const colors = [
            'linear-gradient(135deg, #ef4444, #dc2626)',
            'linear-gradient(135deg, #3b82f6, #1d4ed8)',
            'linear-gradient(135deg, #10b981, #047857)',
            'linear-gradient(135deg, #f59e0b, #d97706)',
            'linear-gradient(135deg, #8b5cf6, #6d28d9)',
            'linear-gradient(135deg, #ec4899, #be185d)'
        ];
        const color = colors[randInt(0, colors.length - 1)];

        const balloon = document.createElement('div');
        balloon.className = 'balloon';
        balloon.innerText = itemData.label;
        balloon.style.background = color;

        const skyWidth = sky.clientWidth || 400;
        const xPos = randInt(20, Math.max(40, skyWidth - 90));
        balloon.style.left = `${xPos}px`;
        balloon.style.bottom = '-100px';

        const duration = randInt(5, 8);
        balloon.style.transition = `bottom ${duration}s linear`;

        sky.appendChild(balloon);

        setTimeout(() => {
            balloon.style.bottom = '560px';
        }, 50);

        balloon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.popBalloon(balloon, itemData, e.clientX, e.clientY);
        });

        setTimeout(() => {
            if (balloon.parentNode) balloon.remove();
        }, duration * 1000 + 100);
    }

    popBalloon(balloonEl, itemData, clickX, clickY) {
        if (balloonEl.classList.contains('popping')) return;
        balloonEl.classList.add('popping');

        const mode = this.balloonState.mode;
        const isCorrect = mode.isEquation ? mode.filter(itemData) : mode.filter(itemData.val);

        if (isCorrect) {
            window.soundManager.playPop();
            this.balloonState.score++;
            this.balloonState.combo = Math.min(5, this.balloonState.combo + 1);
            document.getElementById('balloon-score').innerText = this.balloonState.score;
            document.getElementById('balloon-streak-badge').innerText = `Combo: x${this.balloonState.combo}`;

            const pts = 10 * this.balloonState.combo;
            this.addXP(pts);
            this.showFloatingText(`+${pts} 🎈`, clickX, clickY);

            if (this.balloonState.score >= 20) {
                this.unlockTrophy('balloon_master');
            }
        } else {
            window.soundManager.playWrong();
            this.balloonState.combo = 1;
            document.getElementById('balloon-streak-badge').innerText = `Combo: x1`;
            this.showFloatingText(`ខុសហើយ! ❌`, clickX, clickY);
        }

        setTimeout(() => {
            if (balloonEl.parentNode) balloonEl.remove();
        }, 250);
    }

    endBalloonGame() {
        clearInterval(this.balloonState.interval);
        clearInterval(this.balloonState.spawnInterval);

        const score = this.balloonState.score;
        const starsEarned = score >= 15 ? 3 : (score >= 8 ? 2 : 1);
        this.addStars(starsEarned);

        this.showVictoryScreen({
            title: 'ចប់ម៉ោងបាញ់ប៉េងប៉ោង! 🎈',
            icon: '🎈',
            message: `អ្នកបាញ់បានចំនួន ${score} ប៉េងប៉ោងត្រឹមត្រូវ!`,
            scoreText: `ពិន្ទុ៖ ${score}`,
            xpGain: score * 10,
            starsGain: starsEarned,
            replayAction: () => this.startBalloonGame(this.balloonState.tier)
        });
    }

    // ================= 4. SPEED MATH BLITZ =================
    startSpeedBlitz(tier = 'junior') {
        this.showScreen('screen-speed');
        this.speedState.tier = tier;
        this.speedState.timer = 60;
        this.speedState.score = 0;
        this.speedState.lives = 3;
        this.speedState.streak = 0;
        this.speedState.isRunning = true;

        const tierNames = { junior: '🟢 កុមារតូច', mid: '🟡 កុមារមធ្យម', senior: '🔴 កុមារជាន់ខ្ពស់' };
        document.getElementById('speed-tier-label').innerText = `Speed Blitz (${tierNames[tier] || 'គ្រប់កម្រិត'})`;

        document.getElementById('speed-score').innerText = this.speedState.score;
        document.getElementById('speed-lives').innerText = '❤️❤️❤️';
        document.getElementById('speed-combo-text').innerText = 'ឆ្លើយត្រូវជាប់គ្នា: 0';
        document.getElementById('speed-timer-fill').style.width = '100%';

        clearInterval(this.speedState.interval);
        this.speedState.interval = setInterval(() => {
            this.speedState.timer--;
            const pct = Math.max(0, (this.speedState.timer / 60) * 100);
            document.getElementById('speed-timer-fill').style.width = `${pct}%`;

            if (this.speedState.timer <= 0) {
                this.endSpeedBlitz();
            }
        }, 1000);

        this.renderNextSpeedQuestion();
    }

    renderNextSpeedQuestion() {
        if (!this.speedState.isRunning) return;
        const q = window.GAME_DATA.generateSpeedQuestion(this.speedState.tier);
        this.speedState.currentQuestion = q;
        document.getElementById('speed-equation').innerText = q.question;

        const card = document.getElementById('speed-card');
        if (this.speedState.streak >= 5) {
            card.classList.add('fever');
        } else {
            card.classList.remove('fever');
        }
    }

    answerSpeed(userChoice) {
        if (!this.speedState.isRunning) return;
        const q = this.speedState.currentQuestion;
        const isCorrect = userChoice === q.isTrue;

        if (isCorrect) {
            window.soundManager.playCorrect();
            this.speedState.score++;
            this.speedState.streak++;
            document.getElementById('speed-score').innerText = this.speedState.score;
            document.getElementById('speed-combo-text').innerText = `ឆ្លើយត្រូវជាប់គ្នា: ${this.speedState.streak} 🔥`;

            const xp = 15 + (this.speedState.streak * 2);
            this.addXP(xp);

            if (this.speedState.score >= 15) {
                this.unlockTrophy('speed_demon');
            }
        } else {
            window.soundManager.playWrong();
            this.speedState.streak = 0;
            this.speedState.lives--;
            document.getElementById('speed-combo-text').innerText = 'ឆ្លើយត្រូវជាប់គ្នា: 0';

            const hearts = '❤️'.repeat(Math.max(0, this.speedState.lives)) + '🖤'.repeat(3 - Math.max(0, this.speedState.lives));
            document.getElementById('speed-lives').innerText = hearts;

            const card = document.getElementById('speed-card');
            card.classList.add('wrong');
            setTimeout(() => card.classList.remove('wrong'), 300);

            if (this.speedState.lives <= 0) {
                this.endSpeedBlitz();
                return;
            }
        }

        this.renderNextSpeedQuestion();
    }

    endSpeedBlitz() {
        this.speedState.isRunning = false;
        clearInterval(this.speedState.interval);

        const score = this.speedState.score;
        const starsEarned = score >= 20 ? 3 : (score >= 10 ? 2 : 1);
        this.addStars(starsEarned);

        this.showVictoryScreen({
            title: 'ចប់ការប្រណាំងល្បឿន! ⚡',
            icon: '⚡',
            message: `អ្នកឆ្លើយបានត្រឹមត្រូវចំនួន ${score} សំណួរ!`,
            scoreText: `ពិន្ទុ៖ ${score}`,
            xpGain: score * 15,
            starsGain: starsEarned,
            replayAction: () => this.startSpeedBlitz(this.speedState.tier)
        });
    }

    // ================= 5. MEMORY CARD MATCH =================
    startMemoryGame(tier = 'junior') {
        this.showScreen('screen-memory');
        this.memoryState.tier = tier;
        this.memoryState.cards = window.GAME_DATA.generateMemoryCards(6, tier);
        this.memoryState.flippedCards = [];
        this.memoryState.matchedPairs = 0;
        this.memoryState.moves = 0;
        this.memoryState.timer = 0;
        this.memoryState.isLocked = false;

        const tierNames = { junior: '🟢 កុមារតូច', mid: '🟡 កុមារមធ្យម', senior: '🔴 កុមារជាន់ខ្ពស់' };
        document.getElementById('memory-tier-label').innerText = `Memory Flip (${tierNames[tier] || 'គ្រប់កម្រិត'})`;

        document.getElementById('memory-moves').innerText = '0';
        document.getElementById('memory-timer').innerText = '00:00';

        clearInterval(this.memoryState.interval);
        this.memoryState.interval = setInterval(() => {
            this.memoryState.timer++;
            const mins = String(Math.floor(this.memoryState.timer / 60)).padStart(2, '0');
            const secs = String(this.memoryState.timer % 60).padStart(2, '0');
            document.getElementById('memory-timer').innerText = `${mins}:${secs}`;
        }, 1000);

        const grid = document.getElementById('memory-grid');
        grid.innerHTML = this.memoryState.cards.map((c, idx) => `
            <div class="memory-card" id="mem-card-${idx}" onclick="window.gameApp.flipMemoryCard(${idx})">
                <div class="card-face card-front">❓</div>
                <div class="card-face card-back">${c.text}</div>
            </div>
        `).join('');
    }

    flipMemoryCard(idx) {
        if (this.memoryState.isLocked) return;
        const card = this.memoryState.cards[idx];
        const cardEl = document.getElementById(`mem-card-${idx}`);

        if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) {
            return;
        }

        window.soundManager.playFlip();
        cardEl.classList.add('flipped');
        this.memoryState.flippedCards.push({ card, el: cardEl });

        if (this.memoryState.flippedCards.length === 2) {
            this.memoryState.moves++;
            document.getElementById('memory-moves').innerText = this.memoryState.moves;
            this.checkMemoryMatch();
        }
    }

    checkMemoryMatch() {
        this.memoryState.isLocked = true;
        const [c1, c2] = this.memoryState.flippedCards;

        if (c1.card.pairId === c2.card.pairId) {
            window.soundManager.playCorrect();
            c1.el.classList.add('matched');
            c2.el.classList.add('matched');
            this.memoryState.matchedPairs++;
            this.memoryState.flippedCards = [];
            this.memoryState.isLocked = false;

            this.addXP(20);

            if (this.memoryState.matchedPairs >= this.memoryState.totalPairs) {
                this.finishMemoryGame();
            }
        } else {
            window.soundManager.playWrong();
            setTimeout(() => {
                c1.el.classList.remove('flipped');
                c2.el.classList.remove('flipped');
                this.memoryState.flippedCards = [];
                this.memoryState.isLocked = false;
            }, 900);
        }
    }

    finishMemoryGame() {
        clearInterval(this.memoryState.interval);
        window.soundManager.playWin();
        this.unlockTrophy('memory_genius');

        const moves = this.memoryState.moves;
        const stars = moves <= 10 ? 3 : (moves <= 16 ? 2 : 1);
        this.addStars(stars);

        this.showVictoryScreen({
            title: 'ផ្គូផ្គងជោគជ័យ! 🧠',
            icon: '🎉',
            message: `អ្នកបានបញ្ចប់ដោយប្រើពេល ${document.getElementById('memory-timer').innerText} និងបើកសន្លឹកបៀ ${moves} លើក!`,
            scoreText: 'ឈ្នះគ្រប់គូ!',
            xpGain: 120,
            starsGain: stars,
            replayAction: () => this.startMemoryGame(this.memoryState.tier)
        });
    }

    // ================= 6. NEW GAME: FISHING ADVENTURE =================
    startFishingGame(tier = 'junior') {
        this.showScreen('screen-fishing');
        this.fishingState.tier = tier;
        this.fishingState.score = 0;
        this.fishingState.questionIndex = 0;
        this.fishingState.isLocked = false;

        document.getElementById('fishing-score').innerText = '0';
        this.renderNextFishingQuestion();
    }

    renderNextFishingQuestion() {
        if (this.fishingState.questionIndex >= this.fishingState.totalQuestions) {
            this.finishFishingGame();
            return;
        }

        const problem = window.GAME_DATA.generateFishingQuestion(this.fishingState.tier);
        this.fishingState.currentProblem = problem;
        this.fishingState.isLocked = false;

        document.getElementById('fishing-target-text').innerText = problem.prompt;
        document.getElementById('fishing-progress-tag').innerText = `ត្រីទី ${this.fishingState.questionIndex + 1}/${this.fishingState.totalQuestions}`;

        const pond = document.getElementById('fishing-pond');
        pond.innerHTML = '<div class="pond-surface"></div>';

        // Spawn swimming fish options
        const colors = [
            'linear-gradient(135deg, #f97316, #ea580c)',
            'linear-gradient(135deg, #06b6d4, #0284c7)',
            'linear-gradient(135deg, #8b5cf6, #7c3aed)',
            'linear-gradient(135deg, #10b981, #047857)'
        ];

        problem.fishNumbers.forEach((num, idx) => {
            const fish = document.createElement('div');
            fish.className = 'swimming-fish';
            fish.style.background = colors[idx % colors.length];
            fish.innerHTML = `<span>🐟</span> <span>${num}</span><div class="fish-tail"></div>`;

            const topY = 70 + (idx * 90);
            fish.style.top = `${topY}px`;
            fish.style.left = `${randInt(20, 180)}px`;

            // Swimming float animation
            let dir = idx % 2 === 0 ? 1 : -1;
            let currentX = randInt(20, 200);
            const moveInterval = setInterval(() => {
                if (!fish.parentNode) {
                    clearInterval(moveInterval);
                    return;
                }
                currentX += dir * 1.5;
                const maxW = (pond.clientWidth || 400) - 140;
                if (currentX > maxW) { dir = -1; fish.style.transform = 'scaleX(-1)'; }
                if (currentX < 20) { dir = 1; fish.style.transform = 'scaleX(1)'; }
                fish.style.left = `${currentX}px`;
            }, 30);

            fish.addEventListener('click', (e) => {
                this.catchFish(fish, num, e.clientX, e.clientY);
            });

            pond.appendChild(fish);
        });
    }

    catchFish(fishEl, selectedNum, x, y) {
        if (this.fishingState.isLocked) return;
        this.fishingState.isLocked = true;

        window.soundManager.playSplash();
        const isCorrect = String(selectedNum) === String(this.fishingState.currentProblem.target);

        if (isCorrect) {
            window.soundManager.playCorrect();
            fishEl.style.transform = 'scale(1.3) translateY(-40px)';
            fishEl.style.boxShadow = '0 0 25px #fbbf24';
            this.fishingState.score++;
            document.getElementById('fishing-score').innerText = this.fishingState.score;

            this.showFloatingText('+25 🎣 ស្ទូចបានត្រី!', x, y);
            this.addXP(25);
            this.incrementStreak();

            if (this.fishingState.score >= 5) {
                this.unlockTrophy('fisherman');
            }
        } else {
            window.soundManager.playWrong();
            fishEl.style.opacity = '0.5';
            this.showFloatingText('មិនទាន់ត្រូវទេ! ❌', x, y);
            this.resetStreak();
        }

        setTimeout(() => {
            this.fishingState.questionIndex++;
            this.renderNextFishingQuestion();
        }, 1200);
    }

    endFishingGame() {
        // Just return to hub
    }

    finishFishingGame() {
        const score = this.fishingState.score;
        const total = this.fishingState.totalQuestions;
        const stars = score >= 7 ? 3 : (score >= 4 ? 2 : 1);
        this.addStars(stars);

        this.showVictoryScreen({
            title: 'បញ្ចប់ការស្ទូចត្រី! 🎣',
            icon: '🐟',
            message: `អ្នកស្ទូចបានត្រីត្រឹមត្រូវចំនួន ${score} ក្នុងចំណោម ${total}!`,
            scoreText: `ស្ទូចបាន៖ ${score} / ${total}`,
            xpGain: score * 20,
            starsGain: stars,
            replayAction: () => this.startFishingGame(this.fishingState.tier)
        });
    }

    // ================= 7. NEW GAME: HUNGRY CROCODILE =================
    startCrocodileGame(tier = 'junior') {
        this.showScreen('screen-croc');
        this.crocState.tier = tier;
        this.crocState.score = 0;
        this.crocState.questionIndex = 0;

        document.getElementById('croc-score').innerText = '0';
        this.renderNextCrocodileQuestion();
    }

    renderNextCrocodileQuestion() {
        if (this.crocState.questionIndex >= this.crocState.totalQuestions) {
            this.finishCrocodileGame();
            return;
        }

        const problem = window.GAME_DATA.generateCrocodileQuestion(this.crocState.tier);
        this.crocState.currentProblem = problem;

        document.getElementById('croc-left-box').innerText = problem.leftDisplay;
        document.getElementById('croc-right-box').innerText = problem.rightDisplay;
        document.getElementById('croc-symbol-display').innerText = '?';
        document.getElementById('croc-avatar-display').innerText = '🐊';

        // Re-enable buttons
        document.querySelectorAll('.croc-btn').forEach(btn => btn.disabled = false);
    }

    answerCrocodile(symbol) {
        document.querySelectorAll('.croc-btn').forEach(btn => btn.disabled = true);
        window.soundManager.playChomp();

        const problem = this.crocState.currentProblem;
        const isCorrect = symbol === problem.answer;

        document.getElementById('croc-symbol-display').innerText = symbol;
        if (symbol === '>') document.getElementById('croc-avatar-display').innerText = '👈🐊';
        else if (symbol === '<') document.getElementById('croc-avatar-display').innerText = '🐊👉';
        else document.getElementById('croc-avatar-display').innerText = '🐊😋';

        if (isCorrect) {
            window.soundManager.playCorrect();
            this.crocState.score++;
            document.getElementById('croc-score').innerText = this.crocState.score;
            this.addXP(20);
            this.incrementStreak();
            this.showFloatingText('ឆ្ងាញ់ណាស់! ត្រូវហើយ! 🐊', window.innerWidth / 2, 280);

            if (this.crocState.score >= 8) {
                this.unlockTrophy('croc_master');
            }
        } else {
            window.soundManager.playWrong();
            this.resetStreak();
            this.showFloatingText(`ខុសហើយ! ចម្លើយត្រឹមត្រូវគឺ ${problem.answer}`, window.innerWidth / 2, 280);
        }

        setTimeout(() => {
            this.crocState.questionIndex++;
            this.renderNextCrocodileQuestion();
        }, 1300);
    }

    finishCrocodileGame() {
        const score = this.crocState.score;
        const total = this.crocState.totalQuestions;
        const stars = score >= 8 ? 3 : (score >= 5 ? 2 : 1);
        this.addStars(stars);

        this.showVictoryScreen({
            title: 'ក្រពើឆ្អែតហើយ! 🐊',
            icon: '🐊',
            message: `អ្នកបានប្រៀបធៀបលេខត្រូវចំនួន ${score} ក្នុងចំណោម ${total}!`,
            scoreText: `ពិន្ទុ៖ ${score} / ${total}`,
            xpGain: score * 15,
            starsGain: stars,
            replayAction: () => this.startCrocodileGame(this.crocState.tier)
        });
    }

    // ================= 8. NEW GAME: NUMBER TRAIN EXPRESS =================
    startTrainGame(tier = 'junior') {
        this.showScreen('screen-train');
        this.trainState.tier = tier;
        this.trainState.score = 0;
        this.trainState.questionIndex = 0;

        document.getElementById('train-score').innerText = '0';
        this.renderNextTrainQuestion();
    }

    renderNextTrainQuestion() {
        if (this.trainState.questionIndex >= this.trainState.totalQuestions) {
            this.finishTrainGame();
            return;
        }

        const problem = window.GAME_DATA.generateTrainQuestion(this.trainState.tier);
        this.trainState.currentProblem = problem;

        document.getElementById('train-hint-text').innerText = problem.stepHint;

        const container = document.getElementById('train-line-container');
        container.innerHTML = `<div class="train-engine">🚂💨</div>`;

        problem.sequence.forEach((val, idx) => {
            const car = document.createElement('div');
            if (idx === problem.missingIdx) {
                car.className = 'train-car missing';
                car.id = 'train-missing-car';
                car.innerText = '?';
            } else {
                car.className = 'train-car';
                car.innerText = val;
            }
            container.appendChild(car);
        });

        const optGrid = document.getElementById('train-options-grid');
        optGrid.innerHTML = problem.options.map((opt, idx) => `
            <button class="option-btn" id="train-opt-${idx}" onclick="window.gameApp.checkTrainAnswer(${idx}, ${opt})">
                ${opt}
            </button>
        `).join('');
    }

    checkTrainAnswer(btnIdx, selectedVal) {
        const buttons = document.querySelectorAll('#train-options-grid .option-btn');
        buttons.forEach(btn => btn.disabled = true);

        const problem = this.trainState.currentProblem;
        const isCorrect = selectedVal === problem.target;
        const clickedBtn = document.getElementById(`train-opt-${btnIdx}`);

        if (isCorrect) {
            clickedBtn.classList.add('correct');
            window.soundManager.playTrainWhistle();
            window.soundManager.playCorrect();

            const missingCar = document.getElementById('train-missing-car');
            missingCar.innerText = selectedVal;
            missingCar.classList.remove('missing');
            missingCar.style.background = 'linear-gradient(135deg, #10b981, #059669)';

            this.trainState.score++;
            document.getElementById('train-score').innerText = this.trainState.score;
            this.addXP(25);
            this.incrementStreak();
            this.showFloatingText('ឈូស ឈូស! រថភ្លើងរត់ហើយ! 🚂💨', window.innerWidth / 2, 280);

            if (this.trainState.score >= 5) {
                this.unlockTrophy('train_driver');
            }
        } else {
            clickedBtn.classList.add('wrong');
            window.soundManager.playWrong();
            this.resetStreak();
            this.showFloatingText(`មិនទាន់ត្រូវទេ! ចម្លើយគឺ ${problem.target}`, window.innerWidth / 2, 280);
        }

        setTimeout(() => {
            this.trainState.questionIndex++;
            this.renderNextTrainQuestion();
        }, 1400);
    }

    finishTrainGame() {
        const score = this.trainState.score;
        const total = this.trainState.totalQuestions;
        const stars = score >= 7 ? 3 : (score >= 4 ? 2 : 1);
        this.addStars(stars);

        this.showVictoryScreen({
            title: 'រថភ្លើងដល់គោលដៅ! 🚂',
            icon: '🚉',
            message: `អ្នកបានរៀបលំដាប់រថភ្លើងបានជោគជ័យ ${score} ក្នុងចំណោម ${total}!`,
            scoreText: `ពិន្ទុ៖ ${score} / ${total}`,
            xpGain: score * 20,
            starsGain: stars,
            replayAction: () => this.startTrainGame(this.trainState.tier)
        });
    }

    // ================= 9. NEW GAME: PIZZA FRACTION MASTER =================
    startPizzaGame(tier = 'junior') {
        this.showScreen('screen-pizza');
        this.pizzaState.tier = tier;
        this.pizzaState.score = 0;
        this.pizzaState.questionIndex = 0;

        document.getElementById('pizza-score').innerText = '0';
        this.renderNextPizzaQuestion();
    }

    renderNextPizzaQuestion() {
        if (this.pizzaState.questionIndex >= this.pizzaState.totalQuestions) {
            this.finishPizzaGame();
            return;
        }

        const problem = window.GAME_DATA.generatePizzaQuestion(this.pizzaState.tier);
        this.pizzaState.currentProblem = problem;
        this.pizzaState.selectedSlices = new Set();

        document.getElementById('pizza-recipe-text').innerHTML = problem.instruction;
        this.updatePizzaCounterUI();

        // Render circular pizza slices
        const dough = document.getElementById('pizza-dough');
        dough.innerHTML = '';

        const total = problem.totalSlices;
        const anglePerSlice = 360 / total;

        for (let i = 0; i < total; i++) {
            const slice = document.createElement('div');
            slice.className = 'pizza-slice-btn';
            slice.id = `pizza-slice-${i}`;

            // Calculate rotation for pie slicing
            const startAngle = i * anglePerSlice;
            slice.style.transform = `rotate(${startAngle}deg) skewY(${90 - anglePerSlice}deg)`;

            slice.addEventListener('click', () => {
                this.togglePizzaSlice(i);
            });

            dough.appendChild(slice);
        }
    }

    togglePizzaSlice(sliceIndex) {
        window.soundManager.playPop();
        const sliceEl = document.getElementById(`pizza-slice-${sliceIndex}`);

        if (this.pizzaState.selectedSlices.has(sliceIndex)) {
            this.pizzaState.selectedSlices.delete(sliceIndex);
            sliceEl.classList.remove('active');
            sliceEl.innerHTML = '';
        } else {
            this.pizzaState.selectedSlices.add(sliceIndex);
            sliceEl.classList.add('active');
            const topping = this.pizzaState.currentProblem.topping;
            sliceEl.innerHTML = `<span class="slice-topping-icon">${topping.icon}</span>`;
        }

        this.updatePizzaCounterUI();
    }

    updatePizzaCounterUI() {
        const count = this.pizzaState.selectedSlices.size;
        const total = this.pizzaState.currentProblem.totalSlices;
        document.getElementById('pizza-current-count').innerHTML = `
            បានដាក់គ្រឿង៖ <strong style="color:#fbbf24; font-size:1.1rem;">${count} / ${total} ចំណិត</strong>
        `;
    }

    servePizza() {
        const selectedCount = this.pizzaState.selectedSlices.size;
        const targetCount = this.pizzaState.currentProblem.targetSlices;
        const isCorrect = selectedCount === targetCount;

        if (isCorrect) {
            window.soundManager.playCorrect();
            this.pizzaState.score++;
            document.getElementById('pizza-score').innerText = this.pizzaState.score;
            this.addXP(30);
            this.incrementStreak();
            this.showFloatingText('ឆ្ងាញ់ណាស់! អតិថិជនពេញចិត្ត! 🍕⭐', window.innerWidth / 2, 280);

            if (this.pizzaState.score >= 3) {
                this.unlockTrophy('pizza_chef');
            }

            setTimeout(() => {
                this.pizzaState.questionIndex++;
                this.renderNextPizzaQuestion();
            }, 1200);
        } else {
            window.soundManager.playWrong();
            this.showFloatingText(`អូ មិនទាន់ត្រូវទេ! គេកុម្ម៉ង់ ${targetCount} ចំណិតណា៎! ❌`, window.innerWidth / 2, 280);
        }
    }

    finishPizzaGame() {
        const score = this.pizzaState.score;
        const total = this.pizzaState.totalQuestions;
        const stars = score >= 4 ? 3 : (score >= 2 ? 2 : 1);
        this.addStars(stars);

        this.showVictoryScreen({
            title: 'កំពូលចុងភៅភីហ្សា! 🍕',
            icon: '👨‍🍳',
            message: `អ្នកបានដុតនំភីហ្សាប្រភាគត្រឹមត្រូវ ${score} ក្នុងចំណោម ${total}!`,
            scoreText: `ពិន្ទុ៖ ${score} / ${total}`,
            xpGain: score * 25,
            starsGain: stars,
            replayAction: () => this.startPizzaGame(this.pizzaState.tier)
        });
    }

    // ================= VICTORY SCREEN =================
    showVictoryScreen({ title, icon, message, scoreText, xpGain, starsGain, replayAction }) {
        this.showScreen('screen-victory');
        this.triggerConfetti();

        document.getElementById('victory-title').innerText = title;
        document.getElementById('victory-icon').innerText = icon;
        document.getElementById('victory-msg').innerText = message;
        document.getElementById('victory-score-pill').innerText = scoreText;
        document.getElementById('victory-xp-gain').innerText = `+${xpGain} XP`;
        document.getElementById('victory-stars-gain').innerText = `+${starsGain} ⭐ ផ្កាយ`;

        const replayBtn = document.getElementById('victory-replay-btn');
        replayBtn.onclick = () => {
            if (replayAction) replayAction();
        };
    }
}

// Instantiate on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameApp = new MathArcadeApp();
});
