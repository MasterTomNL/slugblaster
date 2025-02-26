export class SlugblasterCrewSheet extends ActorSheet {
  get template() {
    return 'systems/slugblaster/template/crew-sheet.hbs';
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
    let factions = [];
    let fractures = [];
    let fame = [];
    for (const i of context.items) {
      i.img = i.img || DEFAULT_TOKEN;
      if (i.type == 'faction') factions.push(i);
      if (i.type == 'fracture') fractures.push(i);
      if (i.type == 'fame') fame.push(i);
    }
    context.factions = factions;
    context.fractures = fractures;
    context.fame = fame;
  }
  
  activateListeners(html) {
		super.activateListeners(html);
    
    // Add Trait / BeatArc / Beat
		html.on('click', '.addBtn', this._onAdd.bind(this));
    
    // Delete Trait / BeatArc / Beat
		html.on('click', '.delete', this._onDelete.bind(this));
    
    // save changes in traits, beatArcs and beats
    html.on('change', '.valChange', this._onValueChange.bind(this));
    
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
  
  
  async _onAdd(event) {
    event.preventDefault();
    let type = $(event.currentTarget).data('type');
    await Item.create({ name: game.i18n.localize('SB.newTrait'), type: type }, { parent: this.actor });
  }
  
  async _onValueChange(event) {
    event.preventDefault();
    // get closest li parent for details
    let li = $(event.currentTarget).parents('li');
    let itemId = li.data('itemId');
    // process value
    let field = $(event.currentTarget);
    let newVal = field.val();
    let valName = field.data('name');
    // update the item
    let item = this.actor.items.get(itemId);
    await item.update({ [valName]: newVal });
  }
  
  async _onDelete(event) {
    let li = $(event.currentTarget).parents('li');
    let itemId = li.data('itemId');
    let item = this.actor.items.get(itemId);
    // delete the item
    await item.delete();
    li.slideUp(200, () => this.render(false));
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