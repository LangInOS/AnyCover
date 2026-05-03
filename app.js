const canvas = document.getElementById('coverCanvas');
const ctx = canvas.getContext('2d');

const platforms = [
  { id: 'x', name: 'X 封面', width: 2500, height: 1000, ratio: '5:2' },
  { id: 'youtube', name: 'YouTube 缩略图', width: 1280, height: 720, ratio: '16:9' },
  { id: 'wechat', name: '公众号首图', width: 900, height: 383, ratio: '2.35:1' },
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
  { id: 'deep-cyan', name: '深青冷白', bg: '#091617', bg2: '#102426', text: '#e8f1ec', muted: '#6f8988', accent: '#4fc3b1', mark: '#ffffff' }
];

const state = {
  mode: 'single',
  platform: platforms[0],
  template: horizontalTemplates[0],
  pattern: patterns[0],
  palette: palettes[0],
  palettePage: 0,
  variantSeed: 0,
  variants: []
};

const $ = (id) => document.getElementById(id);

function init() {
  fillSelect('platformSelect', platforms);
  syncTemplateSelect();
  fillSelect('patternSelect', patterns);
  buildPaletteGrid();
  bindEvents();
  render();
  makeVariants(5);
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

function syncTemplateSelect() {
  const templates = templatesForPlatform();
  if (!templates.includes(state.template)) {
    state.template = templates[0];
  }
  fillSelect('templateSelect', templates);
  $('templateSelect').value = state.template.id;
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
  const pageSize = 6;
  const start = (state.palettePage * pageSize) % palettes.length;
  return Array.from({ length: pageSize }, (_, index) => palettes[(start + index) % palettes.length]);
}

function bindEvents() {
  ['tagInput', 'leadInput', 'titleInput', 'watermarkInput', 'signInput', 'patternStrength', 'fontSizeInput'].forEach((id) => {
    $(id).addEventListener('input', render);
  });
  $('platformSelect').addEventListener('change', (event) => {
    state.platform = platforms.find((item) => item.id === event.target.value);
    syncTemplateSelect();
    render();
    refreshVariants();
  });
  $('templateSelect').addEventListener('change', (event) => {
    state.template = templatesForPlatform().find((item) => item.id === event.target.value);
    render();
    refreshVariants();
  });
  $('patternSelect').addEventListener('change', (event) => {
    state.pattern = patterns.find((item) => item.id === event.target.value);
    render();
    refreshVariants();
  });
  $('multiPlatformToggle').addEventListener('change', (event) => setMultiPlatform(event.target.checked));
  $('exportBtn').addEventListener('click', exportPng);
  $('randomStyleBtn').addEventListener('click', randomStyle);
  $('generateBatchBtn').addEventListener('click', generateVariants);
  $('randomPatternBtn').addEventListener('click', randomPattern);
  $('randomPaletteBtn').addEventListener('click', randomPalette);
  $('cyclePaletteBtn').addEventListener('click', cyclePaletteGroup);
  $('randomHighlightBtn').addEventListener('click', randomHighlight);
  $('clearHighlightBtn').addEventListener('click', () => {
    $('titleInput').value = $('titleInput').value.replaceAll('`', '');
    render();
  });
  $('randomWatermarkBtn').addEventListener('click', randomWatermark);
  $('clearWatermarkBtn').addEventListener('click', () => {
    $('watermarkInput').value = '';
    render();
  });
}

function setMultiPlatform(enabled) {
  state.mode = enabled ? 'batch' : 'single';
  setBatchMeta();
  refreshVariants();
}

function setBatchMeta(text) {
  $('batchMeta').textContent = text || (state.mode === 'batch' ? '多平台候选预览，点击应用到主图' : '当前平台候选预览，点击应用到主图');
}

function refreshVariants() {
  makeVariants(state.mode === 'batch' ? 8 : 5);
}

function generateVariants() {
  state.variantSeed += 1;
  makeVariants(state.mode === 'batch' ? 8 : 5, true);
  setBatchMeta(state.mode === 'batch' ? '已换一组多平台候选，点击应用' : '已换一组当前平台候选，点击应用');
}

function setActivePalette() {
  document.querySelectorAll('.swatch').forEach((item) => {
    item.classList.toggle('active', item.dataset.id === state.palette.id);
  });
}

function showPaletteGroupForCurrent() {
  state.palettePage = Math.floor(palettes.indexOf(state.palette) / 6);
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
  const template = config.template || state.template;
  const pattern = config.pattern || state.pattern;

  canvas.width = platform.width;
  canvas.height = platform.height;
  drawCover(ctx, platform, palette, template, pattern, input);
  fitMainCanvas(platform);
  $('previewMeta').textContent = `${platform.name} · ${platform.width}x${platform.height}`;
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

window.addEventListener('resize', () => fitMainCanvas(state.platform));

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
      target.font = `${part.highlight ? '900' : '850'} ${Math.round(size)}px Georgia, "Noto Serif SC", "Songti SC", serif`;
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
    target.font = `${part.highlight ? '900' : '850'} ${Math.round(size)}px Georgia, "Noto Serif SC", "Songti SC", serif`;
    return sum + target.measureText(part.text).width;
  }, 0);
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
  state.template = pick(templatesForPlatform());
  $('patternSelect').value = state.pattern.id;
  $('templateSelect').value = state.template.id;
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
  state.palettePage = (state.palettePage + 1) % Math.ceil(palettes.length / 6);
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
}

function randomWatermark() {
  const raw = $('titleInput').value.replaceAll('`', '');
  const candidates = [...raw].filter((char) => /[\u4e00-\u9fa5A-Za-z0-9]/.test(char));
  if (!candidates.length) return;
  $('watermarkInput').value = candidates[Math.floor(Math.random() * candidates.length)];
  render();
}

function makeVariants(count, shuffle = false) {
  const grid = $('variantGrid');
  grid.innerHTML = '';
  const paletteStart = palettes.indexOf(state.palette);
  const patternStart = patterns.indexOf(state.pattern);
  const currentTemplates = templatesForPlatform();
  const templateStart = currentTemplates.indexOf(state.template);
  const offset = shuffle ? state.variantSeed : 0;
  state.variants = Array.from({ length: count }, (_, index) => {
    const platform = state.mode === 'batch' ? platforms[(index + offset) % platforms.length] : state.platform;
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
    const label = document.createElement('span');
    label.textContent = `${variant.platform.name} · ${variant.palette.name}`;
    item.append(thumb, label);
    item.addEventListener('click', () => applyVariant(index));
    grid.appendChild(item);
  });
}

function applyVariant(index) {
  const variant = state.variants[index];
  state.platform = variant.platform;
  state.palette = variant.palette;
  state.pattern = variant.pattern;
  state.template = variant.template;
  $('platformSelect').value = state.platform.id;
  syncTemplateSelect();
  $('patternSelect').value = state.pattern.id;
  $('templateSelect').value = state.template.id;
  $('fontSizeInput').value = variant.input.size;
  $('patternStrength').value = Math.round(variant.input.strength * 100);
  showPaletteGroupForCurrent();
  document.querySelectorAll('.variant').forEach((item, itemIndex) => item.classList.toggle('active', itemIndex === index));
  render({ input: variant.input });
}

function exportPng() {
  render();
  const link = document.createElement('a');
  const cleanTitle = $('titleInput').value.replace(/`/g, '').replace(/[\\/:*?"<>|]/g, '_').slice(0, 24);
  link.download = `AnyCover_${state.platform.id}_${cleanTitle || 'cover'}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function pick(items) {
  return items[Math.floor(Math.random() * items.length)];
}

init();
