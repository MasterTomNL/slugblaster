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
    let pName = `system.fame_perk_${fKey}_${pKey}`;
    return (actor[pName] ? "checked": "");
  });
  Handlebars.registerHelper("isNotActive", function(el) {
    return el.system.active ? false : true;
  });
  Handlebars.registerHelper("hideIfZero", function(first, second, third, fourth) {
    return (!first || first == null || first == 0) &&
     (!second || second == null || second == 0) && 
     (!third || third == null || third == 0) && 
     (!fourth || fourth == null || fourth == 0) ? "hidden": "";
  });
  Handlebars.registerHelper("CostLabel", function(val, name) {
    return val ? val + " " + game.i18n.localize(name) : "";
  });
  Handlebars.registerHelper("my_icon", function(style,title,index) {
    return `<i class="icon icon-${style}" title="${game.i18n.localize(title)}" data-index="${index}"></i>`;
  });
};