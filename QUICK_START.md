# Quick Start Guide

## Setup (One-time)

```bash
pnpm install
```

## Usage

### 1. Edit Your Resume

Edit `resume.yaml` with your information.

### 2. Preview

```bash
pnpm dev
```

This opens your resume in a browser with live reload.

### 3. Change Theme

**In Browser**: Click the paint palette button (top-right) to cycle through themes in real-time.

Available themes: `professional-blue`, `elegant-green`, `modern-purple`

**Toggle Dark Mode**: Click the sun/moon button (top-right)

### 4. Build for Production

```bash
pnpm build
```

Output: `build/` directory

### 5. Export to PDF

1. Open the resume in browser (`pnpm dev`)
2. Press Ctrl+P / Cmd+P
3. Select "Save as PDF"
4. Enable "Background graphics"
5. Save

## Control Page Breaks

In your `resume.yaml`, set `pageBreakAfter: true`:

```yaml
experience:
  - title: Senior Developer
    company: Tech Corp
    duration: 2020 - Present
    responsibilities:
      - Built amazing things
    pageBreakAfter: true  # Page break after this entry
```

## Create Custom Theme

1. Copy a theme file from `themes/` directory
2. Rename it (e.g., `my-theme.json`)
3. Edit colors and fonts
4. Rebuild: `pnpm dev`
5. Your new theme will automatically appear in the theme switcher!

## Deploy

```bash
# Set environment variables
export DEPLOY_HOST=user@yourserver.com
export DEPLOY_PATH=/var/www/html/resume

# Uncomment execSync in deploy.js, then:
pnpm deploy
```

## Tips

- **Theme switching**: All themes are embedded in the HTML - switch instantly without rebuilding
- **Persistence**: Theme and dark mode preferences are saved in localStorage
- Use YAML for easier editing, or JSON if you prefer
- All Tailwind classes are available in the template
- Modify `src/template.hbs` for layout changes
- Edit `src/style.css` for custom styles
- Add new themes to `themes/` directory - they'll automatically appear in the switcher
