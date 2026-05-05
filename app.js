const canvas = document.getElementById('coverCanvas');
const ctx = canvas.getContext('2d');

const platforms = [
  { id: 'x', name: 'X 封面', width: 2500, height: 1000, ratio: '5:2' },
  { id: 'youtube', name: 'YouTube 缩略图', width: 1280, height: 720, ratio: '16:9' },
  { id: 'wechat', name: '公众号首图', width: 900, height: 383, ratio: '2.35:1' },
  { id: 'channels', name: '视频号竖版', width: 1080, height: 1260, ratio: '6:7' },
  { id: 'xiaohongshu', name: '小红书竖版', width: 1080, height: 1440, ratio: '3:4' },
  { id: 'douyin', name: '抖音/竖屏', width: 1080, height: 1920, ratio: '9:16' }
];

const horizontalTemplates = [
  { id: 'center', name: '中轴标题', align: 'center' },
  { id: 'left', name: '左侧刊物', align: 'left' },
  { id: 'poster', name: '竖版海报', align: 'poster' },
  { id: 'split', name: '分栏摘要', align: 'split' }
];

const verticalTemplates = [
  { id: 'v-poster', name: '居中海报', align: 'v-poster' },
  { id: 'v-top', name: '上标题版', align: 'v-top' },
  { id: 'v-left', name: '左轴标题', align: 'v-left' },
  { id: 'v-bottom', name: '底部标题', align: 'v-bottom' }
];

const patterns = [
  { id: 'grid', name: '极细网格' },
  { id: 'dots', name: '细点阵列' },
  { id: 'diagonal', name: '斜向纹理' },
  { id: 'cross', name: '交叉细线' },
  { id: 'corners', name: '四角标尺' },
  { id: 'noise', name: '颗粒噪点' },
  { id: 'none', name: '无花纹' }
];

const palettes = [
  { id: 'carbon-mint', name: '炭黑薄荷', bg: '#101312', bg2: '#1a1e1b', text: '#f0ecdf', muted: '#858b82', accent: '#68b692', mark: '#ffffff' },
  { id: 'ink-gold', name: '墨黑旧金', bg: '#0b0b0a', bg2: '#181611', text: '#f4eddf', muted: '#8c8576', accent: '#d0ab55', mark: '#ffffff' },
  { id: 'oxide', name: '氧化砖红', bg: '#211714', bg2: '#31211d', text: '#f1e4d2', muted: '#a18b7e', accent: '#da7249', mark: '#fff5e8' },
  { id: 'paper', name: '素纸黑字', bg: '#e4ded0', bg2: '#d5cdbd', text: '#1c1a17', muted: '#6f685e', accent: '#9f3027', mark: '#1c1a17' },
  { id: 'night-blue', name: '夜青网格', bg: '#0c151a', bg2: '#13222b', text: '#e9f0ef', muted: '#75858a', accent: '#00b59f', mark: '#ffffff' },
  { id: 'olive', name: '橄榄深绿', bg: '#1d241a', bg2: '#2a3122', text: '#efe7ce', muted: '#929679', accent: '#b8a751', mark: '#ffffff' },
  { id: 'gray-blue', name: '莫兰迪蓝', bg: '#29323b', bg2: '#35404a', text: '#eadfce', muted: '#99a1a7', accent: '#d59b69', mark: '#ffffff' },
  { id: 'cream-mint', name: '浅底绿字', bg: '#e9eee8', bg2: '#dce4dc', text: '#1e2823', muted: '#65756c', accent: '#2d8d70', mark: '#1e2823' },
  { id: 'plum', name: '深梅玫瑰', bg: '#261824', bg2: '#342031', text: '#f3e3e7', muted: '#947a8b', accent: '#d77a96', mark: '#ffffff' },
  { id: 'charcoal-red', name: '炭灰朱砂', bg: '#151413', bg2: '#24201d', text: '#efe8dc', muted: '#8d8277', accent: '#c84f3c', mark: '#ffffff' },
  { id: 'moss-paper', name: '苔纸墨绿', bg: '#d9ddcf', bg2: '#c9d0be', text: '#20251d', muted: '#68715f', accent: '#506f3d', mark: '#20251d' },
  { id: 'deep-cyan', name: '深青冷白', bg: '#091617', bg2: '#102426', text: '#e8f1ec', muted: '#6f8988', accent: '#4fc3b1', mark: '#ffffff' },
  { id: 'ash-lime', name: '灰烬青柠', bg: '#171917', bg2: '#252824', text: '#edf0df', muted: '#878c7c', accent: '#b7d35d', mark: '#ffffff' },
  { id: 'clay-blue', name: '陶土雾蓝', bg: '#2d302d', bg2: '#39413f', text: '#ede3d5', muted: '#a29a8f', accent: '#83a7b3', mark: '#ffffff' },
  { id: 'black-crimson', name: '黑底绛红', bg: '#0e0c0d', bg2: '#1f1416', text: '#f2e8df', muted: '#897a78', accent: '#b94356', mark: '#ffffff' },
  { id: 'linen-teal', name: '亚麻松石', bg: '#e1dccb', bg2: '#d1d0c0', text: '#192421', muted: '#667168', accent: '#24837a', mark: '#192421' },
  { id: 'forest-amber', name: '森绿琥珀', bg: '#121a15', bg2: '#1f2a20', text: '#efe6ce', muted: '#828b75', accent: '#d19a3a', mark: '#ffffff' },
  { id: 'iron-violet', name: '铁灰紫罗', bg: '#1a1920', bg2: '#292735', text: '#eee7df', muted: '#8b8795', accent: '#9b83d4', mark: '#ffffff' },
  { id: 'rice-ink', name: '米纸墨黑', bg: '#ebe4d4', bg2: '#dcd2c0', text: '#141311', muted: '#6b6258', accent: '#2c2a25', mark: '#141311' },
  { id: 'ocean-sand', name: '海雾沙金', bg: '#202b31', bg2: '#2d3a40', text: '#eee5d4', muted: '#9aa1a2', accent: '#c9ad72', mark: '#ffffff' },
  { id: 'pine-rose', name: '松针玫红', bg: '#13201b', bg2: '#20352d', text: '#f0e8dc', muted: '#83928a', accent: '#d66d86', mark: '#ffffff' },
  { id: 'slate-orange', name: '石板橙线', bg: '#202326', bg2: '#303539', text: '#ece6dc', muted: '#90969a', accent: '#e28b4d', mark: '#ffffff' },
  { id: 'warm-gray', name: '暖灰朱线', bg: '#d8d2c6', bg2: '#c8c1b6', text: '#1d1c1a', muted: '#6f6962', accent: '#b44d3b', mark: '#1d1c1a' },
  { id: 'blueprint', name: '蓝图白线', bg: '#111b2a', bg2: '#1c2d45', text: '#e6edf1', muted: '#8190a0', accent: '#7fb2e8', mark: '#ffffff' },
  { id: 'cocoa-mint', name: '可可薄荷', bg: '#1e1713', bg2: '#2f231b', text: '#efe1d1', muted: '#9a8574', accent: '#77c1a3', mark: '#ffffff' },
  { id: 'jade-paper', name: '玉纸深墨', bg: '#dce4dc', bg2: '#cbd8cf', text: '#17211c', muted: '#66756d', accent: '#0f6b57', mark: '#17211c' },
  { id: 'midnight-silver', name: '午夜银灰', bg: '#0f1115', bg2: '#1d222a', text: '#eef0ef', muted: '#7f858c', accent: '#bfc7c9', mark: '#ffffff' },
  { id: 'mulberry', name: '桑葚灰粉', bg: '#241a20', bg2: '#33252d', text: '#f2e4e8', muted: '#9b818e', accent: '#c86485', mark: '#ffffff' },
  { id: 'bronze-green', name: '铜绿旧纸', bg: '#24251c', bg2: '#343428', text: '#eee3c8', muted: '#958d75', accent: '#9f8450', mark: '#ffffff' },
  { id: 'fog-black', name: '雾白黑标', bg: '#f0eee6', bg2: '#dedbd2', text: '#171716', muted: '#74716a', accent: '#111111', mark: '#171716' },
  { id: 'red-bean', name: '赤豆米白', bg: '#2a1514', bg2: '#3a201d', text: '#f3e7d8', muted: '#a0877e', accent: '#cc6757', mark: '#ffffff' },
  { id: 'cold-moss', name: '冷苔青灰', bg: '#17201e', bg2: '#23302d', text: '#e5ebe4', muted: '#7c8b86', accent: '#86b686', mark: '#ffffff' },
  { id: 'indigo-cream', name: '靛蓝奶白', bg: '#17182a', bg2: '#252742', text: '#f0eadc', muted: '#898aa1', accent: '#cbbf8a', mark: '#ffffff' },
  { id: 'graphite-blue', name: '石墨蓝光', bg: '#16191d', bg2: '#242a31', text: '#eef0ec', muted: '#848b92', accent: '#5aa7d6', mark: '#ffffff' },
  { id: 'lotus-ink', name: '荷粉墨黑', bg: '#ece3df', bg2: '#ddd1cb', text: '#1b1918', muted: '#786d68', accent: '#b95f72', mark: '#1b1918' },
  { id: 'dry-grass', name: '枯草墨绿', bg: '#272718', bg2: '#393723', text: '#efe5c8', muted: '#999073', accent: '#c0b15e', mark: '#ffffff' },
  { id: 'storm-teal', name: '风暴青绿', bg: '#111719', bg2: '#1d2b2f', text: '#e9efec', muted: '#7a8a8e', accent: '#45a99a', mark: '#ffffff' },
  { id: 'wine-paper', name: '酒红素纸', bg: '#e5ddd1', bg2: '#d4cabe', text: '#1f1918', muted: '#746762', accent: '#8e2833', mark: '#1f1918' },
  { id: 'charcoal-lilac', name: '炭黑丁香', bg: '#141316', bg2: '#232027', text: '#eee7df', muted: '#8d8490', accent: '#b391c4', mark: '#ffffff' },
  { id: 'sage-clay', name: '鼠尾陶灰', bg: '#cacfc0', bg2: '#b9c1b0', text: '#20231e', muted: '#697060', accent: '#8d6b4f', mark: '#20231e' },
  { id: 'black-copper', name: '黑铜细线', bg: '#0d0c0b', bg2: '#1b1713', text: '#eee5d7', muted: '#887c70', accent: '#b77a42', mark: '#ffffff' },
  { id: 'lake-gray', name: '湖灰青线', bg: '#263033', bg2: '#344145', text: '#e9e2d6', muted: '#98a0a0', accent: '#73b4b1', mark: '#ffffff' },
  { id: 'plain-red', name: '白底朱红', bg: '#eeeae1', bg2: '#dfd8ce', text: '#191716', muted: '#756d65', accent: '#c5362c', mark: '#191716' },
  { id: 'olive-black', name: '橄黑明黄', bg: '#11130e', bg2: '#202419', text: '#efead7', muted: '#858879', accent: '#dfc84d', mark: '#ffffff' },
  { id: 'deep-plum-gold', name: '深梅旧金', bg: '#1a1118', bg2: '#2c1b28', text: '#f0e2dc', muted: '#927b89', accent: '#c59a53', mark: '#ffffff' },
  { id: 'cyan-paper', name: '青纸黑字', bg: '#d8e3df', bg2: '#c8d6d2', text: '#17201f', muted: '#63736f', accent: '#176d7c', mark: '#17201f' },
  { id: 'carbon-blue', name: '炭蓝冷光', bg: '#0c1015', bg2: '#17202b', text: '#edf0f0', muted: '#76818c', accent: '#4f8fd8', mark: '#ffffff' },
  { id: 'earth-green', name: '土绿暖白', bg: '#211f17', bg2: '#312d20', text: '#f0e6cf', muted: '#958c78', accent: '#739b5f', mark: '#ffffff' }
];

const palettesPerPage = 9;
const defaultPattern = patterns.find((pattern) => pattern.id === 'corners') || patterns[0];
const previewLayoutStorageKey = 'anycover.previewLayout.v2';

const titleFonts = [
  { id: 'serif-sc', name: '思源宋体·重体', family: '"Noto Serif SC", "Source Han Serif SC", "Songti SC", STSong, SimSun, serif', normal: 850, highlight: 900 },
  { id: 'songti', name: '宋体·粗', family: '"Songti SC", STSong, SimSun, serif', normal: 850, highlight: 900 },
  { id: 'fangsong', name: '仿宋', family: 'STFangsong, FangSong, serif', normal: 700, highlight: 900 },
  { id: 'kaiti', name: '楷体', family: '"Kaiti SC", STKaiti, KaiTi, serif', normal: 700, highlight: 900 },
  { id: 'yuanti', name: '圆体·粗', family: '"PingFang SC", "Yuanti SC", "Hiragino Sans GB", sans-serif', normal: 780, highlight: 900 },
  { id: 'pingfang', name: '苹方·极粗', family: '"PingFang SC", "Helvetica Neue", sans-serif', normal: 850, highlight: 900 },
  { id: 'heiti', name: '黑体·粗', family: '"Heiti SC", STHeiti, SimHei, sans-serif', normal: 850, highlight: 900 },
  { id: 'lishu', name: '隶书', family: 'STLiti, LiSu, serif', normal: 700, highlight: 900 },
  { id: 'xingkai', name: '行楷·手写', family: 'STXingkai, "HanziPen SC", cursive', normal: 700, highlight: 900 },
  { id: 'serif-italic', name: '衬线斜体', family: '"Noto Serif SC", "Songti SC", serif', normal: 820, highlight: 900, italic: true }
];

const state = {
  mode: 'batch',
  platform: platforms[0],
  selectedPlatformIds: platforms.map((platform) => platform.id),
  horizontalTemplate: horizontalTemplates[0],
  verticalTemplate: verticalTemplates[0],
  pattern: defaultPattern,
  titleFont: titleFonts[0],
  palette: palettes[0],
  palettePage: 0,
  variantSeed: 0,
  variants: [],
  previewPositions: loadPreviewLayout(),
  previewZ: 1,
  previewGrid: false
};

function loadPreviewLayout() {
  try {
    const value = localStorage.getItem(previewLayoutStorageKey);
    if (!value) return {};
    const parsed = JSON.parse(value);
    if (!parsed || typeof parsed !== 'object') return {};
    return parsed;
  } catch (error) {
    return {};
  }
}

function savePreviewLayout() {
  try {
    localStorage.setItem(previewLayoutStorageKey, JSON.stringify(state.previewPositions));
  } catch (error) {
    // Layout persistence is a convenience; ignore storage failures.
  }
}

const $ = (id) => document.getElementById(id);

function init() {
  buildPlatformGrid();
  syncTemplateSelect();
  fillSelect('titleFontSelect', titleFonts);
  $('titleFontSelect').value = state.titleFont.id;
  fillSelect('patternSelect', patterns);
  $('patternSelect').value = state.pattern.id;
  buildPaletteGrid();
  bindEvents();
  syncModeUI();
  syncPreviewGrid();
  setBatchMeta();
  render();
  makeVariants(variantCount());
}

function fillSelect(id, items) {
  const select = $(id);
  select.innerHTML = '';
  items.forEach((item) => {
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = item.ratio ? `${item.name} (${item.ratio})` : item.name;
    select.appendChild(option);
  });
}

function isVerticalPlatform(platform = state.platform) {
  return platform.height > platform.width;
}

function templatesForPlatform(platform = state.platform) {
  return isVerticalPlatform(platform) ? verticalTemplates : horizontalTemplates;
}

function selectedPlatforms() {
  return platforms.filter((platform) => state.selectedPlatformIds.includes(platform.id));
}

function templateForPlatform(platform) {
  return isVerticalPlatform(platform) ? state.verticalTemplate : state.horizontalTemplate;
}

function variantTemplateForPlatform(platform, offset = 0) {
  const templates = templatesForPlatform(platform);
  return templates[offset % templates.length];
}

function platformIcon(id) {
  const icons = {
    x: '<svg class="platform-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M5 5l14 14M19 5 5 19"></path></svg>',
    youtube: '<svg class="platform-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="3.5" y="6.5" width="17" height="11" rx="3"></rect><path d="M10 9.5l5 2.5-5 2.5Z" fill="currentColor" stroke="none"></path></svg>',
    wechat: '<svg class="platform-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M10.5 6C6.9 6 4 8.2 4 11c0 1.5.8 2.8 2.1 3.7L5.5 17l2.6-1.2c.8.2 1.6.3 2.4.3 3.6 0 6.5-2.2 6.5-5.1S14.1 6 10.5 6Z"></path><path d="M14 12.5c3.2 0 5.7 1.9 5.7 4.3 0 1.1-.6 2.2-1.6 3l.5 2-2.2-1c-.7.2-1.5.3-2.4.3-2.5 0-4.7-1.2-5.4-2.9"></path></svg>',
    channels: '<svg class="platform-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="4" width="14" height="16" rx="3"></rect><path d="M10 9l5 3-5 3Z" fill="currentColor" stroke="none"></path></svg>',
    xiaohongshu: '<svg class="platform-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M7 4h10a2 2 0 0 1 2 2v14l-7-3-7 3V6a2 2 0 0 1 2-2Z"></path><path d="M9 8h6M9 11h5"></path></svg>',
    douyin: '<svg class="platform-icon" width="16" height="16" viewBox="0 0 24 24" aria-hidden="true" focusable="false" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round"><path d="M14 4v10.5a4 4 0 1 1-3-3.9"></path><path d="M14 7c1.4 2.2 3.1 3.4 5 3.5"></path></svg>'
  };
  return icons[id] || '';
}

function buildPlatformGrid() {
  const grid = $('platformGrid');
  grid.innerHTML = '';
  platforms.forEach((platform) => {
    const chip = document.createElement('button');
    chip.type = 'button';
    chip.className = 'platform-chip';
    chip.dataset.id = platform.id;
    chip.innerHTML = `<span class="platform-chip-main">${platformIcon(platform.id)}<strong>${platform.name}</strong></span><small>${platform.width}x${platform.height} · ${platform.ratio}</small>`;
    chip.addEventListener('click', () => handlePlatformClick(platform));
    grid.appendChild(chip);
  });
  syncPlatformGrid();
}

function handlePlatformClick(platform) {
  state.platform = platform;
  if (state.mode === 'batch') {
    const selected = new Set(state.selectedPlatformIds);
    if (selected.has(platform.id) && selected.size > 1) selected.delete(platform.id);
    else selected.add(platform.id);
    state.selectedPlatformIds = platforms.filter((item) => selected.has(item.id)).map((item) => item.id);
    if (!state.selectedPlatformIds.includes(state.platform.id)) {
      state.platform = platforms.find((item) => item.id === state.selectedPlatformIds[0]);
    }
  } else {
    state.selectedPlatformIds = [platform.id];
  }
  syncTemplateSelect();
  syncPlatformGrid();
  render();
  refreshVariants();
}

function syncPlatformGrid() {
  document.querySelectorAll('.platform-chip').forEach((chip) => {
    const selected = state.mode === 'batch'
      ? state.selectedPlatformIds.includes(chip.dataset.id)
      : chip.dataset.id === state.platform.id;
    chip.classList.toggle('selected', selected);
    chip.classList.toggle('focused', chip.dataset.id === state.platform.id);
  });
}

function syncTemplateSelect() {
  $('templatePickerButton').textContent = `横屏 · ${state.horizontalTemplate.name} ｜ 竖屏 · ${state.verticalTemplate.name}`;
  buildTemplateColumn('horizontalTemplateOptions', horizontalTemplates, state.horizontalTemplate, (template) => {
    state.horizontalTemplate = template;
  });
  buildTemplateColumn('verticalTemplateOptions', verticalTemplates, state.verticalTemplate, (template) => {
    state.verticalTemplate = template;
  });
}

function buildTemplateColumn(id, templates, activeTemplate, assign) {
  const column = $(id);
  column.innerHTML = '';
  templates.forEach((template) => {
    const option = document.createElement('button');
    option.type = 'button';
    option.className = `template-option${template.id === activeTemplate.id ? ' active' : ''}`;
    option.textContent = template.name;
    option.addEventListener('click', () => {
      assign(template);
      closeTemplatePicker();
      syncTemplateSelect();
      render();
      refreshVariants();
    });
    column.appendChild(option);
  });
}

function toggleTemplatePicker() {
  const menu = $('templatePickerMenu');
  const isOpening = menu.hidden;
  menu.hidden = !isOpening;
  $('templatePickerButton').setAttribute('aria-expanded', String(isOpening));
}

function closeTemplatePicker() {
  const menu = $('templatePickerMenu');
  if (menu.hidden) return;
  menu.hidden = true;
  $('templatePickerButton').setAttribute('aria-expanded', 'false');
}

function buildPaletteGrid() {
  const grid = $('paletteGrid');
  const visiblePalettes = getVisiblePalettes();
  grid.innerHTML = '';
  visiblePalettes.forEach((palette) => {
    const swatch = document.createElement('button');
    swatch.className = `swatch${palette.id === state.palette.id ? ' active' : ''}`;
    swatch.type = 'button';
    swatch.dataset.id = palette.id;
    swatch.style.background = `linear-gradient(135deg, ${palette.bg2}, ${palette.bg})`;
    swatch.innerHTML = `<i style="position:absolute;left:10px;top:10px;width:42px;height:5px;background:${palette.text};border-radius:3px"></i><i style="position:absolute;left:10px;top:22px;width:28px;height:7px;background:${palette.accent};border-radius:3px"></i><b>${palette.name}</b>`;
    swatch.addEventListener('click', () => {
      state.palette = palette;
      setActivePalette();
      render();
      refreshVariants();
    });
    grid.appendChild(swatch);
  });
}

function getVisiblePalettes() {
  const start = (state.palettePage * palettesPerPage) % palettes.length;
  return Array.from({ length: palettesPerPage }, (_, index) => palettes[(start + index) % palettes.length]);
}

function bindEvents() {
  ['tagInput', 'leadInput', 'titleInput', 'watermarkInput', 'signInput'].forEach((id) => {
    $(id).addEventListener('input', () => {
      render();
      refreshVariants();
    });
  });
  ['patternStrength', 'fontSizeInput'].forEach((id) => {
    $(id).addEventListener('input', () => render());
    $(id).addEventListener('change', refreshVariants);
  });
  $('templatePickerButton').addEventListener('click', toggleTemplatePicker);
  document.addEventListener('click', (event) => {
    if (!$('templatePicker').contains(event.target)) closeTemplatePicker();
  });
  $('titleFontSelect').addEventListener('change', (event) => {
    state.titleFont = titleFonts.find((item) => item.id === event.target.value) || titleFonts[0];
    render();
    refreshVariants();
  });
  $('patternSelect').addEventListener('change', (event) => {
    state.pattern = patterns.find((item) => item.id === event.target.value);
    render();
    refreshVariants();
  });
  $('multiPlatformToggle').addEventListener('change', (event) => setMultiPlatform(event.target.checked));
  $('previewGridToggle').addEventListener('change', (event) => {
    state.previewGrid = event.target.checked;
    syncPreviewGrid();
  });
  $('exportBtn').addEventListener('click', exportPng);
  $('exportAllBtn').addEventListener('click', exportAllPng);
  $('randomStyleBtn').addEventListener('click', randomStyle);
  $('generateBatchBtn').addEventListener('click', generateVariants);
  $('randomPatternBtn').addEventListener('click', randomPattern);
  $('randomPaletteBtn').addEventListener('click', randomPalette);
  $('cyclePaletteBtn').addEventListener('click', cyclePaletteGroup);
  $('randomHighlightBtn').addEventListener('click', randomHighlight);
  $('clearHighlightBtn').addEventListener('click', () => {
    $('titleInput').value = $('titleInput').value.replaceAll('`', '');
    render();
    refreshVariants();
  });
  $('randomWatermarkBtn').addEventListener('click', randomWatermark);
  $('clearWatermarkBtn').addEventListener('click', () => {
    $('watermarkInput').value = '';
    render();
    refreshVariants();
  });
}

function syncPreviewGrid() {
  $('multiPreviewWall').classList.toggle('show-grid', state.previewGrid);
  $('singlePreview').classList.toggle('show-grid', state.previewGrid);
  $('previewGridToggle').checked = state.previewGrid;
}

function setMultiPlatform(enabled) {
  state.mode = enabled ? 'batch' : 'single';
  if (!enabled) state.selectedPlatformIds = [state.platform.id];
  else if (state.selectedPlatformIds.length < 2) state.selectedPlatformIds = platforms.map((platform) => platform.id);
  syncModeUI();
  syncPlatformGrid();
  syncTemplateSelect();
  render();
  setBatchMeta();
  refreshVariants();
}

function syncModeUI() {
  const enabled = state.mode === 'batch';
  $('multiPlatformToggle').checked = enabled;
  $('previewTitle').textContent = enabled ? '多平台预览' : '单平台精修';
  $('batchTitle').textContent = enabled ? '套装候选' : '候选封面';
  $('platformModeHint').textContent = enabled ? '默认全选，可取消不需要的平台' : '选择一个平台精修';
  $('exportBtn').textContent = '导出选中 PNG';
  $('exportAllBtn').textContent = enabled ? '导出所有 PNG' : '导出当前 PNG';
  document.querySelector('.preview-panel').classList.toggle('is-batch', enabled);
  document.querySelector('.preview-panel').classList.toggle('is-single', !enabled);
}

function setBatchMeta(text) {
  $('batchMeta').textContent = text || (state.mode === 'batch' ? '拖动上方预览卡片可手动组合' : '当前平台候选预览，点击应用到主图');
}

function refreshVariants() {
  makeVariants(variantCount());
}

function generateVariants() {
  state.variantSeed += 1;
  makeVariants(variantCount(), true);
  setBatchMeta(state.mode === 'batch' ? '已换一组多平台候选，点击应用' : '已换一组当前平台候选，点击应用');
}

function variantCount() {
  return state.mode === 'batch' ? 6 : 8;
}

function setActivePalette() {
  document.querySelectorAll('.swatch').forEach((item) => {
    item.classList.toggle('active', item.dataset.id === state.palette.id);
  });
}

function showPaletteGroupForCurrent() {
  state.palettePage = Math.floor(palettes.indexOf(state.palette) / palettesPerPage);
  buildPaletteGrid();
}

function getInput() {
  return {
    tag: $('tagInput').value.trim() || 'ANYCOVER',
    lead: $('leadInput').value.trim(),
    title: $('titleInput').value.trim() || '输入你的`封面标题`',
    watermark: $('watermarkInput').value.trim(),
    sign: $('signInput').value.trim(),
    size: Number($('fontSizeInput').value),
    titleFont: state.titleFont.id,
    strength: Number($('patternStrength').value) / 100
  };
}

function parseTitle(raw) {
  const parts = [];
  let cursor = 0;
  const regex = /`([^`]+)`/g;
  let match;
  while ((match = regex.exec(raw))) {
    if (match.index > cursor) parts.push({ text: raw.slice(cursor, match.index), highlight: false });
    parts.push({ text: match[1], highlight: true });
    cursor = match.index + match[0].length;
  }
  if (cursor < raw.length) parts.push({ text: raw.slice(cursor), highlight: false });
  if (!parts.some((part) => part.highlight)) {
    const chars = [...raw];
    const start = Math.max(0, chars.length - 2);
    return [
      { text: chars.slice(0, start).join(''), highlight: false },
      { text: chars.slice(start).join(''), highlight: true }
    ].filter((part) => part.text);
  }
  return parts;
}

function render(config = {}) {
  const input = { ...getInput(), ...config.input };
  const platform = config.platform || state.platform;
  const palette = config.palette || state.palette;
  const template = config.template || templateForPlatform(platform);
  const pattern = config.pattern || state.pattern;

  canvas.width = platform.width;
  canvas.height = platform.height;
  drawCover(ctx, platform, palette, template, pattern, input);
  fitMainCanvas(platform);
  if (state.mode === 'batch') {
    renderMultiPreview(input, palette, pattern);
    $('previewMeta').textContent = `${selectedPlatforms().length} 个平台 · 同步生成`;
  } else {
    $('previewMeta').textContent = `${platform.name} · ${platform.width}x${platform.height}`;
  }
}

function renderMultiPreview(input = getInput(), palette = state.palette, pattern = state.pattern) {
  const wall = $('multiPreviewWall');
  const activeIds = new Set();
  selectedPlatforms().forEach((platform, index) => {
    activeIds.add(platform.id);
    let card = wall.querySelector(`.platform-preview-card[data-platform-id="${platform.id}"]`);
    if (!card) {
      card = document.createElement('button');
      card.type = 'button';
      card.dataset.platformId = platform.id;
      card.innerHTML = `<header><span class="preview-platform-title">${platformIcon(platform.id)}<strong></strong></span><span></span></header><canvas></canvas><span class="preview-resize-handle top-left" data-corner="top-left"></span><span class="preview-resize-handle top-right" data-corner="top-right"></span><span class="preview-resize-handle bottom-left" data-corner="bottom-left"></span><span class="preview-resize-handle bottom-right" data-corner="bottom-right"></span>`;
      card.addEventListener('click', () => {
        if (card.dataset.dragged === 'true') {
          card.dataset.dragged = 'false';
          return;
        }
        state.platform = platforms.find((item) => item.id === card.dataset.platformId) || state.platform;
        syncTemplateSelect();
        syncPlatformGrid();
        render();
      });
      enablePreviewDrag(card, wall);
      enablePreviewResize(card, wall);
    }
    card.className = `platform-preview-card ${previewShapeClass(platform)}${platform.id === state.platform.id ? ' focused' : ''}`;
    const title = card.querySelector('.preview-platform-title strong');
    const size = card.querySelector('header > span:last-child');
    title.textContent = platform.name;
    size.textContent = `${platform.width}x${platform.height}`;
    const previewCanvas = card.querySelector('canvas');
    previewCanvas.width = platform.width;
    previewCanvas.height = platform.height;
    drawCover(previewCanvas.getContext('2d'), platform, palette, templateForPlatform(platform), pattern, input);
    wall.appendChild(card);
  });
  wall.querySelectorAll('.platform-preview-card').forEach((card) => {
    if (!activeIds.has(card.dataset.platformId)) card.remove();
  });
  requestAnimationFrame(layoutMultiPreview);
}

function previewShapeClass(platform) {
  const ratio = platform.width / platform.height;
  if (ratio < .9) return 'vertical';
  if (ratio > 2.1) return 'ultrawide';
  return 'wide';
}

function layoutMultiPreview() {
  const wall = $('multiPreviewWall');
  const cards = [...wall.querySelectorAll('.platform-preview-card')];
  if (!cards.length) {
    wall.style.height = '0px';
    return;
  }
  const width = wall.clientWidth;
  const gap = 10;
  const columns = width < 520 ? 6 : 12;
  const columnWidth = (width - gap * (columns - 1)) / columns;
  const heights = Array(columns).fill(0);
  const headerHeight = 34;
  const hasManualLayout = cards.some((card) => state.previewPositions[card.dataset.platformId]);

  if (!hasManualLayout && applyDefaultPreviewLayout(wall, cards)) return;

  const placements = cards.map((card) => {
    const canvas = card.querySelector('canvas');
    const ratio = canvas.width / canvas.height;
    const span = ratio < .95 ? Math.max(3, Math.floor(columns / 4)) : Math.max(4, Math.floor(columns / 2));
    const cardWidth = columnWidth * span + gap * (span - 1);
    const contentHeight = Math.round(cardWidth / ratio);
    const cardHeight = contentHeight + headerHeight;
    const order = previewOrder(card.dataset.platformId);
    return { card, ratio, span, cardWidth, cardHeight, order, x: 0, y: 0 };
  }).sort((a, b) => a.order - b.order);

  placements.forEach((placement) => {
    const { span, cardHeight } = placement;
    let bestColumn = 0;
    let bestScore = Infinity;
    let bestY = 0;

    for (let column = 0; column <= columns - span; column += 1) {
      const y = Math.max(...heights.slice(column, column + span));
      const nextHeights = [...heights];
      for (let nextColumn = column; nextColumn < column + span; nextColumn += 1) {
        nextHeights[nextColumn] = y + cardHeight + gap;
      }
      const maxHeight = Math.max(...nextHeights);
      const minHeight = Math.min(...nextHeights);
      const imbalance = maxHeight - minHeight;
      const score = maxHeight * 10 + imbalance + y * .2;
      if (score < bestScore) {
        bestScore = score;
        bestY = y;
        bestColumn = column;
      }
    }

    const x = bestColumn * (columnWidth + gap);
    placement.x = Math.floor(x);
    placement.y = Math.floor(bestY);

    for (let column = bestColumn; column < bestColumn + span; column += 1) {
      heights[column] = bestY + cardHeight + gap;
    }
  });

  const naturalHeight = Math.max(...heights) - gap;
  const maxAutoHeight = previewAutoHeight(wall);
  const scale = Math.min(1, maxAutoHeight / Math.max(1, naturalHeight));

  placements.forEach(({ card, ratio, cardWidth, x, y }) => {
    setPreviewCardSize(card, ratio, cardWidth * scale);
    setPreviewCardPosition(card, Math.floor(x * scale), Math.floor(y * scale), false);
  });

  if (hasManualLayout) cards.forEach((card) => {
    const saved = state.previewPositions[card.dataset.platformId];
    if (!saved) return;
    const ratio = previewCardRatio(card);
    if (Number.isFinite(saved.width)) setPreviewCardSize(card, ratio, saved.width);
    if (Number.isFinite(saved.x) && Number.isFinite(saved.y)) {
      setPreviewCardPosition(card, saved.x, saved.y, false, saved.z);
    }
  });
  updatePreviewWallHeight(wall);
}

function applyDefaultPreviewLayout(wall, cards) {
  const width = wall.clientWidth;
  if (width < 760) return false;

  const byId = new Map(cards.map((card) => [card.dataset.platformId, card]));
  const gap = 10;
  const rightWidth = Math.min(310, Math.max(230, width * .16));
  const rightX = Math.max(0, width - rightWidth - 2);
  const leftAreaWidth = Math.max(1, rightX - gap);
  const leftWidth = Math.min(520, Math.max(360, leftAreaWidth * .48));
  const middleWidth = Math.max(260, leftAreaWidth - leftWidth - gap);
  const smallWidth = Math.max(140, (middleWidth - gap) / 2);

  const baseSlots = {
    x: { x: 0, y: 0, width: leftWidth },
    youtube: { x: 0, y: 0, width: leftWidth },
    wechat: { x: leftWidth + gap, y: 0, width: middleWidth },
    channels: { x: leftWidth + gap, y: 0, width: smallWidth },
    xiaohongshu: { x: leftWidth + gap + smallWidth + gap, y: 0, width: smallWidth },
    douyin: { x: rightX, y: 0, width: rightWidth }
  };

  const xHeight = byId.has('x') ? previewCardHeight(baseSlots.x.width, previewCardRatio(byId.get('x'))) : 0;
  const wechatHeight = byId.has('wechat') ? previewCardHeight(baseSlots.wechat.width, previewCardRatio(byId.get('wechat'))) : xHeight;
  const secondRowY = Math.max(xHeight, wechatHeight) + gap;
  baseSlots.youtube.y = secondRowY;
  baseSlots.channels.y = secondRowY;
  baseSlots.xiaohongshu.y = secondRowY;

  const fallbackCards = cards.filter((card) => !baseSlots[card.dataset.platformId]);
  let fallbackY = secondRowY;
  fallbackCards.forEach((card) => {
    baseSlots[card.dataset.platformId] = { x: 0, y: fallbackY, width: leftWidth };
    fallbackY += previewCardHeight(leftWidth, previewCardRatio(card)) + gap;
  });

  const naturalHeight = cards.reduce((max, card) => {
    const slot = baseSlots[card.dataset.platformId];
    if (!slot) return max;
    return Math.max(max, slot.y + previewCardHeight(slot.width, previewCardRatio(card)));
  }, 0);
  const scale = Math.min(1, previewAutoHeight(wall) / Math.max(1, naturalHeight));

  cards.forEach((card) => {
    const slot = baseSlots[card.dataset.platformId];
    if (!slot) return;
    const ratio = previewCardRatio(card);
    setPreviewCardSize(card, ratio, slot.width * scale);
    setPreviewCardPosition(card, slot.x * scale, slot.y * scale, false);
  });
  updatePreviewWallHeight(wall);
  return true;
}

function previewAutoHeight(wall) {
  const top = wall.getBoundingClientRect().top;
  return Math.max(220, window.innerHeight - top - 16);
}

function enablePreviewDrag(card, wall) {
  card.addEventListener('pointerdown', (event) => {
    if (state.mode !== 'batch') return;
    event.preventDefault();
    card.setPointerCapture(event.pointerId);
    const start = getPreviewCardPosition(card);
    const startX = event.clientX;
    const startY = event.clientY;
    const z = state.previewZ += 1;
    let moved = false;
    card.classList.add('dragging');
    card.style.zIndex = z;

    const move = (moveEvent) => {
      const nextX = start.x + moveEvent.clientX - startX;
      const nextY = start.y + moveEvent.clientY - startY;
      if (Math.abs(nextX - start.x) > 3 || Math.abs(nextY - start.y) > 3) moved = true;
      setPreviewCardPosition(card, nextX, nextY, true, z);
      updatePreviewWallHeight(wall);
    };

    const end = () => {
      card.classList.remove('dragging');
      if (moved) {
        card.dataset.dragged = 'true';
        wall.classList.add('manual-layout');
        savePreviewLayout();
      }
      card.removeEventListener('pointermove', move);
      card.removeEventListener('pointerup', end);
      card.removeEventListener('pointercancel', end);
    };

    card.addEventListener('pointermove', move);
    card.addEventListener('pointerup', end);
    card.addEventListener('pointercancel', end);
  });
}

function enablePreviewResize(card, wall) {
  card.querySelectorAll('.preview-resize-handle').forEach((handle) => {
    handle.addEventListener('pointerdown', (event) => {
      if (state.mode !== 'batch') return;
      event.preventDefault();
      event.stopPropagation();
      handle.setPointerCapture(event.pointerId);

      const corner = handle.dataset.corner;
      const start = getPreviewCardPosition(card);
      const startWidth = card.offsetWidth;
      const ratio = previewCardRatio(card);
      const startHeight = previewCardHeight(startWidth, ratio);
      const startX = event.clientX;
      const startY = event.clientY;
      const z = state.previewZ += 1;
      let moved = false;
      card.classList.add('resizing');
      card.style.zIndex = z;

      const move = (moveEvent) => {
        const dx = moveEvent.clientX - startX;
        const dy = moveEvent.clientY - startY;
        const horizontalWidth = corner.includes('left') ? startWidth - dx : startWidth + dx;
        const verticalHeight = corner.includes('top') ? startHeight - dy : startHeight + dy;
        const verticalWidth = previewContentWidth(verticalHeight, ratio);
        const proposedWidth = Math.max(horizontalWidth, verticalWidth);
        const width = clampPreviewCardWidth(wall, proposedWidth);
        const height = previewCardHeight(width, ratio);
        const nextX = corner.includes('left') ? start.x + startWidth - width : start.x;
        const nextY = corner.includes('top') ? start.y + startHeight - height : start.y;

        if (Math.abs(width - startWidth) > 3 || Math.abs(nextX - start.x) > 3 || Math.abs(nextY - start.y) > 3) {
          moved = true;
        }
        setPreviewCardSize(card, ratio, width, true);
        setPreviewCardPosition(card, nextX, nextY, true, z);
        updatePreviewWallHeight(wall);
      };

      const end = () => {
        card.classList.remove('resizing');
        if (moved) {
          card.dataset.dragged = 'true';
          wall.classList.add('manual-layout');
          savePreviewLayout();
        }
        handle.removeEventListener('pointermove', move);
        handle.removeEventListener('pointerup', end);
        handle.removeEventListener('pointercancel', end);
      };

      handle.addEventListener('pointermove', move);
      handle.addEventListener('pointerup', end);
      handle.addEventListener('pointercancel', end);
    });
  });
}

function previewCardRatio(card) {
  const canvas = card.querySelector('canvas');
  return canvas.width / canvas.height;
}

function previewCardHeight(width, ratio) {
  return Math.round(width / ratio) + 34;
}

function previewContentWidth(height, ratio) {
  return Math.max(1, (height - 34) * ratio);
}

function clampPreviewCardWidth(wall, width) {
  const maxWidth = Math.max(180, wall.clientWidth - 2);
  return Math.max(140, Math.min(Math.round(width), maxWidth));
}

function setPreviewCardSize(card, ratio, width, save = false) {
  const wall = $('multiPreviewWall');
  const nextWidth = clampPreviewCardWidth(wall, width);
  card.style.width = `${nextWidth}px`;
  card.style.height = `${previewCardHeight(nextWidth, ratio)}px`;
  if (save) {
    const current = state.previewPositions[card.dataset.platformId] || {};
    state.previewPositions[card.dataset.platformId] = { ...current, width: nextWidth };
  }
}

function setPreviewCardPosition(card, x, y, save = false, z) {
  const wall = $('multiPreviewWall');
  const maxX = Math.max(0, wall.clientWidth - card.offsetWidth - 2);
  const nextX = Math.max(0, Math.min(Math.round(x), maxX));
  const nextY = Math.max(0, Math.round(y));
  card.style.transform = `translate(${nextX}px, ${nextY}px)`;
  if (z) card.style.zIndex = z;
  if (save) {
    const current = state.previewPositions[card.dataset.platformId] || {};
    state.previewPositions[card.dataset.platformId] = {
      ...current,
      x: nextX,
      y: nextY,
      z: z || Number(card.style.zIndex || 1),
      width: card.offsetWidth
    };
  }
}

function getPreviewCardPosition(card) {
  const match = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(card.style.transform);
  return {
    x: match ? Number(match[1]) : 0,
    y: match ? Number(match[2]) : 0
  };
}

function updatePreviewWallHeight(wall) {
  const cards = [...wall.querySelectorAll('.platform-preview-card')];
  const bottom = cards.reduce((max, card) => {
    const position = getPreviewCardPosition(card);
    return Math.max(max, position.y + card.offsetHeight);
  }, 0);
  wall.style.height = `${bottom + 2}px`;
}

function previewOrder(platformId) {
  const order = ['x', 'youtube', 'wechat', 'channels', 'xiaohongshu', 'douyin'];
  const index = order.indexOf(platformId);
  return index === -1 ? order.length : index;
}

function fitMainCanvas(platform = state.platform) {
  const stage = document.querySelector('.canvas-stage');
  if (!stage) return;
  const availableWidth = Math.max(1, stage.clientWidth - 24);
  const availableHeight = Math.max(1, stage.clientHeight - 24);
  const scale = Math.min(availableWidth / platform.width, availableHeight / platform.height);
  canvas.style.width = `${Math.floor(platform.width * scale)}px`;
  canvas.style.height = `${Math.floor(platform.height * scale)}px`;
}

window.addEventListener('resize', () => {
  fitMainCanvas(state.platform);
  if (state.mode === 'batch') layoutMultiPreview();
});

function drawCover(target, platform, palette, template, pattern, input) {
  const w = platform.width;
  const h = platform.height;
  target.clearRect(0, 0, w, h);
  const grad = target.createLinearGradient(0, 0, w, h);
  grad.addColorStop(0, palette.bg2);
  grad.addColorStop(.62, palette.bg);
  grad.addColorStop(1, palette.bg);
  target.fillStyle = grad;
  target.fillRect(0, 0, w, h);

  drawPattern(target, w, h, pattern.id, palette.mark, input.strength);
  drawWatermark(target, w, h, palette, input);

  const titleParts = parseTitle(input.title);
  const vertical = h > w;
  const base = Math.min(w, h);
  const margin = Math.max(54, base * .09);
  const scaledTitleSize = input.size * (base / 1000);
  const titleSize = fitTitleSize(
    target,
    titleParts,
    Math.max(base * .07, Math.min(scaledTitleSize, base * (vertical ? .2 : .24))),
    w - margin * 2,
    h,
    vertical
  );
  const align = template.align;

  if (vertical) drawVertical(target, w, h, palette, input, titleParts, titleSize, margin, align);
  else if (align === 'left') drawLeft(target, w, h, palette, input, titleParts, titleSize, margin);
  else if (align === 'split') drawSplit(target, w, h, palette, input, titleParts, titleSize, margin);
  else drawCenter(target, w, h, palette, input, titleParts, titleSize, margin, vertical);
}

function drawPattern(target, w, h, type, color, opacity) {
  target.save();
  target.globalAlpha = opacity;
  target.strokeStyle = color;
  target.fillStyle = color;
  target.lineWidth = Math.max(1, Math.round(Math.min(w, h) / 900));

  if (type === 'grid') {
    const step = Math.max(32, Math.round(Math.min(w, h) / 18));
    for (let x = 0; x <= w; x += step) line(target, x, 0, x, h);
    for (let y = 0; y <= h; y += step) line(target, 0, y, w, y);
  } else if (type === 'dots') {
    const step = Math.max(28, Math.round(Math.min(w, h) / 22));
    for (let x = step / 2; x < w; x += step) {
      for (let y = step / 2; y < h; y += step) {
        target.beginPath();
        target.arc(x, y, 1.4, 0, Math.PI * 2);
        target.fill();
      }
    }
  } else if (type === 'diagonal' || type === 'cross') {
    const step = Math.max(38, Math.round(Math.min(w, h) / 18));
    for (let x = -h; x < w; x += step) line(target, x, h, x + h, 0);
    if (type === 'cross') for (let x = 0; x < w + h; x += step) line(target, x, 0, x - h, h);
  } else if (type === 'corners') {
    const l = Math.min(w, h) * .09;
    const p = Math.min(w, h) * .08;
    line(target, p, p, p + l, p); line(target, p, p, p, p + l);
    line(target, w - p, p, w - p - l, p); line(target, w - p, p, w - p, p + l);
    line(target, p, h - p, p + l, h - p); line(target, p, h - p, p, h - p - l);
    line(target, w - p, h - p, w - p - l, h - p); line(target, w - p, h - p, w - p, h - p - l);
  } else if (type === 'noise') {
    const count = Math.round((w * h) / 850);
    for (let index = 0; index < count; index += 1) {
      const x = seededNoise(index, 17) * w;
      const y = seededNoise(index, 43) * h;
      const radius = .7 + seededNoise(index, 89) * 1.8;
      target.globalAlpha = opacity * (.35 + seededNoise(index, 131) * .65);
      target.beginPath();
      target.arc(x, y, radius, 0, Math.PI * 2);
      target.fill();
    }
  }
  target.restore();
}

function seededNoise(index, salt) {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453;
  return value - Math.floor(value);
}

function line(target, x1, y1, x2, y2) {
  target.beginPath();
  target.moveTo(x1, y1);
  target.lineTo(x2, y2);
  target.stroke();
}

function drawWatermark(target, w, h, palette, input) {
  const highlighted = parseTitle(input.title).find((part) => part.highlight)?.text || input.title;
  const mark = input.watermark || [...highlighted.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')][0] || 'A';
  target.save();
  target.globalAlpha = .055;
  target.fillStyle = palette.mark;
  target.textAlign = 'center';
  target.textBaseline = 'middle';
  target.font = `900 ${Math.round(Math.min(w, h) * .86)}px Georgia, "Songti SC", serif`;
  target.fillText(mark.slice(0, 2), w * .84, h * .52);
  target.restore();
}

function drawVertical(target, w, h, palette, input, parts, titleSize, margin, align) {
  const base = Math.min(w, h);
  const leadSize = Math.max(18, base * .03);
  const tagSize = Math.max(12, base * .018);
  const signSize = Math.max(13, base * .021);
  const titleWidth = align === 'v-left' ? w - margin * 2.4 : w - margin * 2;
  const lines = wrapParts(target, parts, titleSize, titleWidth);
  const lineHeight = titleSize * 1.12;
  const titleBlock = lines.length * lineHeight;

  if (align === 'v-top') {
    const titleY = h * .34;
    drawSmall(target, input.tag, w / 2, margin * 1.35, palette.muted, tagSize, .42);
    drawSmall(target, input.lead, w / 2, titleY - titleBlock / 2 - leadSize * 1.35, palette.muted, leadSize, .24);
    drawRichLines(target, lines, w / 2, titleY, titleSize, palette, 'center');
    drawRule(target, w * .28, h * .68, w * .72, h * .68, palette.accent);
    drawSmall(target, input.sign, w / 2, h - margin * .9, palette.muted, signSize, .12);
    return;
  }

  if (align === 'v-left') {
    const x = margin * 1.45;
    const titleY = h * .5;
    drawRule(target, margin * .85, margin, margin * .85, h - margin, palette.accent);
    drawSmall(target, input.tag, x, h * .18, palette.muted, tagSize, .35, 'left');
    drawSmall(target, input.lead, x, titleY - titleBlock / 2 - leadSize * 1.35, palette.muted, leadSize, .12, 'left');
    drawRichLines(target, lines, x, titleY, titleSize, palette, 'left');
    drawSmall(target, input.sign, x, Math.min(h - margin, titleY + titleBlock / 2 + signSize * 1.8), palette.muted, signSize, .08, 'left');
    return;
  }

  if (align === 'v-bottom') {
    const titleY = h * .68;
    drawSmall(target, input.tag, w / 2, margin * 1.3, palette.muted, tagSize, .42);
    drawRule(target, w * .32, h * .22, w * .68, h * .22, palette.accent);
    drawSmall(target, input.lead, w / 2, titleY - titleBlock / 2 - leadSize * 1.35, palette.muted, leadSize, .24);
    drawRichLines(target, lines, w / 2, titleY, titleSize, palette, 'center');
    drawSmall(target, input.sign, w / 2, Math.min(h - margin * .7, titleY + titleBlock / 2 + signSize * 1.7), palette.muted, signSize, .12);
    return;
  }

  drawCenter(target, w, h, palette, input, parts, titleSize, margin, true);
}

function drawCenter(target, w, h, palette, input, parts, titleSize, margin, vertical) {
  const lines = wrapParts(target, parts, titleSize, w - margin * 2);
  const lineHeight = titleSize * 1.12;
  const titleBlock = lines.length * lineHeight;
  const titleY = h * (vertical ? .54 : .53);
  const base = Math.min(w, h);
  const leadSize = Math.max(18, base * (vertical ? .03 : .036));
  const tagSize = Math.max(12, base * (vertical ? .018 : .024));
  const signSize = Math.max(13, base * (vertical ? .021 : .026));
  const leadY = titleY - titleBlock / 2 - leadSize * 1.35;
  const tagY = leadY - tagSize * 2.25;
  const signY = titleY + titleBlock / 2 + signSize * 1.8;

  drawSmall(target, input.tag, w / 2, tagY, palette.muted, tagSize, .42);
  drawSmall(target, input.lead, w / 2, leadY, palette.muted, leadSize, .24);
  drawRichLines(target, lines, w / 2, titleY, titleSize, palette, 'center');
  drawSmall(target, input.sign, w / 2, Math.min(h - margin * .7, signY), palette.muted, signSize, .12);
}

function drawLeft(target, w, h, palette, input, parts, titleSize, margin) {
  const lines = wrapParts(target, parts, titleSize, w - margin * 2.2);
  const lineHeight = titleSize * 1.12;
  const titleBlock = lines.length * lineHeight;
  const base = Math.min(w, h);
  const tagSize = Math.max(12, base * .024);
  const leadSize = Math.max(18, base * .034);
  const signSize = Math.max(13, base * .026);
  const titleY = h * .54;
  const leadY = titleY - titleBlock / 2 - leadSize * 1.25;
  drawRule(target, margin, margin, margin, h - margin, palette.accent);
  drawSmall(target, input.tag, margin + 48, h * .25, palette.muted, tagSize, .35, 'left');
  drawSmall(target, input.lead, margin + 48, leadY, palette.muted, leadSize, .14, 'left');
  drawRichLines(target, lines, margin + 48, titleY, titleSize, palette, 'left');
  drawSmall(target, input.sign, margin + 48, titleY + titleBlock / 2 + signSize * 1.7, palette.muted, signSize, .08, 'left');
}

function drawSplit(target, w, h, palette, input, parts, titleSize, margin) {
  const lines = wrapParts(target, parts, titleSize * .9, w * .42);
  const base = Math.min(w, h);
  const tagSize = Math.max(12, base * .022);
  const leadSize = Math.max(17, base * .03);
  const signSize = Math.max(13, base * .024);
  const titleY = h * .52;
  drawRule(target, w * .44, margin * 1.2, w * .44, h - margin * 1.2, palette.accent);
  drawSmall(target, input.tag, margin, h * .32, palette.muted, tagSize, .34, 'left');
  drawSmall(target, input.lead, margin, h * .48, palette.muted, leadSize, .12, 'left');
  drawRichLines(target, lines, w * .5, titleY, titleSize * .9, palette, 'left');
  drawSmall(target, input.sign, w * .5, h * .72, palette.muted, signSize, .1, 'left');
}

function drawRule(target, x1, y1, x2, y2, color) {
  target.save();
  target.strokeStyle = color;
  target.globalAlpha = .8;
  target.lineWidth = 5;
  line(target, x1, y1, x2, y2);
  target.restore();
}

function drawSmall(target, text, x, y, color, size, tracking = 0, align = 'center') {
  if (!text) return;
  target.save();
  target.fillStyle = color;
  target.textAlign = align;
  target.textBaseline = 'middle';
  target.font = `500 ${Math.round(size)}px -apple-system, BlinkMacSystemFont, "PingFang SC", sans-serif`;
  drawTracked(target, text, x, y, tracking * size, align);
  target.restore();
}

function drawRichLine(target, parts, x, y, size, palette, maxWidth, align) {
  const lines = wrapParts(target, parts, size, maxWidth);
  drawRichLines(target, lines, x, y, size, palette, align);
}

function drawRichLines(target, lines, x, y, size, palette, align) {
  const lineHeight = size * 1.12;
  const startY = y - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((lineParts, index) => {
    const lineWidth = measureParts(target, lineParts, size);
    let cursor = align === 'center' ? x - lineWidth / 2 : x;
    lineParts.forEach((part) => {
      target.save();
      target.fillStyle = part.highlight ? palette.accent : palette.text;
      target.font = titleFontRule(part.highlight, size);
      target.textBaseline = 'middle';
      target.textAlign = 'left';
      target.fillText(part.text, cursor, startY + index * lineHeight);
      cursor += target.measureText(part.text).width;
      target.restore();
    });
  });
}

function fitTitleSize(target, parts, initialSize, maxWidth, height, vertical) {
  let size = initialSize;
  const maxLines = vertical ? 4 : 3;
  const maxBlock = height * (vertical ? .42 : .34);
  while (size > 54) {
    const lines = wrapParts(target, parts, size, maxWidth);
    if (lines.length <= maxLines && lines.length * size * 1.12 <= maxBlock) return size;
    size -= 6;
  }
  return size;
}

function wrapParts(target, parts, size, maxWidth) {
  const chars = parts.flatMap((part) => [...part.text].map((char) => ({ text: char, highlight: part.highlight })));
  const lines = [];
  let lineParts = [];
  chars.forEach((charPart) => {
    const next = mergeAdjacent([...lineParts, charPart]);
    if (lineParts.length && measureParts(target, next, size) > maxWidth) {
      lines.push(mergeAdjacent(lineParts));
      lineParts = [charPart];
    } else {
      lineParts = next;
    }
  });
  if (lineParts.length) lines.push(mergeAdjacent(lineParts));
  return lines.slice(0, 4);
}

function mergeAdjacent(parts) {
  return parts.reduce((acc, part) => {
    const last = acc[acc.length - 1];
    if (last && last.highlight === part.highlight) last.text += part.text;
    else acc.push({ ...part });
    return acc;
  }, []);
}

function measureParts(target, parts, size) {
  return parts.reduce((sum, part) => {
    target.font = titleFontRule(part.highlight, size);
    return sum + target.measureText(part.text).width;
  }, 0);
}

function titleFontRule(highlight, size) {
  const font = state.titleFont || titleFonts[0];
  const weight = highlight ? font.highlight : font.normal;
  const italic = font.italic ? 'italic ' : '';
  return `${italic}${weight} ${Math.round(size)}px ${font.family}`;
}

function drawTracked(target, text, x, y, spacing, align) {
  const chars = [...text];
  const width = chars.reduce((sum, char) => sum + target.measureText(char).width, 0) + spacing * Math.max(0, chars.length - 1);
  let cursor = align === 'center' ? x - width / 2 : x;
  chars.forEach((char) => {
    target.fillText(char, cursor, y);
    cursor += target.measureText(char).width + spacing;
  });
}

function randomStyle() {
  state.palette = pick(palettes);
  state.pattern = pick(patterns);
  state.horizontalTemplate = pick(horizontalTemplates);
  state.verticalTemplate = pick(verticalTemplates);
  $('patternSelect').value = state.pattern.id;
  syncTemplateSelect();
  $('patternStrength').value = 18 + Math.floor(Math.random() * 44);
  $('fontSizeInput').value = 118 + Math.floor(Math.random() * 62);
  showPaletteGroupForCurrent();
  render();
  refreshVariants();
}

function randomPattern() {
  state.pattern = pickDifferent(patterns, state.pattern);
  $('patternSelect').value = state.pattern.id;
  render();
  refreshVariants();
}

function randomPalette() {
  state.palette = pickDifferent(palettes, state.palette);
  showPaletteGroupForCurrent();
  render();
  refreshVariants();
}

function cyclePaletteGroup() {
  state.palettePage = (state.palettePage + 1) % Math.ceil(palettes.length / palettesPerPage);
  buildPaletteGrid();
}

function pickDifferent(list, current) {
  if (list.length < 2) return current;
  let next = pick(list);
  while (next === current) next = pick(list);
  return next;
}

function randomHighlight() {
  const raw = $('titleInput').value.replaceAll('`', '');
  const chars = [...raw];
  const indexes = chars.map((char, index) => /[\u4e00-\u9fa5A-Za-z0-9]/.test(char) ? index : -1).filter((index) => index >= 0);
  if (!indexes.length) return;
  const start = indexes[Math.floor(Math.random() * indexes.length)];
  const length = Math.min(3, Math.max(1, chars.length - start));
  const highlight = chars.slice(start, start + length).join('');
  $('titleInput').value = `${chars.slice(0, start).join('')}\`${highlight}\`${chars.slice(start + length).join('')}`;
  render();
  refreshVariants();
}

function randomWatermark() {
  const raw = $('titleInput').value.replaceAll('`', '');
  const candidates = [...raw].filter((char) => /[\u4e00-\u9fa5A-Za-z0-9]/.test(char));
  if (!candidates.length) return;
  $('watermarkInput').value = candidates[Math.floor(Math.random() * candidates.length)];
  render();
  refreshVariants();
}

function makeVariants(count, shuffle = false) {
  if (state.mode === 'batch') {
    makeSuiteVariants(count, shuffle);
    return;
  }
  const grid = $('variantGrid');
  grid.innerHTML = '';
  const paletteStart = palettes.indexOf(state.palette);
  const patternStart = patterns.indexOf(state.pattern);
  const currentTemplates = templatesForPlatform(state.platform);
  const currentTemplate = templateForPlatform(state.platform);
  const templateStart = Math.max(0, currentTemplates.indexOf(currentTemplate));
  const offset = shuffle ? state.variantSeed : 0;
  state.variants = Array.from({ length: count }, (_, index) => {
    const platform = state.platform;
    const platformTemplates = templatesForPlatform(platform);
    return {
      platform,
      palette: palettes[(paletteStart + index + offset) % palettes.length],
      pattern: patterns[(patternStart + index * 2 + offset) % patterns.length],
      template: platformTemplates[(templateStart + index + offset) % platformTemplates.length],
      input: { ...getInput(), size: Math.max(82, Number($('fontSizeInput').value) + ((index + offset) % 5 - 2) * 8), strength: .18 + ((index + offset) % 5) * .1 }
    };
  });

  state.variants.forEach((variant, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `variant${index === 0 ? ' active' : ''}`;
    const thumb = document.createElement('canvas');
    thumb.width = variant.platform.width;
    thumb.height = variant.platform.height;
    drawCover(thumb.getContext('2d'), variant.platform, variant.palette, variant.template, variant.pattern, variant.input);
    const frame = document.createElement('div');
    frame.className = 'variant-thumb';
    frame.appendChild(thumb);
    const label = document.createElement('span');
    label.textContent = `${variant.platform.name} · ${variant.palette.name}`;
    item.append(frame, label);
    item.addEventListener('click', () => applyVariant(index));
    grid.appendChild(item);
  });
}

function makeSuiteVariants(count, shuffle = false) {
  const grid = $('variantGrid');
  grid.innerHTML = '';
  const chosenPlatforms = selectedPlatforms();
  const paletteStart = palettes.indexOf(state.palette);
  const patternStart = patterns.indexOf(state.pattern);
  const offset = shuffle ? state.variantSeed : 0;
  state.variants = Array.from({ length: count }, (_, index) => ({
    palette: palettes[(paletteStart + index * 3 + offset) % palettes.length],
    pattern: patterns[(patternStart + index + offset) % patterns.length],
    templateOffset: index + offset,
    input: { ...getInput(), size: Math.max(82, Number($('fontSizeInput').value) + ((index + offset) % 5 - 2) * 7), strength: .18 + ((index + offset) % 5) * .1 }
  }));

  state.variants.forEach((variant, index) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `variant suite-variant${index === 0 ? ' active' : ''}`;
    const stack = document.createElement('div');
    stack.className = 'suite-stack';
    chosenPlatforms.forEach((platform, platformIndex) => {
      const thumb = document.createElement('canvas');
      thumb.width = platform.width;
      thumb.height = platform.height;
      if (isVerticalPlatform(platform)) thumb.className = 'vertical-mini';
      drawCover(thumb.getContext('2d'), platform, variant.palette, variantTemplateForPlatform(platform, variant.templateOffset + platformIndex), variant.pattern, variant.input);
      stack.appendChild(thumb);
    });
    const label = document.createElement('span');
    label.textContent = `方案 ${index + 1} · ${variant.palette.name}`;
    item.append(stack, label);
    item.addEventListener('click', () => applySuiteVariant(index));
    grid.appendChild(item);
  });
}

function applyVariant(index) {
  const variant = state.variants[index];
  state.platform = variant.platform;
  state.palette = variant.palette;
  state.pattern = variant.pattern;
  if (isVerticalPlatform(variant.platform)) {
    state.verticalTemplate = variant.template;
  } else {
    state.horizontalTemplate = variant.template;
  }
  syncTemplateSelect();
  syncPlatformGrid();
  $('patternSelect').value = state.pattern.id;
  $('fontSizeInput').value = variant.input.size;
  $('patternStrength').value = Math.round(variant.input.strength * 100);
  showPaletteGroupForCurrent();
  document.querySelectorAll('.variant').forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
  render({ input: variant.input });
}

function applySuiteVariant(index) {
  const variant = state.variants[index];
  state.palette = variant.palette;
  state.pattern = variant.pattern;
  $('patternSelect').value = state.pattern.id;
  $('fontSizeInput').value = variant.input.size;
  $('patternStrength').value = Math.round(variant.input.strength * 100);
  showPaletteGroupForCurrent();
  document.querySelectorAll('.variant').forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
  render({ input: variant.input });
}

function exportPng() {
  render();
  downloadCanvas(canvas, state.platform);
}

function exportAllPng() {
  const input = getInput();
  const platformsToExport = state.mode === 'batch' ? selectedPlatforms() : [state.platform];
  platformsToExport.forEach((platform, index) => {
    const output = document.createElement('canvas');
    output.width = platform.width;
    output.height = platform.height;
    drawCover(output.getContext('2d'), platform, state.palette, templateForPlatform(platform), state.pattern, input);
    setTimeout(() => downloadCanvas(output, platform), index * 120);
  });
}

function downloadCanvas(sourceCanvas, platform) {
  const link = document.createElement('a');
  const cleanTitle = $('titleInput').value.replace(/`/g, '').replace(/[\\/:*?"<>|]/g, '_').slice(0, 24);
  link.download = `AnyCover_${platform.id}_${cleanTitle || 'cover'}.png`;
  link.href = sourceCanvas.toDataURL('image/png');
  link.click();
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

init();
