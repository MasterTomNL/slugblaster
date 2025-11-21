import { SlugblasterCoreSheet } from "./slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items

export class SlugblasterPlaybookSheet extends SlugblasterCoreSheet {
  get template() {
    return 'systems/slugblaster/template/playbook-sheet.hbs';
  }
  
  static PARTS = {
    ...super.PARTS,
      main: { template: 'systems/slugblaster/template/playbook-sheet.hbs' },
  }
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // get traits and beats from items
    let angstBeats = [];
    let crewBeats = [];
    let familyBeats = [];
    let otherBeats = [];
    let playbookBeats = [];
    let traits = [];
    let traitBeats = [];
    
    let type;
    for (const i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      
      // get (system.)type
      type = i.system && i.system.type ? i.system.type : i.type;
      
      if (type == 'angst') angstBeats.push(i);
      if (type == 'crew') crewBeats.push(i);
      if (type == 'family') familyBeats.push(i);
      if (type == 'other') otherBeats.push(i);
      if (type == 'playbook') playbookBeats.push(i);
      if (type == 'trait') traits.push(i);
      if (type == 'traitBeat') traitBeats.push(i);
    }
    context.angstBeats = angstBeats;
    context.crewBeats = crewBeats;
    context.familyBeats = familyBeats;
    context.otherBeats = otherBeats;
    context.playbookBeats = playbookBeats;
    context.traits = traits;
    context.traitBeats = traitBeats;
    
    return context;
  }
  
  // default module window settings
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      classes: ['slugblaster', 'playbook'],
      position: {
        width: 680, // 'auto'
        height: 780, // 'auto'
      },
      window: {
        icon: 'fas fa-user',
        title: 'Slugblaster.Playbook.Title',
        resizable: true,
        minimizable: true,
      },
      actions: {
        addBeat: this.#addBeat,
      }
  };
  
  static async #addBeat(event, target) {
    const type = target.dataset.type;
    const item = {
      name: game.i18n.localize(`Slugblaster.${type}Placeholder`),
      type: 'beat',
      ['system.type']: type
    };
    // create the item
    await Item.create(item, { parent: this.actor });
  }
  
  async _onDropItem(event, data) {
    if (!this.isEditable) return;
    const cls = getDocumentClass("Item");
    const i = await cls.fromDropData(data);
    
    if (i.type == 'beat') {
      await Item.create({
        name: i.name,
        type: i.type,
        ['system.active']: "",
        ['system.type']: i.system.type,
        ['system.cost']: i.system.cost,
        ['system.styleCost']: i.system.styleCost,
        ['system.troubleCost']: i.system.troubleCost,
        ['system.reward']: i.system.reward,
        ['system.description']: i.system.description
      }, { parent: this.actor });
    }
  }  
}