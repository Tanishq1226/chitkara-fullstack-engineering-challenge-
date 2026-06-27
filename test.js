/**
 * Automated Test Suite for Chitkara Full Stack Engineering Challenge
 * Validates the Express backend API on port 3000 against all 15+ edge cases.
 */

const API_URL = 'http://localhost:3000/bfhl';

const testCases = [
  {
    name: '1. Valid Tree (Simple)',
    data: ['A->B', 'A->C', 'B->D'],
    assert: (res) => {
      return (
        res.summary.total_trees === 1 &&
        res.summary.total_cycles === 0 &&
        res.summary.largest_tree_root === 'A' &&
        res.hierarchies.length === 1 &&
        res.hierarchies[0].depth === 3 &&
        JSON.stringify(res.hierarchies[0].tree) === JSON.stringify({ A: { B: { D: {} }, C: {} } })
      );
    }
  },
  {
    name: '2. Duplicate Edges Handling',
    data: ['A->B', 'A->B', 'A->C', 'A->B'],
    assert: (res) => {
      return (
        res.duplicate_edges.length === 1 &&
        res.duplicate_edges[0] === 'A->B' &&
        res.summary.total_trees === 1 &&
        res.summary.largest_tree_root === 'A'
      );
    }
  },
  {
    name: '3. Multiple Independent Trees',
    data: ['A->B', 'C->D', 'D->E'],
    assert: (res) => {
      return (
        res.summary.total_trees === 2 &&
        res.summary.total_cycles === 0 &&
        res.summary.largest_tree_root === 'C' && // depth of C-tree is 3, A-tree is 2
        res.hierarchies.length === 2 &&
        res.hierarchies[0].root === 'A' &&
        res.hierarchies[1].root === 'C'
      );
    }
  },
  {
    name: '4. Pure Cycle Detection',
    data: ['A->B', 'B->C', 'C->A'],
    assert: (res) => {
      return (
        res.summary.total_trees === 0 &&
        res.summary.total_cycles === 1 &&
        res.summary.largest_tree_root === '' &&
        res.hierarchies.length === 1 &&
        res.hierarchies[0].root === 'A' && // Lexicographically smallest root
        res.hierarchies[0].has_cycle === true &&
        Object.keys(res.hierarchies[0].tree).length === 0
      );
    }
  },
  {
    name: '5. Cycle with Root Component',
    data: ['B->C', 'C->B', 'A->B'],
    assert: (res) => {
      // B->C accepted, C->B accepted (cycle B-C formed)
      // A->B ignored because B already has parent C.
      // A is isolated node (depth 1), B-C is cycle.
      return (
        res.summary.total_trees === 1 &&
        res.summary.total_cycles === 1 &&
        res.summary.largest_tree_root === 'A' &&
        res.hierarchies.find(h => h.root === 'A' && !h.has_cycle && h.depth === 1) !== undefined &&
        res.hierarchies.find(h => h.root === 'B' && h.has_cycle) !== undefined
      );
    }
  },
  {
    name: '6. Multi-parent Rule Enforced',
    data: ['A->D', 'B->D', 'C->D'],
    assert: (res) => {
      // D gets parent A. B->D and C->D ignored.
      // A-D forms a tree. B and C are isolated nodes.
      return (
        res.summary.total_trees === 3 && // Trees A, B, C
        res.summary.largest_tree_root === 'A' && // A depth is 2, B/C depth is 1
        res.hierarchies.length === 3
      );
    }
  },
  {
    name: '7. Invalid Entries Rejection',
    data: ['hello', '1->2', 'AB->C', 'A-B', 'A->', ''],
    assert: (res) => {
      return (
        res.invalid_entries.length === 6 &&
        res.invalid_entries.includes('hello') &&
        res.invalid_entries.includes('1->2') &&
        res.invalid_entries.includes('AB->C') &&
        res.invalid_entries.includes('A-B') &&
        res.invalid_entries.includes('A->') &&
        res.invalid_entries.includes('') &&
        res.summary.total_trees === 0 &&
        res.summary.total_cycles === 0
      );
    }
  },
  {
    name: '8. Empty Input',
    data: [],
    assert: (res) => {
      return (
        res.summary.total_trees === 0 &&
        res.summary.total_cycles === 0 &&
        res.summary.largest_tree_root === '' &&
        res.hierarchies.length === 0
      );
    }
  },
  {
    name: '9. Single Edge (Two Nodes)',
    data: ['X->Y'],
    assert: (res) => {
      return (
        res.summary.total_trees === 1 &&
        res.summary.total_cycles === 0 &&
        res.summary.largest_tree_root === 'X' &&
        res.hierarchies[0].depth === 2
      );
    }
  },
  {
    name: '10. Tie in largest_tree_root (Lexicographical Break)',
    data: ['P->Q', 'A->B'],
    assert: (res) => {
      // Both trees have depth 2. Largest root is A (A < P)
      return (
        res.summary.total_trees === 2 &&
        res.summary.largest_tree_root === 'A'
      );
    }
  },
  {
    name: '11. Multiple Duplicate Occurrences',
    data: ['A->B', 'A->B', 'C->D', 'C->D', 'A->B'],
    assert: (res) => {
      return (
        res.duplicate_edges.length === 2 &&
        res.duplicate_edges.includes('A->B') &&
        res.duplicate_edges.includes('C->D')
      );
    }
  },
  {
    name: '12. Whitespace Trimming',
    data: ['  A->B  ', 'C->D\t'],
    assert: (res) => {
      return (
        res.invalid_entries.length === 0 &&
        res.summary.total_trees === 2 &&
        res.hierarchies[0].root === 'A' &&
        res.hierarchies[1].root === 'C'
      );
    }
  },
  {
    name: '13. Self Loops Rejection',
    data: ['A->A', 'B->B'],
    assert: (res) => {
      return (
        res.invalid_entries.length === 2 &&
        res.invalid_entries.includes('A->A') &&
        res.invalid_entries.includes('B->B') &&
        res.summary.total_trees === 0
      );
    }
  },
  {
    name: '14. Long Chain Depth',
    data: ['A->B', 'B->C', 'C->D', 'D->E'],
    assert: (res) => {
      return (
        res.summary.total_trees === 1 &&
        res.summary.largest_tree_root === 'A' &&
        res.hierarchies[0].depth === 5
      );
    }
  },
  {
    name: '15. Diamond Graph (Multi-parent check)',
    data: ['A->B', 'A->C', 'B->D', 'C->D'],
    assert: (res) => {
      // A->B, A->C, B->D accepted.
      // C->D ignored because D already has parent B.
      // Tree: A -> B -> D and C. Depth of tree is 3 (A-B-D).
      return (
        res.summary.total_trees === 1 &&
        res.summary.largest_tree_root === 'A' &&
        res.hierarchies[0].depth === 3
      );
    }
  },
  {
    name: '16. Mixed Valid and Invalid Inputs',
    data: ['A->B', 'hello', 'B->C', '1->2', 'A->B'],
    assert: (res) => {
      return (
        res.invalid_entries.length === 2 &&
        res.invalid_entries.includes('hello') &&
        res.invalid_entries.includes('1->2') &&
        res.duplicate_edges.length === 1 &&
        res.duplicate_edges.includes('A->B') &&
        res.summary.total_trees === 1 &&
        res.summary.largest_tree_root === 'A' &&
        res.hierarchies[0].depth === 3
      );
    }
  }
];

async function runTests() {
  console.log('==================================================');
  console.log('CHITKARA CHALLENGE - RUNNING API AUTOMATED TESTS');
  console.log('==================================================\n');

  let passedCount = 0;
  
  for (const tc of testCases) {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: tc.data })
      });

      if (!response.ok) {
        console.error(`\x1b[31m[FAIL] ${tc.name}\x1b[0m`);
        console.error(`       HTTP Status: ${response.status}`);
        continue;
      }

      const result = await response.json();
      const passed = tc.assert(result);

      if (passed) {
        console.log(`\x1b[32m[PASS] ${tc.name}\x1b[0m`);
        passedCount++;
      } else {
        console.error(`\x1b[31m[FAIL] ${tc.name}\x1b[0m`);
        console.error('       Payload sent:', JSON.stringify(tc.data));
        console.error('       Response received:', JSON.stringify(result, null, 2));
      }
    } catch (error) {
      console.error(`\x1b[31m[ERROR] ${tc.name} failed with exception:\x1b[0m`);
      console.error(`        ${error.message}`);
    }
  }

  console.log('\n==================================================');
  console.log(`TEST SUMMARY: ${passedCount}/${testCases.length} Passed`);
  console.log('==================================================');
  
  if (passedCount !== testCases.length) {
    process.exit(1);
  }
}

// Run tests
runTests();