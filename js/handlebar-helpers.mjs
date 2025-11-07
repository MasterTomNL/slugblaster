export const registerHandlebarsHelpers = function() {
  Handlebars.registerHelper("numLoop", function (num, options) {
    let result = "";
    for (let i = 0, j = num; i < j; i++) {
      result = result + options.fn(i);
    }
    return result;
  });
  Handlebars.registerHelper("isUnlocked", function(unlocked) {
    return unlocked ? "" : "inactive";
  });
  Handlebars.registerHelper("isPerkUnlocked", function(actor, fKey, pKey) {
    let pName = `fame_perk_${fKey}_${pKey}`;
    return (actor.system[pName] ? "checked": "");
  });
  Handlebars.registerHelper("isNotActive", function(el) {
    return el.system.active ? false : true;
  });
  Handlebars.registerHelper("hideOrDisable", function(a, i) {
    let cls = "";
    // hide when there's no component cost
    if (Number(i.coil) == 0 && Number(i.disc) == 0 && Number(i.gem) == 0 && Number(i.lens) == 0)
      cls += " hidden";
    // disable when actor does not have enough resources
    if (Number(a.coil) < Number(i.coil) || Number(a.disc) < Number(i.disc) || Number(a.gem) < Number(i.gem) || Number(a.lens) < Number(i.lens))
      cls += " disabled";
    return cls;
  });
  Handlebars.registerHelper("CostLabel", function(val, name) {
    return val ? val + " " + game.i18n.localize(name) : "";
  });
  Handlebars.registerHelper("my_icon", function(style,title,index) {
    return `<i class="icon icon-${style}" title="${game.i18n.localize(title)}" data-index="${index}"></i>`;
  });
};