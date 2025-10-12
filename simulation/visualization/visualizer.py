import os
import json
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np

class Visualizer:
    """
    A class that generates visualizations for the experiment results.
    """
    
    def __init__(self):
        """
        Initialize the Visualizer class.
        """
        self.results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'results')
        self.plots_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..', 'frontend', 'public', 'plots')
        
        # Create plots directory if it doesn't exist
        if not os.path.exists(self.plots_dir):
            os.makedirs(self.plots_dir)
        
        # Set the style for the plots
        sns.set_style("whitegrid")
        plt.rcParams.update({'font.size': 12})
    
    def load_results(self, filename):
        """
        Load results from a JSON file.
        
        Args:
            filename (str): The name of the file to load from.
            
        Returns:
            dict: The loaded results.
        """
        filepath = os.path.join(self.results_dir, filename)
        
        try:
            with open(filepath, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            print(f"File not found: {filepath}")
            return None
    
    def plot_search_comparison(self, save=True):
        """
        Generate a comparison plot for search algorithms.
        
        Args:
            save (bool, optional): Whether to save the plot to a file. Defaults to True.
            
        Returns:
            str: The path to the saved plot file, or None if not saved.
        """
        results = self.load_results("search_experiments.json")
        
        if not results:
            return None
        
        # Extract data for plotting
        sizes = sorted([int(size) for size in results.keys()])
        algorithms = ["linear_search", "binary_search", "hash_lookup"]
        algorithm_names = ["Linear Search O(n)", "Binary Search O(log n)", "Hash Lookup O(1)"]
        
        # Create a figure with two subplots
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Line chart: Execution time vs Dataset size
        for i, algo in enumerate(algorithms):
            times = [results[str(size)][algo]["execution_time"] for size in sizes]
            ax1.plot(sizes, times, marker='o', linewidth=2, label=algorithm_names[i])
        
        ax1.set_title("Search Algorithm Performance")
        ax1.set_xlabel("Dataset Size")
        ax1.set_ylabel("Execution Time (seconds)")
        ax1.set_xscale("log")
        ax1.set_yscale("log")
        ax1.legend()
        ax1.grid(True)
        
        # Bar chart: Comparison for the largest dataset size
        largest_size = max(sizes)
        algo_times = [results[str(largest_size)][algo]["execution_time"] for algo in algorithms]
        
        bars = ax2.bar(algorithm_names, algo_times, color=sns.color_palette("husl", 3))
        ax2.set_title(f"Search Performance (n={largest_size})")
        ax2.set_ylabel("Execution Time (seconds)")
        ax2.set_yscale("log")
        
        # Add values on top of bars
        for bar in bars:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.6f}',
                    ha='center', va='bottom', rotation=0)
        
        plt.tight_layout()
        
        if save:
            filepath = os.path.join(self.plots_dir, "search_comparison.png")
            plt.savefig(filepath, dpi=300, bbox_inches='tight')
            plt.close()
            return filepath
        else:
            plt.show()
            return None
    
    def plot_groupby_comparison(self, save=True):
        """
        Generate a comparison plot for grouping algorithms.
        
        Args:
            save (bool, optional): Whether to save the plot to a file. Defaults to True.
            
        Returns:
            str: The path to the saved plot file, or None if not saved.
        """
        results = self.load_results("groupby_experiments.json")
        
        if not results:
            return None
        
        # Extract data for plotting
        sizes = sorted([int(size) for size in results.keys()])
        methods = ["sorting_based_grouping", "hash_based_grouping"]
        method_names = ["Sorting-based Grouping O(n log n)", "Hash-based Grouping O(n)"]
        
        # Create a figure with two subplots
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Line chart: Execution time vs Dataset size
        for i, method in enumerate(methods):
            times = [results[str(size)][method]["execution_time"] for size in sizes]
            ax1.plot(sizes, times, marker='o', linewidth=2, label=method_names[i])
        
        ax1.set_title("Grouping Algorithm Performance")
        ax1.set_xlabel("Dataset Size")
        ax1.set_ylabel("Execution Time (seconds)")
        ax1.set_xscale("log")
        ax1.set_yscale("log")
        ax1.legend()
        ax1.grid(True)
        
        # Bar chart: Comparison for the largest dataset size
        largest_size = max(sizes)
        method_times = [results[str(largest_size)][method]["execution_time"] for method in methods]
        
        bars = ax2.bar(method_names, method_times, color=sns.color_palette("husl", 2))
        ax2.set_title(f"Grouping Performance (n={largest_size})")
        ax2.set_ylabel("Execution Time (seconds)")
        ax2.set_yscale("log")
        
        # Add values on top of bars
        for bar in bars:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.6f}',
                    ha='center', va='bottom', rotation=0)
        
        plt.tight_layout()
        
        if save:
            filepath = os.path.join(self.plots_dir, "groupby_comparison.png")
            plt.savefig(filepath, dpi=300, bbox_inches='tight')
            plt.close()
            return filepath
        else:
            plt.show()
            return None
    
    def plot_join_comparison(self, save=True):
        """
        Generate a comparison plot for join algorithms.
        
        Args:
            save (bool, optional): Whether to save the plot to a file. Defaults to True.
            
        Returns:
            str: The path to the saved plot file, or None if not saved.
        """
        results = self.load_results("join_experiments.json")
        
        if not results:
            return None
        
        # Extract data for plotting
        sizes = sorted([int(size) for size in results.keys()])
        methods = ["nested_loop_join", "hash_join"]
        method_names = ["Nested Loop Join O(n²)", "Hash Join O(n + m)"]
        
        # Create a figure with two subplots
        fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))
        
        # Line chart: Execution time vs Dataset size
        for i, method in enumerate(methods):
            times = [results[str(size)][method]["execution_time"] for size in sizes]
            ax1.plot(sizes, times, marker='o', linewidth=2, label=method_names[i])
        
        ax1.set_title("Join Algorithm Performance")
        ax1.set_xlabel("Dataset Size")
        ax1.set_ylabel("Execution Time (seconds)")
        ax1.set_xscale("log")
        ax1.set_yscale("log")
        ax1.legend()
        ax1.grid(True)
        
        # Bar chart: Comparison for the largest dataset size
        largest_size = max(sizes)
        method_times = [results[str(largest_size)][method]["execution_time"] for method in methods]
        
        bars = ax2.bar(method_names, method_times, color=sns.color_palette("husl", 2))
        ax2.set_title(f"Join Performance (n={largest_size})")
        ax2.set_ylabel("Execution Time (seconds)")
        ax2.set_yscale("log")
        
        # Add values on top of bars
        for bar in bars:
            height = bar.get_height()
            ax2.text(bar.get_x() + bar.get_width()/2., height,
                    f'{height:.6f}',
                    ha='center', va='bottom', rotation=0)
        
        plt.tight_layout()
        
        if save:
            filepath = os.path.join(self.plots_dir, "join_comparison.png")
            plt.savefig(filepath, dpi=300, bbox_inches='tight')
            plt.close()
            return filepath
        else:
            plt.show()
            return None
    
    def plot_all_comparisons(self):
        """
        Generate all comparison plots.
        
        Returns:
            list: A list of paths to the saved plot files.
        """
        plots = []
        
        search_plot = self.plot_search_comparison()
        if search_plot:
            plots.append(search_plot)
        
        groupby_plot = self.plot_groupby_comparison()
        if groupby_plot:
            plots.append(groupby_plot)
        
        join_plot = self.plot_join_comparison()
        if join_plot:
            plots.append(join_plot)
        
        return plots


if __name__ == "__main__":
    # Example usage
    visualizer = Visualizer()
    plots = visualizer.plot_all_comparisons()
    print(f"Generated plots: {plots}")