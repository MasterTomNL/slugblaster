/**
 * Extend the base Actor entity
 * @extends {Actor}
 */
export class SlugblasterActor extends Actor {

  /** @inheritdoc */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    const prototypeToken = {
      actorLink: true,
      disposition: CONST.TOKEN_DISPOSITIONS.NEUTRAL
    }
    if (this.type === "slugblaster" || this.type === "crew") {
      prototypeToken.disposition = CONST.TOKEN_DISPOSITIONS.FRIENDLY;
    }
    this.updateSource({ prototypeToken });
  }
}
