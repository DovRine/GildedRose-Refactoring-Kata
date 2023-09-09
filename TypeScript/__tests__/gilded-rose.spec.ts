import { Item, GildedRose } from '../app/gilded-rose';


describe('Gilded Rose', () => {
  it('should lower the quality and value of every item at the end of every day', () => {
    // setup
    const data = {
      a: { quality: 10, sellIn: 10 },
      b: { quality: 20, sellIn: 20 },
      c: { quality: 30, sellIn: 30 },
    }
    const items: Item[] = []
    for (const [name, { quality, sellIn }] of Object.entries(data)) {
      items.push(new Item(name, sellIn, quality))
    }
    const gildedRose = new GildedRose(items)

    // execute
    gildedRose.updateQuality();

    // assert
    for (const { name, sellIn, quality } of gildedRose.items) {
      expect(sellIn).toBe(data[name].sellIn - 1)
      expect(quality).toBe(data[name].quality - 1)
    }
  });
  it('should lower the quality twice as fast if sell by date has passed', () => {
    //setup
    const data = {
      a: { quality: 10, sellIn: 0 },
      b: { quality: 20, sellIn: 0 },
      c: { quality: 30, sellIn: 0 },
    }
    const items: Item[] = []
    for (const [name, { quality, sellIn }] of Object.entries(data)) {
      items.push(new Item(name, sellIn, quality))
    }
    const gildedRose = new GildedRose(items)

    // execute
    gildedRose.updateQuality();

    // assert
    for (const { name, sellIn, quality } of gildedRose.items) {
      expect(sellIn).toBe(data[name].sellIn - 1)
      expect(quality).toBe(data[name].quality - 2)
    }
  })
  it('should never lower the quality below zero', () => {
    //setup
    const data = {
      a: { quality: 0, sellIn: 0 },
      b: { quality: 0, sellIn: 0 },
      c: { quality: 0, sellIn: 0 },
    }
    const items: Item[] = []
    for (const [name, { quality, sellIn }] of Object.entries(data)) {
      items.push(new Item(name, sellIn, quality))
    }
    const gildedRose = new GildedRose(items)

    // execute
    gildedRose.updateQuality();

    // assert
    for (const { name, quality } of gildedRose.items) {
      expect(quality).toBe(0)
    }
  })
  it('should never set the quality higher than 50', () => {
    //setup
    const data = {
      "Aged Brie": { quality: 50, sellIn: 10 },
    }
    const items: Item[] = []
    for (const [name, { quality, sellIn }] of Object.entries(data)) {
      items.push(new Item(name, sellIn, quality))
    }
    const gildedRose = new GildedRose(items)

    // execute
    gildedRose.updateQuality();

    // assert
    for (const { quality } of gildedRose.items) {
      expect(quality).toBe(50)
    }
  })
});

describe("Item Exceptions", () => {
  describe("Legendary Items", () => {
    it("never has to be sold", () => {
      //setup
      const data = {
        "Sulfuras, Hand of Ragnaros": { quality: 49, sellIn: 10 },
      }
      const items: Item[] = []
      for (const [name, { quality, sellIn }] of Object.entries(data)) {
        items.push(new Item(name, sellIn, quality))
      }
      const gildedRose = new GildedRose(items)

      // execute
      gildedRose.updateQuality();

      // assert
      for (const { name, sellIn } of gildedRose.items) {
        expect(sellIn).toBe(10)
      }
    })
    it.todo("never decreases in quality")
  })
  describe("Aged Brie", () => {
    it("should increase quality every day", () => {
      //setup
      const data = {
        "Aged Brie": { quality: 49, sellIn: 10 },
      }
      const items: Item[] = []
      for (const [name, { quality, sellIn }] of Object.entries(data)) {
        items.push(new Item(name, sellIn, quality))
      }
      const gildedRose = new GildedRose(items)

      // execute
      gildedRose.updateQuality();

      // assert
      for (const { name, quality } of gildedRose.items) {
        expect(quality).toBe(50)
      }

    })
  })
})
