// Initialize app
document.addEventListener('DOMContentLoaded', function () {
  const qrInput = document.getElementById('qr-input');
  const generateBtn = document.getElementById('generate-btn');
  const downloadBtn = document.getElementById('download-btn');
  const qrCodeDiv = document.getElementById('qrcode');
  const qrResult = document.getElementById('qrResult');
  const qrSize = document.getElementById('qr-size');
  const qrColor = document.getElementById('qr-color');
  const languageSelect = document.getElementById('language-select');
  const themeToggle = document.getElementById('theme-toggle');

  // Load saved preferences
  const savedLang = localStorage.getItem('qr-lang') || 'id';
  const savedTheme = localStorage.getItem('qr-theme') || 'github-light';

  currentLang = savedLang;
  currentTheme = savedTheme;

  languageSelect.value = currentLang;
  updateLanguage();
  updateTheme();

  // Generate QR Code function
  function generateQR() {
    const qrValue = qrInput.value.trim();
    if (!qrValue) {
      const alertMsg = currentLang === 'id' ?
        'Masukkan URL atau teks terlebih dahulu!' :
        'Please enter URL or text first!';
      alert(alertMsg);
      return;
    }

    currentQRValue = qrValue;
    const size = parseInt(qrSize.value);
    const color = qrColor.value;

    // Show loading state
    generateBtn.disabled = true;
    generateBtn.textContent = currentLang === 'id' ? 'Generating...' : 'Generating...';

    // Clear previous QR code
    qrCodeDiv.innerHTML = '';
    qrResult.classList.remove('show');

    // Create new QR code
    qrcode = new QRCode(qrCodeDiv, {
      text: qrValue,
      width: size,
      height: size,
      colorDark: color,
      colorLight: "#ffffff",
      correctLevel: QRCode.CorrectLevel.H
    });

    // Show result after generation
    setTimeout(() => {
      qrResult.classList.add('show');
      generateBtn.disabled = false;
      generateBtn.textContent = translations[currentLang]['Generate QR Code'];
    }, 300);
  }

  // Download QR Code function
  function downloadQR() {
    if (!currentQRValue) {
      const alertMsg = currentLang === 'id' ?
        'Tidak ada QR Code yang bisa didownload. Generate QR Code terlebih dahulu.' :
        'No QR Code to download. Generate QR Code first.';
      alert(alertMsg);
      return;
    }

    try {
      const fileName = generateFileName(currentQRValue);
      const canvas = qrCodeDiv.querySelector('canvas');

      if (!canvas) {
        const alertMsg = currentLang === 'id' ?
          'QR Code belum siap untuk didownload. Coba lagi dalam beberapa saat.' :
          'QR Code is not ready for download. Please try again in a moment.';
        alert(alertMsg);
        return;
      }

      const downloadLink = document.createElement('a');
      downloadLink.href = canvas.toDataURL('image/png');
      downloadLink.download = `${fileName}-qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      const alertMsg = currentLang === 'id' ?
        'Error saat mendownload QR Code. Coba lagi.' :
        'Error downloading QR Code. Please try again.';
      alert(alertMsg);
    }
  }

  // Generate filename from URL/text
  function generateFileName(url) {
    try {
      const urlObj = new URL(url);
      let domain = urlObj.hostname.replace('www.', '');
      let path = urlObj.pathname !== '/' ? urlObj.pathname.replace(/\//g, '-').replace(/^-|-$/g, '') : '';

      domain = domain.replace(/[^a-zA-Z0-9.-]/g, '');
      path = path.replace(/[^a-zA-Z0-9.-]/g, '');

      let fileName = domain;
      if (path) fileName += '-' + path;
      if (fileName.length > 50) fileName = fileName.substring(0, 50);

      return fileName || 'qr-code';
    } catch (e) {
      let text = url.substring(0, 30);
      text = text.replace(/[^a-zA-Z0-9]/g, '-');
      return text || 'qr-code';
    }
  }

  // Event listeners
  generateBtn.addEventListener('click', generateQR);
  downloadBtn.addEventListener('click', downloadQR);

  qrInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      generateQR();
    }
  });

  qrColor.addEventListener('change', function () {
    if (qrcode && currentQRValue) {
      generateQR();
    }
  });

  // Language select change
  languageSelect.addEventListener('change', function () {
    currentLang = this.value;
    updateLanguage();
    localStorage.setItem('qr-lang', currentLang);
  });

  // Theme toggle click
  themeToggle.addEventListener('click', function () {
    toggleTheme();
  });
});

// Theme functions
function toggleTheme() {
  currentTheme = currentTheme === 'github-light' ? 'github-dark' : 'github-light';
  updateTheme();
  localStorage.setItem('qr-theme', currentTheme);
}

function toggleThemeFromMenu() {
  toggleTheme();
  closeDropdown();
}

function updateTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  const themeIcon = document.getElementById('theme-icon');

  if (currentTheme === 'github-light') {
    themeIcon.className = 'fas fa-moon';
  } else {
    themeIcon.className = 'fas fa-sun';
  }
}

// Language functions
function toggleLanguageFromMenu() {
  const languageSelect = document.getElementById('language-select');
  currentLang = currentLang === 'id' ? 'en' : 'id';
  languageSelect.value = currentLang;
  updateLanguage();
  localStorage.setItem('qr-lang', currentLang);
  closeDropdown();
}

function updateLanguage() {
  document.documentElement.lang = currentLang;

  // Update all elements with data-text attribute
  document.querySelectorAll('[data-text]').forEach(element => {
    const key = element.getAttribute('data-text');
    if (translations[currentLang][key]) {
      element.textContent = translations[currentLang][key];
    }
  });

  // Update placeholder
  const input = document.getElementById('qr-input');
  const placeholderKey = input.getAttribute('data-placeholder');
  if (placeholderKey && translations[currentLang][placeholderKey]) {
    input.placeholder = translations[currentLang][placeholderKey];
  }
}

// Dropdown functions
function toggleDropdown() {
  const dropdown = document.getElementById('dropdownMenu');
  dropdown.classList.toggle('show');
}

function closeDropdown() {
  const dropdown = document.getElementById('dropdownMenu');
  dropdown.classList.remove('show');
}

// Close dropdown when clicking outside
window.addEventListener('click', function (event) {
  const dropdown = document.getElementById('dropdownMenu');
  const button = document.querySelector('.menu-button');

  if (!button.contains(event.target)) {
    closeDropdown();
  }
});