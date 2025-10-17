import { SlugblasterCoreSheet } from "./slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items
import { SlugblasterPlaybookData, SlugblasterSignatureData } from './datamodels.mjs';

export class SlugblasterActorSheet extends SlugblasterCoreSheet {
  get template() {
    return 'systems/slugblaster/template/actor-sheet.hbs';
  }
  
  // default module window settings
  static get defaultOptions() {
    const options = super.defaultOptions;
    // sheet window options
    foundry.utils.mergeObject(options, {
      classes: ["slugblaster", "sheet", "actor"],
      width: 640,
      height: 720,
      tabs: [{
        navSelector: ".sheet-tabs",
        contentSelector: ".sheet-body",
        initial: "general"
      }]
    });
    return options;
  }
  
  // prepare actor data
  async getData(options) {
    // data structure from base sheet
    const context = await super.getData(options);

    // use a safe clone of actor data
    const actorData = context.data;
    context.system = actorData.system;
    
    // sort items by active
    let items = context.items;
    items.sort((a, b) => {
      if (a.system.active > b.system.active) { return -1; }
      if (a.system.active < b.system.active) { return 1; }
      return 0;
    });
    
    // get traits and beats from items
    let angstBeats = [];
    let crewBeats = [];
    let familyBeats = [];
    let otherBeats = [];
    let playbookBeats = [];
    let traits = [];
    let traitBeats = [];
    
    let gear = [];
    let signatures = [];
    let signatureMods = [];
    
    let doom = [];
    let legacy = [];
    let slams = [];
    
    let type;

    for (const i of items) {
      // get (system.)type
      type = i.system && i.system.type ? i.system.type : i.type;

      i.img = i.img || DEFAULT_TOKEN;
      
      if (type == 'angst') angstBeats.push(i);
      if (type == 'crew') crewBeats.push(i);
      if (type == 'family') familyBeats.push(i);
      if (type == 'other') otherBeats.push(i);
      if (type == 'playbook') playbookBeats.push(i);
      if (type == 'trait') traits.push(i);
      if (type == 'traitBeat') traitBeats.push(i);
      
      if (type == 'gear') gear.push(i);
      if (type == 'signature') signatures.push(i);
      if (type == 'signatureMod') signatureMods.push(i);
      
      if (i.type == 'doom') doom.push(i);
      if (i.type == 'legacy') legacy.push(i);
      if (i.type == 'slam') slams.push(i);
    }
    
    context.angstBeats = angstBeats;
    context.crewBeats = crewBeats;
    context.familyBeats = familyBeats;
    context.otherBeats = otherBeats;
    context.playbookBeats = playbookBeats;
    context.traits = traits;
    context.traitBeats = traitBeats;
    
    context.gear = gear;
    
    // bind mods to signatures...
    for (let s of signatures) {
      s.mods = [];
      for (let m of signatureMods) {
        if (m.system.parentId == s._id)
          s.mods.push(m);
      }
    }
    context.signatures = signatures;
    console.log(signatures);
    
    context.doom = doom;
    context.legacy = legacy;
    context.slams = slams;
    
    return context;
  }
	
	/** @override */
	activateListeners(html) {
		super.activateListeners(html);
        
		// Rollable abilities.
		html.on('click', '.rollable', this._onRoll.bind(this));
    html.on('click', '.rollableTable', this._onRollableTable.bind(this));

		// Add Gear / Trait / BeatArc / Beat
		html.on('click', '.addBtn', this._onAdd.bind(this));
    
    // Delete Gear / Trait / BeatArc / Beat
		html.on('click', '.delete', this._onDelete.bind(this));
    
    // save changes in gear, traits, beatArcs and beats
    html.on('change', '.valChange', this._onValueChange.bind(this));
    html.on('click', '.itemImg', this._onItemImg.bind(this));
       
    // boost and kick
    html.on('click', '.sbResources .icon', this._onDotChange.bind(this));
    
    // styleBonus and Nope!
    html.on('click', '.styleBonus', this._addStyleBonus.bind(this));
    html.on('click', '.troubleBonus', this._onNope.bind(this));
    
    // load
    html.on('click', '.load', this._onLoadChange.bind(this));    
    
    // edit
    html.on('click', '.edit', this._onEdit.bind(this));
    
    // install or salvage a signature mod
    html.on('click', '.install', this._onInstall.bind(this));
    html.on('click', '.salvage', this._onSalvage.bind(this));
		
		// Kicks, Boosts, Trouble and Style...
    html.find('.sbResources').each(function () {
		  const value = Number(this.dataset.value);
		  $(this).find(".icon").each(function (i) {
			  if (i + 1 <= value)
          $(this).addClass("active");
			});
		});    
    
    // Load dots
    html.find('.load').each(function () {
		  const active = this.dataset.value;
      if (active=="true") $(this).addClass("active");
		});
	}
  
  async _addStyleBonus(event) {
    await this.actor.update({['system.style']: Number(this.actor.system.style)+1 });
  }
  async _onNope(event) {
    await this.actor.update({['system.trouble']: Number(this.actor.system.trouble)+2 });
  }
  
  _onEdit(event) {
    let li = $(event.currentTarget).parents('li');
    let label = li.find('.not-editable').addClass("hidden");
    let editable = li.find('.editable').removeClass("hidden");
  }
  
  async _onInstall(event) {
    let li = $(event.currentTarget).parents('li'); // get parent (for itemId)
    let item = this.actor.items.get(li.data('itemId')); // get item
    let iSys = item.system;
    let aSys = this.actor.system;
    // check coilCost against stash
    if (item.system.coilCost > 0 && item.system.coilCost > aSys.coil)
      return;
    // check discCost against stash
    if (item.system.discCost > 0 && item.system.discCost > aSys.disc)
      return;
    // check gemCost against stash
    if (item.system.gemCost > 0 && item.system.gemCost > aSys.gem)
      return;
    // check discCost against stash
    if (item.system.lensCost > 0 && item.system.lensCost > aSys.lens)
      return;
    // spend components
    await this.actor.update({
      ['system.coil']: Number(aSys.coil) - (iSys.coilCost ? Number(iSys.coilCost) : 0),
      ['system.disc']: Number(aSys.disc) - (iSys.coilCost ? Number(iSys.discCost) : 0),
      ['system.gem']: Number(aSys.gem) - (iSys.coilCost ? Number(iSys.gemCost) : 0),
      ['system.lens']: Number(aSys.lens) - (iSys.coilCost ? Number(iSys.lensCost) : 0) });
    // activate the mod
    await item.update({['system.active']: true });
  }
  
  async _onSalvage(event) {
    let li = $(event.currentTarget).parents('li'); // get parent (for itemId)
    let item = this.actor.items.get(li.data('itemId')); // get item
    let iSys = item.system;
    let aSys = this.actor.system;
    // salvage components
    await this.actor.update({
      ['system.coil']: Number(aSys.coil) + (iSys.coilCost ? Number(iSys.coilCost) : 0),
      ['system.disc']: Number(aSys.disc) + (iSys.discCost ? Number(iSys.discCost) : 0),
      ['system.gem']: Number(aSys.gem) + (iSys.gemCost ? Number(iSys.gemCost) : 0),
      ['system.lens']: Number(aSys.lens) + (iSys.lensCost ? Number(iSys.lensCost) : 0) });
    // deactivate the mod
    await item.update({['system.active']: false });
  }
  
  async _onItemImg(event) {
    let img = $(event.currentTarget);
		let item = this.actor.items.get(img.data('itemId'));
    let imgPicker = await new FilePicker({
      type: "image",
      callback: (path) => {
        item.update({'img' : path });
      }
    });
    imgPicker.browse();
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
  
	// Handle clickable rolls.
	async _onRoll(event) {
		event.preventDefault();
		const element = event.currentTarget;
		const dataset = element.dataset;
    
    // only work when data-roll-type is defined
    if (!dataset.type) return;

		// Handle item rolls.
    if (dataset.type == 'item') {
			const itemId = element.closest('.item').dataset.itemId;
			const item = this.actor.items.get(itemId);
			if (item) return item.roll();
		}
    
    let keep = 'kh' // keep highest
    let value = 0;
    let bonus = 0;
        
    // when you have none... don't roll
    if (value == 0 && bonus == 0) {
      return;
    }
    
    // let's roll!
    let formula = value > 0 ? value + 'd6' : '';
    formula += bonus > 0 ? '+' + bonus + 'd6' : '';
    formula += keep;
    let roll = new Roll(formula, this.actor.getRollData());
		roll.toMessage({
      speaker: ChatMessage.getSpeaker({ actor: this.actor }),
      flavor: dataset.label,
      rollMode: game.settings.get('core', 'rollMode'),
    });
    return roll;
	}
  
	async _onLoadChange(event) {
    event.preventDefault();
    let itemId = $(event.currentTarget).parents('li').data('itemId');
    let active = $(event.currentTarget).data('value');
    active = active ? "" : "true"; // inverse it
    let item = this.actor.items.get(itemId);
    await item.update({['system.active']: active });
  }
  
  async _onDropActor(event, data) {
    if (!this.isEditable) return;
    const cls = getDocumentClass("Actor");
    const src = await cls.fromDropData(data);
    const sys = src.system;
    
    // system values
    if (src.type == 'playbook') {
      this.actor.update({['system.playbook']: src.name });
      this.actor.update({['system.attitude']: sys.attitude });
      this.actor.update({['system.styleBonus']: sys.styleBonus });
      this.actor.update({['system.boosts']: sys.boosts });
      this.actor.update({['system.kicks']: sys.kicks });
      
      // add phone and specialGear
      await Item.create({ name: 'your phone', type: 'gear', ['system.active']: true }, { parent: this.actor });
      await Item.create({ name: sys.specialGear, type: 'gear', ['system.active']: true }, { parent: this.actor });
      
      // add traits and all beats
      for (let i of src.items) {
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
    if (src.type == 'signature') {
      let parentSig = await Item.create({
        name: src.name,
        type: 'signature',
        img: src.img,
        ['system.active']: "true",
        ['system.boosts']: sys.boosts,
        ['system.kicks']: sys.kicks,
        ['system.look']: sys.look,
        ['system.description']: sys.description,
        ['system.effect']: sys.effect
      }, { parent: this.actor});
      // add signatureMods
      for (let i of src.items) {
        await Item.create({
          name: i.name,
          type: 'signatureMod',
          ['system.active']: "",
          ['system.coilCost']: i.system.coilCost,
          ['system.discCost']: i.system.discCost,
          ['system.gemCost']: i.system.gemCost,
          ['system.lensCost']: i.system.lensCost,
          ['system.description']: i.system.description,
          ['system.parentId']: parentSig._id
        }, { parent: this.actor });
      }
    }
  }
}

export class SlugblasterSignatureSheet extends ActorSheet {
  get template() {
    return 'systems/slugblaster/template/signature-sheet.hbs';
  }
  
  /** @override */
  async getData() {
    return await super.getData();
  }
  
  activateListeners(html) {
		super.activateListeners(html);
    
    // Add a mod
		html.on('click', '.addBtn', this._onAdd.bind(this));
    
    // Delete a mod
		html.on('click', '.delete', this._onDelete.bind(this));
    
    // save changes in mods
    html.on('change', '.valChange', this._onValueChange.bind(this));
  }
  
  async _onAdd(event) {
    event.preventDefault();
    let type = $(event.currentTarget).data('type');
    await Item.create({ name: game.i18n.localize('SB.newMod'), type: type }, { parent: this.actor });
    
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
      classes: ["slugblaster", "sheet", "signature"],
      width: 1024,
      height: 640
    });
    return options;
  }
}
