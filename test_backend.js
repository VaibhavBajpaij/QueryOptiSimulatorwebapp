// Backend API Test Script
const axios = require('axios');

// Configuration
const API_BASE_URL = 'http://localhost:5000/api';
const SIMULATION_ENDPOINT = `${API_BASE_URL}/simulation`;
const EXPERIMENT_ENDPOINT = `${API_BASE_URL}/experiment`;

// Test results storage
const testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper function to run tests
async function runTest(name, testFn) {
  testResults.total++;
  console.log(`\n🧪 Running test: ${name}`);
  try {
    await testFn();
    console.log(`✅ Test passed: ${name}`);
    testResults.passed++;
    return true;
  } catch (error) {
    console.error(`❌ Test failed: ${name}`);
    console.error(`   Error: ${error.message}`);
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Data: ${JSON.stringify(error.response.data, null, 2)}`);
    }
    testResults.failed++;
    return false;
  }
}

// Test server connection
async function testServerConnection() {
  const response = await axios.get(API_BASE_URL);
  if (response.status !== 200) {
    throw new Error(`Server returned status ${response.status}`);
  }
  console.log(`   Server response: ${JSON.stringify(response.data)}`);
}

// Test search simulation endpoint
async function testSearchSimulation() {
  // Test linear search
  const linearResponse = await axios.get(`${SIMULATION_ENDPOINT}/run-search?algo=linear&size=1000`);
  if (!linearResponse.data || !linearResponse.data.algorithm) {
    throw new Error('Invalid response from linear search endpoint');
  }
  console.log(`   Linear search execution time: ${linearResponse.data.execution_time} seconds`);
  
  // Test all search algorithms
  const allResponse = await axios.get(`${SIMULATION_ENDPOINT}/run-search?algo=all&size=1000`);
  if (!Array.isArray(allResponse.data) || allResponse.data.length === 0) {
    throw new Error('Invalid response from all search endpoint');
  }
  console.log(`   Received results for ${allResponse.data.length} search algorithms`);
}

// Test groupby simulation endpoint
async function testGroupBySimulation() {
  // Test hash-based grouping
  const hashResponse = await axios.get(`${SIMULATION_ENDPOINT}/run-groupby?method=hash&size=1000`);
  if (!hashResponse.data || !hashResponse.data.algorithm) {
    throw new Error('Invalid response from hash grouping endpoint');
  }
  console.log(`   Hash grouping execution time: ${hashResponse.data.execution_time} seconds`);
  
  // Test all grouping algorithms
  const allResponse = await axios.get(`${SIMULATION_ENDPOINT}/run-groupby?method=all&size=1000`);
  if (!Array.isArray(allResponse.data) || allResponse.data.length === 0) {
    throw new Error('Invalid response from all grouping endpoint');
  }
  console.log(`   Received results for ${allResponse.data.length} grouping algorithms`);
}

// Test join simulation endpoint
async function testJoinSimulation() {
  // Test hash join
  const hashResponse = await axios.get(`${SIMULATION_ENDPOINT}/run-join?method=hash&size=1000`);
  if (!hashResponse.data || !hashResponse.data.algorithm) {
    throw new Error('Invalid response from hash join endpoint');
  }
  console.log(`   Hash join execution time: ${hashResponse.data.execution_time} seconds`);
  
  // Test all join algorithms
  const allResponse = await axios.get(`${SIMULATION_ENDPOINT}/run-join?method=all&size=1000`);
  if (!Array.isArray(allResponse.data) || allResponse.data.length === 0) {
    throw new Error('Invalid response from all join endpoint');
  }
  console.log(`   Received results for ${allResponse.data.length} join algorithms`);
}

// Test experiment endpoints
async function testExperimentEndpoints() {
  // Get all experiments
  const allExperimentsResponse = await axios.get(EXPERIMENT_ENDPOINT);
  if (!Array.isArray(allExperimentsResponse.data)) {
    throw new Error('Invalid response from get all experiments endpoint');
  }
  console.log(`   Retrieved ${allExperimentsResponse.data.length} experiments`);
  
  // Test filtering by task
  const searchExperimentsResponse = await axios.get(`${EXPERIMENT_ENDPOINT}?task=search`);
  if (!Array.isArray(searchExperimentsResponse.data)) {
    throw new Error('Invalid response from filtered experiments endpoint');
  }
  console.log(`   Retrieved ${searchExperimentsResponse.data.length} search experiments`);
  
  // Test export functionality
  const exportJsonResponse = await axios.get(`${EXPERIMENT_ENDPOINT}/export?format=json`, {
    responseType: 'blob'
  });
  if (!exportJsonResponse.data) {
    throw new Error('Invalid response from export JSON endpoint');
  }
  console.log(`   Successfully exported experiments as JSON`);
}

// Run all tests
async function runAllTests() {
  console.log('🚀 Starting backend API tests...');
  
  await runTest('Server Connection', testServerConnection);
  await runTest('Search Simulation', testSearchSimulation);
  await runTest('GroupBy Simulation', testGroupBySimulation);
  await runTest('Join Simulation', testJoinSimulation);
  await runTest('Experiment Endpoints', testExperimentEndpoints);
  
  // Print summary
  console.log('\n📊 Test Summary:');
  console.log(`   Total Tests: ${testResults.total}`);
  console.log(`   Passed: ${testResults.passed}`);
  console.log(`   Failed: ${testResults.failed}`);
  
  if (testResults.failed === 0) {
    console.log('\n✅ All tests passed!');
  } else {
    console.log(`\n❌ ${testResults.failed} tests failed!`);
    process.exit(1);
  }
}

// Check if server is running before starting tests
axios.get(API_BASE_URL)
  .then(() => {
    runAllTests();
  })
  .catch((error) => {
    console.error('❌ Cannot connect to the server. Make sure it is running at ' + API_BASE_URL);
    console.error(`   Error: ${error.message}`);
    process.exit(1);
  });