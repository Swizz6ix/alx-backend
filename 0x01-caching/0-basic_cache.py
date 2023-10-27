#!/usr/bin/env python3
"""
A Basic Cache class
"""
from base_caching import BaseCaching


class BasicCache(BaseCaching):
    """
    a class that inherits from BaseCaching
    """
    def put(self, key, item):
        """
        Add an item to the cache
        """
        if key is None or item is None:
            return
        self.cache_data[key] = item

    def get(self, key):
        """
        get an item from the cache
        """
        if key is None or key not in self.cache_data:
            return None
        return self.cache_data.get(key, None)
