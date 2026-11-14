// ==========================================================================
// FACEBOOK UID FINDER - CLIENT APPLICATION LOGIC
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  // Initialize i18n
  if (window.i18n) {
    window.i18n.init();
  }

  // Smart API Base:
  // - In production (Vercel) or on local server (port 3000), use relative path ('') to query /api/lookup on the same origin.
  // - Only when running under local static dev servers (Five Server 5500, Vite 5173, etc.) or file://,
  //   route API calls to local Express server on port 3000.
  const isLocalDevPort = (
    location.port === '5500' || 
    location.port === '5501' || 
    location.port === '5173' || 
    location.protocol === 'file:'
  );
  const API_BASE = isLocalDevPort ? `http://${location.hostname || 'localhost'}:3000` : '';

  // DOM Elements
  const urlInput = document.getElementById('url-input');
  const findBtn = document.getElementById('find-btn');
  const clearBtn = document.getElementById('clear-btn');
  const pasteBtn = document.getElementById('paste-btn');
  const detectedBadge = document.getElementById('detected-badge');
  const scannerContainer = document.getElementById('scanner-container');
  const resultContainer = document.getElementById('result-container');
  const resultCard3d = document.getElementById('result-card-3d');

  // Result Elements
  const resAvatar = document.getElementById('res-avatar');
  const resName = document.getElementById('res-name');
  const resDesc = document.getElementById('res-desc');
  const resUid = document.getElementById('res-uid');
  const resMethod = document.getElementById('res-method');
  const copyUidBtn = document.getElementById('copy-uid-btn');
  const copyNameBtn = document.getElementById('copy-name-btn');
  const resGenderBadge = document.getElementById('res-gender-badge');
  const resGenderIcon = document.getElementById('res-gender-icon');
  const resGenderText = document.getElementById('res-gender-text');
  const resStatusBadge = document.getElementById('res-status-badge');
  const resStatusDot = document.getElementById('res-status-dot');
  const resStatusText = document.getElementById('res-status-text');
  const linkWeb = document.getElementById('link-web');
  const linkApp = document.getElementById('link-app');
  const linkMsg = document.getElementById('link-msg');
  const linkAvatarHd = document.getElementById('link-avatar-hd');
  const qrcodeContainer = document.getElementById('qrcode-container');
  const downloadQrBtn = document.getElementById('download-qr-btn');

  // Scanner Steps
  const step1 = document.getElementById('step-1');
  const step2 = document.getElementById('step-2');
  const step3 = document.getElementById('step-3');

  // Navigation Tabs
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  // Language, Sound & Theme Controls
  const langSelect = document.getElementById('lang-select');
  const soundToggleBtn = document.getElementById('sound-toggle-btn');
  const soundIcon = document.getElementById('sound-icon');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');

  // Batch Elements
  const batchInput = document.getElementById('batch-input');
  const batchSubmitBtn = document.getElementById('batch-submit-btn');
  const batchClearBtn = document.getElementById('batch-clear-btn');
  const batchPasteBtn = document.getElementById('batch-paste-btn');
  const batchProgressWrapper = document.getElementById('batch-progress-wrapper');
  const batchProgressFill = document.getElementById('batch-progress-fill');
  const batchProgressText = document.getElementById('batch-progress-text');
  const batchTableContainer = document.getElementById('batch-table-container');
  const batchTableBody = document.getElementById('batch-table-body');
  const btnExportTxt = document.getElementById('btn-export-txt');
  const btnExportCsv = document.getElementById('btn-export-csv');
  const btnExportJson = document.getElementById('btn-export-json');

  // History Elements
  const historyList = document.getElementById('history-list');
  const historyEmpty = document.getElementById('history-empty');
  const clearHistoryBtn = document.getElementById('clear-history-btn');

  let currentQrCode = null;
  let currentResult = null;
  let batchResultsData = [];

  // ==========================================================================
  // LANGUAGE CONTROLLER (Khmer Default, persists in localStorage)
  // ==========================================================================
  if (langSelect && window.i18n) {
    langSelect.value = window.i18n.currentLang;
    langSelect.addEventListener('change', (e) => {
      window.i18n.setLanguage(e.target.value);
      if (window.soundFX) window.soundFX.playPop();
      if (currentResult) {
        resMethod.textContent = currentResult.method === 'instant_regex' ? '⚡ Instant Regex' : '🌐 Deep Meta Graph';
      }
    });
  }

  // ==========================================================================
  // THEME & SOUND CONTROLS
  // ==========================================================================
  const savedTheme = localStorage.getItem('fb_uid_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeToggleBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('fb_uid_theme', next);
    updateThemeIcon(next);
    if (window.soundFX) window.soundFX.playPop();
  });

  function updateThemeIcon(theme) {
    if (theme === 'light') {
      themeIcon.innerHTML = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>`;
    } else {
      themeIcon.innerHTML = `<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>`;
    }
  }

  soundToggleBtn.addEventListener('click', () => {
    const isEnabled = window.soundFX.toggle();
    if (isEnabled) {
      soundIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>`;
      window.soundFX.playPop();
      showToast(window.i18n ? window.i18n.t('sound_on') : 'Sound FX: Enabled');
    } else {
      soundIcon.innerHTML = `<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line>`;
      showToast(window.i18n ? window.i18n.t('sound_off') : 'Sound FX: Muted');
    }
  });

  // ==========================================================================
  // TABS CONTROLLER
  // ==========================================================================
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));

      btn.classList.add('active');
      document.getElementById(target).classList.add('active');

      if (window.soundFX) window.soundFX.playPop();
      if (target === 'tab-history') {
        renderHistory();
      }
    });
  });

  // ==========================================================================
  // AUTO URL FORMAT DETECTOR
  // ==========================================================================
  urlInput.addEventListener('input', () => {
    const val = urlInput.value.trim();
    clearBtn.style.display = val ? 'inline-flex' : 'none';

    if (!val) {
      detectedBadge.style.display = 'none';
      return;
    }

    const type = detectUrlType(val);
    detectedBadge.style.display = 'inline-flex';
    detectedBadge.innerHTML = `<span>${type.icon}</span> <span>${type.label}</span>`;
  });

  function detectUrlType(val) {
    if (/^\d{5,20}$/.test(val)) {
      return { icon: '🔢', label: 'Raw Numeric UID' };
    }
    if (/[?&]id=\d+/.test(val)) {
      return { icon: '👤', label: 'Profile ID Parameter' };
    }
    if (/\/groups\//i.test(val)) {
      return { icon: '👥', label: 'Facebook Group' };
    }
    if (/\/posts\/|\/permalink\.php|story_fbid/i.test(val)) {
      return { icon: '📝', label: 'Post / Permalink' };
    }
    if (/\/reel\/|\/watch/i.test(val)) {
      return { icon: '🎬', label: 'Reels / Video' };
    }
    if (/\/people\//i.test(val)) {
      return { icon: '🧑', label: 'People Profile' };
    }
    if (/\/share\//i.test(val)) {
      return { icon: '🔗', label: 'FB Share Redirect Link' };
    }
    if (/facebook\.com\/[a-zA-Z0-9._-]+/i.test(val)) {
      return { icon: '⚡', label: 'Vanity Username / Page' };
    }
    return { icon: '🔗', label: 'Facebook Link' };
  }

  // Quick Action Buttons
  clearBtn.addEventListener('click', () => {
    urlInput.value = '';
    clearBtn.style.display = 'none';
    detectedBadge.style.display = 'none';
    urlInput.focus();
    if (window.soundFX) window.soundFX.playPop();
  });

  pasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        urlInput.value = text.trim();
        urlInput.dispatchEvent(new Event('input'));
        if (window.soundFX) window.soundFX.playPop();
        showToast(window.i18n ? window.i18n.t('toast_pasted') : 'Pasted from clipboard!');
      }
    } catch {
      showToast(window.i18n ? window.i18n.t('toast_clipboard_perm') : 'Clipboard permission required.');
    }
  });

  // Example pills
  document.querySelectorAll('.example-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      urlInput.value = pill.getAttribute('data-url');
      urlInput.dispatchEvent(new Event('input'));
      if (window.soundFX) window.soundFX.playPop();
      triggerLookup();
    });
  });

  // Enter key to search
  urlInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      triggerLookup();
    }
  });

  findBtn.addEventListener('click', triggerLookup);

  // ==========================================================================
  // SINGLE LOOKUP CONTROLLER
  // ==========================================================================
  async function triggerLookup() {
    const rawUrl = urlInput.value.trim();
    if (!rawUrl) {
      if (window.soundFX) window.soundFX.playError();
      showToast(window.i18n ? window.i18n.t('toast_enter_url') : 'Please enter a Facebook link or username!');
      urlInput.focus();
      return;
    }

    if (window.soundFX) {
      window.soundFX.playPop();
      window.soundFX.playScan();
    }

    // Show scanner HUD
    resultContainer.style.display = 'none';
    scannerContainer.style.display = 'block';
    findBtn.disabled = true;

    // Simulate animated step indicators
    step1.classList.add('active');
    step2.classList.remove('active');
    step3.classList.remove('active');

    const stepTimer1 = setTimeout(() => {
      step2.classList.add('active');
    }, 450);

    const stepTimer2 = setTimeout(() => {
      step3.classList.add('active');
    }, 950);

    let data = null;
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await fetch(`${API_BASE}/api/lookup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: rawUrl })
        });

        const rawText = await response.text();
        data = rawText ? JSON.parse(rawText) : null;
        if (data) break;
      } catch (fetchErr) {
        if (attempt === 1) {
          await new Promise(r => setTimeout(r, 600));
          continue;
        }
      }
    }

    clearTimeout(stepTimer1);
    clearTimeout(stepTimer2);

    // Short delay for scanner animation visibility
    await new Promise(r => setTimeout(r, 600));

    scannerContainer.style.display = 'none';
    findBtn.disabled = false;

    if (!data) {
      if (window.soundFX) window.soundFX.playError();
      const serverErrMsg = window.i18n && window.i18n.currentLang === 'km'
        ? 'មិនអាចភ្ជាប់ទៅកាន់ Server បានទេ។ សូមប្រាកដថាកំពុងដំណើរការម៉ាស៊ីនបម្រើ (npm start)។'
        : 'Server connection error: Cannot reach the backend API.';
      showToast(serverErrMsg);
      return;
    }

    if (!data.success) {
      if (window.soundFX) window.soundFX.playError();
      const errMsg = data.error 
        ? data.error 
        : (window.i18n ? window.i18n.t('status_failed') : 'Could not find UID for this link.');
      showToast(errMsg);
      return;
    }

    currentResult = data;
    renderResult(data);

    if (window.soundFX) window.soundFX.playSuccess();
    fireConfetti();
    saveToHistory(data);
  }

  function renderResult(data) {
    resName.textContent = data.name || 'Facebook User';
    resDesc.textContent = data.description || '';
    resUid.textContent = data.uid;
    resMethod.textContent = data.method === 'instant_regex' ? '⚡ Instant Regex' : '🌐 Deep Meta Graph';

    // --- Gender Badge ---
    if (resGenderBadge) {
      const g = data.gender || 'unknown';
      resGenderBadge.className = 'profile-meta-badge gender-badge ' + (g !== 'unknown' ? g : '');
      if (g === 'male') {
        resGenderIcon.textContent = '♂️';
        resGenderText.textContent = window.i18n ? window.i18n.t('gender_male') : 'Male';
      } else if (g === 'female') {
        resGenderIcon.textContent = '♀️';
        resGenderText.textContent = window.i18n ? window.i18n.t('gender_female') : 'Female';
      } else {
        resGenderIcon.textContent = '👤';
        resGenderText.textContent = window.i18n ? window.i18n.t('gender_unknown') : 'Unknown';
      }
    }

    // --- Account Status Badge ---
    if (resStatusBadge) {
      const s = data.accountStatus || 'live';
      resStatusBadge.className = 'profile-meta-badge status-badge ' + (s !== 'live' ? s : '');
      const statusLabels = {
        live:          { text: window.i18n ? window.i18n.t('status_live') : '✅ Live / Active' },
        dead:          { text: window.i18n ? window.i18n.t('status_dead') : '❌ Dead / Not Found' },
        disabled:      { text: window.i18n ? window.i18n.t('status_disabled') : '🚫 Disabled' },
        checkpoint:    { text: window.i18n ? window.i18n.t('status_checkpoint') : '⚠️ Checkpoint' },
        memorialized:  { text: window.i18n ? window.i18n.t('status_memorialized') : '🕊️ Memorialized' },
        redirect:      { text: window.i18n ? window.i18n.t('status_redirect') : '↩️ Redirected' }
      };
      resStatusText.textContent = (statusLabels[s] || statusLabels.live).text;
    }

    // Avatar with fallback
    resAvatar.src = data.avatar;
    resAvatar.onerror = () => {
      resAvatar.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name || 'FB')}&background=1877F2&color=fff&size=160`;
    };

    // Links
    linkWeb.href = data.profileUrl || `https://www.facebook.com/${data.uid}`;
    linkApp.href = data.deepLink || `fb://profile/${data.uid}`;
    if (linkMsg) linkMsg.href = data.messengerLink || `https://m.me/${data.uid}`;
    if (linkAvatarHd) linkAvatarHd.href = data.avatar || `https://graph.facebook.com/${data.uid}/picture?type=large&width=720&height=720`;

    // Generate Dynamic QR Code
    generateQrCode(data.profileUrl || `https://www.facebook.com/${data.uid}`);

    resultContainer.style.display = 'block';
    resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  // Generate QR Code using qrcodejs
  function generateQrCode(url) {
    qrcodeContainer.innerHTML = '';
    if (typeof QRCode !== 'undefined') {
      currentQrCode = new QRCode(qrcodeContainer, {
        text: url,
        width: 100,
        height: 100,
        colorDark: '#0f172a',
        colorLight: '#ffffff',
        correctLevel: QRCode.CorrectLevel.M
      });
    }
  }

  // Download QR Code as PNG
  downloadQrBtn.addEventListener('click', () => {
    const img = qrcodeContainer.querySelector('img') || qrcodeContainer.querySelector('canvas');
    if (!img) return;
    const link = document.createElement('a');
    link.download = `facebook-qr-${resUid.textContent}.png`;
    link.href = img.src || (img.toDataURL ? img.toDataURL() : '#');
    link.click();
    if (window.soundFX) window.soundFX.playPop();
    showToast(window.i18n ? window.i18n.t('toast_download_qr') : 'QR Code downloaded!');
  });

  // Copy UID Button
  copyUidBtn.addEventListener('click', () => {
    const uid = resUid.textContent.trim();
    if (!uid) return;
    navigator.clipboard.writeText(uid).then(() => {
      if (window.soundFX) window.soundFX.playCopy();
      const copiedText = window.i18n ? window.i18n.t('copied') : 'Copied!';
      const copyBtnText = window.i18n ? window.i18n.t('btn_copy_uid') : 'Copy UID';
      copyUidBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
        <span>${copiedText}</span>
      `;
      showToast(`${window.i18n ? window.i18n.t('toast_copied') : 'Copied UID: '} ${uid}`);
      setTimeout(() => {
        copyUidBtn.innerHTML = `
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>${copyBtnText}</span>
        `;
      }, 2000);
    });
  });

  // Copy Name Button
  if (copyNameBtn) {
    copyNameBtn.addEventListener('click', () => {
      const name = resName.textContent.trim();
      if (!name) return;
      navigator.clipboard.writeText(name).then(() => {
        if (window.soundFX) window.soundFX.playCopy();
        const origHTML = copyNameBtn.innerHTML;
        copyNameBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>${window.i18n ? window.i18n.t('copied') : 'Copied!'}</span>`;
        showToast(`${window.i18n ? window.i18n.t('toast_copied_name') : 'Copied name: '} ${name}`);
        setTimeout(() => { copyNameBtn.innerHTML = origHTML; }, 2000);
      });
    });
  }

  // ==========================================================================
  // 3D TILT PHYSICS ON CARD (Desktop only)
  // ==========================================================================
  if (window.innerWidth > 768) {
    resultCard3d.addEventListener('mousemove', (e) => {
      const rect = resultCard3d.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      resultCard3d.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`;
    });

    resultCard3d.addEventListener('mouseleave', () => {
      resultCard3d.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)`;
    });
  }

  // ==========================================================================
  // CELEBRATION CONFETTI BURST
  // ==========================================================================
  function fireConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 65,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#1877F2', '#00D2FF', '#38BDF8', '#8B5CF6']
      });
    }
  }

  // ==========================================================================
  // BATCH LOOKUP CONTROLLER
  // ==========================================================================
  batchClearBtn.addEventListener('click', () => {
    batchInput.value = '';
    if (window.soundFX) window.soundFX.playPop();
  });

  batchPasteBtn.addEventListener('click', async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        batchInput.value = text;
        if (window.soundFX) window.soundFX.playPop();
        showToast(window.i18n ? window.i18n.t('toast_pasted') : 'Pasted list from clipboard!');
      }
    } catch {
      showToast(window.i18n ? window.i18n.t('toast_clipboard_perm') : 'Clipboard permission required.');
    }
  });

  batchSubmitBtn.addEventListener('click', async () => {
    const lines = batchInput.value
      .split('\n')
      .map(l => l.trim())
      .filter(l => l.length > 0);

    if (lines.length === 0) {
      if (window.soundFX) window.soundFX.playError();
      showToast(window.i18n ? window.i18n.t('toast_batch_empty') : 'Please enter at least 1 Facebook link!');
      return;
    }

    if (lines.length > 25) {
      showToast('Maximum 25 links per request.');
      lines.length = 25;
    }

    if (window.soundFX) window.soundFX.playScan();

    batchSubmitBtn.disabled = true;
    batchProgressWrapper.style.display = 'block';
    batchTableContainer.style.display = 'block';
    batchTableBody.innerHTML = '';
    batchResultsData = [];

    let completed = 0;
    batchProgressFill.style.width = '0%';
    batchProgressText.textContent = `0 / ${lines.length}`;

    const txtSuccess = window.i18n ? window.i18n.t('status_success') : 'Success';
    const txtFailed = window.i18n ? window.i18n.t('status_failed') : 'Not Found';
    const txtError = window.i18n ? window.i18n.t('status_error') : 'Error';

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      try {
        const response = await fetch(`${API_BASE}/api/lookup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: line })
        });
        const data = await response.json();

        const row = document.createElement('tr');
        if (data.success) {
          row.innerHTML = `
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${line}</td>
            <td><strong>${data.name || 'Facebook User'}</strong></td>
            <td><code style="color:#38bdf8;font-weight:700;">${data.uid}</code></td>
            <td><span class="status-badge success">${txtSuccess}</span></td>
            <td>
              <button class="quick-action-btn" onclick="navigator.clipboard.writeText('${data.uid}'); showToast('Copied: ${data.uid}');">Copy</button>
            </td>
          `;
          batchResultsData.push({ input: line, name: data.name, uid: data.uid, status: 'Success' });
          saveToHistory(data);
        } else {
          row.innerHTML = `
            <td style="max-width:180px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${line}</td>
            <td>-</td>
            <td>-</td>
            <td><span class="status-badge failed">${txtFailed}</span></td>
            <td>-</td>
          `;
          batchResultsData.push({ input: line, name: '-', uid: '-', status: 'Failed' });
        }
        batchTableBody.appendChild(row);

      } catch (err) {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${line}</td>
          <td>-</td>
          <td>-</td>
          <td><span class="status-badge failed">${txtError}</span></td>
          <td>-</td>
        `;
        batchTableBody.appendChild(row);
        batchResultsData.push({ input: line, name: '-', uid: '-', status: 'Error' });
      }

      completed++;
      const percent = Math.round((completed / lines.length) * 100);
      batchProgressFill.style.width = `${percent}%`;
      batchProgressText.textContent = `${completed} / ${lines.length} (${percent}%)`;
    }

    batchSubmitBtn.disabled = false;
    if (window.soundFX) window.soundFX.playSuccess();
    fireConfetti();
    showToast(window.i18n ? window.i18n.t('toast_batch_done') : 'Batch scanning completed!');
  });

  // Batch Export Handlers
  btnExportTxt.addEventListener('click', () => {
    if (batchResultsData.length === 0) return;
    const uids = batchResultsData
      .filter(r => r.status === 'Success')
      .map(r => r.uid)
      .join('\n');
    downloadFile(uids, 'facebook-uids.txt', 'text/plain');
  });

  btnExportCsv.addEventListener('click', () => {
    if (batchResultsData.length === 0) return;
    let csv = 'Input,Name,UID,Status\n';
    batchResultsData.forEach(r => {
      csv += `"${r.input}","${r.name}","${r.uid}","${r.status}"\n`;
    });
    downloadFile(csv, 'facebook-uids.csv', 'text/csv');
  });

  btnExportJson.addEventListener('click', () => {
    if (batchResultsData.length === 0) return;
    const json = JSON.stringify(batchResultsData, null, 2);
    downloadFile(json, 'facebook-uids.json', 'application/json');
  });

  function downloadFile(content, fileName, mimeType) {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    URL.revokeObjectURL(url);
    if (window.soundFX) window.soundFX.playPop();
    showToast(`Exported ${fileName}!`);
  }

  // ==========================================================================
  // HISTORY CONTROLLER
  // ==========================================================================
  function saveToHistory(item) {
    try {
      const history = JSON.parse(localStorage.getItem('fb_uid_history') || '[]');
      const filtered = history.filter(h => h.uid !== item.uid);
      filtered.unshift({
        uid: item.uid,
        name: item.name || 'Facebook User',
        avatar: item.avatar,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
      localStorage.setItem('fb_uid_history', JSON.stringify(filtered.slice(0, 20)));
    } catch { }
  }

  function renderHistory() {
    try {
      const history = JSON.parse(localStorage.getItem('fb_uid_history') || '[]');
      if (history.length === 0) {
        historyEmpty.style.display = 'block';
        historyList.innerHTML = '';
        return;
      }
      historyEmpty.style.display = 'none';
      historyList.innerHTML = '';

      const btnCopyTxt = window.i18n ? window.i18n.t('btn_copy') : 'Copy';
      const btnViewTxt = window.i18n ? window.i18n.t('btn_view') : 'View';

      history.forEach(item => {
        const el = document.createElement('div');
        el.className = 'history-item';
        el.innerHTML = `
          <div class="history-item-left">
            <img src="${item.avatar || 'https://graph.facebook.com/' + item.uid + '/picture?type=small'}" class="history-avatar" onerror="this.src='https://ui-avatars.com/api/?name=FB&background=1877F2&color=fff'">
            <div>
              <div class="history-name">${item.name}</div>
              <div class="history-uid">${item.uid} <span style="font-size:0.75rem;color:var(--text-muted);font-weight:normal;">• ${item.time}</span></div>
            </div>
          </div>
          <div style="display:flex;gap:6px;flex-shrink:0;">
            <button class="quick-action-btn copy-hist-btn">${btnCopyTxt}</button>
            <button class="quick-action-btn load-hist-btn">${btnViewTxt}</button>
          </div>
        `;

        el.querySelector('.copy-hist-btn').addEventListener('click', () => {
          navigator.clipboard.writeText(item.uid);
          if (window.soundFX) window.soundFX.playCopy();
          showToast(`${window.i18n ? window.i18n.t('toast_copied') : 'Copied UID: '} ${item.uid}`);
        });

        el.querySelector('.load-hist-btn').addEventListener('click', () => {
          urlInput.value = item.uid;
          urlInput.dispatchEvent(new Event('input'));
          document.querySelector('[data-tab="tab-single"]').click();
          triggerLookup();
        });

        historyList.appendChild(el);
      });
    } catch { }
  }

  clearHistoryBtn.addEventListener('click', () => {
    localStorage.removeItem('fb_uid_history');
    renderHistory();
    if (window.soundFX) window.soundFX.playPop();
    showToast(window.i18n ? window.i18n.t('toast_history_cleared') : 'History cleared!');
  });

  // ==========================================================================
  // FAQ ACCORDION CONTROLLER
  // ==========================================================================
  document.querySelectorAll('.accordion-header').forEach(hdr => {
    hdr.addEventListener('click', () => {
      const parent = hdr.parentElement;
      const isOpen = parent.classList.contains('open');
      document.querySelectorAll('.accordion-item').forEach(it => it.classList.remove('open'));
      if (!isOpen) {
        parent.classList.add('open');
      }
      if (window.soundFX) window.soundFX.playPop();
    });
  });

  // ==========================================================================
  // TOAST NOTIFICATIONS
  // ==========================================================================
  window.showToast = function (msg) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
      <span>${msg}</span>
    `;
    container.appendChild(toast);
    setTimeout(() => {
      if (toast.parentElement) toast.remove();
    }, 3100);
  };
});
