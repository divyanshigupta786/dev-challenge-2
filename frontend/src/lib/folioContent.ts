import type { Quest, QuestTheme } from './types';

export interface FolioData {
  folioNumber: string;
  series: string;
  questTitle: string;
  theme: QuestTheme;
  difficulty: string;
  invitationText: string;
  reminderRule: string;
  whatToNotice: string[];
  sensoryTitle: string;
  sensoryPrompt: string;
  sensoryPromptDetail: string;
  sketchCaption: string;
  fieldNotesQuestions: string[];
  reflectionPrompts: {
    finalThought: string;
    transformationQuestion: string;
    closingInstruction: string;
  };
  backCoverClosing: string;
}

export function deriveFolioData(quest: Quest, index = 1): FolioData {
  // Format index as 3-digit number (e.g., No. 001, No. 014)
  const numStr = String(index).padStart(3, '0');
  const folioNumber = `No. ${numStr}`;

  // Theme-tailored sensory activity
  let sensoryTitle = 'Listen or Look Closer';
  let sensoryPrompt = 'Close your eyes for a moment. What do you hear? What do you notice when you look more closely?';
  let sensoryPromptDetail = 'Record one subtle sound, tactile texture, or hidden detail:';

  if (quest.theme === 'Light and Shadow') {
    sensoryTitle = 'Shadow & Luminance Study';
    sensoryPrompt = 'Track the boundary between bright sun and cast shadow. How sharp or diffused is the edge?';
    sensoryPromptDetail = 'Note the angle of the light and the dark gradient it casts:';
  } else if (quest.theme === 'Urban Archaeology') {
    sensoryTitle = 'Tactile Strata & Weathering';
    sensoryPrompt = 'Trace your fingers across the boundary between materials, or inspect where two eras join.';
    sensoryPromptDetail = 'What texture changes or repair marks indicate age and wear?';
  } else if (quest.theme === 'Pattern Hunt') {
    sensoryTitle = 'Rhythm & Repetition Check';
    sensoryPrompt = 'Pause your walking rhythm. Scan from the pavement joints to the rooflines.';
    sensoryPromptDetail = 'Note where the repeating rhythm suddenly shifts, breaks, or stutters:';
  } else if (quest.theme === 'Unexpected Geometry') {
    sensoryTitle = 'Angle & Alignment Inspection';
    sensoryPrompt = 'Shift your viewpoint five paces to the side. Watch how lines intersect from this new angle.';
    sensoryPromptDetail = 'Describe the hidden triangle, curve, or perpendicular intersection:';
  } else if (quest.theme === 'Design Detective') {
    sensoryTitle = 'Function & Fastener Clues';
    sensoryPrompt = 'Look for the hardware, joint, seam, or fastener holding this feature in place.';
    sensoryPromptDetail = 'What shows whether this was factory-made or improvised by a human hand?';
  }

  // Derive 4 observation prompts based on tips and theme
  const whatToNotice: string[] = [];
  if (quest.tips && quest.tips.length > 0) {
    for (const tip of quest.tips.slice(0, 3)) {
      whatToNotice.push(tip);
    }
  }

  // Ensure 4 prompts are populated
  if (whatToNotice.length < 4) {
    if (quest.theme === 'Urban Archaeology') {
      whatToNotice.push('Find a surface marked by time, friction, or repeated human contact');
      whatToNotice.push('Notice a repaired, patched, or repurposed physical detail');
    } else if (quest.theme === 'Pattern Hunt') {
      whatToNotice.push('Find a repetition in pavement, bricks, railings, or grates');
      whatToNotice.push('Notice where the pattern is interrupted or imperfect');
    } else if (quest.theme === 'Light and Shadow') {
      whatToNotice.push('Notice a shadow creating an unexpected geometric shape');
      whatToNotice.push('Find a surface reflecting light into a shadowed alcove');
    } else {
      whatToNotice.push('Details in the immediate environment you usually overlook');
      whatToNotice.push('Signs of time, wear, and everyday human use');
    }
  }

  return {
    folioNumber,
    series: 'MUNDANE / FIELD FOLIO',
    questTitle: quest.title,
    theme: quest.theme,
    difficulty: quest.difficulty,
    invitationText: quest.description,
    reminderRule: 'Remember: observe before you interpret. Record what is present, not what should be there.',
    whatToNotice: whatToNotice.slice(0, 4),
    sensoryTitle,
    sensoryPrompt,
    sensoryPromptDetail,
    sketchCaption: 'Draw what you noticed, not what you think should be there.',
    fieldNotesQuestions: [
      'What caught your attention first?',
      'What surprised you or felt unexpected?',
      'What did you almost walk past or miss?',
      'What are you still wondering about?',
    ],
    reflectionPrompts: {
      finalThought: 'One final thought or lingering question...',
      transformationQuestion: 'How does knowing this detail exists change the way you see this corner of your city?',
      closingInstruction: '(Complete after your field walk, before returning to Mundane)',
    },
    backCoverClosing: 'There is more here than you first noticed.',
  };
}
