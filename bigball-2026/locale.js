(() => {
  const explicit = new URLSearchParams(window.location.search).get('lang');
  let preferred = null;
  try { preferred = window.localStorage.getItem('bigball.language'); } catch (_) { /* Storage may be disabled. */ }
  const browserLanguage = navigator.languages?.[0] || navigator.language || 'en';
  const language = explicit === 'en' || explicit === 'de'
    ? explicit
    : preferred === 'en' || preferred === 'de'
      ? preferred
      : browserLanguage.toLowerCase().startsWith('de') ? 'de' : 'en';
  if (language === 'de') {
    const target = new URL('./de/', window.location.href);
    target.search = window.location.search;
    target.hash = window.location.hash;
    window.location.replace(target.href);
  }
})();
