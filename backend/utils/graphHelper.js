/**
 * Graph Helper Utilities
 * Processes edge list, validates inputs, filters duplicates and multi-parents,
 * partitions components, detects cycles using DFS recursion stack, and builds tree JSONs.
 */

function processGraph(data) {
  const invalid_entries = [];
  const duplicate_edges = [];
  const seen_edges = new Set();
  
  const parents = {}; // child -> parent
  const children = {}; // parent -> array of children (insertion order)
  const allNodes = new Set();

  // 1. Parse and Validate Edges
  if (Array.isArray(data)) {
    for (const entry of data) {
      if (typeof entry !== 'string') {
        invalid_entries.push(String(entry));
        continue;
      }
      
      const trimmed = entry.trim();
      
      // Reject empty string or invalid formats
      if (trimmed === "") {
        invalid_entries.push("");
        continue;
      }

      const match = trimmed.match(/^([A-Z])->([A-Z])$/);
      if (!match) {
        invalid_entries.push(trimmed);
        continue;
      }

      const X = match[1];
      const Y = match[2];

      // Reject self-loops (e.g., A->A)
      if (X === Y) {
        invalid_entries.push(trimmed);
        continue;
      }

      // Record nodes of any valid formatted edge
      allNodes.add(X);
      allNodes.add(Y);

      // Check for duplicate edges
      if (seen_edges.has(trimmed)) {
        if (!duplicate_edges.includes(trimmed)) {
          duplicate_edges.push(trimmed);
        }
        continue;
      }

      seen_edges.add(trimmed);

      // Enforce multi-parent rule: ignore edge if child already has a parent
      if (parents[Y] !== undefined) {
        // Ignored edge (not added to graph, not invalid, not duplicate)
        continue;
      }

      // Accept edge
      parents[Y] = X;
      if (!children[X]) {
        children[X] = [];
      }
      children[X].push(Y);

    }
  }

  // 2. Partition into Connected Components (Undirected connectivity)
  const adj = {};
  for (const node of allNodes) {
    adj[node] = new Set();
  }
  for (const [child, parent] of Object.entries(parents)) {
    adj[child].add(parent);
    adj[parent].add(child);
  }

  const visited = new Set();
  const components = [];
  
  for (const node of allNodes) {
    if (!visited.has(node)) {
      const component = [];
      const queue = [node];
      visited.add(node);
      while (queue.length > 0) {
        const curr = queue.shift();
        component.push(curr);
        for (const neighbor of adj[curr]) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
      components.push(component);
    }
  }

  // 3. Process Components
  const hierarchies = [];
  let total_trees = 0;
  let total_cycles = 0;
  let largest_tree_root = "";
  let max_depth = -1;

  for (const component of components) {
    // Find all nodes in component with in-degree 0
    const rootsInComp = component.filter(node => parents[node] === undefined);
    
    let root = "";
    if (rootsInComp.length > 0) {
      // Choose lexicographically smallest among the roots
      root = [...rootsInComp].sort()[0];
    } else {
      // Pure cycle: choose lexicographically smallest node in the component
      root = [...component].sort()[0];
    }

    // DFS Cycle Detection with recursion stack
    const dfsVisited = new Set();
    const recStack = new Set();
    let has_cycle = false;

    function dfs(node) {
      dfsVisited.add(node);
      recStack.add(node);
      
      const nodeChildren = children[node] || [];
      for (const child of nodeChildren) {
        if (!dfsVisited.has(child)) {
          if (dfs(child)) {
            return true;
          }
        } else if (recStack.has(child)) {
          return true;
        }
      }
      
      recStack.delete(node);
      return false;
    }

    // Start DFS from each node in the component to ensure no cycle is missed
    for (const node of component) {
      if (!dfsVisited.has(node)) {
        if (dfs(node)) {
          has_cycle = true;
          break;
        }
      }
    }

    if (has_cycle) {
      total_cycles++;
      hierarchies.push({
        root: root,
        tree: {},
        has_cycle: true
      });
    } else {
      total_trees++;

      // Recursive tree builder preserving insertion order
      function buildTree(node) {
        const treeObj = {};
        const nodeChildren = children[node] || [];
        for (const child of nodeChildren) {
          treeObj[child] = buildTree(child);
        }
        return treeObj;
      }

      // Recursive depth calculator
      function getDepth(node) {
        const nodeChildren = children[node] || [];
        if (nodeChildren.length === 0) {
          return 1;
        }
        let maxChildDepth = 0;
        for (const child of nodeChildren) {
          maxChildDepth = Math.max(maxChildDepth, getDepth(child));
        }
        return 1 + maxChildDepth;
      }

      const tree = {
        [root]: buildTree(root)
      };
      const depth = getDepth(root);

      hierarchies.push({
        root: root,
        tree: tree,
        depth: depth,
        has_cycle: false
      });

      // Update largest tree root tracking
      if (depth > max_depth) {
        max_depth = depth;
        largest_tree_root = root;
      } else if (depth === max_depth) {
        if (root < largest_tree_root || largest_tree_root === "") {
          largest_tree_root = root;
        }
      }
    }
  }

  // Sort hierarchies array lexicographically by root name for clean rendering
  hierarchies.sort((a, b) => a.root.localeCompare(b.root));

  return {
    hierarchies,
    invalid_entries,
    duplicate_edges,
    summary: {
      total_trees,
      total_cycles,
      largest_tree_root
    }
  };
}

module.exports = {
  processGraph
};
