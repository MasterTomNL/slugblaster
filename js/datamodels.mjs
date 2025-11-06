const {
  HTMLField, SchemaField, NumberField, BooleanField, StringField, FilePathField, ArrayField
} = foundry.data.fields;

export class SlugblasterActorData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      look: new StringField(),
      family: new StringField(),
      bond: new StringField(),
      vibes: new StringField(),
      attitude: new StringField(),
      stickers: new StringField(),
      dicePool: new NumberField({ integer: true, min: 1, initial: 1, max: 9 }),
      boost: new NumberField({ required: true, integer: true, min: -1, max: 9, initial: 0 }),
      kick: new NumberField({ required: true, integer: true, min: -1, max: 9, initial: 0 }),
      boosts: new NumberField({ required: true, integer: true, min: -1, max: 9, initial: 0 }),
      kicks: new NumberField({ required: true, integer: true, min: -1, max: 9, initial: 0 }),
      hoverboard: new StringField(),
      board_img: new StringField(),
      raygun: new StringField(),
      playbook: new StringField(),
      styleBonus: new StringField(),
      specialTraitName: new StringField(), // Passion, Quirk, etc.
      specialTraitDesc: new StringField(),
      specialTraitUnlocked: new BooleanField(),
      specialTraitText: new StringField(),
      opportunitiesPool: new NumberField({ required: false, integer: true, min: 1, max: 9, initial: 1 }),
      oc_friend: new BooleanField(),
      oc_allied: new BooleanField(),
      oc_upandc: new BooleanField(),
      oc_rising: new BooleanField(),
      trouble: new NumberField({ required: true, integer: true, min: 0, initial: 0 }),
      style: new NumberField({ integer: true, min: 0, initial: 0 }),
      styleFree: new BooleanField(),
      legacy: new ArrayField(new StringField()),
      doom: new ArrayField(new StringField()),
      slams: new ArrayField(new StringField()),
      coil: new NumberField({ integer: true, min: 0, initial: 0 }),
      disc: new NumberField({ integer: true, min: 0, initial: 0 }),
      gem: new NumberField({ integer: true, min: 0, initial: 0 }),
      lens: new NumberField({ integer: true, min: 0, initial: 0 }),
      notes: new HTMLField(),
    };
  }
}

export class SlugblasterSignatureData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      boosts: new NumberField({ required: true, integer: true, min: -1, max: 6, initial: 0 }),
      kicks: new NumberField({ required: true, integer: true, min: -1, max: 6, initial: 0 }),
      look: new StringField(),
      description: new HTMLField(),
      effect: new HTMLField(),
    };
  }
}

export class SlugblasterPlaybookData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      boosts: new NumberField({ required: true, integer: true, min: -1, max: 5, initial: 0 }),
      kicks: new NumberField({ required: true, integer: true, min: -1, max: 5, initial: 0 }),
      styleBonus: new StringField(),
      specialGear: new StringField(),
      attitude: new HTMLField(),
      specialTraitName: new StringField(), // Passion, Quirk, etc.
      specialTraitDesc: new StringField(), // "Somehow you're great at..." etc.
    };
  }
}

export class SlugblasterGearData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      active: new BooleanField(),
      type: new StringField(),
      description: new HTMLField(),
      parentId: new StringField(),
      boosts: new NumberField({ required: true, integer: true, min: -1, max: 5, initial: 0 }),
      kicks: new NumberField({ required: true, integer: true, min: -1, max: 5, initial: 0 }),
      coilCost: new NumberField({ required: false, integer: true, min: 0, max: 5, initial: 0 }),
      discCost: new NumberField({ required: false, integer: true, min: 0, max: 5, initial: 0 }),
      gemCost: new NumberField({ required: false, integer: true, min: 0, max: 5, initial: 0 }),
      lensCost: new NumberField({ required: false, integer: true, min: 0, max: 5, initial: 0 }),
    };
  }
}

export class SlugblasterCrewData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      brands: new StringField(),
      hangouts: new StringField(),
      style: new NumberField({ required: false, integer: true, min: 0, max: 10, initial: 0 }),
      kick: new NumberField({ required: false, integer: true, min: 0, max: 5, initial: 0 }),
      boost: new NumberField({ required: false, integer: true, min: 0, max: 5, initial: 0 }),
      runsPool: new NumberField({ required: false, integer: true, min: 1, max: 9, initial: 1 }),
      dicePool: new NumberField({ required: false, integer: true, min: 1, max: 9, initial: 1 }),
      challengesPool: new NumberField({ required: false, integer: true, min: 1, max: 9, initial: 1 }),
      fame_level: new NumberField({ required: false, integer: true, min: 0, max: 5, initial: 0 }),
      fame_perk_0_0: new BooleanField(),
      fame_perk_0_1: new BooleanField(),
      fame_perk_1_0: new BooleanField(),
      fame_perk_1_1: new BooleanField(),
      fame_perk_1_2: new BooleanField(),
      fame_perk_1_3: new BooleanField(),
      fame_perk_2_0: new BooleanField(),
      fame_perk_2_1: new BooleanField(),
      fame_perk_2_2: new BooleanField(),
      fame_perk_2_3: new BooleanField(),
      fame_perk_3_0: new BooleanField(),
      fame_perk_3_1: new BooleanField(),
      fame_perk_3_2: new BooleanField(),
      fame_perk_3_3: new BooleanField(),
      fame_perk_4_0: new BooleanField(),
      fame_perk_4_1: new BooleanField(),
      fame_perk_4_2: new BooleanField(),
      fame_perk_4_3: new BooleanField(),
      cc_rival: new BooleanField(),
      cc_enemy: new BooleanField(),
      cc_upandc: new BooleanField(),
      cc_rising: new BooleanField(),
      notes: new HTMLField(),
    };
  }
}

export class SlugblasterFameData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      level: new NumberField({ required: false, integer: true, min: 0, max: 10, initial: 0 }),
      description: new HTMLField(),
      styleCost: new NumberField({ required: false, integer: true, min: 0, max: 10, initial: 0 }),
      reward: new HTMLField(),
    };
  }
}
