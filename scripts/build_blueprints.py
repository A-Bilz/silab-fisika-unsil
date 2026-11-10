import json

with open('data_hunt/50_equipment.json', encoding='utf-8') as f:
    items = json.load(f)

def make_svg(category, name, code, size_type):
    n = name.lower()
    
    # Common grid
    grid = '<rect width="200" height="100" fill="#070d1e"/>'
    grid += '<path d="M0 25h200M0 50h200M0 75h200M50 0v100M100 0v100M150 0v100" stroke="#132240" stroke-width="0.8" stroke-dasharray="2 2"/>'
    
    accent = '#38bdf8'
    accent2 = '#22d3ee'
    accent3 = '#818cf8'
    
    body = ''
    if 'osiloskop' in n or 'oscilloscope' in n:
        body = f'''
        <rect x="30" y="20" width="140" height="60" rx="6" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <rect x="40" y="26" width="75" height="48" rx="3" fill="#022c22" stroke="#059669" stroke-width="1"/>
        <path d="M42 50h71M77 28v44" stroke="#065f46" stroke-width="0.5"/>
        <path d="M42 50 Q 55 28, 65 50 T 88 50 T 111 50" fill="none" stroke="#10b981" stroke-width="1.5"/>
        <circle cx="130" cy="34" r="6" fill="none" stroke="{accent2}" stroke-width="1.5"/>
        <circle cx="152" cy="34" r="6" fill="none" stroke="{accent2}" stroke-width="1.5"/>
        <circle cx="130" cy="56" r="5" fill="none" stroke="{accent3}" stroke-width="1.5"/>
        <circle cx="152" cy="56" r="5" fill="none" stroke="{accent3}" stroke-width="1.5"/>
        <circle cx="36" cy="26" r="2" fill="#34d399"/>
        '''
    elif 'teleskop' in n:
        body = f'''
        <line x1="100" y1="55" x2="60" y2="90" stroke="{accent}" stroke-width="2"/>
        <line x1="100" y1="55" x2="100" y2="90" stroke="{accent}" stroke-width="2"/>
        <line x1="100" y1="55" x2="140" y2="90" stroke="{accent}" stroke-width="2"/>
        <circle cx="100" cy="55" r="4" fill="{accent2}"/>
        <path d="M40 35 L160 50 L160 60 L40 45 Z" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <rect x="35" y="33" width="8" height="14" rx="2" fill="{accent3}"/>
        <rect x="155" y="48" width="10" height="14" rx="2" fill="{accent2}"/>
        <line x1="145" y1="45" x2="140" y2="35" stroke="{accent}" stroke-width="1"/>
        <rect x="135" y="32" width="18" height="6" rx="1" fill="#0f172a" stroke="{accent2}" stroke-width="1"/>
        '''
    elif 'jangka sorong' in n:
        body = f'''
        <rect x="20" y="42" width="160" height="16" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <path d="M20 42 L20 22 L30 35 L30 42 Z" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <path d="M20 58 L20 78 L32 65 L32 58 Z" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <rect x="60" y="38" width="40" height="24" fill="#1e293b" stroke="{accent2}" stroke-width="1.5"/>
        <path d="M60 38 L60 25 L68 35 L68 38 Z" fill="#1e293b" stroke="{accent2}" stroke-width="1.2"/>
        <path d="M60 62 L60 75 L70 65 L70 62 Z" fill="#1e293b" stroke="{accent2}" stroke-width="1.2"/>
        <line x1="40" y1="44" x2="40" y2="50" stroke="#64748b" stroke-width="1"/>
        <line x1="45" y1="44" x2="45" y2="48" stroke="#64748b" stroke-width="1"/>
        <line x1="50" y1="44" x2="50" y2="50" stroke="#64748b" stroke-width="1"/>
        <line x1="55" y1="44" x2="55" y2="48" stroke="#64748b" stroke-width="1"/>
        <line x1="110" y1="44" x2="110" y2="50" stroke="#64748b" stroke-width="1"/>
        <line x1="120" y1="44" x2="120" y2="50" stroke="#64748b" stroke-width="1"/>
        <line x1="130" y1="44" x2="130" y2="50" stroke="#64748b" stroke-width="1"/>
        '''
    elif 'mikrometer' in n:
        body = f'''
        <path d="M40 50 C40 25, 90 25, 90 50 C90 75, 40 75, 40 50" fill="none" stroke="{accent}" stroke-width="4"/>
        <rect x="88" y="45" width="12" height="10" fill="{accent3}"/>
        <rect x="100" y="46" width="35" height="8" fill="#1e293b" stroke="{accent}" stroke-width="1"/>
        <rect x="135" y="42" width="30" height="16" rx="2" fill="#0f172a" stroke="{accent2}" stroke-width="1.5"/>
        <rect x="165" y="45" width="12" height="10" rx="1" fill="{accent}"/>
        <line x1="145" y1="44" x2="145" y2="56" stroke="#64748b" stroke-width="1"/>
        <line x1="150" y1="44" x2="150" y2="56" stroke="#64748b" stroke-width="1"/>
        <line x1="155" y1="44" x2="155" y2="56" stroke="#64748b" stroke-width="1"/>
        '''
    elif 'neraca' in n or 'ohaus' in n or 'timbangan' in n:
        body = f'''
        <rect x="30" y="75" width="140" height="8" rx="2" fill="#1e293b" stroke="{accent}" stroke-width="1"/>
        <rect x="92" y="35" width="16" height="40" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <line x1="45" y1="38" x2="165" y2="38" stroke="{accent2}" stroke-width="2.5"/>
        <rect x="40" y="32" width="18" height="6" fill="{accent3}"/>
        <line x1="49" y1="38" x2="49" y2="55" stroke="{accent}" stroke-width="1"/>
        <ellipse cx="49" cy="58" rx="16" ry="4" fill="#1e293b" stroke="{accent}" stroke-width="1.5"/>
        <rect x="85" y="36" width="10" height="6" fill="#f59e0b"/>
        <rect x="120" y="36" width="10" height="6" fill="#f59e0b"/>
        <circle cx="165" cy="38" r="3" fill="{accent2}"/>
        '''
    elif 'kit' in n or 'tangki' in n:
        body = f'''
        <rect x="30" y="22" width="140" height="62" rx="4" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <rect x="35" y="27" width="130" height="52" rx="2" fill="none" stroke="#1e293b" stroke-width="1"/>
        <line x1="45" y1="65" x2="155" y2="65" stroke="{accent2}" stroke-width="1.5" stroke-dasharray="4 2"/>
        <circle cx="60" cy="48" r="10" fill="none" stroke="{accent3}" stroke-width="1.5"/>
        <rect x="85" y="40" width="25" height="16" rx="2" fill="none" stroke="{accent}" stroke-width="1.5"/>
        <polygon points="130,56 142,36 154,56" fill="none" stroke="{accent2}" stroke-width="1.5"/>
        <rect x="80" y="16" width="40" height="6" rx="2" fill="#1e293b" stroke="{accent}" stroke-width="1"/>
        '''
    elif 'termometer' in n or 'barometer' in n or 'higrometer' in n:
        body = f'''
        <circle cx="100" cy="50" r="32" fill="#0f172a" stroke="{accent}" stroke-width="2"/>
        <circle cx="100" cy="50" r="28" fill="none" stroke="#1e293b" stroke-width="1"/>
        <circle cx="100" cy="50" r="4" fill="{accent2}"/>
        <line x1="100" y1="50" x2="118" y2="32" stroke="#ef4444" stroke-width="2" stroke-linecap="round"/>
        <line x1="100" y1="24" x2="100" y2="28" stroke="{accent}" stroke-width="1.5"/>
        <line x1="126" y1="50" x2="122" y2="50" stroke="{accent}" stroke-width="1.5"/>
        <line x1="74" y1="50" x2="78" y2="50" stroke="{accent}" stroke-width="1.5"/>
        <line x1="100" y1="76" x2="100" y2="72" stroke="{accent}" stroke-width="1.5"/>
        '''
    elif 'garpu tala' in n or 'sonometer' in n or 'resonansi' in n:
        body = f'''
        <rect x="40" y="55" width="120" height="28" rx="3" fill="#1e293b" stroke="{accent}" stroke-width="1.5"/>
        <circle cx="100" cy="69" r="7" fill="#0f172a" stroke="{accent3}" stroke-width="1"/>
        <path d="M88 20 L88 42 A12 12 0 0 0 112 42 L112 20" fill="none" stroke="{accent2}" stroke-width="2.5" stroke-linecap="round"/>
        <line x1="100" y1="48" x2="100" y2="55" stroke="{accent2}" stroke-width="3"/>
        <path d="M78 26 Q74 31 78 36" fill="none" stroke="{accent}" stroke-width="1"/>
        <path d="M122 26 Q126 31 122 36" fill="none" stroke="{accent}" stroke-width="1"/>
        '''
    elif 'prisma' in n or 'lensa' in n or 'cermin' in n or 'kisi' in n or 'balok' in n:
        body = f'''
        <polygon points="100,22 65,75 135,75" fill="rgba(56,189,248,0.12)" stroke="{accent}" stroke-width="2"/>
        <line x1="30" y1="60" x2="78" y2="53" stroke="#f8fafc" stroke-width="2"/>
        <line x1="78" y1="53" x2="115" y2="45" stroke="#38bdf8" stroke-width="2"/>
        <line x1="115" y1="45" x2="170" y2="25" stroke="#ef4444" stroke-width="1.5"/>
        <line x1="115" y1="45" x2="170" y2="35" stroke="#10b981" stroke-width="1.5"/>
        <line x1="115" y1="45" x2="170" y2="45" stroke="#3b82f6" stroke-width="1.5"/>
        <line x1="115" y1="45" x2="170" y2="55" stroke="#a855f7" stroke-width="1.5"/>
        '''
    elif 'catu daya' in n or 'generator' in n or 'multimeter' in n:
        body = f'''
        <rect x="35" y="20" width="130" height="60" rx="5" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <rect x="48" y="28" width="40" height="20" rx="2" fill="#022c22" stroke="#059669" stroke-width="1"/>
        <text x="68" y="42" fill="#34d399" font-size="10" font-family="monospace" text-anchor="middle">12.0 V</text>
        <circle cx="115" cy="38" r="8" fill="none" stroke="{accent2}" stroke-width="1.5"/>
        <circle cx="142" cy="38" r="8" fill="none" stroke="{accent3}" stroke-width="1.5"/>
        <circle cx="60" cy="64" r="4" fill="#ef4444"/>
        <circle cx="80" cy="64" r="4" fill="#1e293b" stroke="#64748b" stroke-width="1"/>
        <circle cx="100" cy="64" r="4" fill="#3b82f6"/>
        <circle cx="140" cy="64" r="5" fill="#22c55e"/>
        '''
    else:
        body = f'''
        <rect x="40" y="25" width="120" height="54" rx="4" fill="#0f172a" stroke="{accent}" stroke-width="1.5"/>
        <path d="M55 52 L80 34 L120 68 L145 52" fill="none" stroke="{accent2}" stroke-width="2"/>
        <circle cx="80" cy="34" r="4" fill="{accent3}"/>
        <circle cx="120" cy="68" r="4" fill="{accent3}"/>
        <rect x="55" y="68" width="90" height="4" rx="1" fill="#1e293b"/>
        '''
    
    size_lbl = 'ALAT BESAR' if size_type == 'BESAR' else 'ALAT KECIL'
    body += f'<text x="190" y="16" fill="#64748b" font-size="7" font-family="monospace" text-anchor="end">{code}</text>'
    body += f'<text x="10" y="16" fill="#64748b" font-size="7" font-family="sans-serif" font-weight="bold">{size_lbl}</text>'
    
    svg = f'<svg viewBox="0 0 200 100" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg" aria-label="Skema teknis {name}" role="img">{grid}{body}</svg>'
    return svg

for item in items:
    item['svgBlueprint'] = make_svg(item['category'], item['name'], item['code'], item['sizeType'])

with open('data_hunt/50_equipment.json', 'w', encoding='utf-8') as f:
    json.dump(items, f, indent=2, ensure_ascii=False)

js_content = '/**\n * SILAB FKIP UNIVERSITAS SILIWANGI - DATASET 50 INSTRUMEN LABORATORIUM\n * Master Data Inventaris Resmi: Dokumen C-01/UN58.10.6/Lab/2026\n * Terdiri dari 25 Alat Besar dan 25 Alat Kecil hasil sinkronisasi riil.\n * Dilengkapi skema vektor SVG blueprint resolusi tinggi untuk visual instrumen.\n */\n'
js_content += 'window.EQUIPMENT_DATA = ' + json.dumps(items, indent=2, ensure_ascii=False) + ';\n'

with open('js/equipment-data.js', 'w', encoding='utf-8') as f:
    f.write(js_content)

print('Generated blueprints and js/equipment-data.js successfully!')