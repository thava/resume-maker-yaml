import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Handlebars from 'handlebars';
import postcss from 'postcss';
import tailwindcssPlugin from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const RESUME_FILE = process.env.RESUME_FILE || ''

// Helper function to read resume data (YAML or JSON)
function readResumeData() {

  let yamlPath = path.join(__dirname, `resume.yaml`);
  let jsonPath = path.join(__dirname, `resume.json`);

  if (RESUME_FILE.toLowerCase().endsWith('.yaml')){
    yamlPath = RESUME_FILE
    jsonPath = ''           // when yaml file given do not try json.
  }

  if (RESUME_FILE.toLowerCase().endsWith('.json')){
    jsonPath = RESUME_FILE
    yamlPath = ''           // when json file given do not try yaml.
  }

  try {
    // Try YAML first
    if (fs.existsSync(yamlPath)) {
      console.log(`📄 Reading resume from: ${yamlPath}`);
      const yamlContent = fs.readFileSync(yamlPath, 'utf8');
      return yaml.load(yamlContent);
    }
    // Fallback to JSON
    if (fs.existsSync(jsonPath)) {
      console.log(`📄 Reading resume from: ${jsonPath}`);
      const jsonContent = fs.readFileSync(jsonPath, 'utf8');
      return JSON.parse(jsonContent);
    }

    throw new Error(`Resume file not found: ${yamlPath} or ${jsonPath}`);
  } catch (error) {
    console.error('❌ Error reading resume data:', error.message);
    process.exit(1);
  }
}

// Helper function to read theme
function readTheme(themeName) {
  const themePath = path.join(__dirname, 'themes', `${themeName}.json`);

  try {
    if (!fs.existsSync(themePath)) {
      throw new Error(`Theme not found: ${themePath}`);
    }

    console.log(`🎨 Using theme: ${themeName}`);
    const themeContent = fs.readFileSync(themePath, 'utf8');
    return JSON.parse(themeContent);
  } catch (error) {
    console.error('❌ Error reading theme:', error.message);
    console.log('Available themes:');
    const themesDir = path.join(__dirname, 'themes');
    if (fs.existsSync(themesDir)) {
      fs.readdirSync(themesDir)
        .filter(file => file.endsWith('.json'))
        .forEach(file => console.log(`  - ${file.replace('.json', '')}`));
    }
    process.exit(1);
  }
}

// Helper function to read all themes
function readAllThemes() {
  const themesDir = path.join(__dirname, 'themes');
  const themes = {};

  try {
    const files = fs.readdirSync(themesDir).filter(file => file.endsWith('.json'));

    files.forEach(file => {
      const themeName = file.replace('.json', '');
      const themePath = path.join(themesDir, file);
      const themeContent = fs.readFileSync(themePath, 'utf8');
      themes[themeName] = JSON.parse(themeContent);
    });

    return themes;
  } catch (error) {
    console.error('❌ Error reading themes directory:', error.message);
    process.exit(1);
  }
}

// Main build function
async function build() {
  console.log('🚀 Building resume...\n');

  // Read resume data
  const resumeData = readResumeData();

  // Read all themes
  const allThemes = readAllThemes();

  // Determine default theme (for initial page load)
  let defaultThemeName;

  // 1. Check if default-theme.json exists
  if (allThemes['default-theme']) {
    defaultThemeName = 'default-theme';
  }
  // 2. Check environment variable
  else if (process.env.THEME && allThemes[process.env.THEME]) {
    defaultThemeName = process.env.THEME;
  }
  // 3. Pick first available theme
  else {
    const themeKeys = Object.keys(allThemes);
    defaultThemeName = themeKeys.length > 0 ? themeKeys[0] : null;
  }

  if (!defaultThemeName || !allThemes[defaultThemeName]) {
    console.error('❌ No themes found in themes/ directory');
    process.exit(1);
  }

  const theme = allThemes[defaultThemeName];

  // Register Handlebars helpers
  Handlebars.registerHelper('json', function(context) {
    return JSON.stringify(context);
  });

  Handlebars.registerHelper('isString', function(value) {
    return typeof value === 'string';
  });

  Handlebars.registerHelper('isObject', function(value) {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  });

  Handlebars.registerHelper('isArray', function(value) {
    return Array.isArray(value);
  });

  // Read template
  const templatePath = path.join(__dirname, 'src', 'template.hbs');
  const templateContent = fs.readFileSync(templatePath, 'utf8');

  // Compile template
  const template = Handlebars.compile(templateContent);

  // Merge data with theme and all themes
  const data = {
    ...resumeData,
    theme,
    allThemes,
    currentTheme: defaultThemeName
  };

  // Generate HTML
  let html = template(data);

  // Process CSS with Tailwind and PostCSS
  console.log('🎨 Processing CSS with Tailwind...');
  const srcCssPath = path.join(__dirname, 'src', 'style.css');
  const cssInput = fs.readFileSync(srcCssPath, 'utf8');

  const result = await postcss([
    tailwindcssPlugin,
    autoprefixer,
  ]).process(cssInput, { from: srcCssPath, to: undefined });

  // Inline the processed CSS into HTML
  html = html.replace(
    '<link rel="stylesheet" href="./style.css">',
    `<style>${result.css}</style>`
  );

  // Ensure dist directory exists
  const distDir = path.join(__dirname, 'dist');
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  // Write HTML file with inlined CSS
  const outputPath = path.join(distDir, 'index.html');
  fs.writeFileSync(outputPath, html, 'utf8');

  const sizeKB = (Buffer.byteLength(html, 'utf8') / 1024).toFixed(1);

  console.log(`\n✅ Resume built successfully!`);
  console.log(`📂 Output: ${outputPath} (${sizeKB} KB)`);
  console.log(`🎨 Default Theme: ${theme.name}`);
  console.log(`📦 Embedded Themes: ${Object.keys(allThemes).join(', ')}`);
  console.log(`\n💡 Single self-contained HTML file with inlined CSS and JavaScript`);
  console.log(`   Run "pnpm build" to generate optimized production build in ./build`);
}

// Run build
build();
