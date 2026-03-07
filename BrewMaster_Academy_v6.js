import { useState, useEffect, useRef } from "react";

/* ── inject Google Fonts + global polish ─────────────────────────────────── */
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const GlobalStyles = () => /*#__PURE__*/_jsx("style", {
  children: `
    @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'DM Sans',sans-serif}
    ::-webkit-scrollbar{width:6px}::-webkit-scrollbar-track{background:#1a0800}::-webkit-scrollbar-thumb{background:#c8892a;border-radius:3px}
    @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
    @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
    @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}
    .fadeUp{animation:fadeUp .45s ease both}
    .brew-card:hover{transform:translateY(-3px);box-shadow:0 12px 36px rgba(0,0,0,0.16)!important}
    .nav-btn:hover{background:rgba(200,137,42,0.2)!important}
    .btn-primary:hover{filter:brightness(1.1);transform:translateY(-1px)}
    .btn-primary:active{transform:translateY(0)}
    input:focus,textarea:focus{border-color:#c8892a!important;box-shadow:0 0 0 3px rgba(200,137,42,0.15)}
    .quiz-opt:hover{border-color:#c8892a!important;background:#faf3e8!important}
  `
});
const C = {
  espresso: "#1a0800",
  roast: "#2d1200",
  mocha: "#4a1e00",
  caramel: "#c8892a",
  gold: "#e8a93a",
  cream: "#faf3e8",
  latte: "#f5e6cc",
  steam: "#e8d5b5",
  text: "#1a0800",
  muted: "#7a5c3a",
  white: "#ffffff",
  green: "#1a4a1a",
  teal: "#0d3d3d",
  navy: "#0d1a2d",
  success: "#166534",
  error: "#7f1d1d",
  warn: "#78350f"
};

/* ══════════════════════════════════════════════════════════════════════════
   DATA
══════════════════════════════════════════════════════════════════════════ */

const beanOrigins = [{
  id: "ethiopia",
  flag: "🇪🇹",
  country: "Ethiopia",
  region: "Yirgacheffe, Sidamo, Harrar",
  altitude: "1,500–2,200m",
  process: "Washed & Natural",
  flavor: ["Blueberry", "Jasmine", "Bergamot", "Lemon", "Peach"],
  roast: "Light–Medium",
  species: "Arabica",
  caffeine: "Low–Medium",
  bestFor: ["Pour Over", "Cold Brew", "Chemex"],
  color: "#1a4a1a",
  desc: "The undisputed birthplace of coffee. Ethiopian beans are legendary for their extraordinary floral and fruit complexity. Yirgacheffe — often called the Queen of Coffee — produces cups that taste like jasmine tea with blueberries. Natural-processed Harrars are intensely wine-like and berry-forward. This is where the Coffea arabica species first grew wild."
}, {
  id: "colombia",
  flag: "🇨🇴",
  country: "Colombia",
  region: "Huila, Nariño, Antioquia",
  altitude: "1,200–2,000m",
  process: "Washed",
  flavor: ["Caramel", "Hazelnut", "Red Apple", "Brown Sugar", "Mild Citrus"],
  roast: "Medium",
  species: "Arabica",
  caffeine: "Medium",
  bestFor: ["Espresso", "Drip", "Latte"],
  color: "#c8892a",
  desc: "Colombia's volcanic soil, mountainous terrain, and two annual harvests create the most consistently balanced, approachable coffees in the world. Smooth, sweet, and crowd-pleasing — it's the most universally loved origin and the perfect gateway into specialty coffee."
}, {
  id: "brazil",
  flag: "🇧🇷",
  country: "Brazil",
  region: "Minas Gerais, São Paulo, Bahia",
  altitude: "800–1,200m",
  process: "Natural & Pulped Natural",
  flavor: ["Dark Chocolate", "Peanut", "Low Acid", "Toffee", "Cedar"],
  roast: "Medium–Dark",
  species: "Arabica & Robusta",
  caffeine: "Medium–High",
  bestFor: ["Espresso Blends", "French Press", "Moka Pot"],
  color: "#5a2d0c",
  desc: "The world's largest coffee producer at over 35% of global output. Natural processing on flat terrain gives Brazilian coffee its trademark heavy body, low acidity, and rich chocolatey-nutty sweetness. The unchallenged backbone of most commercial espresso blends worldwide."
}, {
  id: "kenya",
  flag: "🇰🇪",
  country: "Kenya",
  region: "Kirinyaga, Nyeri, Murang'a",
  altitude: "1,400–2,000m",
  process: "Double Washed",
  flavor: ["Blackcurrant", "Grapefruit", "Wine", "Tomato", "Black Tea"],
  roast: "Light–Medium",
  species: "Arabica (SL28/SL34)",
  caffeine: "Medium",
  bestFor: ["Pour Over", "Aeropress", "Chemex"],
  color: "#7f1d1d",
  desc: "Kenyan coffee is bold, complex, and uncompromisingly bright — the barista world's secret obsession. The unique SL28 and SL34 varietals, developed by Scott Laboratories in the 1930s, produce the signature wine-like, blackcurrant intensity. The double-washing process amplifies the brightness to extraordinary levels."
}, {
  id: "arabia",
  flag: "🇸🇦",
  country: "Arabian Peninsula",
  region: "Yemen, Saudi Arabia, Oman",
  altitude: "1,000–2,500m",
  process: "Natural (Ancient Sun-Dried)",
  flavor: ["Cardamom", "Saffron", "Rose Water", "Dark Fruit", "Spice", "Earth"],
  roast: "Light–Medium (Qahwa) or Dark",
  species: "Arabica (Heirloom)",
  caffeine: "Low–Medium",
  bestFor: ["Arabic Coffee (Qahwa)", "Turkish Style", "Siphon"],
  color: "#78350f",
  desc: "The cradle of coffee culture. Arabian coffee — called Qahwa — has been brewed for over 600 years and is central to Arab hospitality. Traditionally brewed with cardamom, saffron, and rose water in a dallah (brass pot). Lightly roasted, golden-coloured, and served in small finjan cups. Refusing a cup is considered rude. Yemen's ancient Mocha port gave the world both mocha coffee and the name of the famous chocolatey drink."
}, {
  id: "sumatra",
  flag: "🇮🇩",
  country: "Sumatra (Indonesia)",
  region: "Aceh, Mandheling, Lintong",
  altitude: "1,000–1,500m",
  process: "Wet-Hulled (Giling Basah)",
  flavor: ["Dark Earth", "Cedar", "Tobacco", "Dark Chocolate", "Mushroom"],
  roast: "Medium–Dark",
  species: "Arabica",
  caffeine: "Medium",
  bestFor: ["French Press", "Espresso", "Dark Drip"],
  color: "#3d2010",
  desc: "Sumatran coffee is unlike anything else on earth — bold, earthy, and profoundly complex. The unique wet-hulled processing creates the signature musty, herbal, full-bodied character that polarises coffee drinkers. Those who love it, LOVE it passionately. Perfect for dark roast enthusiasts who want depth and adventure."
}, {
  id: "guatemala",
  flag: "🇬🇹",
  country: "Guatemala",
  region: "Antigua, Huehuetenango, Atitlán",
  altitude: "1,300–2,000m",
  process: "Washed",
  flavor: ["Dark Chocolate", "Clove", "Plum", "Brown Sugar", "Mild Acidity"],
  roast: "Medium–Dark",
  species: "Arabica",
  caffeine: "Medium",
  bestFor: ["Espresso", "Drip", "French Press"],
  color: "#2d4a1a",
  desc: "Guatemala's dramatic volcanic landscape and altitude variations produce coffees with a distinctive spiced dark chocolate character. Antigua's volcanic ash soil adds a unique smoky complexity. A sophisticated, full-bodied origin that punches far above its weight."
}, {
  id: "vietnam",
  flag: "🇻🇳",
  country: "Vietnam",
  region: "Dak Lak, Lam Dong, Buon Me Thuot",
  altitude: "500–1,500m",
  process: "Natural & Washed",
  flavor: ["Dark Chocolate", "Earth", "Very Bold", "Rubber", "Low Fruit"],
  roast: "Dark",
  species: "Robusta (85%) & Arabica",
  caffeine: "Very High",
  bestFor: ["Vietnamese Iced Coffee", "Espresso Blends", "Ca Phe Trung"],
  color: "#0d3d3d",
  desc: "The world's second-largest coffee producer and the undisputed king of Robusta. Vietnamese cà phê sữa đá (iced coffee with condensed milk) is one of humanity's great coffee inventions. The high-caffeine, bold Robusta beans are transformed by the slow phin drip and sweetened condensed milk into something extraordinary."
}, {
  id: "panama",
  flag: "🇵🇦",
  country: "Panama",
  region: "Boquete, Volcán, Renacimiento",
  altitude: "1,200–1,700m",
  process: "Washed & Natural",
  flavor: ["Jasmine", "Peach", "Tropical Fruit", "Honey", "Bergamot"],
  roast: "Light",
  species: "Gesha (Geisha) Arabica",
  caffeine: "Low",
  bestFor: ["Pour Over", "Siphon", "Cold Brew"],
  color: "#1e3a5f",
  desc: "Panama Gesha is the most celebrated — and expensive — coffee in the world. The Gesha varietal, originally from Ethiopia's Gori Gesha forest, found its perfect home on the slopes of Volcán Barú. At Hacienda La Esmeralda, it was rediscovered in 2004 and changed coffee history forever. Intensely floral, fruit-forward, and unlike any other coffee on earth."
}, {
  id: "costarica",
  flag: "🇨🇷",
  country: "Costa Rica",
  region: "Tarrazú, Tres Ríos, Naranjo",
  altitude: "1,200–1,900m",
  process: "Honey & Washed",
  flavor: ["Peach", "Honey", "Brown Sugar", "Mild Citrus", "Clean"],
  roast: "Light–Medium",
  species: "Arabica (only by law)",
  caffeine: "Low–Medium",
  bestFor: ["Pour Over", "Drip", "Chemex"],
  color: "#166534",
  desc: "Costa Rica is the only country in the world where it's illegal to grow Robusta — only Arabica is permitted. This commitment to quality pays off in cups that are clean, sweet, and perfectly balanced. The Honey process (leaving some fruit mucilage on during drying) gives Costa Rican coffees their signature peachy sweetness."
}, {
  id: "jamaica",
  flag: "🇯🇲",
  country: "Jamaica",
  region: "Blue Mountains",
  altitude: "900–1,700m",
  process: "Washed",
  flavor: ["Mild", "Sweet", "Clean", "Floral", "No Bitterness"],
  roast: "Light–Medium",
  species: "Arabica",
  caffeine: "Low–Medium",
  bestFor: ["Pour Over", "Drip", "Black Coffee"],
  color: "#155724",
  desc: "Jamaica Blue Mountain is one of the most prestigious and expensive coffees in the world. The cool, misty Blue Mountain climate — with its dramatic temperature swings — creates a uniquely gentle, mild, clean profile with almost zero bitterness. 80% of production is exported to Japan. Genuinely delicate and rare."
}, {
  id: "india",
  flag: "🇮🇳",
  country: "India",
  region: "Karnataka, Kerala, Tamil Nadu",
  altitude: "600–1,800m",
  process: "Monsooned (Malabar)",
  flavor: ["Low Acid", "Earthy", "Spice", "Dark Chocolate", "Woody"],
  roast: "Medium–Dark",
  species: "Arabica & Robusta",
  caffeine: "Medium",
  bestFor: ["Espresso Blends", "Filter Coffee", "Indian Style"],
  color: "#78350f",
  desc: "India's coffee heritage stretches back to the 1600s when Sufi saint Baba Budan smuggled seven coffee beans from Yemen. India's unique 'Monsooned Malabar' process — exposing green beans to monsoon winds — creates an ultra-low-acid, earthy, dramatically full-bodied coffee. India also invented the beloved 'filter kaapi' (drip coffee with chicory and milk)."
}, {
  id: "rwanda",
  flag: "🇷🇼",
  country: "Rwanda",
  region: "Lake Kivu, Nyamasheke, Huye",
  altitude: "1,500–2,000m",
  process: "Washed",
  flavor: ["Red Fruit", "Hibiscus", "Caramel", "Citrus", "Floral"],
  roast: "Light–Medium",
  species: "Arabica (Bourbon)",
  caffeine: "Medium",
  bestFor: ["Pour Over", "Aeropress", "Filter"],
  color: "#4a1942",
  desc: "Rwanda's coffee revolution is one of the great economic transformation stories of the 21st century. Grown around the shores of beautiful Lake Kivu, Rwandan coffees have risen from commodity to specialty darlings. The Bourbon varietal thrives here producing vibrant red-fruit, hibiscus-forward cups that are increasingly winning World Cup competitions."
}];
const coffeeTypes = [
// ESPRESSO CLASSICS
{
  id: "espresso",
  name: "Espresso",
  emoji: "☕",
  origin: "Italy, 1901",
  flavor: "Intense, bold, concentrated",
  caffeine: "63mg",
  time: "30 sec",
  category: "Espresso",
  subcat: "Classic",
  color: "#2d1200",
  beanOrigins: ["Brazil", "Colombia", "Ethiopia"],
  roastLevel: "Medium-Dark",
  desc: "The foundation of all espresso drinks. A 30ml concentrated shot at 9 bar through 18-20g of finely ground coffee. Rich crema and the heartbeat of every café.",
  notes: ["Always pre-warm your demitasse", "Tiger-striped crema = perfect extraction", "Doppio = double shot, 60ml", "Ristretto = shorter and sweeter"],
  recipe: {
    yield: "30ml",
    grind: "Fine",
    dose: "18-20g",
    temp: "93°C",
    pressure: "9 bar",
    time: "25-30s",
    ratio: "1:2",
    steps: ["Purge group head 3 sec", "Dose and distribute 18-20g evenly", "Tamp 30 lbs — level, no twist", "Lock portafilter, start immediately", "Stop at 30ml in 25-30 seconds", "Tiger-striped crema = success"]
  }
}, {
  id: "ristretto",
  name: "Ristretto",
  emoji: "☕",
  origin: "Italy",
  flavor: "Intensely sweet, zero bitterness",
  caffeine: "55mg",
  time: "20 sec",
  category: "Espresso",
  subcat: "Classic",
  color: "#1a0800",
  beanOrigins: ["Ethiopia", "Colombia", "Kenya"],
  roastLevel: "Light-Medium",
  desc: "Italian for 'restricted' — same dose, half the water. Only the sweetest compounds are extracted. The secret base of a great flat white.",
  notes: ["Only 15-20ml output", "Same dose, half the water", "Sweeter and less bitter than espresso", "Base drink in flat whites", "Finer grind than standard espresso"],
  recipe: {
    yield: "15-20ml",
    grind: "Fine (slightly finer than espresso)",
    dose: "18g",
    temp: "93°C",
    pressure: "9 bar",
    time: "15-20s",
    ratio: "1:1",
    steps: ["Grind slightly finer than espresso setting", "Dose and tamp 18g", "Start extraction", "Stop at exactly 15-20ml", "Very dark, syrupy, intensely sweet", "Taste — zero bitterness is the goal"]
  }
}, {
  id: "doppio",
  name: "Doppio",
  emoji: "☕",
  origin: "Italy",
  flavor: "Bold, balanced double shot",
  caffeine: "126mg",
  time: "30 sec",
  category: "Espresso",
  subcat: "Classic",
  color: "#3d1200",
  beanOrigins: ["Brazil", "Colombia", "Guatemala"],
  roastLevel: "Medium-Dark",
  desc: "Simply 'double' in Italian — 18-21g pulled as one extraction producing 60ml. The standard espresso served in most specialty cafés today.",
  notes: ["60ml output, one extraction", "More caffeine than standard shot", "Base of most café milk drinks", "Not two singles — one double pull", "More complex extraction than singles"],
  recipe: {
    yield: "60ml",
    grind: "Fine",
    dose: "18-21g",
    temp: "93°C",
    pressure: "9 bar",
    time: "25-30s",
    ratio: "1:2",
    steps: ["Load double basket with 18-21g", "Distribute and tamp evenly", "Lock in and extract", "Single stream should flow syrupy", "Stop at 60ml / 25-30 seconds", "Two streams merge = ideal"]
  }
}, {
  id: "lungo",
  name: "Lungo",
  emoji: "🫗",
  origin: "Italy",
  flavor: "Long, bold, slightly bitter",
  caffeine: "77mg",
  time: "45 sec",
  category: "Espresso",
  subcat: "Classic",
  color: "#4a2010",
  beanOrigins: ["Brazil", "Colombia", "Sumatra"],
  roastLevel: "Medium-Dark",
  desc: "Italian for 'long' — espresso pulled with double the water. More bitter as it extracts further into the bitter compounds. Preferred in Northern Europe.",
  notes: ["60-80ml output", "More bitter than standard espresso", "Popular in Scandinavia", "Not the same as Americano", "Grind slightly coarser than espresso"],
  recipe: {
    yield: "60-80ml",
    grind: "Fine (slightly coarser)",
    dose: "18g",
    temp: "93°C",
    pressure: "9 bar",
    time: "40-50s",
    ratio: "1:4",
    steps: ["Grind very slightly coarser than espresso", "Dose and tamp as normal", "Begin extraction", "Let shot run longer — 40-50 seconds", "Stop at 60-80ml", "Lighter colour, more bitter than espresso"]
  }
}, {
  id: "americano",
  name: "Americano",
  emoji: "🫖",
  origin: "WWII Italy",
  flavor: "Smooth, long, espresso-forward",
  caffeine: "77mg",
  time: "2 min",
  category: "Espresso",
  subcat: "Classic",
  color: "#3d1a00",
  beanOrigins: ["Colombia", "Brazil"],
  roastLevel: "Medium",
  desc: "Espresso diluted with hot water, born when American soldiers in WWII diluted Italian espresso to taste like home. Crema floats beautifully on top.",
  notes: ["Add water AFTER espresso, not before", "1:2 to 1:4 ratio", "Never add espresso to water — kills crema", "Iced version is extremely popular"],
  recipe: {
    yield: "180-240ml",
    grind: "Fine",
    dose: "18-20g",
    temp: "93°C",
    pressure: "9 bar",
    time: "2 min",
    ratio: "1:3",
    steps: ["Pull double espresso (60ml)", "Pre-heat cup, discard", "Pour espresso into warm cup", "Gently add 93°C water alongside", "Crema floats to top", "Serve with sparkling water optionally"]
  }
},
// MILK DRINKS
{
  id: "latte",
  name: "Caffè Latte",
  emoji: "🥛",
  origin: "USA (popularized)",
  flavor: "Creamy, mild, smooth",
  caffeine: "63mg",
  time: "4 min",
  category: "Milk-Based",
  subcat: "Steamed Milk",
  color: "#8B5E3C",
  beanOrigins: ["Colombia", "Brazil", "Guatemala"],
  roastLevel: "Medium",
  desc: "The world's most popular coffee. Espresso with generous steamed milk and thin microfoam. The perfect canvas for latte art.",
  notes: ["180-240ml is standard", "Silky microfoam — no bubbles", "Gateway drink for new coffee lovers", "Any non-dairy milk works great"],
  recipe: {
    yield: "240ml",
    grind: "Fine",
    dose: "18g",
    temp: "65°C milk",
    pressure: "9 bar",
    time: "4 min",
    ratio: "1:6",
    steps: ["Pull double espresso into latte cup", "Steam 200ml cold milk", "Stretch 3-4 sec at surface", "Whirlpool to 65°C / 150°F", "Tap and swirl vigorously", "Pour from low height at 45°"]
  }
}, {
  id: "cappuccino",
  name: "Cappuccino",
  emoji: "☕",
  origin: "Vienna/Italy",
  flavor: "Bold, frothy, perfectly balanced",
  caffeine: "63mg",
  time: "4 min",
  category: "Milk-Based",
  subcat: "Foamed Milk",
  color: "#6B3A2A",
  beanOrigins: ["Ethiopia", "Colombia", "Kenya"],
  roastLevel: "Medium",
  desc: "The classic Italian breakfast. Equal thirds: espresso, steamed milk, and thick foam. Never ordered after 11am by proper Italians.",
  notes: ["1:1:1 espresso:milk:foam ratio", "Dry = more foam / Wet = less foam", "Never after 11am in Italy", "Dust with cocoa — traditional", "Served in a pre-warmed 150-180ml cup"],
  recipe: {
    yield: "150-180ml",
    grind: "Fine",
    dose: "18g",
    temp: "60°C milk",
    pressure: "9 bar",
    time: "4 min",
    ratio: "1:3",
    steps: ["Pre-warm 180ml cup", "Pull double espresso", "Steam milk — 6-8s aggressive stretch", "Create thick dense foam, heat to 60°C", "Tap and swirl vigorously", "Pour liquid milk, spoon foam generously", "Dust with cocoa powder"]
  }
}, {
  id: "flatwhite",
  name: "Flat White",
  emoji: "☕",
  origin: "Australia/New Zealand",
  flavor: "Velvety, strong, coffee-forward",
  caffeine: "130mg",
  time: "4 min",
  category: "Milk-Based",
  subcat: "Steamed Milk",
  color: "#7a4a2a",
  beanOrigins: ["Colombia", "Ethiopia"],
  roastLevel: "Light-Medium",
  desc: "Born in 1980s Australia/NZ. Smaller, stronger than a latte. Double ristretto base makes it sweeter and more coffee-forward.",
  notes: ["Only 150ml — much smaller than latte", "Double ristretto base (sweeter)", "Thinnest microfoam of any milk drink", "Coffee-to-milk ratio strongly coffee-forward", "White dot latte art is traditional"],
  recipe: {
    yield: "150ml",
    grind: "Fine (ristretto)",
    dose: "18g",
    temp: "65°C milk",
    pressure: "9 bar",
    time: "4 min",
    ratio: "1:4",
    steps: ["Pull double ristretto (20ml)", "Steam 110ml cold milk", "Very fine microfoam — liquid velvet", "Target 65°C / 150°F", "Pour confidently from medium height", "Thin microfoam layer only"]
  }
}, {
  id: "cortado",
  name: "Cortado",
  emoji: "☕",
  origin: "Spain",
  flavor: "Bold, clean, minimally sweet",
  caffeine: "63mg",
  time: "3 min",
  category: "Milk-Based",
  subcat: "Equal Parts",
  color: "#5a3020",
  beanOrigins: ["Colombia", "Brazil", "Ethiopia"],
  roastLevel: "Medium",
  desc: "Spanish for 'cut' — espresso cut with an equal measure of warm milk to reduce acidity. Served in a small glass. The sophisticate's choice.",
  notes: ["1:1 espresso to milk ratio", "Served in a 4-5oz glass", "No foam — just warm milk", "Popular across Spain and Latin America", "The adult's flat white"],
  recipe: {
    yield: "60-80ml",
    grind: "Fine",
    dose: "18g",
    temp: "65°C milk",
    pressure: "9 bar",
    time: "3 min",
    ratio: "1:1",
    steps: ["Pull double espresso into a small glass", "Steam 30ml milk — minimal foam", "Heat to 65°C", "Pour warm milk into espresso", "Equal volumes of each", "No thick foam — this is not a cappuccino"]
  }
}, {
  id: "mocha",
  name: "Caffè Mocha",
  emoji: "🍫",
  origin: "Yemen/Italy",
  flavor: "Rich, chocolatey, indulgent",
  caffeine: "95mg",
  time: "5 min",
  category: "Specialty",
  subcat: "Sweet",
  color: "#2d1a10",
  beanOrigins: ["Colombia", "Brazil", "Ethiopia"],
  roastLevel: "Medium-Dark",
  desc: "Coffee meets chocolate. Named after the Yemeni port of Mocha. Espresso, steamed milk, and chocolate sauce — the world's most beloved sweet coffee.",
  notes: ["Dark chocolate gives best results", "White mocha = white chocolate sauce", "Named after Mocha port, Yemen", "Top with whipped cream and drizzle", "Can be served iced"],
  recipe: {
    yield: "300ml",
    grind: "Fine",
    dose: "18g",
    temp: "65°C milk",
    pressure: "9 bar",
    time: "5 min",
    ratio: "1:5",
    steps: ["Add 2 tbsp dark chocolate sauce to cup", "Pull double espresso over chocolate", "Stir vigorously — combine fully", "Steam 200ml milk to 65°C", "Pour milk over mocha base", "Top with whipped cream", "Drizzle chocolate spiral on top"]
  }
}, {
  id: "macchiato",
  name: "Espresso Macchiato",
  emoji: "☕",
  origin: "Italy",
  flavor: "Intense with a creamy touch",
  caffeine: "63mg",
  time: "2 min",
  category: "Milk-Based",
  subcat: "Marked",
  color: "#4a2010",
  beanOrigins: ["Ethiopia", "Kenya", "Colombia"],
  roastLevel: "Medium",
  desc: "Italian for 'stained' — espresso stained with a tiny dollop of foam. Almost entirely espresso. The original Italian version (not the caramel syrup version).",
  notes: ["Just 5ml of foam on espresso", "Very strong — 95%+ espresso", "NOT a caramel drizzle drink", "Served in a demitasse cup", "The original Italian version"],
  recipe: {
    yield: "35ml",
    grind: "Fine",
    dose: "18g",
    temp: "65°C milk",
    pressure: "9 bar",
    time: "2 min",
    ratio: "8:1",
    steps: ["Pull double espresso into demitasse", "Steam small amount of milk (50ml)", "Create dense foam", "Spoon just 1 teaspoon foam on top", "The foam marks the espresso", "Serve immediately — simple and powerful"]
  }
}, {
  id: "lattemacchiato",
  name: "Latte Macchiato",
  emoji: "🥛",
  origin: "Italy (modern)",
  flavor: "Layered, creamy, visual",
  caffeine: "63mg",
  time: "4 min",
  category: "Milk-Based",
  subcat: "Layered",
  color: "#9a6a3a",
  beanOrigins: ["Colombia", "Brazil"],
  roastLevel: "Medium",
  desc: "Reverse of espresso macchiato — milk stained by espresso. Famous for its three beautiful layers: foam, espresso, steamed milk.",
  notes: ["Three visible layers when done perfectly", "Pour espresso slowly over a spoon", "Served in a tall glass", "Instagram-famous for layers", "Stir before drinking"],
  recipe: {
    yield: "250ml",
    grind: "Fine",
    dose: "18g",
    temp: "65°C milk",
    pressure: "9 bar",
    time: "4 min",
    ratio: "1:5",
    steps: ["Steam 200ml milk with microfoam", "Pour steamed milk into tall glass first", "Wait 30 sec to let layers settle", "Pull single espresso", "Pour espresso slowly over back of a spoon", "Watch three layers form beautifully", "Serve with long spoon"]
  }
},
// COLD
{
  id: "coldbrew",
  name: "Cold Brew",
  emoji: "🧊",
  origin: "Japan/USA",
  flavor: "Smooth, sweet, ultra-low acid",
  caffeine: "200mg",
  time: "12-24 hrs",
  category: "Cold",
  subcat: "Immersion",
  color: "#1a3040",
  beanOrigins: ["Colombia", "Brazil", "Ethiopia"],
  roastLevel: "Medium",
  desc: "Brewed with cold water over 12-24 hours. The patience pays off — naturally sweet, silky smooth, triple the caffeine of drip. Revolutionised summer coffee.",
  notes: ["3x caffeine of drip coffee", "Good for 2 weeks refrigerated", "Dilute 1:1 with water or milk", "Never use hot water", "Coarsest grind of any method"],
  recipe: {
    yield: "500ml concentrate",
    grind: "Extra Coarse",
    dose: "100g",
    temp: "4°C cold water",
    pressure: "None",
    time: "12-24 hours",
    ratio: "1:5",
    steps: ["Coarsely grind 100g coffee", "Add to jar with 500ml cold filtered water", "Stir gently — saturate all grounds", "Cover and refrigerate 12-24 hours", "Strain through fine filter or cheesecloth", "Dilute 1:1 before serving over ice"]
  }
}, {
  id: "icedlatte",
  name: "Iced Latte",
  emoji: "🥤",
  origin: "USA",
  flavor: "Creamy, cold, refreshing",
  caffeine: "63mg",
  time: "3 min",
  category: "Cold",
  subcat: "Iced",
  color: "#6a4a2a",
  beanOrigins: ["Colombia", "Brazil"],
  roastLevel: "Medium",
  desc: "Hot espresso poured over ice with cold milk. The most popular cold coffee drink in the world. Simple, instant, perfect.",
  notes: ["Always use fresh ice — not old", "Oat milk creates amazing texture", "Double espresso recommended", "Flavoured syrups are very popular", "Don't shake — pour direct"],
  recipe: {
    yield: "300ml",
    grind: "Fine",
    dose: "18-20g",
    temp: "Cold milk",
    pressure: "9 bar",
    time: "3 min",
    ratio: "1:4",
    steps: ["Pull double espresso — let cool slightly", "Fill 12oz glass fully with fresh ice", "Pour 200ml cold milk over ice", "Add flavoured syrup if desired", "Pour hot espresso over ice and milk", "The hot-cold contrast is the magic", "Stir, serve immediately with straw"]
  }
}, {
  id: "nitrocold",
  name: "Nitro Cold Brew",
  emoji: "🍺",
  origin: "USA, 2013",
  flavor: "Velvety, creamy, naturally sweet",
  caffeine: "215mg",
  time: "24 hrs+",
  category: "Cold",
  subcat: "Nitrogen",
  color: "#0d1a2d",
  beanOrigins: ["Colombia", "Ethiopia", "Brazil"],
  roastLevel: "Medium",
  desc: "Cold brew infused with nitrogen gas — served from a tap like a Guinness. The cascade effect and thick creamy head are pure coffee theatre.",
  notes: ["No milk or sugar needed", "Cascading effect when poured", "Very high caffeine", "Never serve over ice — ruins cascade", "Starbucks popularised in 2016"],
  recipe: {
    yield: "350ml",
    grind: "Extra Coarse",
    dose: "100g",
    temp: "Cold",
    pressure: "Nitrogen gas",
    time: "24h brew + infusion",
    ratio: "1:5",
    steps: ["Brew cold brew concentrate (24 hrs)", "Strain through fine filter", "Dilute 1:1 with cold filtered water", "Pour into nitrogen canister/keg", "Charge with food-grade nitrogen", "Infuse 12-24 hours in fridge", "Pour at 45° angle — no ice", "Watch the cascade and cream head form"]
  }
}, {
  id: "dalgona",
  name: "Dalgona Coffee",
  emoji: "☁️",
  origin: "South Korea, 2020",
  flavor: "Sweet, foamy, cloud-like",
  caffeine: "63mg",
  time: "5 min",
  category: "Cold",
  subcat: "Whipped",
  color: "#3d2a1a",
  beanOrigins: ["Brazil", "Colombia"],
  roastLevel: "Medium-Dark",
  desc: "The viral 2020 lockdown sensation. Instant coffee whipped with sugar and hot water until thick and foamy, then spooned over cold milk. Cloud coffee.",
  notes: ["Instant coffee only — espresso won't whip", "Equal parts coffee:sugar:water", "Whip until stiff peaks form", "Spoon over cold milk — don't stir immediately", "Goes flat quickly — make and serve immediately"],
  recipe: {
    yield: "1 glass",
    grind: "Instant coffee (not ground)",
    dose: "2 tbsp instant coffee",
    temp: "Hot water for whipping, cold milk",
    pressure: "Hand whisk or electric mixer",
    time: "5 min",
    ratio: "1:1:1",
    steps: ["Add 2 tbsp instant coffee to bowl", "Add 2 tbsp white sugar", "Add 2 tbsp hot water", "Whisk vigorously 2-4 minutes (or electric mixer)", "Whip until stiff, glossy, caramel-coloured peaks", "Fill glass with ice and cold milk", "Spoon thick foam on top", "Photograph, then stir before drinking"]
  }
},
// MANUAL BREW
{
  id: "pourover",
  name: "Pour Over (V60)",
  emoji: "🫗",
  origin: "Germany, 1908",
  flavor: "Clean, bright, terroir-forward",
  caffeine: "80-100mg",
  time: "5 min",
  category: "Manual Brew",
  subcat: "Filter",
  color: "#1a4a1a",
  beanOrigins: ["Ethiopia", "Kenya", "Panama"],
  roastLevel: "Light-Medium",
  desc: "Manual brewing giving total control. The barista's meditation. Best for showcasing exceptional single-origin coffees. Every pour tells a story.",
  notes: ["Bloom is essential — 30 second wait", "Circular pouring matters", "Pre-wet filter removes paper taste", "Best for light roast single origins"],
  recipe: {
    yield: "250ml",
    grind: "Medium-Fine",
    dose: "15g",
    temp: "93-96°C",
    pressure: "Manual pour",
    time: "4-5 min",
    ratio: "1:16",
    steps: ["Rinse paper filter — discard water", "Add 15g medium-fine coffee", "Pour 30ml bloom water — wait 30 sec", "Watch grounds bubble and rise", "Pour in 3-4 gentle circular stages", "All water in by 3:30 — done by 4:30", "Flat grounds bed = even extraction"]
  }
}, {
  id: "frenchpress",
  name: "French Press",
  emoji: "🧃",
  origin: "France, 1929",
  flavor: "Rich, full-bodied, oily",
  caffeine: "80mg",
  time: "4 min",
  category: "Manual Brew",
  subcat: "Immersion",
  color: "#2d3d1a",
  beanOrigins: ["Brazil", "Sumatra", "Colombia"],
  roastLevel: "Medium-Dark",
  desc: "Full immersion brewing with no paper filter — all coffee oils end up in your cup. Creates rich, heavy, full-bodied texture that filter methods simply cannot replicate.",
  notes: ["Coarser grind is absolutely essential", "Steep exactly 4 minutes — not more", "Press slowly to avoid bitterness", "Pour immediately — don't let it sit", "Some sediment is normal and fine"],
  recipe: {
    yield: "350ml",
    grind: "Coarse (sea salt)",
    dose: "21g",
    temp: "95°C",
    pressure: "Manual press",
    time: "4 min",
    ratio: "1:16",
    steps: ["Warm French press, discard water", "Add 21g coarse coffee", "Pour 350ml 95°C water in one go", "Stir gently 3-4 times", "Lid on (plunger up) — wait exactly 4 min", "Press slowly — 20-30 seconds", "Pour immediately — never let it sit"]
  }
}, {
  id: "moka",
  name: "Moka Pot",
  emoji: "🫙",
  origin: "Italy, 1933",
  flavor: "Strong, bold, espresso-like",
  caffeine: "105mg",
  time: "5 min",
  category: "Manual Brew",
  subcat: "Stovetop",
  color: "#3d2d10",
  beanOrigins: ["Brazil", "Colombia", "Sumatra"],
  roastLevel: "Medium-Dark",
  desc: "Alfonso Bialetti's 1933 masterpiece. Found in virtually every Italian home. Steam pressure pushes water through coffee for a strong, bold, espresso-style brew without a machine.",
  notes: ["Never tamp or pack grounds", "Medium heat only — no rushing", "Listen for gurgling = done", "Classic Italian home brew method", "Bialetti is the iconic original brand"],
  recipe: {
    yield: "90ml",
    grind: "Medium-Fine",
    dose: "15-17g",
    temp: "Medium stovetop heat",
    pressure: "Steam (1-2 bar)",
    time: "5 min",
    ratio: "1:6",
    steps: ["Fill bottom chamber to below valve", "Medium-fine grind — between espresso and pour over", "Fill basket level — do NOT tamp", "Screw chambers together firmly", "Place on medium heat", "Lid open — watch and listen", "When gurgling starts: remove from heat", "Run cold water on base to stop brewing", "Serve immediately"]
  }
}, {
  id: "aeropress",
  name: "AeroPress",
  emoji: "🔬",
  origin: "USA, 2005",
  flavor: "Smooth, versatile, low acid",
  caffeine: "50-75mg",
  time: "2 min",
  category: "Manual Brew",
  subcat: "Pressure",
  color: "#1a2d4a",
  beanOrigins: ["Ethiopia", "Colombia", "Kenya"],
  roastLevel: "Light-Medium",
  desc: "Alan Adler's 2005 invention (also invented the Aerobie frisbee). The world's most versatile brewer — can mimic espresso or filter. Has a World Championship. Unbreakable, perfect for travel.",
  notes: ["World AeroPress Championship exists annually", "Inverted method gives more control", "Almost impossible to make a bad cup", "Perfect for travel — lightweight and durable", "Adjustable to suit any taste preference"],
  recipe: {
    yield: "200ml",
    grind: "Medium",
    dose: "17g",
    temp: "85-95°C",
    pressure: "Manual air pressure",
    time: "1:30-2 min",
    ratio: "1:12",
    steps: ["Place filter in cap — rinse thoroughly", "Assemble inverted (plunger at #4)", "Add 17g medium-ground coffee", "Pour 200ml 85°C water — fill to top", "Stir 10-15 times", "Cap with wet filter — press firmly to seal", "Wait 1 minute", "Flip onto cup quickly and confidently", "Press slowly — 20-30 seconds", "Hissing sound = done. Clean up easy."]
  }
},
// SPECIALTY & CULTURAL
{
  id: "vietnamesecoffee",
  name: "Vietnamese Iced Coffee",
  emoji: "🌟",
  origin: "Vietnam, 1800s",
  flavor: "Intensely sweet, strong, creamy",
  caffeine: "130mg",
  time: "5 min",
  category: "Specialty",
  subcat: "Cultural",
  color: "#2d1a00",
  beanOrigins: ["Vietnam (Robusta)", "Brazil"],
  roastLevel: "Dark",
  desc: "Cà phê sữa đá. French colonialism met Vietnamese ingenuity — condensed milk replaced unavailable fresh milk and created something transcendent. One of humanity's great coffee inventions.",
  notes: ["Condensed milk — never regular milk", "Phin filter is the traditional tool", "Robusta beans are essential", "Patience — 4 minute drip", "Global symbol of Vietnamese culture"],
  recipe: {
    yield: "200ml",
    grind: "Medium-Fine",
    dose: "20g",
    temp: "95°C",
    pressure: "Phin gravity drip",
    time: "5 min",
    ratio: "1:6",
    steps: ["Add 2-3 tbsp condensed milk to cup", "Place phin on cup", "Add 20g dark Robusta coffee", "Bloom 30ml water — wait 30 sec", "Add remaining 90ml water", "Wait 3-4 min for full drip", "Fill tall glass with ice", "Pour coffee over condensed milk", "Stir and pour entire mix over ice"]
  }
}, {
  id: "arabicqahwa",
  name: "Arabic Coffee (Qahwa)",
  emoji: "☕",
  origin: "Arabian Peninsula, 1400s",
  flavor: "Cardamom, saffron, floral, earthy",
  caffeine: "Low",
  time: "15 min",
  category: "Specialty",
  subcat: "Cultural",
  color: "#78350f",
  beanOrigins: ["Arabian Peninsula", "Ethiopia"],
  roastLevel: "Light (Qahwa style)",
  desc: "Over 600 years of history in a small cup. Qahwa is the soul of Arab hospitality — brewed with cardamom, saffron, and rose water in a brass dallah. Refusing a cup is culturally offensive.",
  notes: ["Saffron and cardamom are non-negotiable", "Brewed in a dallah (brass/copper pot)", "Served in small finjan cups (no handle)", "Refill guest's cup until they wiggle it", "UNESCO cultural heritage drink"],
  recipe: {
    yield: "4 small cups",
    grind: "Coarse",
    dose: "3 tbsp lightly roasted coffee",
    temp: "Gentle simmer — never boil",
    pressure: "None",
    time: "15 min",
    ratio: "1:10",
    steps: ["Bring 500ml water to gentle simmer in dallah", "Add 3 tbsp lightly roasted coarsely ground coffee", "Add 1 tsp ground cardamom", "Add a pinch of saffron threads (optional)", "Add 1 tsp rose water (optional)", "Simmer gently for 15 minutes — never boil", "Strain through fine mesh or cheesecloth", "Serve in small finjan cups — fill only half", "Offer dates alongside as is traditional", "Refill continuously — it's hospitality"]
  }
}, {
  id: "turkishcoffee",
  name: "Turkish Coffee",
  emoji: "🏺",
  origin: "Ottoman Empire, 1500s",
  flavor: "Thick, intense, spiced",
  caffeine: "50mg",
  time: "5 min",
  category: "Specialty",
  subcat: "Cultural",
  color: "#3d1a0d",
  beanOrigins: ["Ethiopian", "Colombian", "Yemen"],
  roastLevel: "Dark",
  desc: "One of humanity's oldest coffee preparations. Extra-fine grounds simmered in a cezve with water and sugar. Unfiltered, thick, traditional. A UNESCO Intangible Cultural Heritage.",
  notes: ["Never filter — sediment is correct", "Don't drink the last sip (all grounds)", "Cardamom optional but traditional", "Fortune telling from grounds is a tradition", "Served with Turkish delight and water"],
  recipe: {
    yield: "60ml",
    grind: "Extra Fine (powder fine)",
    dose: "7-8g per cup",
    temp: "Very low heat — never boil",
    pressure: "None",
    time: "4-5 min",
    ratio: "1:8",
    steps: ["Add 60ml cold water to cezve", "Add 7-8g extra-fine coffee", "Add sugar to taste (şekerli=sweet, orta=medium, sade=none)", "Add pinch of cardamom if desired", "Stir to combine BEFORE heating", "Place on very low heat — watch carefully", "As foam rises: remove immediately, spoon foam into cup", "Return to heat — let rise again", "Pour very slowly — grounds settle naturally", "Wait 3-4 min before drinking"]
  }
}, {
  id: "affogato",
  name: "Affogato",
  emoji: "🍨",
  origin: "Italy",
  flavor: "Ice cream drowned in espresso",
  caffeine: "63mg",
  time: "2 min",
  category: "Specialty",
  subcat: "Dessert",
  color: "#4a2d1a",
  beanOrigins: ["Ethiopia", "Colombia"],
  roastLevel: "Medium",
  desc: "Italian for 'drowned' — vanilla gelato drowned by a fresh hot espresso. Both dessert and coffee simultaneously. One of Italy's most genius inventions.",
  notes: ["Use gelato or quality vanilla ice cream", "Espresso must be fresh and hot", "Serve within 10 seconds of pulling shot", "Never stir — let it naturally melt", "Amaretto or Kahlúa optional upgrade"],
  recipe: {
    yield: "1 serving",
    grind: "Fine",
    dose: "18-20g",
    temp: "93°C",
    pressure: "9 bar",
    time: "2 min",
    ratio: "1:1 coffee to ice cream",
    steps: ["Chill a small bowl in freezer 5 minutes", "Add 1-2 scoops of vanilla gelato", "Pull fresh double espresso immediately", "Pour hot espresso directly over cold gelato", "Serve within seconds — the drama IS the dish", "Optional: add biscotti, amaretto shot", "Never stir — eat/drink immediately"]
  }
}, {
  id: "cafedolla",
  name: "Café de Olla",
  emoji: "🫕",
  origin: "Mexico",
  flavor: "Cinnamon, piloncillo, earthy, warm",
  caffeine: "80mg",
  time: "10 min",
  category: "Specialty",
  subcat: "Cultural",
  color: "#6B3A2A",
  beanOrigins: ["Colombian", "Guatemala"],
  roastLevel: "Medium-Dark",
  desc: "Mexico's beloved traditional coffee — brewed in a clay pot (olla) with cinnamon and piloncillo (unrefined brown sugar). Made since the Mexican Revolution. Simple, fragrant, and deeply comforting.",
  notes: ["Piloncillo = unrefined Mexican brown sugar", "Clay pot (olla) adds earthy mineral notes", "Cinnamon stick is essential", "Orange peel is a delicious optional addition", "Never add milk — drink black"],
  recipe: {
    yield: "2 cups",
    grind: "Coarse",
    dose: "3 tbsp medium-dark roast",
    temp: "Gentle simmer",
    pressure: "None",
    time: "10 min",
    ratio: "1:12",
    steps: ["Add 500ml water to clay pot or saucepan", "Add 1 cinnamon stick", "Add 2 tbsp piloncillo or dark brown sugar", "Bring to gentle boil — stir to dissolve sugar", "Once boiling, remove from heat", "Add 3 tbsp coarsely ground dark roast coffee", "Stir and steep 5 minutes", "Strain through fine mesh into cups", "Optional: add a strip of orange peel", "Serve black — no milk or cream"]
  }
},
// NEW DRINKS v6
{
  id: "chemex",
  name: "Chemex",
  emoji: "🔭",
  origin: "USA, 1941",
  flavor: "Crystal clear, delicate, wine-like",
  caffeine: "90mg",
  time: "6 min",
  category: "Manual Brew",
  subcat: "Filter",
  color: "#1e3d2a",
  beanOrigins: ["Ethiopia", "Kenya", "Panama"],
  roastLevel: "Light",
  desc: "Designed by chemist Peter Schlumbohm in 1941 — both a brewing device and a work of art. Its thick bonded filters remove all oils producing crystalline clarity. Displayed permanently in MoMA, New York.",
  notes: ["Thicker filter than V60 — removes more oils", "Best for light, delicate single origins", "Rinse filter with hot water before brewing", "Grind slightly coarser than pour over", "The hourglass shape is genuinely iconic"],
  recipe: {
    yield: "350ml",
    grind: "Medium-Coarse",
    dose: "21g",
    temp: "94°C",
    pressure: "Manual pour",
    time: "5-6 min",
    ratio: "1:16",
    steps: ["Fold Chemex bonded filter — triple layer toward spout", "Rinse with near-boiling water — discard completely", "Add 21g medium-coarse coffee", "Bloom: pour 42ml water, wait 45 seconds", "Pour slowly in concentric circles — fill halfway", "Continue in 2-3 slow gentle pours", "All water in by 4:30 — drain complete by 5:30", "Lift out filter — never squeeze it", "Crystal-clear, wine-like clarity in every cup"]
  }
}, {
  id: "irishcoffee",
  name: "Irish Coffee",
  emoji: "🥃",
  origin: "Ireland, 1943",
  flavor: "Whiskey warmth, cream float, rich",
  caffeine: "63mg",
  time: "5 min",
  category: "Specialty",
  subcat: "Cocktail",
  color: "#3d2010",
  beanOrigins: ["Colombia", "Brazil", "Ethiopia"],
  roastLevel: "Medium",
  desc: "Invented in 1943 by Joe Sheridan at Foynes Airport for cold transatlantic passengers. Hot coffee, Irish whiskey, brown sugar, and a thick cream float. A timeless cocktail-coffee masterpiece.",
  notes: ["Cream must FLOAT — never stir it in", "Pour cream over back of a warm spoon", "Brown sugar is essential — white won't do", "Jameson or Tullamore DEW are traditional", "Drink through the cold cream into hot coffee"],
  recipe: {
    yield: "240ml",
    grind: "Medium",
    dose: "Hot brewed coffee",
    temp: "Hot coffee + cold cream",
    pressure: "None",
    time: "5 min",
    ratio: "N/A",
    steps: ["Pre-warm Irish coffee glass with hot water, discard", "Add 1.5 tbsp brown sugar to warm glass", "Pour 180ml strong hot brewed coffee", "Add 40ml Irish whiskey", "Stir until sugar fully dissolved", "Pour 40ml cold heavy cream slowly over back of warm spoon", "Cream floats — do NOT stir", "Serve immediately — drink through the cream"]
  }
}, {
  id: "piccolo",
  name: "Piccolo Latte",
  emoji: "🫙",
  origin: "Australia",
  flavor: "Intense ristretto, velvety milk",
  caffeine: "63mg",
  time: "3 min",
  category: "Milk-Based",
  subcat: "Ristretto",
  color: "#5a2a10",
  beanOrigins: ["Ethiopia", "Colombia"],
  roastLevel: "Light-Medium",
  desc: "Italian for 'small' — a ristretto in a 100ml glass with velvety steamed milk. Smaller than a cortado, stronger than a flat white. Australia's elegant contribution to the world of espresso.",
  notes: ["Ristretto base is non-negotiable", "Only 100ml total — tiny and intense", "Served in a small glass tumbler, never a mug", "Higher espresso-to-milk ratio than any other milk drink", "Perfect for espresso lovers who want a hint of milk"],
  recipe: {
    yield: "100ml",
    grind: "Fine (ristretto)",
    dose: "18g",
    temp: "65°C milk",
    pressure: "9 bar",
    time: "3 min",
    ratio: "1:3",
    steps: ["Pull a double ristretto (18g in, 20ml yield)", "Steam 70ml cold whole milk", "Create ultra-fine microfoam — silky and perfectly glossy", "Target 65°C / 150°F — not hotter", "Pour into small 100ml glass tumbler", "Thin microfoam layer only — no thick foam cap"]
  }
}, {
  id: "shakerato",
  name: "Caffè Shakerato",
  emoji: "🍸",
  origin: "Italy",
  flavor: "Silky, iced, foam-crowned",
  caffeine: "126mg",
  time: "2 min",
  category: "Cold",
  subcat: "Shaken",
  color: "#1a1a3d",
  beanOrigins: ["Ethiopia", "Colombia", "Brazil"],
  roastLevel: "Medium",
  desc: "Italy's stylish summer answer to iced coffee. A double espresso shaken hard with ice and sugar syrup until thick silky foam forms — then strained into a chilled cocktail glass. Pure Italian cool.",
  notes: ["Shake HARD for at least 20 seconds", "The foam crown is the whole point", "A proper cocktail shaker is essential", "Strain through cocktail strainer — remove all ice", "Optional: Baileys, Amaretto, or hazelnut syrup"],
  recipe: {
    yield: "120ml",
    grind: "Fine",
    dose: "18-20g",
    temp: "Hot espresso + ice",
    pressure: "9 bar + cocktail shaker",
    time: "2 min",
    ratio: "N/A",
    steps: ["Pull double espresso immediately", "Add 1 tsp simple syrup to shaker", "Fill shaker with 8 ice cubes", "Pour hot espresso over ice", "Seal immediately and shake VERY hard for 20 seconds", "Strain through cocktail strainer into chilled coupe glass", "The foam crown forms naturally from shaking", "Serve immediately — magic lasts only 2 minutes"]
  }
}, {
  id: "egycoffee",
  name: "Vietnamese Egg Coffee",
  emoji: "🥚",
  origin: "Vietnam, 1946",
  flavor: "Custard, vanilla, dreamy, rich",
  caffeine: "90mg",
  time: "10 min",
  category: "Specialty",
  subcat: "Cultural",
  color: "#4a2d0d",
  beanOrigins: ["Vietnam (Robusta)", "Colombia"],
  roastLevel: "Dark",
  desc: "Invented by Nguyen Van Giang in 1946 at Hanoi's Sofitel when milk was scarce. Egg yolks whipped with condensed milk into thick custard foam, spooned over strong Robusta. Hanoi's most iconic coffee.",
  notes: ["Fresh egg yolks only — no egg white", "Whip until thick ribbon stage (4-5 minutes with mixer)", "Serve hot or iced — both are extraordinary", "Cafe Giang in Hanoi invented this and still serves it", "The foam-to-coffee ratio should be roughly 1:1"],
  recipe: {
    yield: "180ml",
    grind: "Medium-Fine Robusta",
    dose: "20g dark Robusta",
    temp: "Hot coffee + warm foam",
    pressure: "Phin or moka",
    time: "10 min",
    ratio: "1:1 coffee to foam",
    steps: ["Brew 90ml very strong dark Robusta coffee via phin", "Separate 2 egg yolks into mixing bowl", "Add 2 tbsp sweetened condensed milk", "Add 1 tsp sugar + 1 tsp vanilla extract", "Whip with electric mixer until pale, thick, ribbon-stage (4-5 min)", "Foam should hold soft peaks", "Pour hot strong coffee into heat-proof glass", "Gently spoon thick egg foam generously on top", "Do NOT mix — drink through the foam"]
  }
}, {
  id: "spanishlatte",
  name: "Spanish Latte",
  emoji: "🥛",
  origin: "Spain / Gulf Region",
  flavor: "Silky, sweet, layered, milky",
  caffeine: "63mg",
  time: "4 min",
  category: "Milk-Based",
  subcat: "Sweet",
  color: "#8B3a1a",
  beanOrigins: ["Colombia", "Brazil"],
  roastLevel: "Medium",
  desc: "Where Spanish café con leche meets Gulf coffee culture. Condensed milk on the bottom, steamed milk in the middle, espresso on top — three gorgeous layers. Wildly popular across UAE, Singapore, and Malaysia.",
  notes: ["Condensed milk on the bottom always", "Creates three beautiful visible layers", "Much sweeter than a regular latte", "Hugely popular in UAE, Singapore, Philippines", "Adjust condensed milk amount to taste preference"],
  recipe: {
    yield: "250ml",
    grind: "Fine",
    dose: "18-20g",
    temp: "65°C milk + condensed milk",
    pressure: "9 bar",
    time: "4 min",
    ratio: "1:5",
    steps: ["Spoon 2 tbsp sweetened condensed milk into glass", "Steam 160ml whole milk to silky microfoam at 65°C", "Gently pour steamed milk over condensed milk layer", "Three visible layers now in glass", "Pull double espresso — let cool 30 seconds", "Pour espresso slowly over back of a spoon on top", "Optional: caramel drizzle on top foam", "Stir just before drinking to combine all layers"]
  }
}, {
  id: "bonedrycap",
  name: "Bone Dry Cappuccino",
  emoji: "☁️",
  origin: "USA specialty scene",
  flavor: "Pure dry foam, intense espresso",
  caffeine: "63mg",
  time: "4 min",
  category: "Milk-Based",
  subcat: "Dry",
  color: "#2a1a0a",
  beanOrigins: ["Colombia", "Ethiopia", "Kenya"],
  roastLevel: "Medium",
  desc: "The barista's ultimate foam skill test. Zero steamed milk — only espresso and stiff, dry foam that stands above the cup. Also called a Dry Cap. Impossibly dense and light. Polarising and unforgettable.",
  notes: ["No liquid milk — ONLY foam", "Foam must be extremely stiff and meringue-like", "Takes real practice to achieve the right texture", "Eaten with a spoon as much as drunk", "Very intense pure espresso flavour — nothing hidden"],
  recipe: {
    yield: "120ml",
    grind: "Fine",
    dose: "18g",
    temp: "Near-freezing cold milk",
    pressure: "9 bar",
    time: "4 min",
    ratio: "N/A",
    steps: ["Start with very cold (near-freezing) whole milk", "Steam aggressively — maximum air stretching throughout", "Do not submerge wand to whirlpool — stay at surface", "Create extremely stiff, meringue-like dry foam", "Stop at 55°C (lower than regular milk drinks)", "Pull double espresso into warm 180ml cup", "Heap stiff foam generously on top", "Foam should stand clearly above cup rim", "Serve with a spoon — eat foam then sip espresso"]
  }
}];
const lessons = [
// BEGINNER
{
  id: "intro",
  title: "The Story of Coffee",
  icon: "🌱",
  level: "Beginner",
  category: "Foundation",
  duration: "10 min",
  content: "Coffee begins as a cherry-like fruit on trees in the 'Bean Belt' — the equatorial band between the Tropics of Cancer and Capricorn. Legend says Ethiopian goat herder Kaldi first noticed his goats dancing energetically after eating red berries in 900 AD. By the 1400s, Sufi monks in Yemen were brewing it for night prayers. By 1600, coffee houses (qahveh khaneh) were the internet of their day — centres of politics, gossip, and commerce. Today, 2.5 billion cups are drunk daily worldwide.",
  tips: ["Coffee is a fruit — grows on trees like cherries", "The Bean Belt circles the equator (23°N to 25°S)", "Ethiopia is the birthplace of all coffee", "Coffee houses were called 'Schools of the Wise' in 17th century", "2.5 billion cups consumed globally every single day"],
  quiz: {
    q: "Who is credited with first discovering coffee?",
    options: ["Arabian traders", "Kaldi the goat herder (Ethiopia)", "Italian espresso makers", "Dutch merchants"],
    answer: 1
  }
}, {
  id: "grind",
  title: "Grind Size Mastery",
  icon: "⚙️",
  level: "Beginner",
  category: "Foundation",
  duration: "15 min",
  content: "Grind size is THE most important variable in coffee — more than bean quality, water, or technique. The rule: the longer water contacts coffee, the coarser the grind. Espresso: 25 sec contact = fine grind. French press: 4 min = coarse. Cold brew: 12+ hrs = extra coarse. Too fine = over-extracted: bitter, harsh, astringent. Too coarse = under-extracted: sour, weak, watery. Always grind fresh — pre-ground coffee loses 70% of aromatics within 15 minutes of grinding.",
  tips: ["Fine = espresso, moka pot (25-30 sec brew)", "Medium-fine = pour over, AeroPress (3-5 min)", "Medium = drip machine (5-8 min)", "Coarse = French press (4 min)", "Extra Coarse = cold brew (12-24 hrs)", "Burr grinders = uniform particles. Blade grinders = chaos", "Grind fresh every time — never in advance", "Sour taste = grind finer | Bitter taste = grind coarser"],
  quiz: {
    q: "Your espresso tastes sour and watery. What should you do?",
    options: ["Grind coarser", "Use less coffee", "Grind finer", "Use hotter water"],
    answer: 2
  }
}, {
  id: "beans",
  title: "Arabica vs Robusta & Varietals",
  icon: "🌿",
  level: "Beginner",
  category: "Foundation",
  duration: "12 min",
  content: "Two species dominate world coffee. Arabica (Coffea arabica) makes up ~70% of production: smooth, complex, bright, grown at high altitude, lower caffeine. Robusta (Coffea canephora): ~30%, bold, bitter, earthy, higher caffeine, easier to grow, used in espresso blends and instant coffee. Within Arabica are hundreds of varietals: Gesha/Geisha (intensely floral, most expensive), Bourbon (sweet, fruity), Typica (clean, classic), SL28 (wine-like, Kenya), Heirloom Ethiopians (wild and complex).",
  tips: ["Arabica = complex, delicate, lower caffeine, higher price", "Robusta = bold, bitter, 2x caffeine, used in blends", "Gesha = most expensive Arabica — intensely floral", "SL28/SL34 = unique to Kenya, wine-like acidity", "Heirloom = ancient Ethiopian wild varieties", "Single origin = one location | Blend = multiple origins combined", "Natural process = fruity, wine-like | Washed = clean, bright"],
  quiz: {
    q: "Which species has roughly double the caffeine content?",
    options: ["Arabica", "Robusta", "Both are equal", "Gesha"],
    answer: 1
  }
}, {
  id: "roasting",
  title: "Roast Levels Explained",
  icon: "🔥",
  level: "Beginner",
  category: "Foundation",
  duration: "12 min",
  content: "Roasting transforms green, grassy beans into the aromatic coffee we love. As temperature rises, sugars caramelise (Maillard reaction) and complex flavours develop. Light roast (180-205°C): preserves origin flavours — fruity, floral, bright, higher acidity. Medium roast (205-230°C): balanced between origin and roast flavours — caramel, chocolate, balanced. Dark roast (230°C+): roast flavours dominate — smoky, bitter, heavy body, low acidity. Myth: light roast does NOT have less caffeine — it actually has slightly more.",
  tips: ["Light roast = best for single origins and pour over", "Dark roast = best for espresso blends and milk drinks", "Light roast has SLIGHTLY MORE caffeine than dark roast", "Oily beans = very dark roast (often stale)", "First crack = light roast begins | Second crack = dark roast", "Freshly roasted beans should rest 24-48 hours before brewing", "Best before date: within 2-4 weeks of roast date for espresso"],
  quiz: {
    q: "Which roast level preserves the most terroir (origin) flavour?",
    options: ["Dark roast", "Medium-dark roast", "Light roast", "Extra dark/French roast"],
    answer: 2
  }
}, {
  id: "water",
  title: "Water — The Forgotten Ingredient",
  icon: "💧",
  level: "Beginner",
  category: "Foundation",
  duration: "10 min",
  content: "Coffee is 98-99% water. Water quality dramatically affects your cup. Ideal TDS (Total Dissolved Solids): 75-150ppm — enough minerals for extraction but not so many it's harsh. Hard water causes over-extraction, scale buildup, and bitter notes. Soft water under-extracts and tastes flat. Never use distilled water (zero minerals = flat coffee, damages machines). Chlorinated tap water adds off-flavours. Ideal temperature: 93°C for espresso, 93-96°C for filter methods. Never use boiling water (100°C) — it scorches coffee.",
  tips: ["Filtered tap water is ideal in most cities", "Bottled spring water works well for coffee", "Ideal temp: 93°C for espresso, 93-96°C for filter", "Never use boiling water — scorches the coffee", "Distilled water = flat taste and damages machines", "Water TDS 75-150ppm is the sweet spot", "Hard water leaves scale — descale machine monthly"],
  quiz: {
    q: "What is the ideal brew temperature for espresso?",
    options: ["100°C (boiling)", "93°C", "75°C", "60°C"],
    answer: 1
  }
},
// INTERMEDIATE
{
  id: "tamp",
  title: "The Science of Tamping",
  icon: "🔨",
  level: "Intermediate",
  category: "Espresso Technique",
  duration: "15 min",
  content: "Tamping creates a level, uniformly dense coffee puck for water to flow through evenly. Uneven tamping causes channeling — water finds the path of least resistance, creating simultaneously over- and under-extracted espresso that tastes both sour and bitter. Technique: elbow at 90°, wrist straight, press straight down with 30 lbs of pressure. Never twist. The tamper must fit the basket perfectly (typically 58mm). A level tamp is more important than the exact pressure.",
  tips: ["30 lbs pressure = one hand pressing, consistent", "Elbow at 90°, wrist straight — use body weight", "Never twist the tamper — straight down only", "Level tamp matters MORE than exact pressure", "Tap portafilter sides to knock down loose grounds first", "Distribution tool before tamping = even grounds", "Polish the surface with a small horizontal spin at the end"],
  quiz: {
    q: "What is the main consequence of an uneven tamp?",
    options: ["Weak espresso", "Channeling — uneven extraction", "Bitter taste only", "Slow extraction"],
    answer: 1
  }
}, {
  id: "extraction",
  title: "Understanding Extraction",
  icon: "⏱️",
  level: "Intermediate",
  category: "Espresso Technique",
  duration: "20 min",
  content: "Extraction is pulling dissolved solids from coffee into water. The first compounds extracted are fruity acids (bright, sour). Then come the sweet sugars and body. Finally, bitter alkaloids. Perfect extraction hits the sweet middle. Under-extracted (< 18% yield): sour, hollow, weak. Over-extracted (>22% yield): bitter, harsh, dry, astringent. Golden ratio: 18g dose → 36g yield in 25-30 seconds (1:2 ratio). Taste the shot every time — this is how baristas learn. Change only ONE variable at a time.",
  tips: ["Sour = grind finer or brew longer", "Bitter = grind coarser or brew shorter", "18g dose → 36g yield in 25-30 seconds = ideal", "Pale blonde stream = stop immediately (over-extracting)", "Dark syrupy flow at start = good sign", "Taste every shot before adding milk", "Change ONE variable at a time when adjusting"],
  quiz: {
    q: "An over-extracted espresso typically tastes:",
    options: ["Sour and thin", "Bitter, harsh, and astringent", "Sweet and balanced", "Watery and mild"],
    answer: 1
  }
}, {
  id: "milk",
  title: "Steaming Milk to Perfection",
  icon: "💨",
  level: "Intermediate",
  category: "Milk Technique",
  duration: "20 min",
  content: "Perfect microfoam is velvety, glossy, and pours like liquid silk — essential for latte art and great milk drinks. Start with COLD milk. Phase 1 (Stretching): Steam wand just below the surface, open valve — a soft 'shhh' sound adds volume. Do this for only 3-4 seconds. Phase 2 (Texturing): Submerge wand slightly deeper at an angle to create a spinning whirlpool — this breaks large bubbles into microfoam. Heat to 65°C / 150°F. After steaming: tap pitcher firmly twice on counter and swirl vigorously for 15 seconds. The milk should look shiny and smooth like wet paint.",
  tips: ["ALWAYS start with cold milk from fridge", "Fill pitcher to just below the spout (never higher)", "Purge steam wand 1 second before AND after use", "Stretching: 3-4 seconds only — don't add too much air", "Listen: soft tearing paper sound = correct", "Loud sputtering = wand too deep, bring up", "Stop at 65°C — hot but hold 3 seconds test", "Tap HARD twice and swirl 15 seconds minimum", "Pour within 10 seconds — don't let it sit"],
  quiz: {
    q: "After steaming milk, why do you tap the pitcher and swirl?",
    options: ["To cool it down faster", "To break large bubbles and integrate microfoam", "To make it hotter", "It's just tradition — no real reason"],
    answer: 1
  }
}, {
  id: "dialin",
  title: "Dialling In Your Espresso",
  icon: "🎯",
  level: "Intermediate",
  category: "Espresso Technique",
  duration: "20 min",
  content: "Dialling in is the iterative process of adjusting variables to achieve perfect extraction with a specific coffee. Every new bag requires re-dialling. Start with: 18g dose, 36g yield, 25-30 seconds. If too slow (>30 sec) or too bitter: grind coarser. If too fast (<25 sec) or too sour: grind finer. Taste after every single change. Keep a notepad. Change one variable at a time. Humidity affects grind daily — what worked yesterday may not work today.",
  tips: ["Change ONE variable at a time — never two", "Keep a notepad: dose, yield, time, taste score", "New bag always needs re-dialling", "Morning humidity = finer grind often needed", "Measure yield by weight, not volume", "Blonde stream = stop immediately", "Consistent workflow = consistent shots every time", "Give each setting 3 shots before judging"],
  quiz: {
    q: "Your espresso runs too fast (under 20 seconds). What should you adjust?",
    options: ["Grind coarser", "Grind finer", "Use more coffee", "Use hotter water"],
    answer: 1
  }
}, {
  id: "flavors",
  title: "The Coffee Flavour Wheel",
  icon: "🎨",
  level: "Intermediate",
  category: "Tasting",
  duration: "15 min",
  content: "The SCA (Specialty Coffee Association) Flavour Wheel has 9 outer categories: Fruity (berry, citrus, stone fruit, tropical), Floral (jasmine, rose, elderflower), Sweet (caramel, chocolate, honey), Nutty/Cocoa, Spices, Roasted (cereal, smoky, tobacco), Green/Vegetative, Other/Chemical, and Sour/Fermented. Smell before tasting — 80% of flavour is aroma. Take small sips, slurp slightly (aerates), breathe out slowly through your nose while tasting. Let the coffee cool — hot temperature suppresses flavour perception.",
  tips: ["Smell before tasting — 80% of flavour is aroma", "Slurp like professionals — it aerates the coffee", "Let coffee cool to 60°C for best flavour detection", "Fruity notes = light roast | Chocolatey = medium | Smoky = dark", "Compare two coffees side-by-side to sharpen your palate", "Keep a tasting journal — describe what you experience", "Ethiopian coffees are the best training wheels for flavour education"],
  quiz: {
    q: "What percentage of coffee flavour perception comes from smell (aroma)?",
    options: ["20%", "50%", "80%", "100%"],
    answer: 2
  }
},
// ADVANCED
{
  id: "latteart",
  title: "Latte Art from Zero",
  icon: "🎨",
  level: "Advanced",
  category: "Milk Technique",
  duration: "30 min",
  content: "Latte art is the final 5% — it only works when espresso and milk are both perfect. Foundation requirements: fresh crema (never older than 30 sec) and microfoam that looks and pours like wet paint. Mechanics: tilt cup at 45°, start pouring from high (mixes milk into espresso), lower pitcher as cup fills, then tilt cup back to flat. Heart: pour into center until 3/4 full, push pitcher forward quickly through the circle to create the bottom point. Learning order: Heart (week 1) → Tulip (week 3) → Rosette (month 2+).",
  tips: ["Master milk steaming 100% before attempting art", "Fresh crema is essential — pour within 30 seconds", "High pour = mixing phase | Low pour = design phase", "The forward push creates the heart's bottom point", "Rosette = wiggle side-to-side while moving backward, then push through", "Practice with water + dish soap in a pitcher first", "Speed of pour = thickness of lines (slow = thicker white lines)"],
  quiz: {
    q: "What is the recommended learning order for latte art patterns?",
    options: ["Rosette → Heart → Tulip", "Tulip → Rosette → Heart", "Heart → Tulip → Rosette", "Start with rosette — it's the foundation"],
    answer: 2
  }
}, {
  id: "espressomachine",
  title: "Your Espresso Machine",
  icon: "🔧",
  level: "Advanced",
  category: "Equipment",
  duration: "25 min",
  content: "Modern espresso machines use a pump to generate 9 bar of pressure. Key components: boiler (heats water), group head (where portafilter locks in), portafilter (holds coffee puck), steam wand, solenoid valve (releases pressure after shot). Three machine types: Single Boiler (brew and steam share one boiler — can't do both simultaneously), Heat Exchange (HX: can steam while brewing via a coil inside the boiler), Dual Boiler (separate boilers for brew and steam — professional standard, best temperature stability). Daily maintenance: backflush, group head brush, purge wand.",
  tips: ["Flush group head 3 sec before every shot", "Backflush daily with water, weekly with detergent", "Descale monthly (depends on water hardness)", "9 bar during extraction = correct pressure", "Steam pressure: 1-1.5 bar ideal for most machines", "Dual boiler = most consistent temperature stability", "Pre-infusion (low pressure start) reduces channeling"],
  quiz: {
    q: "What is the correct extraction pressure for espresso?",
    options: ["3 bar", "6 bar", "9 bar", "15 bar"],
    answer: 2
  }
}, {
  id: "cupping",
  title: "Professional Coffee Cupping",
  icon: "👅",
  level: "Advanced",
  category: "Tasting",
  duration: "20 min",
  content: "Cupping is the standardised professional evaluation method used by buyers, roasters, competition judges, and baristas globally. SCA Protocol: 8.25g per 150ml water, 93°C. Pour and wait exactly 4 minutes. Break the crust (push grounds to back with spoon) — smell intensely. Skim off foam. Wait until temperature drops to 71°C. Begin tasting with a deep slurp, aspirating the coffee across your palate. Evaluate: Fragrance, Aroma, Flavour, Aftertaste, Acidity, Body, Balance, Uniformity, Clean Cup, Sweetness, Overall. Minimum 80 points = Specialty Grade.",
  tips: ["SCA standard: 8.25g per 150ml water", "Four minutes steep before breaking crust", "Slurp loudly and deeply — aerate across entire palate", "Taste when hot (70°C+), warm, and cool — flavours change significantly", "Specialty coffee minimum: 80+ points on 100-point scale", "Take written notes immediately — taste memory is short", "Cup the same coffee multiple times for reliability"],
  quiz: {
    q: "What minimum score on the SCA 100-point scale qualifies coffee as 'Specialty Grade'?",
    options: ["60 points", "70 points", "80 points", "90 points"],
    answer: 2
  }
}, {
  id: "pourovertechnique",
  title: "Pour Over Mastery",
  icon: "🫗",
  level: "Advanced",
  category: "Brewing Science",
  duration: "25 min",
  content: "Pour over brewing is a precision art. Every variable matters. The bloom (pre-infusion): pour 2x the coffee weight in water (30ml for 15g coffee), wait 30-45 seconds for CO2 to degas — this ensures even extraction. Pouring technique: start from the centre in slow concentric circles outward. Never pour directly on the filter walls. Multiple pours vs continuous pour each have merits. Grind size adjustment: for 1°C cooler water, grind 1 click finer. Water flow rate: aim for consistent 3-4ml/sec. The ideal grounds bed after brewing is flat — this indicates even extraction.",
  tips: ["Bloom ratio: 2x water to coffee weight (2:1)", "Wait 30-45 seconds bloom — fresh coffee bubbles more", "Pour from centre outward in concentric circles", "Never pour directly on paper filter walls", "Grind finer if brew drains faster than 3 minutes", "Grind coarser if brew takes longer than 5 minutes", "Flat grounds bed = even extraction — the goal", "Rinse filter with near-boiling water, discard it before brewing"],
  quiz: {
    q: "What does a flat grounds bed after pour over brewing indicate?",
    options: ["Under-extraction", "Uneven pouring technique", "Even, consistent extraction", "The coffee was ground too fine"],
    answer: 2
  }
}, {
  id: "sustainability",
  title: "Coffee Sustainability & Ethics",
  icon: "🌍",
  level: "Advanced",
  category: "Industry",
  duration: "15 min",
  content: "Coffee is the second most traded commodity globally after petroleum. The industry faces interconnected crises: climate change (projections suggest 50% of current growing regions will be unsuitable by 2050), farmer poverty (most earn under $1/day), deforestation, and water usage (140 litres needed per cup). Certifications: Fair Trade (guaranteed minimum price), Rainforest Alliance (environmental standards), Organic (no synthetic pesticides), Direct Trade (roaster buys direct from farmer — typically best farmer pay). Third wave specialty coffee champions transparency, farmer relationships, and living wages.",
  tips: ["Direct trade generally pays farmers 3-4x more than commodity price", "Shade-grown coffee preserves bird habitats and biodiversity", "Climate change threatens arabica growing regions significantly by 2050", "Supporting local specialty roasters often means better farmer outcomes", "Compost coffee grounds — excellent nitrogen-rich garden fertiliser", "Buy freshly roasted coffee: supports local economy and tastes better", "Ask your roaster where their coffee comes from — transparency matters"],
  quiz: {
    q: "What percentage of the retail coffee value do most farmers actually receive?",
    options: ["50%", "25%", "10%", "Less than 5%"],
    answer: 3
  }
}];
const glossary = [{
  term: "Crema",
  cat: "Espresso",
  def: "The golden-brown emulsion of CO₂ and coffee oils on top of fresh espresso. Tiger-striped crema = fresh beans and proper extraction. Dissolves within 2-3 minutes."
}, {
  term: "Bloom",
  cat: "Brewing",
  def: "Initial wetting of coffee grounds that releases trapped CO₂ gas. Causes grounds to bubble and expand ('bloom'). Essential step in pour over for even extraction."
}, {
  term: "Channeling",
  cat: "Espresso",
  def: "Water finding paths of least resistance through the coffee puck due to uneven tamping. Creates simultaneous over- and under-extraction. Shot tastes both sour and bitter."
}, {
  term: "Microfoam",
  cat: "Milk",
  def: "Perfectly steamed milk with microscopic bubbles creating a velvety, glossy texture. Should pour like liquid silk — no visible bubbles. Essential for latte art."
}, {
  term: "Ristretto",
  cat: "Espresso",
  def: "'Restricted' espresso using same dose but only half the water (15-20ml). Extracts only sweetest compounds. More concentrated, zero bitterness. The base of great flat whites."
}, {
  term: "Dose",
  cat: "Technique",
  def: "The mass of dry coffee grounds in grams. Standard double espresso: 18-20g. Always measure by weight, never by volume or scoops."
}, {
  term: "Yield",
  cat: "Technique",
  def: "The mass of liquid espresso extracted. Ideal ratio: 1:2 (18g dose = 36g yield). Measured by weight on a scale placed under the cup."
}, {
  term: "Extraction Yield %",
  cat: "Science",
  def: "Percentage of coffee solids dissolved into water during brewing. Ideal range: 18-22%. Under 18% = under-extracted (sour). Over 22% = over-extracted (bitter)."
}, {
  term: "TDS",
  cat: "Science",
  def: "Total Dissolved Solids — concentration of dissolved coffee in your brew. Ideal espresso TDS: 8-12%. Ideal filter coffee TDS: 1.2-1.5%."
}, {
  term: "Dialling In",
  cat: "Technique",
  def: "Iterative process of adjusting grind, dose, and yield to achieve perfect extraction with a specific coffee. Required every time you open a new bag."
}, {
  term: "Tamping",
  cat: "Technique",
  def: "Compressing coffee grounds in the portafilter with 30 lbs of even downward pressure to create a uniform puck for water to flow through evenly."
}, {
  term: "Terroir",
  cat: "Sourcing",
  def: "Environmental factors shaping coffee's flavour: altitude, soil composition, climate, rainfall, shade. Borrowed from wine. Explains why the same variety tastes different in different countries."
}, {
  term: "Single Origin",
  cat: "Sourcing",
  def: "Coffee from one specific location — country, region, farm, or even individual lot. Showcases unique terroir characteristics of that place. Opposite of a blend."
}, {
  term: "Direct Trade",
  cat: "Industry",
  def: "Roaster buys coffee directly from farmers/cooperatives without intermediaries. Typically results in significantly higher farmer income and better quality through closer relationships."
}, {
  term: "Third Wave Coffee",
  cat: "Industry",
  def: "Modern movement treating coffee as an artisanal, agricultural product (like wine or craft beer). Focus on origin, processing, roasting craft, and brewing precision."
}, {
  term: "Cupping",
  cat: "Tasting",
  def: "Standardised SCA method for evaluating coffee quality: coarse grounds steeped in hot water, crust broken at 4 minutes, then slurped and scored on a 100-point scale."
}, {
  term: "Acidity",
  cat: "Flavor",
  def: "In specialty coffee, acidity is positive — refers to brightness, liveliness, and fruit-like quality. Not pH sourness. Ethiopian and Kenyan coffees are celebrated for their vibrant acidity."
}, {
  term: "Body",
  cat: "Flavor",
  def: "The perceived weight, texture, and viscosity of coffee on your tongue. French press and espresso = heavy, coating body. Pour over = lighter, tea-like body."
}, {
  term: "Maillard Reaction",
  cat: "Science",
  def: "Chemical reaction between amino acids and reducing sugars under heat that creates coffee's complex flavours, aromas, and brown colour during roasting. Same process that browns bread and sears meat."
}, {
  term: "Pre-infusion",
  cat: "Espresso",
  def: "Brief low-pressure saturation of coffee grounds before full 9-bar extraction begins. Reduces channeling and produces more even extraction. Found in high-end machines."
}, {
  term: "Portafilter",
  cat: "Equipment",
  def: "The handle with filter basket that holds coffee grounds and locks into the group head. Professional portafilters are non-pressurised (naked or spouted)."
}, {
  term: "Burr Grinder",
  cat: "Equipment",
  def: "Grinder using two abrasive discs or cones to cut coffee into uniform particles. Flat burrs = even but heat. Conical burrs = quieter, less heat. Both far superior to blade grinders."
}, {
  term: "Qahwa",
  cat: "Culture",
  def: "Traditional Arabian/Middle Eastern coffee brewed with cardamom, saffron, and rose water. Central to Arab hospitality culture. Served in small finjan cups alongside dates."
}, {
  term: "Dallah",
  cat: "Culture",
  def: "Traditional Arabic brass or copper pot used to brew Qahwa. Characterised by its long curved spout. A cultural symbol of Arab hospitality and heritage."
}, {
  term: "Phin Filter",
  cat: "Equipment",
  def: "Traditional Vietnamese drip coffee filter — a small metal cup with a perforated bottom that sits on top of a glass. Coffee drips slowly through into sweetened condensed milk below."
}];
const checkerSuggestions = {
  espresso: ["18g finely ground Arabica coffee, filtered water at 93°C, pre-warmed demitasse cup, 9 bar espresso machine", "20g medium-dark roast ground fine, clean filtered water, espresso machine with portafilter"],
  latte: ["18g espresso, 200ml cold whole milk steamed to 65°C with microfoam, latte cup", "Double espresso, oat milk steamed to silky microfoam, vanilla syrup optional, 240ml cup"],
  cappuccino: ["18g espresso, 120ml whole milk steamed with thick foam (1:1:1 ratio), cocoa powder for dusting", "Double espresso, cold full-fat milk steamed to thick foam, 180ml pre-warmed cup"],
  americano: ["Double espresso (60ml), 150ml hot filtered water at 93°C, pre-warmed cup", "18g finely ground coffee, hot water at 93°C, no milk, no syrup"],
  flatwhite: ["Double ristretto (18g, 20ml yield), 110ml cold whole milk steamed to very fine microfoam, small 150ml ceramic cup", "Double ristretto shot, cold full-fat milk steamed velvety at 65°C, small cup"],
  mocha: ["Double espresso, 2 tablespoons dark chocolate sauce, 180ml steamed whole milk, whipped cream topping", "18g espresso, dark chocolate syrup, steamed milk at 65°C, cocoa powder dusting"],
  cappuccino: ["18g espresso, equal thirds steamed milk and thick foam, cocoa powder on top", "Double shot espresso, cold whole milk steamed aggressively for thick foam, 150-180ml cup"],
  coldbrew: ["100g coarsely ground coffee, 500ml cold filtered water, steep 12-24 hours refrigerated", "Coarse grind Arabica coffee, cold filtered water, mason jar or cold brew maker, fine mesh strainer"],
  pourover: ["15g medium-fine ground coffee, paper filter (rinsed), 250ml water at 94°C, V60 or Chemex dripper", "15g light roast single origin, gooseneck kettle, paper filter rinsed with hot water, 93°C filtered water"],
  frenchpress: ["21g coarsely ground coffee, 350ml water at 95°C, French press, 4-minute steep", "21g coarse grind, near-boiling filtered water, French press with clean plunger, digital timer"],
  vietnamesecoffee: ["20g dark Robusta coffee, phin filter, 2 tablespoons sweetened condensed milk, ice", "Vietnamese phin filter, coarsely ground Robusta or dark roast, sweetened condensed milk, ice cubes"],
  turkishcoffee: ["7g extra-fine powder-ground coffee, 60ml cold water, cezve (ibrik), very low heat, optional cardamom", "Extra-fine ground dark coffee, cold water, small copper cezve, optional sugar and cardamom"],
  affogato: ["Two scoops vanilla gelato, fresh double espresso pulled immediately, optional amaretto", "Quality vanilla ice cream, freshly pulled hot espresso, serve immediately while contrast is perfect"],
  icedlatte: ["Double espresso, 200ml cold whole milk, full glass of fresh ice, optional flavoured syrup", "Two shots espresso, cold oat milk, ice cubes, glass, optional vanilla or caramel syrup"],
  moka: ["15g medium-fine ground coffee (not tamped), cold water below the pressure valve, moka pot on medium heat", "15-17g medium-fine Arabica, cold filtered water to valve line, 3-cup Moka pot, stovetop medium heat"],
  dalgona: ["2 tablespoons instant coffee, 2 tablespoons white sugar, 2 tablespoons hot water, 200ml cold milk, ice", "Instant coffee (not ground), equal parts sugar and hot water, electric mixer, cold milk over ice"],
  arabicqahwa: ["3 tablespoons lightly roasted coarsely ground coffee, 500ml water, 1 tsp cardamom, pinch saffron, rose water, dallah pot", "Light roast Arabic coffee, ground cardamom, saffron threads, rose water, brass dallah, small finjan cups"],
  cafedolla: ["3 tablespoons coarse ground dark coffee, 500ml water, 1 cinnamon stick, 2 tablespoons piloncillo or dark brown sugar, clay pot", "Dark roast coarsely ground coffee, piloncillo (or dark brown sugar), cinnamon stick, fine mesh strainer"]
};

/* ══════════════════════════════════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════════════════════════════════ */
// ── ACHIEVEMENTS ────────────────────────────────────────────────────────────
const ACHIEVEMENTS = [{
  id: "first_brew",
  icon: "☕",
  title: "First Brew",
  desc: "Viewed your first coffee recipe",
  xp: 10
}, {
  id: "origin_explorer",
  icon: "🌍",
  title: "Origin Explorer",
  desc: "Explored 5+ bean origins",
  xp: 25
}, {
  id: "quiz_starter",
  icon: "🎯",
  title: "Quiz Starter",
  desc: "Answered your first quiz",
  xp: 15
}, {
  id: "quiz_master",
  icon: "🏆",
  title: "Quiz Master",
  desc: "Passed 5 quizzes correctly",
  xp: 50
}, {
  id: "perfect_score",
  icon: "💯",
  title: "Perfect Score",
  desc: "Got 100% on Component Checker",
  xp: 30
}, {
  id: "note_taker",
  icon: "📝",
  title: "Note Taker",
  desc: "Saved your first study note",
  xp: 10
}, {
  id: "streak_3",
  icon: "🔥",
  title: "3-Day Streak",
  desc: "Used BrewMaster 3 days in a row",
  xp: 20
}, {
  id: "streak_7",
  icon: "🔥",
  title: "7-Day Streak",
  desc: "Used BrewMaster 7 days in a row",
  xp: 75
}, {
  id: "barista_grad",
  icon: "🎓",
  title: "Barista Graduate",
  desc: "Completed all 15 lessons",
  xp: 100
}, {
  id: "globetrotter",
  icon: "✈️",
  title: "Globetrotter",
  desc: "Viewed all 13 bean origins",
  xp: 40
}, {
  id: "ai_chat",
  icon: "🤖",
  title: "AI Student",
  desc: "Had your first AI Barista conversation",
  xp: 10
}, {
  id: "checker_pro",
  icon: "🔍",
  title: "Checker Pro",
  desc: "Used Component Checker 5 times",
  xp: 25
}];
export default function BrewMasterAcademy() {
  var _checkerResult$correc, _checkerResult$issues, _checkerResult$missin, _checkerResult$sugges;
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [authMode, setAuthMode] = useState("signup");
  const [authForm, setAuthForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [authError, setAuthError] = useState("");
  const [authLoading, setAuthLoading] = useState(false);
  const [page, setPage] = useState("home");
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [selectedOrigin, setSelectedOrigin] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [notes, setNotes] = useState([]);
  const [noteTitle, setNoteTitle] = useState("");
  const [noteText, setNoteText] = useState("");
  const [chat, setChat] = useState([{
    role: "assistant",
    content: "☕ Hey! I'm Brew, your AI barista. Ask me anything — recipes, techniques, origins, equipment, or latte art tips!"
  }]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [coffeeFilter, setCoffeeFilter] = useState("All");
  const [coffeeSearch, setCoffeeSearch] = useState("");
  const [glossSearch, setGlossSearch] = useState("");
  const [checkerDrink, setCheckerDrink] = useState("");
  const [checkerIngredients, setCheckerIngredients] = useState("");
  const [checkerResult, setCheckerResult] = useState(null);
  const [checkerLoading, setCheckerLoading] = useState(false);
  const [newAchievement, setNewAchievement] = useState(null);
  const [progress, setProgress] = useState({
    xp: 0,
    streak: 0,
    lastActive: "",
    lessonsCompleted: [],
    originsViewed: [],
    recipesViewed: [],
    checkerUses: 0,
    achievements: [],
    isPro: false,
    proSince: ""
  });
  const chatEnd = useRef(null);
  useEffect(() => {
    loadUser();
    loadNotes("bma-notes-guest");
    loadProgress();
  }, []);
  useEffect(() => {
    if (user) {
      const key = `bma-notes-${user.email}`;
      window.storage.get(key).then(r => {
        const saved = r ? JSON.parse(r.value) : [];
        const merged = [...notes.filter(n => !saved.find(s => s.id === n.id)), ...saved];
        setNotes(merged);
        window.storage.set(key, JSON.stringify(merged)).catch(() => {});
      }).catch(() => {});
    }
  }, [user]);
  useEffect(() => {
    var _chatEnd$current;
    (_chatEnd$current = chatEnd.current) === null || _chatEnd$current === void 0 || _chatEnd$current.scrollIntoView({
      behavior: "smooth"
    });
  }, [chat]);
  async function loadUser() {
    try {
      const r = await window.storage.get("bma-user");
      if (r) setUser(JSON.parse(r.value));
    } catch {}
  }
  async function loadNotes(key) {
    try {
      const r = await window.storage.get(key);
      if (r) setNotes(JSON.parse(r.value));else setNotes([]);
    } catch {
      setNotes([]);
    }
  }
  function noteKey() {
    return user ? `bma-notes-${user.email}` : "bma-notes-guest";
  }
  async function saveNote() {
    if (!noteText.trim() && !noteTitle.trim()) return;
    const n = {
      id: Date.now(),
      title: noteTitle || "Untitled Note",
      text: noteText,
      date: new Date().toLocaleDateString()
    };
    const up = [n, ...notes];
    setNotes(up);
    try {
      await window.storage.set(noteKey(), JSON.stringify(up));
    } catch {}
    setNoteText("");
    setNoteTitle("");
    trackActivity("note", "note", progress);
  }
  async function deleteNote(id) {
    const up = notes.filter(n => n.id !== id);
    setNotes(up);
    try {
      await window.storage.set(noteKey(), JSON.stringify(up));
    } catch {}
  }
  async function loadProgress() {
    try {
      const r = await window.storage.get("bma-progress");
      if (r) setProgress(JSON.parse(r.value));
    } catch {}
  }
  async function saveProgress(p) {
    setProgress(p);
    try {
      await window.storage.set("bma-progress", JSON.stringify(p));
    } catch {}
  }
  function unlockAchievement(id, currentProgress) {
    if (currentProgress.achievements.includes(id)) return currentProgress;
    const a = ACHIEVEMENTS.find(x => x.id === id);
    if (!a) return currentProgress;
    const updated = {
      ...currentProgress,
      xp: currentProgress.xp + a.xp,
      achievements: [...currentProgress.achievements, id]
    };
    setNewAchievement(a);
    setTimeout(() => setNewAchievement(null), 4000);
    return updated;
  }
  function trackActivity(type, id, currentProgress) {
    let p = {
      ...currentProgress
    };
    const today = new Date().toDateString();
    // Streak
    if (p.lastActive !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      p.streak = p.lastActive === yesterday ? p.streak + 1 : 1;
      p.lastActive = today;
      if (p.streak === 3) p = unlockAchievement("streak_3", p);
      if (p.streak === 7) p = unlockAchievement("streak_7", p);
    }
    if (type === "recipe" && !p.recipesViewed.includes(id)) {
      p.recipesViewed = [...p.recipesViewed, id];
      p.xp += 2;
      if (p.recipesViewed.length === 1) p = unlockAchievement("first_brew", p);
    }
    if (type === "origin" && !p.originsViewed.includes(id)) {
      p.originsViewed = [...p.originsViewed, id];
      p.xp += 3;
      if (p.originsViewed.length >= 5) p = unlockAchievement("origin_explorer", p);
      if (p.originsViewed.length >= 13) p = unlockAchievement("globetrotter", p);
    }
    if (type === "lesson" && !p.lessonsCompleted.includes(id)) {
      p.lessonsCompleted = [...p.lessonsCompleted, id];
      p.xp += 20;
      if (p.lessonsCompleted.length >= 15) p = unlockAchievement("barista_grad", p);
    }
    if (type === "quiz") {
      p = unlockAchievement("quiz_starter", p);
      const passed = Object.values({
        ...quizAnswers,
        [id.lessonId]: id.answer
      }).filter((ans, i) => {
        const l = lessons[i];
        return l && ans === l.quiz.answer;
      }).length;
      if (passed >= 5) p = unlockAchievement("quiz_master", p);
    }
    if (type === "checker") {
      p.checkerUses = (p.checkerUses || 0) + 1;
      if (p.checkerUses >= 5) p = unlockAchievement("checker_pro", p);
      if (id === 100) p = unlockAchievement("perfect_score", p);
    }
    if (type === "note") p = unlockAchievement("note_taker", p);
    if (type === "chat") p = unlockAchievement("ai_chat", p);
    saveProgress(p);
    return p;
  }
  function activatePro() {
    const p = {
      ...progress,
      isPro: true,
      proSince: new Date().toLocaleDateString()
    };
    saveProgress(p);
    setShowUpgradeModal(false);
  }
  async function handleAuth(mode) {
    setAuthError("");
    if (mode === "signup") {
      if (!authForm.name.trim()) return setAuthError("Please enter your full name.");
      if (!authForm.email.includes("@")) return setAuthError("Please enter a valid email.");
      if (authForm.password.length < 6) return setAuthError("Password must be at least 6 characters.");
      if (authForm.password !== authForm.confirmPassword) return setAuthError("Passwords do not match.");
    } else {
      if (!authForm.email.includes("@")) return setAuthError("Please enter a valid email.");
      if (!authForm.password) return setAuthError("Please enter your password.");
    }
    setAuthLoading(true);
    try {
      if (mode === "signup") {
        const ex = await window.storage.get(`bma-acc-${authForm.email}`).catch(() => null);
        if (ex) {
          setAuthError("Email already registered. Please log in.");
          setAuthLoading(false);
          return;
        }
        const u = {
          name: authForm.name,
          email: authForm.email,
          password: authForm.password,
          joined: new Date().toLocaleDateString(),
          level: "Beginner"
        };
        await window.storage.set(`bma-acc-${authForm.email}`, JSON.stringify(u));
        let el = [];
        try {
          const r = await window.storage.get("bma-emails", true);
          if (r) el = JSON.parse(r.value);
        } catch {}
        if (!el.find(e => e.email === authForm.email)) {
          el.push({
            name: authForm.name,
            email: authForm.email,
            joined: new Date().toLocaleDateString()
          });
          await window.storage.set("bma-emails", JSON.stringify(el), true);
        }
        await window.storage.set("bma-user", JSON.stringify(u));
        setUser(u);
      } else {
        const r = await window.storage.get(`bma-acc-${authForm.email}`).catch(() => null);
        if (!r) {
          setAuthError("No account found. Please sign up.");
          setAuthLoading(false);
          return;
        }
        const u = JSON.parse(r.value);
        if (u.password !== authForm.password) {
          setAuthError("Incorrect password.");
          setAuthLoading(false);
          return;
        }
        await window.storage.set("bma-user", JSON.stringify(u));
        setUser(u);
      }
      setShowModal(false);
      setAuthForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
    } catch {
      setAuthError("Something went wrong. Please try again.");
    }
    setAuthLoading(false);
  }
  async function handleLogout() {
    try {
      await window.storage.delete("bma-user");
    } catch {}
    setUser(null);
    try {
      const r = await window.storage.get("bma-notes-guest");
      setNotes(r ? JSON.parse(r.value) : []);
    } catch {
      setNotes([]);
    }
  }
  function openAcademy() {
    if (!user) {
      setAuthMode("signup");
      setAuthForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
      });
      setAuthError("");
      setShowModal(true);
    } else setPage("academy");
  }
  async function runChecker() {
    if (!checkerDrink || !checkerIngredients.trim()) return;
    setCheckerLoading(true);
    setCheckerResult(null);
    const dk = coffeeComponents[checkerDrink] || Object.values(coffeeTypes).find(c => c.id === checkerDrink);
    const drinkInfo = coffeeComponents[checkerDrink];
    try {
      var _drinkInfo$required, _drinkInfo$optional, _drinkInfo$forbidden, _data$content;
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a professional barista expert. Respond ONLY with valid JSON — no markdown, no explanation.",
          messages: [{
            role: "user",
            content: `Expert barista analysis for: ${(drinkInfo === null || drinkInfo === void 0 ? void 0 : drinkInfo.name) || checkerDrink}
Required: ${drinkInfo === null || drinkInfo === void 0 || (_drinkInfo$required = drinkInfo.required) === null || _drinkInfo$required === void 0 ? void 0 : _drinkInfo$required.join(", ")}
Optional: ${drinkInfo === null || drinkInfo === void 0 || (_drinkInfo$optional = drinkInfo.optional) === null || _drinkInfo$optional === void 0 ? void 0 : _drinkInfo$optional.join(", ")}
Forbidden: ${drinkInfo === null || drinkInfo === void 0 || (_drinkInfo$forbidden = drinkInfo.forbidden) === null || _drinkInfo$forbidden === void 0 ? void 0 : _drinkInfo$forbidden.join(", ")}
Correct ratio: ${drinkInfo === null || drinkInfo === void 0 ? void 0 : drinkInfo.ratio} | Temp: ${drinkInfo === null || drinkInfo === void 0 ? void 0 : drinkInfo.temp} | Time: ${drinkInfo === null || drinkInfo === void 0 ? void 0 : drinkInfo.time}
Student listed: "${checkerIngredients}"
Respond ONLY with JSON:
{"status":"correct"|"minor_issues"|"major_issues"|"wrong","score":0-100,"summary":"one line","correct_items":["..."],"issues":[{"type":"error"|"warning"|"suggestion","item":"...","problem":"...","fix":"...","quick_fix_ingredients":"complete corrected ingredient list the student should use"}],"missing":["..."],"extra":["..."],"barista_tip":"one actionable tip","suggested_next_tries":["short description of variation 1","short description of variation 2"]}`
          }]
        })
      });
      const data = await res.json();
      const txt = (_data$content = data.content) === null || _data$content === void 0 ? void 0 : _data$content.map(b => b.text || "").join("").replace(/```json|```/g, "").trim();
      setCheckerResult(JSON.parse(txt));
    } catch {
      setCheckerResult({
        status: "error",
        summary: "Could not analyze. Please try again.",
        score: 0,
        correct_items: [],
        issues: [],
        missing: [],
        extra: [],
        barista_tip: "",
        suggested_next_tries: []
      });
    }
    setCheckerLoading(false);
    if (parsed) trackActivity("checker", "checker", progress);
  }
  async function sendChat() {
    if (!chatInput.trim() || chatLoading) return;
    const msg = chatInput.trim();
    setChatInput("");
    setChat(p => [...p, {
      role: "user",
      content: msg
    }]);
    setChatLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 900,
          system: "You are 'Brew' — expert barista, Q-grader, and coffee educator at BrewMaster Academy. Be passionate, practical, and encouraging. Use occasional coffee emojis ☕. Give clear, actionable answers. Short paragraphs or bullet points for lists.",
          messages: chat.filter((_, i) => i > 0).concat({
            role: "user",
            content: msg
          })
        })
      });
      const data = await res.json();
      setChat(p => {
        var _data$content2;
        return [...p, {
          role: "assistant",
          content: ((_data$content2 = data.content) === null || _data$content2 === void 0 ? void 0 : _data$content2.map(b => b.text || "").join("")) || "Connection issue — try again!"
        }];
      });
    } catch {
      setChat(p => [...p, {
        role: "assistant",
        content: "Connection issue. Please try again."
      }]);
    }
    setChatLoading(false);
  }
  const coffeeCategories = ["All", ...new Set(coffeeTypes.map(c => c.category))];
  const filteredCoffees = coffeeTypes.filter(c => (coffeeFilter === "All" || c.category === coffeeFilter) && c.name.toLowerCase().includes(coffeeSearch.toLowerCase()));
  const filteredGloss = glossary.filter(g => g.term.toLowerCase().includes(glossSearch.toLowerCase()) || g.def.toLowerCase().includes(glossSearch.toLowerCase()));
  const lessonLevels = ["All", "Beginner", "Intermediate", "Advanced"];
  const [lessonLevel, setLessonLevel] = useState("All");
  const filteredLessons = lessons.filter(l => lessonLevel === "All" || l.level === lessonLevel);

  // ── STYLES ───────────────────────────────────────────────────────────────
  const s = {
    app: {
      fontFamily: "'DM Sans',sans-serif",
      background: C.cream,
      minHeight: "100vh",
      color: C.text
    },
    nav: {
      background: "rgba(26,8,0,0.97)",
      backdropFilter: "blur(12px)",
      padding: "0 20px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 200,
      boxShadow: "0 1px 0 rgba(200,137,42,0.2)",
      minHeight: 60,
      gap: 10,
      flexWrap: "wrap"
    },
    logo: {
      color: C.gold,
      fontSize: 18,
      fontWeight: "700",
      cursor: "pointer",
      whiteSpace: "nowrap",
      fontFamily: "'Playfair Display',serif",
      letterSpacing: 0.5
    },
    navBtn: (a, locked) => ({
      background: a ? C.caramel : locked ? "rgba(200,137,42,0.1)" : "transparent",
      color: a ? C.white : locked ? C.gold : C.steam,
      border: locked ? `1px solid rgba(200,137,42,0.3)` : "none",
      padding: "5px 10px",
      borderRadius: 6,
      cursor: "pointer",
      fontSize: 11,
      fontWeight: a ? "600" : "400",
      transition: "all 0.2s",
      whiteSpace: "nowrap"
    }),
    section: {
      maxWidth: 1200,
      margin: "0 auto",
      padding: "44px 20px"
    },
    h1: {
      fontSize: "clamp(26px,4vw,42px)",
      fontWeight: "700",
      color: C.espresso,
      marginBottom: 8,
      fontFamily: "'Playfair Display',serif",
      lineHeight: 1.2
    },
    h2: {
      fontSize: "clamp(18px,3vw,28px)",
      fontWeight: "700",
      color: C.espresso,
      marginBottom: 8,
      fontFamily: "'Playfair Display',serif"
    },
    sub: {
      color: C.muted,
      fontSize: 13,
      marginBottom: 26,
      lineHeight: 1.6
    },
    card: {
      background: C.white,
      borderRadius: 16,
      padding: 22,
      boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
      cursor: "pointer",
      transition: "all 0.3s"
    },
    btn: (v = "primary", w = "auto") => ({
      background: v === "primary" ? `linear-gradient(135deg,${C.caramel},${C.gold})` : v === "dark" ? C.espresso : v === "success" ? "#166534" : "transparent",
      color: v === "outline" ? C.caramel : C.white,
      border: v === "outline" ? `2px solid ${C.caramel}` : "none",
      padding: "10px 20px",
      borderRadius: 9,
      cursor: "pointer",
      fontSize: 13,
      fontWeight: "600",
      transition: "all 0.2s",
      width: w,
      letterSpacing: 0.3
    }),
    input: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: 9,
      border: `1.5px solid ${C.steam}`,
      fontSize: 13,
      outline: "none",
      fontFamily: "'DM Sans',sans-serif",
      background: C.white,
      boxSizing: "border-box",
      transition: "border-color 0.2s, box-shadow 0.2s"
    },
    textarea: {
      width: "100%",
      padding: "11px 14px",
      borderRadius: 9,
      border: `1.5px solid ${C.steam}`,
      fontSize: 13,
      outline: "none",
      fontFamily: "'DM Sans',sans-serif",
      resize: "vertical",
      background: C.white,
      minHeight: 110,
      boxSizing: "border-box"
    },
    tag: (col = C.caramel) => ({
      background: col + "18",
      color: col,
      padding: "3px 10px",
      borderRadius: 20,
      fontSize: 10,
      fontWeight: "600",
      display: "inline-block",
      whiteSpace: "nowrap",
      letterSpacing: 0.3
    }),
    filterBtn: a => ({
      background: a ? C.espresso : C.white,
      color: a ? C.white : C.text,
      border: `1.5px solid ${a ? C.espresso : C.steam}`,
      padding: "6px 14px",
      borderRadius: 20,
      cursor: "pointer",
      fontSize: 11,
      fontWeight: a ? "600" : "400",
      transition: "all 0.2s"
    }),
    chatBubble: r => ({
      background: r === "user" ? `linear-gradient(135deg,${C.caramel},#b87820)` : C.white,
      color: r === "user" ? C.white : C.text,
      padding: "11px 15px",
      borderRadius: r === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
      maxWidth: "82%",
      alignSelf: r === "user" ? "flex-end" : "flex-start",
      boxShadow: "0 2px 10px rgba(0,0,0,0.09)",
      fontSize: 13,
      lineHeight: 1.65,
      whiteSpace: "pre-wrap"
    }),
    divider: {
      height: "1px",
      background: `linear-gradient(90deg,transparent,${C.steam},transparent)`,
      margin: "32px 0"
    }
  };

  // ── ACHIEVEMENT TOAST ──────────────────────────────────────────────────────
  const AchievementToast = () => newAchievement ? /*#__PURE__*/_jsxs("div", {
    className: "fadeUp",
    style: {
      position: "fixed",
      bottom: 24,
      right: 24,
      zIndex: 9999,
      background: `linear-gradient(135deg,${C.espresso},${C.mocha})`,
      border: `2px solid ${C.gold}`,
      borderRadius: 16,
      padding: "16px 20px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      maxWidth: 300,
      display: "flex",
      gap: 14,
      alignItems: "center"
    },
    children: [/*#__PURE__*/_jsx("div", {
      style: {
        fontSize: 36,
        flexShrink: 0
      },
      children: newAchievement.icon
    }), /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsx("div", {
        style: {
          color: C.gold,
          fontSize: 10,
          fontWeight: "700",
          letterSpacing: 1,
          marginBottom: 2
        },
        children: "ACHIEVEMENT UNLOCKED!"
      }), /*#__PURE__*/_jsx("div", {
        style: {
          color: C.white,
          fontWeight: "700",
          fontSize: 14,
          marginBottom: 2
        },
        children: newAchievement.title
      }), /*#__PURE__*/_jsx("div", {
        style: {
          color: C.steam,
          fontSize: 11
        },
        children: newAchievement.desc
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          color: C.caramel,
          fontSize: 11,
          fontWeight: "700",
          marginTop: 4
        },
        children: ["+", newAchievement.xp, " XP \u2728"]
      })]
    })]
  }) : null;

  // ── AD BANNER (shown to free users) ────────────────────────────────────────
  const AdBanner = () => !progress.isPro ? /*#__PURE__*/_jsxs("div", {
    style: {
      background: `linear-gradient(135deg,#0d1a2d,#1a0800)`,
      padding: "10px 20px",
      textAlign: "center",
      borderBottom: `1px solid rgba(200,137,42,0.2)`
    },
    children: [/*#__PURE__*/_jsxs("span", {
      style: {
        color: C.muted,
        fontSize: 12
      },
      children: ["\u2615 Upgrade to ", /*#__PURE__*/_jsx("strong", {
        style: {
          color: C.gold
        },
        children: "BrewMaster Pro"
      }), " \u2014 unlock all 15 lessons, progress tracking & badges "]
    }), /*#__PURE__*/_jsx("button", {
      onClick: () => setShowUpgradeModal(true),
      style: {
        background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
        color: C.white,
        border: "none",
        padding: "4px 14px",
        borderRadius: 20,
        fontSize: 11,
        fontWeight: "700",
        cursor: "pointer",
        marginLeft: 10
      },
      children: "Upgrade $4.99/mo \u2192"
    })]
  }) : null;

  // ── PRO UPGRADE MODAL ──────────────────────────────────────────────────────
  const UpgradeModal = () => /*#__PURE__*/_jsx("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16
    },
    onClick: e => {
      if (e.target === e.currentTarget) setShowUpgradeModal(false);
    },
    children: /*#__PURE__*/_jsxs("div", {
      className: "fadeUp",
      style: {
        background: C.white,
        borderRadius: 22,
        padding: "clamp(24px,5vw,40px)",
        width: "100%",
        maxWidth: 460,
        boxShadow: "0 24px 80px rgba(0,0,0,0.4)",
        position: "relative"
      },
      children: [/*#__PURE__*/_jsx("button", {
        onClick: () => setShowUpgradeModal(false),
        style: {
          position: "absolute",
          top: 14,
          right: 16,
          background: "none",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          color: C.muted
        },
        children: "\xD7"
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          textAlign: "center",
          marginBottom: 20
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 56,
            marginBottom: 10
          },
          children: "\uD83C\uDFC6"
        }), /*#__PURE__*/_jsx("h2", {
          style: {
            fontFamily: "'Playfair Display',serif",
            color: C.espresso,
            fontSize: 26,
            marginBottom: 6
          },
          children: "Go Pro. Brew Better."
        }), /*#__PURE__*/_jsx("p", {
          style: {
            color: C.muted,
            fontSize: 13,
            lineHeight: 1.7
          },
          children: "Unlock the complete barista education experience"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          background: `linear-gradient(135deg,${C.espresso},${C.mocha})`,
          borderRadius: 16,
          padding: "20px",
          marginBottom: 20
        },
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            textAlign: "center",
            marginBottom: 14
          },
          children: [/*#__PURE__*/_jsx("span", {
            style: {
              fontFamily: "'Playfair Display',serif",
              fontSize: 42,
              fontWeight: "700",
              color: C.gold
            },
            children: "$4.99"
          }), /*#__PURE__*/_jsx("span", {
            style: {
              color: C.steam,
              fontSize: 14
            },
            children: "/month"
          }), /*#__PURE__*/_jsx("div", {
            style: {
              color: C.muted,
              fontSize: 11,
              marginTop: 4
            },
            children: "7-day free trial \xB7 Cancel anytime"
          })]
        }), [["🎓", "Full Barista Academy — all 15 lessons"], ["🏆", "Achievement badges & XP system"], ["📊", "Progress dashboard & learning streaks"], ["🔥", "Daily streak tracking & motivation"], ["📜", "Certificate of completion"], ["⭐", "Priority AI Barista responses"], ["🗒️", "Notes sync across all devices"]].map(([i, t]) => /*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            gap: 10,
            marginBottom: 9,
            alignItems: "flex-start"
          },
          children: [/*#__PURE__*/_jsx("span", {
            style: {
              fontSize: 18,
              flexShrink: 0
            },
            children: i
          }), /*#__PURE__*/_jsx("span", {
            style: {
              color: C.steam,
              fontSize: 13
            },
            children: t
          })]
        }, t))]
      }), /*#__PURE__*/_jsx("button", {
        style: {
          background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
          color: C.white,
          border: "none",
          padding: "15px",
          borderRadius: 12,
          fontSize: 16,
          fontWeight: "700",
          cursor: "pointer",
          width: "100%",
          boxShadow: `0 6px 20px rgba(200,137,42,0.4)`,
          marginBottom: 10
        },
        onClick: activatePro,
        children: "\uD83D\uDE80 Start 7-Day Free Trial"
      }), /*#__PURE__*/_jsx("p", {
        style: {
          color: C.muted,
          fontSize: 11,
          textAlign: "center"
        },
        children: "No credit card required during trial \xB7 Cancel anytime \xB7 Keeps all your progress"
      })]
    })
  });

  // ── PROGRESS PAGE ──────────────────────────────────────────────────────────
  const ProgressPage = () => {
    const level = Math.floor(progress.xp / 100) + 1;
    const xpToNext = level * 100 - progress.xp;
    const xpPct = progress.xp % 100 / 100 * 100;
    return /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\uD83D\uDCCA Your Progress"
      }), /*#__PURE__*/_jsx("p", {
        style: s.sub,
        children: "Track your coffee education journey \u2014 XP, streaks, achievements, and milestones."
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
          gap: 14,
          marginBottom: 32
        },
        children: [{
          icon: "⭐",
          val: `${progress.xp} XP`,
          label: "Total XP"
        }, {
          icon: "🔥",
          val: `${progress.streak} days`,
          label: "Current Streak"
        }, {
          icon: "🎓",
          val: `${progress.lessonsCompleted.length}/15`,
          label: "Lessons Done"
        }, {
          icon: "🌍",
          val: `${progress.originsViewed.length}/13`,
          label: "Origins Viewed"
        }, {
          icon: "☕",
          val: `${progress.recipesViewed.length}`,
          label: "Recipes Explored"
        }, {
          icon: "🏆",
          val: `${progress.achievements.length}/${ACHIEVEMENTS.length}`,
          label: "Achievements"
        }].map(stat => /*#__PURE__*/_jsxs("div", {
          style: {
            background: C.white,
            borderRadius: 14,
            padding: "18px",
            textAlign: "center",
            boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
            borderTop: `3px solid ${C.caramel}`
          },
          children: [/*#__PURE__*/_jsx("div", {
            style: {
              fontSize: 28,
              marginBottom: 6
            },
            children: stat.icon
          }), /*#__PURE__*/_jsx("div", {
            style: {
              fontFamily: "'Playfair Display',serif",
              fontSize: 22,
              fontWeight: "700",
              color: C.espresso
            },
            children: stat.val
          }), /*#__PURE__*/_jsx("div", {
            style: {
              color: C.muted,
              fontSize: 11,
              marginTop: 3
            },
            children: stat.label
          })]
        }, stat.label))
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          background: C.white,
          borderRadius: 16,
          padding: 22,
          boxShadow: "0 2px 14px rgba(0,0,0,0.07)",
          marginBottom: 24
        },
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12
          },
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              style: {
                fontFamily: "'Playfair Display',serif",
                fontSize: 20,
                color: C.espresso,
                fontWeight: "700"
              },
              children: ["Level ", level, " Barista"]
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                color: C.muted,
                fontSize: 12
              },
              children: [xpToNext, " XP to next level"]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
              color: C.white,
              width: 52,
              height: 52,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "700",
              fontSize: 18
            },
            children: ["L", level]
          })]
        }), /*#__PURE__*/_jsx("div", {
          style: {
            background: C.latte,
            borderRadius: 8,
            height: 12,
            overflow: "hidden"
          },
          children: /*#__PURE__*/_jsx("div", {
            style: {
              background: `linear-gradient(90deg,${C.caramel},${C.gold})`,
              height: "100%",
              width: `${xpPct}%`,
              borderRadius: 8,
              transition: "width 0.5s ease"
            }
          })
        }), !progress.isPro && /*#__PURE__*/_jsxs("div", {
          style: {
            marginTop: 14,
            padding: "12px 14px",
            background: "rgba(200,137,42,0.08)",
            borderRadius: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          },
          children: [/*#__PURE__*/_jsxs("span", {
            style: {
              fontSize: 13,
              color: C.espresso
            },
            children: ["\uD83D\uDD12 Lessons & Badges require ", /*#__PURE__*/_jsx("strong", {
              children: "Pro"
            })]
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => setShowUpgradeModal(true),
            style: {
              background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
              color: C.white,
              border: "none",
              padding: "6px 16px",
              borderRadius: 20,
              fontSize: 12,
              fontWeight: "700",
              cursor: "pointer"
            },
            children: "Upgrade"
          })]
        })]
      }), /*#__PURE__*/_jsx("h3", {
        style: {
          ...s.h2,
          marginBottom: 14
        },
        children: "\uD83C\uDFC6 Achievements"
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))",
          gap: 12,
          marginBottom: 24
        },
        children: ACHIEVEMENTS.map(a => {
          const earned = progress.achievements.includes(a.id);
          return /*#__PURE__*/_jsx("div", {
            style: {
              background: earned ? C.white : "rgba(250,243,232,0.5)",
              borderRadius: 13,
              padding: "16px",
              border: `2px solid ${earned ? C.caramel : C.steam}`,
              opacity: earned ? 1 : 0.6,
              transition: "all 0.3s"
            },
            children: /*#__PURE__*/_jsxs("div", {
              style: {
                display: "flex",
                gap: 12,
                alignItems: "center"
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 28,
                  filter: earned ? "none" : "grayscale(1)"
                },
                children: a.icon
              }), /*#__PURE__*/_jsxs("div", {
                style: {
                  flex: 1
                },
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontWeight: "700",
                    fontSize: 13,
                    color: C.espresso
                  },
                  children: a.title
                }), /*#__PURE__*/_jsx("div", {
                  style: {
                    color: C.muted,
                    fontSize: 11,
                    marginTop: 2
                  },
                  children: a.desc
                }), /*#__PURE__*/_jsxs("div", {
                  style: {
                    color: earned ? C.caramel : C.muted,
                    fontSize: 11,
                    fontWeight: "600",
                    marginTop: 4
                  },
                  children: [earned ? "✅ Earned" : "🔒 Locked", " \xB7 ", a.xp, " XP"]
                })]
              })]
            })
          }, a.id);
        })
      }), progress.isPro && progress.lessonsCompleted.length >= 15 && /*#__PURE__*/_jsxs("div", {
        style: {
          background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
          borderRadius: 16,
          padding: "28px",
          textAlign: "center"
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 52,
            marginBottom: 8
          },
          children: "\uD83C\uDFC5"
        }), /*#__PURE__*/_jsx("h3", {
          style: {
            fontFamily: "'Playfair Display',serif",
            color: C.espresso,
            fontSize: 22,
            marginBottom: 6
          },
          children: "Certificate of Completion"
        }), /*#__PURE__*/_jsxs("p", {
          style: {
            color: C.espresso,
            opacity: 0.8,
            fontSize: 14,
            marginBottom: 12
          },
          children: ["This certifies that ", /*#__PURE__*/_jsx("strong", {
            children: (user === null || user === void 0 ? void 0 : user.name) || "you"
          }), " has completed the BrewMaster Academy Barista Course"]
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            color: C.espresso,
            fontSize: 12,
            opacity: 0.7
          },
          children: ["Completed on ", new Date().toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric"
          })]
        })]
      })]
    });
  };

  // ── AUTH MODAL ─────────────────────────────────────────────────────────────
  const AuthModal = () => /*#__PURE__*/_jsx("div", {
    style: {
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.75)",
      backdropFilter: "blur(4px)",
      zIndex: 1000,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: 16
    },
    onClick: e => {
      if (e.target === e.currentTarget) setShowModal(false);
    },
    children: /*#__PURE__*/_jsxs("div", {
      className: "fadeUp",
      style: {
        background: C.white,
        borderRadius: 22,
        padding: "clamp(24px,5vw,44px)",
        width: "100%",
        maxWidth: 420,
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        position: "relative"
      },
      children: [/*#__PURE__*/_jsx("button", {
        onClick: () => setShowModal(false),
        style: {
          position: "absolute",
          top: 14,
          right: 16,
          background: "none",
          border: "none",
          fontSize: 24,
          cursor: "pointer",
          color: C.muted,
          lineHeight: 1
        },
        children: "\xD7"
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          textAlign: "center",
          marginBottom: 24
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 52,
            marginBottom: 10
          },
          children: "\uD83C\uDF93"
        }), /*#__PURE__*/_jsx("h2", {
          style: {
            fontFamily: "'Playfair Display',serif",
            color: C.espresso,
            fontSize: 22,
            marginBottom: 6
          },
          children: authMode === "signup" ? "Join BrewMaster Academy" : "Welcome Back"
        }), /*#__PURE__*/_jsx("p", {
          style: {
            color: C.muted,
            fontSize: 13,
            lineHeight: 1.6
          },
          children: authMode === "signup" ? "Free account · Unlock Barista Academy + sync your notes" : "Continue your coffee journey"
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "flex",
          background: C.latte,
          borderRadius: 11,
          padding: 4,
          marginBottom: 20
        },
        children: [["signup", "Sign Up"], ["login", "Log In"]].map(([m, l]) => /*#__PURE__*/_jsx("button", {
          onClick: () => {
            setAuthMode(m);
            setAuthError("");
          },
          style: {
            flex: 1,
            padding: "8px",
            borderRadius: 8,
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: "600",
            background: authMode === m ? C.white : "transparent",
            color: authMode === m ? C.espresso : C.muted,
            boxShadow: authMode === m ? "0 1px 6px rgba(0,0,0,0.1)" : "none",
            transition: "all 0.2s"
          },
          children: l
        }, m))
      }), authMode === "signup" && /*#__PURE__*/_jsxs("div", {
        style: {
          marginBottom: 14
        },
        children: [/*#__PURE__*/_jsx("label", {
          style: {
            color: C.espresso,
            fontSize: 12,
            fontWeight: "600",
            display: "block",
            marginBottom: 5
          },
          children: "Full Name"
        }), /*#__PURE__*/_jsx("input", {
          className: "brew-input",
          style: s.input,
          placeholder: "Your full name",
          value: authForm.name,
          onChange: e => setAuthForm(p => ({
            ...p,
            name: e.target.value
          })),
          onKeyDown: e => e.key === "Enter" && handleAuth("signup")
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          marginBottom: 14
        },
        children: [/*#__PURE__*/_jsx("label", {
          style: {
            color: C.espresso,
            fontSize: 12,
            fontWeight: "600",
            display: "block",
            marginBottom: 5
          },
          children: "Email Address"
        }), /*#__PURE__*/_jsx("input", {
          style: s.input,
          type: "email",
          placeholder: "your@email.com",
          value: authForm.email,
          onChange: e => setAuthForm(p => ({
            ...p,
            email: e.target.value
          })),
          onKeyDown: e => e.key === "Enter" && handleAuth(authMode)
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          marginBottom: authMode === "signup" ? 14 : 22
        },
        children: [/*#__PURE__*/_jsx("label", {
          style: {
            color: C.espresso,
            fontSize: 12,
            fontWeight: "600",
            display: "block",
            marginBottom: 5
          },
          children: "Password"
        }), /*#__PURE__*/_jsx("input", {
          style: s.input,
          type: "password",
          placeholder: authMode === "signup" ? "Min. 6 characters" : "Your password",
          value: authForm.password,
          onChange: e => setAuthForm(p => ({
            ...p,
            password: e.target.value
          })),
          onKeyDown: e => e.key === "Enter" && handleAuth(authMode)
        })]
      }), authMode === "signup" && /*#__PURE__*/_jsxs("div", {
        style: {
          marginBottom: 22
        },
        children: [/*#__PURE__*/_jsx("label", {
          style: {
            color: C.espresso,
            fontSize: 12,
            fontWeight: "600",
            display: "block",
            marginBottom: 5
          },
          children: "Confirm Password"
        }), /*#__PURE__*/_jsx("input", {
          style: s.input,
          type: "password",
          placeholder: "Re-enter password",
          value: authForm.confirmPassword,
          onChange: e => setAuthForm(p => ({
            ...p,
            confirmPassword: e.target.value
          })),
          onKeyDown: e => e.key === "Enter" && handleAuth("signup")
        })]
      }), authError && /*#__PURE__*/_jsxs("div", {
        style: {
          background: "#fef2f2",
          border: "1.5px solid #fca5a5",
          borderRadius: 9,
          padding: "10px 14px",
          marginBottom: 14,
          color: "#7f1d1d",
          fontSize: 12
        },
        children: ["\u26A0\uFE0F ", authError]
      }), /*#__PURE__*/_jsx("button", {
        className: "btn-primary",
        style: {
          ...s.btn("primary", "100%"),
          padding: "13px",
          fontSize: 14
        },
        onClick: () => handleAuth(authMode),
        disabled: authLoading,
        children: authLoading ? "Processing..." : authMode === "signup" ? "Create Free Account 🚀" : "Sign In ☕"
      }), authMode === "signup" && /*#__PURE__*/_jsx("div", {
        style: {
          marginTop: 14,
          padding: "10px 12px",
          background: "#f0fdf4",
          border: "1px solid #86efac",
          borderRadius: 9,
          fontSize: 11,
          color: C.success
        },
        children: "\u2705 You'll receive coffee tips, new lessons, and barista guides by email"
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          marginTop: 14,
          padding: "10px 12px",
          background: C.latte,
          borderRadius: 9,
          fontSize: 11,
          color: C.muted,
          lineHeight: 1.8
        },
        children: [/*#__PURE__*/_jsx("span", {
          style: {
            color: C.success,
            fontWeight: "600"
          },
          children: "\u2705 Always Free:"
        }), " Coffee Types, Origins, Checker, AI Barista, Notes", /*#__PURE__*/_jsx("br", {}), /*#__PURE__*/_jsx("span", {
          style: {
            color: C.caramel,
            fontWeight: "600"
          },
          children: "\uD83C\uDF93 With Account:"
        }), " Barista Academy (15 Lessons + Quizzes)"]
      })]
    })
  });

  // ── DETAIL: ORIGIN ──────────────────────────────────────────────────────────
  if (selectedOrigin) {
    const o = selectedOrigin;
    return /*#__PURE__*/_jsxs("div", {
      style: s.app,
      children: [/*#__PURE__*/_jsx(GlobalStyles, {}), /*#__PURE__*/_jsxs("nav", {
        style: s.nav,
        children: [/*#__PURE__*/_jsx("span", {
          style: s.logo,
          onClick: () => setPage("home"),
          children: "\u2615 BrewMaster"
        }), /*#__PURE__*/_jsx("button", {
          onClick: () => setSelectedOrigin(null),
          style: {
            ...s.btn("dark"),
            padding: "6px 14px",
            fontSize: 12
          },
          children: "\u2190 Back"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          background: `linear-gradient(160deg,${o.color} 0%,${C.espresso} 100%)`,
          padding: "60px 20px",
          textAlign: "center"
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 76,
            marginBottom: 12
          },
          children: o.flag
        }), /*#__PURE__*/_jsx("h1", {
          style: {
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(30px,5vw,56px)",
            color: C.gold,
            marginBottom: 10
          },
          children: o.country
        }), /*#__PURE__*/_jsx("p", {
          style: {
            color: C.steam,
            fontSize: 15,
            maxWidth: 600,
            margin: "0 auto 24px",
            lineHeight: 1.8
          },
          children: o.desc
        }), /*#__PURE__*/_jsx("div", {
          style: {
            display: "flex",
            justifyContent: "center",
            gap: "clamp(16px,3vw,48px)",
            flexWrap: "wrap"
          },
          children: [["Region", o.region], ["Altitude", o.altitude], ["Process", o.process], ["Species", o.species], ["Caffeine", o.caffeine]].map(([k, v]) => /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                color: C.gold,
                fontWeight: "700",
                fontSize: 13,
                marginBottom: 3
              },
              children: v
            }), /*#__PURE__*/_jsx("div", {
              style: {
                color: C.muted,
                fontSize: 11
              },
              children: k
            })]
          }, k))
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: s.section,
        children: /*#__PURE__*/_jsxs("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 28
          },
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              style: {
                ...s.h2,
                marginBottom: 14
              },
              children: "\uD83D\uDC45 Flavor Profile"
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                marginBottom: 20
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 8,
                  marginBottom: 18
                },
                children: o.flavor.map(f => /*#__PURE__*/_jsx("span", {
                  style: {
                    background: o.color + "20",
                    color: o.color,
                    padding: "5px 13px",
                    borderRadius: 20,
                    fontSize: 13,
                    fontWeight: "600"
                  },
                  children: f
                }, f))
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 10
                },
                children: [["Roast", o.roast], ["Best For", o.bestFor.join(", ")]].map(([k, v]) => /*#__PURE__*/_jsxs("div", {
                  style: {
                    background: C.latte,
                    borderRadius: 10,
                    padding: "10px 13px"
                  },
                  children: [/*#__PURE__*/_jsx("div", {
                    style: {
                      fontSize: 10,
                      color: C.muted,
                      marginBottom: 2
                    },
                    children: k
                  }), /*#__PURE__*/_jsx("div", {
                    style: {
                      fontWeight: "600",
                      color: C.espresso,
                      fontSize: 12
                    },
                    children: v
                  })]
                }, k))
              })]
            }), /*#__PURE__*/_jsx("h2", {
              style: {
                ...s.h2,
                marginBottom: 14
              },
              children: "\u2615 Best Brew Methods"
            }), /*#__PURE__*/_jsx("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 22,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
              },
              children: o.bestFor.map((m, i) => /*#__PURE__*/_jsxs("div", {
                style: {
                  display: "flex",
                  gap: 12,
                  marginBottom: 11,
                  alignItems: "center"
                },
                children: [/*#__PURE__*/_jsx("span", {
                  style: {
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
                    color: C.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: "700",
                    flexShrink: 0
                  },
                  children: i + 1
                }), /*#__PURE__*/_jsx("span", {
                  style: {
                    fontSize: 14
                  },
                  children: m
                })]
              }, i))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("button", {
              style: {
                ...s.btn("primary", "100%"),
                marginBottom: 16
              },
              className: "btn-primary",
              onClick: () => {
                setNoteTitle(`Origin: ${o.country} ${o.flag}`);
                setNoteText(`ORIGIN: ${o.country}\nRegion: ${o.region}\nAltitude: ${o.altitude}\nProcess: ${o.process}\nSpecies: ${o.species}\nRoast: ${o.roast}\nFlavors: ${o.flavor.join(", ")}\nBest For: ${o.bestFor.join(", ")}\n\n${o.desc}`);
                setSelectedOrigin(null);
                setPage("notes");
              },
              children: "\uD83D\uDCDD Save to My Notes"
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                background: `linear-gradient(135deg,${C.espresso},${C.mocha})`,
                borderRadius: 16,
                padding: 24
              },
              children: [/*#__PURE__*/_jsx("h3", {
                style: {
                  color: C.gold,
                  marginBottom: 12,
                  fontFamily: "'Playfair Display',serif",
                  fontSize: 17
                },
                children: "Coffee from this origin works great in:"
              }), o.bestFor.map((m, i) => /*#__PURE__*/_jsxs("div", {
                style: {
                  color: C.steam,
                  fontSize: 13,
                  padding: "5px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.08)"
                },
                children: ["\u2192 ", m]
              }, i))]
            })]
          })]
        })
      }), showModal && /*#__PURE__*/_jsx(AuthModal, {}), showUpgradeModal && /*#__PURE__*/_jsx(UpgradeModal, {}), /*#__PURE__*/_jsx(AchievementToast, {})]
    });
  }

  // ── DETAIL: COFFEE ───────────────────────────────────────────────────────────
  if (selectedCoffee) {
    const c = selectedCoffee;
    return /*#__PURE__*/_jsxs("div", {
      style: s.app,
      children: [/*#__PURE__*/_jsx(GlobalStyles, {}), /*#__PURE__*/_jsxs("nav", {
        style: s.nav,
        children: [/*#__PURE__*/_jsx("span", {
          style: s.logo,
          onClick: () => setPage("home"),
          children: "\u2615 BrewMaster"
        }), /*#__PURE__*/_jsx("button", {
          onClick: () => setSelectedCoffee(null),
          style: {
            ...s.btn("dark"),
            padding: "6px 14px",
            fontSize: 12
          },
          children: "\u2190 Back"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          background: `linear-gradient(160deg,${c.color} 0%,${C.espresso} 100%)`,
          padding: "60px 20px",
          textAlign: "center"
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 72,
            marginBottom: 10
          },
          children: c.emoji
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            gap: 6,
            justifyContent: "center",
            marginBottom: 12,
            flexWrap: "wrap"
          },
          children: [/*#__PURE__*/_jsx("span", {
            style: s.tag(C.gold),
            children: c.category
          }), /*#__PURE__*/_jsx("span", {
            style: s.tag(),
            children: c.subcat
          })]
        }), /*#__PURE__*/_jsx("h1", {
          style: {
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(28px,5vw,54px)",
            color: C.gold,
            marginBottom: 10
          },
          children: c.name
        }), /*#__PURE__*/_jsx("p", {
          style: {
            color: C.steam,
            fontSize: 14,
            maxWidth: 600,
            margin: "0 auto 22px",
            lineHeight: 1.8
          },
          children: c.desc
        }), /*#__PURE__*/_jsx("div", {
          style: {
            display: "flex",
            justifyContent: "center",
            gap: "clamp(14px,3vw,44px)",
            flexWrap: "wrap"
          },
          children: [["🌍", c.origin, "Origin"], ["⚡", c.caffeine, "Caffeine"], ["⏱️", c.time, "Time"], ["👅", c.flavor, "Flavor"]].map(([icon, v, k]) => /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsxs("div", {
              style: {
                color: C.gold,
                fontWeight: "700",
                fontSize: 13,
                marginBottom: 3
              },
              children: [icon, " ", v]
            }), /*#__PURE__*/_jsx("div", {
              style: {
                color: C.muted,
                fontSize: 11
              },
              children: k
            })]
          }, k))
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: s.section,
        children: /*#__PURE__*/_jsxs("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 28
          },
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              style: {
                ...s.h2,
                marginBottom: 14
              },
              children: "\uD83D\uDCCB Full Recipe"
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 24,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                marginBottom: 22
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 9,
                  marginBottom: 20
                },
                children: [["Yield", c.recipe.yield], ["Grind", c.recipe.grind], ["Dose", c.recipe.dose], ["Temp", c.recipe.temp], ["Pressure", c.recipe.pressure], ["Time", c.recipe.time], ["Ratio", c.recipe.ratio]].map(([k, v]) => /*#__PURE__*/_jsxs("div", {
                  style: {
                    background: C.latte,
                    borderRadius: 9,
                    padding: "9px 12px"
                  },
                  children: [/*#__PURE__*/_jsx("div", {
                    style: {
                      fontSize: 9,
                      color: C.muted,
                      marginBottom: 2,
                      fontWeight: "600",
                      letterSpacing: 0.5
                    },
                    children: k.toUpperCase()
                  }), /*#__PURE__*/_jsx("div", {
                    style: {
                      fontWeight: "600",
                      color: C.espresso,
                      fontSize: 12
                    },
                    children: v
                  })]
                }, k))
              }), /*#__PURE__*/_jsx("h3", {
                style: {
                  color: C.caramel,
                  marginBottom: 14,
                  fontSize: 14,
                  fontWeight: "700",
                  letterSpacing: 0.5
                },
                children: "STEP-BY-STEP"
              }), c.recipe.steps.map((step, i) => /*#__PURE__*/_jsxs("div", {
                style: {
                  display: "flex",
                  gap: 10,
                  marginBottom: 11,
                  alignItems: "flex-start"
                },
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    width: 24,
                    height: 24,
                    borderRadius: "50%",
                    background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
                    color: C.white,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: "700",
                    flexShrink: 0
                  },
                  children: i + 1
                }), /*#__PURE__*/_jsx("p", {
                  style: {
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.7,
                    color: C.text
                  },
                  children: step
                })]
              }, i))]
            }), c.beanOrigins && /*#__PURE__*/_jsxs("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 22,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
              },
              children: [/*#__PURE__*/_jsx("h3", {
                style: {
                  color: C.espresso,
                  marginBottom: 14,
                  fontSize: 14,
                  fontWeight: "700"
                },
                children: "\uD83E\uDED8 Best Bean Origins for this Drink"
              }), c.beanOrigins.map((origin, i) => {
                var _o$flavor;
                const o = beanOrigins.find(b => b.country === origin || b.country.includes(origin));
                return /*#__PURE__*/_jsxs("div", {
                  onClick: () => {
                    setSelectedCoffee(null);
                    setSelectedOrigin(o);
                  },
                  style: {
                    display: "flex",
                    gap: 12,
                    marginBottom: 10,
                    alignItems: "center",
                    cursor: "pointer",
                    padding: "10px 12px",
                    borderRadius: 10,
                    background: C.latte,
                    transition: "all 0.2s"
                  },
                  children: [/*#__PURE__*/_jsx("span", {
                    style: {
                      fontSize: 24
                    },
                    children: (o === null || o === void 0 ? void 0 : o.flag) || "🌍"
                  }), /*#__PURE__*/_jsxs("div", {
                    children: [/*#__PURE__*/_jsx("div", {
                      style: {
                        fontWeight: "600",
                        fontSize: 13
                      },
                      children: origin
                    }), /*#__PURE__*/_jsx("div", {
                      style: {
                        color: C.muted,
                        fontSize: 11
                      },
                      children: (o === null || o === void 0 || (_o$flavor = o.flavor) === null || _o$flavor === void 0 ? void 0 : _o$flavor.slice(0, 2).join(", ")) || ""
                    })]
                  }), /*#__PURE__*/_jsx("span", {
                    style: {
                      marginLeft: "auto",
                      color: C.caramel,
                      fontSize: 11,
                      fontWeight: "600"
                    },
                    children: "View \u2192"
                  })]
                }, i);
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              style: {
                ...s.h2,
                marginBottom: 14
              },
              children: "\uD83D\uDCA1 Barista Notes"
            }), /*#__PURE__*/_jsx("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 22,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                marginBottom: 18
              },
              children: c.notes.map((n, i) => /*#__PURE__*/_jsxs("div", {
                style: {
                  display: "flex",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "flex-start"
                },
                children: [/*#__PURE__*/_jsx("span", {
                  style: {
                    color: C.gold,
                    flexShrink: 0,
                    fontSize: 15
                  },
                  children: "\u2605"
                }), /*#__PURE__*/_jsx("p", {
                  style: {
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.7
                  },
                  children: n
                })]
              }, i))
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                background: `linear-gradient(135deg,${C.espresso},${C.mocha})`,
                borderRadius: 16,
                padding: 22
              },
              children: [/*#__PURE__*/_jsx("h3", {
                style: {
                  color: C.gold,
                  fontFamily: "'Playfair Display',serif",
                  marginBottom: 10,
                  fontSize: 16
                },
                children: "Try this in the Component Checker"
              }), /*#__PURE__*/_jsxs("p", {
                style: {
                  color: C.steam,
                  fontSize: 12,
                  lineHeight: 1.6,
                  marginBottom: 14
                },
                children: ["Practice making ", c.name, " correctly \u2014 our AI will verify your ingredients and technique."]
              }), /*#__PURE__*/_jsx("button", {
                className: "btn-primary",
                style: s.btn("primary", "100%"),
                onClick: () => {
                  setCheckerDrink(c.id);
                  setCheckerIngredients("");
                  setCheckerResult(null);
                  setSelectedCoffee(null);
                  setPage("checker");
                },
                children: "\uD83D\uDD0D Practice in Checker"
              })]
            }), /*#__PURE__*/_jsx("button", {
              className: "btn-primary",
              style: {
                ...s.btn("primary", "100%"),
                marginTop: 12
              },
              onClick: () => {
                setNoteTitle(`${c.name} Recipe`);
                setNoteText(`DRINK: ${c.name}\nFlavor: ${c.flavor}\nCaffeine: ${c.caffeine}\n\nRECIPE:\nYield: ${c.recipe.yield}\nGrind: ${c.recipe.grind}\nDose: ${c.recipe.dose}\nTemp: ${c.recipe.temp}\nTime: ${c.recipe.time}\nRatio: ${c.recipe.ratio}\n\nSTEPS:\n${c.recipe.steps.map((st, i) => `${i + 1}. ${st}`).join("\n")}\n\nNOTES:\n${c.notes.join("\n")}`);
                setSelectedCoffee(null);
                setPage("notes");
              },
              children: "\uD83D\uDCDD Save Recipe to Notes"
            })]
          })]
        })
      }), showModal && /*#__PURE__*/_jsx(AuthModal, {}), showUpgradeModal && /*#__PURE__*/_jsx(UpgradeModal, {}), /*#__PURE__*/_jsx(AchievementToast, {})]
    });
  }

  // ── DETAIL: LESSON ───────────────────────────────────────────────────────────
  if (selectedLesson) {
    const l = selectedLesson;
    const levelColor = l.level === "Beginner" ? "#166534" : l.level === "Intermediate" ? C.caramel : "#7f1d1d";
    return /*#__PURE__*/_jsxs("div", {
      style: s.app,
      children: [/*#__PURE__*/_jsx(GlobalStyles, {}), /*#__PURE__*/_jsxs("nav", {
        style: s.nav,
        children: [/*#__PURE__*/_jsx("span", {
          style: s.logo,
          onClick: () => setPage("home"),
          children: "\u2615 BrewMaster"
        }), /*#__PURE__*/_jsx("button", {
          onClick: () => setSelectedLesson(null),
          style: {
            ...s.btn("dark"),
            padding: "6px 14px",
            fontSize: 12
          },
          children: "\u2190 Back to Academy"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          background: `linear-gradient(160deg,${C.espresso} 0%,${C.mocha} 100%)`,
          padding: "60px 20px",
          textAlign: "center"
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 72,
            marginBottom: 12
          },
          children: l.icon
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            gap: 8,
            justifyContent: "center",
            marginBottom: 12,
            flexWrap: "wrap"
          },
          children: [/*#__PURE__*/_jsx("span", {
            style: s.tag(levelColor),
            children: l.level
          }), /*#__PURE__*/_jsx("span", {
            style: s.tag(),
            children: l.category
          }), /*#__PURE__*/_jsxs("span", {
            style: s.tag(C.navy),
            children: ["\u23F1\uFE0F ", l.duration]
          })]
        }), /*#__PURE__*/_jsx("h1", {
          style: {
            fontFamily: "'Playfair Display',serif",
            fontSize: "clamp(24px,4vw,46px)",
            color: C.gold
          },
          children: l.title
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: s.section,
        children: /*#__PURE__*/_jsxs("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
            gap: 28
          },
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              style: {
                ...s.h2,
                marginBottom: 14
              },
              children: "\uD83D\uDCD6 Lesson"
            }), /*#__PURE__*/_jsx("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 26,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                marginBottom: 20
              },
              children: /*#__PURE__*/_jsx("p", {
                style: {
                  fontSize: 14,
                  lineHeight: 2,
                  color: C.text
                },
                children: l.content
              })
            }), /*#__PURE__*/_jsx("h2", {
              style: {
                ...s.h2,
                marginBottom: 14
              },
              children: "\u2B50 Pro Tips"
            }), /*#__PURE__*/_jsx("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 22,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
              },
              children: l.tips.map((tip, i) => /*#__PURE__*/_jsxs("div", {
                style: {
                  display: "flex",
                  gap: 10,
                  marginBottom: 12,
                  alignItems: "flex-start"
                },
                children: [/*#__PURE__*/_jsx("span", {
                  style: {
                    color: C.caramel,
                    fontWeight: "700",
                    flexShrink: 0,
                    fontSize: 14
                  },
                  children: "\u2192"
                }), /*#__PURE__*/_jsx("p", {
                  style: {
                    margin: 0,
                    fontSize: 13,
                    lineHeight: 1.6
                  },
                  children: tip
                })]
              }, i))
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h2", {
              style: {
                ...s.h2,
                marginBottom: 14
              },
              children: "\uD83C\uDFAF Knowledge Quiz"
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                background: C.white,
                borderRadius: 16,
                padding: 22,
                boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
                marginBottom: 18
              },
              children: [/*#__PURE__*/_jsx("p", {
                style: {
                  fontWeight: "600",
                  fontSize: 14,
                  marginBottom: 18,
                  lineHeight: 1.6,
                  color: C.espresso
                },
                children: l.quiz.q
              }), l.quiz.options.map((opt, i) => {
                const answered = quizAnswers[l.id] !== undefined;
                const isCorrect = i === l.quiz.answer;
                const isSelected = quizAnswers[l.id] === i;
                let bg = C.latte,
                  bc = C.steam;
                if (answered && isCorrect) {
                  bg = "#dcfce7";
                  bc = "#86efac";
                }
                if (answered && isSelected && !isCorrect) {
                  bg = "#fee2e2";
                  bc = "#fca5a5";
                }
                return /*#__PURE__*/_jsxs("div", {
                  className: !answered ? "quiz-opt" : "",
                  onClick: () => !answered && setQuizAnswers(p => ({
                    ...p,
                    [l.id]: i
                  })),
                  style: {
                    background: bg,
                    border: `2px solid ${bc}`,
                    borderRadius: 10,
                    padding: "11px 14px",
                    marginBottom: 9,
                    cursor: answered ? "default" : "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    transition: "all 0.2s"
                  },
                  children: [/*#__PURE__*/_jsxs("span", {
                    style: {
                      fontWeight: "700",
                      color: C.muted,
                      fontSize: 11,
                      width: 18,
                      flexShrink: 0
                    },
                    children: [String.fromCharCode(65 + i), "."]
                  }), /*#__PURE__*/_jsx("span", {
                    style: {
                      fontSize: 13,
                      flex: 1
                    },
                    children: opt
                  }), answered && isCorrect && /*#__PURE__*/_jsx("span", {
                    style: {
                      color: "#166534",
                      fontWeight: "700",
                      fontSize: 16
                    },
                    children: "\u2713"
                  }), answered && isSelected && !isCorrect && /*#__PURE__*/_jsx("span", {
                    style: {
                      color: "#7f1d1d",
                      fontWeight: "700",
                      fontSize: 16
                    },
                    children: "\u2717"
                  })]
                }, i);
              }), quizAnswers[l.id] !== undefined && /*#__PURE__*/_jsx("div", {
                style: {
                  marginTop: 12,
                  padding: 13,
                  background: quizAnswers[l.id] === l.quiz.answer ? "#dcfce7" : "#fee2e2",
                  borderRadius: 10,
                  fontSize: 13,
                  fontWeight: "600",
                  color: quizAnswers[l.id] === l.quiz.answer ? "#166534" : "#7f1d1d"
                },
                children: quizAnswers[l.id] === l.quiz.answer ? "✅ Correct! Excellent work." : "❌ Correct answer: " + l.quiz.options[l.quiz.answer]
              })]
            }), /*#__PURE__*/_jsx("button", {
              className: "btn-primary",
              style: s.btn("primary", "100%"),
              onClick: () => {
                setNoteTitle(`Lesson: ${l.title}`);
                setNoteText(`LESSON: ${l.title}\nLevel: ${l.level}\nCategory: ${l.category}\n\n${l.content}\n\nPRO TIPS:\n${l.tips.map((t, i) => `${i + 1}. ${t}`).join("\n")}`);
                setSelectedLesson(null);
                setPage("notes");
              },
              children: "\uD83D\uDCDD Save Lesson Notes"
            })]
          })]
        })
      })]
    });
  }

  // ── MAIN PAGES ────────────────────────────────────────────────────────────────
  const navItems = [{
    id: "home",
    label: "Home",
    icon: "🏠",
    free: true
  }, {
    id: "progress",
    label: "Progress",
    icon: "📊",
    free: true
  }, {
    id: "coffees",
    label: "Coffee Types",
    icon: "☕",
    free: true
  }, {
    id: "origins",
    label: "Bean Origins",
    icon: "🌍",
    free: true
  }, {
    id: "checker",
    label: "Checker",
    icon: "🔍",
    free: true
  }, {
    id: "academy",
    label: "Academy",
    icon: "🎓",
    free: false
  }, {
    id: "notes",
    label: "Notes",
    icon: "📝",
    free: true
  }, {
    id: "glossary",
    label: "Glossary",
    icon: "📚",
    free: true
  }, {
    id: "chat",
    label: "AI Barista",
    icon: "🤖",
    free: true
  }];
  return /*#__PURE__*/_jsxs("div", {
    style: s.app,
    children: [/*#__PURE__*/_jsx(GlobalStyles, {}), showModal && /*#__PURE__*/_jsx(AuthModal, {}), showUpgradeModal && /*#__PURE__*/_jsx(UpgradeModal, {}), /*#__PURE__*/_jsx(AchievementToast, {}), /*#__PURE__*/_jsxs("nav", {
      style: s.nav,
      children: [/*#__PURE__*/_jsx("span", {
        style: s.logo,
        onClick: () => setPage("home"),
        children: "\u2615 BrewMaster Academy"
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "flex",
          gap: 2,
          flexWrap: "wrap",
          flex: 1,
          justifyContent: "center"
        },
        children: navItems.map(n => /*#__PURE__*/_jsxs("button", {
          className: "nav-btn",
          style: s.navBtn(page === n.id, !n.free),
          onClick: () => n.id === "academy" ? openAcademy() : setPage(n.id),
          children: [n.icon, " ", n.label, !n.free && " 🔒"]
        }, n.id))
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "flex",
          gap: 8,
          alignItems: "center",
          flexShrink: 0
        },
        children: user ? /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsxs("span", {
            style: {
              color: C.gold,
              fontSize: 11,
              fontWeight: "600"
            },
            children: ["\uD83D\uDC64 ", user.name.split(" ")[0]]
          }), /*#__PURE__*/_jsx("button", {
            onClick: handleLogout,
            style: {
              background: "transparent",
              color: C.muted,
              border: `1px solid rgba(122,92,58,0.4)`,
              padding: "4px 10px",
              borderRadius: 6,
              cursor: "pointer",
              fontSize: 10,
              fontWeight: "600"
            },
            children: "Logout"
          })]
        }) : /*#__PURE__*/_jsxs(_Fragment, {
          children: [/*#__PURE__*/_jsx("button", {
            onClick: () => {
              setAuthMode("login");
              setAuthForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
              });
              setAuthError("");
              setShowModal(true);
            },
            style: {
              background: "transparent",
              color: C.steam,
              border: `1px solid rgba(122,92,58,0.4)`,
              padding: "5px 11px",
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 11
            },
            children: "Log In"
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => {
              setAuthMode("signup");
              setAuthForm({
                name: "",
                email: "",
                password: "",
                confirmPassword: ""
              });
              setAuthError("");
              setShowModal(true);
            },
            style: {
              background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
              color: C.white,
              border: "none",
              padding: "5px 11px",
              borderRadius: 7,
              cursor: "pointer",
              fontSize: 11,
              fontWeight: "600"
            },
            children: "Sign Up Free"
          })]
        })
      })]
    }), /*#__PURE__*/_jsx(AdBanner, {}), page === "home" && /*#__PURE__*/_jsxs("div", {
      children: [/*#__PURE__*/_jsxs("div", {
        style: {
          background: `linear-gradient(160deg,${C.espresso} 0%,#2d1000 50%,#1a0800 100%)`,
          padding: "80px 20px 70px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden"
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            position: "absolute",
            inset: 0,
            opacity: 0.03,
            backgroundImage: "radial-gradient(circle at 2px 2px,#fff 1px,transparent 0)",
            backgroundSize: "32px 32px"
          }
        }), /*#__PURE__*/_jsx("div", {
          style: {
            position: "absolute",
            top: "20%",
            left: "10%",
            width: 300,
            height: 300,
            background: C.caramel,
            opacity: 0.04,
            borderRadius: "50%",
            filter: "blur(80px)"
          }
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            position: "relative",
            zIndex: 1
          },
          children: [/*#__PURE__*/_jsx("div", {
            className: "fadeUp",
            style: {
              fontSize: 72,
              marginBottom: 14
            },
            children: "\u2615"
          }), /*#__PURE__*/_jsx("h1", {
            className: "fadeUp",
            style: {
              fontFamily: "'Playfair Display',serif",
              fontSize: "clamp(32px,6vw,68px)",
              fontWeight: "900",
              color: C.gold,
              marginBottom: 12,
              letterSpacing: 1,
              lineHeight: 1.1,
              animationDelay: "0.1s"
            },
            children: "BrewMaster Academy"
          }), /*#__PURE__*/_jsx("p", {
            className: "fadeUp",
            style: {
              color: C.steam,
              fontSize: "clamp(14px,2vw,18px)",
              maxWidth: 540,
              margin: "0 auto 12px",
              lineHeight: 1.8,
              animationDelay: "0.2s"
            },
            children: "The complete coffee education platform for aspiring baristas. Master every method, every origin, every technique."
          }), /*#__PURE__*/_jsxs("div", {
            className: "fadeUp",
            style: {
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
              marginBottom: 36,
              animationDelay: "0.25s"
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                background: "rgba(22,101,52,0.3)",
                border: "1px solid rgba(134,239,172,0.3)",
                borderRadius: 20,
                padding: "7px 16px",
                fontSize: 12,
                color: "#86efac"
              },
              children: "\u2705 Free: Coffee Types \xB7 Origins \xB7 Checker \xB7 AI \xB7 Notes"
            }), /*#__PURE__*/_jsx("div", {
              style: {
                background: "rgba(200,137,42,0.15)",
                border: "1px solid rgba(200,137,42,0.3)",
                borderRadius: 20,
                padding: "7px 16px",
                fontSize: 12,
                color: C.gold
              },
              children: "\uD83C\uDF93 Sign Up: Barista Academy \xB7 15 Lessons"
            })]
          }), /*#__PURE__*/_jsxs("div", {
            className: "fadeUp",
            style: {
              display: "flex",
              gap: 12,
              justifyContent: "center",
              flexWrap: "wrap",
              animationDelay: "0.3s"
            },
            children: [/*#__PURE__*/_jsx("button", {
              className: "btn-primary",
              style: {
                ...s.btn("primary"),
                padding: "12px 26px",
                fontSize: 14
              },
              onClick: () => setPage("coffees"),
              children: "\u2615 Explore Coffee Types"
            }), /*#__PURE__*/_jsxs("button", {
              className: "btn-primary",
              style: {
                ...s.btn(),
                background: "rgba(255,255,255,0.07)",
                color: C.white,
                border: "1px solid rgba(255,255,255,0.2)",
                padding: "12px 26px",
                fontSize: 14
              },
              onClick: openAcademy,
              children: ["\uD83C\uDF93 ", user ? "Open Academy" : "Join Academy Free"]
            })]
          }), /*#__PURE__*/_jsx("div", {
            className: "fadeUp",
            style: {
              display: "flex",
              justifyContent: "center",
              gap: "clamp(16px,3vw,50px)",
              marginTop: 48,
              flexWrap: "wrap",
              animationDelay: "0.4s"
            },
            children: [["22+", "Coffee Drinks"], ["13", "Bean Origins"], ["15", "Lessons"], ["🔍", "AI Checker"], ["25+", "Glossary Terms"]].map(([n, l]) => /*#__PURE__*/_jsxs("div", {
              style: {
                textAlign: "center"
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontFamily: "'Playfair Display',serif",
                  fontSize: "clamp(26px,3.5vw,38px)",
                  fontWeight: "700",
                  color: C.gold
                },
                children: n
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  color: C.muted,
                  fontSize: 11,
                  marginTop: 3,
                  letterSpacing: 0.5
                },
                children: l
              })]
            }, l))
          })]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: s.section,
        children: [/*#__PURE__*/_jsx("h2", {
          style: {
            ...s.h1,
            marginBottom: 8
          },
          children: "Everything You Need to Master Coffee"
        }), /*#__PURE__*/_jsx("p", {
          style: s.sub,
          children: "From your first espresso to professional barista skills \u2014 structured, comprehensive, and free to explore"
        }), /*#__PURE__*/_jsx("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))",
            gap: 14
          },
          children: [{
            icon: "☕",
            title: "Coffee Types",
            desc: "22+ drinks — full recipes, history & technique",
            pg: "coffees",
            free: true
          }, {
            icon: "🌍",
            title: "Bean Origins",
            desc: "13 countries — flavours, altitude & culture",
            pg: "origins",
            free: true
          }, {
            icon: "🔍",
            title: "Component Checker",
            desc: "AI checks your ingredients & suggests fixes",
            pg: "checker",
            free: true
          }, {
            icon: "📚",
            title: "Glossary",
            desc: "25+ essential barista terms defined",
            pg: "glossary",
            free: true
          }, {
            icon: "🤖",
            title: "AI Barista",
            desc: "Ask any coffee question — expert answers",
            pg: "chat",
            free: true
          }, {
            icon: "📝",
            title: "Study Notes",
            desc: "Personal notebook — free, no login needed",
            pg: "notes",
            free: true
          }, {
            icon: "🎓",
            title: "Barista Academy",
            desc: "15 lessons + quizzes — beginner to advanced",
            pg: "academy",
            free: false
          }].map(item => /*#__PURE__*/_jsxs("div", {
            className: "brew-card",
            onClick: () => item.pg === "academy" ? openAcademy() : setPage(item.pg),
            style: {
              ...s.card,
              borderTop: `3px solid ${item.free ? "#22c55e" : C.caramel}`,
              position: "relative"
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                position: "absolute",
                top: 10,
                right: 10
              },
              children: /*#__PURE__*/_jsx("span", {
                style: {
                  ...s.tag(item.free ? "#166534" : C.caramel),
                  fontSize: 9
                },
                children: item.free ? "FREE" : "🔒 SIGN UP"
              })
            }), /*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 34,
                marginBottom: 10
              },
              children: item.icon
            }), /*#__PURE__*/_jsx("h3", {
              style: {
                color: C.espresso,
                marginBottom: 5,
                fontSize: 14,
                fontWeight: "700"
              },
              children: item.title
            }), /*#__PURE__*/_jsx("p", {
              style: {
                color: C.muted,
                fontSize: 11,
                margin: 0,
                lineHeight: 1.6
              },
              children: item.desc
            })]
          }, item.pg))
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          background: `linear-gradient(135deg,${C.espresso},${C.roast})`,
          padding: "52px 20px"
        },
        children: /*#__PURE__*/_jsxs("div", {
          style: {
            maxWidth: 1200,
            margin: "0 auto"
          },
          children: [/*#__PURE__*/_jsx("h2", {
            style: {
              fontFamily: "'Playfair Display',serif",
              color: C.gold,
              textAlign: "center",
              fontSize: 28,
              marginBottom: 6
            },
            children: "Featured Drinks"
          }), /*#__PURE__*/_jsx("p", {
            style: {
              color: C.muted,
              textAlign: "center",
              marginBottom: 28,
              fontSize: 13
            },
            children: "Click any drink to see the full recipe and technique"
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center"
            },
            children: coffeeTypes.slice(0, 14).map(c => /*#__PURE__*/_jsxs("div", {
              className: "brew-card",
              onClick: () => setSelectedCoffee(c),
              style: {
                background: "rgba(255,255,255,0.06)",
                border: `1px solid rgba(200,137,42,0.3)`,
                borderRadius: 14,
                padding: "14px 16px",
                cursor: "pointer",
                textAlign: "center",
                transition: "all 0.25s",
                minWidth: 95
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 34,
                  marginBottom: 6
                },
                children: c.emoji
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  color: C.white,
                  fontWeight: "600",
                  fontSize: 12
                },
                children: c.name
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  color: C.muted,
                  fontSize: 10,
                  marginTop: 3
                },
                children: c.category
              })]
            }, c.id))
          })]
        })
      }), !user && /*#__PURE__*/_jsxs("div", {
        style: {
          background: `linear-gradient(160deg,${C.mocha},${C.espresso})`,
          padding: "56px 20px",
          textAlign: "center"
        },
        children: [/*#__PURE__*/_jsx("div", {
          style: {
            fontSize: 52,
            marginBottom: 12
          },
          children: "\uD83C\uDF93"
        }), /*#__PURE__*/_jsx("h2", {
          style: {
            fontFamily: "'Playfair Display',serif",
            color: C.gold,
            fontSize: "clamp(22px,4vw,36px)",
            marginBottom: 12
          },
          children: "Unlock the Full Academy \u2014 Free Forever"
        }), /*#__PURE__*/_jsx("p", {
          style: {
            color: C.steam,
            fontSize: 14,
            maxWidth: 480,
            margin: "0 auto 24px",
            lineHeight: 1.8
          },
          children: "Sign up free for 15 barista lessons with quizzes, sync your notes across devices, and receive exclusive coffee tips straight to your inbox."
        }), /*#__PURE__*/_jsx("button", {
          className: "btn-primary",
          style: {
            ...s.btn("primary"),
            padding: "14px 36px",
            fontSize: 15
          },
          onClick: () => {
            setAuthMode("signup");
            setAuthForm({
              name: "",
              email: "",
              password: "",
              confirmPassword: ""
            });
            setAuthError("");
            setShowModal(true);
          },
          children: "Create Your Free Account \uD83D\uDE80"
        })]
      })]
    }), page === "progress" && /*#__PURE__*/_jsx(ProgressPage, {}), page === "coffees" && /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\u2615 Coffee Types"
      }), /*#__PURE__*/_jsxs("p", {
        style: s.sub,
        children: [coffeeTypes.length, " coffee drinks \u2014 every recipe, technique, origin, and recommended bean. ", /*#__PURE__*/_jsx("span", {
          style: {
            color: "#166534",
            fontWeight: "600"
          },
          children: "\u2705 Free to access"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: "flex",
          gap: 10,
          marginBottom: 14,
          flexWrap: "wrap",
          alignItems: "center"
        },
        children: [/*#__PURE__*/_jsx("input", {
          placeholder: "Search drinks...",
          value: coffeeSearch,
          onChange: e => setCoffeeSearch(e.target.value),
          style: {
            ...s.input,
            maxWidth: 240
          }
        }), /*#__PURE__*/_jsx("div", {
          style: {
            display: "flex",
            gap: 7,
            flexWrap: "wrap"
          },
          children: coffeeCategories.map(cat => /*#__PURE__*/_jsx("button", {
            style: s.filterBtn(coffeeFilter === cat),
            onClick: () => setCoffeeFilter(cat),
            children: cat
          }, cat))
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(265px,1fr))",
          gap: 16
        },
        children: filteredCoffees.map(c => /*#__PURE__*/_jsxs("div", {
          className: "brew-card",
          onClick: () => {
            setSelectedCoffee(c);
            trackActivity("recipe", c.id, progress);
          },
          style: {
            background: `linear-gradient(145deg,${c.color} 0%,${C.espresso} 100%)`,
            borderRadius: 16,
            padding: 20,
            cursor: "pointer",
            transition: "all 0.3s",
            color: C.white
          },
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10
            },
            children: [/*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 42
              },
              children: c.emoji
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                display: "flex",
                flexDirection: "column",
                gap: 5,
                alignItems: "flex-end"
              },
              children: [/*#__PURE__*/_jsx("span", {
                style: s.tag(C.gold),
                children: c.category
              }), /*#__PURE__*/_jsx("span", {
                style: s.tag(),
                children: c.subcat
              })]
            })]
          }), /*#__PURE__*/_jsx("h3", {
            style: {
              fontSize: 17,
              fontWeight: "700",
              margin: "0 0 5px",
              fontFamily: "'Playfair Display',serif"
            },
            children: c.name
          }), /*#__PURE__*/_jsxs("p", {
            style: {
              color: C.steam,
              fontSize: 11,
              lineHeight: 1.65,
              margin: "0 0 12px"
            },
            children: [c.desc.substring(0, 90), "..."]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 5
            },
            children: [["⏱️", c.time], ["⚡", c.caffeine], ["🌍", c.origin.split(",")[0]], ["🫘", c.roastLevel]].map(([icon, val]) => /*#__PURE__*/_jsxs("div", {
              style: {
                background: "rgba(255,255,255,0.08)",
                borderRadius: 6,
                padding: "4px 8px",
                fontSize: 10,
                color: C.steam
              },
              children: [icon, " ", val]
            }, val))
          }), /*#__PURE__*/_jsx("div", {
            style: {
              color: C.gold,
              fontSize: 11,
              fontWeight: "600",
              marginTop: 10,
              letterSpacing: 0.3
            },
            children: "View Full Recipe \u2192"
          })]
        }, c.id))
      }), filteredCoffees.length === 0 && /*#__PURE__*/_jsxs("div", {
        style: {
          textAlign: "center",
          color: C.muted,
          padding: 48,
          fontSize: 14
        },
        children: ["No drinks found for \"", coffeeSearch, "\""]
      })]
    }), page === "origins" && /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\uD83C\uDF0D Bean Origins"
      }), /*#__PURE__*/_jsxs("p", {
        style: s.sub,
        children: [beanOrigins.length, " coffee-growing regions \u2014 terroir, flavor profiles, and cultural history. ", /*#__PURE__*/_jsx("span", {
          style: {
            color: "#166534",
            fontWeight: "600"
          },
          children: "\u2705 Free to access"
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(290px,1fr))",
          gap: 16
        },
        children: beanOrigins.map(o => /*#__PURE__*/_jsxs("div", {
          className: "brew-card",
          onClick: () => {
            setSelectedOrigin(o);
            trackActivity("origin", o.id, progress);
          },
          style: {
            background: `linear-gradient(145deg,${o.color || C.espresso} 0%,${C.espresso} 100%)`,
            borderRadius: 16,
            padding: 22,
            cursor: "pointer",
            transition: "all 0.3s",
            color: C.white
          },
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 10
            },
            children: [/*#__PURE__*/_jsx("span", {
              style: {
                fontSize: 48
              },
              children: o.flag
            }), /*#__PURE__*/_jsx("span", {
              style: s.tag(C.gold),
              children: o.species.split(" ")[0]
            })]
          }), /*#__PURE__*/_jsx("h3", {
            style: {
              fontFamily: "'Playfair Display',serif",
              fontSize: 20,
              fontWeight: "700",
              margin: "0 0 3px"
            },
            children: o.country
          }), /*#__PURE__*/_jsx("p", {
            style: {
              color: C.muted,
              fontSize: 11,
              marginBottom: 10
            },
            children: o.region
          }), /*#__PURE__*/_jsxs("p", {
            style: {
              color: C.steam,
              fontSize: 11,
              lineHeight: 1.65,
              marginBottom: 12
            },
            children: [o.desc.substring(0, 90), "..."]
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: "flex",
              flexWrap: "wrap",
              gap: 6,
              marginBottom: 10
            },
            children: o.flavor.slice(0, 3).map(f => /*#__PURE__*/_jsx("span", {
              style: {
                background: "rgba(255,255,255,0.1)",
                borderRadius: 12,
                padding: "3px 9px",
                fontSize: 10,
                color: C.steam
              },
              children: f
            }, f))
          }), /*#__PURE__*/_jsx("div", {
            style: {
              color: C.gold,
              fontSize: 11,
              fontWeight: "600",
              letterSpacing: 0.3
            },
            children: "Full Profile & Tasting Notes \u2192"
          })]
        }, o.id))
      })]
    }), page === "checker" && /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\uD83D\uDD0D Coffee Component Checker"
      }), /*#__PURE__*/_jsxs("p", {
        style: s.sub,
        children: ["Select a drink, list your ingredients and tools \u2014 our AI checks everything and gives instant, specific feedback with clickable fixes. ", /*#__PURE__*/_jsx("span", {
          style: {
            color: "#166534",
            fontWeight: "600"
          },
          children: "\u2705 Free to use"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24
        },
        children: [/*#__PURE__*/_jsx("div", {
          children: /*#__PURE__*/_jsxs("div", {
            style: {
              background: C.white,
              borderRadius: 16,
              padding: 24,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                color: C.espresso,
                marginBottom: 14,
                fontSize: 16,
                fontWeight: "700"
              },
              children: "Step 1 \u2014 Select your drink"
            }), /*#__PURE__*/_jsx("div", {
              style: {
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
                marginBottom: 20
              },
              children: Object.entries(coffeeComponents).map(([id, drink]) => /*#__PURE__*/_jsxs("div", {
                onClick: () => {
                  setCheckerDrink(id);
                  setCheckerResult(null);
                  setCheckerIngredients("");
                },
                style: {
                  background: checkerDrink === id ? C.espresso : C.latte,
                  border: `2px solid ${checkerDrink === id ? C.gold : C.steam}`,
                  borderRadius: 10,
                  padding: "9px",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  textAlign: "center"
                },
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 20,
                    marginBottom: 3
                  },
                  children: drink.emoji
                }), /*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 10,
                    fontWeight: "600",
                    color: checkerDrink === id ? C.gold : C.espresso,
                    lineHeight: 1.3
                  },
                  children: drink.name
                })]
              }, id))
            }), checkerDrink && /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsxs("div", {
                style: {
                  background: C.latte,
                  borderRadius: 10,
                  padding: "11px 14px",
                  marginBottom: 14,
                  borderLeft: `3px solid ${C.caramel}`
                },
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 11,
                    color: C.muted,
                    marginBottom: 3,
                    fontWeight: "600"
                  },
                  children: "SELECTED"
                }), /*#__PURE__*/_jsxs("div", {
                  style: {
                    fontWeight: "700",
                    color: C.espresso,
                    fontSize: 14
                  },
                  children: [coffeeComponents[checkerDrink].emoji, " ", coffeeComponents[checkerDrink].name]
                }), /*#__PURE__*/_jsxs("div", {
                  style: {
                    fontSize: 11,
                    color: C.muted,
                    marginTop: 3
                  },
                  children: ["Ratio: ", coffeeComponents[checkerDrink].ratio, " \xB7 ", coffeeComponents[checkerDrink].temp]
                })]
              }), /*#__PURE__*/_jsx("h3", {
                style: {
                  color: C.espresso,
                  marginBottom: 8,
                  fontSize: 14,
                  fontWeight: "700"
                },
                children: "Step 2 \u2014 List everything you'll use"
              }), /*#__PURE__*/_jsx("p", {
                style: {
                  color: C.muted,
                  fontSize: 11,
                  marginBottom: 10,
                  lineHeight: 1.6
                },
                children: "Include: ingredients, milk type, grind size, water temperature, tools, any extras"
              }), /*#__PURE__*/_jsx("textarea", {
                value: checkerIngredients,
                onChange: e => setCheckerIngredients(e.target.value),
                placeholder: `e.g. "18g espresso, whole milk steamed at 65°C, vanilla syrup, coarse grind..."`,
                style: {
                  ...s.textarea,
                  minHeight: 110,
                  marginBottom: 12
                }
              }), checkerSuggestions[checkerDrink] && /*#__PURE__*/_jsxs("div", {
                style: {
                  marginBottom: 12
                },
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 11,
                    color: C.muted,
                    fontWeight: "600",
                    marginBottom: 7,
                    letterSpacing: 0.4
                  },
                  children: "\uD83D\uDCA1 QUICK START \u2014 click to try:"
                }), checkerSuggestions[checkerDrink].map((sug, i) => /*#__PURE__*/_jsxs("button", {
                  onClick: () => setCheckerIngredients(sug),
                  style: {
                    background: checkerIngredients === sug ? C.latte : C.white,
                    border: `1.5px solid ${checkerIngredients === sug ? C.caramel : C.steam}`,
                    borderRadius: 8,
                    padding: "8px 11px",
                    cursor: "pointer",
                    fontSize: 11,
                    color: C.text,
                    width: "100%",
                    marginBottom: 6,
                    textAlign: "left",
                    lineHeight: 1.5,
                    transition: "all 0.2s"
                  },
                  children: [i === 0 ? "✅ Standard" : "⭐ Alternative", ": ", sug.substring(0, 60), "..."]
                }, i))]
              }), /*#__PURE__*/_jsx("button", {
                className: "btn-primary",
                style: {
                  ...s.btn("primary", "100%"),
                  padding: "13px"
                },
                onClick: runChecker,
                disabled: checkerLoading || !checkerIngredients.trim(),
                children: checkerLoading ? "🔍 Analysing your ingredients..." : "🔍 Check My Components"
              })]
            }), !checkerDrink && /*#__PURE__*/_jsx("div", {
              style: {
                textAlign: "center",
                color: C.muted,
                padding: 20,
                fontSize: 13
              },
              children: "\uD83D\uDC46 Select a coffee drink above to begin"
            })]
          })
        }), /*#__PURE__*/_jsxs("div", {
          children: [checkerDrink && !checkerResult && !checkerLoading && /*#__PURE__*/_jsxs("div", {
            style: {
              background: C.white,
              borderRadius: 16,
              padding: 22,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              marginBottom: 16
            },
            children: [/*#__PURE__*/_jsxs("h3", {
              style: {
                color: C.espresso,
                marginBottom: 14,
                fontSize: 15,
                fontWeight: "700"
              },
              children: ["\uD83D\uDCCB Quick Reference \u2014 ", coffeeComponents[checkerDrink].name]
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                marginBottom: 12
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 11,
                  fontWeight: "700",
                  color: C.success,
                  marginBottom: 6,
                  letterSpacing: 0.4
                },
                children: "\u2705 REQUIRED:"
              }), coffeeComponents[checkerDrink].required.map(r => /*#__PURE__*/_jsxs("div", {
                style: {
                  fontSize: 12,
                  color: C.text,
                  padding: "3px 0",
                  borderBottom: `1px solid ${C.latte}`
                },
                children: ["\u2022 ", r]
              }, r))]
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                marginBottom: 12
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 11,
                  fontWeight: "700",
                  color: C.caramel,
                  marginBottom: 6,
                  letterSpacing: 0.4
                },
                children: "\u2B50 OPTIONAL:"
              }), coffeeComponents[checkerDrink].optional.map(r => /*#__PURE__*/_jsxs("div", {
                style: {
                  fontSize: 12,
                  color: C.muted,
                  padding: "3px 0"
                },
                children: ["\u2022 ", r]
              }, r))]
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  fontSize: 11,
                  fontWeight: "700",
                  color: C.error,
                  marginBottom: 6,
                  letterSpacing: 0.4
                },
                children: "\u274C DO NOT USE:"
              }), coffeeComponents[checkerDrink].forbidden.map(r => /*#__PURE__*/_jsxs("div", {
                style: {
                  fontSize: 12,
                  color: C.error,
                  padding: "3px 0"
                },
                children: ["\u2022 ", r]
              }, r))]
            })]
          }), !checkerDrink && !checkerLoading && /*#__PURE__*/_jsxs("div", {
            style: {
              background: C.white,
              borderRadius: 16,
              padding: 22,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                color: C.espresso,
                marginBottom: 14,
                fontSize: 15,
                fontWeight: "700"
              },
              children: "\uD83D\uDCA1 How the Checker Works"
            }), [["1️⃣", "Select any coffee drink from the 15 options"], ["2️⃣", "Try a Quick Start template or type your own ingredients"], ["3️⃣", "AI analyses everything against the correct recipe"], ["4️⃣", "Get a score + specific issues with exact fixes"], ["5️⃣", "Click 'Apply Fix' buttons to instantly correct mistakes"], ["6️⃣", "Try suggested variations to explore the drink further"]].map(([icon, text]) => /*#__PURE__*/_jsxs("div", {
              style: {
                display: "flex",
                gap: 11,
                marginBottom: 11,
                alignItems: "flex-start"
              },
              children: [/*#__PURE__*/_jsx("span", {
                style: {
                  fontSize: 18,
                  flexShrink: 0
                },
                children: icon
              }), /*#__PURE__*/_jsx("p", {
                style: {
                  margin: 0,
                  fontSize: 13,
                  lineHeight: 1.6
                },
                children: text
              })]
            }, text))]
          }), checkerLoading && /*#__PURE__*/_jsxs("div", {
            style: {
              background: C.white,
              borderRadius: 16,
              padding: 40,
              textAlign: "center",
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 60,
                marginBottom: 14,
                display: "inline-block",
                animation: "spin 2s linear infinite"
              },
              children: "\u2615"
            }), /*#__PURE__*/_jsx("h3", {
              style: {
                color: C.espresso,
                marginBottom: 8,
                fontFamily: "'Playfair Display',serif"
              },
              children: "Analysing your components..."
            }), /*#__PURE__*/_jsx("p", {
              style: {
                color: C.muted,
                fontSize: 13
              },
              children: "AI barista checking every ingredient"
            })]
          }), checkerResult && !checkerLoading && /*#__PURE__*/_jsxs("div", {
            className: "fadeUp",
            style: {
              background: C.white,
              borderRadius: 16,
              padding: 22,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)"
            },
            children: [/*#__PURE__*/_jsxs("div", {
              style: {
                display: "flex",
                alignItems: "center",
                gap: 16,
                marginBottom: 20,
                padding: 16,
                borderRadius: 13,
                background: checkerResult.status === "correct" ? "#f0fdf4" : checkerResult.status === "minor_issues" ? "#fffbeb" : "#fef2f2",
                border: `2px solid ${checkerResult.status === "correct" ? "#86efac" : checkerResult.status === "minor_issues" ? "#fcd34d" : "#fca5a5"}`
              },
              children: [/*#__PURE__*/_jsxs("div", {
                style: {
                  textAlign: "center",
                  flexShrink: 0
                },
                children: [/*#__PURE__*/_jsxs("div", {
                  style: {
                    fontFamily: "'Playfair Display',serif",
                    fontSize: 36,
                    fontWeight: "900",
                    color: checkerResult.status === "correct" ? "#166534" : checkerResult.status === "minor_issues" ? C.warn : "#7f1d1d"
                  },
                  children: [checkerResult.score, "%"]
                }), /*#__PURE__*/_jsx("div", {
                  style: {
                    fontSize: 10,
                    color: C.muted,
                    fontWeight: "600"
                  },
                  children: "SCORE"
                })]
              }), /*#__PURE__*/_jsxs("div", {
                children: [/*#__PURE__*/_jsx("div", {
                  style: {
                    fontWeight: "700",
                    fontSize: 15,
                    color: C.espresso,
                    marginBottom: 4
                  },
                  children: checkerResult.status === "correct" ? "✅ Perfect!" : checkerResult.status === "minor_issues" ? "⚠️ Almost There" : checkerResult.status === "major_issues" ? "🔧 Needs Work" : "❌ Incorrect Setup"
                }), /*#__PURE__*/_jsx("p", {
                  style: {
                    margin: 0,
                    fontSize: 12,
                    color: C.text,
                    lineHeight: 1.6
                  },
                  children: checkerResult.summary
                })]
              })]
            }), ((_checkerResult$correc = checkerResult.correct_items) === null || _checkerResult$correc === void 0 ? void 0 : _checkerResult$correc.length) > 0 && /*#__PURE__*/_jsxs("div", {
              style: {
                marginBottom: 16
              },
              children: [/*#__PURE__*/_jsx("h4", {
                style: {
                  color: "#166534",
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: "700",
                  letterSpacing: 0.4
                },
                children: "\u2705 GOT RIGHT"
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  background: "#f0fdf4",
                  borderRadius: 10,
                  padding: "10px 14px"
                },
                children: checkerResult.correct_items.map((item, i) => /*#__PURE__*/_jsxs("div", {
                  style: {
                    fontSize: 12,
                    color: "#166534",
                    padding: "2px 0"
                  },
                  children: ["\u2713 ", item]
                }, i))
              })]
            }), ((_checkerResult$issues = checkerResult.issues) === null || _checkerResult$issues === void 0 ? void 0 : _checkerResult$issues.length) > 0 && /*#__PURE__*/_jsxs("div", {
              style: {
                marginBottom: 16
              },
              children: [/*#__PURE__*/_jsx("h4", {
                style: {
                  color: C.error,
                  marginBottom: 8,
                  fontSize: 13,
                  fontWeight: "700",
                  letterSpacing: 0.4
                },
                children: "\uD83D\uDD27 ISSUES FOUND"
              }), checkerResult.issues.map((issue, i) => /*#__PURE__*/_jsxs("div", {
                style: {
                  background: issue.type === "error" ? "#fef2f2" : issue.type === "warning" ? "#fffbeb" : "#eff6ff",
                  border: `1.5px solid ${issue.type === "error" ? "#fca5a5" : issue.type === "warning" ? "#fcd34d" : "#93c5fd"}`,
                  borderRadius: 11,
                  padding: "13px",
                  marginBottom: 9
                },
                children: [/*#__PURE__*/_jsxs("div", {
                  style: {
                    display: "flex",
                    gap: 7,
                    alignItems: "center",
                    marginBottom: 7
                  },
                  children: [/*#__PURE__*/_jsx("span", {
                    style: {
                      fontSize: 14
                    },
                    children: issue.type === "error" ? "❌" : issue.type === "warning" ? "⚠️" : "💡"
                  }), /*#__PURE__*/_jsx("span", {
                    style: {
                      fontWeight: "700",
                      fontSize: 13,
                      color: C.espresso,
                      flex: 1
                    },
                    children: issue.item
                  }), /*#__PURE__*/_jsx("span", {
                    style: {
                      ...s.tag(issue.type === "error" ? C.error : issue.type === "warning" ? C.warn : "#1e3a5f"),
                      fontSize: 9
                    },
                    children: issue.type.toUpperCase()
                  })]
                }), /*#__PURE__*/_jsxs("p", {
                  style: {
                    margin: "0 0 7px",
                    fontSize: 12,
                    color: C.text,
                    lineHeight: 1.5
                  },
                  children: [/*#__PURE__*/_jsx("strong", {
                    children: "Problem:"
                  }), " ", issue.problem]
                }), /*#__PURE__*/_jsxs("p", {
                  style: {
                    margin: "0 0 10px",
                    fontSize: 12,
                    color: "#166534",
                    lineHeight: 1.5
                  },
                  children: [/*#__PURE__*/_jsx("strong", {
                    children: "\u2705 Fix:"
                  }), " ", issue.fix]
                }), issue.quick_fix_ingredients && /*#__PURE__*/_jsx("button", {
                  onClick: () => {
                    setCheckerIngredients(issue.quick_fix_ingredients);
                    setCheckerResult(null);
                  },
                  style: {
                    background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
                    color: C.white,
                    border: "none",
                    padding: "7px 14px",
                    borderRadius: 7,
                    cursor: "pointer",
                    fontSize: 11,
                    fontWeight: "600",
                    width: "100%",
                    transition: "all 0.2s"
                  },
                  children: "\u26A1 Apply This Fix & Re-check"
                })]
              }, i))]
            }), ((_checkerResult$missin = checkerResult.missing) === null || _checkerResult$missin === void 0 ? void 0 : _checkerResult$missin.length) > 0 && /*#__PURE__*/_jsxs("div", {
              style: {
                marginBottom: 16
              },
              children: [/*#__PURE__*/_jsx("h4", {
                style: {
                  color: C.warn,
                  marginBottom: 7,
                  fontSize: 13,
                  fontWeight: "700",
                  letterSpacing: 0.4
                },
                children: "\u26A0\uFE0F MISSING"
              }), /*#__PURE__*/_jsx("div", {
                style: {
                  background: "#fffbeb",
                  borderRadius: 10,
                  padding: "10px 14px"
                },
                children: checkerResult.missing.map((item, i) => /*#__PURE__*/_jsxs("div", {
                  style: {
                    fontSize: 12,
                    color: C.warn,
                    padding: "2px 0"
                  },
                  children: ["\u2022 ", item]
                }, i))
              })]
            }), checkerResult.barista_tip && /*#__PURE__*/_jsxs("div", {
              style: {
                background: `linear-gradient(135deg,${C.espresso},${C.mocha})`,
                borderRadius: 12,
                padding: "14px 16px",
                marginBottom: 14
              },
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  color: C.gold,
                  fontWeight: "700",
                  fontSize: 12,
                  marginBottom: 6,
                  letterSpacing: 0.4
                },
                children: "\u2615 BARISTA PRO TIP"
              }), /*#__PURE__*/_jsx("p", {
                style: {
                  margin: 0,
                  fontSize: 13,
                  color: C.steam,
                  lineHeight: 1.7
                },
                children: checkerResult.barista_tip
              })]
            }), ((_checkerResult$sugges = checkerResult.suggested_next_tries) === null || _checkerResult$sugges === void 0 ? void 0 : _checkerResult$sugges.length) > 0 && /*#__PURE__*/_jsxs("div", {
              style: {
                marginBottom: 14
              },
              children: [/*#__PURE__*/_jsx("h4", {
                style: {
                  color: C.espresso,
                  marginBottom: 10,
                  fontSize: 13,
                  fontWeight: "700",
                  letterSpacing: 0.4
                },
                children: "\uD83D\uDE80 TRY NEXT \u2014 click to load a variation:"
              }), checkerResult.suggested_next_tries.map((sug, i) => {
                const presets = checkerSuggestions[checkerDrink] || [];
                return /*#__PURE__*/_jsxs("button", {
                  onClick: () => {
                    const p = presets[i] || presets[0];
                    setCheckerIngredients(p || sug);
                    setCheckerResult(null);
                  },
                  style: {
                    background: C.latte,
                    border: `1.5px solid ${C.steam}`,
                    borderRadius: 9,
                    padding: "10px 13px",
                    cursor: "pointer",
                    fontSize: 12,
                    color: C.text,
                    width: "100%",
                    marginBottom: 7,
                    textAlign: "left",
                    lineHeight: 1.5,
                    transition: "all 0.2s",
                    fontFamily: "'DM Sans',sans-serif"
                  },
                  children: [/*#__PURE__*/_jsx("span", {
                    style: {
                      color: C.caramel,
                      fontWeight: "700",
                      marginRight: 6
                    },
                    children: "\u2192"
                  }), sug]
                }, i);
              })]
            }), /*#__PURE__*/_jsxs("div", {
              style: {
                display: "flex",
                gap: 9
              },
              children: [/*#__PURE__*/_jsx("button", {
                style: {
                  ...s.btn("dark"),
                  flex: 1,
                  fontSize: 12
                },
                onClick: () => {
                  setCheckerResult(null);
                  setCheckerIngredients("");
                },
                children: "\u21A9 Try Again"
              }), /*#__PURE__*/_jsx("button", {
                className: "btn-primary",
                style: {
                  ...s.btn("primary"),
                  flex: 1,
                  fontSize: 12
                },
                onClick: () => {
                  var _coffeeComponents$che, _coffeeComponents$che2, _checkerResult$issues2;
                  setNoteTitle(`Checker: ${(_coffeeComponents$che = coffeeComponents[checkerDrink]) === null || _coffeeComponents$che === void 0 ? void 0 : _coffeeComponents$che.name}`);
                  setNoteText(`COMPONENT CHECK: ${(_coffeeComponents$che2 = coffeeComponents[checkerDrink]) === null || _coffeeComponents$che2 === void 0 ? void 0 : _coffeeComponents$che2.name}\nScore: ${checkerResult.score}%\nStatus: ${checkerResult.status}\nSummary: ${checkerResult.summary}\n\nMy Ingredients: ${checkerIngredients}\n\nIssues:\n${((_checkerResult$issues2 = checkerResult.issues) === null || _checkerResult$issues2 === void 0 ? void 0 : _checkerResult$issues2.map(i => `${i.item}: ${i.problem} → Fix: ${i.fix}`).join("\n")) || "None"}\n\nPro Tip: ${checkerResult.barista_tip}`);
                  setPage("notes");
                },
                children: "\uD83D\uDCDD Save Results"
              })]
            })]
          })]
        })]
      })]
    }), page === "academy" && user && /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\uD83C\uDF93 Barista Academy"
      }), /*#__PURE__*/_jsxs("p", {
        style: s.sub,
        children: ["Welcome back, ", /*#__PURE__*/_jsx("strong", {
          children: user.name.split(" ")[0]
        }), "! ", lessons.length, " lessons from coffee origin stories to professional cupping. ", /*#__PURE__*/_jsx("span", {
          style: {
            color: C.caramel,
            fontWeight: "600"
          },
          children: "\uD83D\uDD12 Members only"
        })]
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "flex",
          gap: 7,
          flexWrap: "wrap",
          marginBottom: 24
        },
        children: lessonLevels.map(lvl => /*#__PURE__*/_jsx("button", {
          style: s.filterBtn(lessonLevel === lvl),
          onClick: () => setLessonLevel(lvl),
          children: lvl
        }, lvl))
      }), ["Foundation", "Espresso Technique", "Milk Technique", "Tasting", "Equipment", "Brewing Science", "Industry"].map(cat => {
        const cats = filteredLessons.filter(l => l.category === cat);
        if (!cats.length) return null;
        return /*#__PURE__*/_jsxs("div", {
          style: {
            marginBottom: 36
          },
          children: [/*#__PURE__*/_jsx("h3", {
            style: {
              color: C.caramel,
              fontSize: 16,
              marginBottom: 14,
              fontWeight: "700",
              letterSpacing: 0.5
            },
            children: cat.toUpperCase()
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(310px,1fr))",
              gap: 14
            },
            children: cats.map(l => {
              const lc = l.level === "Beginner" ? "#166534" : l.level === "Intermediate" ? C.caramel : "#7f1d1d";
              return /*#__PURE__*/_jsxs("div", {
                className: "brew-card",
                onClick: () => setSelectedLesson(l),
                style: {
                  ...s.card,
                  borderLeft: `4px solid ${lc}`
                },
                children: [/*#__PURE__*/_jsxs("div", {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 10
                  },
                  children: [/*#__PURE__*/_jsx("span", {
                    style: {
                      fontSize: 36
                    },
                    children: l.icon
                  }), /*#__PURE__*/_jsxs("div", {
                    style: {
                      display: "flex",
                      flexDirection: "column",
                      gap: 5,
                      alignItems: "flex-end"
                    },
                    children: [/*#__PURE__*/_jsx("span", {
                      style: s.tag(lc),
                      children: l.level
                    }), /*#__PURE__*/_jsxs("span", {
                      style: {
                        ...s.tag(),
                        fontSize: 9
                      },
                      children: ["\u23F1\uFE0F ", l.duration]
                    })]
                  })]
                }), /*#__PURE__*/_jsx("h3", {
                  style: {
                    fontSize: 15,
                    fontWeight: "700",
                    color: C.espresso,
                    marginBottom: 6,
                    fontFamily: "'Playfair Display',serif"
                  },
                  children: l.title
                }), /*#__PURE__*/_jsxs("p", {
                  style: {
                    color: C.muted,
                    fontSize: 12,
                    lineHeight: 1.65,
                    marginBottom: 12
                  },
                  children: [l.content.substring(0, 100), "..."]
                }), /*#__PURE__*/_jsxs("div", {
                  style: {
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  children: [/*#__PURE__*/_jsxs("span", {
                    style: {
                      fontSize: 11,
                      color: C.muted
                    },
                    children: [l.tips.length, " tips \xB7 Quiz included"]
                  }), /*#__PURE__*/_jsx("span", {
                    style: {
                      color: C.caramel,
                      fontWeight: "700",
                      fontSize: 12
                    },
                    children: "Start Lesson \u2192"
                  })]
                }), quizAnswers[l.id] !== undefined && /*#__PURE__*/_jsx("div", {
                  style: {
                    marginTop: 8,
                    fontSize: 10,
                    color: quizAnswers[l.id] === l.quiz.answer ? "#166534" : C.error,
                    fontWeight: "600"
                  },
                  children: quizAnswers[l.id] === l.quiz.answer ? "✅ Quiz passed" : "❌ Quiz attempted"
                })]
              }, l.id);
            })
          })]
        }, cat);
      })]
    }), page === "notes" && /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\uD83D\uDCDD Study Notes"
      }), /*#__PURE__*/_jsxs("p", {
        style: s.sub,
        children: ["Your personal barista notebook. ", /*#__PURE__*/_jsx("span", {
          style: {
            color: "#166534",
            fontWeight: "600"
          },
          children: "\u2705 Free for everyone"
        }), user ? /*#__PURE__*/_jsxs("span", {
          style: {
            color: C.muted
          },
          children: [" \xB7 Synced to your account, ", user.name.split(" ")[0]]
        }) : /*#__PURE__*/_jsx("span", {
          style: {
            color: C.muted
          },
          children: " \xB7 Sign up to sync across devices"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(290px,1fr))",
          gap: 26
        },
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              background: C.white,
              borderRadius: 16,
              padding: 22,
              boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
              marginBottom: 16
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                color: C.espresso,
                marginBottom: 13,
                fontSize: 16,
                fontWeight: "700"
              },
              children: "\u270D\uFE0F New Note"
            }), /*#__PURE__*/_jsx("input", {
              placeholder: "Note title...",
              value: noteTitle,
              onChange: e => setNoteTitle(e.target.value),
              style: {
                ...s.input,
                marginBottom: 10
              }
            }), /*#__PURE__*/_jsx("textarea", {
              placeholder: "Write your coffee notes here...",
              value: noteText,
              onChange: e => setNoteText(e.target.value),
              style: s.textarea
            }), /*#__PURE__*/_jsx("button", {
              className: "btn-primary",
              style: {
                ...s.btn("primary", "100%"),
                marginTop: 10
              },
              onClick: saveNote,
              children: "Save Note \uD83D\uDCBE"
            })]
          }), !user && /*#__PURE__*/_jsxs("div", {
            style: {
              background: `linear-gradient(135deg,${C.espresso},${C.mocha})`,
              borderRadius: 16,
              padding: 20,
              textAlign: "center"
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 32,
                marginBottom: 8
              },
              children: "\uD83D\uDD10"
            }), /*#__PURE__*/_jsx("h4", {
              style: {
                color: C.gold,
                fontFamily: "'Playfair Display',serif",
                marginBottom: 7,
                fontSize: 15
              },
              children: "Sync your notes forever"
            }), /*#__PURE__*/_jsx("p", {
              style: {
                color: C.steam,
                fontSize: 11,
                marginBottom: 14,
                lineHeight: 1.6
              },
              children: "Notes save in this browser now. Sign up free to keep them across all devices and unlock the full Academy."
            }), /*#__PURE__*/_jsx("button", {
              className: "btn-primary",
              style: s.btn("primary", "100%"),
              onClick: () => {
                setAuthMode("signup");
                setAuthForm({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: ""
                });
                setAuthError("");
                setShowModal(true);
              },
              children: "Create Free Account \uD83D\uDE80"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("h3", {
            style: {
              color: C.espresso,
              marginBottom: 13,
              fontSize: 16,
              fontWeight: "700"
            },
            children: ["\uD83D\uDCDA Saved Notes (", notes.length, ")"]
          }), notes.length === 0 ? /*#__PURE__*/_jsxs("div", {
            style: {
              ...s.card,
              textAlign: "center",
              color: C.muted,
              padding: 36,
              cursor: "default"
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                fontSize: 44,
                marginBottom: 10
              },
              children: "\uD83D\uDCDD"
            }), /*#__PURE__*/_jsxs("p", {
              style: {
                fontSize: 13,
                lineHeight: 1.6
              },
              children: ["No notes yet!", /*#__PURE__*/_jsx("br", {}), "Visit any recipe, bean origin, or use the Checker and click \"Save to Notes\"."]
            })]
          }) : notes.map(note => /*#__PURE__*/_jsxs("div", {
            style: {
              background: C.white,
              borderRadius: 13,
              padding: 17,
              boxShadow: "0 2px 12px rgba(0,0,0,0.07)",
              marginBottom: 12,
              borderTop: `3px solid ${C.caramel}`
            },
            children: [/*#__PURE__*/_jsxs("div", {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 5
              },
              children: [/*#__PURE__*/_jsx("h4", {
                style: {
                  color: C.espresso,
                  margin: 0,
                  fontSize: 13,
                  fontWeight: "700",
                  flex: 1,
                  fontFamily: "'Playfair Display',serif"
                },
                children: note.title
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => deleteNote(note.id),
                style: {
                  background: "none",
                  border: "none",
                  color: C.muted,
                  cursor: "pointer",
                  fontSize: 18,
                  padding: 0,
                  marginLeft: 8,
                  lineHeight: 1
                },
                children: "\xD7"
              })]
            }), /*#__PURE__*/_jsx("p", {
              style: {
                color: C.muted,
                fontSize: 10,
                margin: "0 0 8px",
                fontWeight: "600"
              },
              children: note.date
            }), /*#__PURE__*/_jsx("p", {
              style: {
                color: C.text,
                fontSize: 12,
                lineHeight: 1.7,
                margin: 0,
                whiteSpace: "pre-wrap"
              },
              children: note.text
            })]
          }, note.id))]
        })]
      })]
    }), page === "glossary" && /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\uD83D\uDCDA Coffee Glossary"
      }), /*#__PURE__*/_jsxs("p", {
        style: s.sub,
        children: [glossary.length, " essential barista terms \u2014 the complete language of specialty coffee. ", /*#__PURE__*/_jsx("span", {
          style: {
            color: "#166534",
            fontWeight: "600"
          },
          children: "\u2705 Free to access"
        })]
      }), /*#__PURE__*/_jsx("input", {
        placeholder: "Search terms...",
        value: glossSearch,
        onChange: e => setGlossSearch(e.target.value),
        style: {
          ...s.input,
          maxWidth: 360,
          marginBottom: 24
        }
      }), /*#__PURE__*/_jsx("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
          gap: 12
        },
        children: filteredGloss.map(g => /*#__PURE__*/_jsxs("div", {
          style: {
            background: C.white,
            borderRadius: 13,
            padding: 18,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            borderLeft: `4px solid ${C.caramel}`
          },
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 8
            },
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                color: C.espresso,
                fontSize: 15,
                margin: 0,
                fontFamily: "'Playfair Display',serif",
                fontWeight: "700"
              },
              children: g.term
            }), /*#__PURE__*/_jsx("span", {
              style: s.tag(),
              children: g.cat
            })]
          }), /*#__PURE__*/_jsx("p", {
            style: {
              color: C.text,
              fontSize: 12,
              lineHeight: 1.75,
              margin: 0
            },
            children: g.def
          })]
        }, g.term))
      }), filteredGloss.length === 0 && /*#__PURE__*/_jsxs("div", {
        style: {
          textAlign: "center",
          color: C.muted,
          padding: 40,
          fontSize: 14
        },
        children: ["No terms found for \"", glossSearch, "\""]
      })]
    }), page === "chat" && /*#__PURE__*/_jsxs("div", {
      style: s.section,
      children: [/*#__PURE__*/_jsx("h2", {
        style: s.h1,
        children: "\uD83E\uDD16 AI Barista Tutor"
      }), /*#__PURE__*/_jsxs("p", {
        style: s.sub,
        children: ["Ask anything about coffee \u2014 your personal expert available 24/7. ", /*#__PURE__*/_jsx("span", {
          style: {
            color: "#166534",
            fontWeight: "600"
          },
          children: "\u2705 Free to use"
        })]
      }), /*#__PURE__*/_jsxs("div", {
        style: {
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
          gap: 24
        },
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            background: C.white,
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            height: 580
          },
          children: [/*#__PURE__*/_jsxs("div", {
            style: {
              background: `linear-gradient(135deg,${C.espresso},${C.mocha})`,
              padding: "14px 18px",
              display: "flex",
              alignItems: "center",
              gap: 12
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                width: 38,
                height: 38,
                borderRadius: "50%",
                background: `linear-gradient(135deg,${C.caramel},${C.gold})`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16
              },
              children: "\u2615"
            }), /*#__PURE__*/_jsxs("div", {
              children: [/*#__PURE__*/_jsx("div", {
                style: {
                  color: C.white,
                  fontWeight: "700",
                  fontSize: 14,
                  fontFamily: "'Playfair Display',serif"
                },
                children: "Brew \u2014 AI Barista"
              }), /*#__PURE__*/_jsxs("div", {
                style: {
                  display: "flex",
                  gap: 6,
                  alignItems: "center",
                  marginTop: 2
                },
                children: [/*#__PURE__*/_jsx("span", {
                  style: {
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#22c55e",
                    display: "inline-block"
                  }
                }), /*#__PURE__*/_jsx("span", {
                  style: {
                    color: C.muted,
                    fontSize: 10
                  },
                  children: "Online \xB7 Expert Q-Grader"
                })]
              })]
            })]
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              flex: 1,
              overflowY: "auto",
              padding: 16,
              display: "flex",
              flexDirection: "column",
              gap: 11
            },
            children: [chat.map((msg, i) => /*#__PURE__*/_jsx("div", {
              style: s.chatBubble(msg.role),
              children: msg.content
            }, i)), chatLoading && /*#__PURE__*/_jsx("div", {
              style: {
                ...s.chatBubble("assistant"),
                color: C.muted,
                animation: "pulse 1.5s ease infinite"
              },
              children: "Brewing a response... \u2615"
            }), /*#__PURE__*/_jsx("div", {
              ref: chatEnd
            })]
          }), /*#__PURE__*/_jsxs("div", {
            style: {
              padding: "13px 14px",
              borderTop: `1px solid ${C.latte}`,
              display: "flex",
              gap: 8
            },
            children: [/*#__PURE__*/_jsx("input", {
              value: chatInput,
              onChange: e => setChatInput(e.target.value),
              onKeyDown: e => e.key === "Enter" && !e.shiftKey && sendChat(),
              placeholder: "Ask anything about coffee...",
              style: {
                ...s.input,
                flex: 1,
                fontSize: 13
              }
            }), /*#__PURE__*/_jsx("button", {
              className: "btn-primary",
              style: s.btn("primary"),
              onClick: sendChat,
              disabled: chatLoading,
              children: "Send"
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsx("h3", {
            style: {
              color: C.espresso,
              marginBottom: 13,
              fontSize: 15,
              fontWeight: "700"
            },
            children: "\uD83D\uDCAC Suggested Questions"
          }), [{
            cat: "Recipes & Drinks",
            qs: ["How do I make a perfect flat white?", "What's the difference between a cortado and a macchiato?", "How do I make Vietnamese iced coffee at home?", "What is Arabic Qahwa and how do I brew it?"]
          }, {
            cat: "Technique",
            qs: ["Why does my espresso taste sour?", "How do I get silky microfoam for latte art?", "How do I dial in my espresso correctly?"]
          }, {
            cat: "Beans & Origins",
            qs: ["What makes Ethiopian coffee so floral?", "Which beans are best for espresso?", "What is Panama Gesha and why is it so expensive?"]
          }].map(group => /*#__PURE__*/_jsxs("div", {
            style: {
              marginBottom: 16
            },
            children: [/*#__PURE__*/_jsx("div", {
              style: {
                color: C.muted,
                fontSize: 10,
                fontWeight: "700",
                marginBottom: 8,
                letterSpacing: 1
              },
              children: group.cat.toUpperCase()
            }), group.qs.map(q => /*#__PURE__*/_jsx("button", {
              onClick: () => setChatInput(q),
              style: {
                background: C.white,
                border: `1.5px solid ${C.steam}`,
                borderRadius: 9,
                padding: "9px 12px",
                textAlign: "left",
                cursor: "pointer",
                fontSize: 11,
                color: C.text,
                width: "100%",
                marginBottom: 6,
                lineHeight: 1.5,
                transition: "all 0.2s",
                fontFamily: "'DM Sans',sans-serif"
              },
              children: q
            }, q))]
          }, group.cat))]
        })]
      })]
    }), /*#__PURE__*/_jsx("footer", {
      style: {
        background: C.espresso,
        padding: "44px 20px 28px",
        marginTop: 72
      },
      children: /*#__PURE__*/_jsxs("div", {
        style: {
          maxWidth: 1200,
          margin: "0 auto"
        },
        children: [/*#__PURE__*/_jsxs("div", {
          style: {
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
            gap: 32,
            marginBottom: 36
          },
          children: [/*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h3", {
              style: {
                fontFamily: "'Playfair Display',serif",
                color: C.gold,
                fontSize: 20,
                marginBottom: 12
              },
              children: "\u2615 BrewMaster Academy"
            }), /*#__PURE__*/_jsx("p", {
              style: {
                color: C.muted,
                fontSize: 12,
                lineHeight: 1.8
              },
              children: "The complete coffee education platform. Free to explore \u2014 everything you need to go from coffee lover to confident barista."
            })]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h4", {
              style: {
                color: C.steam,
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 12,
                letterSpacing: 1
              },
              children: "FREE RESOURCES"
            }), ["Coffee Types", "Bean Origins", "Component Checker", "Glossary", "AI Barista", "Study Notes"].map(l => /*#__PURE__*/_jsxs("div", {
              style: {
                color: C.muted,
                fontSize: 12,
                padding: "3px 0"
              },
              children: ["\u2192 ", l]
            }, l))]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h4", {
              style: {
                color: C.steam,
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 12,
                letterSpacing: 1
              },
              children: "ACADEMY (FREE SIGNUP)"
            }), ["15 Barista Lessons", "Beginner to Advanced", "Quizzes & Practice", "Coffee Origins", "Milk Technique", "Espresso Science"].map(l => /*#__PURE__*/_jsxs("div", {
              style: {
                color: C.muted,
                fontSize: 12,
                padding: "3px 0"
              },
              children: ["\u2192 ", l]
            }, l))]
          }), /*#__PURE__*/_jsxs("div", {
            children: [/*#__PURE__*/_jsx("h4", {
              style: {
                color: C.steam,
                fontSize: 12,
                fontWeight: "700",
                marginBottom: 12,
                letterSpacing: 1
              },
              children: "JOIN US"
            }), /*#__PURE__*/_jsx("p", {
              style: {
                color: C.muted,
                fontSize: 12,
                lineHeight: 1.8,
                marginBottom: 14
              },
              children: "Sign up free for Barista Academy access + exclusive coffee guides delivered to your inbox."
            }), !user && /*#__PURE__*/_jsx("button", {
              className: "btn-primary",
              style: {
                ...s.btn("primary", "100%"),
                fontSize: 12
              },
              onClick: () => {
                setAuthMode("signup");
                setAuthForm({
                  name: "",
                  email: "",
                  password: "",
                  confirmPassword: ""
                });
                setAuthError("");
                setShowModal(true);
              },
              children: "Sign Up Free \uD83D\uDE80"
            })]
          })]
        }), /*#__PURE__*/_jsx("div", {
          style: {
            height: "1px",
            background: `linear-gradient(90deg,transparent,rgba(200,137,42,0.3),transparent)`,
            marginBottom: 22
          }
        }), /*#__PURE__*/_jsxs("div", {
          style: {
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 12
          },
          children: [/*#__PURE__*/_jsx("p", {
            style: {
              color: C.muted,
              fontSize: 11
            },
            children: "\xA9 2025 BrewMaster Academy \xB7 Built with passion for great coffee"
          }), /*#__PURE__*/_jsx("div", {
            style: {
              display: "flex",
              gap: 8,
              flexWrap: "wrap"
            },
            children: navItems.map(n => /*#__PURE__*/_jsxs("button", {
              style: {
                background: "none",
                border: "none",
                color: C.muted,
                cursor: "pointer",
                fontSize: 11,
                fontFamily: "'DM Sans',sans-serif"
              },
              onClick: () => n.id === "academy" ? openAcademy() : setPage(n.id),
              children: [n.icon, " ", n.label]
            }, n.id))
          })]
        })]
      })
    })]
  });
}