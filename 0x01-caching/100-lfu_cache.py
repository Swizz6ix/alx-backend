#!/usr/bin/env python3
"""
A class that inherits from BaseCaching and is a caching system
"""
from base_caching import BaseCaching


class LFUCache(BaseCaching):
    """
    A LFU class
    """
    def __init__(self):
        """
        initialise the objects
        """
        super().__init__()
        self.track_dict = {}

    def put(self, key, item):
        """
        add an item to cache
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item
        if len(self.cache_data) > self.MAX_ITEMS:
            pop_item = min(self.track_dict, key=self.track_dict.get)
            self.track_dict.pop(pop_item)
            self.cache_data.pop(pop_item)
            print('DISCARD: {}'.format(pop_item))

        if key not in self.track_dict:
            self.track_dict[key] = 0
        else:
            self.track_dict[key] += 1

    def get(self, key):
        """
        get an item from cache
        """
        if key is None or key not in self.cache_data:
            return None
        self.track_dict[key] += 1
        return self.cache_data.get(key)
