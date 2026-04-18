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
        await Plugins.StatusBar.setBackgroundColor({ color: '#1a2f5e' });
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
  setupNativeChrome();
}

document.addEventListener('DOMContentLoaded', init);
