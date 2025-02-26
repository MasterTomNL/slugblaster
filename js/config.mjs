export const SlugblasterConfig = {
  "rollableTables": {
    "look": ["minimal", "technical", "oversized", "fitted", "all black", "pastel", "neon", "muted", "vintage", "flashy", "polished", "provocative", "relaxed", "cutesy", "trashy", "chic", "androgynous", "brand-new", "classic", "sporty", "piercings", "chains", "second-hand", "handmade", "ballcap", "braces", "nail polish", "jewelry", "shoelace belt", "light makeup", "full beat", "glasses", "bandanna", "dyed hair", "lots of hair", "shaved head"],
    "bond": ["childhood friends", "mutual goals", "well-kept secret", "natural chemistry", "relatives", "shared hardships"],
    "family": ["rich", "boring", "poor", "religious", "supportive", "big", "unstable", "small", "strict", "sheltered", "relaxed", "ultraterrestrial"],
    "vibes": {
      "the-chill": ["space cadet", "just woke up", "laundry day", "deadpan", "always eating a bag of chips", "kisses their mom on the lips and isn’t weird about it"],
      "the-grit": ["one song on repeat", "never smile", "your drink matches your shoes", "sleep when you’re dead", "adult-in-residence", "overachiever"],
      "the-guts": ["queen", "hot mess", "highly-caffeinated", "wear your own merch", "infected nipple ring", "shades indoors"],
      "the-heart": ["hugger", "always shares at youth group", "everything’s political", "active listener", "positive vibes only", "always the youngest"],
      "the-smarts": ["lost in thought", "homeschool chic", "dad cuts your hair", "pencil above ear", "just learned what avant-garde is", "wall of text"]
    },
    
    "raygun": {
      "style": ["particle", "maser", "proton", "neutron", "laser", "reality", "mass", "feedback", "photon", "danger", "gravity", "zero"],
      "type": ["ray", "bow", "beam", "wave", "blaster", "pistol", "visor", "projector", "arc", "cannon", "wand", "glove"]
    },
    
    "hoverboard": {
      "grip-colour": ["a classic black", "a classic black", "a red", "a yellow", "a blue", "an orange", "a purple", "a green", "a pink", "a white", "a clear", "a hologram"],
      "grip-cut": ["solid", "solid", "stripe", "band", "word", "pattern", "logo", "messy", "mosaic", "design", "painted", "torn"],
      "deck-graphic": ["unpainted", "with a solid colour", "with a rad design", "with a name of a sponsor", "with a cool image", "with a dope pattern", "with a custom paint job", "with a sticker collage", "signed by someone", "with a programmable display", "with a hilarious slogan", "with a hilarious slogan"],
      "type": ["street", "mcfly", "manta", "bigfoot", "oldschool", "slush", "penny", "nickel", "gert", "bomb", "drift", "wave", "bmx", "bmx", "laserblades", "laserblades", "freerunners", "freerunners"],
    }
  },
  "styleBonuses": {
    "the-chill": "ease or flow",
    "the-grit": "toughness or focus",
    "the-guts": "boldness or risk-taking",
    "the-heart": "passion or empathy",
    "the-smarts": "curiosity or creativity"
  },
  "playbooks": ["the-chill", "the-grit", "the-guts", "the-heart", "the-smarts"],
  "kicks-and-boosts": [
    ['unlimited', 0], // chill
    [3, 1], // grit
    [1, 3], // guts
    [1, 2], // heart
    [2, 1] // smarts
  ]
};
