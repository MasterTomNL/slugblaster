export class SlugblasterBeatSheet extends ItemSheet {
  get template() {
    return 'systems/slugblaster/template/beat-sheet.hbs';
  }
  
  // default module window settings
  static get defaultOptions() {
    const options = super.defaultOptions;
    // sheet window options
    foundry.utils.mergeObject(options, {
      classes: ["slugblaster", "sheet", "beat"],
      width: 520,
      height: 360
    });
    return options;
  }
}