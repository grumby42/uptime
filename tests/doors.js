// Door orientation: leave through a door on one wall and you arrive on the matching side of the next area,
// facing away from the door you came in by; go back through that door and you land beside the one you used.
//  - edge doors: the wall they sit in gives the exit direction (bottom wall = moving down, east wall = moving right...);
//    doors inside an outdoor map (building doors, the stairs) have exactly one walkable side, which gives it.
//  - arrival: facing the exit direction, one step past a door in the destination that leads back.
//  - round trip: that door's own exit direction is the opposite one and it lands on the tile you stepped from.
//  - every exit tile (E) is a real door, and nobody stands on an arrival tile.
// Usage: node doors.js   (UPTIME_FILE=file:///... to test another build)
const { chromium } = require('playwright');
const path = require('path');
const FILE = process.env.UPTIME_FILE || 'file://' + path.resolve(__dirname, '../editions/town-hall/index.html');
(async () => {
  const b = await chromium.launch(); const page = await (await b.newContext()).newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => m.type() === 'error' && errs.push(m.text()));
  page.on('request', r => { if (!/^(file|data|blob):/.test(r.url())) errs.push('request ' + r.url()); });
  await page.goto(FILE); await page.waitForFunction(() => window.__UPTIME);
  const r = await page.evaluate(() => {
    const V = {up: [0, -1], down: [0, 1], left: [-1, 0], right: [1, 0]}, OPP = {up: 'down', down: 'up', left: 'right', right: 'left'};
    const solidAt = (m, x, y) => { const rows = MAPS[m].rows; if (y < 0 || y >= rows.length || x < 0 || x >= rows[0].length) return true; const t = TILES[rows[y][x]]; return !t || !!t.solid; };
    const npcAt = (m, x, y) => NPCS.filter(n => n.map === m && n.x === x && n.y === y).map(n => n.id);
    function exitDir(m, x, y) {
      const rows = MAPS[m].rows, H = rows.length, W = rows[0].length;
      if (y === 0) return 'up'; if (y === H - 1) return 'down'; if (x === 0) return 'left'; if (x === W - 1) return 'right';
      const ds = MAPS[m].doors || {};
      const open = Object.keys(V).filter(d => { const nx = x - V[d][0], ny = y - V[d][1]; return !solidAt(m, nx, ny) && !ds[nx + ',' + ny]; });
      return open.length === 1 ? open[0] : 'ambiguous:' + open.join('/');
    }
    const pairs = [], bad = [];
    for (const m in MAPS) for (const k in (MAPS[m].doors || {})) {
      const d = MAPS[m].doors[k]; if (!d.to) continue;
      const [x, y] = k.split(',').map(Number);
      const ex = exitDir(m, x, y), id = m + ' ' + k + ' -> ' + d.to + ' ' + d.x + ',' + d.y + ' ' + d.dir;
      pairs.push(id + ' (exit ' + ex + ')');
      if (!V[ex]) { bad.push(id + ': exit side ' + ex); continue; }
      if (d.dir !== ex) bad.push(id + ': arrives facing ' + d.dir + ', should face ' + ex);
      const rx = d.x - V[ex][0], ry = d.y - V[ex][1], rk = rx + ',' + ry, R = (MAPS[d.to].doors || {})[rk];
      if (!R || R.to !== m) { bad.push(id + ': no door back to ' + m + ' at ' + d.to + ' ' + rk + ' (the matching wall)'); continue; }
      const rex = exitDir(d.to, rx, ry);
      if (rex !== OPP[ex]) bad.push(id + ': the door back (' + d.to + ' ' + rk + ') exits ' + rex + ', should exit ' + OPP[ex]);
      const ax = x - V[ex][0], ay = y - V[ex][1];
      if (R.x !== ax || R.y !== ay || R.dir !== OPP[ex]) bad.push(id + ': round trip lands at ' + R.x + ',' + R.y + ' ' + R.dir + ', should be ' + ax + ',' + ay + ' ' + OPP[ex]);
      if (solidAt(d.to, d.x, d.y) || (MAPS[d.to].doors || {})[d.x + ',' + d.y]) bad.push(id + ': arrival tile is not floor');
      if (npcAt(d.to, d.x, d.y).length) bad.push(id + ': someone stands on the arrival tile: ' + npcAt(d.to, d.x, d.y));
    }
    const orphans = [];
    for (const m in MAPS) MAPS[m].rows.forEach((row, y) => [...row].forEach((c, x) => { if (c === 'E' && !(MAPS[m].doors || {})[x + ',' + y]) orphans.push(m + ' ' + x + ',' + y); }));
    return {pairs, bad, orphans};
  });
  // An old save standing on hub 1,10 (a wall since the door-orientation fix) loads onto the nearest floor tile.
  const mig = await page.evaluate(() => {
    const keep = G;
    G = Object.assign(newState(7), {map: 'hub', x: 1, y: 10, f: {starter: 'ledger', portDone: true}});
    const was = tileDef('hub', 1, 10).solid;
    G = decodeSave(encodeSave(G)); fixupState();
    const out = {was, x: G.x, y: G.y, solid: !!tileDef('hub', G.x, G.y).solid, door: !!doorAt('hub', G.x, G.y), blocked: blocked('hub', G.x, G.y)};
    G = keep; return out;
  });
  await b.close();
  const results = [
    { name: 'old save on a now-wall tile (hub 1,10) loads onto the nearest walkable floor tile', ok: mig.was && !mig.solid && !mig.door && !mig.blocked && Math.abs(mig.x - 1) + Math.abs(mig.y - 10) <= 2, info: mig },
    { name: 'every door pair: exit wall matches the arrival side, facing away from the door', ok: r.bad.length === 0, info: r.bad },
    { name: 'every exit tile is a working door', ok: r.orphans.length === 0, info: r.orphans },
    { name: 'checked all doors (at least 30 one-way links)', ok: r.pairs.length >= 30, info: r.pairs.length },
    { name: 'no console errors or network requests', ok: errs.length === 0, info: errs }];
  const failed = results.filter(x => !x.ok);
  console.log(JSON.stringify({ suite: 'doors', passed: results.length - failed.length, failed: failed.length, results: results.map(x => x.ok ? { name: x.name, ok: true } : x), doors: r.pairs }, null, 1));
  process.exit(failed.length ? 1 : 0);
})().catch(e => { console.error('DOORS FAILED:', e.message); process.exit(2); });
