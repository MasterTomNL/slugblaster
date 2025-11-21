import { SlugblasterCoreSheet } from "./slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items
const { DragDrop } = foundry.applications.ux

export class SlugblasterCrewSheet extends SlugblasterCoreSheet {
  #dragDrop
  get template() {
    return 'systems/slugblaster/template/crew-sheet.hbs';
  }
  
  static TABS = {
    crew: {
      tabs: [
        { group: 'crew', id: 'factions', label: 'Slugblaster.Crew.Factions' },
        { group: 'crew', id: 'fame',     label: 'Slugblaster.Crew.Fame' },
        { group: 'crew', id: 'dicepool', label: 'Slugblaster.Dicepool' },
        { group: 'crew', id: 'notes',    label: 'Slugblaster.Notes' }
      ],
      initial: 'factions'
    }
  }
  
  static PARTS = {
    ...super.PARTS,
      main: { template: 'systems/slugblaster/template/crew-sheet.hbs' },
      fractures: { template: 'systems/slugblaster/template/parts/crew-part-fractures.hbs' },
      tabs: { template: 'systems/slugblaster/template/parts/crew-tabs.hbs' },
      factions: { template: 'systems/slugblaster/template/parts/crew-tab-factions.hbs' },
      fame: { template: 'systems/slugblaster/template/parts/crew-tab-fame.hbs' },
      dicepool: { template: 'systems/slugblaster/template/parts/crew-tab-dicepool.hbs' },
      notes: { template: 'systems/slugblaster/template/parts/tab-notes.hbs' },
  }
  
  // default module window settings
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      classes: ['slugblaster', 'crew'],
      position: {
        width: 640, // 'auto'
        height: 780, // 'auto'
      },
      window: {
        icon: 'fas fa-user',
        title: 'Slugblaster.Crew.Title',
        resizable: true,
        minimizable: true,
      },
      actions: {
        addFaction: this.#addFaction,
        prevFame: this.#prevFame,
        nextFame: this.#nextFame,
        unlockPerk: this.#unlockPerk
      },
      dragDrop: [{
        dragSelector: '.draggable',
        dropSelector: '.drop-zone'
      }]
  };
  
  constructor(options = {}) {
    super(options)
    this.#dragDrop = this.#createDragDropHandlers()
  }
  
  #createDragDropHandlers() {
    return this.options.dragDrop.map((d) => {
      d.permissions = {
        //dragstart: this._canDragStart.bind(this),
        //drop: this._canDragDrop.bind(this)
      }
      d.callbacks = {
        dragstart: this._onDragStart.bind(this),
        //dragover: this._onDragOver.bind(this),
        drop: this._onDrop.bind(this)
      }
      return new DragDrop(d)
    })
  }
  
  _onDragStart(event) {
    const itemId = event.target.dataset.itemId;
    console.log('_ondragStart',itemId, event);
    event.dataTransfer.setData('itemId', itemId);
  }
  
  _onDrop(event) {
    event.preventDefault();
    const itemId = event.dataTransfer.getData('itemId');
    let item = this.actor.items.get(itemId);
    let levelId = event.target.dataset.containerId;
    item.update({ ['system.level']: levelId });
  }
  
  static async #addFaction(event, target) {
    this.addItem('faction', null);
  }
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // use a safe clone of actor data
    context.isGM = game.user.isGM;
    context.actor = this.document;
    context.system = this.actor.system;
    context.editable = context.isGM || this.actor.isOwner;
    // set current fame level
    const fameLevel = context.system.fame_level;
    
    // fame levels
    context.fame = [
      { 'name': 'Nobodies' },
      { 'name': 'Up & Comers', 'cost': 5 },
      { 'name': 'Well-Established', 'cost': 7 },
      { 'name': 'Major Players', 'cost': 9 },
      { 'name': 'Rising Stars', 'cost': 9 },
      { 'name': 'Legends', 'cost': 11 }];
    // set next level style cost
    context.nextLevelStyleCost = fameLevel < 5 ? context.fame[fameLevel+1].cost : 0;
    
    context.standings = [
      { 'name': 'ally', 'value': '+3', 'factions':[], 'desc': 'Ride or Die. Should trigger a perk or event, such as Diehard Fans, Collab, or Swag.'},
      { 'name': 'tight', 'value': '+2', 'factions':[], 'desc': 'Helpful, close, caring, enthusiastic.' },
      { 'name': 'friendly', 'value': '+1', 'factions':[], 'desc': 'Agreeable, interested, encouraging.' },
      { 'name': 'unstable', 'value': '0', 'factions':[], 'desc': 'The relationship is on the verge of changing dramatically. Anything could tip it.' },
      { 'name': 'unfriendly', 'value': '-1', 'factions':[], 'desc': 'Annoyed, skeptical, or wary.' },
      { 'name': 'rivals', 'value': '-2', 'factions':[], 'desc': 'Resentful, angry, threatened, petty.' },
      { 'name': 'enemy', 'value': '-3', 'factions':[], 'desc': 'Let me at ‘em. Should trigger an event like Hunted or Smear Tactics.' }
    ];
    
    context.perks = [
      {
        'name': 'Masks',
        'level': 0,
        'cost': 2,
        'desc': 'Colourful nanomaterial air filters. Survive in Haz 1 worlds.',
        'img': '/assets/perks/masks.webp'
      }, {
        'name': 'Advanced Portal Technology',
        'level': 0,
        'cost': 2,
        'desc': 'Portal through thicker zones.',
        'img': '/assets/perks/advanced-portalling-tech.webp'
      }, {
        'name': 'Hazwear',
        'level': 1,
        'cost': 2,
        'desc': 'Hazwear suits in a variety of styles. Survive Haz 2 worlds.',
        'img': '/assets/perks/hazwear-v2.webp'
      }, {
        'name': 'Sticker Spotted',
        'level': 1,
        'cost': 4,
        'desc': 'Your crew’s name in a lasting location. +1 legacy each'
      }, {
        'name': 'Protective Fans',
        'level': 1,
        'cost': 5,
        'desc': 'Loyal clapback artists and lookouts. Reroll challenges.'
      }, {
        'name': 'Blurb',
        'level': 1,
        'cost': 5,
        'desc': 'A passing mention in Slugblaster Magazine. +1 with two factions.'
      }, {
        'name': 'Logic Binders',
        'level': 2,
        'cost': 3,
        'desc': 'Protect your math and survive Haz 3 worlds.'
      }, {
        'name': 'Small-Press Merch',
        'level': 2,
        'cost': 4,
        'desc': 'T-shirts, stickers, pins, patches, etc. +1 hype.'
      }, {
        'name': 'Improved Hangout ',
        'level': 2,
        'cost': 4,
        'desc': 'Move in to an off-world skate shop, pizza place, test lab, etc.'
      }, {
        'name': 'Diehard Fans',
        'level': 2,
        'cost': 5,
        'desc': 'Fans that will wear your merch in the casket. +1 legacy each.'
      }, {
        'name': 'Name on a Shoe',
        'level': 3,
        'cost': 5,
        'desc': 'A custom shoe, hoverboard deck, etc. +1 hype.'
      }, {
        'name': 'Eponymous',
        'level': 3,
        'cost': 5,
        'desc': 'A route, spot, trick, etc. named after the crew. +1 legacy each.'
      }, {
        'name': 'Article',
        'level': 3,
        'cost': 5,
        'desc': 'An article in Slugblaster Magazine, etc. +1 with two factions.'
      }, {
        'name': 'Tastemaker Fans',
        'level': 3,
        'cost': 5,
        'desc': 'Influencers, industry peeps, etc. +2 style per run.'
      }, {
        'name': 'Quantum Hangout',
        'level': 4,
        'cost': 5,
        'desc': 'An upgraded hangout spot in your own private demiplane.'
      }, {
        'name': 'Image Rights',
        'level': 4,
        'cost': 5,
        'desc': 'Your own action figures, video game skins, etc. +1 legacy each.'
      }, {
        'name': 'Screaming Fans',
        'level': 4,
        'cost': 5,
        'desc': 'A teeming hoard of groupies and stans. +1 hype.'
      }, {
        'name': 'Cover Story',
        'level': 4,
        'cost': 5,
        'desc': 'Featured in Slugblaster Magazine. +1 legacy each.'
      }];
    
    //
    context.unlocked = [];
    let fame_perks = context.system.fame_perks;
    let unlocks = fame_perks ? fame_perks.split(",") : [];
    context.perks.forEach((p, index) => {
      p.unlocked = false;
      if (unlocks.includes(index.toString())) {
        context.unlocked.push(p);
        p.unlocked = true;
      }
      context.perks[index] = p;
    });
    
    // get factions and fame from items
    let factions = [];
    let fractures = [];
    let items = this.actor.items;
    for (const i of items) {
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type == 'faction') factions.push(i);
      if (i.type == 'fracture') fractures.push(i);
    };
    context.factions = factions;
    context.fractures = fractures;
    
    for (const i of context.standings) {
      for (const f of context.factions) {
        if (f.system.level == i.value) {
          i.factions.push(f);
        }
      }
    }
    //this._activateDragDrop(context);

    return context;
  }
  
  static async #nextFame(event, target) {
    event.preventDefault();
    // get itemId and styleCost
    let styleCost = Number(target.dataset.styleCost);
    // get existing perks and style
    let fameLevel = Number(this.actor.system.fame_level);
    let style = Number(this.actor.system.style);
    // stop when we don't have enough style points or we are maxed level
    if (style < styleCost || fameLevel == 5) return;
    // add unlocked perk
    fameLevel += 1;
    style -= styleCost;
    // save new values to the actor
    await this.actor.update({
      ['system.fame_level']: fameLevel,
      ['system.style']: style
    });
  }
  
  static async #prevFame(event, target) {
    event.preventDefault();
    let fameLevel = Number(this.actor.system.fame_level);
    if (fameLevel <= 0) return;
    await this.actor.update({ ['system.fame_level']: fameLevel - 1 });
  }
  
  static async #unlockPerk(event, target) {
    event.preventDefault();
    // get itemId and styleCost
    let itemId = target.dataset.itemId;
    let styleCost = Number(target.dataset.styleCost);
    // get existing perks and style
    let perks = this.actor.system.fame_perks;
    let style = Number(this.actor.system.style);
    // stop when we don't have enough style points
    if (style < styleCost) return;
    // add unlocked perk
    perks += (perks ? "," : "") + itemId;
    style -= styleCost;
    // save new values to the actor
    await this.actor.update({
      ['system.fame_perks']: perks,
      ['system.style']: style
    });
  }
}