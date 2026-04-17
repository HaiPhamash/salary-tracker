/* =========================================================================
   Onboarding — first-run profile screen (name + language)
   ========================================================================= */

function checkOnboarding() {
  if (profiles.length === 0) {
    document.getElementById('obScreen').style.display = 'flex';
    applyObLang('ja');
  }
}

function applyObLang(lang) {
  const t = L[lang] || L.ja;
  document.getElementById('obTitle').textContent   = '💴 Salary Tracker';
  document.getElementById('obSub').textContent     = t.obSub     || 'Salary & Income Tracker';
  document.getElementById('obLangLbl').textContent = t.obLangLbl || 'Language';
  document.getElementById('obNameLbl').textContent = t.obNameLbl || 'Your Name';
  document.getElementById('obBtn').textContent     = t.obBtn     || 'Start ▶';
  const nm = document.getElementById('ob_name');
  if (nm) nm.placeholder = t.phObName || 'Your name...';
}

function onObLangChange() {
  applyObLang(document.getElementById('ob_lang').value);
}

function finishOnboarding() {
  const name = document.getElementById('ob_name').value.trim() || 'User';
  const lang = document.getElementById('ob_lang').value;
  createProfile(name, lang);
  document.getElementById('obScreen').style.display = 'none';
  document.getElementById('ob_name').value = '';
  fillJobSel();
  applyLang();
  const welcome = (L[curLang] && L[curLang].welcome) || 'Welcome';
  toast('👋 ' + welcome + ', ' + userName + '!');
}

function resetOnboarding() {
  if (typeof openProfilesModal === 'function') openProfilesModal();
}

function showOnboardingForNew() {
  document.getElementById('ob_name').value = '';
  document.getElementById('ob_lang').value = curLang || 'ja';
  applyObLang(document.getElementById('ob_lang').value);
  document.getElementById('obScreen').style.display = 'flex';
}
