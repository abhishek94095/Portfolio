/**
 * projects.js
 * Responsibility: Fetch projects.json and render cards into #projects-container.
 */

(function () {

    const CONTAINER_ID = 'projects-container';

    function renderTags(tags) {
        return tags.map(tag => `<span class="pcard__tag">${tag}</span>`).join('');
    }

    function renderMetric(metric) {
        if (!metric) return '';
        return `
            <div class="pcard__metric">
                <span class="pcard__metric-label">${metric.label}:</span>
                <span class="pcard__metric-value">${metric.value}</span>
            </div>`;
    }

    function renderMedia(project) {
        if (project.video) {
            return `
                <div class="pcard__media">
                    <video class="pcard__video" autoplay muted loop playsinline poster="${project.logo || ''}">
                        <source src="videos/${project.video}" type="video/mp4">
                    </video>
                </div>`;
        }
        if (project.logo) {
            return `
                <div class="pcard__media">
                    <img class="pcard__logo" src="${project.logo}" alt="${project.title}" loading="lazy">
                </div>`;
        }
        return '<div class="pcard__media pcard__media--empty"></div>';
    }

    function renderExtraLinks(extras) {
        if (!extras || extras.length === 0) return '';
        const items = extras.map(e =>
            `<a class="pcard__extra-link" href="${e.url}" target="_blank" rel="noopener">${e.label}</a>`
        ).join('');
        return `<div class="pcard__extras">${items}</div>`;
    }

    function renderMainLink(links) {
        if (!links || !links.main) return '';
        return `<a class="pcard__link" href="${links.main}" target="_blank" rel="noopener">${links.label} ↗</a>`;
    }

    function renderCard(project) {
        const extras = project.links && project.links.extras ? project.links.extras : [];
        return `
            <div class="pcard shadow-large" id="project-${project.id}">
                ${renderMedia(project)}
                <div class="pcard__body">
                    <h3 class="pcard__title">${project.title}</h3>
                    <p class="pcard__desc">${project.description}</p>
                    <div class="pcard__tags">${renderTags(project.tags)}</div>
                    ${renderMetric(project.metric)}
                    <div class="pcard__footer">
                        ${renderMainLink(project.links)}
                        ${renderExtraLinks(extras)}
                    </div>
                </div>
            </div>`;
    }

    function onProjectsLoaded(projects) {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) return;
        container.innerHTML = projects.map(renderCard).join('');
    }

    function onLoadError(err) {
        console.error('Projects failed to load:', err);
        const container = document.getElementById(CONTAINER_ID);
        if (container) {
            container.innerHTML = '<p class="pcard__error">Projects could not be loaded.</p>';
        }
    }

    function init() {
        const container = document.getElementById(CONTAINER_ID);
        if (!container) return;

        fetch('data/projects.json')
            .then(function (res) {
                if (!res.ok) throw new Error('HTTP ' + res.status);
                return res.json();
            })
            .then(onProjectsLoaded)
            .catch(onLoadError);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
