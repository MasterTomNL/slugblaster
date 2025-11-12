import { SlugblasterCoreSheet } from "./slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items
export class SlugblasterCrewSheet extends SlugblasterCoreSheet {
  get template() {
    return 'systems/slugblaster/template/crew-sheet.hbs';
  }
  
  /** @override */
  async getData() {
    const context = await super.getData();
    
    context.fame = [
      {
      'name': 'Nobodies',
      'desc': 'You’ve been casually slugblasting a little while. You know how to hoverboard, you know how to get into a couple worlds, but no one knows who you are.',
      'img': 'bronze.webp',
      'perks': [
        {
          'name': 'Masks',
          'cost': 2,
          'desc': 'Colourful nanomaterial air filters. Survive in Haz 1 worlds.',
          'img': '/assets/perks/masks.webp'
        }, {
          'name': 'Advanced Portal Technology',
          'cost': 2,
          'desc': 'Portal through thicker zones.',
          'img': '/assets/perks/advanced-portalling-tech.webp'
        }]
    }, {
      'name': 'Up & Comers',
      'cost': 5,
      'desc': 'You have people’s attention, and now they’ll decide if they care.',
      'img': 'silver.webp',
      'rewards': ['+1 to opportunities', '+1 to challenges', 'Rebrand if needed'],
      'perks': [
      {
        'name': 'Hazwear',
        'cost': 2,
        'desc': 'Hazwear suits in a variety of styles. Survive Haz 2 worlds.',
        'img': '/assets/perks/hazwear-v2.webp'
      }, {
        'name': 'Sticker Spotted',
        'cost': 4,
        'desc': 'Your crew’s name in a lasting location. +1 legacy each'
      }, {
        'name': 'Protective Fans',
        'cost': 5,
        'desc': 'Loyal clapback artists and lookouts. Reroll challenges.'
      }, {
        'name': 'Blurb',
        'cost': 5,
        'desc': 'A passing mention in Slugblaster Magazine. +1 with two factions.'
      }]
    }, {
      'name': 'Well-Established',
      'cost': 7,
      'desc': 'The scene knows you now. You’ve earned your right to be here.',
      'img': 'gold.webp',
      'rewards': ['+1 and -1 with two neutral factions.', 'Gain 1 free two-way portal'],
      'perks': [
      {
        'name': 'Logic Binders',
        'cost': 3,
        'desc': 'Protect your math and survive Haz 3 worlds.'
      }, {
        'name': 'Small-Press Merch',
        'cost': 4,
        'desc': 'T-shirts, stickers, pins, patches, etc. +1 hype.'
      }, {
        'name': 'Improved Hangout ',
        'cost': 4,
        'desc': 'Move in to an off-world skate shop, pizza place, test lab, etc.'
      }, {
        'name': 'Diehard Fans',
        'cost': 5,
        'desc': 'Fans that will wear your merch in the casket. +1 legacy each.'
      }]
    }, {
      'name': 'Major Players',
      'cost': 9,
      'desc': 'You get name-dropped routinely and everyone has an opinion on you.',
      'img': 'diamond.webp',
      'rewards': ['Four factions move further from neutral.', 'Gain a third brand.'],
      'perks': [
      {
        'name': 'Name on a Shoe',
        'cost': 5,
        'desc': 'A custom shoe, hoverboard deck, etc. +1 hype.'
      }, {
        'name': 'Eponymous',
        'cost': 5,
        'desc': 'A route, spot, trick, etc. named after the crew. +1 legacy each.'
      }, {
        'name': 'Article',
        'cost': 5,
        'desc': 'An article in Slugblaster Magazine, etc. +1 with two factions.'
      }, {
        'name': 'Tastemaker Fans',
        'cost': 5,
        'desc': 'Influencers, industry peeps, etc. +2 style per run.'
      }]
    }, {
      'name': 'Rising Stars',
      'cost': 9,
      'desc': 'You get name-dropped routinely and everyone has an opinion on you.',
      'img': 'master.webp',
      'rewards': ['+1 to opportunities','+1 to challenges','+1 hype'],
      'perks': [
      {
        'name': 'Quantum Hangout',
        'cost': 5,
        'desc': 'An upgraded hangout spot in your own private demiplane.'
      }, {
        'name': 'Image Rights',
        'cost': 5,
        'desc': 'Your own action figures, video game skins, etc. +1 legacy each.'
      }, {
        'name': 'Screaming Fans',
        'cost': 5,
        'desc': 'A teeming hoard of groupies and stans. +1 hype.'
      }, {
        'name': 'Cover Story',
        'cost': 5,
        'desc': 'Featured in Slugblaster Magazine. +1 legacy each.'
      }]
    }, {
      'name': 'Legends',
      'cost': 11,
      'desc': 'You did it. You’re slugblasting icons and the scene will never forget you. Even your mom’s friend Deborah knows you’re famous for “hockey or rapping or something” and no one can say you didn’t do something with your lives not that you were trying to prove that, right?)',
      'img': 'grandmaster.webp'
    }];
    
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

    // Prepare scoundrel data and items.
    this._prepareItems(context);

    for (const i of context.standings) {
      for (const f of context.factions) {
        if (f.system.level == i.value) {
          i.factions.push(f);
        }
      }
    }
    this._activateDragDrop(context);

    return context;
  }
  
  _prepareItems(context) {
    // get traits and beats from items
    let factions = [];
    let fractures = [];
    for (const i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type == 'faction') factions.push(i);
      if (i.type == 'fracture') fractures.push(i);
    }
    context.factions = factions;
    context.fractures = fractures;
  }
  
  _activateDragDrop(context) {
    // find the containers
    const containers = this.element.find('.draggable-container');
    containers.each((index, container) => {
      const containerId = $(container).data('container-id');
      const dragDrop = new DragDrop({
        dragSelector: ".draggable-item",
        dropZone: container,
        callback: (data) => {
          console.log(`Dropped in container ${containerId}:`, data);
        }
      });
      
      // Manually manage drag-and-drop functionality
      $(container).on('dragstart', '.draggable-item', (event) => {
        const draggedItemId = $(event.currentTarget).data('item-id');
        event.originalEvent.dataTransfer.setData('item-id', draggedItemId);
      });
      
      $(container).on('drop', (event) => {
        event.preventDefault();
        const itemId = event.originalEvent.dataTransfer.getData('item-id');
        let item = this.actor.items.get(itemId);
        let levelId = event.target.dataset.containerId;
        item.update({ ['system.level']: levelId });
      });

      // Prevent default behavior on dragover
      $(container).on('dragover', (event) => {
          event.preventDefault();
      });
    });
  }
  
  
  activateListeners(html) {
		super.activateListeners(html);
    
    this._activateDragDrop(this);
    
    // Add Trait / BeatArc / Beat
		html.on('click', '.addBtn', this._onAdd.bind(this));
    
    // edit (factions)
    html.on('click', '.edit', this._onEdit.bind(this));
    
    // save changes in traits, beatArcs and beats
    html.on('change', '.valChange', this._onValueChange.bind(this));
    
    // Rollable abilities.
    html.on('click', '.rollableTable', this._onRollableTable.bind(this));
    
    // Boost and Kicks and Style
    html.on('click', '.sbResources .icon', this._onDotChange.bind(this));    
    // Boosts, Kicks and Style...
    html.find('.sbResources').each(function () {
		  const value = Number(this.dataset.value);
		  $(this).find(".icon").each(function (i) {
			  if (i + 1 <= value)
          $(this).addClass("active");
			});
		});   
  }
  
  async _onDotChange(event) {
    event.preventDefault();
    // get parent div + key
    let div = $(event.currentTarget).parents('div');
    let key = div.data('key');
    let val = div.data('value');
    let itemId = div.data('itemId');
    // get dot + index
    let dot = $(event.currentTarget);
    let dom_val = Number(dot.data('index')) + 1;
		// determine new value based on dot index and current value
    let new_val = val != dom_val ? dom_val : 0;
    // update the item or actor
    let item = false;
    if (itemId)
      item = this.actor.items.get(itemId);
    if (item)
      await item.update({['system.'+key]: new_val});
    else
      await this.actor.update({['system.'+key]: new_val});
  }
  
  // default module window settings
  static get defaultOptions() {
    const options = super.defaultOptions;
    // sheet window options
    foundry.utils.mergeObject(options, {
      classes: ["slugblaster", "sheet", "crew"],
      width: 640,
      height: 720,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "factions"
      }]
    });
    return options;
  }
}