export const registerHandlebarsHelpers = function() {
  Handlebars.registerHelper("numLoop", function (num, options) {
    let result = "";
    for (let i = 0, j = num; i < j; i++) {
      result = result + options.fn(i);
    }
    return result;
  });
  Handlebars
  Handlebars.registerHelper("isUnlocked", function(unlocked) {
    return unlocked ? "" : "disabled";
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
};