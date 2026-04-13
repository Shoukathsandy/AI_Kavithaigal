import { useState, useRef, useCallback } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import {
  Download, Palette, Type, Layout, Sparkles, ChevronLeft,
  Image as ImageIcon, Share2, Smartphone,
  AlignCenter, AlignLeft, AlignRight, Bold, Italic, Layers,
  Check, X, Loader2, Music, Play, Pause, Video
} from "lucide-react";

// ═══════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════

const THEMES = [
  { id:"midnight",  name:"Midnight",  stops:[[0,"#080818"],[.35,"#1a0e30"],[.7,"#0d1528"],[1,"#06080f"]],  text:"#ddd6ff", accent:"#8b7aff", glow:"#6c5ce7", dTop:"✦ ━━━━━━━━━━━ ✦",  dBot:"✦ ━━━━━━━━━━━ ✦" },
  { id:"rose",      name:"Rose",      stops:[[0,"#180808"],[.4,"#2a0e0e"],[.8,"#1a0808"],[1,"#100505"]],  text:"#ffd6d6", accent:"#ff4466", glow:"#e94560", dTop:"♡ ──────── ♡",      dBot:"♡ ──────── ♡" },
  { id:"ocean",     name:"Ocean",     stops:[[0,"#040e18"],[.5,"#081e38"],[1,"#040a14"]],                   text:"#c0e4ff", accent:"#00aaff", glow:"#0088cc", dTop:"〰 ═══════════ 〰",  dBot:"〰 ═══════════ 〰" },
  { id:"gold",      name:"Gold",      stops:[[0,"#0c0a02"],[.4,"#1a1504"],[.8,"#100e02"],[1,"#080700"]],  text:"#fff0b8", accent:"#ffcc00", glow:"#daa520", dTop:"❖ ═══════════ ❖",  dBot:"❖ ═══════════ ❖" },
  { id:"emerald",   name:"Emerald",   stops:[[0,"#020e08"],[.5,"#0a1e14"],[1,"#020a06"]],                   text:"#c0ffd4", accent:"#00e070", glow:"#00b359", dTop:"✧ ──────── ✧",      dBot:"✧ ──────── ✧" },
  { id:"neon",      name:"Neon",      stops:[[0,"#0e0018"],[.5,"#1a0030"],[1,"#0a0014"]],                   text:"#ffb0ea", accent:"#ff00cc", glow:"#cc00a3", dTop:"◆ ━━━━━━━━━━━ ◆",  dBot:"◆ ━━━━━━━━━━━ ◆" },
  { id:"amber",     name:"Amber",     stops:[[0,"#100800"],[.5,"#1e1208"],[1,"#0e0800"]],                   text:"#ffe4c0", accent:"#ff8800", glow:"#cc6e00", dTop:"◇ ═══════════ ◇",  dBot:"◇ ═══════════ ◇" },
  { id:"frost",     name:"Frost",     stops:[[0,"#0a0e14"],[.5,"#121824"],[1,"#080c12"]],                   text:"#d4e8f8", accent:"#88bbee", glow:"#6699cc", dTop:"❅ ──────── ❅",      dBot:"❅ ──────── ❅" },
  { id:"crimson",   name:"Crimson",   stops:[[0,"#0f0404"],[.4,"#200808"],[.8,"#150505"],[1,"#0a0202"]],  text:"#ffcccc", accent:"#cc2244", glow:"#991133", dTop:"⬥ ━━━━━━━━━━━ ⬥",  dBot:"⬥ ━━━━━━━━━━━ ⬥" },
  { id:"violet",    name:"Violet",    stops:[[0,"#0a0414"],[.5,"#180a28"],[1,"#08030f"]],                   text:"#e8ccff", accent:"#aa66ff", glow:"#8844dd", dTop:"❋ ──────── ❋",      dBot:"❋ ──────── ❋" },
];

const SIZE_GROUPS = {
  instagram: [
    { id:"ig-post",  name:"Post",      w:1080, h:1080, icon:"⬜" },
    { id:"ig-reel",  name:"Reel",      w:1080, h:1920, icon:"📱" },
    { id:"ig-story", name:"Story",     w:1080, h:1920, icon:"📲" },
    { id:"ig-land",  name:"Landscape", w:1080, h:566,  icon:"🖼" },
    { id:"ig-port",  name:"Portrait",  w:1080, h:1350, icon:"📷" },
  ],
  other: [
    { id:"fb-post",  name:"Facebook",  w:1200, h:630,  icon:"📘" },
    { id:"x-post",   name:"X/Twitter", w:1600, h:900,  icon:"🐦" },
    { id:"yt-thumb",  name:"YouTube",  w:1280, h:720,  icon:"▶️" },
    { id:"wa-status", name:"WhatsApp", w:1080, h:1920, icon:"💬" },
    { id:"li-post",  name:"LinkedIn",  w:1200, h:627,  icon:"💼" },
    { id:"pin",      name:"Pinterest", w:1000, h:1500, icon:"📌" },
  ],
};
const ALL_SIZES = [...SIZE_GROUPS.instagram, ...SIZE_GROUPS.other];

const FONTS = [
  { id:"tamil",    name:"Tamil Classic",    css:"'Noto Sans Tamil', 'Tamil Sangam MN', serif" },
  { id:"serif",    name:"Elegant Serif",    css:"'Cormorant Garamond', 'Georgia', serif" },
  { id:"display",  name:"Display",          css:"'Playfair Display', Georgia, serif" },
  { id:"sans",     name:"Modern Sans",      css:"'DM Sans', system-ui, sans-serif" },
  { id:"mono",     name:"Monospace",        css:"'Courier New', monospace" },
];

const FRAMES = [
  { id:"corners", name:"Corner Accents" },
  { id:"full",    name:"Full Border" },
  { id:"double",  name:"Double Line" },
  { id:"minimal", name:"Minimal" },
  { id:"none",    name:"No Frame" },
];

// ─── FREE MUSIC TRACKS (royalty-free) ──────────────────────────
const MUSIC_TRACKS = [
  // Trending
  { id:"tr1", name:"Viral Kuthu",      genre:"trending",  bpm:138, url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id:"tr2", name:"Reel Anthem",      genre:"trending",  bpm:128, url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3" },
  { id:"tr3", name:"Instagram Beats",  genre:"trending",  bpm:122, url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3" },
  { id:"tr4", name:"Viral Trend Mix",  genre:"trending",  bpm:130, url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3" },
  // Romantic
  { id:"ro1", name:"காதல் மழை",        genre:"romantic",  bpm:70,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
  { id:"ro2", name:"Love Strings",     genre:"romantic",  bpm:75,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3" },
  { id:"ro3", name:"Soft Piano",       genre:"romantic",  bpm:68,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3" },
  { id:"ro4", name:"Nila Kaadhal",     genre:"romantic",  bpm:72,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3" },
  // Lofi
  { id:"lo1", name:"Chill Lofi",       genre:"lofi",      bpm:82,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" },
  { id:"lo2", name:"Night Vibes",      genre:"lofi",      bpm:78,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3" },
  { id:"lo3", name:"Dream Beats",      genre:"lofi",      bpm:85,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3" },
  // Beats
  { id:"be1", name:"Power Punch",      genre:"beats",     bpm:145, url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id:"be2", name:"Tamil Kuthu",      genre:"beats",     bpm:150, url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3" },
  { id:"be3", name:"Dance Mix",        genre:"beats",     bpm:142, url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3" },
  // Classical
  { id:"cl1", name:"Carnatic Flow",    genre:"classical", bpm:60,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3" },
  { id:"cl2", name:"Veenai Strings",   genre:"classical", bpm:55,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3" },
  { id:"cl3", name:"Flute Raga",       genre:"classical", bpm:58,  url:"https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3" },
];

const MUSIC_GENRES = [
  { id:"all",       label:"All",       emoji:"🎵" },
  { id:"trending",  label:"Trending",  emoji:"🔥" },
  { id:"romantic",  label:"Romantic",  emoji:"💕" },
  { id:"lofi",      label:"Lofi",      emoji:"🌙" },
  { id:"beats",     label:"Beats",     emoji:"🥁" },
  { id:"classical", label:"Classical", emoji:"🎻" },
];

// ───────────────────────────────────────────────────────────────

const rgba = (hex, a) => {
  const r=parseInt(hex.slice(1,3),16), g=parseInt(hex.slice(3,5),16), b=parseInt(hex.slice(5,7),16);
  return `rgba(${r},${g},${b},${a})`;
};

// ═══════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function AIKavithaigalStudio() {
  const [heading, setHeading]         = useState("காதல் கவிதை");
  const [kavithai, setKavithai]       = useState("உன் கண்கள் பேசும்\nமொழி எனக்கு மட்டும்\nபுரியும் ரகசியம்...");
  const [author, setAuthor]           = useState("@shoukathsandy");
  const [showBrand, setShowBrand]     = useState(true);
  const [themeIdx, setThemeIdx]       = useState(0);
  const [sizeIdx, setSizeIdx]         = useState(0);
  const [fontSize, setFontSize]       = useState(28);
  const [headingSize, setHeadingSize] = useState(20);
  const [fontIdx, setFontIdx]         = useState(0);
  const [fontStyle, setFontStyle]     = useState("italic");
  const [textAlign, setTextAlign]     = useState("center");
  const [frameIdx, setFrameIdx]       = useState(0);
  const [lineSpacing, setLineSpacing] = useState(1.75);
  const [showParticles, setShowParticles] = useState(true);
  const [glowIntensity, setGlowIntensity] = useState(22);
  const [dlStatus, setDlStatus]       = useState(""); // "" | "loading" | "done" | "error"

  // Music state
  const [musicIdx, setMusicIdx]       = useState(-1);   // -1 = none selected
  const [genreFilter, setGenreFilter] = useState("all");
  const [playingIdx, setPlayingIdx]   = useState(-1);   // currently previewing
  const [reelStatus, setReelStatus]   = useState("");   // "" | "creating" | "done" | "error"

  const canvasRef = useRef(null);
  const audioRef  = useRef(null);  // HTMLAudioElement for preview

  const theme = THEMES[themeIdx];
  const size  = ALL_SIZES[sizeIdx];
  const font  = FONTS[fontIdx];
  const frame = FRAMES[frameIdx];

  // ─── CANVAS RENDER ────────────────────────────────────────
  const renderCanvas = useCallback(() => {
    const c = canvasRef.current;
    const ctx = c.getContext("2d");
    const W = size.w, H = size.h;
    c.width = W; c.height = H;

    // BG
    const bg = ctx.createLinearGradient(0,0,W*.4,H);
    theme.stops.forEach(([p,col]) => bg.addColorStop(p,col));
    ctx.fillStyle = bg; ctx.fillRect(0,0,W,H);

    // Particles
    if (showParticles) {
      for (let i=0;i<70;i++){
        ctx.fillStyle = rgba(theme.accent, .02+Math.random()*.06);
        ctx.beginPath(); ctx.arc(Math.random()*W, Math.random()*H, Math.random()*3+.5, 0, Math.PI*2); ctx.fill();
      }
    }

    // Glow
    const gl = ctx.createRadialGradient(W/2,H*.45,0,W/2,H*.45,W*.55);
    gl.addColorStop(0, rgba(theme.glow,.07)); gl.addColorStop(1,"transparent");
    ctx.fillStyle=gl; ctx.fillRect(0,0,W,H);

    // Vignette
    const vig = ctx.createRadialGradient(W/2,H/2,W*.3,W/2,H/2,W*.9);
    vig.addColorStop(0,"transparent"); vig.addColorStop(1,"rgba(0,0,0,0.3)");
    ctx.fillStyle=vig; ctx.fillRect(0,0,W,H);

    // Frame
    const M = Math.round(W*.042);
    ctx.lineCap = "round";
    if (frame.id==="corners") {
      const cl=Math.round(W*.035);
      ctx.strokeStyle=rgba(theme.accent,.45); ctx.lineWidth=2.5;
      [[M,M,1,1],[W-M,M,-1,1],[M,H-M,1,-1],[W-M,H-M,-1,-1]].forEach(([x,y,dx,dy])=>{
        ctx.beginPath(); ctx.moveTo(x,y+dy*cl); ctx.lineTo(x,y); ctx.lineTo(x+dx*cl,y); ctx.stroke();
      });
      ctx.strokeStyle=rgba(theme.accent,.12); ctx.lineWidth=1;
      ctx.strokeRect(M,M,W-M*2,H-M*2);
    } else if (frame.id==="full") {
      ctx.strokeStyle=rgba(theme.accent,.35); ctx.lineWidth=3;
      ctx.strokeRect(M,M,W-M*2,H-M*2);
    } else if (frame.id==="double") {
      ctx.strokeStyle=rgba(theme.accent,.25); ctx.lineWidth=1.5;
      ctx.strokeRect(M,M,W-M*2,H-M*2);
      ctx.strokeRect(M+8,M+8,W-M*2-16,H-M*2-16);
    } else if (frame.id==="minimal") {
      ctx.strokeStyle=rgba(theme.accent,.2); ctx.lineWidth=1;
      const lw=W*.15;
      ctx.beginPath(); ctx.moveTo(W/2-lw,M); ctx.lineTo(W/2+lw,M); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(W/2-lw,H-M); ctx.lineTo(W/2+lw,H-M); ctx.stroke();
    }

    const sc=W/360, sf=fontSize*sc, hf=headingSize*sc;

    // Brand
    if (showBrand) {
      ctx.fillStyle=rgba(theme.accent,.85);
      ctx.font=`800 ${sf*.38}px 'DM Sans', system-ui, sans-serif`;
      ctx.textAlign="center"; ctx.textBaseline="middle";
      ctx.fillText("AI  KAVITHAIGAL", W/2, M+sf*.65);
      ctx.strokeStyle=rgba(theme.accent,.18); ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(W/2-sf*1.6,M+sf*1.05); ctx.lineTo(W/2+sf*1.6,M+sf*1.05); ctx.stroke();
    }

    // Layout
    const lines=kavithai.split("\n").map(l=>l.trim()).filter(l=>l);
    const lh=sf*lineSpacing, dH=sf*.5, gap=sf*.4;
    const headBlock = heading ? hf+gap*.6 : 0;
    const totalH = dH+gap+headBlock+lines.length*lh+gap+dH;
    let cy = (H-totalH)/2;

    ctx.textAlign=textAlign;
    const tx = textAlign==="center"?W/2 : textAlign==="left"?M+30 : W-M-30;

    // Decor top
    ctx.fillStyle=rgba(theme.accent,.45); ctx.font=`${sf*.4}px serif`;
    ctx.textBaseline="top";
    const dtAlign=ctx.textAlign; ctx.textAlign="center";
    ctx.fillText(theme.dTop,W/2,cy); ctx.textAlign=dtAlign;
    cy+=dH+gap;

    // Heading
    if (heading) {
      ctx.fillStyle=rgba(theme.accent,.95);
      ctx.font=`700 ${hf}px ${font.css}`;
      ctx.fillText(heading,tx,cy); cy+=hf;
      ctx.strokeStyle=rgba(theme.accent,.22); ctx.lineWidth=1;
      ctx.beginPath(); ctx.moveTo(W/2-sf*.9,cy+gap*.15); ctx.lineTo(W/2+sf*.9,cy+gap*.15); ctx.stroke();
      cy+=gap*.6;
    }

    // Kavithai
    ctx.fillStyle=theme.text;
    ctx.font=`${fontStyle} ${sf}px ${font.css}`;
    ctx.shadowColor=rgba(theme.glow,.25); ctx.shadowBlur=glowIntensity*sc;
    lines.forEach((l,i) => ctx.fillText(l,tx,cy+i*lh));
    ctx.shadowBlur=0; cy+=lines.length*lh+gap;

    // Decor bottom
    ctx.fillStyle=rgba(theme.accent,.45); ctx.font=`${sf*.4}px serif`;
    ctx.textAlign="center";
    ctx.fillText(theme.dBot,W/2,cy); cy+=dH+sf*.55;

    // Author
    ctx.fillStyle=rgba(theme.accent,.8);
    ctx.font=`600 ${sf*.42}px 'DM Sans', system-ui, sans-serif`;
    ctx.fillText(author,W/2,cy);

    // Watermark
    ctx.fillStyle=rgba(theme.text,.12);
    ctx.font=`${9*sc}px 'DM Sans', system-ui, sans-serif`;
    ctx.textAlign="right"; ctx.textBaseline="bottom";
    ctx.fillText("AI Kavithaigal",W-M-8,H-M-8);

    return c;
  }, [heading,kavithai,author,themeIdx,sizeIdx,fontSize,headingSize,fontIdx,fontStyle,textAlign,frameIdx,lineSpacing,showParticles,glowIntensity,showBrand]);

  // ─── DOWNLOAD PNG ─────────────────────────────────────────
  const handleDownload = useCallback(() => {
    setDlStatus("loading");
    try {
      const canvas = renderCanvas();
      const fileName = `ai_kavithaigal_${theme.id}_${size.id}_${size.w}x${size.h}.png`;

      const triggerDownload = (href) => {
        const a = document.createElement("a");
        a.href = href;
        a.download = fileName;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      };

      // Primary: Blob URL (avoids large data-URL string in memory)
      if (canvas.toBlob) {
        canvas.toBlob((blob) => {
          if (!blob) {
            setDlStatus("error");
            setTimeout(() => setDlStatus(""), 4000);
            return;
          }
          const url = URL.createObjectURL(blob);
          triggerDownload(url);
          setTimeout(() => URL.revokeObjectURL(url), 30000);
          setDlStatus("done");
          setTimeout(() => setDlStatus(""), 3000);
        }, "image/png", 1.0);
      } else {
        // Fallback: data URL (older browsers)
        const dataUrl = canvas.toDataURL("image/png");
        triggerDownload(dataUrl);
        setDlStatus("done");
        setTimeout(() => setDlStatus(""), 3000);
      }
    } catch (err) {
      console.error("Download error:", err);
      setDlStatus("error");
      setTimeout(() => setDlStatus(""), 4000);
    }
  }, [renderCanvas, theme, size]);

  // ─── MUSIC PREVIEW ────────────────────────────────────────
  const togglePreview = useCallback((idx) => {
    if (!audioRef.current) audioRef.current = new Audio();
    const audio = audioRef.current;

    if (playingIdx === idx && !audio.paused) {
      audio.pause();
      setPlayingIdx(-1);
      return;
    }

    audio.src = MUSIC_TRACKS[idx].url;
    audio.volume = 0.7;
    audio.play().catch(() => {});
    setPlayingIdx(idx);
    audio.onended = () => setPlayingIdx(-1);
  }, [playingIdx]);

  // ─── DOWNLOAD REEL WITH MUSIC (.webm) ─────────────────────
  const handleDownloadReel = useCallback(async () => {
    if (musicIdx < 0) return;
    setReelStatus("creating");

    // Stop any preview
    if (audioRef.current) { audioRef.current.pause(); audioRef.current.src = ""; }
    setPlayingIdx(-1);

    try {
      const canvas = renderCanvas();
      const track = MUSIC_TRACKS[musicIdx];
      const fileName = `reel_${theme.id}_${size.id}_${track.id}.webm`;

      // Canvas video stream at 30fps
      const canvasStream = canvas.captureStream(30);

      // Audio via AudioContext + HTMLMediaElement source
      const audioEl = new Audio(track.url);
      audioEl.crossOrigin = "anonymous";
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const mediaSrc = audioCtx.createMediaElementSource(audioEl);
      const dest     = audioCtx.createMediaStreamDestination();
      mediaSrc.connect(dest);
      mediaSrc.connect(audioCtx.destination); // also audible while recording

      // Combined video + audio stream
      const combined = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...dest.stream.getAudioTracks(),
      ]);

      // Pick best supported codec
      const mimeType =
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus") ? "video/webm;codecs=vp9,opus" :
        MediaRecorder.isTypeSupported("video/webm;codecs=vp8,opus") ? "video/webm;codecs=vp8,opus" :
        "video/webm";

      const chunks = [];
      const recorder = new MediaRecorder(combined, { mimeType });
      recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.onstop = () => {
        audioCtx.close();
        const blob = new Blob(chunks, { type: "video/webm" });
        const url  = URL.createObjectURL(blob);
        const a    = document.createElement("a");
        a.href = url; a.download = fileName;
        a.style.display = "none";
        document.body.appendChild(a); a.click(); document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 30000);
        setReelStatus("done");
        setTimeout(() => setReelStatus(""), 3000);
      };

      // Wait for audio to be ready
      await new Promise((res, rej) => {
        audioEl.oncanplaythrough = res;
        audioEl.onerror = () => rej(new Error("Audio load failed"));
        audioEl.load();
      });

      recorder.start(100);
      audioEl.play();

      // Record up to 30 s (caps at actual track duration)
      const recordMs = Math.min((audioEl.duration || 30) * 1000, 30000);
      setTimeout(() => {
        recorder.stop();
        audioEl.pause();
        audioEl.src = "";
      }, recordMs);

    } catch (err) {
      console.error("Reel creation failed:", err);
      setReelStatus("error");
      setTimeout(() => setReelStatus(""), 4000);
    }
  }, [renderCanvas, musicIdx, theme, size]);

  // Preview sizing
  const maxPW = 320;
  const pvW = Math.min(maxPW, 320);
  const pvH = Math.min(pvW * (size.h / size.w), 420);

  // Dynamic accent CSS var
  const accentVar = { "--accent-color": theme.accent };

  // Filtered tracks for Music tab
  const filteredTracks = MUSIC_TRACKS.filter(
    t => genreFilter === "all" || t.genre === genreFilter
  );

  return (
    <div className="min-h-screen pb-10" style={{ background: "#050710", ...accentVar }}>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* ═══ HEADER ═══ */}
      <header className="text-center pt-6 pb-4 px-4">
        <div className="inline-flex items-center gap-2 mb-2">
          <Sparkles size={14} style={{ color: theme.accent }} />
          <span className="text-[10px] font-bold tracking-[4px] uppercase text-[#555]">Studio Pro</span>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-wide">AI Kavithaigal</h1>
        <p className="text-[10px] mt-1 tracking-widest text-[#444]">POST · REEL · STORY · ALL PLATFORMS</p>
        <div className="w-14 h-px mx-auto mt-3" style={{ background: `linear-gradient(90deg,transparent,${theme.accent},transparent)` }} />
      </header>

      {/* ═══ LIVE PREVIEW ═══ */}
      <div className="flex justify-center px-4 pb-4">
        <div className="rounded-xl overflow-hidden relative flex flex-col items-center justify-center transition-all duration-500"
          style={{
            width: pvW, height: pvH,
            background: `linear-gradient(160deg, ${theme.stops.map(([p,c])=>`${c} ${p*100}%`).join(", ")})`,
            border: `1px solid ${rgba(theme.accent,.18)}`,
            boxShadow: `0 0 40px ${rgba(theme.glow,.1)}`,
            padding: 20,
          }}>
          {frame.id !== "none" && <div className="absolute rounded pointer-events-none" style={{ inset:10, border:`1px solid ${rgba(theme.accent,.12)}` }} />}
          {frame.id === "corners" && [["top","left"],["top","right"],["bottom","left"],["bottom","right"]].map(([v,h],i)=>(
            <div key={i} className="absolute" style={{ [v]:10,[h]:10,width:12,height:12,
              [`border${v==="top"?"Top":"Bottom"}`]:`2px solid ${rgba(theme.accent,.4)}`,
              [`border${h==="left"?"Left":"Right"}`]:`2px solid ${rgba(theme.accent,.4)}` }} />
          ))}
          {showBrand && <div className="absolute top-3 left-0 right-0 text-center text-[7px] font-black tracking-[3px] uppercase" style={{color:rgba(theme.accent,.7)}}>AI KAVITHAIGAL</div>}
          <div className="relative z-10 flex flex-col items-center w-full px-2" style={{textAlign}}>
            <div className="text-[8px] tracking-[3px] mb-1" style={{color:rgba(theme.accent,.4)}}>{theme.dTop}</div>
            {heading && <>
              <div className="font-bold mb-0.5" style={{color:theme.accent,fontSize:Math.max(8,headingSize*.5),fontFamily:font.css}}>{heading}</div>
              <div className="mb-1.5" style={{width:16,height:1,background:rgba(theme.accent,.2)}} />
            </>}
            <div style={{ color:theme.text, fontSize:Math.min(fontSize,22), fontStyle, fontFamily:font.css,
              whiteSpace:"pre-line", wordBreak:"break-word", lineHeight:lineSpacing, maxWidth:"95%",
              textShadow:`0 0 ${glowIntensity*.6}px ${rgba(theme.glow,.2)}`, textAlign }}>{kavithai}</div>
            <div className="text-[8px] tracking-[3px] mt-2" style={{color:rgba(theme.accent,.4)}}>{theme.dBot}</div>
            <div className="text-[9px] mt-1 font-semibold tracking-wider" style={{color:rgba(theme.accent,.7)}}>{author}</div>
          </div>
          {/* Music badge on preview */}
          {musicIdx >= 0 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[8px] font-bold"
                style={{ background: rgba(theme.accent,.18), color: theme.accent, border:`1px solid ${rgba(theme.accent,.25)}` }}>
                <Music size={7} />
                {MUSIC_TRACKS[musicIdx].name}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ TABS ═══ */}
      <div className="px-3 pb-4">
        <Tabs defaultValue="content" className="w-full">
          <TabsList className="w-full grid grid-cols-5 h-9 mb-3" style={{background:"#0c0f16",border:"1px solid #1a1e2a"}}>
            <TabsTrigger value="content" className="text-[10px] gap-0.5"><Type size={11}/>Content</TabsTrigger>
            <TabsTrigger value="theme"   className="text-[10px] gap-0.5"><Palette size={11}/>Theme</TabsTrigger>
            <TabsTrigger value="size"    className="text-[10px] gap-0.5"><Layout size={11}/>Size</TabsTrigger>
            <TabsTrigger value="style"   className="text-[10px] gap-0.5"><Layers size={11}/>Style</TabsTrigger>
            <TabsTrigger value="music"   className="text-[10px] gap-0.5 relative">
              <Music size={11}/>Music
              {musicIdx >= 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full"
                  style={{ background: theme.accent }} />
              )}
            </TabsTrigger>
          </TabsList>

          {/* CONTENT */}
          <TabsContent value="content" className="space-y-3 mt-0">
            <Field label="Kavithai Heading">
              <input value={heading} onChange={e=>setHeading(e.target.value)} placeholder="கவிதை தலைப்பு..."
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                style={{background:"#0c0f16",color:"#e0e4ec",border:"1px solid #1a1e2a",fontFamily:font.css}} />
            </Field>
            <Field label="Your Kavithai">
              <textarea value={kavithai} onChange={e=>setKavithai(e.target.value)} rows={5}
                placeholder="உங்கள் கவிதையை இங்கே எழுதுங்கள்..."
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none resize-y transition-colors"
                style={{background:"#0c0f16",color:"#e0e4ec",border:"1px solid #1a1e2a",fontFamily:font.css,lineHeight:1.6}} />
            </Field>
            <Field label="Username">
              <input value={author} onChange={e=>setAuthor(e.target.value)}
                className="w-full rounded-lg px-3 py-2.5 text-sm outline-none transition-colors"
                style={{background:"#0c0f16",color:"#e0e4ec",border:"1px solid #1a1e2a"}} />
            </Field>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#888]">
              <input type="checkbox" checked={showBrand} onChange={e=>setShowBrand(e.target.checked)} style={{accentColor:theme.accent}} />
              Show "AI KAVITHAIGAL" brand
            </label>
          </TabsContent>

          {/* THEME */}
          <TabsContent value="theme" className="space-y-3 mt-0">
            <Field label="Color Theme">
              <div className="grid grid-cols-5 gap-2">
                {THEMES.map((tm,i)=>(
                  <button key={tm.id} onClick={()=>setThemeIdx(i)}
                    className="rounded-lg py-2 text-[10px] font-bold text-center transition-all"
                    style={{
                      background:themeIdx===i?tm.accent:"#0c0f16", color:themeIdx===i?"#fff":"#666",
                      border:`1px solid ${themeIdx===i?tm.accent:"#1a1e2a"}`,
                      boxShadow:themeIdx===i?`0 0 12px ${rgba(tm.accent,.3)}`:"none",
                      transform:themeIdx===i?"scale(1.05)":"scale(1)",
                    }}>{tm.name}</button>
                ))}
              </div>
            </Field>
            <Field label="Frame Style">
              <div className="flex gap-2 flex-wrap">
                {FRAMES.map((f,i)=>(
                  <button key={f.id} onClick={()=>setFrameIdx(i)}
                    className="rounded-full px-3 py-1.5 text-[11px] font-medium transition-all"
                    style={{
                      background:frameIdx===i?rgba(theme.accent,.15):"#0c0f16",
                      color:frameIdx===i?theme.accent:"#666",
                      border:`1px solid ${frameIdx===i?rgba(theme.accent,.3):"#1a1e2a"}`,
                    }}>{f.name}</button>
                ))}
              </div>
            </Field>
            <label className="flex items-center gap-2 cursor-pointer text-xs text-[#888]">
              <input type="checkbox" checked={showParticles} onChange={e=>setShowParticles(e.target.checked)} style={{accentColor:theme.accent}} />
              Background particles
            </label>
            <Field label={`Glow Intensity: ${glowIntensity}`}>
              <Slider value={[glowIntensity]} onValueChange={v=>setGlowIntensity(v[0])} min={0} max={50} step={1} />
            </Field>
          </TabsContent>

          {/* SIZE */}
          <TabsContent value="size" className="space-y-3 mt-0">
            <Field label="Instagram">
              <div className="grid grid-cols-3 gap-2">
                {SIZE_GROUPS.instagram.map(sz => { const idx=ALL_SIZES.findIndex(s=>s.id===sz.id); return (
                  <button key={sz.id} onClick={()=>setSizeIdx(idx)} className="rounded-lg py-2.5 text-center transition-all"
                    style={{ background:sizeIdx===idx?rgba(theme.accent,.12):"#0c0f16", color:sizeIdx===idx?theme.accent:"#666",
                      border:`1px solid ${sizeIdx===idx?rgba(theme.accent,.3):"#1a1e2a"}` }}>
                    <div className="text-sm">{sz.icon}</div>
                    <div className="text-[11px] font-bold mt-0.5">{sz.name}</div>
                    <div className="text-[8px] opacity-50">{sz.w}×{sz.h}</div>
                  </button>
                );})}
              </div>
            </Field>
            <Field label="Other Platforms">
              <div className="grid grid-cols-3 gap-2">
                {SIZE_GROUPS.other.map(sz => { const idx=ALL_SIZES.findIndex(s=>s.id===sz.id); return (
                  <button key={sz.id} onClick={()=>setSizeIdx(idx)} className="rounded-lg py-2.5 text-center transition-all"
                    style={{ background:sizeIdx===idx?rgba(theme.accent,.12):"#0c0f16", color:sizeIdx===idx?theme.accent:"#666",
                      border:`1px solid ${sizeIdx===idx?rgba(theme.accent,.3):"#1a1e2a"}` }}>
                    <div className="text-sm">{sz.icon}</div>
                    <div className="text-[11px] font-bold mt-0.5">{sz.name}</div>
                    <div className="text-[8px] opacity-50">{sz.w}×{sz.h}</div>
                  </button>
                );})}
              </div>
            </Field>
          </TabsContent>

          {/* STYLE */}
          <TabsContent value="style" className="space-y-3 mt-0">
            <Field label="Font Family">
              <div className="grid grid-cols-2 gap-2">
                {FONTS.map((f,i)=>(
                  <button key={f.id} onClick={()=>setFontIdx(i)} className="rounded-lg px-3 py-2 text-left transition-all"
                    style={{ background:fontIdx===i?rgba(theme.accent,.1):"#0c0f16", color:fontIdx===i?theme.accent:"#666",
                      border:`1px solid ${fontIdx===i?rgba(theme.accent,.3):"#1a1e2a"}`, fontFamily:f.css }}>
                    <div className="text-xs font-bold">{f.name}</div>
                    <div className="text-[10px] opacity-50 mt-0.5">அழகு Abc</div>
                  </button>
                ))}
              </div>
            </Field>
            <Field label="Text Style">
              <div className="flex gap-2">
                {[["normal","Normal",Bold],["italic","Italic",Italic]].map(([v,l,Icon])=>(
                  <button key={v} onClick={()=>setFontStyle(v)}
                    className="rounded-full px-4 py-1.5 text-xs font-medium flex items-center gap-1.5 transition-all"
                    style={{ background:fontStyle===v?rgba(theme.accent,.12):"#0c0f16", color:fontStyle===v?theme.accent:"#666",
                      border:`1px solid ${fontStyle===v?rgba(theme.accent,.3):"#1a1e2a"}` }}><Icon size={12}/>{l}</button>
                ))}
              </div>
            </Field>
            <Field label="Text Alignment">
              <div className="flex gap-2">
                {[["left",AlignLeft],["center",AlignCenter],["right",AlignRight]].map(([v,Icon])=>(
                  <button key={v} onClick={()=>setTextAlign(v)} className="rounded-lg p-2.5 transition-all"
                    style={{ background:textAlign===v?rgba(theme.accent,.12):"#0c0f16", color:textAlign===v?theme.accent:"#666",
                      border:`1px solid ${textAlign===v?rgba(theme.accent,.3):"#1a1e2a"}` }}><Icon size={16}/></button>
                ))}
              </div>
            </Field>
            <Field label={`Kavithai Font Size: ${fontSize}px`}>
              <Slider value={[fontSize]} onValueChange={v=>setFontSize(v[0])} min={14} max={52} step={1} />
            </Field>
            <Field label={`Heading Size: ${headingSize}px`}>
              <Slider value={[headingSize]} onValueChange={v=>setHeadingSize(v[0])} min={10} max={40} step={1} />
            </Field>
            <Field label={`Line Spacing: ${lineSpacing.toFixed(2)}`}>
              <Slider value={[lineSpacing]} onValueChange={v=>setLineSpacing(v[0])} min={1.2} max={2.5} step={0.05} />
            </Field>
          </TabsContent>

          {/* MUSIC */}
          <TabsContent value="music" className="space-y-3 mt-0">
            <div className="text-[9px] tracking-wider text-[#444] text-center pb-1">
              FREE ROYALTY-FREE TRACKS · TAP ▶ TO PREVIEW
            </div>

            {/* Genre filter */}
            <div className="flex gap-1.5 flex-wrap">
              {MUSIC_GENRES.map(g => (
                <button key={g.id} onClick={() => setGenreFilter(g.id)}
                  className="rounded-full px-2.5 py-1 text-[10px] font-bold transition-all"
                  style={{
                    background: genreFilter === g.id ? rgba(theme.accent,.15) : "#0c0f16",
                    color:      genreFilter === g.id ? theme.accent : "#555",
                    border:     `1px solid ${genreFilter === g.id ? rgba(theme.accent,.3) : "#1a1e2a"}`,
                  }}>
                  {g.emoji} {g.label}
                </button>
              ))}
            </div>

            {/* Track list */}
            <div className="space-y-1.5">
              {filteredTracks.map((track) => {
                const idx = MUSIC_TRACKS.indexOf(track);
                const isSelected        = musicIdx === idx;
                const isCurrentPlaying  = playingIdx === idx;
                return (
                  <div key={track.id}
                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 cursor-pointer transition-all"
                    style={{
                      background: isSelected ? rgba(theme.accent,.08) : "#0c0f16",
                      border:     `1px solid ${isSelected ? rgba(theme.accent,.25) : "#1a1e2a"}`,
                    }}
                    onClick={() => setMusicIdx(isSelected ? -1 : idx)}>

                    {/* Play/Pause preview button */}
                    <button
                      onClick={e => { e.stopPropagation(); togglePreview(idx); }}
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 transition-all active:scale-90"
                      style={{ background: rgba(theme.accent,.15), color: theme.accent }}>
                      {isCurrentPlaying ? <Pause size={11} /> : <Play size={11} />}
                    </button>

                    {/* Track info */}
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold truncate"
                        style={{ color: isSelected ? theme.accent : "#ccc" }}>
                        {track.name}
                      </div>
                      <div className="text-[9px] mt-0.5 capitalize" style={{ color: "#444" }}>
                        {track.genre} · {track.bpm} BPM
                      </div>
                    </div>

                    {/* Selected tick */}
                    {isSelected && <Check size={13} style={{ color: theme.accent, flexShrink: 0 }} />}
                  </div>
                );
              })}
            </div>

            {/* Selected track info bar */}
            {musicIdx >= 0 ? (
              <div className="rounded-lg px-3 py-2 text-[11px] text-center font-medium"
                style={{ background: rgba(theme.accent,.06), color: rgba(theme.accent,.8), border:`1px solid ${rgba(theme.accent,.12)}` }}>
                🎵 <strong>{MUSIC_TRACKS[musicIdx].name}</strong> selected — use "Download Reel" below
              </div>
            ) : (
              <div className="text-center text-[10px] text-[#333] pt-1">
                Select a track to enable Reel download with music
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* ═══ DOWNLOAD BUTTONS ═══ */}
      <div className="px-4 space-y-2">

        {/* PNG Download */}
        <button onClick={handleDownload} disabled={dlStatus==="loading"}
          className="w-full py-4 rounded-xl font-bold text-base tracking-wide text-white flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
          style={{
            background: `linear-gradient(135deg, ${theme.accent}, ${rgba(theme.accent,.7)})`,
            boxShadow: `0 4px 28px ${rgba(theme.glow,.35)}`,
            border:"none", cursor: dlStatus==="loading"?"wait":"pointer",
          }}>
          {dlStatus==="loading" ? <><Loader2 size={18} className="animate-spin"/>Generating...</> :
           dlStatus==="done"    ? <><Check size={18}/>Saved!</> :
           dlStatus==="error"   ? <><X size={18}/>Failed — tap to retry</> :
                                  <><Download size={18}/>DOWNLOAD PNG<span className="font-normal opacity-60 text-sm ml-1">({size.w}×{size.h})</span></>}
        </button>

        {/* Reel + Music Download (shown only when a track is selected) */}
        {musicIdx >= 0 && (
          <button onClick={handleDownloadReel} disabled={reelStatus==="creating"}
            className="w-full py-3.5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-60"
            style={{
              background: "#0c0f16",
              border: `1px solid ${rgba(theme.accent,.35)}`,
              color: theme.accent,
              boxShadow: `0 0 20px ${rgba(theme.glow,.12)}`,
              cursor: reelStatus==="creating" ? "wait" : "pointer",
            }}>
            {reelStatus==="creating" ? <><Loader2 size={16} className="animate-spin"/>Creating Reel (up to 30s)...</> :
             reelStatus==="done"     ? <><Check size={16}/>Reel Saved!</> :
             reelStatus==="error"    ? <><X size={16}/>Failed — try again</> :
                                       <><Video size={16}/>DOWNLOAD REEL + MUSIC<span className="font-normal opacity-50 text-xs ml-1">(.webm · {MUSIC_TRACKS[musicIdx].name})</span></>}
          </button>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-center gap-2 pt-1">
          {[`${size.w}×${size.h}`, "PNG", size.name, ...(musicIdx >= 0 ? ["+ Music"] : [])].map((t,i)=>(
            <span key={i} className="text-[10px] px-2.5 py-0.5 rounded-full"
              style={{background:rgba(theme.accent,.06),color:"#555"}}>{t}</span>
          ))}
        </div>

        <p className="text-center text-[10px] mt-1 tracking-wider text-[#333]">
          Tap to download PNG directly · Select music for Reel (.webm)
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <div className="text-[10px] font-bold tracking-[2px] uppercase mb-1.5 text-[#555]">{label}</div>
      {children}
    </div>
  );
}
