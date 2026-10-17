const teamFilter = document.querySelector('#team-filter');
const clearFilter = document.querySelector('#clear-filter');
const pickRows = [...document.querySelectorAll('.pick-row')];
const gradeCards = [...document.querySelectorAll('.grade-card')];
const shareButton = document.querySelector('#share-button');
const toast = document.querySelector('#toast');

function filterTeam(team) {
  teamFilter.value = team;
  clearFilter.hidden = !team;
  for (const row of pickRows) {
    row.classList.toggle('is-dimmed', Boolean(team) && row.dataset.team !== team);
    row.classList.toggle('is-highlighted', Boolean(team) && row.dataset.team === team);
  }
  for (const card of gradeCards) {
    card.classList.toggle('is-dimmed', Boolean(team) && card.dataset.team !== team);
    card.classList.toggle('is-highlighted', Boolean(team) && card.dataset.team === team);
  }
  const url = new URL(window.location.href);
  if (team) url.searchParams.set('team', team);
  else url.searchParams.delete('team');
  window.history.replaceState({}, '', url);
}

teamFilter.addEventListener('change', () => filterTeam(teamFilter.value));
clearFilter.addEventListener('click', () => filterTeam(''));

const selectedTeam = new URL(window.location.href).searchParams.get('team');
if ([...teamFilter.options].some((option) => option.value === selectedTeam)) {
  filterTeam(selectedTeam);
}

const roundLinks = [...document.querySelectorAll('.round-nav a')];
const roundSections = [...document.querySelectorAll('.round-section')];
if ('IntersectionObserver' in window) {
  const roundObserver = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      for (const link of roundLinks) {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      }
    }
  }, { rootMargin: '-150px 0px -58% 0px' });
  roundSections.forEach((section) => roundObserver.observe(section));
}

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('visible'), 3000);
}

shareButton.addEventListener('click', async () => {
  const shareData = { title: document.title, url: window.location.href };
  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      showToast('Link copied to clipboard');
    }
  } catch (error) {
    if (error.name !== 'AbortError') showToast('Use the address bar to copy this link');
  }
});
