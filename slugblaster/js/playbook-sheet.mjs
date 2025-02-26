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
    let arcBeats = [];
    let crewBeats = [];
    let familyBeats = [];
    let otherBeats = [];
    let playbookBeats = [];
    let traitBeats = [];
    
    let type;
    for (const i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      
      // get (system.)type
      type = i.system && i.system.type ? i.system.type : i.type;
      
      if (type == 'angst') angstBeats.push(i);
      if (type == 'arc') arcBeats.push(i);
      if (type == 'crew') crewBeats.push(i);
      if (type == 'family') familyBeats.push(i);
      if (type == 'other') otherBeats.push(i);
      if (type == 'playbook') playbookBeats.push(i);
      if (type == 'trait') traitBeats.push(i);
    }
    context.angstBeats = angstBeats;
    context.arcBeats = arcBeats;
    context.crewBeats = crewBeats;
    context.familyBeats = familyBeats;
    context.otherBeats = otherBeats;
    context.playbookBeats = playbookBeats;
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
}