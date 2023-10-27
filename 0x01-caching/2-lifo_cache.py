#!/usr/bin/env python3
"""
A class that inherits from BaseCaching and is a caching system
"""
from base_caching import BaseCaching
from collections import OrderedDict


class LIFOCache(BaseCaching):
    """
    A LIFO class
    """
    def __init__(self):
        """
        initialise the objects
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        add an item to cache
        """
        if key is None and item is None:
            return
        # if new key is being added
        if key not in self.cache_data:
            if len(self.cache_data) >= BaseCaching.MAX_ITEMS:
                discarded_item = self.cache_data.popitem(last=True)
                print('DISCARD: {}'.format(discarded_item[0]))
        # if key's value is being updated and move it ro the last
        self.cache_data[key] = item
        self.cache_data.move_to_end(key, last=True)

    def get(self, key):
        """
        get an item from cache
        """
        return self.cache_data.get(key, None)
