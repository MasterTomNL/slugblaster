import { SlugblasterCoreSheet } from "./slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items

export class SlugblasterActorSheet extends SlugblasterCoreSheet {
  get template() {
    return 'systems/slugblaster/template/actor-sheet.hbs';
  }
  
  static TABS = {
    sheet: {
      tabs: [
        { group: 'sheet', id: 'dicepool',  label: 'Slugblaster.Dicepool' },
        { group: 'sheet', id: 'gear',      label: 'Slugblaster.Actor.Gear.TabName' },
        { group: 'sheet', id: 'signature', label: 'Slugblaster.Actor.SignatureDevice.TabName' },
        { group: 'sheet', id: 'legacy',    label: 'Slugblaster.Actor.Legacy.TabName' },
        { group: 'sheet', id: 'traits',    label: 'Slugblaster.Actor.Traits.TabName' },
        { group: 'sheet', id: 'notes',     label: 'Slugblaster.Notes' }
      ],
      initial: 'dicepool'
    },
  }
  
  static PARTS = {
    ...super.PARTS,
      main: { template: 'systems/slugblaster/template/actor-sheet.hbs' },
      tabs: { template: 'systems/slugblaster/template/parts/actor-tabs.hbs' },
      dicepool: { template: 'systems/slugblaster/template/parts/actor-tab-dicepool.hbs' },
      gear: { template: 'systems/slugblaster/template/parts/actor-tab-gear.hbs' },
      signature: { template: 'systems/slugblaster/template/parts/actor-tab-signature.hbs' },
      legacy: { template: 'systems/slugblaster/template/parts/actor-tab-legacy.hbs' },
      traits: { template: 'systems/slugblaster/template/parts/actor-tab-traits.hbs' },
      notes: { template: 'systems/slugblaster/template/parts/tab-notes.hbs' },
  }
  
  // default module window settings
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      classes: ['slugblaster', 'actor'],
      position: {
        width: 680, // 'auto'
        height: 780, // 'auto'
      },
      window: {
        icon: 'fas fa-user',
        title: 'Slugblaster.Actor.Title',
        resizable: true,
        minimizable: true,
      },
      actions: {
        addGear: this.#addGear,
        craftItem: this.#installMod,
        installMod: this.#installMod,
        salvageMod: this.#salvageMod,
        nopeSlam: this.#nopeSlam,
        addStyle: this.#addStyle,
        addSlam: this.#addSlam,
        addDoom: this.#addDoom,
        addLegacy: this.#addLegacy,
        addSignatureMod: this.#addSignatureMod,
        payBeatCost: this.#payBeatCost,
      }
  };
  
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
    
    let gear = [];
    let signatures = [];
    let signatureMods = [];
    
    let dooms = [];
    let legacies = [];
    let slams = [];
    
    let type;

    // sort items by active (?)
    for (const i of context.items) {
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
      
      if (i.type == 'doom') dooms.push(i);
      if (i.type == 'legacy') legacies.push(i);
      if (i.type == 'slam') slams.push(i);
    }
    
    context.angstBeats = this.sortItems(angstBeats);
    context.crewBeats = this.sortItems(crewBeats);
    context.familyBeats = this.sortItems(familyBeats);
    context.otherBeats = this.sortItems(otherBeats);
    context.playbookBeats = this.sortItems(playbookBeats);
    context.traits = this.sortItems(traits);
    context.traitBeats = this.sortItems(traitBeats);
    context.gear = this.sortItems(gear);
    
    // bind mods to signatures...
    signatureMods = this.sortItems(signatureMods);
    for (let s of signatures) {
      s.mods = [];
      for (let m of signatureMods) {
        if (m.system.parentId == s._id)
          s.mods.push(m);
      }
    }
    context.signatures = signatures;
    
    context.dooms = dooms;
    context.legacies = legacies;
    context.slams = slams;
    
    return context;
  }
  
  sortItems(items) {
    items.sort((a, b) => {
      if (a.system.active > b.system.active) { return -1; }
      if (a.system.active < b.system.active) { return 1; }
      return 0;
    });
    return items;
  }
  
  // add 1 Style
  static async #addStyle(event, target) {
    await this.actor.update({['system.style']: Number(this.actor.system.style)+1 });
  }
  // add 2 Trouble
  static async #nopeSlam(event, target) {
    await this.actor.update({['system.trouble']: Number(this.actor.system.trouble)+2 });
  }
  
  static async #payBeatCost(event, target) {
    const styleCost = Number(target.dataset.style);
    const troubleCost = Number(target.dataset.trouble);
    
    if (target.checked)     
      await this.actor.update({
        ['system.style']: Number(this.actor.system.style) - styleCost,
        ['system.trouble']: Number(this.actor.system.trouble) - troubleCost
      });
    else
      await this.actor.update({
        ['system.style']: Number(this.actor.system.style) + styleCost,
        ['system.trouble']: Number(this.actor.system.trouble) + troubleCost
      });
  }
  
  static async #installMod(event, target) {
    event.preventDefault();
    let item = this.actor.items.get(target.dataset.itemId); // get item
    let iSys = item.system;
    let aSys = this.actor.system;
    // check coilCost against stash
    if (item.system.coil > 0 && item.system.coil > aSys.coil)
      return;
    // check discCost against stash
    if (item.system.disc > 0 && item.system.disc > aSys.disc)
      return;
    // check gemCost against stash
    if (item.system.gem > 0 && item.system.gem > aSys.gem)
      return;
    // check discCost against stash
    if (item.system.lens > 0 && item.system.lens > aSys.lens)
      return;
    // spend components
    await this.actor.update({
      ['system.coil']: Number(aSys.coil) - Math.max(Number(iSys.coil), 0),
      ['system.disc']: Number(aSys.disc) - Math.max(Number(iSys.disc), 0),
      ['system.gem']:  Number(aSys.gem) -  Math.max(Number(iSys.gem),  0),
      ['system.lens']: Number(aSys.lens) - Math.max(Number(iSys.lens), 0) });
    // activate the mod
    await item.update({['system.active']: true });
  }
  
  static async #salvageMod(event, target) {
    event.preventDefault();
    let item = this.actor.items.get(target.dataset.itemId); // get item
    let iSys = item.system;
    let aSys = this.actor.system;
    // salvage components
    await this.actor.update({
      ['system.coil']: Number(aSys.coil) + Math.max(Number(iSys.coil), 0),
      ['system.disc']: Number(aSys.disc) + Math.max(Number(iSys.disc), 0),
      ['system.gem']:  Number(aSys.gem)  + Math.max(Number(iSys.gem),  0),
      ['system.lens']: Number(aSys.lens) + Math.max(Number(iSys.lens), 0) });
    // deactivate the mod
    await item.update({['system.active']: false });
  } 
  
  static async #addGear(event, target) {
    await this.addItem('gear', null);
  }
  static async #addSlam(event, target) {
    await this.addItem('slam', null);
  }
  static async #addDoom(event, target) {
    await this.addItem('doom', null);
  }
  static async #addLegacy(event, target) {
    await this.addItem('legacy', null);
  }
  static async #addSignatureMod(event, target) {
    await this.addItem('signatureMod', target.dataset.parentId);
  }
  
  async _onDropDocument(event, data) {
    if (!this.isEditable) return;
    let cls; let src; let sys;    
    
    // system values
    if (data.type == 'playbook') {
      cls = getDocumentClass("Actor");
      src = await cls.fromDropData(data);
      sys = src.system;
      // remove existing traits and gear
      for (let i of this.actor.items) {
        await i.delete();
      }
      
      this.actor.update({
        ['system.playbook']: src.name,
        ['system.attitude']: sys.attitude,
        ['system.styleBonus']: sys.styleBonus,
        ['system.boosts']: sys.boosts,
        ['system.kicks']: sys.kicks,
        ['system.specialTraitName']: sys.specialTraitName,
        ['system.specialTraitDesc']: sys.specialTraitDesc,
      });
      
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
    if (data.type == 'signature') {
      cls = getDocumentClass("Actor");
      src = await cls.fromDropData(data);
      sys = src.system;
      let parentSig = await Item.create({
        name: src.name,
        type: 'gear',
        img: src.img,
        ['system.type']: 'signature',
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
          type: 'gear',
          ['system.type']: 'signatureMod',
          ['system.active']: "",
          ['system.coil']: i.system.coil,
          ['system.disc']: i.system.disc,
          ['system.gem']: i.system.gem,
          ['system.lens']: i.system.lens,
          ['system.description']: i.system.description,
          ['system.parentId']: parentSig._id
        }, { parent: this.actor });
      }
    }
    if (data.type == 'beat') {
      cls = getDocumentClass("Item");
      src = await cls.fromDropData(data);
      sys = src.system;
      
      await Item.create({
        name: src.name,
        type: src.type,
        ['system.active']: false,
        ['system.description']: sys.description,
        ['system.type']: sys.type,
        ['system.styleCost']: sys.styleCost,
        ['system.troubleCost']: sys.troubleCost },
        { parent: this.actor });
    }
    if (data.type == 'gear') {
      cls = getDocumentClass("Item");
      src = await cls.fromDropData(data);
      sys = src.system;
      
      await Item.create({
        name: src.name,
        type: src.type,
        ['system.active']: false,
        ['system.description']: sys.description,
        ['system.type']: sys.type,
        ['system.coil']: sys.coil,
        ['system.disc']: sys.disc,
        ['system.gem']: sys.gem,
        ['system.lens']: sys.lens
      }, { parent: this.actor });
    }
  }
  
  async _onDropItem(event, src) {
    let item = {
      name: src.name,
      type: src.type,
      ['system.active']: false,
      ['system.description']: src.system.description,
      ['system.type']: src.system.type,
      ['system.style']: src.system.style,
      ['system.trouble']: src.system.trouble
    };
    await Item.create(item, { parent: this.actor });
  }
}

export class SlugblasterSignatureSheet extends SlugblasterCoreSheet {
  get template() {
    return 'systems/slugblaster/template/signature-sheet.hbs';
  }
  
  static PARTS = {
    ...super.PARTS,
      main: { template: 'systems/slugblaster/template/signature-sheet.hbs' },
  }
  
  // default module window settings
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      classes: ['slugblaster', 'signatureDevice'],
      position: {
        width: 680, // 'auto'
        height: 780, // 'auto'
      },
      window: {
        icon: 'fas fa-user',
        title: 'Slugblaster.SignatureDevice.Title',
        resizable: true,
        minimizable: true,
      },
      actions: {
        addSigMod: this.#addSigMod,
      }
  };
  
  static async #addSigMod(event, target) {
    const item = {
      name: game.i18n.localize(`Slugblaster.SignatureModPlaceholder`),
      type: 'signatureMod',
    };
    // create the item
    await Item.create(item, { parent: this.actor });
  }
}

export class SlugblasterNPCSheet extends SlugblasterCoreSheet {
  get template() {
    return 'systems/slugblaster/template/npc-sheet.hbs';
  }
  
  static PARTS = {
    ...super.PARTS,
      main: { template: 'systems/slugblaster/template/npc-sheet.hbs' }
  }
  
  // default module window settings
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      classes: ['slugblaster', 'npc'],
      position: {
        width: '640',
        height: 'auto'
      },
      window: {
        icon: 'fas fa-user',
        title: 'Slugblaster.NPC.Title',
        resizable: true,
        minimizable: true,
      },
  };
}
