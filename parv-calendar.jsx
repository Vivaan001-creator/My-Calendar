import { useState, useMemo, useRef } from 'react';
import { ChevronLeft, ChevronRight, Info } from 'lucide-react';

const COLORS = {
  bg: '#14142B',
  surface: '#1C1C3D',
  surfaceAlt: '#2A2A55',
  border: '#33335C',
  borderSoft: '#282850',
  text: '#F5EFE0',
  textMuted: '#9E98BE',
  textFaint: '#716B95',
  gold: '#E3A857',
  goldSoft: '#F3D9A8',
  sindoor: '#C1443C',
  sindoorSoft: '#E0857D',
  jade: '#5E9C8C',
  jadeSoft: '#9CC7BB',
};

const CAT = {
  festival: { label: 'त्योहार', color: COLORS.gold },
  national: { label: 'राष्ट्रीय पर्व', color: COLORS.sindoor },
  jayanti: { label: 'जयंती', color: COLORS.jade },
};

const HINDI_MONTHS = ['जनवरी', 'फरवरी', 'मार्च', 'अप्रैल', 'मई', 'जून', 'जुलाई', 'अगस्त', 'सितंबर', 'अक्टूबर', 'नवंबर', 'दिसंबर'];
const HINDI_WEEK_SHORT = ['र', 'सो', 'मं', 'बु', 'गु', 'शु', 'श'];
const HINDI_WEEK_FULL = ['रविवार', 'सोमवार', 'मंगलवार', 'बुधवार', 'गुरुवार', 'शुक्रवार', 'शनिवार'];

const EVENTS = [
  { date: '2026-01-12', hi: 'स्वामी विवेकानंद जयंती', en: 'National Youth Day', cat: 'jayanti', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'युवा दिवस, स्वामी विवेकानंद के विचारों को समर्पित।' },
  { date: '2026-01-14', hi: 'मकर संक्रांति', en: 'Makar Sankranti / Pongal', cat: 'festival', paksha: 'solar', tithi: 'सूर्य का मकर राशि में प्रवेश', desc: 'सूर्य के उत्तरायण होने और फसल कटाई का पर्व।' },
  { date: '2026-01-23', hi: 'पराक्रम दिवस', en: 'Netaji Subhas Chandra Bose Jayanti', cat: 'jayanti', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'नेताजी सुभाष चंद्र बोस की जयंती।' },
  { date: '2026-01-23', hi: 'वसंत पंचमी', en: 'Vasant Panchami', cat: 'festival', paksha: 'shukla', tithi: 'माघ शुक्ल पंचमी', desc: 'माँ सरस्वती की पूजा और वसंत ऋतु का स्वागत।' },
  { date: '2026-01-26', hi: 'गणतंत्र दिवस', en: 'Republic Day', cat: 'national', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'भारत का संविधान लागू होने की वर्षगांठ।' },
  { date: '2026-02-15', hi: 'महाशिवरात्रि', en: 'Maha Shivratri', cat: 'festival', paksha: 'krishna', tithi: 'फाल्गुन कृष्ण चतुर्दशी', desc: 'भगवान शिव की आराधना की रात्रि, व्रत व जागरण।' },
  { date: '2026-03-03', hi: 'होलिका दहन', en: 'Holika Dahan', cat: 'festival', paksha: 'purnima', tithi: 'फाल्गुन पूर्णिमा', desc: 'बुराई पर अच्छाई की जीत का प्रतीक अग्नि पूजन।' },
  { date: '2026-03-04', hi: 'होली', en: 'Holi', cat: 'festival', paksha: 'krishna', tithi: 'फाल्गुन कृष्ण प्रतिपदा', desc: 'रंगों का त्योहार, प्रेम व उल्लास का पर्व।' },
  { date: '2026-03-19', hi: 'चैत्र नवरात्रि प्रारंभ', en: 'Chaitra Navratri Begins', cat: 'festival', paksha: 'shukla', tithi: 'चैत्र शुक्ल प्रतिपदा', desc: 'नौ दिन माँ दुर्गा के नौ रूपों की आराधना।' },
  { date: '2026-03-21', hi: 'ईद-उल-फ़ित्र', en: 'Id-ul-Fitr', cat: 'national', paksha: 'islamic', tithi: 'इस्लामी कैलेंडर — चांद पर निर्भर', desc: 'रमज़ान के रोज़ों की समाप्ति का पर्व।' },
  { date: '2026-03-26', hi: 'राम नवमी', en: 'Ram Navami', cat: 'festival', paksha: 'shukla', tithi: 'चैत्र शुक्ल नवमी', desc: 'भगवान श्रीराम के जन्मोत्सव का पर्व।' },
  { date: '2026-03-31', hi: 'महावीर जयंती', en: 'Mahavir Jayanti', cat: 'festival', paksha: 'shukla', tithi: 'चैत्र शुक्ल त्रयोदशी', desc: 'भगवान महावीर के जन्म कल्याणक का पर्व।' },
  { date: '2026-04-02', hi: 'हनुमान जयंती', en: 'Hanuman Jayanti', cat: 'festival', paksha: 'purnima', tithi: 'चैत्र पूर्णिमा', desc: 'श्री हनुमान जी के जन्मोत्सव का पर्व।' },
  { date: '2026-04-03', hi: 'गुड फ्राइडे', en: 'Good Friday', cat: 'national', paksha: 'christian', tithi: 'निश्चित तिथि — ईसाई कैलेंडर', desc: 'ईसा मसीह के बलिदान की स्मृति में।' },
  { date: '2026-04-14', hi: 'डॉ. भीमराव अंबेडकर जयंती', en: 'Dr. B.R. Ambedkar Jayanti', cat: 'jayanti', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'भारतीय संविधान के शिल्पी की जयंती।' },
  { date: '2026-05-01', hi: 'बुद्ध पूर्णिमा', en: 'Buddha Purnima', cat: 'festival', paksha: 'purnima', tithi: 'वैशाख पूर्णिमा', desc: 'भगवान बुद्ध के जन्म, ज्ञान व निर्वाण की स्मृति।' },
  { date: '2026-05-27', hi: 'ईद-उल-अज़हा (बकरीद)', en: 'Id-ul-Zuha / Bakrid', cat: 'national', paksha: 'islamic', tithi: 'इस्लामी कैलेंडर — चांद पर निर्भर', desc: 'त्याग व कुर्बानी का पर्व।' },
  { date: '2026-06-26', hi: 'मुहर्रम', en: 'Muharram', cat: 'national', paksha: 'islamic', tithi: 'इस्लामी कैलेंडर — चांद पर निर्भर', desc: 'इस्लामी नववर्ष व इमाम हुसैन की स्मृति।' },
  { date: '2026-07-16', hi: 'जगन्नाथ रथ यात्रा', en: 'Jagannath Rath Yatra', cat: 'festival', paksha: 'shukla', tithi: 'आषाढ़ शुक्ल द्वितीया', desc: 'भगवान जगन्नाथ की विश्व प्रसिद्ध रथ यात्रा, पुरी।' },
  { date: '2026-07-29', hi: 'गुरु पूर्णिमा', en: 'Guru Purnima', cat: 'festival', paksha: 'purnima', tithi: 'आषाढ़ पूर्णिमा', desc: 'गुरुओं के प्रति कृतज्ञता व्यक्त करने का पर्व।' },
  { date: '2026-08-15', hi: 'स्वतंत्रता दिवस', en: 'Independence Day', cat: 'national', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'भारत की आज़ादी की वर्षगांठ।' },
  { date: '2026-08-26', hi: 'ईद मिलाद-उन-नबी', en: 'Milad-un-Nabi', cat: 'national', paksha: 'islamic', tithi: 'इस्लामी कैलेंडर — चांद पर निर्भर', desc: 'पैगंबर मुहम्मद साहब के जन्मदिवस की स्मृति।' },
  { date: '2026-08-26', hi: 'ओणम', en: 'Onam', cat: 'festival', paksha: 'solar', tithi: 'मलयालम कैलेंडर — चिंगम मास', desc: 'केरल का फसल उत्सव, राजा महाबली के स्वागत में।' },
  { date: '2026-08-28', hi: 'रक्षाबंधन', en: 'Raksha Bandhan', cat: 'festival', paksha: 'purnima', tithi: 'श्रावण शुक्ल पूर्णिमा', desc: 'भाई-बहन के प्रेम व रक्षा-वचन का पर्व।' },
  { date: '2026-09-04', hi: 'कृष्ण जन्माष्टमी', en: 'Krishna Janmashtami', cat: 'festival', paksha: 'krishna', tithi: 'भाद्रपद कृष्ण अष्टमी', desc: 'भगवान श्रीकृष्ण के जन्मोत्सव का पर्व।' },
  { date: '2026-09-05', hi: 'शिक्षक दिवस', en: "Teachers' Day (Dr. Radhakrishnan Jayanti)", cat: 'jayanti', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'डॉ. सर्वपल्ली राधाकृष्णन की जयंती, शिक्षकों का सम्मान।' },
  { date: '2026-09-14', hi: 'गणेश चतुर्थी', en: 'Ganesh Chaturthi', cat: 'festival', paksha: 'shukla', tithi: 'भाद्रपद शुक्ल चतुर्थी', desc: 'भगवान गणेश की स्थापना व आराधना का पर्व शुरू।' },
  { date: '2026-09-17', hi: 'विश्वकर्मा पूजा', en: 'Vishwakarma Puja', cat: 'festival', paksha: 'solar', tithi: 'कन्या संक्रांति', desc: 'देवशिल्पी विश्वकर्मा की पूजा, औज़ार व मशीनों का पूजन।' },
  { date: '2026-09-25', hi: 'अनंत चतुर्दशी', en: 'Anant Chaturdashi', cat: 'festival', paksha: 'shukla', tithi: 'भाद्रपद शुक्ल चतुर्दशी', desc: 'गणेश विसर्जन व भगवान विष्णु के अनंत रूप की पूजा।' },
  { date: '2026-10-02', hi: 'गांधी जयंती', en: 'Mahatma Gandhi Jayanti', cat: 'jayanti', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'राष्ट्रपिता महात्मा गांधी का जन्मदिवस, राष्ट्रीय अवकाश।' },
  { date: '2026-10-11', hi: 'शरद नवरात्रि प्रारंभ', en: 'Sharad Navratri Begins', cat: 'festival', paksha: 'shukla', tithi: 'आश्विन शुक्ल प्रतिपदा', desc: 'साल की सबसे बड़ी नवरात्रि, नौ दिन माँ दुर्गा की आराधना।' },
  { date: '2026-10-15', hi: 'डॉ. ए.पी.जे. अब्दुल कलाम जयंती', en: 'Dr. APJ Abdul Kalam Birth Anniversary', cat: 'jayanti', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'मिसाइल मैन व पूर्व राष्ट्रपति की जयंती।' },
  { date: '2026-10-20', hi: 'दशहरा (विजयादशमी)', en: 'Dussehra / Vijayadashami', cat: 'festival', paksha: 'shukla', tithi: 'आश्विन शुक्ल दशमी', desc: 'बुराई पर अच्छाई की जीत, रावण दहन का पर्व।' },
  { date: '2026-10-29', hi: 'करवा चौथ', en: 'Karva Chauth', cat: 'festival', paksha: 'krishna', tithi: 'कार्तिक कृष्ण चतुर्थी', desc: 'सुहागिन स्त्रियों का पति की लंबी उम्र हेतु व्रत।' },
  { date: '2026-11-06', hi: 'धनतेरस', en: 'Dhanteras', cat: 'festival', paksha: 'krishna', tithi: 'कार्तिक कृष्ण त्रयोदशी', desc: 'धन-समृद्धि की देवी की पूजा, दीपावली की शुरुआत।' },
  { date: '2026-11-08', hi: 'दीपावली (लक्ष्मी पूजा)', en: 'Diwali / Lakshmi Puja', cat: 'festival', paksha: 'amavasya', tithi: 'कार्तिक अमावस्या', desc: 'रोशनी का पर्व, माँ लक्ष्मी व गणेश जी की पूजा।' },
  { date: '2026-11-09', hi: 'गोवर्धन पूजा', en: 'Govardhan Puja', cat: 'festival', paksha: 'shukla', tithi: 'कार्तिक शुक्ल प्रतिपदा', desc: 'श्रीकृष्ण द्वारा गोवर्धन पर्वत उठाने की स्मृति में अन्नकूट।' },
  { date: '2026-11-11', hi: 'भाई दूज', en: 'Bhai Dooj', cat: 'festival', paksha: 'shukla', tithi: 'कार्तिक शुक्ल द्वितीया', desc: 'भाई-बहन के स्नेह व दीर्घायु कामना का पर्व।' },
  { date: '2026-11-14', hi: 'बाल दिवस', en: "Children's Day (Nehru Jayanti)", cat: 'jayanti', paksha: 'gregorian', tithi: 'निश्चित तिथि — ग्रेगोरियन', desc: 'पंडित जवाहरलाल नेहरू की जयंती, बाल दिवस के रूप में।' },
  { date: '2026-11-15', hi: 'छठ पूजा', en: 'Chhath Puja', cat: 'festival', paksha: 'shukla', tithi: 'कार्तिक शुक्ल षष्ठी', desc: 'सूर्य देव व छठी मैया की आराधना का महापर्व।' },
  { date: '2026-11-24', hi: 'गुरु नानक जयंती', en: 'Guru Nanak Jayanti', cat: 'festival', paksha: 'purnima', tithi: 'कार्तिक पूर्णिमा', desc: 'सिख धर्म के प्रथम गुरु, गुरु नानक देव जी की जयंती।' },
  { date: '2026-11-24', hi: 'देव दीपावली', en: 'Dev Deepavali', cat: 'festival', paksha: 'purnima', tithi: 'कार्तिक पूर्णिमा', desc: 'वाराणसी के घाटों पर देवताओं की दिवाली, दीपों की सजावट।' },
  { date: '2026-12-20', hi: 'गीता जयंती', en: 'Gita Jayanti', cat: 'festival', paksha: 'shukla', tithi: 'मार्गशीर्ष शुक्ल एकादशी', desc: 'श्रीमद्भगवद्गीता के उपदेश की जयंती, कुरुक्षेत्र में विशेष आयोजन।' },
  { date: '2026-12-25', hi: 'क्रिसमस', en: 'Christmas', cat: 'national', paksha: 'christian', tithi: 'निश्चित तिथि — ईसाई कैलेंडर', desc: 'ईसा मसीह के जन्मदिवस का पर्व।' },
];

const STARS = [
  { top: '8%', left: '12%', size: 3, o: 0.9 }, { top: '18%', left: '82%', size: 2, o: 0.6 },
  { top: '30%', left: '25%', size: 2, o: 0.5 }, { top: '12%', left: '55%', size: 3, o: 0.7 },
  { top: '40%', left: '90%', size: 2, o: 0.8 }, { top: '55%', left: '6%', size: 2, o: 0.5 },
  { top: '65%', left: '45%', size: 3, o: 0.6 }, { top: '20%', left: '38%', size: 2, o: 0.4 },
  { top: '48%', left: '70%', size: 2, o: 0.7 }, { top: '75%', left: '85%', size: 2, o: 0.5 },
  { top: '5%', left: '70%', size: 2, o: 0.5 }, { top: '60%', left: '20%', size: 2, o: 0.6 },
];

const pad = (n) => String(n).padStart(2, '0');

function MoonGlyph({ paksha, size = 10 }) {
  const bright = paksha === 'shukla' || paksha === 'purnima';
  const dark = paksha === 'krishna' || paksha === 'amavasya';
  if (bright) {
    return <span style={{ width: size, height: size, borderRadius: '50%', background: COLORS.gold, display: 'inline-block', flexShrink: 0 }} />;
  }
  if (dark) {
    return <span style={{ width: size, height: size, borderRadius: '50%', background: 'transparent', border: `1.5px solid ${COLORS.gold}`, display: 'inline-block', flexShrink: 0 }} />;
  }
  return <span style={{ width: size, height: size, background: COLORS.textFaint, display: 'inline-block', flexShrink: 0, transform: 'rotate(45deg)' }} />;
}

function formatLong(dateStr) {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dow = new Date(y, m - 1, d).getDay();
  return `${d} ${HINDI_MONTHS[m - 1]} ${y}, ${HINDI_WEEK_FULL[dow]}`;
}

function daysUntil(dateStr, todayStr) {
  const d1 = new Date(todayStr + 'T00:00:00');
  const d2 = new Date(dateStr + 'T00:00:00');
  return Math.round((d2 - d1) / 86400000);
}

function untilLabel(n) {
  if (n === 0) return 'आज';
  if (n === 1) return 'कल';
  return `${n} दिन में`;
}

export default function FestivalCalendar() {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

  const [view, setView] = useState({ y: now.getFullYear(), m: now.getMonth() });
  const [selected, setSelected] = useState(todayStr);
  const [filter, setFilter] = useState('all');
  const detailRef = useRef(null);

  const eventsByDate = useMemo(() => {
    const map = {};
    for (const e of EVENTS) {
      if (!map[e.date]) map[e.date] = [];
      map[e.date].push(e);
    }
    return map;
  }, []);

  const passesFilter = (e) => filter === 'all' || e.cat === filter;

  const { y, m } = view;
  const firstDow = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstDow; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const monthEventCount = useMemo(() => {
    const prefix = `${y}-${pad(m + 1)}-`;
    return EVENTS.filter((e) => e.date.startsWith(prefix) && passesFilter(e)).length;
  }, [y, m, filter]);

  const upcoming = useMemo(() => {
    return EVENTS.filter((e) => e.date >= todayStr && passesFilter(e))
      .sort((a, b) => a.date.localeCompare(b.date))
      .slice(0, 8);
  }, [filter, todayStr]);

  const selectedEvents = (eventsByDate[selected] || []).filter(passesFilter);

  function changeMonth(delta) {
    let nm = m + delta, ny = y;
    if (nm < 0) { nm = 11; ny -= 1; }
    if (nm > 11) { nm = 0; ny += 1; }
    setView({ y: ny, m: nm });
  }

  function goToday() {
    setView({ y: now.getFullYear(), m: now.getMonth() });
    setSelected(todayStr);
  }

  function jumpTo(dateStr) {
    const [yy, mm] = dateStr.split('-').map(Number);
    setView({ y: yy, m: mm - 1 });
    setSelected(dateStr);
    setTimeout(() => detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 50);
  }

  const chips = [
    { key: 'all', label: 'सभी', dot: null },
    { key: 'festival', label: CAT.festival.label, dot: COLORS.gold },
    { key: 'national', label: CAT.national.label, dot: COLORS.sindoor },
    { key: 'jayanti', label: CAT.jayanti.label, dot: COLORS.jade },
  ];

  const headingFont = "'Fraunces', 'Noto Serif Devanagari', serif";
  const bodyFont = "'Inter', 'Noto Sans Devanagari', sans-serif";

  return (
    <div style={{ background: COLORS.bg, color: COLORS.text, fontFamily: bodyFont, minHeight: '100vh' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Noto+Serif+Devanagari:wght@500;600;700&family=Inter:wght@400;500;600;700&family=Noto+Sans+Devanagari:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
      `}</style>

      <div className="max-w-md mx-auto w-full px-4 pt-6 pb-10">

        {/* Header */}
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: 16, background: `linear-gradient(160deg, ${COLORS.surface}, ${COLORS.bg})`, border: `1px solid ${COLORS.border}`, padding: '20px 18px' }}>
          {STARS.map((s, i) => (
            <span key={i} style={{ position: 'absolute', top: s.top, left: s.left, width: s.size, height: s.size, borderRadius: '50%', background: COLORS.goldSoft, opacity: s.o }} />
          ))}
          <div style={{ position: 'relative' }}>
            <p style={{ fontFamily: headingFont, fontSize: 13, color: COLORS.goldSoft, letterSpacing: 0.3, marginBottom: 2 }}>पर्व कैलेंडर · हिंदू पंचांग</p>
            <div className="flex items-center justify-between mt-1">
              <button onClick={() => changeMonth(-1)} aria-label="पिछला माह" style={{ color: COLORS.textMuted, background: 'none', border: 'none', padding: 6, cursor: 'pointer' }}>
                <ChevronLeft size={20} />
              </button>
              <h1 style={{ fontFamily: headingFont, fontSize: 26, fontWeight: 600, color: COLORS.text }}>
                {HINDI_MONTHS[m]} {y}
              </h1>
              <button onClick={() => changeMonth(1)} aria-label="अगला माह" style={{ color: COLORS.textMuted, background: 'none', border: 'none', padding: 6, cursor: 'pointer' }}>
                <ChevronRight size={20} />
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <p style={{ fontSize: 13, color: COLORS.textMuted }}>
                {monthEventCount > 0 ? `इस माह ${monthEventCount} पर्व` : 'इस माह कोई पर्व दर्ज नहीं'}
              </p>
              <button onClick={goToday} style={{ fontSize: 12.5, color: COLORS.bg, background: COLORS.goldSoft, border: 'none', borderRadius: 999, padding: '4px 12px', fontWeight: 600, cursor: 'pointer' }}>
                आज
              </button>
            </div>
          </div>
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
          {chips.map((c) => {
            const active = filter === c.key;
            return (
              <button
                key={c.key}
                onClick={() => setFilter(c.key)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  fontSize: 13, fontWeight: 500, padding: '6px 12px', borderRadius: 999,
                  border: `1px solid ${active ? 'transparent' : COLORS.border}`,
                  background: active ? (c.dot || COLORS.surfaceAlt) : 'transparent',
                  color: active ? COLORS.bg : COLORS.textMuted,
                  cursor: 'pointer',
                }}
              >
                {c.dot && <span style={{ width: 7, height: 7, borderRadius: '50%', background: active ? COLORS.bg : c.dot, display: 'inline-block' }} />}
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Calendar grid */}
        <div className="mt-4" style={{ background: COLORS.surface, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: 14 }}>
          <div className="grid grid-cols-7 gap-1 mb-2">
            {HINDI_WEEK_SHORT.map((w, i) => (
              <div key={i} className="text-center" style={{ fontSize: 12, fontWeight: 600, color: i === 0 ? COLORS.sindoorSoft : COLORS.textFaint }}>
                {w}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {cells.map((d, i) => {
              if (d === null) return <div key={i} />;
              const dateStr = `${y}-${pad(m + 1)}-${pad(d)}`;
              const dayEvents = (eventsByDate[dateStr] || []).filter(passesFilter);
              const isToday = dateStr === todayStr;
              const isSelected = dateStr === selected;
              const isSunday = i % 7 === 0;
              return (
                <button
                  key={i}
                  onClick={() => setSelected(dateStr)}
                  className="aspect-square flex flex-col items-center justify-center"
                  style={{
                    borderRadius: 10,
                    background: isSelected ? COLORS.surfaceAlt : 'transparent',
                    border: isToday ? `1.5px solid ${COLORS.gold}` : '1.5px solid transparent',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  <span style={{ fontSize: 13, color: isSunday ? COLORS.sindoorSoft : COLORS.text, fontWeight: isToday ? 700 : 400 }}>
                    {d}
                  </span>
                  <span className="flex gap-0.5 mt-1" style={{ height: 5 }}>
                    {dayEvents.slice(0, 3).map((e, idx) => (
                      <span key={idx} style={{ width: 4, height: 4, borderRadius: '50%', background: CAT[e.cat].color, display: 'inline-block' }} />
                    ))}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day detail */}
        <div ref={detailRef} className="mt-4">
          <p style={{ fontSize: 14, fontWeight: 600, color: COLORS.text, marginBottom: 8 }}>{formatLong(selected)}</p>
          {selectedEvents.length === 0 ? (
            <div style={{ background: COLORS.surface, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 12, padding: '14px 16px' }}>
              <p style={{ fontSize: 13, color: COLORS.textFaint }}>इस दिन पंचांग में कोई पर्व दर्ज नहीं है।</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedEvents.map((e, i) => (
                <div key={i} style={{ background: COLORS.surface, border: `1px solid ${COLORS.borderSoft}`, borderLeft: `3px solid ${CAT[e.cat].color}`, borderRadius: 12, padding: '14px 16px' }}>
                  <div className="flex items-center justify-between">
                    <p style={{ fontFamily: headingFont, fontSize: 17, fontWeight: 600, color: COLORS.text }}>{e.hi}</p>
                    <span style={{ fontSize: 11, color: CAT[e.cat].color, border: `1px solid ${CAT[e.cat].color}`, borderRadius: 999, padding: '2px 8px' }}>
                      {CAT[e.cat].label}
                    </span>
                  </div>
                  <p style={{ fontSize: 12.5, color: COLORS.textMuted, marginTop: 1 }}>{e.en}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    <MoonGlyph paksha={e.paksha} />
                    <span style={{ fontSize: 12.5, color: COLORS.goldSoft }}>{e.tithi}</span>
                  </div>
                  <p style={{ fontSize: 13.5, color: COLORS.text, marginTop: 8, lineHeight: 1.5 }}>{e.desc}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming feed */}
        <div className="mt-6">
          <p style={{ fontFamily: headingFont, fontSize: 18, fontWeight: 600, color: COLORS.text, marginBottom: 10 }}>आने वाले पर्व</p>
          {upcoming.length === 0 ? (
            <p style={{ fontSize: 13, color: COLORS.textFaint }}>चुने गए फ़िल्टर में इस वर्ष आगे कोई पर्व नहीं बचा।</p>
          ) : (
            <div className="flex flex-col gap-2">
              {upcoming.map((e, i) => {
                const n = daysUntil(e.date, todayStr);
                const [, mm, dd] = e.date.split('-');
                return (
                  <button
                    key={i}
                    onClick={() => jumpTo(e.date)}
                    className="flex items-center gap-3 text-left"
                    style={{ background: COLORS.surface, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 12, padding: '10px 12px', cursor: 'pointer' }}
                  >
                    <div style={{ width: 42, textAlign: 'center', flexShrink: 0 }}>
                      <div style={{ fontSize: 17, fontWeight: 700, color: COLORS.text, lineHeight: 1.1 }}>{dd}</div>
                      <div style={{ fontSize: 10.5, color: COLORS.textFaint }}>{HINDI_MONTHS[Number(mm) - 1].slice(0, 3)}</div>
                    </div>
                    <div style={{ width: 1, alignSelf: 'stretch', background: COLORS.borderSoft }} />
                    <div className="flex-1" style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 14, fontWeight: 500, color: COLORS.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.hi}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <MoonGlyph paksha={e.paksha} size={7} />
                        <p style={{ fontSize: 11.5, color: COLORS.textMuted, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{e.tithi}</p>
                      </div>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: n <= 1 ? COLORS.bg : CAT[e.cat].color, background: n <= 1 ? COLORS.goldSoft : 'transparent', border: n <= 1 ? 'none' : `1px solid ${CAT[e.cat].color}`, borderRadius: 999, padding: '3px 9px', flexShrink: 0 }}>
                      {untilLabel(n)}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer note */}
        <div className="flex gap-2 mt-6" style={{ padding: '12px 14px', background: COLORS.surface, border: `1px solid ${COLORS.borderSoft}`, borderRadius: 12 }}>
          <Info size={15} style={{ color: COLORS.textFaint, flexShrink: 0, marginTop: 2 }} />
          <p style={{ fontSize: 12, color: COLORS.textFaint, lineHeight: 1.5 }}>
            ये तिथियां वर्ष 2026 के पंचांग पर आधारित हैं। चंद्र-आधारित पर्व की तारीख शहर व पंचांग-परंपरा (अमांत/पूर्णिमांत) के अनुसार एक दिन आगे-पीछे हो सकती है, और हर वर्ष बदलती है — अगले वर्ष के लिए नया पंचांग ज़रूर देखें। जयंती सूची में फ़िलहाल कुछ प्रमुख महापुरुष शामिल हैं; कोई और नाम जोड़ना हो तो बता दें।
          </p>
        </div>

      </div>
    </div>
  );
}
