import json
import os
from simulation.algorithms.search_algorithms import run_search_experiment
from simulation.algorithms.grouping_algorithms import run_groupby_experiment, run_join_experiment
from simulation.simulator import run_experiment
from simulation.visualization.visualizer import Visualizer

def test_search_algorithms():
    print("\n===== Testing Search Algorithms =====")
    # Test each search algorithm with a small dataset
    for algo in ['linear', 'binary', 'hash']:
        print(f"\nTesting {algo} search...")
        result = run_search_experiment(algo, 1000)
        print(f"Algorithm: {result['algorithm']}")
        print(f"Execution Time: {result['execution_time']:.6f} seconds")
        print(f"Complexity: {result['complexity']}")
        print(f"Target Found: {result['found']}")
        if result['found']:
            print(f"Index: {result['index']}")

def test_groupby_algorithms():
    print("\n===== Testing Group By Algorithms =====")
    # Test each grouping algorithm with a small dataset
    for algo in ['sort', 'hash']:
        print(f"\nTesting {algo}-based grouping...")
        result = run_groupby_experiment(algo, 1000)
        print(f"Algorithm: {result['algorithm']}")
        print(f"Execution Time: {result['execution_time']:.6f} seconds")
        print(f"Complexity: {result['complexity']}")
        print(f"Groups Found: {result['group_count']}")

def test_join_algorithms():
    print("\n===== Testing Join Algorithms =====")
    # Test each join algorithm with a small dataset
    for algo in ['nested', 'hash']:
        print(f"\nTesting {algo} join...")
        result = run_join_experiment(algo, 1000)
        print(f"Algorithm: {result['algorithm']}")
        print(f"Execution Time: {result['execution_time']:.6f} seconds")
        print(f"Complexity: {result['complexity']}")
        print(f"Matches Found: {result['match_count']}")

def test_full_experiment():
    print("\n===== Testing Full Experiment =====")
    # Run a small experiment with all algorithms
    print("Running experiment with dataset size 1000...")
    run_experiment('all', 1000)
    
    # Check if results files were created
    results_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'results')
    print(f"\nChecking results directory: {results_dir}")
    
    for filename in os.listdir(results_dir):
        if filename.endswith('.json'):
            print(f"Found result file: {filename}")
            with open(os.path.join(results_dir, filename), 'r') as f:
                data = json.load(f)
                print(f"  Contains {len(data)} data points")

def test_visualization():
    print("\n===== Testing Visualization =====")
    # Create visualizer
    visualizer = Visualizer()
    
    # Check if visualization methods exist
    print("Checking visualization methods...")
    methods = [
        'plot_search_performance',
        'plot_groupby_performance',
        'plot_join_performance',
        'plot_all_performance'
    ]
    
    for method in methods:
        if hasattr(visualizer, method):
            print(f"✓ Method '{method}' exists")
        else:
            print(f"✗ Method '{method}' does not exist")

if __name__ == "__main__":
    print("Starting simulation engine tests...\n")
    
    try:
        test_search_algorithms()
        test_groupby_algorithms()
        test_join_algorithms()
        test_full_experiment()
        test_visualization()
        
        print("\n===== All Tests Completed Successfully =====")
    except Exception as e:
        print(f"\n❌ Error during testing: {str(e)}")