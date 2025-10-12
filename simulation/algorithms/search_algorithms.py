import time
import random
import json
import numpy as np

class SearchAlgorithms:
    """
    A class that implements different search algorithms and measures their performance.
    """
    
    def __init__(self, dataset_size):
        """
        Initialize the SearchAlgorithms class with a dataset of specified size.
        
        Args:
            dataset_size (int): The size of the dataset to generate.
        """
        self.dataset_size = dataset_size
        self.dataset = self._generate_dataset(dataset_size)
        self.target = self.dataset[random.randint(0, dataset_size - 1)]
        self.sorted_dataset = sorted(self.dataset)
        self.hash_dataset = {value: index for index, value in enumerate(self.dataset)}
        
    def _generate_dataset(self, size):
        """
        Generate a random dataset of integers.
        
        Args:
            size (int): The size of the dataset to generate.
            
        Returns:
            list: A list of random integers.
        """
        return random.sample(range(1, size * 10), size)
    
    def linear_search(self):
        """
        Perform a linear search for the target value in the dataset.
        Time Complexity: O(n)
        
        Returns:
            dict: A dictionary containing the execution time and result.
        """
        start_time = time.time()
        
        found = False
        index = -1
        
        for i, value in enumerate(self.dataset):
            if value == self.target:
                found = True
                index = i
                break
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "algorithm": "linear_search",
            "dataset_size": self.dataset_size,
            "execution_time": execution_time,
            "found": found,
            "index": index,
            "target": self.target,
            "complexity": "O(n)"
        }
    
    def binary_search(self):
        """
        Perform a binary search for the target value in the sorted dataset.
        Time Complexity: O(log n)
        
        Returns:
            dict: A dictionary containing the execution time and result.
        """
        start_time = time.time()
        
        left, right = 0, len(self.sorted_dataset) - 1
        found = False
        index = -1
        
        while left <= right:
            mid = (left + right) // 2
            if self.sorted_dataset[mid] == self.target:
                found = True
                index = mid
                break
            elif self.sorted_dataset[mid] < self.target:
                left = mid + 1
            else:
                right = mid - 1
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "algorithm": "binary_search",
            "dataset_size": self.dataset_size,
            "execution_time": execution_time,
            "found": found,
            "index": index,
            "target": self.target,
            "complexity": "O(log n)"
        }
    
    def hash_lookup(self):
        """
        Perform a hash-based lookup for the target value.
        Time Complexity: O(1) average case
        
        Returns:
            dict: A dictionary containing the execution time and result.
        """
        start_time = time.time()
        
        found = False
        index = -1
        
        if self.target in self.hash_dataset:
            found = True
            index = self.hash_dataset[self.target]
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "algorithm": "hash_lookup",
            "dataset_size": self.dataset_size,
            "execution_time": execution_time,
            "found": found,
            "index": index,
            "target": self.target,
            "complexity": "O(1)"
        }
    
    def run_all_searches(self):
        """
        Run all search algorithms and return their results.
        
        Returns:
            dict: A dictionary containing the results of all search algorithms.
        """
        results = {
            "linear_search": self.linear_search(),
            "binary_search": self.binary_search(),
            "hash_lookup": self.hash_lookup(),
            "dataset_size": self.dataset_size,
            "timestamp": time.time()
        }
        
        return results


def run_search_experiment(algorithm, dataset_size):
    """
    Run a search experiment with the specified algorithm and dataset size.
    
    Args:
        algorithm (str): The search algorithm to use ('linear', 'binary', 'hash', or 'all').
        dataset_size (int): The size of the dataset to use.
        
    Returns:
        dict: A dictionary containing the results of the experiment.
    """
    search_algorithms = SearchAlgorithms(dataset_size)
    
    if algorithm == "linear":
        return search_algorithms.linear_search()
    elif algorithm == "binary":
        return search_algorithms.binary_search()
    elif algorithm == "hash":
        return search_algorithms.hash_lookup()
    elif algorithm == "all":
        return search_algorithms.run_all_searches()
    else:
        return {"error": f"Unknown algorithm: {algorithm}"}


if __name__ == "__main__":
    # Example usage
    result = run_search_experiment("all", 10000)
    # Print JSON output when run directly
    print(json.dumps(result))