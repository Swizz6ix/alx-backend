#!/usr/bin/env python3
"""
A class that inherits from BaseCaching and is a caching system
"""
from base_caching import BaseCaching
from collections import OrderedDict


class FIFOCache(BaseCaching):
    """
    A fifo class
    """
    def __init__(self):
        """
        Initialize the Objects
        """
        super().__init__()
        self.cache_data = OrderedDict()

    def put(self, key, item):
        """
        Add item to cache
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item
        # If cache storage is full
        if len(self.cache_data) > BaseCaching.MAX_ITEMS:
            discarded_item = self.cache_data.popitem(last=False)
            print ('DISCARD: {}'.format(discarded_item[0]))

    def get(self, key):
        """
        get item from cache
        """
        return self.cache_data.get(key, None)
