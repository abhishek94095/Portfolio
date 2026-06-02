(function () {
    const state = { active: 0, hovered: null };
    const ICONS = {
        unity: { devicon: 'unity/unity-original', color: '#ffffff', bg: '#222' },
        csharp: { devicon: 'csharp/csharp-original', color: '#9B4F96', bg: '#f5eefa' },
        firebase: { devicon: 'firebase/firebase-plain', color: '#FFCA28', bg: '#fffde7' },
        git: { devicon: 'git/git-original', color: '#F05032', bg: '#fff0ee' },
        gitlab: { devicon: 'gitlab/gitlab-original', color: '#FC6D26', bg: '#fff3ee' },
        android: { devicon: 'android/android-plain', color: '#3DDC84', bg: '#edfaf3' },
        photon: { initials: 'PUN', color: '#00B4FF', bg: '#e8f7ff' },
        vcontainer: { initials: 'VC', color: '#7C4DFF', bg: '#f0ecff' },
        addressables: { initials: 'ADDR', color: '#E91E63', bg: '#fde8f0' },
        iap: { initials: 'IAP', color: '#FF9800', bg: '#fff3e0' },
        gpt: { initials: 'GPT', color: '#10A37F', bg: '#e8faf5' },
        webgl: { initials: 'GL', color: '#990000', bg: '#ffeaea' },
        adsdk: { initials: 'ADS', color: '#FF6B35', bg: '#fff0ea' },
        scriptableobjects: { initials: 'SO', color: '#1565C0', bg: '#e8f0fe' },
        liveops: { initials: 'LO', color: '#2E7D32', bg: '#e8f5e9' }
    };
    const DEVICON_BASE = 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/';
    function iconHTML(key) {
        const cfg = ICONS[key] || { initials: key.slice(0, 2).toUpperCase(), color: '#888', bg: '#eee' };
        const fallback = cfg.initials || key.slice(0, 2).toUpperCase();
        const inner = cfg.devicon ? `<img src="${DEVICON_BASE}${cfg.devicon}.svg" alt="${key}" class="pstack__img" onerror="this.parentElement.innerHTML='<span class=pstack__init style=color:${cfg.color}>${fallback}</span>'">` : `<span class="pstack__init" style="color:${cfg.color}">${fallback}</span>`;
        return `<div class="pstack__icon" style="background:${cfg.bg}" title="${key}">${inner}</div>`;
    }
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
                <div class="plist__desc" style="font-size:0.75em;color:#8888a8;margin-top:6px;white-space:normal;line-height:1.4;">${p.description}</div>
            </div>
        </div>`;
    }
    function renderDetail(p) {
        const features = p.features.map(f => `<span class="pdet__pill">${f}</span>`).join('');
        const techIcons = p.techStack.map(t => `
        <div class="pstack__item">
            ${iconHTML(t)}
            <span class="pstack__name">${t.charAt(0).toUpperCase() + t.slice(1)}</span>
        </div>`).join('');
        const roleItems = p.myRole.map(r => `<li>${r}</li>`).join('');
        const metric = p.metric ? `<div class="pdet__metric"><span class="pdet__metric-label">${p.metric.label}:</span> ${p.metric.value}</div>` : '';
        let links = '';
        if (p.links) {
            const main = `<a class="pdet__btn" href="${p.links.main}" target="_blank" rel="noopener">${p.links.label} ↗</a>`;
            const extras = (p.links.extras || []).map(e => `<a class="pdet__btn pdet__btn--sm" href="${e.url}" target="_blank" rel="noopener">${e.label}</a>`).join('');
            links = `<div class="pdet__links-wrap">${main}${extras}</div>`;
        }
        return `
        <div class="pdet__section">
            <div class="pdet__section-label">Features</div>
            <div class="pdet__features">${features}</div>
        </div>
        <div class="pdet__section">
            <div class="pdet__section-label">Tech Stack</div>
            <div class="pdet__stack">${techIcons}</div>
        </div>
        <div class="pdet__section">
            <div class="pdet__section-label">My Role</div>
            <ul class="pdet__role-list">${roleItems}</ul>
        </div>
        ${metric}
        ${links}`;
    }
    function updateDetail(p) {
        const hero = document.getElementById('pdet-hero');
        const title = document.getElementById('pdet-title');
        const role = document.getElementById('pdet-role');
        const platform = document.getElementById('pdet-platform');
        const content = document.getElementById('pdet-content');
        if (!content) return;
        title.textContent = p.title;
        role.textContent = p.role;
        platform.textContent = p.platform;
        if (p.video) {
            hero.innerHTML = `<video autoplay muted loop playsinline><source src="videos/${p.video}" type="video/mp4"></video>`;
        } else if (p.logo) {
            hero.innerHTML = `<img src="${p.logo}" alt="${p.title}">`;
        }
        content.innerHTML = renderDetail(p);
    }
    function updateList() {
        const idx = state.hovered !== null ? state.hovered : state.active;
        document.querySelectorAll('.plist__item').forEach((el, i) => el.classList.toggle('plist__item--active', i === idx));
    }
    function applyTheme(theme) {
        document.body.classList.toggle('dark-mode', theme === 'dark');
        const btn = document.getElementById('theme-toggle');
        if (btn) btn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
        localStorage.setItem('portfolio-theme', theme);
    }
    function initTheme() {
        const saved = localStorage.getItem('portfolio-theme') || 'light';
        applyTheme(saved);
    }
    function bindEvents(projects) {
        const list = document.getElementById('plist');
        list.addEventListener('mouseover', function (e) {
            const item = e.target.closest('.plist__item');
            if (!item) return;
            const idx = parseInt(item.dataset.index);
            if (state.hovered === idx) return;
            state.hovered = idx;
            updateList();
            updateDetail(projects[idx]);
        });
        list.addEventListener('mouseleave', function () {
            state.hovered = null;
            updateList();
            updateDetail(projects[state.active]);
        });
        list.addEventListener('click', function (e) {
            const item = e.target.closest('.plist__item');
            if (!item) return;
            state.active = parseInt(item.dataset.index);
            state.hovered = null;
            updateList();
            updateDetail(projects[state.active]);
        });
        const btn = document.getElementById('theme-toggle');
        if (btn) {
            btn.addEventListener('click', function () {
                const isDark = document.body.classList.contains('dark-mode');
                applyTheme(isDark ? 'light' : 'dark');
            });
        }
    }
    function init(projects) {
        document.getElementById('plist').innerHTML = projects.map(renderListItem).join('');
        updateDetail(projects[0]);
        updateList();
        bindEvents(projects);
        initTheme();
    }
    function load() {
        if (!document.getElementById('proj-showcase')) return;
        fetch('data/projects.json')
            .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
            .then(init)
            .catch(err => console.error('Projects load failed:', err));
    }
    document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', load) : load();
})();