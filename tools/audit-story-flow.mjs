import fs from "node:fs";
import vm from "node:vm";

const MAIN_PATH = "src/main.js";
const STORY_PATH = "src/story-dev-rewrite.js";
const CRITICAL_ITEMS = new Set(["photo", "radio", "pass", "key", "crowbar"]);

const mainSource = fs.readFileSync(MAIN_PATH, "utf8");
const storySource = fs.readFileSync(STORY_PATH, "utf8");
const failures = [];

function extractConst(source, name, nextMarker) {
  const marker = `const ${name} = `;
  const start = source.indexOf(marker);
  if (start < 0) throw new Error(`Missing const ${name}`);
  const bodyStart = start + marker.length;
  const end = source.indexOf(nextMarker, bodyStart);
  if (end < 0) throw new Error(`Missing end marker for ${name}: ${nextMarker}`);
  return source.slice(bodyStart, end).trim().replace(/;$/, "");
}

function evaluate(expression, context = {}) {
  return vm.runInNewContext(`(${expression})`, context);
}

const ITEMS = evaluate(extractConst(mainSource, "ITEMS", ";\n\nconst STARTING_ITEMS"));
const STARTING_ITEMS = evaluate(extractConst(mainSource, "STARTING_ITEMS", ";\nconst SAFE_DROP_ORDER"));
const SAFE_DROP_ORDER = evaluate(extractConst(mainSource, "SAFE_DROP_ORDER", ";\n\nconst RELICS"));
const FLAG_REQUIREMENTS = evaluate(extractConst(mainSource, "FLAG_REQUIREMENTS", ";\n\nconst RECEIPT_ART"));
const MAP = evaluate(extractConst(mainSource, "MAP", ";\n\nconst CARD_LIBRARY"));
const CARD_LIBRARY = evaluate(extractConst(mainSource, "CARD_LIBRARY", ";\n\nlet state = null"), {
  card: (id, label, detail, cost, kind, chance, data) => ({ id, label, detail, cost, kind, chance, ...data })
});
const ITEM_LABELS = evaluate(extractConst(storySource, "ITEM_LABELS", ";\n\nconst FLAG_LABELS"));
const FLAG_LABELS = evaluate(extractConst(storySource, "FLAG_LABELS", ";\n\nconst STARTING_ITEMS"));
const STORY_STARTING_ITEMS = evaluate(extractConst(storySource, "STARTING_ITEMS", ";\n\nconst storyData"));
const storyData = evaluate(extractConst(storySource, "storyData", ";\n\nnormalizeStoryData();"));

const mapById = new Map(MAP.map((node) => [node.id, node]));
const cardsById = new Map();
const cardsByNodeTitle = new Map();

Object.entries(CARD_LIBRARY).forEach(([nodeId, cards]) => {
  cards.forEach((card) => {
    cardsById.set(card.id, { ...card, nodeId });
    cardsByNodeTitle.set(`${nodeId}::${card.label}`, { ...card, nodeId });
  });
});

function itemLabel(id) {
  return ITEMS[id]?.name || id;
}

function failure(message) {
  failures.push(message);
}

function sortedEntries(object) {
  return Object.entries(object || {}).sort(([a], [b]) => a.localeCompare(b));
}

function sameMap(a = {}, b = {}) {
  return JSON.stringify(sortedEntries(a)) === JSON.stringify(sortedEntries(b));
}

function sameList(a = [], b = []) {
  return JSON.stringify(a) === JSON.stringify(b);
}

function assertSameKeys(label, actual, expected) {
  const actualKeys = Object.keys(actual || {}).sort();
  const expectedKeys = Object.keys(expected || {}).sort();
  if (!sameList(actualKeys, expectedKeys)) {
    const missing = expectedKeys.filter((key) => !actualKeys.includes(key));
    const extra = actualKeys.filter((key) => !expectedKeys.includes(key));
    failure(`${label} keys differ from story backend. Missing: ${missing.join("、") || "none"}; extra: ${extra.join("、") || "none"}.`);
  }
}

function normalizeFlags(card) {
  return [card.flag, ...(card.flags || [])].filter(Boolean).sort();
}

function normalizeNeedFlags(card) {
  return [card.needFlag, ...(card.needFlags || [])].filter(Boolean).sort();
}

function requiredItemsFor(card) {
  const required = {};
  [card.need, card.spend].forEach((map) => {
    Object.entries(map || {}).forEach(([id, count]) => {
      required[id] = Math.max(required[id] || 0, count);
    });
  });
  return required;
}

function missingRequirements(card, bag, flags) {
  const missing = [];
  Object.entries(requiredItemsFor(card)).forEach(([id, count]) => {
    if ((bag[id] || 0) < count) missing.push(`${itemLabel(id)} x${count}`);
  });
  normalizeNeedFlags(card).forEach((flag) => {
    if (!flags.has(flag)) missing.push(`旗标 ${flag}`);
  });
  return missing;
}

function cloneBag(bag) {
  return { ...bag };
}

function applyCard(card, bag, flags) {
  const nextBag = cloneBag(bag);
  const nextFlags = new Set(flags);
  Object.entries(card.spend || {}).forEach(([id, count]) => {
    nextBag[id] = (nextBag[id] || 0) - count;
    if (nextBag[id] <= 0) delete nextBag[id];
  });
  Object.entries(card.gain || {}).forEach(([id, count]) => {
    nextBag[id] = (nextBag[id] || 0) + count;
  });
  normalizeFlags(card).forEach((flag) => nextFlags.add(flag));
  return { bag: nextBag, flags: nextFlags };
}

function stateKey(state) {
  const bag = sortedEntries(state.bag).map(([id, count]) => `${id}:${count}`).join(",");
  const flags = [...state.flags].sort().join(",");
  const done = [...state.done].sort().join(",");
  return `${state.node}|${bag}|${flags}|${done}`;
}

function findPlayableCards() {
  const playable = new Set();
  const queue = [{
    node: "home",
    bag: cloneBag(STARTING_ITEMS),
    flags: new Set(),
    done: new Set()
  }];
  const seen = new Set();

  while (queue.length) {
    const state = queue.shift();
    const key = stateKey(state);
    if (seen.has(key)) continue;
    seen.add(key);

    (CARD_LIBRARY[state.node] || []).forEach((card) => {
      if (state.done.has(card.id)) return;
      if (missingRequirements(card, state.bag, state.flags).length) return;
      playable.add(card.id);
      const applied = applyCard(card, state.bag, state.flags);
      queue.push({
        node: state.node,
        bag: applied.bag,
        flags: applied.flags,
        done: new Set([...state.done, card.id])
      });
    });

    (mapById.get(state.node)?.links || []).forEach((node) => {
      queue.push({
        node,
        bag: cloneBag(state.bag),
        flags: new Set(state.flags),
        done: new Set(state.done)
      });
    });
  }

  return playable;
}

function auditNoArbitrarySpend() {
  Object.values(CARD_LIBRARY).flat().forEach((card) => {
    if (Object.prototype.hasOwnProperty.call(card, "spendAny")) {
      failure(`${card.label} still uses spendAny; use explicit spend instead.`);
    }
  });
  CRITICAL_ITEMS.forEach((id) => {
    if (SAFE_DROP_ORDER.includes(id)) {
      failure(`${itemLabel(id)} is critical but appears in SAFE_DROP_ORDER.`);
    }
  });
}

function auditBackendParity() {
  assertSameKeys("ITEMS", ITEMS, ITEM_LABELS);
  Object.entries(ITEM_LABELS).forEach(([id, label]) => {
    if (ITEMS[id]?.name !== label) {
      failure(`ITEMS.${id}.name is "${ITEMS[id]?.name || "missing"}", expected "${label}".`);
    }
  });

  if (!sameMap(STARTING_ITEMS, STORY_STARTING_ITEMS)) {
    failure("STARTING_ITEMS differs from story backend.");
  }

  assertSameKeys("FLAG_REQUIREMENTS", FLAG_REQUIREMENTS, FLAG_LABELS);
  Object.entries(FLAG_LABELS).forEach(([id, label]) => {
    const expected = `需要：${label}`;
    if (FLAG_REQUIREMENTS[id] !== expected) {
      failure(`FLAG_REQUIREMENTS.${id} is "${FLAG_REQUIREMENTS[id] || "missing"}", expected "${expected}".`);
    }
  });

  const mapNodeIds = MAP.map((node) => node.id);
  const storyNodeIds = storyData.nodes.map((node) => node.id);
  if (!sameList(mapNodeIds, storyNodeIds)) {
    failure(`MAP node order differs from story backend. Game: ${mapNodeIds.join(" > ")}; story: ${storyNodeIds.join(" > ")}.`);
  }

  storyData.nodes.forEach((node, index) => {
    const mapNode = MAP[index] || mapById.get(node.id);
    if (!mapNode) {
      failure(`MAP is missing story node ${node.id}.`);
      return;
    }
    if (mapNode.id !== node.id) {
      failure(`MAP node ${index + 1} is ${mapNode.id}, expected ${node.id}.`);
    }
    if (mapNode.name !== node.name) {
      failure(`MAP.${node.id}.name is "${mapNode.name}", expected "${node.name}".`);
    }
    const gameTitles = (CARD_LIBRARY[node.id] || []).map((card) => card.label);
    const storyTitles = node.events.map((event) => event.title);
    if (!sameList(gameTitles, storyTitles)) {
      failure(`CARD_LIBRARY.${node.id} event order differs from story backend. Game: ${gameTitles.join("、")}; story: ${storyTitles.join("、")}.`);
    }
  });

  Object.keys(CARD_LIBRARY).forEach((nodeId) => {
    if (!storyNodeIds.includes(nodeId)) failure(`CARD_LIBRARY has extra node ${nodeId} not present in story backend.`);
  });
}

function auditSourcesAndUses() {
  const sources = new Map();
  const uses = new Map();
  Object.entries(STARTING_ITEMS).forEach(([id, count]) => sources.set(id, [`开局 x${count}`]));

  Object.entries(CARD_LIBRARY).forEach(([nodeId, cards]) => {
    cards.forEach((card) => {
      Object.entries(card.gain || {}).forEach(([id, count]) => {
        if (!sources.has(id)) sources.set(id, []);
        sources.get(id).push(`${nodeId}/${card.label} x${count}`);
      });
      Object.keys(requiredItemsFor(card)).forEach((id) => {
        if (!uses.has(id)) uses.set(id, []);
        uses.get(id).push(`${nodeId}/${card.label}`);
      });
    });
  });

  uses.forEach((locations, id) => {
    if (!sources.has(id)) {
      failure(`${itemLabel(id)} is required by ${locations.join("、")} but has no source.`);
    }
  });

  CRITICAL_ITEMS.forEach((id) => {
    if (sources.has(id) && !uses.has(id)) {
      failure(`${itemLabel(id)} is a critical item with a source but no mainline use.`);
    }
  });
}

function auditGlobalReachability() {
  const playable = findPlayableCards();
  cardsById.forEach((card) => {
    const hasGate = Object.keys(requiredItemsFor(card)).length || normalizeNeedFlags(card).length;
    if (hasGate && !playable.has(card.id)) {
      failure(`${card.nodeId}/${card.label} has gates but no successful reachable route can satisfy them.`);
    }
  });
}

function auditStoryDataMatchesGame() {
  storyData.nodes.forEach((node) => {
    node.events.forEach((event) => {
      const card = cardsByNodeTitle.get(`${node.id}::${event.title}`);
      if (!card) {
        failure(`Story backend event ${node.id}/${event.title} is missing from CARD_LIBRARY.`);
        return;
      }
      if (!sameMap(event.gain, card.gain)) failure(`Gain mismatch for ${node.id}/${event.title}.`);
      if (!sameMap(event.need, card.need)) failure(`Need mismatch for ${node.id}/${event.title}.`);
      if (!sameMap(event.spend, card.spend)) failure(`Spend mismatch for ${node.id}/${event.title}.`);
      if (JSON.stringify(normalizeFlags(event)) !== JSON.stringify(normalizeFlags(card))) {
        failure(`Flag mismatch for ${node.id}/${event.title}.`);
      }
      if (JSON.stringify(normalizeNeedFlags(event)) !== JSON.stringify(normalizeNeedFlags(card))) {
        failure(`Need flag mismatch for ${node.id}/${event.title}.`);
      }
      if (Object.prototype.hasOwnProperty.call(event, "spendAny")) {
        failure(`Story backend event ${node.id}/${event.title} still uses spendAny.`);
      }
    });
  });
}

function auditEndingRoutes() {
  storyData.endingRoutes.forEach((route) => {
    let currentNode = "home";
    let bag = cloneBag(STARTING_ITEMS);
    let flags = new Set();
    const done = new Set();

    route.path.forEach((step, index) => {
      const prefix = `${route.title} step ${index + 1} (${step.nodeId}/${step.choice})`;
      if (step.nodeId !== currentNode) {
        const links = mapById.get(currentNode)?.links || [];
        if (!links.includes(step.nodeId)) {
          failure(`${prefix} is not reachable from ${currentNode}; allowed next nodes: ${links.join("、") || "none"}.`);
        }
        currentNode = step.nodeId;
      }

      const card = cardsByNodeTitle.get(`${step.nodeId}::${step.choice}`);
      if (!card) {
        failure(`${prefix} is not present in CARD_LIBRARY.`);
        return;
      }
      if (done.has(card.id)) {
        failure(`${prefix} repeats an already played card.`);
      }
      const missing = missingRequirements(card, bag, flags);
      if (missing.length) {
        failure(`${prefix} is blocked: missing ${missing.join("、")}.`);
        return;
      }
      const applied = applyCard(card, bag, flags);
      bag = applied.bag;
      flags = applied.flags;
      done.add(card.id);
    });
  });
}

auditNoArbitrarySpend();
auditBackendParity();
auditSourcesAndUses();
auditGlobalReachability();
auditStoryDataMatchesGame();
auditEndingRoutes();

if (failures.length) {
  console.error("Story flow audit failed:");
  failures.forEach((message) => console.error(`- ${message}`));
  process.exit(1);
}

console.log("Story flow audit passed.");
