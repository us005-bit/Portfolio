/* =============================================
   PAGE SWITCHING
   ============================================= */
function switchPage(page) {
  document.body.setAttribute('data-page', page);
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.toggle('active', t.dataset.page === page));
  document.querySelectorAll('.page').forEach(p => p.classList.toggle('hidden', p.id !== 'page-' + page));
  const activePage = document.getElementById('page-' + page);
  if (activePage) { activePage.style.animation='none'; activePage.offsetHeight; activePage.style.animation=''; }
  if (page === 'projects' && !window.githubLoaded) loadGithubRepos();
  window.scrollTo({ top:0, behavior:'smooth' });
}

/* =============================================
   CONTACT FORM
   Uses Web3Forms — free static form service.
   Get your free access key at: https://web3forms.com
   Replace YOUR_ACCESS_KEY_HERE with your actual key.
   ============================================= */
const WEB3FORMS_KEY = 'YOUR_ACCESS_KEY_HERE';

async function submitContact(e) {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById('submitBtn');
  const msgEl = document.getElementById('formMsg');
  const submitText = document.getElementById('submitText');

  const payload = {
    access_key: WEB3FORMS_KEY,
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim() || 'Portfolio Contact Form',
    message: form.message.value.trim(),
    from_name: 'Uddipt Portfolio'
  };

  btn.disabled = true;
  submitText.textContent = 'Sending...';
  msgEl.textContent = '';
  msgEl.className = 'form-msg';

  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });
    const result = await res.json();
    if (result.success) {
      msgEl.textContent = '✓ Message received! I will get back to you soon.';
      msgEl.className = 'form-msg';
      form.reset();
    } else {
      msgEl.textContent = '✗ ' + (result.message || 'Something went wrong.');
      msgEl.className = 'form-msg error';
    }
  } catch (err) {
    msgEl.textContent = '✗ Network error. Please try again.';
    msgEl.className = 'form-msg error';
  } finally {
    btn.disabled = false;
    submitText.textContent = 'Send Message';
  }
}

/* =============================================
   GITHUB REPOS
   ============================================= */
const GITHUB_USER = 'us005-bit';

const STACK_RULES = [
  { stack:'datascience',   keywords:['sentiment','nlp','ml','classifier','model','pytorch','hugging','bert','deep','neural','prediction','forecast','machine-learning','deep-learning'] },
  { stack:'dataanalytics', keywords:['powerbi','power-bi','inventory','sql','dashboard','analytics','analysis','visualization','data','mysql'] },
  { stack:'systemdesign',  keywords:['lld','system-design','systemdesign','systemdesignlld','design','oop','solid','pattern','low-level'] },
  { stack:'genai',         keywords:['genai','gpt','llm','langchain','agent','rag','openai','gemini','langgraph'] }
];

const FEATURED_REPO_FRAGMENTS = [
  'ecommerce','sentiment','inventory','powerbi','power-bi','world-indicator','system-design','lld','systemdesignlld'
];

function classifyRepo(repo) {
  const rawName = repo.name.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2');
  const combined = [rawName, repo.description || '', (repo.topics || []).join(' ')].join(' ').toLowerCase().replace(/[-_]/g,' ');
  for (const rule of STACK_RULES) {
    if (rule.keywords.some(kw => combined.includes(kw))) return rule.stack;
  }
  return null;
}

function getStackBadgeClass(stack) {
  return { datascience:'ds', dataanalytics:'da', systemdesign:'sd', genai:'ga' }[stack] || 'ds';
}
function getStackLabel(stack) {
  return { datascience:'Data Science', dataanalytics:'Data Analytics', systemdesign:'System Design', genai:'GenAI' }[stack] || stack;
}

function buildGithubCard(repo, stack) {
  const bc = getStackBadgeClass(stack);
  const bl = getStackLabel(stack);
  const desc = repo.description || 'No description provided.';
  const lang = repo.language || '';
  const stars = repo.stargazers_count || 0;
  const ghIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg>`;
  const liveIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>`;
  const name = repo.name.replace(/-/g,' ').replace(/\b\w/g, c => c.toUpperCase());
  return `<div class="project-card github-card glass-card" data-stack="${stack}">
    <div class="project-card-top">
      <div class="project-stack-badge ${bc}">${bl}</div>
      <div class="project-links">
        <a href="${repo.html_url}" target="_blank" class="proj-link" title="GitHub">${ghIcon}</a>
        ${repo.homepage ? `<a href="${repo.homepage}" target="_blank" class="proj-link live" title="Live Demo">${liveIcon}</a>` : ''}
      </div>
    </div>
    <h3 class="project-title">${name}</h3>
    <p class="project-desc">${desc}</p>
    <div class="project-tags">
      ${lang ? `<span class="ptag">${lang}</span>` : ''}
      ${stars > 0 ? `<span class="ptag">★ ${stars}</span>` : ''}
    </div>
  </div>`;
}

async function loadGithubRepos() {
  const grid = document.getElementById('githubGrid');
  try {
    const res = await fetch(`https://api.github.com/users/${GITHUB_USER}/repos?per_page=100&sort=updated`);
    if (!res.ok) throw new Error('GitHub API error');
    const repos = await res.json();
    const cards = [];
    for (const repo of repos) {
      if (repo.fork) continue;
      const nameLower = repo.name.toLowerCase();
      if (FEATURED_REPO_FRAGMENTS.some(f => nameLower.includes(f))) continue;
      const stack = classifyRepo(repo);
      if (!stack) continue;
      cards.push({ repo, stack });
    }
    grid.innerHTML = cards.length
      ? cards.map(({ repo, stack }) => buildGithubCard(repo, stack)).join('')
      : '<p style="color:var(--text-dim);font-size:14px;padding:20px 0">No additional repos found.</p>';
    window.githubLoaded = true;
    applyCurrentFilter();
  } catch (err) {
    document.getElementById('githubLoading').innerHTML = `<p style="color:var(--text-dim);font-size:14px">Could not load GitHub repos. <a href="https://github.com/${GITHUB_USER}" target="_blank" style="color:var(--accent-projects)">View on GitHub →</a></p>`;
  }
}

/* =============================================
   PROJECT FILTERING
   ============================================= */
let currentFilter = 'all';

function filterProjects(filter, btn) {
  currentFilter = filter;
  document.querySelectorAll('.filter-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  applyCurrentFilter();
}

function applyCurrentFilter() {
  const filter = currentFilter;
  const genaiEmpty     = document.getElementById('genaiEmpty');
  const featuredSection = document.getElementById('featuredSection');
  const githubSection  = document.getElementById('githubSection');

  // GenAI: show empty state, hide everything else
  if (filter === 'genai') {
    genaiEmpty.classList.remove('hidden');
    featuredSection.classList.add('hidden');
    githubSection.classList.add('hidden');
    return;
  }

  // All other filters: hide genai empty, show sections
  genaiEmpty.classList.add('hidden');
  featuredSection.classList.remove('hidden');
  githubSection.classList.remove('hidden');

  document.querySelectorAll('#featuredGrid .project-card').forEach(card => {
    card.style.display = (filter === 'all' || card.dataset.stack === filter) ? '' : 'none';
  });
  document.querySelectorAll('#githubGrid .project-card').forEach(card => {
    card.style.display = (filter === 'all' || card.dataset.stack === filter) ? '' : 'none';
  });

  const anyFeatured = [...document.querySelectorAll('#featuredGrid .project-card')].some(c => c.style.display !== 'none');
  document.querySelector('.featured-label').style.display = anyFeatured ? '' : 'none';
}

/* =============================================
   INIT
   ============================================= */
document.addEventListener('DOMContentLoaded', () => switchPage('about'));

/* =============================================
   EMAIL PROTECTION BYPASS
   Renders email via JS so Cloudflare can't encode it
   ============================================= */
function renderEmail() {
  const el = document.getElementById('emailDisplay');
  if (el) {
    const u = 'shankar.uddipt02';
    const d = 'gmail.com';
    el.textContent = u + '@' + d;
  }
}
document.addEventListener('DOMContentLoaded', renderEmail);