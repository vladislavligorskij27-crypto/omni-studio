import React, { useState, useEffect, useRef } from 'react';
import { 
  Settings, Scale, Ruler, Droplet, Maximize, Thermometer, 
  HardDrive, Clock, Image as ImageIcon, ArrowRightLeft, 
  Coins, UploadCloud, Moon, Sun, Bitcoin, Copy, Check, Sparkles,
  Download, RefreshCw, Languages, FileText, FileSearch, Trash2,
  Zap, Gauge, Wind, FileCode, FileJson, ChevronRight, QrCode, 
  MessageSquare, History, Search, Send, Calculator, Delete, Percent, Equal,
  Menu, X, Info, Github, ExternalLink
} from 'lucide-react';

const conversionData = {
  length: {
    title: "Расстояние",
    icon: <Ruler size={18} />,
    base: "meter",
    theme: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/40",
    units: {
      meter: { name: "Метры (m)", ratio: 1 },
      kilometer: { name: "Километры (km)", ratio: 1000 },
      centimeter: { name: "Сантиметры (cm)", ratio: 0.01 },
      millimeter: { name: "Миллиметры (mm)", ratio: 0.001 },
      mile: { name: "Мили (mi)", ratio: 1609.344 },
      yard: { name: "Ярды (yd)", ratio: 0.9144 },
      foot: { name: "Футы (ft)", ratio: 0.3048 },
      inch: { name: "Дюймы (in)", ratio: 0.0254 },
      nautical_mile: { name: "Морские мили", ratio: 1852 }
    }
  },
  weight: {
    title: "Масса",
    icon: <Scale size={18} />,
    base: "kilogram",
    theme: "from-indigo-600 to-blue-500",
    shadow: "shadow-indigo-500/40",
    units: {
      kilogram: { name: "Килограммы (kg)", ratio: 1 },
      gram: { name: "Граммы (g)", ratio: 0.001 },
      metric_ton: { name: "Тонны (t)", ratio: 1000 },
      pound: { name: "Фунты (lb)", ratio: 0.453592 },
      ounce: { name: "Унции (oz)", ratio: 0.028349 },
      carat: { name: "Караты (ct)", ratio: 0.0002 }
    }
  },
  speed: {
    title: "Скорость",
    icon: <Wind size={18} />,
    base: "mps",
    theme: "from-emerald-500 to-teal-400",
    shadow: "shadow-emerald-500/40",
    units: {
      mps: { name: "Метры в сек (m/s)", ratio: 1 },
      kmh: { name: "Км/ч (km/h)", ratio: 0.277778 },
      mph: { name: "Мили/ч (mph)", ratio: 0.44704 },
      knot: { name: "Узлы (kn)", ratio: 0.514444 },
      mach: { name: "Мах (Звук)", ratio: 340.3 }
    }
  },
  energy: {
    title: "Энергия",
    icon: <Zap size={18} />,
    base: "joule",
    theme: "from-amber-500 to-orange-400",
    shadow: "shadow-amber-500/40",
    units: {
      joule: { name: "Джоули (J)", ratio: 1 },
      kilojoule: { name: "Килоджоули (kJ)", ratio: 1000 },
      calorie: { name: "Калории (cal)", ratio: 4.184 },
      kilocalorie: { name: "Ккал (kcal)", ratio: 4184 },
      kwh: { name: "кВт⋅ч (kWh)", ratio: 3600000 }
    }
  },
  temperature: {
    title: "Температура",
    icon: <Thermometer size={18} />,
    theme: "from-orange-500 to-red-500",
    shadow: "shadow-orange-500/40",
    units: {
      celsius: { name: "Цельсий (°C)" },
      fahrenheit: { name: "Фаренгейт (°F)" },
      kelvin: { name: "Кельвин (K)" }
    }
  },
  data: {
    title: "Данные",
    icon: <HardDrive size={18} />,
    base: "byte",
    theme: "from-slate-600 to-slate-400",
    shadow: "shadow-slate-500/40",
    units: {
      byte: { name: "Байты (B)", ratio: 1 },
      kilobyte: { name: "Килобайты (KB)", ratio: 1024 },
      megabyte: { name: "Мегабайты (MB)", ratio: 1048576 },
      gigabyte: { name: "Гигабайты (GB)", ratio: 1073741824 },
      terabyte: { name: "Терабайты (TB)", ratio: 1099511627776 }
    }
  },
  currency: {
    title: "Валюты",
    icon: <Coins size={18} />,
    base: "BYN",
    theme: "from-green-600 to-emerald-500",
    shadow: "shadow-green-500/40",
    units: { BYN: { name: "Белорусский рубль", ratio: 1 } }
  },
  crypto: {
    title: "Крипто",
    icon: <Bitcoin size={18} />,
    base: "USD",
    theme: "from-yellow-500 to-orange-500",
    shadow: "shadow-yellow-500/40",
    units: { USD: { name: "Доллар (USD)", ratio: 1 } }
  }
};

const languages = {
  'en-ru': 'Английский ⮕ Русский',
  'ru-en': 'Русский ⮕ Английский',
  'en-de': 'Английский ⮕ Немецкий',
  'en-fr': 'Английский ⮕ Французский',
  'en-es': 'Английский ⮕ Испанский',
  'en-zh': 'Английский ⮕ Китайский',
  'en-ja': 'Английский ⮕ Японский',
  'en-ko': 'Английский ⮕ Корейский',
  'en-tr': 'Английский ⮕ Турецкий',
  'en-it': 'Английский ⮕ Итальянский',
};

const TOOL_TABS = ['image', 'translate', 'docs', 'ai', 'qr', 'calc'];

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('omni_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('omni_activeTab') || 'length');
  const [isAnimating, setIsAnimating] = useState(false);
  const [copied, setCopied] = useState(false);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const [showInfo, setShowInfo] = useState(false);

  const [inputValue, setInputValue] = useState(1);
  const [outputValue, setOutputValue] = useState(0);
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  
  const [currencies, setCurrencies] = useState(conversionData.currency.units);
  const [cryptos, setCryptos] = useState(conversionData.crypto.units);
  const [isLoadingApi, setIsLoadingApi] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFormat, setImageFormat] = useState('image/jpeg');
  const [imgQuality, setImgQuality] = useState(0.9);
  const [imgWidth, setImgWidth] = useState(0);
  const [imgHeight, setImgHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalAspect, setOriginalAspect] = useState(1);
  const canvasRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [transPair, setTransPair] = useState('en-ru');
  const [isTranslating, setIsTranslating] = useState(false);

  const [extractedText, setExtractedText] = useState('');
  const [isExtracting, setIsExtracting] = useState(false);

  const [aiPrompt, setAiPrompt] = useState('');
  const [aiChat, setAiChat] = useState([]);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  const [qrText, setQrText] = useState('https://github.com/vladislavligorskij27-crypto');
  const [calcDisplay, setCalcDisplay] = useState('0');
  const [calcExpression, setCalcExpression] = useState('');

  const [savedUnits, setSavedUnits] = useState(() => {
    const saved = localStorage.getItem('omni_savedUnits');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    const visited = sessionStorage.getItem('omni_splash_done');
    if (!visited) {
      setShowSplash(true);
      sessionStorage.setItem('omni_splash_done', 'true');
      const timer = setTimeout(() => setShowSplash(false), 2800); // Чуть дольше для красоты
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const loadScript = (src) => {
      if (document.querySelector(`script[src="${src}"]`)) return;
      const script = document.createElement('script');
      script.src = src;
      script.async = true;
      document.head.appendChild(script);
    };
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
    loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }, []);

  useEffect(() => {
    setIsLoadingApi(true);
    const fetchFiat = fetch('https://api.nbrb.by/exrates/rates?periodicity=0')
      .then(res => res.json())
      .then(data => {
        const list = { BYN: { name: "Белорусский рубль", ratio: 1 } };
        data.forEach(item => {
          list[item.Cur_Abbreviation] = { name: `${item.Cur_Name} (${item.Cur_Abbreviation})`, ratio: item.Cur_OfficialRate / item.Cur_Scale };
        });
        setCurrencies(list);
      }).catch(() => {});

    const fetchCrypto = fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1')
      .then(res => res.json())
      .then(data => {
        const list = { USD: { name: "Доллар (USD)", ratio: 1 } };
        if (Array.isArray(data)) {
          data.forEach(coin => {
            list[coin.symbol.toUpperCase()] = { name: `${coin.name} (${coin.symbol.toUpperCase()})`, ratio: coin.current_price };
          });
        }
        setCryptos(list);
      }).catch(() => {});

    Promise.all([fetchFiat, fetchCrypto]).finally(() => setIsLoadingApi(false));
  }, []);

  useEffect(() => {
    localStorage.setItem('omni_theme', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  useEffect(() => {
    if (TOOL_TABS.includes(activeTab)) return;
    const units = activeTab === 'currency' ? currencies : activeTab === 'crypto' ? cryptos : (conversionData[activeTab]?.units || {});
    const keys = Object.keys(units);
    if (keys.length > 0) {
      if (savedUnits[activeTab] && keys.includes(savedUnits[activeTab].from) && keys.includes(savedUnits[activeTab].to)) {
        setFromUnit(savedUnits[activeTab].from);
        setToUnit(savedUnits[activeTab].to);
      } else {
        setFromUnit(keys[0]);
        setToUnit(keys[1] || keys[0]);
      }
    }
  }, [activeTab, currencies, cryptos]);

  useEffect(() => {
    if (TOOL_TABS.includes(activeTab) || !fromUnit || !toUnit) return;
    const val = parseFloat(inputValue);
    if (isNaN(val)) { setOutputValue(''); return; }

    const units = activeTab === 'currency' ? currencies : activeTab === 'crypto' ? cryptos : (conversionData[activeTab]?.units || {});
    if (!units[fromUnit] || !units[toUnit]) return;

    if (activeTab === 'temperature') {
      let c = fromUnit === 'celsius' ? val : fromUnit === 'fahrenheit' ? (val - 32) * 5/9 : val - 273.15;
      let res = toUnit === 'celsius' ? c : toUnit === 'fahrenheit' ? (c * 9/5) + 32 : c + 273.15;
      setOutputValue(Number(res.toPrecision(8)));
      return;
    }

    const res = (val * (units[fromUnit].ratio || 1)) / (units[toUnit].ratio || 1);
    const finalVal = activeTab === 'currency' || activeTab === 'crypto' ? res.toFixed(6).replace(/\.?0+$/, '') : Number(res.toPrecision(10));
    setOutputValue(finalVal);
  }, [inputValue, fromUnit, toUnit, activeTab, currencies, cryptos]);

  const handleCalcBtn = (val) => {
    if (val === 'C') { setCalcDisplay('0'); setCalcExpression(''); }
    else if (val === '=') {
      try {
        const cleanExpr = calcExpression.replace(/[^-()\d/*+.]/g, '');
        const result = new Function(`return (${cleanExpr})`)();
        setCalcDisplay(Number(result.toFixed(8)).toString());
        setCalcExpression(result.toString());
      } catch { setCalcDisplay('Ошибка'); setCalcExpression(''); }
    } else if (val === 'del') {
       const nextExpr = calcExpression.length > 1 ? calcExpression.slice(0, -1) : '';
       setCalcExpression(nextExpr);
       setCalcDisplay(nextExpr || '0');
    } else {
      const nextExpr = calcExpression === '0' ? val : calcExpression + val;
      setCalcExpression(nextExpr);
      setCalcDisplay(nextExpr);
    }
  };

  const handleTabChange = (key) => {
    if (key === activeTab) {
      setIsSidebarOpen(false);
      return;
    }
    setIsAnimating(true);
    setActiveTab(key);
    setIsSidebarOpen(false); 
    localStorage.setItem('omni_activeTab', key);
    setTimeout(() => setIsAnimating(false), 300);
  };

  const askAi = async () => {
    if (!aiPrompt.trim()) return;
    setAiChat(prev => [...prev, { role: 'user', text: aiPrompt }]);
    const currentInput = aiPrompt;
    setAiPrompt('');
    setIsAiLoading(true);

    try {
      const apiKey = "AIzaSyDTEtIzynncYxfjxIYfr2WU91mC6HpbHoY";
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Ты - Omni AI, помощник. Отвечай на русском языке кратко и профессионально. Пользователь: ${currentInput}` }] }]
        })
      });
      const result = await response.json();
      const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "Извините, запрос не обработан.";
      setAiChat(prev => [...prev, { role: 'ai', text: aiText }]);
    } catch {
      setAiChat(prev => [...prev, { role: 'ai', text: "Ошибка связи с ИИ." }]);
    } finally {
      setIsAiLoading(false);
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTranslate = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    const [langFrom, langTo] = transPair.split('-');
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(sourceText)}&langpair=${langFrom}|${langTo}`);
      const data = await response.json();
      setTranslatedText(data.responseData.translatedText);
    } catch { setTranslatedText("Ошибка перевода."); }
    finally { setIsTranslating(false); }
  };

  const handlePdfExtract = async (e) => {
    const file = e.target.files[0];
    if (!file || !window.pdfjsLib) return;
    setIsExtracting(true);
    try {
      const reader = new FileReader();
      reader.onload = async function() {
        const typedarray = new Uint8Array(this.result);
        const pdf = await window.pdfjsLib.getDocument(typedarray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map(item => item.str).join(' ') + "\n";
        }
        setExtractedText(text);
      };
      reader.readAsArrayBuffer(file);
    } catch { setExtractedText("Ошибка чтения PDF."); }
    finally { setIsExtracting(false); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        setImgWidth(img.width); setImgHeight(img.height);
        setOriginalAspect(img.width / img.height);
        setImagePreview(ev.target.result);
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const handleWidthChange = (val) => {
    setImgWidth(val);
    if (maintainAspect) setImgHeight(Math.round(val / originalAspect));
  };

  const handleHeightChange = (val) => {
    setImgHeight(val);
    if (maintainAspect) setImgWidth(Math.round(val * originalAspect));
  };

  const convertImage = (mode) => {
    if (!imagePreview || !canvasRef.current) return;
    const img = new Image();
    img.onload = () => {
      const c = canvasRef.current;
      c.width = imgWidth; c.height = imgHeight;
      const ctx = c.getContext('2d');
      if (imageFormat === 'image/jpeg') { ctx.fillStyle = '#FFF'; ctx.fillRect(0,0,c.width,c.height); }
      ctx.drawImage(img, 0, 0, imgWidth, imgHeight);
      if (mode === 'pdf' && window.jspdf) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF(imgWidth > imgHeight ? 'l' : 'p', 'px', [imgWidth, imgHeight]);
        pdf.addImage(c.toDataURL('image/jpeg'), 'JPEG', 0, 0, imgWidth, imgHeight);
        pdf.save("omni_converted.pdf");
      } else {
        const link = document.createElement('a');
        link.download = `omni_img.${imageFormat.split('/')[1].replace('x-icon', 'ico')}`;
        link.href = c.toDataURL(imageFormat, imgQuality);
        link.click();
      }
    };
    img.src = imagePreview;
  };

  const saveToDoc = (type) => {
    const content = extractedText || translatedText || sourceText;
    if (!content) return;
    if (type === 'pdf' && window.jspdf) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text(doc.splitTextToSize(content, 180), 10, 10);
      doc.save("omni_doc.pdf");
      return;
    }
    const blob = new Blob([content], { type: type === 'json' ? 'application/json' : 'text/plain' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `omni_doc.${type}`;
    link.click();
  };

  const currentTheme = conversionData[activeTab]?.theme || "from-violet-600 to-indigo-600";
  const currentShadow = conversionData[activeTab]?.shadow || "shadow-indigo-500/20";

  return (
    <div className={`${isDarkMode ? 'dark' : ''} min-h-screen font-sans selection:bg-blue-500/30 overflow-hidden transition-all duration-1000`}>
      {/* Background Aurora */}
      <div className="fixed inset-0 pointer-events-none transition-colors duration-1000 bg-slate-50 dark:bg-slate-950">
        <div className={`absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-20 animate-pulse bg-gradient-to-br ${currentTheme}`} />
        <div className={`absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[150px] opacity-15 animate-pulse delay-700 bg-gradient-to-tr ${currentTheme}`} />
      </div>

      {/* ПРЕМИУМ ЗАГРУЗОЧНЫЙ ЭКРАН (Splash) */}
      {showSplash && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950 transition-opacity duration-1000">
          {/* Фон с глубоким свечением */}
          <div className="absolute inset-0 overflow-hidden">
             <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] bg-gradient-to-br ${currentTheme} rounded-full blur-[180px] opacity-20 animate-pulse`} />
          </div>

          <div className="relative flex flex-col items-center">
            {/* Анимированный логотип */}
            <div className="relative mb-8 group">
              <div className={`absolute inset-0 bg-gradient-to-br ${currentTheme} blur-3xl opacity-40 group-hover:opacity-80 transition-opacity duration-1000 animate-pulse`} />
              <div className={`relative p-8 bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 shadow-2xl scale-110`}>
                <Sparkles size={64} className="text-white animate-spin [animation-duration:8s]" />
              </div>
            </div>
            
            {/* Текст приветствия */}
            <div className="text-center space-y-2 translate-y-4 animate-in fade-in slide-in-from-bottom-6 duration-1000">
              <h2 className="text-7xl font-black text-white tracking-tighter italic drop-shadow-2xl">OMNI</h2>
              <div className="flex items-center justify-center gap-3">
                 <div className="h-px w-8 bg-white/20" />
                 <p className="text-white/40 font-black tracking-[0.4em] uppercase text-[10px]">Universal Studio</p>
                 <div className="h-px w-8 bg-white/20" />
              </div>
            </div>

            {/* Блок разработчика (Влад) */}
            <div className="absolute bottom-[-140px] flex flex-col items-center opacity-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500 fill-mode-forwards">
               <div className="flex items-center gap-3 px-6 py-3 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-xl">
                  <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-indigo-500/50">
                     <img src="https://github.com/vladislavligorskij27-crypto.png" alt="Dev" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-[10px] text-white/40 font-bold leading-none uppercase tracking-widest mb-0.5">Разработчик</span>
                     <span className="text-xs text-white font-black italic tracking-tight">@vladislavligorskij27-crypto</span>
                  </div>
               </div>
               <div className="mt-6 flex gap-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 animate-bounce [animation-delay:-0.3s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 animate-bounce [animation-delay:-0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-white/10 animate-bounce" />
               </div>
            </div>
          </div>
        </div>
      )}

      {/* Модальное окно Инфо */}
      {showInfo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-md transition-opacity duration-500 px-4" onClick={() => setShowInfo(false)}>
          <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] shadow-2xl flex flex-col items-center gap-4 animate-in zoom-in duration-500 max-w-sm w-full border border-slate-200 dark:border-slate-800 relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowInfo(false)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <X size={20} />
            </button>
            
            <div className="text-center mt-2">
              <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tighter italic mb-1">О проекте</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium px-2 leading-relaxed">
                Универсальный набор инструментов OMNI.<br/>Всё под рукой в одном месте!
              </p>
            </div>

            <div className="mt-4 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-[2.5rem] w-full border border-slate-100 dark:border-slate-700/50 flex flex-col items-center">
              <p className="text-[10px] uppercase font-black tracking-widest text-slate-400 mb-5 text-center italic">Автор и разработчик</p>
              
              <a href="https://github.com/vladislavligorskij27-crypto" target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-4 group cursor-pointer outline-none w-full">
                <div className="relative">
                  <img 
                    src="https://github.com/vladislavligorskij27-crypto.png" 
                    alt="Developer Avatar" 
                    className="w-24 h-24 rounded-full shadow-lg group-hover:scale-105 group-hover:ring-4 ring-indigo-500/30 transition-all duration-300 object-cover" 
                  />
                  <div className="absolute -bottom-1 -right-1 p-2 bg-white dark:bg-slate-800 rounded-full shadow-md group-hover:bg-indigo-500 transition-colors duration-300">
                    <Github size={18} className="text-slate-800 dark:text-white group-hover:text-white transition-colors" />
                  </div>
                </div>
                
                <div className="text-center mt-2">
                  <span className="font-black text-lg text-slate-800 dark:text-white group-hover:text-indigo-500 transition-colors block leading-tight">
                    Vladislav Ligorskiy
                  </span>
                  <span className="text-[11px] text-slate-500 font-bold tracking-wide mt-1 block flex items-center justify-center gap-1.5">
                    @vladislavligorskij27-crypto <ExternalLink size={10} />
                  </span>
                </div>
              </a>
            </div>
            
            <button onClick={() => setShowInfo(false)} className="mt-2 w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl active:scale-95 transition-all text-sm uppercase tracking-widest">
              Закрыть
            </button>
          </div>
        </div>
      )}

      <div className="relative min-h-screen flex justify-center items-center p-0 sm:p-4">
        <div className="relative bg-white/70 dark:bg-slate-900/60 backdrop-blur-3xl sm:rounded-[2.5rem] shadow-2xl border border-white/50 dark:border-slate-800/50 w-full max-w-7xl flex flex-col lg:flex-row h-screen sm:h-full lg:h-[850px] overflow-hidden transition-all duration-700">
          
          {/* МОБИЛЬНАЯ ШАПКА */}
          <div className="lg:hidden flex items-center justify-between p-4 px-6 bg-white/30 dark:bg-slate-950/40 backdrop-blur-md border-b border-slate-200/50 dark:border-slate-800/50 relative z-30">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl bg-gradient-to-br ${currentTheme} shadow-md`}>
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-xl font-black text-slate-800 dark:text-white tracking-tighter italic">OMNI</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowInfo(true)} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300">
                <Info size={18} className="text-blue-500" />
              </button>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300">
                <Menu size={18} />
              </button>
            </div>
          </div>

          {/* ОВЕРЛЕЙ */}
          {isSidebarOpen && (
            <div className="absolute inset-0 z-40 bg-slate-900/40 backdrop-blur-sm lg:hidden" onClick={() => setIsSidebarOpen(false)} />
          )}

          {/* САЙДБАР */}
          <div className={`absolute lg:static inset-y-0 left-0 z-50 w-[280px] lg:w-72 bg-slate-50 dark:bg-slate-950 lg:bg-white/30 lg:dark:bg-slate-950/40 p-6 flex flex-col gap-1 border-r border-slate-200/50 dark:border-slate-800/40 overflow-y-auto custom-scrollbar transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full lg:translate-x-0'}`}>
            
            <div className="flex items-center justify-between mb-6 px-2">
              <div className="flex items-center gap-3 group">
                <div className={`hidden lg:flex p-2.5 rounded-2xl bg-gradient-to-br ${currentTheme} shadow-xl transition-all`}>
                  <Sparkles size={20} className="text-white" />
                </div>
                <h1 className="hidden lg:block text-xl font-black text-slate-800 dark:text-white tracking-tighter italic">OMNI</h1>
                <span className="lg:hidden text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] italic">Меню</span>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => setShowInfo(true)} className="hidden lg:block p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:rotate-12 transition-all">
                   <Info size={18} className="text-blue-500" />
                </button>
                <button onClick={() => setIsDarkMode(!isDarkMode)} className="p-2.5 rounded-xl bg-white dark:bg-slate-800 shadow-md border border-slate-200/50 dark:border-slate-700/50 text-slate-600 dark:text-slate-300 hover:rotate-12 transition-all">
                  {isDarkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-slate-500" />}
                </button>
                <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  <X size={18} />
                </button>
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-[0.2em] mb-3 ml-3 italic">Инструменты</p>
              
              <button onClick={() => handleTabChange('ai')} className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all ${activeTab === 'ai' ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
                <MessageSquare size={16} className={activeTab === 'ai' ? 'text-white' : 'text-violet-500'} />
                <span className="font-bold text-[13px]">Умный Чат</span>
              </button>

              <button onClick={() => handleTabChange('calc')} className={`group w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all ${activeTab === 'calc' ? 'bg-gradient-to-r from-slate-700 to-slate-900 text-white shadow-lg' : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
                <Calculator size={16} className={activeTab === 'calc' ? 'text-white' : 'text-slate-500'} />
                <span className="font-bold text-[13px]">Проф. Калькулятор</span>
              </button>

              <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-[0.2em] mt-6 mb-3 ml-3 italic">Величины</p>
              
              {Object.keys(conversionData).map(key => (
                <button key={key} onClick={() => handleTabChange(key)} className={`group w-full flex items-center justify-between px-4 py-3 rounded-2xl transition-all ${activeTab === key ? `bg-gradient-to-r ${conversionData[key].theme} text-white shadow-lg` : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
                  <div className="flex items-center gap-3.5">
                    <div className={activeTab === key ? 'text-white' : 'text-slate-400'}>{conversionData[key].icon}</div>
                    <span className="font-bold text-[13px]">{conversionData[key].title}</span>
                  </div>
                </button>
              ))}

              <p className="text-[9px] font-black uppercase text-slate-400 dark:text-slate-600 tracking-[0.2em] mt-6 mb-3 ml-3 italic">Студия</p>
              
              {[
                { id: 'image', icon: <ImageIcon size={16} />, title: "Image Studio", color: "text-purple-500", theme: "from-purple-600 to-fuchsia-500" },
                { id: 'translate', icon: <Languages size={16} />, title: "Translate PRO", color: "text-emerald-500", theme: "from-emerald-600 to-green-500" },
                { id: 'docs', icon: <FileSearch size={16} />, title: "Документы OCR", color: "text-orange-500", theme: "from-orange-600 to-amber-500" },
                { id: 'qr', icon: <QrCode size={16} />, title: "QR Генератор", color: "text-pink-500", theme: "from-pink-600 to-rose-500" }
              ].map(tool => (
                <button key={tool.id} onClick={() => handleTabChange(tool.id)} className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-2xl transition-all ${activeTab === tool.id ? `bg-gradient-to-r ${tool.theme} text-white shadow-lg` : 'text-slate-500 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800'}`}>
                  <div className={activeTab === tool.id ? 'text-white' : tool.color}>{tool.icon}</div>
                  <span className="font-bold text-[13px]">{tool.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* КОНТЕНТ */}
          <div className={`flex-1 p-6 lg:p-10 overflow-y-auto transition-all duration-500 ${isAnimating ? 'opacity-0 scale-98' : 'opacity-100 scale-100'} h-[calc(100%-73px)] lg:h-auto`}>
            
            {/* CALCULATOR */}
            {activeTab === 'calc' && (
              <div className="max-w-md mx-auto h-full flex flex-col items-center justify-center">
                 <div className="w-full bg-slate-900 rounded-[2.5rem] p-8 shadow-2xl border border-slate-800">
                    <div className="mb-6 text-right px-4 overflow-hidden">
                       <div className="text-slate-500 text-xs font-bold min-h-[1rem] mb-1 tracking-widest">{calcExpression}</div>
                       <div className="text-white text-5xl font-black break-all">{calcDisplay}</div>
                    </div>
                    <div className="grid grid-cols-4 gap-3">
                       {['C', 'del', '%', '/'].map(btn => (
                         <button key={btn} onClick={()=>handleCalcBtn(btn)} className="h-14 rounded-xl bg-slate-800 text-orange-400 font-black text-lg hover:bg-slate-700 active:scale-95 transition-all">{btn === 'del' ? <Delete size={20} className="mx-auto" /> : btn}</button>
                       ))}
                       {['7', '8', '9', '*'].map(btn => (
                         <button key={btn} onClick={()=>handleCalcBtn(btn)} className="h-14 rounded-xl bg-slate-800/50 text-white font-black text-xl hover:bg-slate-700 transition-all">{btn}</button>
                       ))}
                       {['4', '5', '6', '-'].map(btn => (
                         <button key={btn} onClick={()=>handleCalcBtn(btn)} className="h-14 rounded-xl bg-slate-800/50 text-white font-black text-xl hover:bg-slate-700 transition-all">{btn}</button>
                       ))}
                       {['1', '2', '3', '+'].map(btn => (
                         <button key={btn} onClick={()=>handleCalcBtn(btn)} className="h-14 rounded-xl bg-slate-800/50 text-white font-black text-xl hover:bg-slate-700 transition-all">{btn}</button>
                       ))}
                       <button onClick={()=>handleCalcBtn('0')} className="col-span-2 h-14 rounded-xl bg-slate-800/50 text-white font-black text-xl hover:bg-slate-700 transition-all">0</button>
                       <button onClick={()=>handleCalcBtn('.')} className="h-14 rounded-xl bg-slate-800/50 text-white font-black text-xl hover:bg-slate-700 transition-all">.</button>
                       <button onClick={()=>handleCalcBtn('=')} className="h-14 rounded-xl bg-blue-600 text-white font-black text-2xl hover:bg-blue-500 shadow-xl transition-all">=</button>
                    </div>
                 </div>
              </div>
            )}

            {/* AI CHAT */}
            {activeTab === 'ai' && (
              <div className="max-w-4xl mx-auto h-full flex flex-col">
                <div className="mb-6"><h2 className="text-4xl font-black text-slate-800 dark:text-white tracking-tighter mb-1 italic">Умный Чат <span className="text-violet-500">Assistant</span></h2><p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest italic">Powered by Gemini 2.5</p></div>
                <div className="flex-1 bg-white/40 dark:bg-slate-950/40 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 mb-6 overflow-y-auto custom-scrollbar space-y-4">
                  {aiChat.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40"><MessageSquare size={60} className="mb-4 text-violet-500" /><p className="text-xl font-black text-slate-500 italic">Начните диалог...</p></div>
                  ) : (
                    aiChat.map((msg, i) => (
                      <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-5 rounded-2xl font-bold ${msg.role === 'user' ? 'bg-violet-600 text-white rounded-tr-none' : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700 shadow-sm'}`}>
                          {msg.text}
                        </div>
                      </div>
                    ))
                  )}
                  {isAiLoading && <div className="flex justify-start"><div className="bg-slate-100 dark:bg-slate-800 p-5 rounded-2xl animate-pulse flex gap-2"><div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce" /><div className="w-2 h-2 bg-violet-500 rounded-full animate-bounce [animation-delay:0.2s]" /></div></div>}
                  <div ref={chatEndRef} />
                </div>
                <div className="relative"><input type="text" value={aiPrompt} onChange={(e) => setAiPrompt(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && askAi()} placeholder="Задайте вопрос..." className="w-full bg-white dark:bg-slate-800 p-6 pr-20 rounded-[1.5rem] font-bold text-lg shadow-xl outline-none dark:text-white" /><button onClick={askAi} className="absolute right-3 top-1/2 -translate-y-1/2 bg-violet-600 text-white p-3.5 rounded-xl transition-all shadow-lg"><Send size={20} /></button></div>
              </div>
            )}

            {/* КОНВЕРТЕР ВЕЛИЧИН */}
            {!TOOL_TABS.includes(activeTab) && (
              <div className="max-w-4xl mx-auto w-full">
                <header className="mb-8 text-center lg:text-left">
                  <h2 className="text-5xl lg:text-6xl font-black text-slate-800 dark:text-white leading-tight tracking-tighter uppercase italic underline decoration-white/10 decoration-4 underline-offset-[1rem]">
                    {conversionData[activeTab]?.title}
                  </h2>
                </header>

                <div className="grid gap-6 relative">
                  {/* ИЗ */}
                  <div className="group bg-white/40 dark:bg-slate-800/40 p-8 lg:p-10 rounded-[2.5rem] border border-white dark:border-slate-700/50 shadow-sm transition-all focus-within:bg-white dark:focus-within:bg-slate-800">
                    <div className="flex flex-col xl:flex-row items-center gap-6 xl:gap-10">
                      <input 
                        type="number" 
                        value={inputValue} 
                        onChange={(e) => setInputValue(e.target.value)} 
                        className="text-5xl lg:text-7xl font-black text-slate-800 dark:text-white bg-transparent outline-none w-full placeholder-slate-200" 
                      />
                      <div className="relative w-full xl:w-[350px] shrink-0">
                        <select 
                          value={fromUnit} 
                          onChange={(e) => setFromUnit(e.target.value)} 
                          className="w-full bg-slate-100 dark:bg-slate-900/80 p-5 pr-14 rounded-2xl font-black text-lg lg:text-xl text-slate-700 dark:text-slate-200 border-none appearance-none cursor-pointer"
                        >
                          {Object.keys(activeTab === 'currency' ? currencies : activeTab === 'crypto' ? cryptos : (conversionData[activeTab]?.units || {})).map(k => (
                            <option key={k} value={k}>{(activeTab === 'currency' ? currencies : activeTab === 'crypto' ? cryptos : (conversionData[activeTab]?.units || {}))[k]?.name}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={24} />
                      </div>
                    </div>
                  </div>

                  {/* КНОПКА РЕВЕРСА */}
                  <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
                    <button onClick={() => { const t = fromUnit; setFromUnit(toUnit); setToUnit(t); }} className="bg-slate-950 dark:bg-white text-white dark:text-slate-900 p-6 rounded-2xl shadow-2xl hover:rotate-180 transition-all duration-500 border-[8px] border-slate-50 dark:border-slate-950">
                      <ArrowRightLeft size={28} />
                    </button>
                  </div>

                  {/* В (РЕЗУЛЬТАТ) */}
                  <div className={`bg-gradient-to-br ${currentTheme} p-8 lg:p-10 rounded-[2.5rem] text-white shadow-2xl ${currentShadow} group relative overflow-hidden`}>
                    <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-white/10 blur-[100px] -mr-40 -mt-40 rounded-full" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                      <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-60">Результат</span>
                      <button onClick={() => { navigator.clipboard.writeText(outputValue); setCopied(true); setTimeout(()=>setCopied(false),1500); }} className="px-6 py-3 bg-white/20 backdrop-blur-xl rounded-2xl font-black text-[10px] uppercase shadow-xl hover:bg-white/30 transition-all">
                        {copied ? 'ГОТОВО' : 'КОПИРОВАТЬ'}
                      </button>
                    </div>
                    <div className="flex flex-col xl:flex-row gap-6 xl:gap-10 items-center relative z-10">
                      <div className="text-5xl lg:text-7xl font-black w-full overflow-x-auto break-all scrollbar-hide py-2">
                        {outputValue || '0'}
                      </div>
                      <div className="relative w-full xl:w-[350px] shrink-0">
                        <select value={toUnit} onChange={(e) => setToUnit(e.target.value)} className="w-full bg-white/10 backdrop-blur-2xl p-5 pr-14 rounded-2xl font-black text-lg lg:text-xl text-white border-none appearance-none cursor-pointer">
                          {Object.keys(activeTab === 'currency' ? currencies : activeTab === 'crypto' ? cryptos : (conversionData[activeTab]?.units || {})).map(k => (
                            <option key={k} value={k} className="text-slate-800">{(activeTab === 'currency' ? currencies : activeTab === 'crypto' ? cryptos : (conversionData[activeTab]?.units || {}))[k]?.name}</option>
                          ))}
                        </select>
                        <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-white/50 pointer-events-none" size={24} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TRANSLATE PRO */}
            {activeTab === 'translate' && (
              <div className="max-w-5xl mx-auto w-full">
                <h2 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white mb-8 tracking-tight flex items-center gap-4 lg:gap-6 italic">
                   Translate <span className="text-emerald-500 underline decoration-4 underline-offset-8">PRO</span>
                </h2>
                <div className="grid gap-8">
                  <div className="bg-white/40 dark:bg-slate-800/40 p-6 lg:p-8 rounded-[2.5rem] border border-white dark:border-slate-700 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
                      <select value={transPair} onChange={(e) => setTransPair(e.target.value)} className="w-full sm:w-auto min-w-[280px] bg-slate-100 dark:bg-slate-900 font-black p-4 pr-10 rounded-xl text-slate-700 dark:text-slate-200 border-none shadow-inner appearance-none text-base">
                        {Object.entries(languages).map(([id, name]) => (<option key={id} value={id}>{name}</option>))}
                      </select>
                      <button onClick={handleTranslate} disabled={isTranslating} className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black flex items-center justify-center gap-4 shadow-xl active:scale-95 transition-all text-base">
                        {isTranslating ? <RefreshCw className="animate-spin" /> : <Sparkles size={20} />} Перевести
                      </button>
                    </div>
                    <textarea value={sourceText} onChange={(e) => setSourceText(e.target.value)} placeholder="Начните вводить текст..." className="w-full h-64 bg-transparent p-4 rounded-2xl outline-none font-black text-2xl lg:text-3xl resize-none dark:text-slate-100 placeholder:text-slate-200" />
                  </div>
                  <div className="bg-emerald-600 p-8 lg:p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
                     <div className="flex justify-between items-center mb-6 relative z-10"><span className="text-[10px] font-black uppercase opacity-60 italic">Результат</span><button onClick={() => { navigator.clipboard.writeText(translatedText); setCopied(true); setTimeout(()=>setCopied(false),1500); }} className="px-6 py-3 bg-white/20 rounded-xl font-black text-[10px] uppercase backdrop-blur-xl border border-white/20">{copied ? 'ГОТОВО' : 'КОПИРОВАТЬ'}</button></div>
                     <div className="w-full min-h-[200px] text-2xl lg:text-4xl font-black leading-snug whitespace-pre-wrap relative z-10 drop-shadow-lg italic">
                        {translatedText || (isTranslating ? "Нейросеть думает..." : "Готов...")}
                     </div>
                  </div>
                </div>
              </div>
            )}

            {/* ДОКУМЕНТЫ OCR */}
            {activeTab === 'docs' && (
              <div className="max-w-6xl mx-auto w-full animate-in fade-in">
                <header className="mb-10"><h2 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white flex items-center gap-4 lg:gap-8 italic">Документы <span className="text-orange-500 underline decoration-4 underline-offset-8">OCR</span></h2></header>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                  <div className="xl:col-span-2 bg-white/40 dark:bg-slate-800/40 p-8 lg:p-12 rounded-[3.5rem] border-8 border-dashed border-orange-200 dark:border-orange-900/40 flex flex-col items-center justify-center text-center transition-all hover:bg-white dark:hover:bg-slate-800 group">
                    <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"><FileText size={48} className="text-orange-600" /></div>
                    <h3 className="text-2xl lg:text-3xl font-black mb-4 dark:text-white tracking-tighter uppercase italic">DEEP SCAN</h3>
                    <label className="bg-orange-600 text-white px-8 lg:px-12 py-5 rounded-[2rem] font-black cursor-pointer hover:bg-orange-500 shadow-2xl active:scale-95 text-lg lg:text-xl uppercase text-center block">ВЫБРАТЬ ФАЙЛ<input type="file" accept=".pdf" className="hidden" onChange={handlePdfExtract} /></label>
                  </div>
                  <div className="bg-slate-950 p-8 lg:p-10 rounded-[3.5rem] flex flex-col justify-between text-white shadow-2xl border border-white/5">
                    <div>
                      <h3 className="text-xl font-black mb-8 italic uppercase border-b border-white/10 pb-4 tracking-widest text-orange-400">Экспорт</h3>
                      <div className="grid grid-cols-1 gap-4">
                        {[{ id: 'pdf', n: 'PDF Document', i: <FileText className="text-rose-400" /> }, { id: 'txt', n: 'Текстовый файл', i: <FileText className="text-blue-400" /> }, { id: 'md', n: 'Markdown', i: <FileCode className="text-emerald-400" /> }, { id: 'json', n: 'JSON Struct', i: <FileJson className="text-amber-400" /> }].map(t => (
                          <button key={t.id} onClick={() => saveToDoc(t.id)} className="flex items-center justify-between p-6 bg-white/5 rounded-2xl hover:bg-white/10 border border-white/5 transition-all group active:scale-95"><div className="flex items-center gap-4"><div className="group-hover:scale-125 transition-transform">{t.i}</div><div className="font-black text-sm">{t.n}</div></div><Download size={18} className="opacity-20" /></button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white/60 dark:bg-slate-800/40 p-6 lg:p-10 rounded-[3.5rem] border border-slate-200 dark:border-slate-800 shadow-inner">
                  <div className="w-full min-h-[400px] bg-slate-950/20 p-6 lg:p-10 rounded-[2rem] font-mono text-base lg:text-lg leading-relaxed dark:text-slate-100 overflow-y-auto max-h-[600px] border border-white/5 shadow-inner">
                    {isExtracting ? (
                      <div className="flex flex-col items-center justify-center h-full gap-8 py-20 opacity-50"><div className="w-20 h-20 border-[8px] border-orange-500/20 border-t-orange-500 rounded-full animate-spin shadow-2xl" /><p className="font-black text-slate-500 uppercase tracking-[0.3em] animate-pulse italic text-lg text-center">Декодирование...</p></div>
                    ) : (extractedText || "Рабочая область пуста...")}
                  </div>
                </div>
              </div>
            )}

            {/* QR ГЕНЕРАТОР */}
            {activeTab === 'qr' && (
               <div className="max-w-4xl mx-auto w-full h-full flex flex-col items-center justify-center animate-in fade-in">
                  <header className="mb-10 text-center">
                     <h2 className="text-4xl lg:text-5xl font-black text-slate-800 dark:text-white flex items-center justify-center gap-6 italic underline decoration-pink-500/20 decoration-4 underline-offset-4">
                        QR Studio
                     </h2>
                  </header>
                  <div className="w-full grid lg:grid-cols-2 gap-10 items-center">
                     <div className="space-y-6">
                        <div className="bg-white/40 dark:bg-slate-800/40 p-8 rounded-[2rem] border border-white dark:border-slate-700 shadow-sm focus-within:shadow-xl transition-all">
                           <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-4 italic">Ваш текст или ссылка</label>
                           <textarea value={qrText} onChange={(e) => setQrText(e.target.value)} className="w-full h-40 bg-transparent outline-none font-black text-xl text-slate-800 dark:text-white resize-none" placeholder="Введите ссылку..." />
                        </div>
                     </div>
                     <div className="flex flex-col items-center gap-8">
                        <div className="p-8 bg-white rounded-[3rem] shadow-2xl border-[10px] border-slate-100 dark:border-slate-800 transition-transform duration-500 hover:scale-105">
                           <img src={`https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(qrText)}`} alt="QR" className="w-56 h-56 rounded-xl" />
                        </div>
                        <button onClick={() => window.open(`https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(qrText)}`)} className="bg-pink-600 text-white px-8 lg:px-12 py-5 rounded-2xl font-black text-lg lg:text-xl shadow-xl transition-all active:scale-95 flex items-center gap-4">
                           <Download size={24} /> СКАЧАТЬ В HQ
                        </button>
                     </div>
                  </div>
               </div>
            )}

            {/* IMAGE STUDIO */}
            {activeTab === 'image' && (
              <div className="max-w-6xl mx-auto w-full animate-in zoom-in-95">
                <h2 className="text-4xl lg:text-6xl font-black text-slate-800 dark:text-white mb-10 tracking-tighter flex items-center gap-4 lg:gap-8 italic">
                   Image <span className="text-purple-500">Studio</span>
                </h2>
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">
                  <div className={`bg-white/40 dark:bg-slate-800/40 p-8 lg:p-12 rounded-[4rem] border-[10px] border-dashed transition-all duration-1000 flex flex-col items-center justify-center text-center group ${isDragging ? 'border-purple-500 bg-purple-50/50' : 'border-slate-200 dark:border-slate-800'}`} onDragOver={(e)=>{e.preventDefault(); setIsDragging(true)}} onDragLeave={()=>setIsDragging(false)} onDrop={(e)=>{e.preventDefault(); setIsDragging(false); const f=e.dataTransfer.files[0]; if(f)handleImageUpload({target:{files:[f]}})}} >
                    {!imagePreview ? (
                      <><div className="w-32 h-32 bg-purple-100 dark:bg-purple-900/30 rounded-3xl flex items-center justify-center mb-8 shadow-2xl"><UploadCloud size={64} className="text-purple-600" /></div><h3 className="text-3xl lg:text-4xl font-black mb-4 dark:text-white uppercase tracking-tighter italic">ЗАГРУЗИТЬ</h3><label className="bg-purple-600 text-white px-10 lg:px-14 py-6 rounded-2xl font-black cursor-pointer hover:bg-purple-500 shadow-2xl active:scale-95 text-lg lg:text-xl uppercase block w-full text-center sm:w-auto">ВЫБРАТЬ ФОТО<input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} /></label></>
                    ) : (
                      <div className="relative w-full group animate-in duration-700">
                        <img src={imagePreview} alt="P" className="w-full h-[300px] lg:h-[500px] object-contain rounded-[3rem] mb-10 shadow-2xl" />
                        <button onClick={()=>setImagePreview(null)} className="absolute top-4 right-4 lg:top-8 lg:right-8 bg-red-500 text-white p-4 rounded-2xl shadow-2xl hover:scale-110 active:rotate-180 border-4 border-white dark:border-slate-800 transition-all">✕</button>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col gap-8">
                    <div className="bg-white/40 dark:bg-slate-800/40 p-8 lg:p-10 rounded-[3.5rem] space-y-8 border border-white dark:border-slate-700 shadow-sm">
                      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 px-4 font-black text-xs uppercase text-slate-400 italic"><span>Размеры холста</span><button onClick={()=>setMaintainAspect(!maintainAspect)} className={`px-5 py-2 rounded-full border-[3px] transition-all ${maintainAspect ? 'bg-blue-600 border-blue-600 text-white' : 'text-slate-400 border-slate-200'}`}>{maintainAspect ? 'ЗАМОК ВКЛ' : 'СВОБОДНО'}</button></div>
                      <div className="grid grid-cols-2 gap-4 lg:gap-8">
                        <div className="space-y-4 text-center"><label className="text-[10px] font-black text-slate-400 uppercase italic">Ширина (px)</label><input type="number" value={imgWidth} onChange={(e)=>handleWidthChange(parseInt(e.target.value)||0)} className="w-full bg-slate-100/50 dark:bg-slate-900/50 p-4 lg:p-6 rounded-2xl font-black outline-none text-2xl lg:text-3xl shadow-inner text-center focus:ring-8 ring-purple-500/10 dark:text-white" /></div>
                        <div className="space-y-4 text-center"><label className="text-[10px] font-black text-slate-400 uppercase italic">Высота (px)</label><input type="number" value={imgHeight} onChange={(e)=>handleHeightChange(parseInt(e.target.value)||0)} className="w-full bg-slate-100/50 dark:bg-slate-900/50 p-4 lg:p-6 rounded-2xl font-black outline-none text-2xl lg:text-3xl shadow-inner text-center focus:ring-8 ring-purple-500/10 dark:text-white" /></div>
                      </div>
                    </div>
                    <div className="bg-white/40 dark:bg-slate-800/40 p-8 lg:p-10 rounded-[3.5rem] space-y-8 border border-white dark:border-slate-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4"><span className="text-[10px] font-black uppercase text-slate-400 pl-4 block italic">Формат</span><div className="relative"><select value={imageFormat} onChange={(e)=>setImageFormat(e.target.value)} className="w-full bg-slate-100 dark:bg-slate-900/80 p-5 pr-12 rounded-2xl font-black outline-none text-xl dark:text-white border-none appearance-none cursor-pointer shadow-sm"><option value="image/jpeg">JPEG</option><option value="image/webp">WEBP</option><option value="image/png">PNG</option><option value="image/gif">GIF</option><option value="image/bmp">BMP</option><option value="image/x-icon">ICO</option></select><ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" size={20} /></div></div>
                        <div className="space-y-4"><span className="text-[10px] font-black text-slate-400 uppercase pl-4 block italic">Качество: {Math.round(imgQuality*100)}%</span><div className="px-4 py-6"><input type="range" min="0.1" max="1" step="0.05" value={imgQuality} onChange={(e)=>setImgQuality(parseFloat(e.target.value))} className="accent-purple-600 h-3 w-full cursor-grab active:cursor-grabbing scale-125" /></div></div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:gap-8 pt-6">
                      <button onClick={()=>convertImage('img')} disabled={!imagePreview} className={`py-6 lg:py-8 rounded-[2.5rem] font-black text-xl lg:text-2xl transition-all duration-700 flex items-center justify-center gap-4 lg:gap-6 ${imagePreview ? 'bg-purple-600 text-white shadow-2xl hover:scale-105 active:scale-95' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}><Download size={32} /> СКАЧАТЬ</button>
                      <button onClick={()=>convertImage('pdf')} disabled={!imagePreview} className={`py-6 lg:py-8 rounded-[2.5rem] font-black text-xl lg:text-2xl transition-all duration-700 flex items-center justify-center gap-4 lg:gap-6 ${imagePreview ? 'bg-slate-950 dark:bg-indigo-600 text-white shadow-2xl hover:scale-105 active:scale-95' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'}`}><FileText size={32} /> В PDF</button>
                    </div>
                  </div>
                </div>
                <canvas ref={canvasRef} className="hidden" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .dark .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); }
        input::-webkit-outer-spin-button, input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
        input[type=number] { -moz-appearance: textfield; }
        select { background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='gray'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 1.2rem center; background-size: 1.2rem; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
