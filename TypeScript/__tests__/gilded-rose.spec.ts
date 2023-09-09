import { Item, GildedRose } from '../app/gilded-rose';

type ItemDetail = {sellIn: number, quality: number}
type ItemType = Record<string, ItemDetail>

const legendaryItems: ItemType = {
  "Sulfuras, Hand of Ragnaros": {sellIn: 0, quality: 80},
    // "Sulfuras, Hand of Ragnaros": {sellIn: -1, quality: 80},
}
const increasingItems: ItemType = {
  "Aged Brie": {sellIn: 2, quality: 0},
    "Backstage passes to a TAFKAL80ETC concert": {sellIn: 15, quality: 20},
  // "Backstage passes to a TAFKAL80ETC concert": {sellIn: 10, quality: 49},
  // "Backstage passes to a TAFKAL80ETC concert": {sellIn: 5, quality: 49},
}

const decreasingItems: ItemType = {
  "+5 Dexterity Vest": {sellIn: 10, quality: 20},
  "Elixir of the Mongoose": {sellIn: 5, quality: 7},
}
// this conjured item does not work properly yet
// new Item("Conjured Mana Cake", 3, 6)];
const data  = {
  legendaryItems,
  increasingItems,
  decreasingItems,
}


function getItems(itemType: 'all' | 'legendary' | 'increasing' | 'decreasing'){

  if(itemType !== 'all'){
    const dataItemKey = `${itemType}Items` as keyof typeof data
    var itemsData = data[dataItemKey]
  } else {
    var itemsData = {
      ...legendaryItems,
      ...increasingItems,
      ...decreasingItems,
    }
  }

  const items = Object
    .entries(itemsData)
    .reduce(
      (retval, [name, {sellIn, quality}]) => {
        retval.push(new Item(name, sellIn, quality))
        return retval
      }, [] as Item[]
    )

  return {
    itemsData,
    items,
  }
}

describe('Gilded Rose', () => {
  it('should lower the quality and value of every item at the end of every day', () => {
    // setup
    const {itemsData: data, items} = getItems('decreasing')
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
    const {itemsData: data, items} = getItems('decreasing')

    for(const item of items){
      item.sellIn = 0
    }
    const gildedRose = new GildedRose(items)

    // execute
    gildedRose.updateQuality();

    // assert
    for (const { name, quality } of gildedRose.items) {
      expect(quality).toBe(data[name].quality - 2)
    }
  })
  it('should never lower the quality below zero', () => {
    //setup
    const {itemsData: data, items} = getItems('decreasing')
    for(const item of items) {
      item.quality = 0
    }
    const gildedRose = new GildedRose(items)

    // execute
    gildedRose.updateQuality();

    // assert
    for (const { quality } of gildedRose.items) {
      expect(quality).toBe(0)
    }
  })
  it('should never set the quality higher than 50', () => {
    //setup
    const {items} = getItems('increasing')
    for(const item of items){
      item.quality = 50
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
      const { itemsData, items } = getItems('legendary')
      const gildedRose = new GildedRose(items)

      // execute
      gildedRose.updateQuality();

      // assert
      for (const { name, sellIn } of gildedRose.items) {
        expect(sellIn).toBe(itemsData[name].sellIn)
      }
    })
    it("never decreases in quality", () => {
      // setup
      const {itemsData, items} = getItems('legendary')
      const gildedRose = new GildedRose(items)

      // execute
      gildedRose.updateQuality()

      // assert
      for(const { name, quality} of gildedRose.items) {
        expect(quality).toBeGreaterThanOrEqual(itemsData[name].quality)
      }
    })
  })
  describe("Aged Brie", () => {
    it("should increase quality every day", () => {
      //setup
      const {itemsData, items} = getItems('increasing')
      const gildedRose = new GildedRose(items)

      // execute
      gildedRose.updateQuality();

      // assert
      for (const { name, quality } of gildedRose.items) {
        expect(quality).toBe(itemsData[name].quality + 1)
      }
    })
  })
  describe("Backstage Passes", () => {
      it("quality increases in quality by 1 every day when sellIn > 10", () => {
        // setup
        const sellIn = 20
        const quality = 10
        const items = [new Item("Backstage passes", sellIn, quality)]
        const gildedRose = new GildedRose(items)

        // execute
        gildedRose.updateQuality()

        // assert
        expect(gildedRose.items[0].quality).toBe(quality + 1)
      })
      it("quality increases by 2 every day when 10 >= sellIn > 5", () => {
        const quality = 10
        for(let sellIn=10; sellIn>5; sellIn--){
          // setup
          const items = [new Item("Backstage passes", sellIn, quality)]
          const gildedRose = new GildedRose(items)

          // execute
          gildedRose.updateQuality()

          // assert
          expect(gildedRose.items[0].quality).toBe(quality + 2)
        }
      })
      it("quality increases by 3 every day when 5 >= sellIn > 0", () => {
        const quality = 10
        for(let sellIn=5; sellIn>0; sellIn--){
          // setup
          const items = [new Item("Backstage passes", sellIn, quality)]
          const gildedRose = new GildedRose(items)

          // execute
          gildedRose.updateQuality()

          // assert
          expect(gildedRose.items[0].quality).toBe(quality + 3)
        }
      })
      it("quality is 0 when sellIn <= 0", () => {
        const quality = 10;
        let sellIn = 0;
          const items = [new Item("Backstage passes", sellIn, quality)]
          const gildedRose = new GildedRose(items)

          //execute
          gildedRose.updateQuality()

          //assert
          expect(gildedRose.items[0].quality).toBe(0)
      })
  })
})
