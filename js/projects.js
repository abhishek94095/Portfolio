/**
 * projects.js
 * Split-panel project showcase with hover/click/persist interaction.
 */
(function () {

    // --- State ---
    const state = { active: 0, hovered: null, tab: 'overview' };

    // --- Tech icon registry ---
    const ICONS = {
        unity:            { devicon: 'unity/unity-original',         color: '#ffffff', bg: '#222' },
        csharp:           { devicon: 'csharp/csharp-original',       color: '#9B4F96', bg: '#1a0d1a' },
        firebase:         { devicon: 'firebase/firebase-plain',      color: '#FFCA28', bg: '#1a1500' },
        git:              { devicon: 'git/git-original',             color: '#F05032', bg: '#1a0a08' },
        gitlab:           { devicon: 'gitlab/gitlab-original',       color: '#FC6D26', bg: '#1a0e06' },
        android:          { devicon: 'android/android-plain',        color: '#3DDC84', bg: '#0a1a10' },
        photon:           { initials: 'PUN',  color: '#00B4FF', bg: '#001a26' },
        vcontainer:       { initials: 'VC',   color: '#7C4DFF', bg: '#0f0a1a' },
        addressables:     { initials: 'ADDR', color: '#E91E63', bg: '#1a040e' },
        iap:              { initials: 'IAP',  color: '#FF9800', bg: '#1a0d00' },
        gpt:              { initials: 'GPT',  color: '#10A37F', bg: '#051a12' },
        webgl:            { initials: 'GL',   color: '#990000', bg: '#1a0000' },
        adsdk:            { initials: 'ADS',  color: '#FF6B35', bg: '#1a0d08' },
        scriptableobjects:{ initials: 'SO',   color: '#2196F3', bg: '#031626' },
        liveops:          { initials: 'LO',   color: '#4CAF50', bg: '#051a07' }
    };

    const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';

    function iconHTML(key) {
        const cfg = ICONS[key] || { initials: key.slice(0,2).toUpperCase(), color: '#aaa', bg: '#1a1a2e' };
        const inner = cfg.devicon
            ? `<img src="${DEVICON_BASE}${cfg.devicon}.svg" alt="${key}" class="pstack__img" onerror="this.parentElement.innerHTML='<span class=pstack__init style=color:${cfg.color}>${cfg.initials||key.slice(0,2).toUpperCase()}</span>'">`
            : `<span class="pstack__init" style="color:${cfg.color}">${cfg.initials}</span>`;
        return `<div class="pstack__icon" style="background:${cfg.bg}" title="${key}">${inner}</div>`;
    }

    // --- Render helpers ---
    function renderListItem(p, i) {
        return `
        <div class="plist__item" data-index="${i}">
            <div class="plist__thumb">
                <img src="${p.logo}" alt="${p.shortTitle}" loading="lazy" onerror="this.style.display='none'">
            </div>
            <div class="plist__meta">
                <div class="plist__title">${p.shortTitle}</div>
                <div class="plist__role">${p.role}</div>
                <div class="plist__platform">${p.platform}</div>
            </div>
        </div>`;
    }

    function renderOverview(p) {
        const featurePills = p.features.map(f => `<span class="pdet__pill">${f}</span>`).join('');
        return `
        <div class="pdet__desc">${p.description}</div>
        <div class="pdet__features">${featurePills}</div>
        ${p.metric ? `<div class="pdet__metric"><span class="pdet__metric-label">${p.metric.label}:</span> ${p.metric.value}</div>` : ''}`;
    }

    function renderRole(p) {
        const items = p.myRole.map(r => `<li>${r}</li>`).join('');
        return `<ul class="pdet__role-list">${items}</ul>`;
    }

    function renderTech(p) {
        return `<div class="pdet__stack">${p.techStack.map(t =>
            `<div class="pstack__item">${iconHTML(t)}<span class="pstack__name">${t.charAt(0).toUpperCase()+t.slice(1)}</span></div>`
        ).join('')}</div>`;
    }

    function renderMedia(p) {
        const src = p.video ? `videos/${p.video}` : p.logo;
        const isVideo = !!p.video;
        const media = isVideo
            ? `<video class="pdet__media-item" autoplay muted loop playsinline><source src="${src}" type="video/mp4"></video>`
            : `<img class="pdet__media-item" src="${src}" alt="${p.title}">`;
        const extras = (p.screenshots || []).map(s =>
            `<img class="pdet__thumb" src="${s}" alt="screenshot">`
        ).join('');
        return `<div class="pdet__media-wrap">${media}</div>${extras ? `<div class="pdet__thumbs">${extras}</div>` : ''}`;
    }

    function renderLinks(p) {
        if (!p.links) return `<p class="pdet__no-link">No public link available.</p>`;
        const main = `<a class="pdet__btn" href="${p.links.main}" target="_blank" rel="noopener">${p.links.label} ↗</a>`;
        const extras = (p.links.extras || []).map(e =>
            `<a class="pdet__btn pdet__btn--sm" href="${e.url}" target="_blank" rel="noopener">${e.label}</a>`
        ).join('');
        return `<div class="pdet__links-wrap">${main}${extras}</div>`;
    }

    function tabContent(p) {
        switch (state.tab) {
            case 'overview': return renderOverview(p);
            case 'role':     return renderRole(p);
            case 'tech':     return renderTech(p);
            case 'media':    return renderMedia(p);
            case 'links':    return renderLinks(p);
        }
    }

    // --- Detail update (no full re-render, just swap content) ---
    function updateDetail(p) {
        const el = document.getElementById('pdet-content');
        const hero = document.getElementById('pdet-hero');
        const title = document.getElementById('pdet-title');
        const role = document.getElementById('pdet-role');
        const platform = document.getElementById('pdet-platform');

        if (!el) return;

        title.textContent = p.title;
        role.textContent = p.role;
        platform.textContent = p.platform;

        if (p.video) {
            hero.innerHTML = `<video autoplay muted loop playsinline><source src="videos/${p.video}" type="video/mp4"></video>`;
        } else if (p.logo) {
            hero.innerHTML = `<img src="${p.logo}" alt="${p.title}">`;
        }

        el.innerHTML = tabContent(p);
    }

    function updateActiveList(projects) {
        const displayIdx = state.hovered !== null ? state.hovered : state.active;
        document.querySelectorAll('.plist__item').forEach((el, i) => {
            el.classList.toggle('plist__item--active', i === displayIdx);
        });
    }

    // --- Theme toggle ---
    function initTheme() {
        const saved = localStorage.getItem('portfolio-theme') || 'dark';
        document.body.classList.toggle('light-mode', saved === 'light');
        updateThemeBtn(saved);
    }

    function updateThemeBtn(theme) {
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
    }

    function toggleTheme() {
        const isLight = document.body.classList.toggle('light-mode');
        const theme = isLight ? 'light' : 'dark';
        localStorage.setItem('portfolio-theme', theme);
        updateThemeBtn(theme);
    }

    // --- Bind events ---
    function bindEvents(projects) {
        const list = document.getElementById('plist');
        const container = document.getElementById('proj-showcase');

        list.addEventListener('mouseover', function (e) {
            const item = e.target.closest('.plist__item');
            if (!item) return;
            const idx = parseInt(item.dataset.index);
            state.hovered = idx;
            updateActiveList(projects);
            updateDetail(projects[idx]);
        });

        list.addEventListener('mouseleave', function () {
            state.hovered = null;
            updateActiveList(projects);
            updateDetail(projects[state.active]);
        });

        list.addEventListener('click', function (e) {
            const item = e.target.closest('.plist__item');
            if (!item) return;
            state.active = parseInt(item.dataset.index);
            state.hovered = null;
            updateActiveList(projects);
            updateDetail(projects[state.active]);
        });

        document.querySelectorAll('.pdet__tab').forEach(btn => {
            btn.addEventListener('click', function () {
                state.tab = this.dataset.tab;
                document.querySelectorAll('.pdet__tab').forEach(b => b.classList.toggle('pdet__tab--active', b === this));
                updateDetail(projects[state.hovered !== null ? state.hovered : state.active]);
            });
        });

        const themeBtn = document.getElementById('theme-toggle');
        if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    }

    // --- Init ---
    function init(projects) {
        const list = document.getElementById('plist');
        list.innerHTML = projects.map(renderListItem).join('');
        updateDetail(projects[0]);
        updateActiveList(projects);
        bindEvents(projects);
        initTheme();
    }

    function load() {
        const container = document.getElementById('proj-showcase');
        if (!container) return;
        fetch('data/projects.json')
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(init)
            .catch(err => { console.error('Projects failed:', err); });
    }

    document.readyState === 'loading'
        ? document.addEventListener('DOMContentLoaded', load)
        : load();

})();
