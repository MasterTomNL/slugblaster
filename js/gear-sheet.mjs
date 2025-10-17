export class SlugblasterGearSheet extends ItemSheet {
  get template() {
    return 'systems/slugblaster/template/gear-sheet.hbs';
  }
  
  // default module window settings
  static get defaultOptions() {
    const options = super.defaultOptions;
    // sheet window options
    foundry.utils.mergeObject(options, {
      classes: ["slugblaster", "sheet", "gear"],
      width: 480,
      height: 640
    });
    return options;
  }
}