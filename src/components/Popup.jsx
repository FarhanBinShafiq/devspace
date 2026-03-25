import React, { useState, useEffect, useRef } from 'react';
import { Copy, Plus, Search, Trash2, Code2, Tag, Check, Star, LayoutGrid, Terminal, ArrowRight, Palette, Grid, Pipette, History, Monitor, Tablet, Smartphone, Eye, EyeOff, Columns, Ruler, RotateCcw, Maximize2, ChevronDown, ChevronUp, Minus, X } from 'lucide-react';

// ─── Device Presets ───
const DEVICES = [
  { name: 'iPhone SE', w: 375, h: 667, type: 'phone' },
  { name: 'iPhone 12/13', w: 390, h: 844, type: 'phone' },
  { name: 'iPhone 14 Pro Max', w: 430, h: 932, type: 'phone' },
  { name: 'Samsung Galaxy S21', w: 360, h: 800, type: 'phone' },
  { name: 'Google Pixel 7', w: 412, h: 915, type: 'phone' },
  { name: 'iPhone XR', w: 414, h: 896, type: 'phone' },
  { name: 'iPad Mini', w: 768, h: 1024, type: 'tablet' },
  { name: 'iPad Air', w: 820, h: 1180, type: 'tablet' },
  { name: 'iPad Pro 11"', w: 834, h: 1194, type: 'tablet' },
  { name: 'iPad Pro 12.9"', w: 1024, h: 1366, type: 'tablet' },
  { name: 'Surface Pro 7', w: 912, h: 1368, type: 'tablet' },
  { name: 'Galaxy Tab S7', w: 800, h: 1280, type: 'tablet' },
  { name: 'Laptop (HD)', w: 1366, h: 768, type: 'desktop' },
  { name: 'MacBook Air 13"', w: 1440, h: 900, type: 'desktop' },
  { name: 'MacBook Pro 16"', w: 1728, h: 1117, type: 'desktop' },
  { name: 'Desktop (FHD)', w: 1920, h: 1080, type: 'desktop' },
  { name: 'Desktop (QHD)', w: 2560, h: 1440, type: 'desktop' },
  { name: 'Desktop (4K)', w: 3840, h: 2160, type: 'desktop' },
];

// ─── Color Palettes ───
const COLOR_PALETTES = [
  { name: 'Ocean', colors: ['#0f172a','#1e293b','#3b82f6','#60a5fa','#93c5fd'] },
  { name: 'Sunset', colors: ['#450a0a','#7f1d1d','#ef4444','#f87171','#fca5a5'] },
  { name: 'Forest', colors: ['#064e3b','#065f46','#10b981','#34d399','#6ee7b7'] },
  { name: 'Cyberpunk', colors: ['#2e0249','#570a57','#a91079','#f806cc','#0ff0fc'] },
  { name: 'Royal', colors: ['#170b3b','#2e1065','#6d28d9','#a78bfa','#ddd6fe'] },
  { name: 'Monochrome', colors: ['#000000','#27272a','#52525b','#a1a1aa','#ffffff'] },
  { name: 'Coral Reef', colors: ['#1a1a2e','#16213e','#e94560','#ff6b6b','#ffc3a0'] },
  { name: 'Northern Lights', colors: ['#0a0a23','#1b2838','#00d2ff','#7effdb','#eefbfb'] },
];

// ─── Grid Breakpoints reference ───
const GRID_BREAKPOINTS = [
  { name: 'Mobile (sm)', size: '640px', columns: '4', gutter: '16px', margin: '16px' },
  { name: 'Tablet (md)', size: '768px', columns: '8', gutter: '24px', margin: '24px' },
  { name: 'Laptop (lg)', size: '1024px', columns: '12', gutter: '24px', margin: '32px' },
  { name: 'Desktop (xl)', size: '1280px', columns: '12', gutter: '32px', margin: '32px' },
  { name: 'Ultra (2xl)', size: '1536px', columns: '12', gutter: '32px', margin: '32px' },
];

// ─── Helper: hex to rgba ───
function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function Popup() {
  // ─── Snippet State ───
  const [snippets, setSnippets] = useState([]);
  const [pickedColors, setPickedColors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentTab, setCurrentTab] = useState('library');
  const [copiedId, setCopiedId] = useState(null);
  const [filterFavorites, setFilterFavorites] = useState(false);
  const [newSnippet, setNewSnippet] = useState({ title: '', code: '', tags: '', language: 'javascript' });

  // ─── Grid Overlay State ───
  const [gridActive, setGridActive] = useState(false);
  const [gridConfig, setGridConfig] = useState({
    columns: 12, gutter: 24, margin: 32,
    maxWidth: 1440, color: '#6366f1', opacity: 0.12, type: 'columns'
  });

  // ─── Responsive Checker State ───
  const [testUrl, setTestUrl] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [customW, setCustomW] = useState(1920);
  const [customH, setCustomH] = useState(1080);
  const [isLandscape, setIsLandscape] = useState(false);
  const [deviceFilter, setDeviceFilter] = useState('all');

  const languages = ['javascript','typescript','python','html','css','json','sql','bash','plaintext'];

  // ─── Storage ───
  useEffect(() => {
    if (chrome?.storage?.local) {
      chrome.storage.local.get(['snippets','pickedColors','gridConfig','gridActive'], (result) => {
        if (result.snippets) setSnippets(result.snippets);
        if (result.pickedColors) setPickedColors(result.pickedColors);
        if (result.gridConfig) setGridConfig(result.gridConfig);
        if (result.gridActive) setGridActive(result.gridActive);
      });
    }
  }, []);

  // ─── Snippet Helpers ───
  const saveSnippets = (updated) => {
    setSnippets(updated);
    chrome?.storage?.local?.set({ snippets: updated });
  };
  const handleAdd = () => {
    if (!newSnippet.title || !newSnippet.code) return;
    const addObj = {
      id: Date.now().toString(), ...newSnippet, isFavorite: false,
      tags: newSnippet.tags.split(',').map(t => t.trim()).filter(Boolean)
    };
    saveSnippets([addObj, ...snippets]);
    setNewSnippet({ title: '', code: '', tags: '', language: 'javascript' });
    setCurrentTab('library');
  };
  const handleDelete = (id) => saveSnippets(snippets.filter(s => s.id !== id));
  const toggleFavorite = (id) => saveSnippets(snippets.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s));

  const copyToClipboard = async (code, id) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) { console.error('Failed to copy', err); }
  };

  // ─── EyeDropper ───
  const handlePickColor = async () => {
    if (!window.EyeDropper) { alert("EyeDropper API not supported."); return; }
    try {
      const result = await new window.EyeDropper().open();
      const c = result.sRGBHex;
      const newPicked = [c, ...pickedColors.filter(x => x !== c)].slice(0, 20);
      setPickedColors(newPicked);
      chrome?.storage?.local?.set({ pickedColors: newPicked });
      copyToClipboard(c, 'picked-new');
    } catch (e) { console.log('EyeDropper canceled', e); }
  };

  // ─── Grid Overlay ───
  const sendGridMessage = (action, config) => {
    if (chrome?.tabs) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id, { action, config });
      });
    }
  };
  const toggleGrid = () => {
    const newState = !gridActive;
    setGridActive(newState);
    chrome?.storage?.local?.set({ gridActive: newState });
    if (newState) sendGridMessage('updateGrid', gridConfig);
    else sendGridMessage('removeGrid');
  };
  const updateGridConfig = (key, value) => {
    const updated = { ...gridConfig, [key]: value };
    setGridConfig(updated);
    chrome?.storage?.local?.set({ gridConfig: updated });
    if (gridActive) sendGridMessage('updateGrid', updated);
  };

  // ─── Responsive Checker ───
  const openResponsiveTest = (w, h) => {
    const finalW = isLandscape ? h : w;
    const finalH = isLandscape ? w : h;
    const url = testUrl || 'https://example.com';
    if (chrome?.tabs) {
      chrome.tabs.create({ url });
      setTimeout(() => {
        chrome.windows.getCurrent((win) => {
          chrome.windows.update(win.id, { width: finalW + 16, height: finalH + 88, state: 'normal' });
        });
      }, 500);
    } else {
      window.open(url, '_blank', `width=${finalW},height=${finalH},menubar=no,toolbar=no,location=no,status=no`);
    }
  };

  // ─── Filtering ───
  let filteredSnippets = snippets.filter(s =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  if (filterFavorites) filteredSnippets = filteredSnippets.filter(s => s.isFavorite);

  const filteredDevices = deviceFilter === 'all' ? DEVICES : DEVICES.filter(d => d.type === deviceFilter);

  // ─── Tab Nav Items ───
  const tabs = [
    { id: 'library', icon: LayoutGrid, tip: 'Snippets' },
    { id: 'colors', icon: Palette, tip: 'Colors' },
    { id: 'grid', icon: Grid, tip: 'Grid Overlay' },
    { id: 'responsive', icon: Monitor, tip: 'Responsive' },
    { id: 'add', icon: Plus, tip: 'Add New' },
  ];

  return (
    <div className="w-[460px] h-[600px] bg-[#09090b] text-zinc-100 flex flex-col font-sans relative overflow-hidden selection:bg-indigo-500/30">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-violet-600/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ═══ Header ═══ */}
      <div className="flex-none pt-4 px-5 pb-3 flex flex-col gap-3 border-b border-white/5 relative z-10 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 bg-gradient-to-tr from-indigo-500 to-violet-500 rounded-lg shadow-[0_0_15px_rgba(99,102,241,0.4)]">
              <Terminal size={16} className="text-white" />
            </div>
            <h1 className="text-base font-semibold tracking-tight text-zinc-100">DevSpace</h1>
            <span className="text-[9px] px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/20">PRO</span>
          </div>
          <div className="flex bg-zinc-900 border border-white/5 rounded-full p-0.5 shadow-inner">
            {tabs.map(t => (
              <button key={t.id} onClick={() => setCurrentTab(t.id)}
                className={`px-2.5 py-1.5 text-xs font-medium rounded-full transition-all flex items-center gap-1 ${currentTab === t.id ? 'bg-zinc-800 text-zinc-100 shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                title={t.tip}>
                <t.icon size={13} />
              </button>
            ))}
          </div>
        </div>

        {/* Subtitle per tab */}
        {currentTab === 'library' && (
          <div className="flex gap-2 items-center">
            <div className="relative flex-1 group">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-indigo-400 transition-colors" />
              <input placeholder="Search snippets..." className="w-full bg-zinc-900/50 border border-white/5 hover:border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-indigo-500/50 focus:bg-zinc-900 transition-all placeholder:text-zinc-600"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
            <button onClick={() => setFilterFavorites(!filterFavorites)}
              className={`p-2.5 rounded-xl border transition-all ${filterFavorites ? 'bg-amber-500/10 border-amber-500/30 text-amber-500' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-zinc-300'}`} title="Favorites">
              <Star size={14} className={filterFavorites ? "fill-current" : ""} />
            </button>
          </div>
        )}
      </div>

      {/* ═══ Content ═══ */}
      <div className="flex-1 overflow-hidden relative z-10">

        {/* ── Add Snippet ── */}
        {currentTab === 'add' && (
          <div className="p-5 flex flex-col gap-3.5 h-full overflow-y-auto nice-scrollbar animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ml-1">Title</label>
              <input placeholder="e.g. Centering a Div" className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                value={newSnippet.title} onChange={(e) => setNewSnippet({...newSnippet, title: e.target.value})} autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ml-1">Language</label>
              <select className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-indigo-500/50 transition-all text-zinc-300 cursor-pointer"
                value={newSnippet.language} onChange={(e) => setNewSnippet({...newSnippet, language: e.target.value})}>
                {languages.map(l => <option key={l} value={l}>{l.charAt(0).toUpperCase()+l.slice(1)}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-1.5 flex-1 min-h-[120px]">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ml-1">Code</label>
              <textarea placeholder="// Write something brilliant..." className="w-full h-full bg-[#030303] border border-white/5 rounded-xl p-4 text-[13px] font-mono leading-relaxed text-zinc-300 outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-700 resize-none nice-scrollbar"
                value={newSnippet.code} onChange={(e) => setNewSnippet({...newSnippet, code: e.target.value})} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ml-1">Tags</label>
              <div className="relative">
                <Tag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                <input placeholder="react, css, utility..." className="w-full bg-zinc-900/80 border border-white/5 rounded-xl pl-9 pr-3 py-3 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600"
                  value={newSnippet.tags} onChange={(e) => setNewSnippet({...newSnippet, tags: e.target.value})} onKeyDown={(e) => e.key === 'Enter' && handleAdd()} />
              </div>
            </div>
            <button onClick={handleAdd} disabled={!newSnippet.title || !newSnippet.code}
              className="mt-1 w-full bg-zinc-100 hover:bg-white text-zinc-900 disabled:opacity-50 disabled:bg-zinc-800 disabled:text-zinc-500 rounded-xl py-3 flex items-center justify-center font-semibold text-sm transition-all shadow-lg active:scale-[0.98] gap-2">
              Save Snippet <ArrowRight size={16} />
            </button>
          </div>
        )}

        {/* ── Library ── */}
        {currentTab === 'library' && (
          <div className="overflow-y-auto h-full p-5 space-y-3 nice-scrollbar animate-in fade-in duration-300">
            {filteredSnippets.map(snippet => (
              <div key={snippet.id} className="group flex flex-col border border-white/5 bg-[#0e0e11] hover:bg-[#121217] rounded-xl overflow-hidden transition-all duration-300 hover:border-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <div className="flex justify-between items-center p-3 border-b border-white/[0.02]">
                  <div className="flex items-center gap-2 overflow-hidden pr-2">
                    <button onClick={() => toggleFavorite(snippet.id)} className={`flex-none p-1 rounded-md transition-colors ${snippet.isFavorite ? 'text-amber-500' : 'text-zinc-600 hover:text-zinc-400'}`}>
                      <Star size={14} className={snippet.isFavorite ? "fill-current" : ""} />
                    </button>
                    <h3 className="font-medium text-[13px] text-zinc-200 truncate">{snippet.title}</h3>
                    <span className="flex-none px-1.5 py-0.5 rounded-md bg-zinc-800/50 border border-white/5 text-[9px] font-semibold text-zinc-500 uppercase">{snippet.language}</span>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => copyToClipboard(snippet.code, snippet.id)} className={`p-1.5 rounded-lg transition-all ${copiedId === snippet.id ? 'bg-emerald-500/20 text-emerald-400' : 'text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800'}`}>
                      {copiedId === snippet.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                    <button onClick={() => handleDelete(snippet.id)} className="p-1.5 text-zinc-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all"><Trash2 size={14} /></button>
                  </div>
                </div>
                <div className="relative"><pre className="text-[12px] font-mono leading-[1.6] bg-[#09090b]/80 p-3 overflow-x-auto text-zinc-300 max-h-36 nice-scrollbar"><code>{snippet.code}</code></pre><div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#09090b]/80 to-transparent pointer-events-none" /></div>
                {snippet.tags.length > 0 && (
                  <div className="p-2.5 border-t border-white/[0.02] flex flex-wrap gap-1.5 bg-black/20">
                    {snippet.tags.map(tag => <span key={tag} className="text-[10px] font-medium bg-zinc-800/80 text-zinc-400 px-2 py-0.5 rounded"><span className="text-zinc-600">#</span>{tag}</span>)}
                  </div>
                )}
              </div>
            ))}
            {filteredSnippets.length === 0 && (
              <div className="flex flex-col items-center justify-center h-48 text-zinc-500 gap-3">
                <div className="w-12 h-12 rounded-full border border-dashed border-zinc-700 flex items-center justify-center bg-zinc-900/50"><Code2 size={20} className="text-zinc-600" /></div>
                <p className="text-sm">{searchQuery ? "No snippets found." : "Your vault is empty."}</p>
                {!searchQuery && <button onClick={() => setCurrentTab('add')} className="mt-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors">Add your first snippet &rarr;</button>}
              </div>
            )}
          </div>
        )}

        {/* ── Colors ── */}
        {currentTab === 'colors' && (
          <div className="overflow-y-auto h-full p-5 space-y-4 nice-scrollbar animate-in fade-in duration-300">
            <button onClick={handlePickColor}
              className="w-full bg-gradient-to-tr from-indigo-500 hover:from-indigo-400 to-violet-500 hover:to-violet-400 text-white rounded-xl p-3.5 flex items-center justify-center font-medium text-sm transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-[0.98] gap-2 border border-white/10">
              <Pipette size={18} /> Pick Color from Screen
            </button>
            {pickedColors.length > 0 && (
              <div className="bg-[#0e0e11] border border-white/5 rounded-xl p-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-[13px] text-zinc-300 flex items-center gap-1.5"><History size={14} className="text-indigo-400"/> Picked History</h3>
                  <button onClick={() => { setPickedColors([]); chrome?.storage?.local?.set({ pickedColors: [] }); }} className="text-[10px] text-zinc-600 hover:text-red-400 transition-colors">Clear All</button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {pickedColors.map((color, idx) => (
                    <div key={idx} className="group cursor-pointer flex flex-col gap-1 items-center transition-all hover:scale-[1.08]"
                      onClick={() => copyToClipboard(color, `picked-${color}`)}>
                      <div className="w-9 h-9 rounded-lg shadow-inner ring-1 ring-white/10 flex items-center justify-center" style={{ backgroundColor: color }}>
                        {copiedId === `picked-${color}` && <Check size={14} className="text-white drop-shadow-md mix-blend-difference" />}
                      </div>
                      <span className="text-[8px] font-mono text-zinc-500 group-hover:text-zinc-300">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <p className="text-[11px] text-zinc-500 uppercase tracking-wider font-semibold">Preset Palettes</p>
            {COLOR_PALETTES.map((palette, idx) => (
              <div key={idx} className="bg-[#0e0e11] border border-white/5 rounded-xl p-3.5 transition-all hover:border-white/10">
                <h3 className="font-semibold text-[12px] text-zinc-300 mb-2">{palette.name}</h3>
                <div className="flex rounded-lg overflow-hidden h-10 shadow-inner">
                  {palette.colors.map((color, cIdx) => (
                    <div key={cIdx} className="flex-1 cursor-pointer group relative flex justify-center items-center transition-all hover:scale-[1.05] hover:z-10"
                      style={{ backgroundColor: color }} onClick={() => copyToClipboard(color, `color-${idx}-${cIdx}`)}>
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                        {copiedId === `color-${idx}-${cIdx}` ? <Check size={14} className="text-white" /> : <Copy size={12} className="text-white/80" />}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="flex mt-1.5 justify-between">
                  {palette.colors.map((c, i) => <span key={i} className="text-[9px] font-mono text-zinc-600 flex-1 text-center">{c}</span>)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Grid Overlay System ── */}
        {currentTab === 'grid' && (
          <div className="overflow-y-auto h-full p-5 space-y-4 nice-scrollbar animate-in fade-in duration-300">
            {/* Toggle */}
            <button onClick={toggleGrid}
              className={`w-full rounded-xl p-3.5 flex items-center justify-center font-medium text-sm transition-all shadow-lg active:scale-[0.98] gap-2 border ${gridActive ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/30' : 'bg-gradient-to-tr from-indigo-500 to-violet-500 text-white border-white/10 hover:shadow-indigo-500/25'}`}>
              {gridActive ? <><EyeOff size={18}/> Hide Grid Overlay</> : <><Eye size={18}/> Show Grid Overlay</>}
            </button>

            {/* Config */}
            <div className="bg-[#0e0e11] border border-white/5 rounded-xl p-4 space-y-4">
              <h3 className="font-semibold text-[13px] text-zinc-200 flex items-center gap-2"><Columns size={15} className="text-indigo-400"/> Grid Configuration</h3>

              {/* Type Selector */}
              <div className="flex gap-2">
                {['columns', 'lines'].map(type => (
                  <button key={type} onClick={() => updateGridConfig('type', type)}
                    className={`flex-1 text-xs py-2 rounded-lg border transition-all ${gridConfig.type === type ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-zinc-300'}`}>
                    {type === 'columns' ? 'Columns' : 'Lines'}
                  </button>
                ))}
              </div>

              {/* Sliders */}
              <SliderControl label="Columns" value={gridConfig.columns} min={1} max={24}
                onChange={(v) => updateGridConfig('columns', v)} unit="" />
              <SliderControl label="Gutter" value={gridConfig.gutter} min={0} max={64}
                onChange={(v) => updateGridConfig('gutter', v)} unit="px" />
              <SliderControl label="Margin" value={gridConfig.margin} min={0} max={120}
                onChange={(v) => updateGridConfig('margin', v)} unit="px" />
              <SliderControl label="Max Width" value={gridConfig.maxWidth} min={320} max={2560}
                onChange={(v) => updateGridConfig('maxWidth', v)} unit="px" step={10} />
              <SliderControl label="Opacity" value={Math.round(gridConfig.opacity * 100)} min={1} max={50}
                onChange={(v) => updateGridConfig('opacity', v / 100)} unit="%" />

              {/* Color */}
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-16">Color</span>
                <div className="flex gap-1.5 flex-1">
                  {['#6366f1','#ef4444','#10b981','#f59e0b','#06b6d4','#ec4899','#8b5cf6','#ffffff'].map(c => (
                    <button key={c} onClick={() => updateGridConfig('color', c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${gridConfig.color === c ? 'border-white scale-110' : 'border-transparent hover:border-white/30'}`}
                      style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-[#0e0e11] border border-white/5 rounded-xl p-4">
              <h3 className="font-semibold text-[13px] text-zinc-200 mb-3 flex items-center gap-2"><Ruler size={15} className="text-indigo-400"/> Quick Reference</h3>
              <div className="space-y-2">
                {GRID_BREAKPOINTS.map((bp, idx) => (
                  <div key={idx} className="flex justify-between items-center p-2.5 rounded-lg bg-zinc-900/50 border border-white/[0.02]">
                    <div className="flex flex-col"><span className="text-[12px] font-medium text-zinc-300">{bp.name}</span><span className="text-[10px] text-zinc-500 font-mono">&ge;{bp.size}</span></div>
                    <div className="flex gap-3 text-right">
                      <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase">Cols</span><span className="text-[11px] font-semibold text-zinc-300">{bp.columns}</span></div>
                      <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase">Gutter</span><span className="text-[11px] font-semibold text-zinc-300">{bp.gutter}</span></div>
                      <div className="flex flex-col"><span className="text-[9px] text-zinc-500 uppercase">Margin</span><span className="text-[11px] font-semibold text-zinc-300">{bp.margin}</span></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Responsive Checker ── */}
        {currentTab === 'responsive' && (
          <div className="overflow-y-auto h-full p-5 space-y-4 nice-scrollbar animate-in fade-in duration-300">
            {/* URL Input */}
            <div className="flex flex-col gap-1.5">
              <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider ml-1">Website URL</label>
              <input placeholder="https://example.com" className="w-full bg-zinc-900/80 border border-white/5 rounded-xl p-3 text-sm outline-none focus:border-indigo-500/50 transition-all placeholder:text-zinc-600 font-mono"
                value={testUrl} onChange={(e) => setTestUrl(e.target.value)} />
            </div>

            {/* Custom Size */}
            <div className="bg-[#0e0e11] border border-white/5 rounded-xl p-4">
              <h3 className="font-semibold text-[13px] text-zinc-200 mb-3 flex items-center gap-2"><Maximize2 size={15} className="text-indigo-400"/> Custom Size</h3>
              <div className="flex gap-3 items-end">
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Width</span>
                  <input type="number" value={customW} onChange={(e) => setCustomW(+e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-2 text-sm font-mono text-center outline-none focus:border-indigo-500/50" />
                </div>
                <span className="text-zinc-600 pb-2 font-bold">×</span>
                <div className="flex-1 flex flex-col gap-1">
                  <span className="text-[10px] text-zinc-500 uppercase">Height</span>
                  <input type="number" value={customH} onChange={(e) => setCustomH(+e.target.value)}
                    className="w-full bg-zinc-900 border border-white/5 rounded-lg p-2 text-sm font-mono text-center outline-none focus:border-indigo-500/50" />
                </div>
                <button onClick={() => openResponsiveTest(customW, customH)}
                  className="px-4 py-2 bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-semibold rounded-lg transition-all active:scale-95">
                  Test
                </button>
              </div>
            </div>

            {/* Device Filter */}
            <div className="flex gap-2">
              {[
                { id: 'all', label: 'All', icon: Monitor },
                { id: 'phone', label: 'Phones', icon: Smartphone },
                { id: 'tablet', label: 'Tablets', icon: Tablet },
                { id: 'desktop', label: 'Desktop', icon: Monitor },
              ].map(f => (
                <button key={f.id} onClick={() => setDeviceFilter(f.id)}
                  className={`flex-1 text-[11px] py-2 rounded-lg border transition-all flex items-center justify-center gap-1.5 ${deviceFilter === f.id ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-300' : 'bg-zinc-900/50 border-white/5 text-zinc-500 hover:text-zinc-300'}`}>
                  <f.icon size={12} /> {f.label}
                </button>
              ))}
            </div>

            {/* Landscape Toggle */}
            <div className="flex items-center justify-between bg-zinc-900/50 border border-white/5 rounded-xl px-4 py-2.5">
              <span className="text-[12px] text-zinc-400 flex items-center gap-2"><RotateCcw size={14}/> Landscape Mode</span>
              <button onClick={() => setIsLandscape(!isLandscape)}
                className={`w-10 h-5 rounded-full transition-all relative ${isLandscape ? 'bg-indigo-500' : 'bg-zinc-700'}`}>
                <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ${isLandscape ? 'left-5.5' : 'left-0.5'}`} />
              </button>
            </div>

            {/* Devices List */}
            <div className="space-y-2">
              {filteredDevices.map((d, idx) => (
                <button key={idx} onClick={() => { setSelectedDevice(d); openResponsiveTest(d.w, d.h); }}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-[#0e0e11] border border-white/5 hover:border-indigo-500/30 hover:bg-[#121217] transition-all group">
                  <div className="flex items-center gap-3">
                    {d.type === 'phone' ? <Smartphone size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" /> :
                     d.type === 'tablet' ? <Tablet size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" /> :
                     <Monitor size={16} className="text-zinc-500 group-hover:text-indigo-400 transition-colors" />}
                    <span className="text-[13px] text-zinc-300 font-medium">{d.name}</span>
                  </div>
                  <span className="text-[11px] font-mono text-zinc-500 bg-zinc-900/80 px-2 py-1 rounded-md border border-white/[0.03]">
                    {isLandscape ? `${d.h}×${d.w}` : `${d.w}×${d.h}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Reusable Slider Component ───
function SliderControl({ label, value, min, max, onChange, unit, step = 1 }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[11px] font-semibold text-zinc-500 uppercase tracking-wider w-16 flex-none">{label}</span>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(+e.target.value)}
        className="flex-1 h-1 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-indigo-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-indigo-500 [&::-webkit-slider-thumb]:shadow-[0_0_6px_rgba(99,102,241,0.5)]" />
      <span className="text-[12px] font-mono text-zinc-400 w-12 text-right">{value}{unit}</span>
    </div>
  );
}
