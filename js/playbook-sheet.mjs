import { SlugblasterCoreSheet } from "./slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items

export class SlugblasterPlaybookSheet extends SlugblasterCoreSheet {
  get template() {
    return 'systems/slugblaster/template/playbook-sheet.hbs';
  }
  
  /** @override */
  async getData() {
    const context = await super.getData();

    // Prepare scoundrel data and items.
    this._prepareItems(context);

    return context;
  }
  
  _prepareItems(context) {
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
  }
  
  activateListeners(html) {
		super.activateListeners(html);
    
    // Add Trait / BeatArc / Beat
		html.on('click', '.addBtn', this._onAdd.bind(this));
    
    // Delete Trait / BeatArc / Beat
		html.on('click', '.delete', this._onDelete.bind(this));
    
    // save changes in traits, beatArcs and beats
    html.on('change', '.valChange', this._onValueChange.bind(this));
  }
  
  // default module window settings
  static get defaultOptions() {
    const options = super.defaultOptions;
    // sheet window options
    foundry.utils.mergeObject(options, {
      classes: ["slugblaster", "sheet", "playbook"],
      width: 640,
      height: 720
    });
    return options;
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