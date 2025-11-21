import { registerHandlebarsHelpers } from "./js/handlebar-helpers.mjs";
import { SlugblasterCoreSheet } from "./js/slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items
import { SlugblasterActorData, SlugblasterCrewData, SlugblasterFameData, SlugblasterPlaybookData, SlugblasterSignatureData, SlugblasterGearData } from "./js/datamodels.mjs";
import { SlugblasterActor } from "./js/documents.mjs";
import { SlugblasterActorSheet, SlugblasterSignatureSheet } from "./js/sheets.mjs";
import { SlugblasterPlaybookSheet } from "./js/playbook-sheet.mjs";
import { SlugblasterBeatSheet } from  "./js/beat-sheet.mjs";
import { SlugblasterCrewSheet } from "./js/crew-sheet.mjs";
import { SlugblasterGearSheet } from  "./js/gear-sheet.mjs";

Hooks.on("init", () => {
  // handlebars
  registerHandlebarsHelpers();
  
  game.slugblaster = {
    SlugblasterActor
  };
  
  
  // define documentClass
  CONFIG.Actor.documentClass = SlugblasterActor;
  
  // datamodels
  CONFIG.Actor.dataModels = {
    'slugblaster': SlugblasterActorData,
    'playbook': SlugblasterPlaybookData,
    'signature': SlugblasterSignatureData,
    'crew': SlugblasterCrewData
  };
  CONFIG.Item.dataModels.gear = SlugblasterGearData;
  
  
  // sheets
  foundry.documents.collections.Actors.registerSheet("slugblaster", SlugblasterActorSheet, { label: "Slugblaster Actor Sheet", makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("slugblaster", SlugblasterCrewSheet, { label: "Slugblaster Crew Sheet", types: ["crew"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("slugblaster", SlugblasterPlaybookSheet, { label: "Slugblaster Playbook Sheet", types: ["playbook"], makeDefault: true });
  foundry.documents.collections.Actors.registerSheet("slugblaster", SlugblasterSignatureSheet, { label: "Slugblaster Signature Sheet", types: ["signature"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("slugblaster", SlugblasterGearSheet, { label: "Slugblaster Gear Sheet", types: ["gear"], makeDefault: true });
  foundry.documents.collections.Items.registerSheet("slugblaster", SlugblasterBeatSheet, { label: "Slugblaster Beat Sheet", types: ["beat", "trait"], makeDefault: true });
  
  // template files
	foundry.applications.handlebars.loadTemplates([
    "systems/slugblaster/template/parts/part-dice.hbs",
    "systems/slugblaster/template/parts/part-style.hbs",
    "systems/slugblaster/template/parts/part-trouble.hbs",
    "systems/slugblaster/template/parts/beatsPlaybook.hbs",
    "systems/slugblaster/template/parts/actor-part-beats.hbs",
    "systems/slugblaster/template/parts/actor-part-details.hbs",
    "systems/slugblaster/template/parts/actor-part-downtime.hbs",
    "systems/slugblaster/template/parts/actor-part-hype.hbs",
    "systems/slugblaster/template/parts/actor-part-stash.hbs",
    "systems/slugblaster/template/parts/actor-part-special_trait.hbs",
    "systems/slugblaster/template/parts/actor-part-opportunities.hbs",
    "systems/slugblaster/template/parts/crew-part-challenges.hbs",
    "systems/slugblaster/template/parts/crew-part-details.hbs",
    "systems/slugblaster/template/parts/crew-part-runs.hbs",
	]);
});

