/* =========================================================================
   App — init bootstrap, runs after all modules are defined
   ========================================================================= */

async function setupNativeChrome() {
  if (!window.Capacitor || !window.Capacitor.isNativePlatform || !window.Capacitor.isNativePlatform()) return;
  const { Plugins } = window.Capacitor;
  try {
    if (Plugins.StatusBar) {
      await Plugins.StatusBar.setStyle({ style: 'DARK' });
      if (window.Capacitor.getPlatform && window.Capacitor.getPlatform() === 'android') {
        const primary = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim() || '#1a2f5e';
        await Plugins.StatusBar.setBackgroundColor({ color: primary });
      }
    }
    if (Plugins.SplashScreen) {
      await Plugins.SplashScreen.hide({ fadeOutDuration: 300 });
    }
  } catch (e) {}
}

function init() {
  loadProfiles();
  loadProfileData();
  if (typeof generateDueMonthlyExpenses === 'function') generateDueMonthlyExpenses();
  const today = localYmd();
  const inpDate = document.getElementById('inp_date');
  if (inpDate) inpDate.value = today;
  calCursor = today.slice(0, 7);
  calSelectedDate = today;
  initReportState();
  fillJobSel();
  applyLang();
  renderShifts();
  renderCalendar();
  checkOnboarding();
  if (typeof initPurchases === 'function') initPurchases().then(() => {
    if (typeof applyJpPayrollCopy === 'function') applyJpPayrollCopy();
  });
  setupNativeChrome();
}

document.addEventListener('DOMContentLoaded', init);
