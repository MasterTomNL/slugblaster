export class SlugblasterBeatSheet extends foundry.appv1.sheets.ItemSheet {
  get template() {
    return 'systems/slugblaster/template/beat-sheet.hbs';
  }
  
  /** @override */
  async getData() {
    const context = await super.getData();

    // add beatTypes    
    context.beatTypes = {
      'angst': 'Angst',
      'crew': 'Crew',
      'family': 'Family',
      'other': 'Other',
      'playbook': 'Playbook',
      'trait': 'Trait',
      'traitBeat': 'Trait Beats'
    };
    return context;
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