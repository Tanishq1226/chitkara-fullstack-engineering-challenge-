# Express Backend - API Specification

This service validates a directed graph relationship list, filters invalid configurations, and partitions the graph into trees or cycle components.

## Setup & Running
```bash
npm install
npm start
```

## API Endpoints

### 1. POST `/bfhl`
Processes the relationship data.

#### Request Body
```json
{
  "data": [
    "A->B",
    "A->C",
    "B->D"
  ]
}
```

#### Response (200 OK)
```json
{
  "user_id": "tushar_2310991231",
  "email_id": "tushar1231.be23@chitkara.edu.in",
  "college_roll_number": "2310991231",
  "hierarchies": [
    {
      "root": "A",
      "tree": {
        "A": {
          "B": {
            "D": {}
          },
          "C": {}
        }
      },
      "depth": 3,
      "has_cycle": false
    }
  ],
  "invalid_entries": [],
  "duplicate_edges": [],
  "summary": {
    "total_trees": 1,
    "total_cycles": 0,
    "largest_tree_root": "A"
  }
}
```

### 2. GET `/bfhl`
Standard check returning the operation code.

#### Response (200 OK)
```json
{
  "operation_code": 1
}
```

---

## Graph Processing Rules Implemented

1. **Whitespace Trimming:** Trims spaces before validation.
2. **Valid Edge Format:** Only matches `^[A-Z]->[A-Z]$` where the source is not equal to target (self loop).
3. **Duplicate Edges:** Uses only the first occurrence. Duplicate edges are returned in `duplicate_edges` array.
4. **Multi-Parent Filtering:** If a child gets multiple parents, only the first is accepted, subsequent edges are ignored.
5. **DFS Cycle Detection:** Runs DFS using a recursion stack on each component. If a cycle is detected, `has_cycle` is set to `true` and the depth and nested tree are omitted for that component.
6. **Tie Breaking:** The largest tree root is determined by maximum depth. If a depth tie occurs, the lexicographically smaller root is chosen.
