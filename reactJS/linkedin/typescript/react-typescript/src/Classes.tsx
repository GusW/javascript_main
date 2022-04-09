export class Warrior {
    #strength
    #agility
    constructor(strength: number, agility: number) {
        this.#strength = strength
        this.#agility = agility
    }

    fight() {
        return this.#strength * this.#agility
    }
}

export class Ninja extends Warrior {
    #shuriken
    constructor(shuriken: number, strength: number, agility: number) {
        super(strength, agility)
        this.#shuriken = shuriken
    }

    throwShuriken = (shuriken: number) => {
        return (shuriken ? "Shuriken thrown" : "No shuriken left")
    }
}
