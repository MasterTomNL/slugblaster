export const Slugblaster_config = {
  'look': [
    ['minimal','technical','oversized','fitted','all black','pastel'],
    ['neon','muted','vintage','flashy','polished','provocative'],
    ['relaxed','cutesy','trashy','chic','androgynous','brand-new'],
    ['classic','sporty','piercings','chains','second-hand','handmade'],
    ['ballcap','braces','nail polish','jewelry','shoelace belt','light makeup'],
    ['full beat','glasses','bandanna','dyed hair','lots of hair','shaved head']
  ],
  'family': [
    ['rich','boring'],
    ['poor','religious'],
    ['supportive','big'],
    ['unstable','small'],
    ['strict','sheltered'],
    ['relaxed','ultraterrestrial']
  ],
  'bond': ['childhood friends','mutual goals','well-kept secret','natural chemistry','relatives','shared hardships'],
  'playbooks': [{
    'name': 'The Grit',
    'boosts': 3,
    'kicks': 1,
    'extra_gear': ['Something Everyone Else Forgot', 'Backup Portaling Device'],
    'style_bonus': 'Get +1 style where you show toughness or focus.',
    'traits': [
      ['Patient.', "When you reveal how you've been waiting to act, get +1d6 or +1 kick on your action." ],
      ['Sacrifice Your Body.', "Take a slam (exhausted, strained, etc.) to get +2d6 to your action. This slam can’t be noped or avoided in any way. You gotta actually take it, kid." ],
      ['Diligent.', "You can reroll In the Lab. Also clear +1 trouble when Being Good once per downtime."],
      ['Walk It Off.', "You gain 1 extra slam box. Mark 1 style every time you take a slam"],
      ['Skill.', "You’ve spent hours and hours practicing <<input>>. If this would help you with an action, you can mark 1 trouble to upgrade a 1–3 result into a 4/5 result." ]
    ]
  }, {
    'name': 'The Guts',
    'boosts': 1,
    'kicks': 3,
    'extra_gear': ["Something You're Not Supposed to Have", "A Portable Speaker"],
    'style_bonus': 'Get +1 style after runs where you show boldness or risk-taking.',
    'traits': [
      ['Show off.', "You get +1d6 when you do a trick. You just can't help it, the spotlight loves you."],
      ['Snake.', "If there is any question about who goes first, it’s you."],
      ['Double Dare', "Instead of taking a dare, you can mark 2 trouble for +2d6 or +2 kick to an action roll."],
      ['Walking Disaster.', "You don’t just flirt with disaster, you’re dating it. You get +1d6 on disaster rolls, and can choose to take a disaster for a willing teammate. If you do, mark 2 style."],
      ['Raw Talent.', "You’ve always just been amazing at <<input>>. If this would help you with an action, you can mark 1 trouble to upgrade a 1-3 result into a 4/5 result."]
    ]
  }, {
    'name': 'The Smarts',
    'boosts': 2,
    'kicks': 1,
    'extra_gear': ['A Work-In-Progress', 'A Vital Screenshot or Image File'],
    'style_bonus': 'Get +1 style after runs where you show curiosity or creativity.',
    'traits': [
      ['Lateral Thinking.', "When you try a trick with a creative approach, mark 1 style even on a failed roll."],
      ['Technobabble.', "Twice per run, explain something technical with jargon or a fun metaphor for 1 style and +1d6 to a roll."],
      ['Power User.', "Gain a secondary signature of your choosing. It shares the turbo pool of your primary one and has space for one mod (solf seperately)."],
      ['Actually Reads the Manual.', "You can break mods down into components and install new mids on the fly. It takes either an action roll or a few minutes."],
      ['Know-How.', "You know everything about <<input>>. If this would help you with an action, you can mark 1 trouble to upgrade a 1-3 result into a 4/5 result."]
    ]
  }, {
    'name': 'The Chill',
    'boosts': 'unlimited',
    'kicks': 0,
    'extra_gear': ['Something You Found on Your Way Here', 'A Pet'],
    'style_bonus': 'Get +1 style after runs where you show ease or flow.',
    'traits': [
      ['Steezey.', "Mark 1 style anytime you roll doubles. You look cool without even knowing it."],
      ['Umm… Guys?', "You accidentally notice the stuff everyone else didn’t, like hidden panels, perfect skate spots, looming monsters, etc."],
      ['Button Masher.', "Mark 1 turbo to use a locked mod for the length of one action - or 2 turbo if the mod is from another device. Be careful, potential problems are worse."],
      ['Lucky.', "Once per run, dumb luck helps you. A tree falls on a monster, lasers miss as you tie your shoes, you knowingly give someone a perfect gift, etc."],
      ['Quirk.', "For some weird reason, you are good at <<input>>. If this would help you with an action, you can mark 1 trouble to upgrade a 1-3 result into a 4/5 result."]
    ]
  }, {
    'name': 'The Heart',
    'boosts': 1,
    'kicks': 2,
    'extra_gear': ['Something From Someone Special', 'An Important Pamphlet'],
    'style_bonus': 'Get +1 style after runs where you show passion or empathy.',
    'traits': [
      ['Team Player. ', "Mark 1 style whenever you take (or nope) a slam for someone else."],
      ['Pep Talk. ', "Once per run, refill 3 hype or clear a slam for a teammate. What do they need to hear the most right now?"],
      ['Middle Finger.', "Once per run, automatically get a 6 on any action, no roll required. Add up to 2 kick, baby. Nothing can stand in your way."],
      ['Intuition.', "You can always tell who likes/dislikes who, what someone really wants, and if someone’s vibes are off"],
      ['Passion. ', "You care a lot about <<input>>. If this would help you with an action, you can mark 1 trouble to upgrade a 1−3 result into a 4/5 result."]
    ]
  }]
};