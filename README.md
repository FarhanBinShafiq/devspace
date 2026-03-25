<p align="center">
  <img src="https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Chrome Extension" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/License-MIT-green?style=for-the-badge" alt="License" />
</p>

<h1 align="center">⚡ DevSpace</h1>

<p align="center">
  <strong>The All-in-One Developer Toolkit — Chrome Extension</strong>
</p>

<p align="center">
  Code Snippets · Color Picker · Grid Overlay · Responsive Checker
</p>

<p align="center">
  <a href="#-installation">Install</a> •
  <a href="#-features">Features</a> •
  <a href="#-screenshots">Screenshots</a> •
  <a href="#%EF%B8%8F-tech-stack">Tech Stack</a> •
  <a href="#-contributing">Contributing</a> •
  <a href="#-license">License</a>
</p>

---

## 🔥 What is DevSpace?

**DevSpace** is a feature-packed Chrome extension designed exclusively for web developers and designers. It combines four essential tools into one sleek, dark-themed popup — eliminating the need to install multiple separate extensions.

Whether you're debugging CSS grids, grabbing colors from a live website, testing responsiveness across devices, or saving code snippets for later — DevSpace has you covered.

---

## 🚀 Features

### 📝 Code Snippet Manager
- Save, organize, and retrieve code snippets instantly
- Multi-language support (JavaScript, TypeScript, Python, HTML, CSS, JSON, SQL, Bash)
- Tag-based organization with comma-separated tags
- ⭐ Favorite snippets for quick access
- 🔍 Real-time search across titles and tags
- One-click copy to clipboard
- Persistent storage via Chrome Storage API

### 🎨 Advanced Color Picker
- **EyeDropper API** — Pick any color from any pixel on your screen
- Auto-saves up to **20 colors** in your pick history
- **8 curated preset palettes**: Ocean, Sunset, Forest, Cyberpunk, Royal, Monochrome, Coral Reef, Northern Lights
- One-click HEX copy for any color
- Clear history with a single click
- Persistent color history across sessions

### 📐 Grid Overlay System
- Inject a **customizable column grid** overlay onto any live webpage
- **Columns mode** (filled) or **Lines mode** (borders only)
- Fully configurable:
  - `1–24` columns
  - `0–64px` gutter spacing
  - `0–120px` margin
  - `320–2560px` max container width
  - `1–50%` opacity control
- **8 overlay color presets** (Indigo, Red, Emerald, Amber, Cyan, Pink, Violet, White)
- Quick reference breakpoint table (Mobile → Ultra-wide)
- Grid state persists across popup open/close

### 📱 Responsive Device Checker
- Test any URL across **18+ real device presets**:

  | Category | Devices |
  |----------|---------|
  | 📱 Phones | iPhone SE, iPhone 12/13, iPhone 14 Pro Max, Samsung Galaxy S21, Google Pixel 7, iPhone XR |
  | 📋 Tablets | iPad Mini, iPad Air, iPad Pro 11", iPad Pro 12.9", Surface Pro 7, Galaxy Tab S7 |
  | 🖥️ Desktops | Laptop HD, MacBook Air 13", MacBook Pro 16", FHD, QHD, 4K |

- **Custom width × height** input with instant test
- **Portrait / Landscape** toggle
- Filter devices by category (All, Phones, Tablets, Desktop)
- Opens a properly sized browser window for testing

---

## 📸 Screenshots

<details>
<summary><strong>Click to view screenshots</strong></summary>

### Library (Snippets)
> The home screen — search, favorite, copy, and manage your code snippets.

### Color Picker
> Pick colors from anywhere on screen and browse curated preset palettes.

### Grid Overlay
> Full grid configuration panel with sliders, color presets, and breakpoint reference.

### Responsive Checker
> Test any URL across 18+ devices with custom sizes and landscape support.

</details>

---

## 📦 Installation

### From Source (Developer Mode)

1. **Clone the repository**
   ```bash
   git clone https://github.com/FarhanBinShafiq/devspace.git
   cd devspace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Build for production**
   ```bash
   npm run build
   ```

4. **Load into Chrome**
   - Open `chrome://extensions/`
   - Enable **Developer Mode** (top-right toggle)
   - Click **"Load unpacked"**
   - Select the `dist/` folder from the project

5. **Done!** Click the DevSpace icon in your toolbar to start using it.

### Development Mode

```bash
npm run dev
```

Open `http://localhost:5173` to preview the popup UI during development.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| [React 19](https://react.dev) | UI Components |
| [Vite 8](https://vite.dev) | Build Tool & Dev Server |
| [Tailwind CSS 4](https://tailwindcss.com) | Styling |
| [Lucide React](https://lucide.dev) | Icons |
| [Chrome Extension Manifest V3](https://developer.chrome.com/docs/extensions/mv3/) | Extension Platform |
| [EyeDropper API](https://developer.mozilla.org/en-US/docs/Web/API/EyeDropper_API) | Screen Color Picking |
| [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/api/storage) | Persistent Data |

---

## 📁 Project Structure

```
devspace/
├── public/
│   ├── content.js          # Content script for grid overlay injection
│   ├── manifest.json       # Chrome Extension manifest (MV3)
│   └── favicon.svg         # Extension icon
├── src/
│   ├── components/
│   │   └── Popup.jsx       # Main extension popup (all tabs)
│   ├── App.jsx             # App entry component
│   ├── main.jsx            # React DOM entry point
│   └── index.css           # Global styles & scrollbar
├── devspace-website.html   # Product landing page (single file)
├── index.html              # Vite HTML entry
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies & scripts
└── README.md               # You are here!
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

### Ideas for Contributions
- [ ] Export/Import snippets as JSON
- [ ] Syntax highlighting in code preview
- [ ] CSS unit converter tool
- [ ] Accessibility checker integration
- [ ] Dark/Light theme toggle
- [ ] Browser extension for Firefox

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Farhan Bin Shafiq**

- GitHub: [@FarhanBinShafiq](https://github.com/FarhanBinShafiq)

---

<p align="center">
  <strong>If you find DevSpace useful, please ⭐ star the repo!</strong>
</p>

<p align="center">
  Built with ❤️ by developers, for developers.
</p>
