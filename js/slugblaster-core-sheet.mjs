//const { HandlebarsApplicationMixin } = foundry.applications.api
//const { ActorSheetV2 } = foundry.applications.sheets

//export class SlugblasterCoreSheet extends HandlebarsApplicationMixin(ActorSheetV2) {
export class SlugblasterCoreSheet extends foundry.appv1.sheets.ActorSheet {
  async _onAdd(event) {
    event.preventDefault();
    let type = $(event.currentTarget).data('type'); // item.type
    let systemType = $(event.currentTarget).data('systemType'); // item.system.type
    let parentId = $(event.currentTarget).data('parentId'); // item.system.parentId
    const item = { name: game.i18n.localize(`SB.new_${systemType}`), type: type, ['system.active']: true, ['system.type']: systemType };
    if (type == 'faction') item['system.level'] = 0;
    if (parentId) item.parentId = parentId; // assign parentId when it's defined
    await Item.create(item, { parent: this.actor }); // create the item
  }

	activateListeners(html) {
    super.activateListeners(html);
    
    // delete item from actor
    html.on('click', '.delete', this._onDelete.bind(this));
    
    // dicePool interactions
    html.on('click', '.dicepoolPlus', this._onDicepoolPlus.bind(this));
    html.on('click', '.dicepoolMinus', this._onDicepoolMinus.bind(this));
    html.on('click', '.dicepoolRoll', this._onDicepoolRoll.bind(this));
  }

  async _onDelete(event) {
    let itemId = $(event.currentTarget).data('itemId');
    let item = this.actor.items.get(itemId);
    if (!item) return;
    await item.delete();
  }

  async _onDicepoolPlus(event) {
    let div = $(event.currentTarget).parents('div.rolling');
    let type = div.data('type');
    await this.actor.update({['system.'+type]: this.actor.system[type] +1 });
  }
  async _onDicepoolMinus(event) {
    let div = $(event.currentTarget).parents('div.rolling');
    let type = div.data('type');
    await this.actor.update({['system.'+type]: this.actor.system[type] - 1 });
  }
  async _onDicepoolRoll(event) {
    let div = $(event.currentTarget).parents('div.rolling');
    let type = div.data('type');
    let formula = this.actor.system[type] + 'd6kh'; // (kh = keep highest)
    
    // add conditional +1's
    let count = 0;
    $(div).find('.conditional').each(function (i) {
      if ($(this).is(':checked')) count++;
    });
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

  
  _onEdit(event) {
    let li = $(event.currentTarget).parents('li');
    li.find('.not-editable').addClass("hidden");
    li.find('.editable').removeClass("hidden");
  }
  
  async _onValueChange(event) {
    event.preventDefault();
    // get closest li parent for details
    let li = $(event.currentTarget).parents('.valChangeParent');
    let itemId = li.data('itemId');
    // process value
    let field = $(event.currentTarget);
    let newVal = field.val();
    let valName = field.data('name');
    // update the item
    let item = this.actor.items.get(itemId);
    await item.update({ [valName]: newVal });
  }
  
  async _onRollableTable(event) {
    const action = $(event.currentTarget).data('action');
    let table; let result; let value; let type;
    
    switch (action) {
      case 'getComponents':
        // only allow a "free" roll when there's no style...
        if (!this.actor.system.styleFree && this.actor.system.style < 1) return;
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.OCxESGRjaa3Uoc0D");
        
        // roll it!
        result = await table.draw();
        console.log(result);
        // add item to stash
        if (result.results[0].type == "document") {
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
        if (result.roll._total == 6)
          await this.actor.update({['system.styleFree']: 1 });
        else
          await this.actor.update({['system.styleFree']: 0 });
        break;

      case 'crew':
        // colour
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.vyuWcWbTMZ6FmGyC");
        result = await table.draw();
        value = result.results[0].text;
        
        // suffix
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.MXGae0Bkncgfw0GX");
        result = await table.draw();
        value += " " + result.results[0].text;
        
        await this.actor.update({['name']: value });
        break;

      case 'hoverboard': // type, grip-colour, grip-cut and deck-graphic
        // type
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.9SK6fHCLI7iTajxx");
        result = await table.draw();
        type = result.results[0].text;
        
        // deck graphic
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.Vq0qzyqMYC8YmrC8");
        result = await table.draw();
        value = type + ": " + result.results[0].text;
        // add grip colour and cut when its a "Deck"
        if (type.indexOf("Deck") !== -1) {
          // grip-colour
          table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.j5kPRYmMqV86BDdp");
          result = await table.draw();
          value += " and " + result.results[0].text;
          // grip-cut
          table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.6lDtG5SjEYNJhHSg");
          result = await table.draw();
          value += " " + result.results[0].text + " Grip";
        }
        await this.actor.update({['system.hoverboard']: value });
        break;
      
      case 'raygun':
        // style
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.cqXhmWc40Mh4J15S");
        result = await table.draw();
        value = result.results[0].text;
        // type
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.DM7cmXnk66Djpw6b");
        result = await table.draw();
        value += " " + result.results[0].text;
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
        value = result.results[0].text;
        
        // origin
        table = await fromUuid("Compendium.slugblaster.rollable-tables.RollTable.3Zc5TFURrDCgaYJF");
        result = await table.draw();
        value += ", " + result.results[0].text;
        await this.actor.update({[`system.${action}`]: value });
        break;
    }
  }
  
  async _processTable(table, action) {
    let result = await table.draw();
    let value = result.results[0].text;
    let curVal = this.actor.system[action];
    value = curVal ? curVal + ", " + value : value;
    await this.actor.update({[`system.${action}`]: value });
  }
  
}
