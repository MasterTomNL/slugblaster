export const registerHandlebarsHelpers = function() {
  Handlebars.registerHelper("numLoop", function (num, options) {
    let result = "";
    for (let i = 1, j = num; i <= j; i++) {
      result = result + options.fn(i);
    }
    return result;
  });
  Handlebars.registerHelper("isUnlocked", function(unlocked) {
    return unlocked ? "active" : "inactive";
  });
  Handlebars.registerHelper("isPerkUnlocked", function(actor, fKey, pKey) {
    let pName = `fame_perk_${fKey}_${pKey}`;
    return (actor.system[pName] ? true: false);
  });
  Handlebars.registerHelper("isNotActive", function(el) {
    return el.system.active ? false : true;
  });
  Handlebars.registerHelper("hideOrDisable", function(a, i) {
    if (!a || !i) return;
    let cls = "";
    // hide when there's no component cost
    if (Number(i.coil) == 0 && Number(i.disc) == 0 && Number(i.gem) == 0 && Number(i.lens) == 0)
      cls += " hidden";
    // disable when actor does not have enough resources
    if (Number(a.coil) < Number(i.coil) || Number(a.disc) < Number(i.disc) || Number(a.gem) < Number(i.gem) || Number(a.lens) < Number(i.lens))
      cls += " disabled";
    return cls;
  });
  Handlebars.registerHelper("haveStyleOrTrouble", function(a, b) {
    // when the trait is already acquired... we good.
    if (b.active || !a || !b) return;
    // if not... check if we have sufficient style or trouble
    return (Number(a.style) < Number(b.styleCost) || Number(a.trouble) < Number(b.troubleCost)) ? "disabled": "";
  });
  
  Handlebars.registerHelper("CostLabel", function(val, name) {
    return val ? val + " " + game.i18n.localize(name) : "";
  });
  Handlebars.registerHelper("localizeCrew", function(lvl, type) {
    let fame_levels = ['Nobodies','UpAndComers','WellEstablished','MajorPlayers','RisingStars','Legends'];
    return game.i18n.localize('Slugblaster.Crew.'+fame_levels[lvl]+type);
  });
  
  Handlebars.registerHelper("my_icon", function(field,value,actorValue,itemId) {
    let active;
    if (value != undefined) {
      active = Number(value) <= Number(actorValue) ? 'active': '';
      let item = itemId != undefined ? ` data-item-id="${itemId}"` : '';
      return `<i class="icon icon-${field} ${active}" title="${game.i18n.localize('Slugblaster.'+field)}" data-action="setAttribute" data-field="${field}" data-value="${value}" ${item}></i>`;
    }
    let title = field.indexOf(" ") > 0 ? field.substring(0, field.indexOf(" ")): field;
    return `<i class="icon icon-${field}" title="${game.i18n.localize('Slugblaster.'+title)}"></i>`;
  });
};