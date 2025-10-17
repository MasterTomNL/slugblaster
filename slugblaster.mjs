import { registerHandlebarsHelpers } from "./js/handlebar-helpers.mjs";
import { SlugblasterCoreSheet } from "./js/slugblaster-core-sheet.mjs"; // methods to add, delete and/or change items
import { SlugblasterActorData, SlugblasterCrewData, SlugblasterFameData, SlugblasterPlaybookData, SlugblasterSignatureData, SlugblasterGearData } from "./js/datamodels.mjs";
import { SlugblasterActor } from "./js/documents.mjs";

import { SlugblasterActorSheet, SlugblasterSignatureSheet } from "./js/sheets.mjs";
import { SlugblasterPlaybookSheet } from "./js/playbook-sheet.mjs";
import { SlugblasterBeatSheet } from  "./js/beat-sheet.mjs";
import { SlugblasterCrewSheet } from "./js/crew-sheet.mjs";
import { SlugblasterFameSheet } from "./js/fame-sheet.mjs";
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
  Actors.registerSheet("slugblaster", SlugblasterActorSheet, { label: "Slugblaster Actor Sheet", makeDefault: true });
  Actors.registerSheet("slugblaster", SlugblasterCrewSheet, { label: "Slugblaster Crew Sheet", types: ["crew"], makeDefault: true });
  Actors.registerSheet("slugblaster", SlugblasterPlaybookSheet, { label: "Slugblaster Playbook Sheet", types: ["playbook"], makeDefault: true });
  Actors.registerSheet("slugblaster", SlugblasterSignatureSheet, { label: "Slugblaster Signature Sheet", types: ["signature"], makeDefault: true });
  Items.registerSheet("slugblaster", SlugblasterGearSheet, { label: "Slugblaster Gear Sheet", types: ["gear"], makeDefault: true });
  Items.registerSheet("slugblaster", SlugblasterBeatSheet, { label: "Slugblaster Beat Sheet", types: ["beat", "trait"], makeDefault: true });
  
  // template files
	loadTemplates([
		"systems/slugblaster/template/parts/attitude.hbs",
    "systems/slugblaster/template/parts/avatars.hbs",
    "systems/slugblaster/template/parts/beats.hbs",
    "systems/slugblaster/template/parts/beatsNoLoad.hbs",
    "systems/slugblaster/template/parts/beatsPlaybook.hbs",
    "systems/slugblaster/template/parts/crew.hbs",
    "systems/slugblaster/template/parts/crew-details.hbs",
    "systems/slugblaster/template/parts/details.hbs",
    "systems/slugblaster/template/parts/factions.hbs",
    "systems/slugblaster/template/parts/fame.hbs",
    "systems/slugblaster/template/parts/gear.hbs",
    "systems/slugblaster/template/parts/hype.hbs",
    "systems/slugblaster/template/parts/legacy.hbs",
    "systems/slugblaster/template/parts/notes.hbs",
    "systems/slugblaster/template/parts/signature.hbs",
    "systems/slugblaster/template/parts/stash.hbs",
    "systems/slugblaster/template/parts/style.hbs",
		"systems/slugblaster/template/parts/traits.hbs",
    "systems/slugblaster/template/parts/trouble.hbs"
	]);
});