#!/usr/bin/env python3
"""Build every Uptime edition into one offline HTML file each, plus the series menu.

  python3 tools/build.py                               # all editions -> editions/<name>/index.html, and index.html
  python3 tools/build.py town-hall                     # one edition (the series menu is rebuilt too)
  python3 tools/build.py --copy town-hall=/path/x.html # also copy a built edition somewhere else

Each build is stamped with a build ID ARCD-YYYYMMDD-HHMMZ and a UTC timestamp taken from
the clock at build time. Sprites, maps and Quiet Thread clues are validated first, and the
build refuses to write any file that contains a URL or a network API.
"""
import datetime, html, json, os, re, shutil, subprocess, sys

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENGINE = os.path.join(ROOT, 'engine')
EDITIONS = os.path.join(ROOT, 'editions')
# Script order inside each page: shared data and engine first, then the edition, then the game core.
ENGINE_PRE = ['core-data.js', 'engine.js', 'series.js']
ENGINE_POST = ['drill.js', 'game.js']


def read(path):
    with open(path, encoding='utf-8') as f:
        return f.read()


def editions():
    out = []
    for name in sorted(os.listdir(EDITIONS)):
        meta = os.path.join(EDITIONS, name, 'edition.json')
        if os.path.isfile(meta):
            m = json.loads(read(meta))
            m['dir'] = os.path.join(EDITIONS, name)
            out.append(m)
    return out


VALIDATE = r"""
;(function(){
  const errs = [];
  for (const k in S) { const g = S[k]; if (g.length !== 16 || g.some(r => r.length !== 16 || /[^0-4]/.test(r))) errs.push('sprite ' + k); }
  for (const k in MAPS) { const r = MAPS[k].rows; const w = r[0].length;
    r.forEach((row, y) => { if (row.length !== w) errs.push('map ' + k + ' row ' + y + ' len ' + row.length);
      for (const ch of row) if (!TILES[ch]) errs.push('map ' + k + ' unknown tile ' + ch); }); }
  for (const t in TILES) { const d = TILES[t]; if (d.spr && !S[d.spr]) errs.push('tile ' + t + ' sprite'); if (d.pal && !PAL[d.pal]) errs.push('tile ' + t + ' pal'); }
  for (const n of NPCS) { if (!PAL[n.pal]) errs.push('npc pal ' + n.id); }
  for (const t in THREATS) { if (!TECH[THREATS[t].tech]) errs.push('threat tech ' + t); }
  // Quiet Thread: every clue maps to a known technique, and none of its techniques is in the alert mix.
  if (typeof QT_CLUES !== 'undefined') {
    for (const id in QT_CLUES) { if (!QT_TECH[QT_CLUES[id].tech]) errs.push('quiet clue tech ' + id); if (!/^[a-z]+-[a-z]+$/.test(id)) errs.push('quiet clue id ' + id); }
    for (const t in THREATS) { if (QT_TECH[THREATS[t].tech]) errs.push('quiet technique in alert mix: ' + t); }
    for (const w of MAL_WEIGHTS) { if (!THREATS[w.t]) errs.push('weight for unknown threat ' + w.t); }
  }
  console.log(JSON.stringify(errs));
})();
"""


def validate(ed):
    """Run a small node check of the edition's sprites, maps, threats and Quiet Thread clues."""
    files = [os.path.join(ENGINE, 'core-data.js'), os.path.join(ENGINE, 'series.js')]
    files += [os.path.join(ed['dir'], f) for f in ed['files'] if f != 'story.js']
    check = '\n'.join(read(f) for f in files) + VALIDATE
    out = subprocess.run(['node', '-'], input=check, capture_output=True, text=True)  # stdin: the script outgrew argv
    if out.returncode != 0:
        sys.exit('validation crashed (%s):\n%s' % (ed['id'], out.stderr))
    errs = json.loads(out.stdout.strip().splitlines()[-1])
    if errs:
        sys.exit('validation failed (%s): %s' % (ed['id'], ', '.join(errs)))


def no_network(text, label):
    bad = re.findall(r'(?:https?:)?//[a-z0-9.-]+\.[a-z]{2,}/', text, re.I)
    bad += re.findall(r'\b(?:fetch|XMLHttpRequest|WebSocket|EventSource|sendBeacon|importScripts)\s*\(', text)
    bad += re.findall(r'<(?:link|img|iframe|script)\b[^>]*\b(?:href|src)=["\'](?!data:)', text, re.I)
    if bad:
        sys.exit('network reference found in %s: %r' % (label, bad[:5]))


def build_edition(ed, build_id, build_ts):
    validate(ed)
    parts = [(os.path.join('engine', n), os.path.join(ENGINE, n)) for n in ENGINE_PRE]
    parts += [(os.path.join('editions', ed['id'], n), os.path.join(ed['dir'], n)) for n in ed['files']]
    parts += [(os.path.join('engine', n), os.path.join(ENGINE, n)) for n in ENGINE_POST]
    js = '\n'.join('/* ---- %s ---- */\n%s' % (label, read(path)) for label, path in parts)
    page = read(os.path.join(ENGINE, 'shell.html'))
    page = page.replace('/*__CSS__*/', read(os.path.join(ENGINE, 'style.css')))
    page = page.replace('/*__JS__*/', js)
    page = page.replace('__BUILD_ID__', build_id).replace('__BUILD_TS__', build_ts)
    no_network(page, ed['id'])
    out = os.path.join(ed['dir'], 'index.html')
    with open(out, 'w', encoding='utf-8') as f:
        f.write(page)
    print('%s  %s  %d bytes -> %s' % (build_id, build_ts, len(page.encode('utf-8')), os.path.relpath(out, ROOT)))
    return out


MENU = """<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; img-src data:;">
<title>Uptime</title>
<style>
:root{--bg:#f4f2ec;--ink:#1b2233;--muted:#4a5163;--line:#1b2233;--accent:#2f6e3e;--card:#fff;
  --mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,"DejaVu Sans Mono","Liberation Mono",monospace}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--bg:#10141f;--ink:#e9edf5;--muted:#aab3c5;--line:#3a4a6b;--accent:#a6d96a;--card:#1f2533}}
:root[data-theme="dark"]{--bg:#10141f;--ink:#e9edf5;--muted:#aab3c5;--line:#3a4a6b;--accent:#a6d96a;--card:#1f2533}
*{box-sizing:border-box}
html,body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--mono);overflow-x:hidden}
main{max-width:640px;margin:0 auto;padding:24px 16px 32px}
h1{font-size:40px;letter-spacing:8px;margin:0 0 4px;color:var(--accent)}
p{line-height:1.5}
.sub{color:var(--muted);margin:0 0 20px}
ol{list-style:none;padding:0;margin:0}
li{margin:0 0 12px}
a.ed{display:block;border:3px solid var(--line);background:var(--card);color:var(--ink);text-decoration:none;padding:14px 16px}
a.ed:focus,a.ed:hover{outline:3px solid var(--accent);outline-offset:2px}
.ed b{display:block;font-size:18px}
.ed span{display:block;color:var(--muted);font-size:14px;margin-top:4px}
.soon{border:3px dashed var(--line);padding:14px 16px;color:var(--muted)}
footer{margin-top:28px;font-size:12px;color:var(--muted)}
</style>
</head>
<body>
<main>
<h1>UPTIME</h1>
<p class="sub">A security-analyst RPG in small offline editions. Each one runs in your browser, phone or desktop, with no network requests. Saves stay in this browser.</p>
<ol>
%(items)s
<li class="soon">Next: Clerks&rsquo; Row</li>
</ol>
<footer>Build %(build_id)s &middot; %(build_ts)s &middot; Code under the MIT licence; framework data keeps its own terms (see CREDITS.md).</footer>
</main>
</body>
</html>
"""


def build_menu(eds, build_id, build_ts):
    items = '\n'.join(
        '<li><a class="ed" href="editions/%s/index.html"><b>%d. %s</b><span>%s. %s</span></a></li>' % (
            html.escape(e['id']), e.get('slice', i + 1), html.escape(e['name']), html.escape(e['district']), html.escape(e['blurb']))
        for i, e in enumerate(eds))
    page = MENU % {'items': items, 'build_id': build_id, 'build_ts': build_ts}
    no_network(page, 'index.html')
    with open(os.path.join(ROOT, 'index.html'), 'w', encoding='utf-8') as f:
        f.write(page)
    print('%s  %s  series menu -> index.html' % (build_id, build_ts))


def main(argv):
    copies, wanted = {}, []
    i = 0
    while i < len(argv):
        if argv[i] == '--copy':
            name, _, dest = argv[i + 1].partition('=')
            copies[name] = dest
            i += 2
        else:
            wanted.append(argv[i]); i += 1
    eds = editions()
    known = {e['id'] for e in eds}
    for w in wanted + list(copies):
        if w not in known:
            sys.exit('unknown edition %r (have: %s)' % (w, ', '.join(sorted(known))))
    now = datetime.datetime.now(datetime.timezone.utc)
    build_id = now.strftime('ARCD-%Y%m%d-%H%MZ')
    build_ts = now.strftime('%Y-%m-%d %H:%M UTC')
    built = {}
    for e in eds:
        if not wanted or e['id'] in wanted:
            built[e['id']] = build_edition(e, build_id, build_ts)
    build_menu(eds, build_id, build_ts)
    for name, dest in copies.items():
        if name not in built:
            sys.exit('cannot copy %s: it was not built in this run' % name)
        shutil.copyfile(built[name], dest)
        print('copied %s -> %s' % (name, dest))
    return build_id


if __name__ == '__main__':
    main(sys.argv[1:])
