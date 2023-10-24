#!/usr/bin/env python3
"""
a script named that defines a function
which takes two integer arguments page and page_size.
"""
from typing import Tuple


def index_range(page: int, page_size: int) -> Tuple:
    """
    A function that return a tuple of size two containing a start index
    and an end index corresponding to the range of indexes
    to return in a list for those particular pagination parameters.
    """
    offset = (page - 1) * page_size
    limit = page * page_size
    return (offset, limit)
