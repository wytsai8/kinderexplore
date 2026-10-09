// 全域法律聲明彈跳視窗（隱私權政策與版權聲明）控制
window.openLegalModal = function(type) {
  const modalId = type === 'privacy' ? 'modal-privacy' : 'modal-copyright';
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('open');
    if (window.soundEngine && typeof window.soundEngine.playPop === 'function') {
      window.soundEngine.playPop();
    }
  }
};

window.closeLegalModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('open');
  }
};

// 粒子撒花特效引擎 (純原生 Canvas 實現，無任何外部 CDN 依賴)
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.animationId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire() {
    if (!this.canvas) return;
    const colors = ['#EF4444', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#EC4899'];
    for (let i = 0; i < 100; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height * 0.4,
        vx: (Math.random() - 0.5) * 16,
        vy: (Math.random() - 1.2) * 16,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        vRot: (Math.random() - 0.5) * 10,
        alpha: 1
      });
    }

    if (!this.animationId) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.4; // 重力
      p.rotation += p.vRot;
      p.alpha -= 0.012;

      if (p.alpha <= 0 || p.y > this.canvas.height) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animationId = requestAnimationFrame(() => this.animate());
    } else {
      this.animationId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// 應用程式狀態管理
class AdventureApp {
  constructor() {
    this.storageKey = 'lilinana_adventure_progress';
    this.progress = this.loadProgress();
    this.currentLevel = null;
    this.currentQuestionIdx = 0;
    this.levelScore = 0;
    this.userAnswers = {};
    this.hasWrongAnswer = false;
    this.confetti = null;
    this.activeThemeFilter = 'all';
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem(this.storageKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Storage read error', e);
    }
    return {
      unlockedLevel: 1, // 預設第 1 關解鎖
      levelStars: {},   // { 1: 3, 2: 2, ... }
      unlockedBadges: [],
      explorerName: "小勇士"
    };
  }

  saveProgress() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.progress));
    } catch (e) {
      console.warn('Storage save error', e);
    }
  }

  init() {
    this.confetti = new ConfettiCannon('confetti-canvas');
    this.renderHeaderStats();
    this.renderCinemaGrid();
    this.renderBadges();
    this.renderWiki();
    this.bindGlobalEvents();
  }

  bindGlobalEvents() {
    // 音效開關
    const soundBtn = document.getElementById('btn-toggle-sound');
    if (soundBtn) {
      soundBtn.addEventListener('click', () => {
        const state = window.soundEngine.toggle();
        soundBtn.textContent = state ? '🔊' : '🔇';
        soundBtn.title = state ? '音效已開啟' : '音效已靜音';
        if (state) window.soundEngine.playPop();
      });
    }

    // 語音朗讀開關
    const speechBtn = document.getElementById('btn-toggle-speech');
    if (speechBtn) {
      speechBtn.addEventListener('click', () => {
        const state = window.soundEngine.toggleSpeech();
        speechBtn.textContent = state ? '🗣️' : '🤐';
        speechBtn.title = state ? '朗讀功能已開啟' : '朗讀功能已關閉';
        window.soundEngine.playPop();
        if (state) {
          window.soundEngine.speak('語音朗讀已開啟！');
        }
      });
    }

    // 關閉關卡視窗
    const closeBtn = document.getElementById('btn-close-modal');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        this.closeModal();
      });
    }

    // 點擊背景關閉
    const modal = document.getElementById('quest-modal');
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          this.closeModal();
        }
      });
    }

    // 關閉證書視窗
    const certCloseBtn = document.getElementById('btn-close-cert-modal');
    if (certCloseBtn) {
      certCloseBtn.addEventListener('click', () => {
        document.getElementById('cert-modal').classList.remove('open');
      });
    }

    // 生成證書按鈕
    const certGenerateBtn = document.getElementById('btn-generate-cert');
    if (certGenerateBtn) {
      certGenerateBtn.addEventListener('click', () => {
        const input = document.getElementById('input-explorer-name');
        const name = input && input.value.trim() ? input.value.trim() : "小小科學家";
        this.progress.explorerName = name;
        this.saveProgress();
        this.openCertificateModal(name);
      });
    }

    // 快速開始按鈕
    const quickStartBtn = document.getElementById('btn-hero-start');
    if (quickStartBtn) {
      quickStartBtn.addEventListener('click', () => {
        window.soundEngine.playPop();
        // 捲動到關卡地圖或直接打開當前進行中的關卡
        const targetLevel = LEVELS_DATA.find(lvl => lvl.id === this.progress.unlockedLevel) || LEVELS_DATA[0];
        this.openLevel(targetLevel.id);
      });
    }

    // 點擊背景關閉法律彈跳視窗
    document.addEventListener('click', (e) => {
      if (e.target && e.target.classList && e.target.classList.contains('modal-backdrop')) {
        e.target.classList.remove('open');
      }
    });

    // ESC 鍵關閉所有開啟的彈跳視窗
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        document.querySelectorAll('.modal-backdrop.open').forEach(m => m.classList.remove('open'));
      }
    });
  }

  getTotalStars() {
    let sum = 0;
    Object.values(this.progress.levelStars).forEach(stars => {
      sum += (stars || 0);
    });
    return sum;
  }

  renderHeaderStats() {
    const starEl = document.getElementById('nav-total-stars');
    if (starEl) {
      starEl.textContent = `⭐ ${this.getTotalStars()} / 15`;
    }
  }



  // 渲染勳章陳列館
  renderBadges() {
    const container = document.getElementById('badges-grid');
    if (!container) return;
    container.innerHTML = '';

    LEVELS_DATA.forEach(level => {
      const isUnlocked = this.progress.unlockedBadges.includes(level.badge.id);
      const badgeCard = document.createElement('div');
      badgeCard.className = `badge-item-card ${isUnlocked ? 'unlocked' : 'locked'}`;

      badgeCard.innerHTML = `
        <div class="badge-big-icon">${isUnlocked ? level.badge.icon : '❓'}</div>
        <div class="badge-name">${level.badge.name}</div>
        <div class="badge-status-text">${isUnlocked ? '✨ 已獲得' : '🔒 待解鎖'}</div>
      `;

      badgeCard.addEventListener('click', () => {
        window.soundEngine.playPop();
        if (isUnlocked) {
          alert(`【${level.badge.name}】\n\n${level.badge.desc}`);
        } else {
          alert(`通關「第 ${level.id} 關：${level.title}」即可獲得這個榮譽勳章！加油！🌟`);
        }
      });

      container.appendChild(badgeCard);
    });

    // 終極大師徽章
    const allBadgesUnlocked = LEVELS_DATA.every(lvl => this.progress.unlockedBadges.includes(lvl.badge.id));
    const masterBadge = document.createElement('div');
    masterBadge.className = `badge-item-card ${allBadgesUnlocked ? 'unlocked' : 'locked'}`;
    masterBadge.innerHTML = `
      <div class="badge-big-icon">${allBadgesUnlocked ? '🏆' : '🔒'}</div>
      <div class="badge-name">好奇心科學大師</div>
      <div class="badge-status-text">${allBadgesUnlocked ? '🌟 終極成就達成！' : '解鎖全5關獲得'}</div>
    `;
    masterBadge.addEventListener('click', () => {
      window.soundEngine.playPop();
      if (allBadgesUnlocked) {
        alert("恭喜你！你已經完成了全部關卡，成為最棒的「好奇心科學大師」！記得下方領取專屬獎狀喔！🎓");
      } else {
        alert("完成所有 5 個大冒險關卡，就能獲得最閃耀的「好奇心科學大師」金盃！🏆");
      }
    });
    container.appendChild(masterBadge);
  }

  // 渲染科學探險動畫（依各主題分區分組展示）
  renderCinemaGrid() {
    this.renderThemeFilters();

    const container = document.getElementById('cinema-video-grid');
    if (!container) return;
    container.innerHTML = '';

    // 依據篩選條件決定展示哪些主題
    const displayedThemes = this.activeThemeFilter === 'all'
      ? THEMES_CONFIG
      : THEMES_CONFIG.filter(theme => theme.id === this.activeThemeFilter);

    displayedThemes.forEach(theme => {
      const themeLevels = LEVELS_DATA.filter(lvl => lvl.themeId === theme.id);
      if (themeLevels.length === 0) return;

      const cornerShapes = {
        earth: 'portal-geo-diamond',
        body: 'portal-geo-circle',
        clock: 'portal-geo-blob',
        space: 'portal-geo-star'
      };
      const cornerClass = cornerShapes[theme.id] || 'portal-geo-star';

      const themeCard = document.createElement('div');
      themeCard.className = `theme-group-card theme-group-${theme.id}`;
      themeCard.dataset.theme = theme.id;

      // 主題標題與引導介紹（帶幾何角落裝飾）
      themeCard.innerHTML = `
        <div class="geo-card-corner ${cornerClass}" aria-hidden="true"></div>
        <div class="theme-group-header">
          <div class="theme-header-left">
            <div class="theme-icon-circle">${theme.icon}</div>
            <div class="theme-titles-block">
              <div class="theme-title-row">
                <h3 style="color:${theme.colorDark};">${theme.title}</h3>
                <span class="theme-meta-pill" style="background:${theme.lightBg}; color:${theme.colorDark}; border:none; box-shadow:0 2px 8px rgba(0,0,0,0.06);">
                  ${theme.badgeIcon} ${themeLevels.length} 部影片
                </span>
                <span class="theme-eng-tag">${theme.englishTitle}</span>
              </div>
              <p class="theme-intro-desc">${theme.description}</p>
            </div>
          </div>
        </div>
        <div class="theme-video-subgrid"></div>
      `;

      const subgrid = themeCard.querySelector('.theme-video-subgrid');

      themeLevels.forEach(level => {
        const isUnlocked = level.id <= this.progress.unlockedLevel;
        const starsEarned = this.progress.levelStars[level.id] || 0;
        let starsHtml = '';
        for (let s = 1; s <= 3; s++) {
          starsHtml += s <= starsEarned ? '⭐' : '⚪';
        }

        const card = document.createElement('div');
        card.className = 'video-card-item';
        card.innerHTML = `
          <div class="video-thumb-holder" style="cursor:pointer;" title="點擊觀看並開始闖關">
            <img src="https://i.ytimg.com/vi/${level.videoId}/hqdefault.jpg" alt="${level.title}" loading="lazy">
            <div class="video-play-badge">▶</div>
            <span style="position:absolute; top:12px; right:12px; background:rgba(0,0,0,0.65); color:white; padding:3px 8px; border-radius:9999px; font-size:0.85rem; letter-spacing:1px;">
              ${starsHtml}
            </span>
          </div>
          <div class="video-details">
            <h3>${level.subtitle}</h3>
            <p>${level.description}</p>
            <div style="display:flex; justify-content:space-between; align-items:center; gap:8px; margin-top:auto; padding-top:12px; border-top:1px dashed #E2E8F0;">
              <button class="btn-watch-yt" data-level="${level.id}" style="background:var(--macaron-pink-light); color:var(--macaron-pink-dark); border:1.5px solid var(--macaron-pink); font-weight:800; flex:1.2; text-align:center; display:inline-flex; align-items:center; justify-content:center; gap:5px;">
                <img src="assets/icons/icon_rocket_space.png" class="badge-custom-icon" alt=""> 觀看並闖關
              </button>
              <a href="https://www.youtube.com/watch?v=${level.videoId}" target="_blank" rel="noopener" class="btn-watch-yt" style="background:#FFF1F2; color:#DC2626; border:1px solid #FECDD3; font-weight:800; flex:1; text-align:center; display:inline-flex; align-items:center; justify-content:center; gap:5px;">
                <svg viewBox="0 0 28 20" width="16" height="12" style="vertical-align:middle; flex-shrink:0;"><path d="M27.4 3.1c-.3-1.2-1.2-2.1-2.4-2.4C22.9 0 14 0 14 0S5.1 0 3 .7C1.8 1 0.9 1.9 0.6 3.1 0 5.3 0 10 0 10s0 4.7.6 6.9c.3 1.2 1.2 2.1 2.4 2.4 2.1.7 11 .7 11 .7s8.9 0 11-.7c1.2-.3 2.1-1.2 2.4-2.4.6-2.2.6-6.9.6-6.9s0-4.7-.6-6.9z" fill="#FF0000"/><polygon points="11.2,5.7 18.5,10 11.2,14.3" fill="#FFFFFF"/></svg>
                YouTube
              </a>
            </div>
          </div>
        `;

        card.querySelector('.video-thumb-holder').addEventListener('click', () => {
          window.soundEngine.playPop();
          this.openLevel(level.id);
        });

        card.querySelector('[data-level]').addEventListener('click', () => {
          window.soundEngine.playPop();
          this.openLevel(level.id);
        });

        subgrid.appendChild(card);
      });

      container.appendChild(themeCard);
    });
  }

  // 渲染主題切換篩選列
  renderThemeFilters() {
    const filterContainer = document.getElementById('cinema-theme-filters');
    if (!filterContainer) return;
    filterContainer.innerHTML = '';

    // "全部主題" 膠囊
    const allPill = document.createElement('button');
    allPill.className = `theme-filter-pill ${this.activeThemeFilter === 'all' ? 'active' : ''}`;
    allPill.dataset.filter = 'all';
    allPill.innerHTML = `<img src="assets/icons/icon_rainbow_castle.png" class="badge-custom-icon" alt=""> 全部主題 <span class="pill-count">${LEVELS_DATA.length}</span>`;
    allPill.addEventListener('click', () => {
      if (this.activeThemeFilter !== 'all') {
        window.soundEngine.playPop();
        this.activeThemeFilter = 'all';
        this.renderCinemaGrid();
      }
    });
    filterContainer.appendChild(allPill);

    // 各主題膠囊
    THEMES_CONFIG.forEach(theme => {
      const count = LEVELS_DATA.filter(lvl => lvl.themeId === theme.id).length;
      const pill = document.createElement('button');
      pill.className = `theme-filter-pill ${this.activeThemeFilter === theme.id ? 'active' : ''}`;
      pill.dataset.filter = theme.id;
      pill.innerHTML = `${theme.icon} ${theme.title} <span class="pill-count">${count}</span>`;
      pill.addEventListener('click', () => {
        if (this.activeThemeFilter !== theme.id) {
          window.soundEngine.playPop();
          this.activeThemeFilter = theme.id;
          this.renderCinemaGrid();
        }
      });
      filterContainer.appendChild(pill);
    });
  }

  // 渲染科學小百科（幾何無框線版面設計）
  renderWiki() {
    const container = document.getElementById('wiki-grid');
    if (!container) return;
    container.innerHTML = '';

    const badgeClasses = ['geo-badge-circle', 'geo-badge-diamond', 'geo-badge-hexagon'];
    const cornerShapes = ['portal-geo-circle', 'portal-geo-diamond', 'portal-geo-star', 'portal-geo-blob'];

    SCIENCE_WIKI.forEach((item, idx) => {
      const card = document.createElement('div');
      card.className = 'wiki-card';
      const badgeClass = badgeClasses[idx % badgeClasses.length];
      const cornerClass = cornerShapes[idx % cornerShapes.length];

      card.innerHTML = `
        <div class="wiki-card-geo-corner ${cornerClass}" aria-hidden="true"></div>
        <div class="wiki-card-head" style="position:relative; z-index:1;">
          <div class="geo-shape-badge ${badgeClass} wiki-geo-badge">${item.icon}</div>
          <h3>${item.q}</h3>
        </div>
        <p style="position:relative; z-index:1; flex:1;">${item.a}</p>
        <button class="btn-wiki-speak" style="position:relative; z-index:1;">
          🔊 聽里里娜娜解說
        </button>
      `;

      card.querySelector('button').addEventListener('click', () => {
        window.soundEngine.playPop();
        window.soundEngine.speak(`${item.q}。答案是：${item.a}`);
      });

      container.appendChild(card);
    });
  }

  // 打開關卡視窗
  openLevel(levelId) {
    const level = LEVELS_DATA.find(lvl => lvl.id === levelId);
    if (!level) return;

    this.currentLevel = level;
    this.currentQuestionIdx = 0;
    this.levelScore = 0;
    this.userAnswers = {};
    this.hasWrongAnswer = false;

    const modal = document.getElementById('quest-modal');
    const titleEl = document.getElementById('modal-level-title');
    const subTitleEl = document.getElementById('modal-level-sub');
    const speaker = CHARACTERS[level.dialogue.speaker] || CHARACTERS.riri;

    if (titleEl) titleEl.innerHTML = `${level.icon} ${level.title}`;
    if (subTitleEl) subTitleEl.textContent = `${level.subtitle}（${level.category}）`;

    // 渲染對白
    const dialogueBox = document.getElementById('modal-dialogue-box');
    if (dialogueBox) {
      dialogueBox.innerHTML = `
        <div class="dialogue-avatar">
          <img src="${speaker.image}" alt="${speaker.name}" class="dialogue-avatar-real">
        </div>
        <div class="dialogue-text-wrap">
          <div class="dialogue-speaker">
            <span>${speaker.name}</span>
            <button class="dialogue-speech-btn" id="btn-dialogue-speak">🔊 朗讀對話</button>
          </div>
          <div class="dialogue-message">${level.dialogue.text}</div>
        </div>
      `;

      document.getElementById('btn-dialogue-speak').addEventListener('click', () => {
        window.soundEngine.playPop();
        window.soundEngine.speak(level.dialogue.text);
      });
    }

    // 渲染 YouTube 播放器
    const playerWrapper = document.getElementById('modal-video-wrapper');
    if (playerWrapper) {
      playerWrapper.innerHTML = `
        <iframe 
          src="https://www.youtube-nocookie.com/embed/${level.videoId}?rel=0&enablejsapi=1" 
          title="${level.title}" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen>
        </iframe>
      `;
    }

    // 渲染里里與娜娜的科學筆記
    const funFactEl = document.getElementById('modal-fun-fact');
    if (funFactEl) {
      funFactEl.innerHTML = `
        <div class="science-note-head">
          <div class="science-note-badge">
            <span class="note-pin">📌</span>
            <span>💡 里里與娜娜的科學筆記</span>
          </div>
          <button class="btn-listen-note" onclick="window.soundEngine.speak('里里與娜娜的科學筆記：${level.funFact.replace(/'/g, "\\\'")}'); window.soundEngine.playPop();" title="點擊朗讀筆記">
            🗣️ 聽筆記
          </button>
        </div>
        <p class="science-note-text">${level.funFact}</p>
      `;
    }

    // 渲染題目區
    this.renderQuestionView();

    // 顯示步驟 1 (影片與知識)
    this.switchQuestTab('video');

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';

    // 語音念讀導言
    if (window.soundEngine.speechEnabled) {
      setTimeout(() => {
        window.soundEngine.speak(`歡迎來到${level.title}！`);
      }, 400);
    }
  }

  switchQuestTab(tabName) {
    const videoSection = document.getElementById('modal-tab-content-video');
    const quizSection = document.getElementById('modal-tab-content-quiz');
    const tabBtns = document.querySelectorAll('.quest-tab-btn');

    tabBtns.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    if (tabName === 'video') {
      videoSection.style.display = 'block';
      quizSection.style.display = 'none';
    } else {
      videoSection.style.display = 'none';
      quizSection.style.display = 'block';
    }
  }

  renderQuestionView() {
    const container = document.getElementById('quiz-questions-wrap');
    if (!container || !this.currentLevel) return;
    container.innerHTML = '';

    const questions = this.currentLevel.questions;
    questions.forEach((q, qIndex) => {
      const qCard = document.createElement('div');
      qCard.className = 'question-card';
      qCard.id = `question-card-${qIndex}`;

      let optionsHtml = '';
      q.options.forEach((opt, optIndex) => {
        optionsHtml += `
          <button class="option-btn" data-q="${qIndex}" data-opt="${optIndex}">
            <span style="font-weight:900; color:#3B82F6;">${['A', 'B', 'C', 'D'][optIndex]}.</span>
            <span>${opt}</span>
          </button>
        `;
      });

      qCard.innerHTML = `
        <div class="question-header">
          <span class="question-number">第 ${qIndex + 1} 題 / 共 3 題</span>
          <button class="dialogue-speech-btn" data-read-q="${qIndex}">🔊 唸這題給我聽</button>
        </div>
        <div class="question-title">${q.question}</div>
        <div class="options-grid">
          ${optionsHtml}
        </div>
        <div class="question-explanation" id="explanation-${qIndex}">
          💡 <strong>科學解析：</strong>${q.explanation}
        </div>
      `;

      // 語音朗讀此題
      qCard.querySelector(`[data-read-q="${qIndex}"]`).addEventListener('click', () => {
        window.soundEngine.playPop();
        window.soundEngine.speak(`${q.question}。選項有：A，${q.options[0]}。B，${q.options[1]}。C，${q.options[2]}。D，${q.options[3]}`);
      });

      // 選項點擊事件
      qCard.querySelectorAll('.option-btn').forEach(optBtn => {
        optBtn.addEventListener('click', (e) => {
          this.handleOptionClick(qIndex, parseInt(optBtn.dataset.opt), qCard);
        });
      });

      container.appendChild(qCard);
    });

    // 結算與通關按鈕
    const submitBtnWrap = document.getElementById('quiz-submit-wrap');
    if (submitBtnWrap) {
      submitBtnWrap.innerHTML = `
        <div style="display:flex; gap:12px; flex-wrap:wrap; width:100%;">
          <button class="btn-bouncy btn-primary-start" id="btn-finish-level" style="flex:2; padding:16px;">
            🎉 完成探索，結算星光！
          </button>
          <button class="btn-bouncy" id="btn-retry-quiz" style="flex:1; background:#F1F5F9; color:#475569; border:2px solid #CBD5E1; padding:16px; font-weight:800;">
            🔄 重新作答
          </button>
        </div>
      `;

      document.getElementById('btn-finish-level').addEventListener('click', () => {
        this.finishLevel();
      });

      document.getElementById('btn-retry-quiz').addEventListener('click', () => {
        window.soundEngine.playPop();
        this.userAnswers = {};
        this.hasWrongAnswer = false;
        this.renderQuestionView();
      });
    }
  }

  handleOptionClick(qIndex, selectedOpt, cardEl) {
    const q = this.currentLevel.questions[qIndex];
    const isCorrect = selectedOpt === q.correctIndex;

    const allBtns = cardEl.querySelectorAll('.option-btn');
    allBtns.forEach((btn, idx) => {
      btn.classList.remove('selected-correct', 'selected-wrong');
      if (idx === q.correctIndex) {
        btn.classList.add('selected-correct');
      } else if (idx === selectedOpt && !isCorrect) {
        btn.classList.add('selected-wrong');
      }
    });

    const expEl = cardEl.querySelector(`#explanation-${qIndex}`);
    if (expEl) {
      expEl.classList.add('show');
      if (isCorrect) {
        expEl.innerHTML = `<span style="color:#16A34A; font-weight:800;">✅ 答對了！</span><br>💡 <strong>科學解析：</strong>${q.explanation}`;
      } else {
        expEl.innerHTML = `<span style="color:#DC2626; font-weight:800;">❌ 沒關係再試一次！</span><br>💡 <strong>科學解析：</strong>${q.explanation}`;
      }
    }

    if (isCorrect) {
      window.soundEngine.playCorrect();
      this.userAnswers[qIndex] = true;
    } else {
      window.soundEngine.playWrong();
      this.hasWrongAnswer = true;
      this.userAnswers[qIndex] = false;
      window.soundEngine.speak("沒關係再試一次");
    }
  }

  finishLevel() {
    const levelId = this.currentLevel.id;

    // 檢查是否回答完所有題目
    const totalQuestions = this.currentLevel.questions.length;
    const answeredCount = Object.keys(this.userAnswers).length;
    if (answeredCount < totalQuestions) {
      alert("還有題目還沒作答完成喔！請回答完所有問題再結算～🌟");
      return;
    }

    // 闖關如果答錯了：要說「沒關係再試一次」，最後不能給星星和灑花
    if (this.hasWrongAnswer) {
      window.soundEngine.playWrong();
      window.soundEngine.speak("沒關係再試一次");
      alert("答錯了，沒關係再試一次！\n這次不能給星星和灑花喔，重新挑戰全部答對就能獲得 ⭐⭐⭐ 滿星！加油！💪✨");
      // 重設作答狀態，讓小朋友重新作答挑戰
      this.userAnswers = {};
      this.hasWrongAnswer = false;
      this.renderQuestionView();
      return;
    }

    // 全部答對，沒有答錯：給予 3 顆滿星與撒花
    this.progress.levelStars[levelId] = 3;
    this.saveProgress();

    // 播放勝利音效與慶祝撒花
    window.soundEngine.playVictory();
    if (this.confetti) {
      this.confetti.fire();
      setTimeout(() => this.confetti.fire(), 400);
    }

    // 更新介面
    this.renderCinemaGrid();

    // 成功通關提示
    alert(`🎉 太棒了！全部答對！\n\n獲得 ⭐⭐⭐ 三顆滿星！繼續探索更多奇妙科學吧！🚀`);

    this.closeModal();
  }

  closeModal() {
    const modal = document.getElementById('quest-modal');
    if (modal) {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      // 停止影片播放
      const playerWrapper = document.getElementById('modal-video-wrapper');
      if (playerWrapper) playerWrapper.innerHTML = '';
      window.soundEngine.stopSpeech();
    }
  }

  openCertificateModal(childName) {
    window.soundEngine.playVictory();
    if (this.confetti) this.confetti.fire();

    const certModal = document.getElementById('cert-modal');
    const nameEl = document.getElementById('cert-kid-name-display');
    const dateEl = document.getElementById('cert-date-display');

    if (nameEl) nameEl.textContent = childName;
    if (dateEl) {
      const today = new Date();
      dateEl.textContent = `${today.getFullYear()} 年 ${today.getMonth() + 1} 月 ${today.getDate()} 日`;
    }

    certModal.classList.add('open');
  }
}

// 啟動全域應用實例
document.addEventListener('DOMContentLoaded', () => {
  window.adventureApp = new AdventureApp();
  window.adventureApp.init();

  // 標籤切換按鈕綁定
  document.querySelectorAll('.quest-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      window.soundEngine.playPop();
      window.adventureApp.switchQuestTab(btn.dataset.tab);
    });
  });

  // 平滑錨點跳轉
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        window.soundEngine.playPop();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // 初始化動態自轉地球游標
  initRotatingEarthCursor();

  // 初始化地球游標星塵拖尾動態
  initEarthCursorTrail();
});

// 動態自轉地球游標系統 (Dynamic Rotating Earth Cursor)
function initRotatingEarthCursor() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  // 建立動態地球游標節點
  let cursorEl = document.getElementById('earth-follower-cursor');
  if (!cursorEl) {
    cursorEl = document.createElement('div');
    cursorEl.id = 'earth-follower-cursor';
    cursorEl.className = 'earth-follower-cursor';
    cursorEl.setAttribute('aria-hidden', 'true');
    cursorEl.innerHTML = `
      <svg class="earth-follower-svg" viewBox="0 0 42 42" width="42" height="42">
        <defs>
          <radialGradient id="followerGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stop-color="#38BDF8" stop-opacity="0.6"/>
            <stop offset="65%" stop-color="#60A5FA" stop-opacity="0.25"/>
            <stop offset="100%" stop-color="#38BDF8" stop-opacity="0"/>
          </radialGradient>
          <radialGradient id="followerOcean" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stop-color="#60A5FA"/>
            <stop offset="55%" stop-color="#2563EB"/>
            <stop offset="100%" stop-color="#1D4ED8"/>
          </radialGradient>
          <clipPath id="earthFollowerClip">
            <circle cx="21" cy="21" r="11"/>
          </clipPath>
        </defs>
        <!-- 大氣層外圍光暈 -->
        <circle class="earth-glow-halo" cx="21" cy="21" r="15" fill="url(#followerGlow)"/>
        <!-- 海洋基底球體 -->
        <circle cx="21" cy="21" r="11" fill="url(#followerOcean)"/>
        <!-- 自轉大陸板塊與大氣雲層 -->
        <g clip-path="url(#earthFollowerClip)">
          <g class="earth-continents-strip">
            <!-- 第 1 區塊 -->
            <path d="M4 11 Q8 9 9 13 Q10 17 7 19 Q8 23 10 27 Q6 27 5 24 Q4 21 3 16 Z" fill="#22C55E"/>
            <path d="M15 9 Q20 8 22 12 Q19 14 17 13 Q16 15 18 17 Q21 18 20 23 Q17 25 15 21 Q14 17 15 14 Z" fill="#16A34A"/>
            <path d="M23 10 Q28 9 31 13 Q32 17 28 18 Q25 17 24 14 Z" fill="#22C55E"/>
            <circle cx="28" cy="24" r="2" fill="#4ADE80"/>
            <circle cx="11" cy="15" r="1.2" fill="#86EFAC"/>
            <!-- 第 2 區塊 (無縫接軌輪播) -->
            <path d="M40 11 Q44 9 45 13 Q46 17 43 19 Q44 23 46 27 Q42 27 41 24 Q40 21 39 16 Z" fill="#22C55E"/>
            <path d="M51 9 Q56 8 58 12 Q55 14 53 13 Q52 15 54 17 Q57 18 56 23 Q53 25 51 21 Q50 17 51 14 Z" fill="#16A34A"/>
            <path d="M59 10 Q64 9 67 13 Q68 17 64 18 Q61 17 60 14 Z" fill="#22C55E"/>
            <circle cx="64" cy="24" r="2" fill="#4ADE80"/>
            <circle cx="47" cy="15" r="1.2" fill="#86EFAC"/>
          </g>
          <g class="earth-clouds-strip">
            <path d="M6 14 Q12 12 18 14" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
            <path d="M14 23 Q20 22 26 24" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>
            <path d="M24 16 Q28 17 32 16" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>
            <path d="M42 14 Q48 12 54 14" fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity="0.8"/>
            <path d="M50 23 Q56 22 62 24" fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" opacity="0.75"/>
            <path d="M60 16 Q64 17 68 16" fill="none" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity="0.65"/>
          </g>
          <!-- 3D 球體右下方暗部陰影 -->
          <path d="M14 27 A11 11 0 0 0 32 21 A11 11 0 0 1 14 27" fill="#0F172A" opacity="0.32"/>
        </g>
        <!-- 大氣層邊緣細緻高光 -->
        <circle cx="21" cy="21" r="11" fill="none" stroke="#BAE6FD" stroke-width="1" opacity="0.85"/>
        <!-- 左上方玻璃感反光 -->
        <circle cx="17.2" cy="16.5" r="2.2" fill="#FFFFFF" opacity="0.85"/>
        <circle cx="15.2" cy="19.2" r="0.9" fill="#FFFFFF" opacity="0.6"/>
        <!-- 點擊準星閃爍小星標 (位於左上角 3, 3) -->
        <g class="earth-pointer-star">
          <polygon points="3,0 4.3,2.2 6.8,3 4.3,3.8 3,6 1.7,3.8 -0.8,3 1.7,2.2" fill="#FBBF24" stroke="#D97706" stroke-width="0.6"/>
          <circle cx="3" cy="3" r="1.1" fill="#FFFFFF"/>
        </g>
        <!-- 懸停時環繞的小衛星 -->
        <g class="earth-satellite-wrap">
          <ellipse cx="21" cy="21" rx="15" ry="6" transform="rotate(-30 21 21)" fill="none" stroke="#FDE047" stroke-width="0.8" stroke-dasharray="2 3" opacity="0.85"/>
          <rect x="31" y="11" width="2.6" height="2.6" fill="#F59E0B" rx="0.5" transform="rotate(20 32 12)"/>
        </g>
      </svg>
    `;
    document.body.appendChild(cursorEl);
    document.body.classList.add('has-rotating-earth');
  }

  let mouseX = -100;
  let mouseY = -100;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursorEl.classList.add('is-active');
    cursorEl.style.transform = `translate3d(${mouseX - 3}px, ${mouseY - 3}px, 0)`;
  }, { passive: true });

  window.addEventListener('mouseenter', () => {
    cursorEl.classList.add('is-active');
  });

  window.addEventListener('mouseleave', () => {
    cursorEl.classList.remove('is-active');
  });

  window.addEventListener('mousedown', () => {
    cursorEl.classList.add('is-clicking');
  });

  window.addEventListener('mouseup', () => {
    cursorEl.classList.remove('is-clicking');
  });

  // 偵測可互動點擊目標
  const interactiveTarget = 'a, button, [role="button"], input, select, label, .portal-nav-card, .video-thumb-holder, .btn-watch-yt, .btn-wiki-speak, .theme-filter-pill, .quest-tab-btn, .quiz-opt-btn, .icon-control-btn, .btn-bouncy, .inquiry-card, .wiki-card, .concept-feature-card, .parent-tip-card, .character-detail-card, .geo-question-pill';

  document.addEventListener('mouseover', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveTarget)) {
      cursorEl.classList.add('is-hovering');
    }
  }, { passive: true });

  document.addEventListener('mouseout', (e) => {
    if (e.target && e.target.closest && e.target.closest(interactiveTarget)) {
      cursorEl.classList.remove('is-hovering');
    }
  }, { passive: true });
}

// 地球游標星塵拖尾動態 (Earth Stardust Cursor Trail)
function initEarthCursorTrail() {
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const sparkles = ['✦', '★', '•', '✨'];
  const colors = ['#38BDF8', '#4ADE80', '#FBBF24', '#60A5FA', '#34D399'];
  let lastX = 0;
  let lastY = 0;
  let lastTime = 0;

  window.addEventListener('mousemove', (e) => {
    const now = Date.now();
    // 距離至少移動 16px 且節流 40ms，兼顧極速效能與流暢度
    const dist = Math.hypot(e.clientX - lastX, e.clientY - lastY);
    if (dist < 16 || now - lastTime < 40) return;

    lastX = e.clientX;
    lastY = e.clientY;
    lastTime = now;

    const star = document.createElement('span');
    star.className = 'cursor-stardust';
    star.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
    star.style.left = `${e.clientX + (Math.random() * 8 - 4)}px`;
    star.style.top = `${e.clientY + (Math.random() * 8 - 4)}px`;
    star.style.color = colors[Math.floor(Math.random() * colors.length)];
    star.style.fontSize = `${Math.floor(Math.random() * 6 + 10)}px`;

    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 600);
  }, { passive: true });
}

