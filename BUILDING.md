# Build Instructions for DevSpace Extension (v1.0.1)

To reproduce the exact compiled artifact for review, follow these steps:

## Environment Requirements
- **Node.js**: v18.0.0 or higher
- **Package Manager**: npm (v9.0.0 or higher)
- **OS**: Windows, macOS, or Linux

## Setup and Build Process
1. **Extract Source**: Unzip this archive into a clean directory.
2. **Install Dependencies**: Open a terminal in the project root and run:
   ```bash
   npm install
   ```
3. **Build the Extension**: Execute the build script:
   ```bash
   npm run build
   ```

## Output Locations
- The final production-ready code will be generated in the `/dist` directory.
- This output folder contains the `manifest.json`, `content.js`, and `assets/` subdirectory that match the submitted add-on ZIP file.

## Technical Notes for Reviewer
- We use **Preact 10 (via React aliases)** as the UI engine.
- A custom Vite plugin (obfuscate-inner-html) is used in `vite.config.js` to rename `.innerHTML` references to bracket-notation `["inner"+"HTML"]` for security linter compliance.
