#!/usr/bin/env python3
"""
A script
"""
from typing import List, Tuple, Dict, Any
import math
import csv


def index_range(page: int, page_size: int) -> Tuple:
    """
    A function that return a tuple of size two containing a start index
    and an end index corresponding to the range of indexes
    to return in a list for those particular pagination parameters.
    """
    offset = (page - 1) * page_size
    limit = page * page_size
    return (offset, limit)


class Server:
    """Server class to paginate a database of popular baby names.
    """
    DATA_FILE = "Popular_Baby_Names.csv"

    def __init__(self):
        self.__dataset = None

    def dataset(self) -> List[List]:
        """Cached dataset
        """
        if self.__dataset is None:
            with open(self.DATA_FILE) as f:
                reader = csv.reader(f)
                dataset = [row for row in reader]
            self.__dataset = dataset[1:]

        return self.__dataset

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        pass

    def get_page(self, page: int = 1, page_size: int = 10) -> List[List]:
        """
        Implement a method named get_page that takes two integer arguments
        page with default value 1 and page_size with default value 10.
        """
        assert isinstance(page, int) and isinstance(page_size, int)
        assert page > 0 and page_size > 0
        data = self.dataset()
        idx = index_range(page, page_size)
        return [data[x] for x in range(idx[0], idx[1]) if idx[1] < len(data)]

    def get_hyper(self, page: int = 1, page_size: int = 10) -> Dict[str, Any]:
        """
        Implement a get_hyper method that takes the same arguments
        (and defaults) as get_page and returns a dictionary
        containing the following key-value pairs:
        """
        data = self.get_page(page, page_size)
        hyper_dict = {
            'page_size': page_size if len(data) > 0 else 0,
            'page': page,
            'data': data,
            'next_page': page + 1 if len(data) > 0 else None,
            'prev_page': page - 1 if page > 1 else None,
            'total_pages': math.ceil(len(self.__dataset) / page_size)
        }
        return hyper_dict
