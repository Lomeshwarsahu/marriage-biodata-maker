# 💍 विवाह बायोडाटा मेकर | Marriage Biodata Maker

A modern, responsive, client-side web application designed to help users create elegant, traditional Indian wedding biodatas. Users can fill out their personal, educational, family, horoscope, and contact details, preview the biodata live in real-time, and download it as an **A4 PDF** or high-resolution **Image (PNG)**.

---

## ✨ Features

- 📜 **Traditional Indian Design**: Features Lord Ganesha motif (`|| श्री गणेशाय नमः ||`), Sanskrit blessings, ornate golden borders, and traditional filigree corners.
- 🎨 **4 Royal Color Themes**:
  - **Royal Maroon & Gold (शाही महरून)** – Traditional North/Central Indian wedding palette.
  - **Imperial Navy & Gold (शाही नेवी)** – Contemporary royal aesthetic.
  - **Emerald Green & Gold (पन्ना हरा)** – Auspicious festive greenery and gold.
  - **Royal Magenta & Gold (रानी गुलाबी)** – Vibrant Rajasthani royal celebration style.
- 🌐 **Bilingual Support (द्विभाषी)**: All form fields feature dual Hindi & English labels. Supports typing in Hindi or English, with a language toggle for the final biodata sheet (Bilingual, Hindi Only, or English Only).
- 🖨️ **High-Quality Export**:
  - **PDF Download**: Calibrated to exact A4 portrait dimensions using `jsPDF` + `html2canvas` at 2.2x pixel ratio.
  - **Image Download**: High-resolution PNG format (`Biodata_[FullName].png`).
  - **Print Option**: Dedicated `@media print` CSS for direct clean A4 printing without browser interface clutter.
- ⚡ **Auto-calculate Age**: Automatically calculates and formats age (e.g. `26 वर्ष (26 Yrs)`) from the Date of Birth picker.
- 📷 **Photo Upload**: Client-side photo upload with immediate circular preview, replace, and remove capabilities (rendered as base64 data URLs to prevent canvas CORS issues).
- 💾 **Auto-Save & LocalStorage**: Automatically saves form data locally every 5 seconds so work is never lost. Includes manual "Save Draft" and "Reset Form" actions.
- 🪄 **Load Sample Data**: One-click sample profile loader with realistic traditional Indian biodata information for instant testing.
- 📱 **Fully Responsive Layout**:
  - Desktop: Side-by-side split screen (form on left, live updating A4 preview on right).
  - Tablet/Mobile: Smooth tab switcher between form and live preview with full-screen zoom modal.

---

## 🚀 Getting Started

Because this application is 100% client-side with zero backend dependencies, you can run it immediately without any build steps!

### Option 1: Direct File Open
Simply double-click `index.html` in your file explorer to open it in any modern web browser (Chrome, Edge, Firefox, Safari, Brave).

### Option 2: Local HTTP Server (Optional)
If you prefer running via a local server:
```bash
# Using Node.js npx:
npx serve .

# Or using Python:
python -m http.server 8000
```
Open `http://localhost:8000` or `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
BIODATASide/
├── index.html       # Single-page application structure & traditional biodata template
├── styles.css       # Complete responsive styling, 4 royal color themes & print CSS
├── app.js           # Core logic: live preview, age calculation, auto-save, PDF/PNG export
└── README.md        # Documentation and deployment guide
```

---

## 🛠️ Tech Stack & CDNs

- **HTML5 & CSS3**: Custom CSS grid, flexbox, glassmorphic UI, and ornate vector styling.
- **JavaScript (Vanilla ES6+)**: Modular client-side architecture.
- **jsPDF (v2.5.1)**: `https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
- **html2canvas (v1.4.1)**: `https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js`
- **Google Fonts**: *Cinzel*, *Noto Serif Devanagari*, *Rozha One*, *Yatra One*, and *Poppins*.
- **Font Awesome 6.5.1**: Scalable vector icons.

---

## 🌐 Deploy to Static Hosting

You can deploy this project instantly to any static hosting provider for free:

- **GitHub Pages**:
  1. Push this folder to a GitHub repository.
  2. Navigate to **Settings > Pages**.
  3. Under **Branch**, select `main` and root `/`, then click **Save**.
- **Netlify**:
  - Drag and drop this folder directly into the [Netlify Drop](https://app.netlify.com/drop) dashboard.
- **Vercel**:
  - Run `vercel` or link your GitHub repository.

---

## 📄 License
Open source and free to use for personal or commercial marriage biodata generation.
