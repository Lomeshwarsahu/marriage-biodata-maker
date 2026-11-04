/**
 * ===================================================================
 * MARRIAGE BIODATA MAKER - CORE APPLICATION JAVASCRIPT
 * Features:
 * - Real-time Live Preview & DOM Sync
 * - Auto-calculate Age from DOB
 * - Photo Upload with Immediate Preview & Remove
 * - LocalStorage Auto-save (Every 5 seconds) & Manual Save/Draft
 * - Load Sample Data (Realistic Traditional Profile)
 * - 4 Traditional Indian Color Themes (Maroon, Blue, Emerald, Pink)
 * - High-Quality A4 PDF Export (jsPDF + html2canvas)
 * - High-Resolution Image Export (html2canvas PNG)
 * - Print via window.print()
 * - Fullscreen Preview Modal
 * - Mobile Tab Navigation & Accordion Controls
 * ===================================================================
 */

// Helper to resolve jsPDF constructor safely across different CDN bundling
function getJsPdfConstructor() {
  if (window.jspdf && window.jspdf.jsPDF) {
    return window.jspdf.jsPDF;
  }
  if (typeof window.jsPDF === 'function') {
    return window.jsPDF;
  }
  return null;
}

// Global Application State
const AppState = {
  theme: 'theme-maroon',
  languageMode: 'bilingual',
  photoDataUrl: '',
  isDirty: false,
  autoSaveTimer: null
};

// DOM Element References
const DOM = {
  // Body & Panels
  body: document.body,
  formPanel: document.getElementById('formPanel'),
  previewPanel: document.getElementById('previewPanel'),
  biodataForm: document.getElementById('biodataForm'),
  biodataSheet: document.getElementById('biodataSheet'),

  // Header & Controls
  displayLangSelect: document.getElementById('displayLangSelect'),
  mantraSelect: document.getElementById('mantraSelect'),
  customMantraInput: document.getElementById('customMantraInput'),
  loadSampleBtn: document.getElementById('loadSampleBtn'),
  bottomSampleBtn: document.getElementById('bottomSampleBtn'),
  saveDraftBtn: document.getElementById('saveDraftBtn'),
  resetFormBtn: document.getElementById('resetFormBtn'),
  viewPreviewBtn: document.getElementById('viewPreviewBtn'),
  autosaveStatus: document.getElementById('autosaveStatus'),
  lastSavedTime: document.getElementById('lastSavedTime'),
  progressBar: document.getElementById('progressBar'),
  progressText: document.getElementById('progressText'),
  aboutWordCount: document.getElementById('aboutWordCount'),

  // Photo
  photoInput: document.getElementById('photoInput'),
  photoPreviewImg: document.getElementById('photoPreviewImg'),
  photoPlaceholder: document.getElementById('photoPlaceholder'),
  removePhotoBtn: document.getElementById('removePhotoBtn'),
  sheetPhotoImg: document.getElementById('sheetPhotoImg'),
  sheetPhotoPlaceholder: document.getElementById('sheetPhotoPlaceholder'),

  // Download & Actions
  downloadPdfBtn: document.getElementById('downloadPdfBtn'),
  downloadImgBtn: document.getElementById('downloadImgBtn'),
  printBtn: document.getElementById('printBtn'),
  fullscreenBtn: document.getElementById('fullscreenBtn'),

  // Mobile Tabs
  tabFormBtn: document.getElementById('tabFormBtn'),
  tabPreviewBtn: document.getElementById('tabPreviewBtn'),

  // Modal
  fullscreenModal: document.getElementById('fullscreenModal'),
  modalBody: document.getElementById('modalBody'),
  closeModalBtn: document.getElementById('closeModalBtn'),
  modalPdfBtn: document.getElementById('modalPdfBtn'),
  modalImgBtn: document.getElementById('modalImgBtn'),

  // Toast
  toastContainer: document.getElementById('toastContainer'),

  // Sheet Elements
  sheetMantra: document.getElementById('sheetMantra'),
  sheetTitle: document.getElementById('sheetTitle'),
  previewFullName: document.getElementById('previewFullName'),
  heroGenderPill: document.getElementById('heroGenderPill'),
  tagAgeHeight: document.getElementById('tagAgeHeight'),
  tagEducation: document.getElementById('tagEducation'),
  tagOccupation: document.getElementById('tagOccupation'),

  // Preview Value Targets
  valDob: document.getElementById('valDob'),
  valBirthTime: document.getElementById('valBirthTime'),
  valBirthPlace: document.getElementById('valBirthPlace'),
  valAge: document.getElementById('valAge'),
  valHeight: document.getElementById('valHeight'),
  valWeight: document.getElementById('valWeight'),
  valBloodGroup: document.getElementById('valBloodGroup'),
  valComplexion: document.getElementById('valComplexion'),
  valMaritalStatus: document.getElementById('valMaritalStatus'),

  valEducation: document.getElementById('valEducation'),
  valCollege: document.getElementById('valCollege'),
  valOccupation: document.getElementById('valOccupation'),
  valCompany: document.getElementById('valCompany'),
  valIncome: document.getElementById('valIncome'),
  valWorkLocation: document.getElementById('valWorkLocation'),

  valFather: document.getElementById('valFather'),
  valFatherOcc: document.getElementById('valFatherOcc'),
  valMother: document.getElementById('valMother'),
  valMotherOcc: document.getElementById('valMotherOcc'),
  valBrothers: document.getElementById('valBrothers'),
  valSisters: document.getElementById('valSisters'),
  valFamilyType: document.getElementById('valFamilyType'),
  valFamilyValues: document.getElementById('valFamilyValues'),
  valNativePlace: document.getElementById('valNativePlace'),
  valMaternalUncle: document.getElementById('valMaternalUncle'),
  valLand: document.getElementById('valLand'),
  valProperty: document.getElementById('valProperty'),

  valRashi: document.getElementById('valRashi'),
  valNakshatra: document.getElementById('valNakshatra'),
  valGotra: document.getElementById('valGotra'),
  valManglik: document.getElementById('valManglik'),
  valKundaliNotes: document.getElementById('valKundaliNotes'),

  valPrefAge: document.getElementById('valPrefAge'),
  valPrefHeight: document.getElementById('valPrefHeight'),
  valPrefEducation: document.getElementById('valPrefEducation'),
  valPrefOccupation: document.getElementById('valPrefOccupation'),
  valPrefOther: document.getElementById('valPrefOther'),

  valAboutMe: document.getElementById('valAboutMe'),

  valMobile: document.getElementById('valMobile'),
  valWhatsapp: document.getElementById('valWhatsapp'),
  valEmail: document.getElementById('valEmail'),
  valAddress: document.getElementById('valAddress'),

  // Sections (for conditional visibility)
  secHoroscope: document.getElementById('secHoroscope'),
  secPreferences: document.getElementById('secPreferences'),
  secAbout: document.getElementById('secAbout'),
  rowKundaliNotes: document.getElementById('rowKundaliNotes'),
  rowPrefOther: document.getElementById('rowPrefOther'),
  rowMaternalUncle: document.getElementById('rowMaternalUncle'),
  rowLand: document.getElementById('rowLand'),
  rowProperty: document.getElementById('rowProperty'),
  rowNativePlace: document.getElementById('rowNativePlace'),
  rowWhatsapp: document.getElementById('rowWhatsapp'),
  rowEmail: document.getElementById('rowEmail'),
  rowAddress: document.getElementById('rowAddress')
};

/* ===================================================================
   SAMPLE DATA (Traditional Realistic Indian Wedding Biodata)
   =================================================================== */
const SAMPLE_DATA = {
  fullName: "रोहन शर्मा (Rohan Sharma)",
  dob: "1998-07-15",
  age: "28 वर्ष (28 Years)",
  birthTime: "06:45",
  birthPlace: "जयपुर, राजस्थान (Jaipur, Rajasthan)",
  gender: "वर (Male)",
  height: "5' 10\" (178 cm)",
  weight: "72 kg",
  bloodGroup: "B+",
  complexion: "गोरा (Fair)",
  maritalStatus: "अविवाहित (Never Married)",
  
  education: "B.Tech in Computer Science & Engineering",
  college: "IIT Roorkee (आईआईटी रुड़की)",
  occupation: "Senior Software Engineer (वरिष्ठ सॉफ्टवेयर इंजीनियर)",
  company: "Microsoft India (माइक्रोसॉफ्ट)",
  income: "₹ 24 LPA (लाख प्रति वर्ष)",
  workLocation: "गुरुग्राम, हरियाणा (Gurugram / Hybrid)",

  fatherName: "श्री रमेश चंद्र शर्मा (Shri Ramesh Chand Sharma)",
  fatherOccupation: "वरिष्ठ प्रबंधक, पंजाब नेशनल बैंक (सेवानिवृत्त)",
  motherName: "श्रीमती सुनीता शर्मा (Smt. Sunita Sharma)",
  motherOccupation: "गृहणी (Home Maker)",
  brothers: "1 छोटा भाई (B.Tech, MNC में कार्यरत)",
  sisters: "1 बड़ी बहन (विवाहित, शिक्षिका - जयपुर)",
  familyType: "एकल परिवार (Nuclear Family)",
  familyValues: "पारंपरिक एवं आधुनिक मूल्यों का सुंदर समन्वय",
  nativePlace: "सीकर, राजस्थान (Sikar, Rajasthan)",
  maternalUncle: "श्री दिनेश शर्मा (व्यवसायी, मानसरोवर, जयपुर)",
  land: "15 बीघा सिंचित कृषि भूमि (15 Bigha Agri Land)",
  property: "स्वयं का 3 मंज़िला मकान (जयपुर) व 2 व्यावसायिक दुकानें",

  rashi: "मीन (Pisces)",
  nakshatra: "उत्तराभाद्रपद (Uttara Bhadrapada)",
  gotra: "भारद्वाज (Bhardwaj)",
  manglik: "नहीं (Non-Manglik)",
  kundaliNotes: "नाड़ी: मध्य, गण: मनुष्य, कुंडली मिलान मान्य",

  prefAge: "24 - 28 वर्ष (Years)",
  prefHeight: "5' 2\" से 5' 7\"",
  prefEducation: "स्नातक / परास्नातक (BE / B.Tech / MBA / Post Graduate)",
  prefOccupation: "कामकाजी या गृहणी दोनों स्वीकार्य (Working / Non-Working)",
  prefOther: "संस्कारी, शाकाहारी, उच्च पारिवारिक मूल्यों वाली एवं सकारात्मक दृष्टिकोण की सुयोग्य कन्या।",

  aboutMe: "मैं शांत, सरल और सकारात्मक सोच रखने वाला व्यक्ति हूं। परिवार और पारिवारिक परंपराओं का गहरा सम्मान करता हूं। खाली समय में शास्त्रीय संगीत सुनना, उपन्यास पढ़ना और प्रकृति के निकट यात्रा करना मुझे पसंद है।",

  mobile: "+91 98290 12345",
  whatsapp: "+91 98290 12345",
  email: "rohan.sharma@example.com",
  address: "मकान नं. 45, शांति निकेतन, मालवीय नगर, जयपुर, राजस्थान - 302017",
  cityState: "जयपुर, राजस्थान"
};

// Auspicious Avatar SVG as Default Sample Photo
const SAMPLE_AVATAR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%236e101e"/><stop offset="100%" stop-color="%23cca43b"/></linearGradient></defs><rect width="200" height="200" fill="%23f7f0e4"/><circle cx="100" cy="80" r="42" fill="url(%23g)"/><ellipse cx="100" cy="180" rx="68" ry="48" fill="url(%23g)"/><circle cx="100" cy="74" r="5" fill="%23cca43b"/></svg>`;

/* ===================================================================
   INITIALIZATION
   =================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  loadSavedDraft();
  setupAutoSave();
  updateProgress();
  initTheme();
});

/* ===================================================================
   EVENT LISTENERS SETUP
   =================================================================== */
function setupEventListeners() {
  // Input changes in form
  DOM.biodataForm.addEventListener('input', handleFormInput);
  DOM.biodataForm.addEventListener('change', handleFormInput);

  // Date of Birth auto-calculates Age
  const dobInput = document.getElementById('dob');
  if (dobInput) {
    dobInput.addEventListener('change', handleDobChange);
  }

  // Photo Upload & Removal
  DOM.photoInput.addEventListener('change', handlePhotoUpload);
  DOM.removePhotoBtn.addEventListener('click', handlePhotoRemove);

  // Theme selection chips
  document.querySelectorAll('.theme-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const themeName = chip.getAttribute('data-theme');
      setTheme(themeName);
    });
  });

  // Language Mode selector
  DOM.displayLangSelect.addEventListener('change', handleLanguageModeChange);

  // Top Mantra selector
  DOM.mantraSelect.addEventListener('change', handleMantraChange);
  DOM.customMantraInput.addEventListener('input', () => {
    DOM.sheetMantra.textContent = DOM.customMantraInput.value || "|| श्री गणेशाय नमः ||";
  });

  // Action Buttons
  DOM.loadSampleBtn.addEventListener('click', () => loadSampleData());
  if (DOM.bottomSampleBtn) DOM.bottomSampleBtn.addEventListener('click', () => loadSampleData());
  DOM.saveDraftBtn.addEventListener('click', () => {
    saveDraft(true);
  });
  DOM.resetFormBtn.addEventListener('click', handleResetForm);

  // Download & View Buttons
  DOM.downloadPdfBtn.addEventListener('click', generatePDF);
  DOM.downloadImgBtn.addEventListener('click', generateImage);
  DOM.printBtn.addEventListener('click', handlePrint);
  DOM.fullscreenBtn.addEventListener('click', openFullscreenModal);
  DOM.closeModalBtn.addEventListener('click', closeFullscreenModal);
  DOM.modalPdfBtn.addEventListener('click', generatePDF);
  DOM.modalImgBtn.addEventListener('click', generateImage);

  // Close modal when clicking on backdrop
  DOM.fullscreenModal.addEventListener('click', (e) => {
    if (e.target === DOM.fullscreenModal) closeFullscreenModal();
  });

  // Mobile Navigation Tabs
  if (DOM.tabFormBtn && DOM.tabPreviewBtn) {
    DOM.tabFormBtn.addEventListener('click', () => setMobileView('form'));
    DOM.tabPreviewBtn.addEventListener('click', () => setMobileView('preview'));
  }
  if (DOM.viewPreviewBtn) {
    DOM.viewPreviewBtn.addEventListener('click', () => setMobileView('preview'));
  }

  // Word count for About Me
  const aboutMeInput = document.getElementById('aboutMe');
  if (aboutMeInput) {
    aboutMeInput.addEventListener('input', () => {
      const words = aboutMeInput.value.trim().split(/\s+/).filter(Boolean).length;
      if (DOM.aboutWordCount) DOM.aboutWordCount.textContent = words;
      if (words > 200) {
        DOM.aboutWordCount.style.color = '#ef4444';
      } else {
        DOM.aboutWordCount.style.color = '#64748b';
      }
    });
  }
}

/* ===================================================================
   ACCORDION TOGGLE
   =================================================================== */
window.toggleSection = function(headerElement) {
  const section = headerElement.closest('.form-section');
  if (section) {
    section.classList.toggle('active');
  }
};

/* ===================================================================
   THEME SWITCHING
   =================================================================== */
function initTheme() {
  const savedTheme = localStorage.getItem('biodata_theme') || 'theme-maroon';
  setTheme(savedTheme, false);
}

function setTheme(themeName, showToastMsg = true) {
  DOM.body.classList.remove('theme-maroon', 'theme-blue', 'theme-emerald', 'theme-pink');
  DOM.body.classList.add(themeName);
  AppState.theme = themeName;
  localStorage.setItem('biodata_theme', themeName);

  // Update active chip
  document.querySelectorAll('.theme-chip').forEach(chip => {
    if (chip.getAttribute('data-theme') === themeName) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });

  if (showToastMsg) {
    const themeTitles = {
      'theme-maroon': 'शाही महरून थीम (Royal Maroon)',
      'theme-blue': 'शाही नेवी थीम (Imperial Navy)',
      'theme-emerald': 'पन्ना हरा थीम (Emerald Green)',
      'theme-pink': 'रानी गुलाबी थीम (Royal Magenta)'
    };
    showToast(`${themeTitles[themeName] || themeName} लागू हो गई!`, 'info');
  }
}

/* ===================================================================
   MANTRA SELECTION
   =================================================================== */
function handleMantraChange(e) {
  const val = e.target.value;
  if (val === 'custom') {
    DOM.customMantraInput.classList.remove('hidden');
    DOM.customMantraInput.focus();
    DOM.sheetMantra.textContent = DOM.customMantraInput.value || "|| शुभ विवाह ||";
  } else {
    DOM.customMantraInput.classList.add('hidden');
    const mantraMap = {
      ganesh: "|| श्री गणेशाय नमः ||",
      om: "|| ॐ नमः शिवाय ||",
      krishna: "|| जय श्री कृष्ण ||",
      jain: "|| जय जिनेन्द्र ||",
      gurudev: "|| ॐ श्री गुरुवे नमः ||",
      radhe: "|| श्री राधारमणो जयति ||"
    };
    DOM.sheetMantra.textContent = mantraMap[val] || "|| श्री गणेशाय नमः ||";
  }
  AppState.isDirty = true;
}

/* ===================================================================
   LANGUAGE MODE CHANGE
   =================================================================== */
function handleLanguageModeChange(e) {
  const mode = e.target.value;
  AppState.languageMode = mode;
  document.documentElement.setAttribute('data-lang', mode);

  // Update sheet title depending on selected language
  if (mode === 'hindi') {
    DOM.sheetTitle.innerHTML = `<span class="hi-title">।। विवाह बायोडाटा ।।</span>`;
  } else if (mode === 'english') {
    DOM.sheetTitle.innerHTML = `<span class="en-title" style="font-size:1.4rem;">MARRIAGE BIODATA</span>`;
  } else {
    DOM.sheetTitle.innerHTML = `
      <span class="hi-title">।। विवाह बायोडाटा ।।</span>
      <span class="en-title">MARRIAGE BIODATA</span>
    `;
  }

  showToast(`बायोडाटा भाषा बदली: ${e.target.options[e.target.selectedIndex].text}`, 'info');
  AppState.isDirty = true;
}

/* ===================================================================
   AUTO-CALCULATE AGE FROM DOB
   =================================================================== */
function handleDobChange(e) {
  const dobVal = e.target.value;
  if (!dobVal) return;

  const birthDate = new Date(dobVal);
  const today = new Date();

  if (birthDate > today) {
    showToast("कृपया वैध जन्म तिथि चुनें (भविष्य की तारीख नहीं)", "warning");
    return;
  }

  let years = today.getFullYear() - birthDate.getFullYear();
  let m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    years--;
  }

  const ageInput = document.getElementById('age');
  if (ageInput && years >= 0) {
    const ageFormatted = `${years} वर्ष (${years} Yrs)`;
    ageInput.value = ageFormatted;
    syncValueToPreview('age', ageFormatted);
  }

  handleFormInput();
}

/* ===================================================================
   REAL-TIME FORM INPUT SYNC
   =================================================================== */
function handleFormInput() {
  AppState.isDirty = true;

  // 1. Personal Details
  const fullName = getVal('fullName');
  DOM.previewFullName.textContent = fullName || "श्री / सुश्री नाम (Full Name)";

  const dob = getVal('dob');
  DOM.valDob.textContent = formatDate(dob) || "-";

  const birthTime = getVal('birthTime');
  DOM.valBirthTime.textContent = formatTime(birthTime) || "-";

  const birthPlace = getVal('birthPlace');
  DOM.valBirthPlace.textContent = birthPlace || "-";

  const age = getVal('age');
  DOM.valAge.textContent = age || "-";

  const height = getVal('height');
  DOM.valHeight.textContent = height || "-";

  const weight = getVal('weight');
  DOM.valWeight.textContent = weight || "-";

  const bloodGroup = getVal('bloodGroup');
  DOM.valBloodGroup.textContent = bloodGroup || "-";

  const complexion = getVal('complexion');
  DOM.valComplexion.textContent = complexion || "-";

  const gender = getVal('gender');
  if (DOM.heroGenderPill) {
    if (gender.includes('वधू') || gender.toLowerCase().includes('female')) {
      DOM.heroGenderPill.innerHTML = `<i class="fa-solid fa-venus"></i> वधू (Bride)`;
    } else {
      DOM.heroGenderPill.innerHTML = `<i class="fa-solid fa-mars"></i> वर (Groom)`;
    }
  }

  const maritalStatus = getVal('maritalStatus');
  DOM.valMaritalStatus.textContent = maritalStatus || "-";

  // Top Hero tags update
  const ageDisplay = age ? age.split(' ')[0] + ' वर्ष' : '26 वर्ष';
  const heightDisplay = height || "5' 9\"";
  DOM.tagAgeHeight.innerHTML = `<i class="fa-solid fa-cake-candles"></i> ${ageDisplay} | ${heightDisplay}`;

  // 2. Education & Career
  const education = getVal('education');
  DOM.valEducation.textContent = education || "-";
  DOM.tagEducation.innerHTML = `<i class="fa-solid fa-graduation-cap"></i> ${education ? truncateStr(education, 26) : 'शिक्षा / Education'}`;

  const college = getVal('college');
  DOM.valCollege.textContent = college || "-";

  const occupation = getVal('occupation');
  DOM.valOccupation.textContent = occupation || "-";
  DOM.tagOccupation.innerHTML = `<i class="fa-solid fa-briefcase"></i> ${occupation ? truncateStr(occupation, 26) : 'व्यवसाय / Profession'}`;

  const company = getVal('company');
  DOM.valCompany.textContent = company || "-";

  const income = getVal('income');
  DOM.valIncome.textContent = income || "-";

  const workLocation = getVal('workLocation');
  DOM.valWorkLocation.textContent = workLocation || "-";

  // 3. Family Details
  DOM.valFather.textContent = getVal('fatherName') || "-";
  DOM.valFatherOcc.textContent = getVal('fatherOccupation') || "-";
  DOM.valMother.textContent = getVal('motherName') || "-";
  DOM.valMotherOcc.textContent = getVal('motherOccupation') || "-";
  DOM.valBrothers.textContent = getVal('brothers') || "-";
  DOM.valSisters.textContent = getVal('sisters') || "-";
  DOM.valFamilyType.textContent = getVal('familyType') || "-";
  if (DOM.valFamilyValues) {
    DOM.valFamilyValues.textContent = getVal('familyValues') || "-";
  }

  const nativePlace = getVal('nativePlace');
  DOM.valNativePlace.textContent = nativePlace || "-";

  const maternalUncle = getVal('maternalUncle');
  DOM.valMaternalUncle.textContent = maternalUncle || "-";

  const land = getVal('land');
  if (DOM.valLand) DOM.valLand.textContent = land || "-";

  const property = getVal('property');
  if (DOM.valProperty) DOM.valProperty.textContent = property || "-";

  // 4. Horoscope Details
  const rashi = getVal('rashi');
  const nakshatra = getVal('nakshatra');
  const gotra = getVal('gotra');
  const manglik = getVal('manglik');
  const kundaliNotes = getVal('kundaliNotes');

  DOM.valRashi.textContent = rashi || "-";
  DOM.valNakshatra.textContent = nakshatra || "-";
  DOM.valGotra.textContent = gotra || "-";
  DOM.valManglik.textContent = manglik || "नहीं (Non-Manglik)";

  if (kundaliNotes) {
    DOM.rowKundaliNotes.style.display = 'flex';
    DOM.valKundaliNotes.textContent = kundaliNotes;
  } else {
    DOM.rowKundaliNotes.style.display = 'none';
  }

  // Hide entire horoscope section if everything is empty
  if (!rashi && !nakshatra && !gotra && !kundaliNotes && manglik === "नहीं (Non-Manglik)") {
    // Keep it neat
    DOM.secHoroscope.style.display = 'flex';
  } else {
    DOM.secHoroscope.style.display = 'flex';
  }

  // 5. Partner Preferences
  const prefAge = getVal('prefAge');
  const prefHeight = getVal('prefHeight');
  const prefEdu = getVal('prefEducation');
  const prefOcc = getVal('prefOccupation');
  const prefOther = getVal('prefOther');

  DOM.valPrefAge.textContent = prefAge || "-";
  DOM.valPrefHeight.textContent = prefHeight || "-";
  DOM.valPrefEducation.textContent = prefEdu || "-";
  DOM.valPrefOccupation.textContent = prefOcc || "-";

  if (prefOther) {
    DOM.rowPrefOther.style.display = 'flex';
    DOM.valPrefOther.textContent = prefOther;
  } else {
    DOM.rowPrefOther.style.display = 'none';
  }

  // If preferences empty, show or hide
  if (!prefAge && !prefHeight && !prefEdu && !prefOcc && !prefOther) {
    DOM.secPreferences.style.display = 'none';
  } else {
    DOM.secPreferences.style.display = 'flex';
  }

  // 6. About Me
  const aboutMe = getVal('aboutMe');
  if (aboutMe) {
    DOM.secAbout.style.display = 'flex';
    DOM.valAboutMe.textContent = `"${aboutMe}"`;
  } else {
    DOM.secAbout.style.display = 'none';
  }

  // 7. Contact Details
  const mobile = getVal('mobile');
  DOM.valMobile.textContent = mobile || "-";

  const whatsapp = getVal('whatsapp');
  DOM.valWhatsapp.textContent = whatsapp || "-";
  DOM.rowWhatsapp.style.display = whatsapp ? 'flex' : 'none';

  const email = getVal('email');
  DOM.valEmail.textContent = email || "-";
  DOM.rowEmail.style.display = email ? 'flex' : 'none';

  const address = getVal('address');
  const cityState = getVal('cityState');
  const fullAddr = [address, cityState].filter(Boolean).join(", ");
  DOM.valAddress.textContent = fullAddr || "-";
  DOM.rowAddress.style.display = fullAddr ? 'flex' : 'none';

  // Update Progress Bar
  updateProgress();
}

function getVal(fieldId) {
  const el = document.getElementById(fieldId);
  return el ? el.value.trim() : '';
}

function syncValueToPreview(fieldId, value) {
  if (fieldId === 'age') {
    DOM.valAge.textContent = value;
  }
}

function truncateStr(str, maxLen) {
  if (!str) return '';
  return str.length > maxLen ? str.slice(0, maxLen) + '...' : str;
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
  } catch (e) {}
  return dateStr;
}

function formatTime(timeStr) {
  if (!timeStr) return '';
  try {
    const [h, m] = timeStr.split(':');
    let hours = parseInt(h, 10);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    return `${hours}:${m} ${ampm}`;
  } catch (e) {}
  return timeStr;
}

/* ===================================================================
   PROGRESS BAR CALCULATION
   =================================================================== */
function updateProgress() {
  const keyFields = [
    'fullName', 'dob', 'height', 'education', 'occupation',
    'fatherName', 'motherName', 'mobile', 'address'
  ];

  let filled = 0;
  keyFields.forEach(id => {
    if (getVal(id)) filled++;
  });

  const percentage = Math.round((filled / keyFields.length) * 100);
  if (DOM.progressBar) DOM.progressBar.style.width = `${percentage}%`;
  if (DOM.progressText) DOM.progressText.textContent = `${percentage}%`;
}

/* ===================================================================
   PHOTO UPLOAD, PREVIEW & REMOVAL
   =================================================================== */
function handlePhotoUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  if (!file.type.match('image.*')) {
    showToast("कृपया वैध छवि फ़ाइल चुनें (JPG, PNG, WebP)", "error");
    return;
  }

  // Max 5MB check
  if (file.size > 5 * 1024 * 1024) {
    showToast("छवि का आकार 5MB से कम होना चाहिए", "warning");
    return;
  }

  const reader = new FileReader();
  reader.onload = function(event) {
    const dataUrl = event.target.result;
    applyPhoto(dataUrl);
    AppState.isDirty = true;
    showToast("फोटो सफलतापूर्वक लोड हो गई!", "success");
  };
  reader.readAsDataURL(file);
}

function applyPhoto(dataUrl) {
  AppState.photoDataUrl = dataUrl;

  // Form preview
  DOM.photoPreviewImg.src = dataUrl;
  DOM.photoPreviewImg.classList.remove('hidden');
  DOM.photoPlaceholder.classList.add('hidden');
  DOM.removePhotoBtn.classList.remove('hidden');

  // Biodata sheet preview
  DOM.sheetPhotoImg.src = dataUrl;
  DOM.sheetPhotoImg.classList.remove('hidden');
  DOM.sheetPhotoPlaceholder.classList.add('hidden');
}

function handlePhotoRemove() {
  AppState.photoDataUrl = '';
  DOM.photoInput.value = '';

  DOM.photoPreviewImg.src = '';
  DOM.photoPreviewImg.classList.add('hidden');
  DOM.photoPlaceholder.classList.remove('hidden');
  DOM.removePhotoBtn.classList.add('hidden');

  DOM.sheetPhotoImg.src = '';
  DOM.sheetPhotoImg.classList.add('hidden');
  DOM.sheetPhotoPlaceholder.classList.remove('hidden');

  AppState.isDirty = true;
  showToast("फोटो हटा दी गई", "info");
}

/* ===================================================================
   LOCALSTORAGE AUTO-SAVE & DRAFT MANAGEMENT
   =================================================================== */
function setupAutoSave() {
  // Auto save every 5 seconds if dirty
  AppState.autoSaveTimer = setInterval(() => {
    if (AppState.isDirty) {
      saveDraft(false);
    }
  }, 5000);
}

function saveDraft(manual = false) {
  try {
    const formData = {};
    const inputs = DOM.biodataForm.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      if (input.name && input.type !== 'file') {
        formData[input.name] = input.value;
      }
    });

    const draftData = {
      timestamp: new Date().toISOString(),
      theme: AppState.theme,
      languageMode: AppState.languageMode,
      mantra: DOM.sheetMantra.textContent,
      mantraSelectValue: DOM.mantraSelect.value,
      customMantra: DOM.customMantraInput.value,
      photoDataUrl: AppState.photoDataUrl,
      formData: formData
    };

    localStorage.setItem('biodata_maker_draft', JSON.stringify(draftData));
    AppState.isDirty = false;

    // Update timestamp label
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    if (DOM.lastSavedTime) {
      DOM.lastSavedTime.textContent = `सहेजा: ${timeStr}`;
    }

    if (manual) {
      showToast("ड्राफ्ट सुरक्षित कर लिया गया है (Draft Saved)", "success");
    }
  } catch (err) {
    console.error("Save Draft Error:", err);
    if (manual) showToast("ड्राफ्ट सहेजने में त्रुटि!", "error");
  }
}

function loadSavedDraft() {
  try {
    const raw = localStorage.getItem('biodata_maker_draft');
    if (!raw) return;

    const data = JSON.parse(raw);
    if (!data || !data.formData) return;

    // Populate form inputs
    Object.keys(data.formData).forEach(key => {
      const el = document.querySelector(`[name="${key}"]`);
      if (el) {
        el.value = data.formData[key];
      }
    });

    // Theme & Mantra
    if (data.theme) setTheme(data.theme, false);
    if (data.languageMode && DOM.displayLangSelect) {
      DOM.displayLangSelect.value = data.languageMode;
      handleLanguageModeChange({ target: DOM.displayLangSelect });
    }
    if (data.mantraSelectValue && DOM.mantraSelect) {
      DOM.mantraSelect.value = data.mantraSelectValue;
    }
    if (data.customMantra && DOM.customMantraInput) {
      DOM.customMantraInput.value = data.customMantra;
      DOM.customMantraInput.classList.remove('hidden');
    }
    if (data.mantra && DOM.sheetMantra) {
      DOM.sheetMantra.textContent = data.mantra;
    }

    // Photo
    if (data.photoDataUrl) {
      applyPhoto(data.photoDataUrl);
    }

    handleFormInput();

    if (DOM.lastSavedTime && data.timestamp) {
      const savedDate = new Date(data.timestamp);
      DOM.lastSavedTime.textContent = `अंतिम ड्राफ्ट: ${savedDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    }
  } catch (err) {
    console.warn("Could not load draft:", err);
  }
}

/* ===================================================================
   LOAD SAMPLE DATA (AUTO-FILL)
   =================================================================== */
function loadSampleData() {
  Object.keys(SAMPLE_DATA).forEach(key => {
    const el = document.querySelector(`[name="${key}"]`);
    if (el) {
      el.value = SAMPLE_DATA[key];
    }
  });

  // Load sample avatar
  applyPhoto(SAMPLE_AVATAR_SVG);

  handleFormInput();
  showToast("सुंदर नमूना डेटा लोड हो गया! (Sample Data Loaded)", "success");
}

/* ===================================================================
   RESET FORM
   =================================================================== */
function handleResetForm() {
  const confirmReset = window.confirm("क्या आप वाकई संपूर्ण फॉर्म रीसेट करना चाहते हैं?\n(Are you sure you want to reset all biodata fields?)");
  if (!confirmReset) return;

  DOM.biodataForm.reset();
  handlePhotoRemove();
  localStorage.removeItem('biodata_maker_draft');

  handleFormInput();
  showToast("फॉर्म रीसेट हो गया (Form Reset)", "info");
}

/* ===================================================================
   PRINT FUNCTIONALITY
   =================================================================== */
function handlePrint() {
  window.print();
}

/* ===================================================================
   DOWNLOAD AS HIGH RESOLUTION IMAGE (PNG)
   =================================================================== */
async function generateImage() {
  const candidateName = getVal('fullName') || 'Marriage_Candidate';
  const cleanName = candidateName.replace(/[^a-zA-Z0-9\u0900-\u097F_-]/g, '_').substring(0, 30);
  const fileName = `Biodata_${cleanName}.png`;

  showToast("इमेज तैयार हो रही है, कृपया प्रतीक्षा करें... (Generating Image...)", "info");

  try {
    // Wait for fonts to finish loading for crisp typography
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const sheet = DOM.biodataSheet;
    
    // Temporarily ensure full visibility without scroll issues
    const originalTransform = sheet.style.transform;
    sheet.style.transform = 'none';

    // Capture with html2canvas (Scale 2.2 for high density, retina quality)
    const canvas = await html2canvas(sheet, {
      scale: 2.2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200
    });

    // Restore original transform
    sheet.style.transform = originalTransform;

    // Convert to image download link
    const imageUri = canvas.toDataURL('image/png', 1.0);
    const link = document.createElement('a');
    link.download = fileName;
    link.href = imageUri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showToast("इमेज सफलतापूर्वक डाउनलोड हो गई! (Image Downloaded)", "success");
  } catch (error) {
    console.error("Image generation error:", error);
    showToast("इमेज बनाने में विफलता, कृपया पुनः प्रयास करें।", "error");
  }
}

/* ===================================================================
   DOWNLOAD AS HIGH QUALITY A4 PDF (jsPDF + html2canvas)
   =================================================================== */
async function generatePDF() {
  const JsPdfConstructor = getJsPdfConstructor();
  if (!JsPdfConstructor) {
    showToast("PDF लाइब्रेरी लोड हो रही है, कृपया 2 सेकंड बाद पुनः प्रयास करें।", "warning");
    return;
  }

  const candidateName = getVal('fullName') || 'Marriage_Candidate';
  const cleanName = candidateName.replace(/[^a-zA-Z0-9\u0900-\u097F_-]/g, '_').substring(0, 30);
  const fileName = `Biodata_${cleanName}.pdf`;

  showToast("उच्च गुणवत्ता वाला PDF तैयार किया जा रहा है... (Generating PDF...)", "info");

  try {
    // Wait for fonts to finish rendering
    if (document.fonts && document.fonts.ready) {
      await document.fonts.ready;
    }

    const sheet = DOM.biodataSheet;
    const originalTransform = sheet.style.transform;
    sheet.style.transform = 'none';

    // Capture using html2canvas with high pixel ratio
    const canvas = await html2canvas(sheet, {
      scale: 2.2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
      scrollX: 0,
      scrollY: 0,
      windowWidth: 1200
    });

    sheet.style.transform = originalTransform;

    const imgData = canvas.toDataURL('image/jpeg', 0.96);

    // Initialize jsPDF A4 portrait document
    const pdf = new JsPdfConstructor({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true
    });

    // A4 dimensions in mm: 210 x 297
    const pdfWidth = 210;
    const pdfHeight = 297;

    // Add image fitting the exact A4 page
    pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
    pdf.save(fileName);

    showToast("PDF सफलतापूर्वक डाउनलोड हो गई! (PDF Downloaded)", "success");
  } catch (error) {
    console.error("PDF generation failed:", error);
    showToast("PDF तैयार करने में त्रुटि आई। कृपया पुनः प्रयास करें।", "error");
  }
}

/* ===================================================================
   FULLSCREEN PREVIEW MODAL
   =================================================================== */
function openFullscreenModal() {
  DOM.modalBody.innerHTML = '';
  const clone = DOM.biodataSheet.cloneNode(true);
  clone.id = 'biodataSheetClone';
  clone.style.transform = 'none';
  clone.style.margin = '0 auto';
  DOM.modalBody.appendChild(clone);
  DOM.fullscreenModal.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeFullscreenModal() {
  DOM.fullscreenModal.classList.remove('active');
  document.body.style.overflow = 'auto';
}

/* ===================================================================
   MOBILE VIEW SWITCHING (FORM <-> PREVIEW)
   =================================================================== */
function setMobileView(view) {
  if (view === 'preview') {
    DOM.body.classList.add('mobile-view-preview');
    if (DOM.tabFormBtn) DOM.tabFormBtn.classList.remove('active');
    if (DOM.tabPreviewBtn) DOM.tabPreviewBtn.classList.add('active');
    // Scroll to top of preview
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    DOM.body.classList.remove('mobile-view-preview');
    if (DOM.tabFormBtn) DOM.tabFormBtn.classList.add('active');
    if (DOM.tabPreviewBtn) DOM.tabPreviewBtn.classList.remove('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* ===================================================================
   TOAST NOTIFICATION HELPER
   =================================================================== */
function showToast(message, type = 'info') {
  if (!DOM.toastContainer) return;

  const iconMap = {
    success: 'fa-circle-check',
    info: 'fa-circle-info',
    warning: 'fa-triangle-exclamation',
    error: 'fa-circle-xmark'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <i class="fa-solid ${iconMap[type] || 'fa-bell'}"></i>
    <span>${message}</span>
  `;

  DOM.toastContainer.appendChild(toast);

  // Auto remove toast after 3.8 seconds
  setTimeout(() => {
    toast.style.animation = 'fadeOut 0.4s forwards';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 400);
  }, 3800);
}
