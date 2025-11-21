export class SlugblasterCoreSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ActorSheetV2) {
  get title() { return `${this.actor.type}: ${this.actor.name}`; }
  get canLoot() { return false; }
  get isLootable() { return false; }
  
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        closeOnSubmit: true,
      },
      actions: {
        editImage: this.#editImage,
        editItem: this.#editItem,
        saveItem: this.#saveItem,
        rollTable: this.#rollTable,
        rollDice: this.#rollDice,
        plusDice: this.#plusDice,
        minusDice: this.#minusDice,
        setAttribute: this.#setAttribute,
        deleteItem: this.#deleteItem,
      }
  };
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    // use a safe clone of actor data
    context.isGM = game.user.isGM;
    context.actor = this.document;
    context.system = this.actor.system;
    context.editable = context.isGM || this.actor.isOwner;
    context.items = this.actor.items;
    
    return context;
  }
  
  static async #setAttribute(event, target) {
    const data = target.dataset;
    if (data.itemId)
      await this.setItemSystemValue(data.itemId, data.field, data.value);
    else
      await this.setSystemValue(data.field, data.value);
  }
  
  static async #editImage(event, target) {
    const field = target.dataset.field || "img";
    let current; let object;
    let itemId = target.dataset.itemId;
    if (itemId)
      object = this.actor.items.get(itemId);
    else
      object = this.actor;  
    current = foundry.utils.getProperty(object, field);
    const fp = new foundry.applications.apps.FilePicker({
      type: "image",
      current: current,
      callback: (path) => object.update({ [field]: path })
    });
    fp.render(true);
  }
  
  static #editItem(event, target) {
    target.closest('li').classList.add('editable');
  }
  static #saveItem(event, target) {
    target.closest('li').classList.remove('editable');
  }
  
  static async #rollTable(event, target) {
    event.preventDefault();
    const action = target.dataset.value;
    let table; let result; let value; let type; let curStyle; let curTrouble;
    
    switch (action) {
      case 'getComponents':
        // only allow a "free" roll when there's no style...
        if (!this.actor.system.styleFree && this.actor.system.style < 1) return;
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.OCxESGRjaa3Uoc0D");
        
        // roll it!
        result = await table.draw();
        // add item to stash
        if (result.roll.total <= 4) {
          let itemName = result.results[0].name.toLowerCase();
          let curCount = Number(this.actor.system[itemName]);
          await this.actor.update({['system.'+itemName]: curCount + 1 });
        }
        // spend 1 style
        if (!this.actor.system.styleFree) {
          let curStyle = Number(this.actor.system.style);
          await this.actor.update({['system.style']: curStyle - 1 });
        }
        // if you rolled a 6... you get a free bonus roll
        if (result.roll.total == 6)
          await this.actor.update({['system.styleFree']: 1 });
        else
          await this.actor.update({['system.styleFree']: 0 });
        break;

      case 'crew':
        // colour
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.vyuWcWbTMZ6FmGyC");
        result = await table.draw();
        value = result.results[0].name;
        
        // suffix
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.MXGae0Bkncgfw0GX");
        result = await table.draw();
        value += " " + result.results[0].name;
        
        await this.actor.update({['name']: value });
        break;

      case 'hoverboard': // type, grip-colour, grip-cut and deck-graphic
        // type
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.9SK6fHCLI7iTajxx");
        result = await table.draw();
        type = result.results[0].name;
        
        // board_img
        await this.actor.update({['system.board_img']: 'systems/slugblaster/assets/boards/'+type.toLowerCase()+'.webp' });
        
        // deck graphic
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.Vq0qzyqMYC8YmrC8");
        result = await table.draw();
        value = type + ": " + result.results[0].name;
        // add grip colour and cut when its a "Deck"
        if (type.indexOf("Deck") !== -1) {
          // grip-colour
          table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.j5kPRYmMqV86BDdp");
          result = await table.draw();
          value += " and " + result.results[0].name;
          // grip-cut
          table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.6lDtG5SjEYNJhHSg");
          result = await table.draw();
          value += " " + result.results[0].name + " Grip";
        }
        await this.actor.update({['system.hoverboard']: value });
        break;
      
      case 'raygun':
        // style
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.cqXhmWc40Mh4J15S");
        result = await table.draw();
        value = result.results[0].name;
        // type
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.DM7cmXnk66Djpw6b");
        result = await table.draw();
        value += " " + result.results[0].name;
        await this.actor.update({['system.raygun']: value });
        break;
      
      case 'vibes':
        // only when a playbook is selected
        if (!this.actor.system.playbook) return;
        let vTables = {
          "The Chill": "RollTable.A9APBTj0IWP4XfzK",
          "The Grit": "RollTable.uchg2Hsv6KJYt72W",
          "The Guts": "RollTable.YQd7jeRB6rqWE3If",
          "The Heart": "RollTable.dIvxrKKlaTttmoC8",
          "The Smarts": "RollTable.507bLzCESSbyPbgS"
        };
        // get the rollable table
        table = await fromUuid("Compendium.slugblaster.rollable-tables."+vTables[this.actor.system.playbook]);
        this._processTable(table, action);
        break;
      
      case 'hangouts':
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.8BvLRznUulA8TjQG");
        this._processTable(table, action);
        break;
      case 'brands':
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.Rlq9RNWSnZhoWEn1");
        this._processTable(table, action);
        break;
      
      case 'look':
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.2jDUdtYoabUS9jbI");
        this._processTable(table, action);
        break;
      case 'family':
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.jKGFRPUgQQlLmot4");
        this._processTable(table, action);
        break;
      case 'bond':
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.VJSTeFSldwMYCSOQ");
        this._processTable(table, action);
        break;
      
      case 'hilarious_slogan':
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.T0M3ujor4LRmWZBy");
        break;
      
      case 'stickers':
        // form
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.yvUtuUgAsiQwpGrG");
        result = await table.draw();
        value = result.results[0].name;
        
        // origin
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.3Zc5TFURrDCgaYJF");
        result = await table.draw();
        value += ", " + result.results[0].name;
        await this.actor.update({[`system.${action}`]: value });
        break;
      
      case 'portal_discovery':
        // type
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.v1hbLa743VKf8xr6");
        result = await table.draw();
        if ([3,4,6].includes(result.roll.total)) {
          table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.03GIOofAlLH35kyf");
          result = await table.draw();
        }
        curStyle = Number(this.actor.system.style);
        await this.actor.update({['system.style']: curStyle - 2 });
        break;
      
      case 'being_good':
        curStyle = Number(this.actor.system.style);
        curTrouble = Number(this.actor.system.trouble);
        await this.actor.update({['system.style']: curStyle - 1});
        await this.actor.update({['system.trouble']: curTrouble - 2});
        break;
    }
  }
  
  async _processTable(table, action) {
    let result = await table.draw();
    let value = result.results[0].name;
    let curVal = this.actor.system[action];
    value = curVal ? curVal + ", " + value : value;
    await this.actor.update({[`system.${action}`]: value });
  }

  // adding items (to parent)
  async addItem(type, parentId) {
    const item = {
      name: game.i18n.localize(`Slugblaster.${type}Placeholder`),
      type: type,
      ['system.active']: true,
      ['system.custom']: true,
    };
    // set default level for faction
    if (type == 'faction') item['system.level'] = 0;
    // assign parentId when it's defined
    if (parentId) item['system.parentId'] = parentId;
    // create the item
    await Item.create(item, { parent: this.actor });
  }

  static async #deleteItem(event, target) {
    let itemId = target.dataset.itemId;
    let item = this.actor.items.get(itemId);
    if (!item) return;
    await item.delete();
  }

  static async #plusDice(event, target) {
    const type = target.dataset.type;
    await this.actor.update({['system.'+type]: this.actor.system[type] + 1 });
  }
  static async #minusDice(event, target) {
    const type = target.dataset.type;
    await this.actor.update({['system.'+type]: this.actor.system[type] - 1 });
  }
  static async #rollDice(event, target) {
    let type = target.dataset.type;
    let formula = this.actor.system[type] + 'd6kh'; // (kh = keep highest)
    
    // add conditional +1's
    let count = 0;
    const section = target.closest('section');
    section.querySelectorAll('.conditional').forEach((c) => { if ($(c).is(':checked')) count++; });
    if (count > 0) formula += '+'+count;
    
    // roll it!
    let roll = new Roll(formula, this.actor.getRollData());
    if (type=='challengesPool') {
      // Challenges 1
      let table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.P8uleIWeJ35rQyrz");
      await table.draw({ roll: roll });
      // Challenges 2
      table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.EYYxINLHCQRpMg8F");
      await table.draw({ roll: roll });
    }
    else if (type == 'opportunitiesPool') {
      // Opportunities 1
      let table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.N8u3b8CR1LcYO7Vi");
      await table.draw({roll: roll});
      // Opportunities 2
      table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.2C9VsTKDo9UMZZie");
      await table.draw({roll: roll});
    } else if (type == 'runsPool') {
      // Runs
      let table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.yIm5j0p9Y7NvzZzT");
      await table.draw({roll: roll});
    } else {
      await roll.toMessage({
        speaker: ChatMessage.getSpeaker({ actor: this.actor }),
        flavor: 'Rolling...',
        rollMode: game.settings.get('core', 'rollMode'),
      });
    }
    // roll
    await this.actor.update({['system.'+type]: 1 });
  }
  
  async setSystemValue(field, value) {
    if (Number(this.actor.system[field]) == Number(value)) value = 0;
    await this.actor.update({ ['system.'+field]: Number(value) });
  }
  
  async setItemSystemValue(itemId, field, value) {
    let item = this.actor.items.get(itemId);
    if (Number(item.system[field]) == Number(value)) value = 0;
    await item.update({ ['system.'+field]: Number(value) });
  }
  
  /** @override */
  _processFormData(event, form, formData) {
    // Extract the raw form data object BEFORE validation strips out items
    const expanded = foundry.utils.expandObject(formData.object)

    // Handle items separately if they exist
    if (expanded.items) {
      // Store for later processing
      this._pendingItemUpdates = Object.entries(expanded.items).map(([id, itemData]) => ({
        _id: id,
        ...itemData
      }))

      // Remove from the expanded object
      delete expanded.items

      // Flatten and replace the existing formData.object properties
      const flattened = foundry.utils.flattenObject(expanded)

      // Clear existing object and repopulate (since we can't reassign)
      for (const key in formData.object) {
        delete formData.object[key]
      }
      Object.assign(formData.object, flattened)
    }

    // Call parent with modified formData
    return super._processFormData(event, form, formData)
  }

  /** @override */
  async _processSubmitData(event, form, formData) {
    // Process the actor data normally
    const result = await super._processSubmitData(event, form, formData)

    // Now handle any pending item updates
    if (this._pendingItemUpdates?.length > 0) {
      await this.document.updateEmbeddedDocuments('Item', this._pendingItemUpdates)
      delete this._pendingItemUpdates // Clean up
    }
    return result
  }
}
