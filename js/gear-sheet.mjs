export class SlugblasterGearSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  get template() {
    return 'systems/slugblaster/template/gear-sheet.hbs';
  }
  
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    
    context.item = this.document;
    
    return context;
  }
  
  static PARTS = {
    ...super.PARTS,
      main: { template: 'systems/slugblaster/template/gear-sheet.hbs' },
  }
  
  // default module window settings
  static DEFAULT_OPTIONS = {
    ...super.DEFAULT_OPTIONS,
      form: {
        submitOnChange: true,
        closeOnSubmit: false,
      },
      classes: ['slugblaster', 'gear'],
      position: {
        width: 'auto',
        height: 'auto'
      },
      window: {
        title: 'Slugblaster.Gear.Title',
        resizable: true,
        minimizable: true,
      }
  };
}