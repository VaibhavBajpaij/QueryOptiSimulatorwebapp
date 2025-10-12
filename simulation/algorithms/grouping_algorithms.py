import time
import random
import json
import numpy as np
from collections import defaultdict

class GroupingAlgorithms:
    """
    A class that implements different grouping algorithms and measures their performance.
    """
    
    def __init__(self, dataset_size):
        """
        Initialize the GroupingAlgorithms class with a dataset of specified size.
        
        Args:
            dataset_size (int): The size of the dataset to generate.
        """
        self.dataset_size = dataset_size
        self.dataset = self._generate_dataset(dataset_size)
        
    def _generate_dataset(self, size):
        """
        Generate a random dataset of key-value pairs.
        
        Args:
            size (int): The size of the dataset to generate.
            
        Returns:
            list: A list of dictionaries with 'key' and 'value' fields.
        """
        # Generate data with a limited number of keys to ensure grouping is meaningful
        num_keys = min(size // 10, 100)  # Limit the number of unique keys
        keys = [f"key_{i}" for i in range(num_keys)]
        
        return [
            {"key": random.choice(keys), "value": random.randint(1, 1000)}
            for _ in range(size)
        ]
    
    def sorting_based_grouping(self):
        """
        Perform grouping by sorting the dataset first.
        Time Complexity: O(n log n)
        
        Returns:
            dict: A dictionary containing the execution time and result.
        """
        start_time = time.time()
        
        # Sort the dataset by key
        sorted_data = sorted(self.dataset, key=lambda x: x["key"])
        
        # Group the sorted data
        groups = {}
        current_key = None
        current_group = []
        
        for item in sorted_data:
            if item["key"] != current_key:
                if current_key is not None:
                    groups[current_key] = current_group
                current_key = item["key"]
                current_group = []
            current_group.append(item["value"])
        
        # Add the last group
        if current_key is not None:
            groups[current_key] = current_group
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "algorithm": "sorting_based_grouping",
            "dataset_size": self.dataset_size,
            "execution_time": execution_time,
            "num_groups": len(groups),
            "complexity": "O(n log n)"
        }
    
    def hash_based_grouping(self):
        """
        Perform grouping using a hash table (dictionary).
        Time Complexity: O(n)
        
        Returns:
            dict: A dictionary containing the execution time and result.
        """
        start_time = time.time()
        
        # Use a defaultdict to group the data
        groups = defaultdict(list)
        
        for item in self.dataset:
            groups[item["key"]].append(item["value"])
        
        # Convert defaultdict to regular dict for JSON serialization
        groups = dict(groups)
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "algorithm": "hash_based_grouping",
            "dataset_size": self.dataset_size,
            "execution_time": execution_time,
            "num_groups": len(groups),
            "complexity": "O(n)"
        }
    
    def nested_loop_join(self, second_dataset_size=None):
        """
        Perform a nested loop join with a second dataset.
        Time Complexity: O(n²)
        
        Args:
            second_dataset_size (int, optional): Size of the second dataset. Defaults to None.
            
        Returns:
            dict: A dictionary containing the execution time and result.
        """
        if second_dataset_size is None:
            second_dataset_size = self.dataset_size // 10  # Smaller second dataset by default
        
        # Generate a second dataset
        second_dataset = [
            {"key": f"key_{i % 50}", "value": random.randint(1, 1000)}
            for i in range(second_dataset_size)
        ]
        
        start_time = time.time()
        
        # Perform nested loop join
        joined_data = []
        for item1 in self.dataset:
            for item2 in second_dataset:
                if item1["key"] == item2["key"]:
                    joined_data.append({
                        "key": item1["key"],
                        "value1": item1["value"],
                        "value2": item2["value"]
                    })
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "algorithm": "nested_loop_join",
            "dataset_size": self.dataset_size,
            "second_dataset_size": second_dataset_size,
            "execution_time": execution_time,
            "joined_rows": len(joined_data),
            "complexity": "O(n²)"
        }
    
    def hash_join(self, second_dataset_size=None):
        """
        Perform a hash join with a second dataset.
        Time Complexity: O(n + m)
        
        Args:
            second_dataset_size (int, optional): Size of the second dataset. Defaults to None.
            
        Returns:
            dict: A dictionary containing the execution time and result.
        """
        if second_dataset_size is None:
            second_dataset_size = self.dataset_size // 10  # Smaller second dataset by default
        
        # Generate a second dataset
        second_dataset = [
            {"key": f"key_{i % 50}", "value": random.randint(1, 1000)}
            for i in range(second_dataset_size)
        ]
        
        start_time = time.time()
        
        # Build hash table from the smaller dataset
        hash_table = defaultdict(list)
        for item in second_dataset:
            hash_table[item["key"]].append(item["value"])
        
        # Probe phase
        joined_data = []
        for item1 in self.dataset:
            if item1["key"] in hash_table:
                for value2 in hash_table[item1["key"]]:
                    joined_data.append({
                        "key": item1["key"],
                        "value1": item1["value"],
                        "value2": value2
                    })
        
        end_time = time.time()
        execution_time = end_time - start_time
        
        return {
            "algorithm": "hash_join",
            "dataset_size": self.dataset_size,
            "second_dataset_size": second_dataset_size,
            "execution_time": execution_time,
            "joined_rows": len(joined_data),
            "complexity": "O(n + m)"
        }
    
    def run_all_groupings(self):
        """
        Run all grouping algorithms and return their results.
        
        Returns:
            dict: A dictionary containing the results of all grouping algorithms.
        """
        results = {
            "sorting_based_grouping": self.sorting_based_grouping(),
            "hash_based_grouping": self.hash_based_grouping(),
            "dataset_size": self.dataset_size,
            "timestamp": time.time()
        }
        
        return results
    
    def run_all_joins(self):
        """
        Run all join algorithms and return their results.
        
        Returns:
            dict: A dictionary containing the results of all join algorithms.
        """
        results = {
            "nested_loop_join": self.nested_loop_join(),
            "hash_join": self.hash_join(),
            "dataset_size": self.dataset_size,
            "timestamp": time.time()
        }
        
        return results


def run_groupby_experiment(method, dataset_size):
    """
    Run a grouping experiment with the specified method and dataset size.
    
    Args:
        method (str): The grouping method to use ('sort', 'hash', or 'all').
        dataset_size (int): The size of the dataset to use.
        
    Returns:
        dict: A dictionary containing the results of the experiment.
    """
    grouping_algorithms = GroupingAlgorithms(dataset_size)
    
    if method == "sort":
        return grouping_algorithms.sorting_based_grouping()
    elif method == "hash":
        return grouping_algorithms.hash_based_grouping()
    elif method == "all":
        return grouping_algorithms.run_all_groupings()
    else:
        return {"error": f"Unknown method: {method}"}


def run_join_experiment(method, dataset_size):
    """
    Run a join experiment with the specified method and dataset size.
    
    Args:
        method (str): The join method to use ('nested', 'hash', or 'all').
        dataset_size (int): The size of the dataset to use.
        
    Returns:
        dict: A dictionary containing the results of the experiment.
    """
    grouping_algorithms = GroupingAlgorithms(dataset_size)
    
    if method == "nested":
        return grouping_algorithms.nested_loop_join()
    elif method == "hash":
        return grouping_algorithms.hash_join()
    elif method == "all":
        return grouping_algorithms.run_all_joins()
    else:
        return {"error": f"Unknown method: {method}"}


if __name__ == "__main__":
    # Example usage
    result = run_groupby_experiment("all", 10000)
    # Print JSON output when run directly
    print(json.dumps(result))
    
    result = run_join_experiment("all", 10000)
    # Print JSON output when run directly
    print(json.dumps(result))