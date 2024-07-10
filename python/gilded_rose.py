# -*- coding: utf-8 -*-

class GildedRose(object):
    def __init__(self, items):
        self.items = items

    def update_quality(self):
        for item in self.items:
            update_func = item_update_functions.get(
                item.name, update_regular_item)
            update_func(item)


def decrease_quality(item, amount=1):
    item.quality = max(0, item.quality - amount)


def increase_quality(item, amount=1):
    item.quality = min(50, item.quality + amount)


def update_regular_item(item):
    decrease_quality(item)
    item.sell_in -= 1
    if item.sell_in < 0:
        decrease_quality(item)


def update_aged_brie(item):
    increase_quality(item)
    item.sell_in -= 1
    if item.sell_in < 0:
        increase_quality(item)


def update_backstage_pass(item):
    if item.sell_in > 10:
        increase_quality(item)
    elif item.sell_in > 5:
        increase_quality(item, amount=2)
    elif item.sell_in > 0:
        increase_quality(item, amount=3)
    else:
        item.quality = 0
    item.sell_in -= 1


def update_sulfuras(item):
    pass


item_update_functions = {
    "Aged Brie": update_aged_brie,
    "Backstage passes to a TAFKAL80ETC concert": update_backstage_pass,
    "Sulfuras, Hand of Ragnaros": update_sulfuras
}


class Item:
    def __init__(self, name, sell_in, quality):
        self.name = name
        self.sell_in = sell_in
        self.quality = quality

    def __repr__(self):
        return "%s, %s, %s" % (self.name, self.sell_in, self.quality)
