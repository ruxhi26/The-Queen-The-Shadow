import { ScriptAct, CharacterProfile, ColorSwatch } from '../types/script';

// Images generated for the production
import queenCloseup from '../assets/images/queen_closeup_1790494082144.jpg';
import shadowCloseup from '../assets/images/shadow_closeup_1790494098828.jpg';
import queenShadowThrone from '../assets/images/queen_shadow_throne_1790494117170.jpg';
import elenaLedger from '../assets/images/elena_ledger_1790494136309.jpg';
import shadowAlley from '../assets/images/shadow_alley_1790494153864.jpg';
import act3Standoff from '../assets/images/act3_standoff_1790494251849.jpg';
import act4Boardroom from '../assets/images/act4_boardroom_1790494273508.jpg';

export const TITLE_OPTIONS = [
  {
    id: 'title-1',
    title: 'How She Became The Queen — And He Became Her Shadow',
    badge: 'High CTR / Character Arc',
    notes: 'Highlights the dual transformation and status shift.'
  },
  {
    id: 'title-2',
    title: 'The Queen & The Shadow: Origin Story (Dark Mafia Romance)',
    badge: 'SEO & Genre Optimized',
    notes: 'Direct search targeting for dark romance and mafia story communities.'
  },
  {
    id: 'title-3',
    title: 'Before They Ruled: An Origin Story',
    badge: 'Cinematic Minimalist',
    notes: 'Mysterious, prestigious tone for established storytelling channels.'
  }
];

export const SCRIPT_ACTS: ScriptAct[] = [
  {
    id: 'cold-open',
    actNumber: 'COLD OPEN',
    title: 'Cold Open',
    subtitle: 'The Arrival',
    timestamp: '00:00–0:45',
    startSeconds: 0,
    endSeconds: 45,
    visualNote: 'City skyline at night. A black car pulls up. Two silhouettes step out in sync.',
    narrationText: [
      'They walk into every room like they already own it — because they do.',
      'She, in black tailored silk, a red heel striking marble like a countdown.',
      'He, half a step behind, eyes scanning the exits before she\'s even sat down.',
      'People call her The Queen. They call him The Shadow.',
      'But neither name was given to them. They were earned — in blood, in silence, in one year neither of them expected to survive.'
    ],
    cameraShots: [
      {
        id: 'shot-0-1',
        shotNumber: '0.1',
        shotType: 'Wide Shot',
        description: 'Night panorama of the rain-drenched metropolitan skyline. A sleek black luxury sedan glides to a stop before marble steps.',
        cameraMovement: 'Slow push-in toward the tinted car door',
        lightingMood: 'Warm amber streetlights reflecting in wet asphalt, dark charcoal shadows',
        visualMotif: 'City skyline at night & black car',
        expressionGuide: 'Calm and formidable aura',
        imagePlaceholder: queenShadowThrone
      },
      {
        id: 'shot-0-2',
        shotNumber: '0.2',
        shotType: 'Extreme Close-Up',
        description: 'Vibrant crimson red stiletto heel strikes high-gloss dark marble floor with an echoing, deliberate cadence.',
        cameraMovement: 'Low tracking shot along floor',
        lightingMood: 'High contrast rim light on patent red leather',
        visualMotif: 'Red heels striking marble/concrete',
        expressionGuide: 'Unflinching precision',
        imagePlaceholder: queenShadowThrone
      },
      {
        id: 'shot-0-3',
        shotNumber: '0.3',
        shotType: 'Over-the-Shoulder',
        description: 'The Shadow moving silently half a step behind her right shoulder, dark eyes sweeping exits and balconies.',
        cameraMovement: 'Steadycam medium follow',
        lightingMood: 'Deep shadows across his jaw, gold watch glinting under chandelier',
        visualMotif: 'Tailored blazer, gold watch & leather gloves',
        expressionGuide: 'Serious, hyper-alert',
        imagePlaceholder: shadowCloseup
      },
      {
        id: 'shot-0-4',
        shotNumber: '0.4',
        shotType: 'Freeze Frame',
        description: 'Freeze on the iconic leather armchair pose: Elena seated regally, legs crossed, The Shadow standing behind her.',
        cameraMovement: 'Static freeze frame fade to title card',
        lightingMood: 'Warm champagne rim lighting with gold divider line',
        visualMotif: 'Title card: THE QUEEN & THE SHADOW — ORIGIN',
        expressionGuide: 'Elena: Smirk / Calm · Shadow: Stoic guardian',
        imagePlaceholder: queenShadowThrone
      }
    ],
    characterFocus: 'both',
    keyMotifs: ['Black car', 'Red heels', 'Marble floors', 'Gold watch', 'City skyline'],
    expressionElena: 'Calm & Smirk',
    expressionShadow: 'Serious'
  },
  {
    id: 'act-1',
    actNumber: 1,
    title: 'The Girl Who Counted',
    subtitle: 'Elena — The Weapon of Patience',
    timestamp: '0:45–3:00',
    startSeconds: 45,
    endSeconds: 180,
    visualNote: 'Dim office, ledgers, rain on the windows, a young woman working alone.',
    narrationText: [
      'Before she was The Queen, she was just Elena — twenty-four, sharp-eyed, the youngest accountant the family had ever hired.',
      'Not because she was born into this world, but because she was better with numbers than every man twice her age who thought math was beneath him.',
      'She didn\'t carry a weapon. She didn\'t need one.',
      'Her weapon was patience — the kind that let her sit in rooms full of dangerous men and be underestimated, again and again, while she quietly mapped every weakness in the organization\'s books.',
      'She saw the rot before anyone else did. Skimmed accounts. Loyalty bought instead of earned. A boss who ruled through fear instead of respect — and fear, she knew, always has an expiration date.',
      'That name would matter later. For now, she just watched. And waited.'
    ],
    cameraShots: [
      {
        id: 'shot-1-1',
        shotNumber: '1.1',
        shotType: 'Medium Shot',
        description: 'Young Elena working late in a shadowy mahogany-lined office. Streams of rain blur the city lights through the window.',
        cameraMovement: 'Slow arc around the desk',
        lightingMood: 'Warm green banker desk lamp casting long amber shadows',
        visualMotif: 'Rain on window panes & heavy paper ledgers',
        expressionGuide: 'Thoughtful, intense calculation',
        imagePlaceholder: elenaLedger
      },
      {
        id: 'shot-1-2',
        shotNumber: '1.2',
        shotType: 'Close-Up',
        description: 'Elena’s face lit by the desk lamp. Dark intelligent eyes, sleek ponytail, quiet poise in a world of brutes.',
        cameraMovement: 'Static intimate close-up',
        lightingMood: 'Soft warm chiaroscuro',
        visualMotif: 'Gold hoop earrings catching warm light',
        expressionGuide: 'Angry/Thoughtful flashback state',
        imagePlaceholder: queenCloseup
      },
      {
        id: 'shot-1-3',
        shotNumber: '1.3',
        shotType: 'Match Cut',
        description: 'Match cut: Her fountain pen tip dips onto the paper, deliberately circling an offshore laundering account name in blood-red ink.',
        cameraMovement: 'Top-down macro zoom onto the circled name',
        lightingMood: 'High contrast black paper & crimson ink',
        visualMotif: 'Red ink on financial ledger',
        expressionGuide: 'Unwavering resolve',
        imagePlaceholder: elenaLedger
      }
    ],
    characterFocus: 'queen',
    keyMotifs: ['Financial ledgers', 'Red ink circles', 'Rain on glass', 'Banker lamp'],
    expressionElena: 'Thoughtful / Angry (Young Flashback)',
    expressionShadow: 'N/A'
  },
  {
    id: 'act-2',
    actNumber: 2,
    title: 'The Man With No Name Left',
    subtitle: 'The Enforcer in the Cold',
    timestamp: '3:00–5:30',
    startSeconds: 180,
    endSeconds: 330,
    visualNote: 'Dark alley, a young man in a black coat, breath fogging in the cold.',
    narrationText: [
      'Two floors below her office, in a world she\'d never been shown, there was someone who\'d stopped being a boy a long time ago.',
      'No one used his real name anymore — not even himself.',
      'Raised by the organization since he was twelve. No parents. No file. No past. Just orders.',
      'He was fast. Precise. He never asked why — and that\'s exactly what made him valuable, and dangerous, even to the people who thought they owned him.',
      'He had never once been asked to protect something instead of destroy it.',
      'That was about to change.'
    ],
    cameraShots: [
      {
        id: 'shot-2-1',
        shotNumber: '2.1',
        shotType: 'Wide Shot',
        description: 'A subterranean industrial basement and wet asphalt alleyway behind the syndicate headquarters. Damp frost in the air.',
        cameraMovement: 'Dolly backwards revealing lone figure in silhouette',
        lightingMood: 'Cold sodium streetlight slicing through night fog',
        visualMotif: 'Breath fogging in winter air',
        expressionGuide: 'Serious, emotionally detached',
        imagePlaceholder: shadowAlley
      },
      {
        id: 'shot-2-2',
        shotNumber: '2.2',
        shotType: 'Medium Shot',
        description: 'The young enforcer tightening black leather gloves. A tailored dark coat, high-collar black shirt, unyielding posture.',
        cameraMovement: 'Tight rack focus to gloved knuckles',
        lightingMood: 'Deep charcoal and midnight blue',
        visualMotif: 'Black leather gloves & heavy combat boots',
        expressionGuide: 'Determined, calculating',
        imagePlaceholder: shadowAlley
      },
      {
        id: 'shot-2-3',
        shotNumber: '2.3',
        shotType: 'Close-Up',
        description: 'His eyes in the dim light — sharp, dangerous, scarred by a life where hesitation meant death.',
        cameraMovement: 'Slow slow push to eye level',
        lightingMood: 'Single sliver of rim light across cheekbone',
        visualMotif: 'Messy black hair falling over brow',
        expressionGuide: 'Serious / Empty order-follower',
        imagePlaceholder: shadowCloseup
      }
    ],
    characterFocus: 'shadow',
    keyMotifs: ['Black leather gloves', 'Fogging breath', 'Cold alley', 'High collar shirt'],
    expressionElena: 'N/A',
    expressionShadow: 'Serious / Angry'
  },
  {
    id: 'act-3',
    actNumber: 3,
    title: 'The Night Everything Broke',
    subtitle: 'The Ledger & The Standoff',
    timestamp: '5:30–8:30',
    startSeconds: 330,
    endSeconds: 510,
    visualNote: 'Tense meeting room. Raised voices. A gun on the table.',
    narrationText: [
      'Elena\'s numbers finally caught up to the truth: the boss was bleeding the family dry to cover his own debts — and he knew she\'d found it.',
      'So he did what frightened men do. He called in the one person who never failed.',
      'The order was simple: make her disappear before she could talk.',
      'He found her alone, late, still working — because of course she was still working.',
      'She didn\'t scream. She didn\'t run.',
      'She looked up and said the only thing that could have stopped him: "You already know he\'s lying to both of us."',
      'Then she turned the ledger around and showed him exactly how the boss had been selling out his own soldiers — including two men who\'d died covering the boss\'s mistakes that spring. Men he\'d trained. Men he\'d called brothers.',
      'For the first time in his life, he had a choice that wasn\'t an order.',
      'He made it.'
    ],
    cameraShots: [
      {
        id: 'shot-3-1',
        shotNumber: '3.1',
        shotType: 'Medium Shot',
        description: 'The door to Elena’s office clicks open. The enforcer enters like a specter, black coat brushing the frame.',
        cameraMovement: 'Dutch angle tracking his quiet footsteps',
        lightingMood: 'Muted shadows, thunder flash outside illuminating rain streaks',
        visualMotif: 'Black handgun lowered at side',
        expressionGuide: 'Elena: Calm, not flinching · Shadow: Calculating assassin',
        imagePlaceholder: act3Standoff
      },
      {
        id: 'shot-3-2',
        shotNumber: '3.2',
        shotType: 'Over-the-Shoulder',
        description: 'Elena doesn\'t jump up. She smoothly pivots the heavy black leather ledger across the mahogany desk facing him.',
        cameraMovement: 'Push in across the desk toward the open page',
        lightingMood: 'Desk lamp reflects on the crimson circled names of his fallen squad',
        visualMotif: 'Circled casualty accounts in red ink',
        expressionGuide: 'Elena: Steady gaze into his eyes · Shadow: Sudden shock',
        imagePlaceholder: elenaLedger
      },
      {
        id: 'shot-3-3',
        shotNumber: '3.3',
        shotType: 'Extreme Close-Up',
        description: 'His black-gloved hand slowly lowers the weapon. His fingers release the hammer. Tension releases into mutual pact.',
        cameraMovement: 'Macro focus on gun resting gently on desk blotter',
        lightingMood: 'Golden desk lamp glow meets cold night shadow',
        visualMotif: 'Handgun resting beside financial ledger',
        expressionGuide: 'Soft (rare) realization in his eyes',
        imagePlaceholder: shadowCloseup
      },
      {
        id: 'shot-3-4',
        shotNumber: '3.4',
        shotType: 'Freeze Frame',
        description: 'A shared gaze between them in the dark. Silence settles. Cut to black.',
        cameraMovement: 'Snap cut to black',
        lightingMood: 'Total blackout transition',
        visualMotif: 'Silence & heartbeat audio beat',
        expressionGuide: 'Elena: Resolute · Shadow: Bound by choice',
        imagePlaceholder: queenCloseup
      }
    ],
    characterFocus: 'both',
    keyMotifs: ['Handgun on desk', 'Pivoted ledger', 'Thunderstorm', 'Blood oath by choice'],
    expressionElena: 'Fearless / Calm',
    expressionShadow: 'Shock shifting to Soft (rare)'
  },
  {
    id: 'act-4',
    actNumber: 4,
    title: 'What They Built',
    subtitle: 'Rewriting the Rules',
    timestamp: '8:30–11:00',
    startSeconds: 510,
    endSeconds: 660,
    visualNote: 'Montage — a building changing hands, new locks, new rules pinned to a wall.',
    narrationText: [
      'What happened next wasn\'t clean. It wasn\'t quick.',
      'Taking down a man who\'d ruled through fear for fifteen years never is.',
      'But between her mind for the long game and his talent for the short, brutal one, the old boss didn\'t survive the month.',
      'Elena didn\'t just take his chair. She rewrote what came with it: loyalty over fear, precision over chaos, no one expendable again.',
      'The people who\'d once underestimated her started calling her something else. The Queen. Not because she demanded it — because it was, finally, true.',
      'He never wanted a title. But the men who used to fear "the ghost" started calling him something with more weight: The Shadow — because he was always there, half a step behind her, and none of them ever saw him coming until it was too late.'
    ],
    cameraShots: [
      {
        id: 'shot-4-1',
        shotNumber: '4.1',
        shotType: 'Medium Shot',
        description: 'Montage: Syndicate boardroom door hinges replaced. Elena seated at the head of the conference table, discarding old manifests.',
        cameraMovement: 'Fast pan transitions showing systemic takeover',
        lightingMood: 'Clean luxury architectural lighting, champagne accents',
        visualMotif: 'New locks, new rules on boardroom parchment',
        expressionGuide: 'Elena: Authority, Smirk',
        imagePlaceholder: act4Boardroom
      },
      {
        id: 'shot-4-2',
        shotNumber: '4.2',
        shotType: 'Medium Shot',
        description: 'The Shadow standing by the glass doors, arms folded. Capos and underbosses lower their heads in deep deference.',
        cameraMovement: 'Low angle showing imposing height and presence',
        lightingMood: 'Dramatic silhouette with rim lighting',
        visualMotif: 'Tailored black suit, gold watch',
        expressionGuide: 'The Shadow: Deadly, protective vigilance',
        imagePlaceholder: shadowCloseup
      },
      {
        id: 'shot-4-3',
        shotNumber: '4.3',
        shotType: 'Match Cut',
        description: 'He steps up to the primary leather armchair, pulls it out slightly for her, and rests his gloved hand on the backrest.',
        cameraMovement: 'Smooth lateral slide into the iconic stance',
        lightingMood: 'Golden hour twilight transitioning to city night',
        visualMotif: 'Armchair pose from character reference sheet',
        expressionGuide: 'Mutual silent trust',
        imagePlaceholder: queenShadowThrone
      }
    ],
    characterFocus: 'both',
    keyMotifs: ['Boardroom keys', 'Tailored suits', 'Armchair placement', 'Golden chandelier'],
    expressionElena: 'Smirk / Powerful',
    expressionShadow: 'Loyal / Deadly'
  },
  {
    id: 'act-5',
    actNumber: 5,
    title: 'Together, They Rule',
    subtitle: 'The Empire of Choice',
    timestamp: '11:00–13:00',
    startSeconds: 660,
    endSeconds: 780,
    visualNote: 'Return to the opening shot — the armchair, the city lights.',
    narrationText: [
      'It\'s been years since that night in the office, with the ledger between them.',
      'She still runs every number herself. He still checks every exit before she sits down.',
      'Some things about loyalty, once real, don\'t change.',
      'People still whisper about what exactly The Queen and The Shadow are to each other. Business partners. Something more. Neither of them has ever bothered to correct the rumors.',
      'Because in the end, it was never about a title, or a chair, or an empire built out of someone else\'s mistakes.',
      'It was about two people the world had already written off — who decided, together, to write their own ending instead.'
    ],
    cameraShots: [
      {
        id: 'shot-5-1',
        shotNumber: '5.1',
        shotType: 'Wide Shot',
        description: 'Full panorama of the high-rise penthouse office at 2:00 AM. Glowing city sprawl beneath them.',
        cameraMovement: 'Slow dramatic pull-back through floor-to-ceiling glass',
        lightingMood: 'Velvet black, rich gold glows, rain drops on glass',
        visualMotif: 'Penthouse throne & glowing skyline',
        expressionGuide: 'Elena: Calm, poised · Shadow: Watchful guardian',
        imagePlaceholder: queenShadowThrone
      },
      {
        id: 'shot-5-2',
        shotNumber: '5.2',
        shotType: 'Close-Up',
        description: 'Close-up on her face: subtle smirk, crimson lips, gold hoop catching the chandelier. She takes a sip of champagne.',
        cameraMovement: 'Gentle tilt down to her gold watch and ring',
        lightingMood: 'Warm luxury golden rim glow',
        visualMotif: 'Red lips, gold watch, champagne flute',
        expressionGuide: 'Calm & victorious smirk',
        imagePlaceholder: queenCloseup
      },
      {
        id: 'shot-5-3',
        shotNumber: '5.3',
        shotType: 'Close-Up',
        description: 'Close-up on his eyes: no longer the empty gaze of an order-taker. An unspoken vow written in his calm focus.',
        cameraMovement: 'Slow horizontal pan',
        lightingMood: 'Chiaroscuro shadow across jawline',
        visualMotif: 'Dark high-collar shirt & leather watch strap',
        expressionGuide: 'Soft (rare) warmth hidden beneath stoic armor',
        imagePlaceholder: shadowCloseup
      },
      {
        id: 'shot-5-4',
        shotNumber: '5.4',
        shotType: 'Freeze Frame',
        description: 'Final cinematic split / dual freeze frame. The thin gold line divides them. Bold title card emerges: TOGETHER... THEY RULE.',
        cameraMovement: 'Static freeze frame fade to title card',
        lightingMood: 'High contrast black, crimson, gold',
        visualMotif: 'Title card: "TOGETHER... THEY RULE."',
        expressionGuide: 'The iconic couple',
        imagePlaceholder: queenShadowThrone
      }
    ],
    characterFocus: 'both',
    keyMotifs: ['City skyline at night', 'Leather armchair', 'Champagne', 'Thin gold line'],
    expressionElena: 'Calm / Smirk',
    expressionShadow: 'Soft (rare) / Protective'
  },
  {
    id: 'cta',
    actNumber: 'CTA',
    title: 'Outro & Call To Action',
    subtitle: 'The Next Chapter',
    timestamp: '13:00–13:30',
    startSeconds: 780,
    endSeconds: 810,
    visualNote: 'End screen cards, subscribe button animation, teaser preview.',
    narrationText: [
      'If you want to see how far they went to protect what they built — the next chapter\'s coming.',
      'Subscribe so you don\'t miss it.'
    ],
    cameraShots: [
      {
        id: 'shot-cta-1',
        shotNumber: 'CTA.1',
        shotType: 'Freeze Frame',
        description: 'End screen layout with thumbnail preview for Part 2 and dark romance subscribe badge.',
        cameraMovement: 'Pulsing gold outline around next video card',
        lightingMood: 'Deep black background with crimson accent lines',
        visualMotif: 'Subscribe bell & Part 2 Teaser Card',
        expressionGuide: 'Final hook',
        imagePlaceholder: queenShadowThrone
      }
    ],
    characterFocus: 'both',
    keyMotifs: ['Subscribe card', 'Part 2 teaser', 'Dark romance badge'],
    expressionElena: 'Smirk',
    expressionShadow: 'Serious'
  }
];

export const CHARACTER_DOSSIERS: Record<string, CharacterProfile> = {
  queen: {
    name: 'Elena',
    alias: 'The Queen',
    role: 'Female Boss / Mastermind',
    traits: ['Smart', 'Fearless', 'Intelligent', 'Powerful', 'Loyal', 'Calm'],
    backstory: 'Hired at twenty-four as the youngest accountant in the organization. Armed only with patience and an uncanny ability to read ledgers like weapon schematics, she quietly dismantled a fifteen-year tyrannical regime and rebuilt the family into an untouchable empire founded on respect and precision.',
    wardrobe: [
      {
        item: 'Tailored Black Silk Blazer',
        description: 'Sharp, bespoke black double-breasted suit with silk lapels.',
        symbolism: 'Command, sophistication, and unyielding modern authority.'
      },
      {
        item: 'Red Stiletto Heels',
        description: 'Vibrant patent crimson stilettos with sharp heels.',
        symbolism: 'A countdown audible to everyone in the room; unapologetic danger.'
      },
      {
        item: 'Gold Watch & Hoops',
        description: 'Understated Swiss gold luxury watch and thick gold hoop earrings.',
        symbolism: 'Patience rewarded; every second accounted for.'
      },
      {
        item: 'Belt Detail & Minimalist Cami',
        description: 'Gold buckle cinch over high-waisted wide-leg tailored trousers.',
        symbolism: 'Disciplined elegance and effortless power.'
      }
    ],
    expressions: [
      {
        name: 'Calm',
        usage: 'Present-day negotiations & standard baseline',
        description: 'Resting composed expression. Nothing surprises her.'
      },
      {
        name: 'Smirk',
        usage: 'When an adversary plays directly into her trap',
        description: 'Subtle tilt of red lips; absolute intellectual supremacy.'
      },
      {
        name: 'Thoughtful',
        usage: 'Flashbacks & studying financial ledgers',
        description: 'Pen in hand, brow slightly furrowed in deep calculation.'
      },
      {
        name: 'Angry',
        usage: 'Young-Elena flashback when uncovering soldiers betrayed',
        description: 'Controlled cold fury, eyes burning with quiet fire.'
      }
    ],
    voiceTone: 'Silky, measured, unwavering, authoritative without raising her voice.',
    keyQuote: '"You already know he\'s lying to both of us."',
    primaryImage: queenCloseup
  },
  shadow: {
    name: 'Unknown',
    alias: 'The Shadow',
    role: 'Male Gangster / Enforcer / Protector',
    traits: ['Loyal', 'Protective', 'Serious', 'Mysterious', 'Skilled', 'Deadly'],
    backstory: 'Taken in by the organization at age twelve with no name, file, or past. For twelve years he operated as an unhesitating instrument of destruction. The night he was ordered to eliminate Elena, she offered him the truth and his first genuine choice: fight for a puppet master, or protect the only person who valued his humanity.',
    wardrobe: [
      {
        item: 'High Collar Black Shirt & Suit',
        description: 'Fitted charcoal/black suit jacket with open top button high-collar dress shirt.',
        symbolism: 'Lethal efficiency, shadow operative aesthetic, zero excess.'
      },
      {
        item: 'Black Leather Gloves',
        description: 'Supple tactical black leather driving gloves.',
        symbolism: 'Leaves no prints; ready for tactical intervention at all times.'
      },
      {
        item: 'Tactical Leather Watch & Boots',
        description: 'Matte black timekeeper and heavy polished black combat dress boots.',
        symbolism: 'Grounding, speed, silent movement across marble or asphalt.'
      }
    ],
    expressions: [
      {
        name: 'Serious',
        usage: 'Default state, scanning perimeters and exits',
        description: 'Hyper-vigilant, stoic, dark intense gaze.'
      },
      {
        name: 'Determined',
        usage: 'Engaging threats or executing syndicate maneuvers',
        description: 'Jaw clenched, laser-focused predator composure.'
      },
      {
        name: 'Angry',
        usage: 'When anyone threatens Elena or violates their code',
        description: 'Lethal cold gaze that terrifies seasoned mob capos.'
      },
      {
        name: 'Soft (rare)',
        usage: 'Final act & rare private moments with Elena',
        description: 'Eyes softening slightly, lowering his emotional armor.'
      }
    ],
    voiceTone: 'Deep, gravelly, quiet, spoken with absolute economy of words.',
    keyQuote: '"Tell me who to remove."',
    primaryImage: shadowCloseup
  }
};

export const COLOR_PALETTE: ColorSwatch[] = [
  {
    name: 'Obsidian Black',
    hex: '#0A0A0C',
    role: 'Primary Canvas & Suits',
    aestheticUsage: 'The foundation of power, darkness, and executive presence.'
  },
  {
    name: 'Charcoal Shadow',
    hex: '#1E1E22',
    role: 'Secondary Texture & Depth',
    aestheticUsage: 'Interior upholstery, shadows, rain-slicked city asphalt.'
  },
  {
    name: 'Blood Crimson',
    hex: '#DC2626',
    role: 'Accent & Statement',
    aestheticUsage: 'Elena\'s red heels, red lipstick, red ink on ledgers, danger motif.'
  },
  {
    name: 'Champagne Gold',
    hex: '#D4AF37',
    role: 'Prestige & Divider',
    aestheticUsage: 'Watch faces, hoop earrings, divider line on split thumbnail, rim light.'
  },
  {
    name: 'Warm Ivory / White',
    hex: '#F4EEDB',
    role: 'Text & Clarity',
    aestheticUsage: 'Bold serif headline typography, crisp paper ledgers, stark contrast.'
  }
];

export const PROPS_AND_VIBES = [
  {
    name: 'The Black Car',
    category: 'Vehicle / Entrance',
    details: 'Luxury armored black sedan with tinted windows. Appears in cold open and Act 5 closing bookends.'
  },
  {
    name: 'The Handgun',
    category: 'Weapon / Standoff',
    details: 'Matte black semi-automatic pistol. Shown, lowered, and laid on the desk; never fired on-screen to preserve mature, high-tension thriller tone.'
  },
  {
    name: 'The Financial Ledger',
    category: 'Intel / Turning Point',
    details: 'Heavy leather-bound ledger with hand-recorded accounts and red ink circles revealing the boss\'s fatal betrayal.'
  },
  {
    name: 'The Leather Armchair',
    category: 'Throne / Power Symbol',
    details: 'Deep brown/black vintage executive leather armchair. The signature pose where she sits and he stands behind her shoulder.'
  },
  {
    name: 'City Skyline at Night',
    category: 'Atmosphere / Bookend',
    details: 'Floor-to-ceiling panoramic glass windows overlooking rainy metropolitan towers and golden bokeh.'
  }
];

export const YOUTUBE_METADATA = {
  defaultTitle: 'How She Became The Queen — And He Became Her Shadow',
  descriptionTemplate: `Before the world called her The Queen and him The Shadow, they were just two people everyone around them had already written off. This is their origin story — how a sharp-eyed accountant and a nameless enforcer became the most feared partnership in the city.

TIMESTAMPS:
00:00 Cold Open — The Arrival
00:45 Act 1 — The Girl Who Counted
03:00 Act 2 — The Man With No Name Left
05:30 Act 3 — The Night Everything Broke
08:30 Act 4 — What They Built
11:00 Act 5 — Together, They Rule
13:00 Outro & What Comes Next

If you enjoyed this origin story, subscribe for Part 2.

#DarkRomance #MafiaStory #OriginStory #CrimeRomance #EnemiesToLovers #PowerCouple`,
  tags: [
    'dark romance story',
    'mafia romance',
    'origin story',
    'mafia boss story',
    'enemies to lovers',
    'power couple story',
    'crime romance',
    'mafia queen',
    'dark fiction narration',
    'storytelling video',
    'mafia gangster story',
    'romantic thriller story',
    'cinematic story narration',
    'AI story',
    'female mafia boss',
    'bodyguard romance'
  ],
  stats: {
    targetLength: '~12–14 minutes',
    estimatedWords: 840,
    narratorWpm: 125,
    visualSceneCount: 19
  }
};
