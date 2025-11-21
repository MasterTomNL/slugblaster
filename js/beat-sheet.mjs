export class SlugblasterBeatSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  get template() {
    return 'systems/slugblaster/template/beat-sheet.hbs';
  }
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    context.item = this.document;
    
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
  
  static PARTS = {
    ...super.PARTS,
      main: { template: 'systems/slugblaster/template/beat-sheet.hbs' },
  }
  
  // default module window settings
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      classes: ['slugblaster', 'beat'],
      position: {
        width: 'auto',
        height: 'auto'
      },
      window: {
        title: 'Slugblaster.Beat.Title',
        resizable: true,
        minimizable: true,
      }
  };
}