export class SlugblasterCoreSheet extends ActorSheet {
  async _onAdd(event) {
    event.preventDefault();
    let type = $(event.currentTarget).data('type'); // item.type
    let systemType = $(event.currentTarget).data('systemType'); // item.system.type
    let parentId = $(event.currentTarget).data('parentId'); // item.system.parentId
    const item = { name: game.i18n.localize(`SB.new_${systemType}`), type: type, ['system.active']: true, ['system.type']: systemType };
    if (parentId) item.parentId = parentId; // assign parentId when it's defined
    await Item.create(item, { parent: this.actor }); // create the item
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
    event.preventDefault();
    // get closest li parent for details
    let li = $(event.currentTarget).parents('li');
    let itemId = li.data('itemId');
    // find the item by itemId
    let item = this.actor.items.get(itemId);
    // delete the item
    await item.delete();
    // slide the li away!
    li.slideUp(200, () => this.render(false));
  }
  
  async _onRollableTable(event) {
    const action = $(event.currentTarget).data('action');
    let table; let result; let value; let type;
    
    switch (action) {
      case 'getComponents':
        // only allow a "free" roll when there's no style...
        if (!this.actor.system.styleFree && this.actor.system.style < 1) return;
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.OCxESGRjaa3Uoc0D");
        
        // roll it!
        result = await table.draw();
        // add item to stash
        if (result.results[0].type == "pack") {
          let itemName = result.results[0].text.toLowerCase();
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

      case 'hoverboard': // type, grip-colour, grip-cut and deck-graphic
        // type
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.9SK6fHCLI7iTajxx");
        result = await table.draw();
        type = result.results[0].text;
        
        // deck graphic
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.Vq0qzyqMYC8YmrC8");
        result = await table.draw();
        value = type + " " + result.results[0].text;
        // add grip colour and cut when its a "Deck"
        if (type.indexOf("Deck") !== -1) {
          // grip-colour
          table = await fromUuid("Compendium.world.rollable-tables.RollTable.j5kPRYmMqV86BDdp");
          result = await table.draw();
          value += " and " + result.results[0].text;
          // grip-cut
          table = await fromUuid("Compendium.world.rollable-tables.RollTable.6lDtG5SjEYNJhHSg");
          result = await table.draw();
          value += " " + result.results[0].text + " Grip";
        }
        await this.actor.update({['system.hoverboard']: value });
        break;
      
      case 'raygun':
        // style
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.cqXhmWc40Mh4J15S");
        result = await table.draw();
        value = result.results[0].text;
        // type
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.DM7cmXnk66Djpw6b");
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
        table = await fromUuid("Compendium.world.rollable-tables."+vTables[this.actor.system.playbook]);
        this._processTable(table, action);
        break;
      
      case 'look':
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.2jDUdtYoabUS9jbI");
        this._processTable(table, action);
        break;
      case 'family':
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.jKGFRPUgQQlLmot4");
        this._processTable(table, action);
        break;
      case 'bond':
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.VJSTeFSldwMYCSOQ");
        this._processTable(table, action);
        break;
      
      case 'hilarious_slogan':
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.T0M3ujor4LRmWZBy");
        break;
      
      case 'stickers':
        // form
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.yvUtuUgAsiQwpGrG");
        result = await table.draw();
        value = result.results[0].text;
        
        // origin
        table = await fromUuid("Compendium.world.rollable-tables.RollTable.3Zc5TFURrDCgaYJF");
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
