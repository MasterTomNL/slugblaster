export class SlugblasterGearSheet extends foundry.applications.api.HandlebarsApplicationMixin(foundry.applications.sheets.ItemSheetV2) {
  get template() {
    return 'systems/slugblaster/template/gear-sheet.hbs';
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