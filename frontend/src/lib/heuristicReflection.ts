import type { AIReflection, QuestTheme } from './types';

// Sensory pattern libraries for urban field analysis
const SENSORY_KEYWORDS: Record<string, { themeHint: QuestTheme; words: string[] }> = {
  texture: {
    themeHint: 'Pattern Hunt',
    words: ['rough', 'smooth', 'brick', 'peeling', 'rusted', 'cracked', 'groove', 'mortar', 'stone', 'concrete', 'grain', 'weathered'],
  },
  light: {
    themeHint: 'Light and Shadow',
    words: ['shadow', 'sunlight', 'glare', 'reflection', 'glow', 'dusk', 'dawn', 'beam', 'silhouette', 'contrast', 'dark', 'bright', 'cast'],
  },
  history: {
    themeHint: 'Urban Archaeology',
    words: ['old', 'vintage', 'faded', 'layer', 'worn', 'relic', 'abandoned', 'repaired', 'patched', 'era', 'decay', 'tread', 'trace'],
  },
  geometry: {
    themeHint: 'Unexpected Geometry',
    words: ['grid', 'angle', 'circle', 'spiral', 'symmetry', 'diagonal', 'triangle', 'square', 'curve', 'arch', 'parallel', 'perpendicular'],
  },
  design: {
    themeHint: 'Design Detective',
    words: ['sign', 'bolt', 'drain', 'curb', 'handle', 'joint', 'latch', 'vent', 'conduit', 'junction', 'fixture', 'marking'],
  },
};

const FOLLOW_UP_QUESTIONS: Record<string, string[]> = {
  texture: [
    "What forces—weather, friction, human contact—might have contributed to that particular surface texture?",
    "If you closed your eyes and touched that spot, how might the tactile feeling differ from what you expected visually?",
    "Does this texture seem deliberate from when it was built, or is it an accidental artifact of time?",
  ],
  light: [
    "How do you suppose this specific corner changes appearance between high noon and late golden hour?",
    "Is the shadow sharper or softer than the object that created it?",
    "What surface is absorbing the light, and what surface is reflecting it back into the alley?",
  ],
  history: [
    "What layer of repair or modification seems to be the most recent addition here?",
    "Does this suggest an intentional choice by whoever made it, or an improvised fix over time?",
    "What clues indicate whether people still actively interact with this exact fixture?",
  ],
  geometry: [
    "Does this geometric alignment continue further along the facade, or does it abruptly break?",
    "Is this symmetry functional, decorative, or an unintentional coincidence of construction?",
    "What happens to this shape when viewed from ten paces to the left or right?",
  ],
  design: [
    "Who was this small detail originally designed for—a maintenance worker, a passerby, or the building itself?",
    "What tool or fastener appears to be holding this element in its current place?",
    "Does this detail seem contemporary with the rest of the structure, or an afterthought?",
  ],
};

const NEXT_QUESTS: Record<string, string[]> = {
  texture: [
    "Locate a nearby contrasting surface that appears to be at least twenty years newer.",
    "Find a boundary line where two distinctly different masonry materials meet.",
    "Notice the next place where paint or plaster has peeled to reveal another layer underneath.",
  ],
  light: [
    "Find a secondary reflection bouncing off glass or metal into an otherwise shaded recess.",
    "Observe how long a cast shadow takes to shift across one paving stone.",
    "Spot a patch of moss or lichen thriving exclusively in the shade of an architectural overhang.",
  ],
  history: [
    "Search for a hand-stamped utility plate or curb marking with an embossed year or code.",
    "Find an obsolete mounting bracket or severed electrical conduit on an exterior wall.",
    "Look for ghost lettering or faded signage on brickwork above eye level.",
  ],
  geometry: [
    "Seek out an unintentional equilateral triangle created by crossing utility lines or structural braces.",
    "Find a curve that disrupts a repetitive linear grid.",
    "Find a repeated pattern of four identical elements spaced unevenly.",
  ],
  design: [
    "Spot a rainwater diversion feature that shows clever improvisational engineering.",
    "Find a pedestrian desire path or worn threshold where footsteps have carved a subtle groove.",
    "Notice a door handle or latch that reveals which part receives the most friction.",
  ],
};

/**
 * Generate a thoughtful, epistemic-hedged field reflection
 * entirely on-device using sensory analysis of the observation text.
 */
export function generateLocalHeuristicReflection(
  observationText: string,
  questTitle: string,
  theme: QuestTheme,
  placeLabel?: string | null,
): AIReflection {
  const textLower = observationText.toLowerCase();

  // Detect dominant sensory categories
  const scores: Record<string, number> = {
    texture: 0,
    light: 0,
    history: 0,
    geometry: 0,
    design: 0,
  };

  for (const [category, { words }] of Object.entries(SENSORY_KEYWORDS)) {
    for (const w of words) {
      if (textLower.includes(w)) {
        scores[category] = (scores[category] || 0) + 1;
      }
    }
  }

  // Find category with highest score, or fall back to theme match
  let primaryCategory = Object.keys(scores).reduce((a, b) => (scores[a] > scores[b] ? a : b));
  if (scores[primaryCategory] === 0) {
    if (theme === 'Light and Shadow') primaryCategory = 'light';
    else if (theme === 'Urban Archaeology') primaryCategory = 'history';
    else if (theme === 'Unexpected Geometry') primaryCategory = 'geometry';
    else if (theme === 'Design Detective') primaryCategory = 'design';
    else primaryCategory = 'texture';
  }

  // Pick questions & quests deterministically based on text length
  const hash = Math.abs(
    observationText.split('').reduce((acc, char) => (acc << 5) - acc + char.charCodeAt(0), 0),
  );

  const questionList = FOLLOW_UP_QUESTIONS[primaryCategory] || FOLLOW_UP_QUESTIONS.texture;
  const followUp = questionList[hash % questionList.length];

  const questList = NEXT_QUESTS[primaryCategory] || NEXT_QUESTS.texture;
  const nextQuest = questList[(hash + 1) % questList.length];

  // Synthesize observation reflection using strictly hedged language
  const placePhrase = placeLabel ? ` at ${placeLabel}` : '';
  const firstSentence = `Your field note regarding "${questTitle}"${placePhrase} highlights a subtle physical attribute easily missed in routine transit.`;
  
  let secondSentence = '';
  if (primaryCategory === 'texture') {
    secondSentence = 'The tactile contrast you described appears to reflect ongoing wear and environmental deposition rather than static design.';
  } else if (primaryCategory === 'light') {
    secondSentence = 'The play of ambient illumination and shadow seems to redefine the perceived depth of this surface in dynamic ways.';
  } else if (primaryCategory === 'history') {
    secondSentence = 'This observation seems to capture a tangible trace of previous occupancy or layered structural adaptation.';
  } else if (primaryCategory === 'geometry') {
    secondSentence = 'The geometric rhythm you documented suggests an unintentional alignment created by overlapping municipal interventions.';
  } else {
    secondSentence = 'The functional detail you noted reveals the quiet dialogue between architectural intent and actual physical utility.';
  }

  const observation = `${firstSentence} ${secondSentence} It serves as an observant reminder of how much deliberate craft is embedded in everyday infrastructure.`;

  return {
    observation,
    follow_up_question: followUp,
    next_quest: nextQuest,
  };
}
