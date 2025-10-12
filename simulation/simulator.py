import json
import time
import os
from algorithms.search_algorithms import run_search_experiment
from algorithms.grouping_algorithms import run_groupby_experiment, run_join_experiment

class QueryOptimizerSimulator:
    """
    A class that runs experiments with different algorithms and dataset sizes.
    """
    
    def __init__(self):
        """
        Initialize the QueryOptimizerSimulator class.
        """
        self.dataset_sizes = [1000, 10000, 100000, 1000000]
        self.results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'results')
        
        # Create results directory if it doesn't exist
        if not os.path.exists(self.results_dir):
            os.makedirs(self.results_dir)
    
    def run_search_experiments(self):
        """
        Run search experiments with different algorithms and dataset sizes.
        
        Returns:
            dict: A dictionary containing the results of all experiments.
        """
        results = {}
        
        for size in self.dataset_sizes:
            # Use JSON for all output to avoid parsing errors
            results[size] = run_search_experiment("all", size)
        
        # Save results to file
        self._save_results(results, "search_experiments.json")
        
        return results
    
    def run_groupby_experiments(self):
        """
        Run grouping experiments with different methods and dataset sizes.
        
        Returns:
            dict: A dictionary containing the results of all experiments.
        """
        results = {}
        
        for size in self.dataset_sizes:
            # Use JSON for all output to avoid parsing errors
            results[size] = run_groupby_experiment("all", size)
        
        # Save results to file
        self._save_results(results, "groupby_experiments.json")
        
        return results
    
    def run_join_experiments(self):
        """
        Run join experiments with different methods and dataset sizes.
        
        Returns:
            dict: A dictionary containing the results of all experiments.
        """
        results = {}
        
        for size in self.dataset_sizes:
            # Use JSON for all output to avoid parsing errors
            results[size] = run_join_experiment("all", size)
        
        # Save results to file
        self._save_results(results, "join_experiments.json")
        
        return results
    
    def run_all_experiments(self):
        """
        Run all experiments and return their results.
        
        Returns:
            dict: A dictionary containing the results of all experiments.
        """
        results = {
            "search": self.run_search_experiments(),
            "groupby": self.run_groupby_experiments(),
            "join": self.run_join_experiments(),
            "timestamp": time.time()
        }
        
        # Save combined results to file
        self._save_results(results, "all_experiments.json")
        
        return results
    
    def _save_results(self, results, filename):
        """
        Save results to a JSON file.
        
        Args:
            results (dict): The results to save.
            filename (str): The name of the file to save to.
        """
        filepath = os.path.join(self.results_dir, filename)
        
        with open(filepath, 'w') as f:
            json.dump(results, f, indent=2)
        
        # Don't print text that would break JSON parsing
        # print(f"Results saved to {filepath}")


def run_experiment(experiment_type, algorithm=None, dataset_size=None):
    """
    Run an experiment with the specified parameters.
    
    Args:
        experiment_type (str): The type of experiment to run ('search', 'groupby', 'join', or 'all').
        algorithm (str, optional): The algorithm to use. Defaults to None.
        dataset_size (int, optional): The size of the dataset to use. Defaults to None.
        
    Returns:
        dict: A dictionary containing the results of the experiment.
    """
    if dataset_size is not None:
        dataset_size = int(dataset_size)
    
    if experiment_type == "search":
        if algorithm and dataset_size:
            return run_search_experiment(algorithm, dataset_size)
        else:
            return {"error": "Both algorithm and dataset_size are required for search experiments."}
    
    elif experiment_type == "groupby":
        if algorithm and dataset_size:
            return run_groupby_experiment(algorithm, dataset_size)
        else:
            return {"error": "Both method and dataset_size are required for groupby experiments."}
    
    elif experiment_type == "join":
        if algorithm and dataset_size:
            return run_join_experiment(algorithm, dataset_size)
        else:
            return {"error": "Both method and dataset_size are required for join experiments."}
    
    elif experiment_type == "all":
        simulator = QueryOptimizerSimulator()
        if dataset_size:
            simulator.dataset_sizes = [dataset_size]
        return simulator.run_all_experiments()
    
    else:
        return {"error": f"Unknown experiment type: {experiment_type}"}


if __name__ == "__main__":
    import sys
    
    # Check if command line arguments are provided
    if len(sys.argv) >= 4:
        experiment_type = sys.argv[1]
        algorithm = sys.argv[2]
        dataset_size = sys.argv[3]
        
        # Debug output
        print(f"Debug: Running experiment with type={experiment_type}, algo={algorithm}, size={dataset_size}", file=sys.stderr)
        
        result = run_experiment(experiment_type, algorithm, dataset_size)
        
        # Ensure we're printing valid JSON for PythonShell to parse
        json_output = json.dumps(result)
        print(json_output, flush=True)
        
        # Debug output after JSON is printed
        print(f"Debug: Experiment completed and JSON output sent", file=sys.stderr)
    else:
        # Example usage when run directly without arguments
        simulator = QueryOptimizerSimulator()
        
        # Run all experiments with smaller sizes for testing
        simulator.dataset_sizes = [1000, 10000]
        results = simulator.run_all_experiments()
        print(json.dumps(results), flush=True)