import React, { useState, useEffect } from 'react';
import './css/App.css';

// Base API URL configured via environment variables
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Recursive Tree Node Component
function TreeNode({ nodeName, subtree }) {
  const childrenKeys = Object.keys(subtree || {});
  const isLeaf = childrenKeys.length === 0;

  return (
    <li className="tree-node-item">
      <div className="node-content">
        <span className={`node-bullet ${isLeaf ? 'leaf' : 'parent'}`}>
          {nodeName}
        </span>
        <span className="node-label">Node {nodeName}</span>
      </div>
      {!isLeaf && (
        <ul className="tree-node-list">
          {childrenKeys.map((childName) => (
            <TreeNode 
              key={childName} 
              nodeName={childName} 
              subtree={subtree[childName]} 
            />
          ))}
        </ul>
      )}
    </li>
  );
}

// Tree Visualizer Component
function TreeVisualizer({ tree }) {
  const rootKeys = Object.keys(tree || {});
  return (
    <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
      {rootKeys.map((rootKey) => (
        <TreeNode 
          key={rootKey} 
          nodeName={rootKey} 
          subtree={tree[rootKey]} 
        />
      ))}
    </ul>
  );
}

// Hierarchy Component Renderer
function HierarchyRenderer({ hierarchy }) {
  const { root, tree, depth, has_cycle } = hierarchy;
  return (
    <div className="tree-card">
      <div className="tree-card-header">
        <span>Root: <strong style={{ color: 'var(--primary)' }}>{root}</strong></span>
        {has_cycle ? (
          <span className="tree-badge-cycle">Cycle</span>
        ) : (
          <span className="tree-badge-depth">Depth: {depth}</span>
        )}
      </div>
      <div className="tree-card-body">
        {has_cycle ? (
          <p className="empty-placeholder" style={{ color: 'var(--error)' }}>
            Cycle detected in this component. Tree visualization omitted.
          </p>
        ) : (
          <TreeVisualizer tree={tree} />
        )}
      </div>
    </div>
  );
}

function App() {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [results, setResults] = useState(null);

  // Student details state (defaults update upon API response)
  const [studentDetails, setStudentDetails] = useState({
    user_id: 'tanishq_2310991226',
    email_id: 'tanishq1226.be23@chitkara.edu.in',
    college_roll_number: '2310991226'
  });

  // Check API health status on mount
  useEffect(() => {
    checkApiStatus();
  }, []);

  const checkApiStatus = async () => {
    try {
      const response = await fetch(`${API_URL}/`);
      if (response.ok) {
        setIsOnline(true);
      } else {
        setIsOnline(false);
      }
    } catch (err) {
      setIsOnline(false);
    }
  };

  const handlePreset = (presetType) => {
    let presetText = '';
    switch (presetType) {
      case 'tree':
        presetText = 'A->B\nA->C\nB->D';
        break;
      case 'multi-tree':
        presetText = 'A->B\nA->C\nE->F\nF->G';
        break;
      case 'pure-cycle':
        presetText = 'A->B\nB->C\nC->A';
        break;
      case 'cycle-root':
        presetText = 'B->C\nC->B\nA->B';
        break;
      case 'multi-parent':
        presetText = 'A->D\nB->D\nC->D';
        break;
      case 'mixed':
        presetText = 'A->B\nhello\nC->D\n1->2\nA->B';
        break;
      default:
        presetText = '';
    }
    setInputText(presetText);
    setError('');
  };

  const handleClear = () => {
    setInputText('');
    setResults(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResults(null);

    // Split input into lines
    const lines = inputText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line !== '');

    try {
      const response = await fetch(`${API_URL}/bfhl`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data: lines })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.message || 'API request failed');
      }

      const resData = await response.json();
      setResults(resData);
      setIsOnline(true);

      // Update student identity details from API response
      if (resData.user_id && resData.email_id && resData.college_roll_number) {
        setStudentDetails({
          user_id: resData.user_id,
          email_id: resData.email_id,
          college_roll_number: resData.college_roll_number
        });
      }
    } catch (err) {
      setError(err.message || 'Failed to connect to backend server.');
      setIsOnline(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      {/* Header and Identity */}
      <header className="header-card">
        <div className="brand-section">
          <h1>Graph Explorer</h1>
          <p>Chitkara Full Stack Challenge Solutions</p>
        </div>
        <div className="student-info">
          <div className="badge">
            <span>Roll Number</span>
            {studentDetails.college_roll_number}
          </div>
          <div className="badge">
            <span>Student Name</span>
            {studentDetails.user_id.split('_')[0].toUpperCase()}
          </div>
          <div className={`api-status-badge ${isOnline ? 'online' : 'offline'}`} onClick={checkApiStatus} style={{ cursor: 'pointer' }} title="Click to refresh status">
            <span className="status-dot"></span>
            {isOnline ? 'API Connected' : 'API Offline'}
          </div>
        </div>
      </header>

      {/* Main Grid */}
      <main className="dashboard-grid">
        {/* Left column: Controls */}
        <section className="card">
          <div className="card-title">
            <span>Input Graph Relations</span>
          </div>

          <form onSubmit={handleSubmit} className="form-group">
            <div className="textarea-container">
              <textarea
                placeholder={`A->B\nA->C\nB->D`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="button-row">
              <button type="submit" className="btn btn-primary" disabled={loading}>
                {loading && <span className="spinner"></span>}
                {loading ? 'Analyzing...' : 'Analyze Graph'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={handleClear} disabled={loading}>
                Clear
              </button>
            </div>
          </form>

          {error && <div className="error-alert">{error}</div>}

          {/* Quick Presets */}
          <div className="form-group">
            <div className="section-title">Load Templates</div>
            <div className="button-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => handlePreset('tree')} style={{ padding: '0.5rem' }}>
                Simple Tree
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handlePreset('multi-tree')} style={{ padding: '0.5rem' }}>
                Multiple Trees
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handlePreset('pure-cycle')} style={{ padding: '0.5rem' }}>
                Pure Cycle
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handlePreset('cycle-root')} style={{ padding: '0.5rem' }}>
                Cycle with Root
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handlePreset('multi-parent')} style={{ padding: '0.5rem' }}>
                Multi Parent
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => handlePreset('mixed')} style={{ padding: '0.5rem' }}>
                Mixed Inputs
              </button>
            </div>
          </div>
        </section>

        {/* Right column: Results */}
        <section className="card">
          <div className="card-title">Analysis Output</div>

          {results ? (
            <div className="results-container">
              {/* Summary Cards */}
              <div className="summary-grid">
                <div className="summary-card">
                  <h4>Total Trees</h4>
                  <div className="summary-val">{results.summary.total_trees}</div>
                </div>
                <div className="summary-card">
                  <h4>Total Cycles</h4>
                  <div className="summary-val">{results.summary.total_cycles}</div>
                </div>
                <div className="summary-card">
                  <h4>Largest Root</h4>
                  <div className="summary-val" style={{ fontSize: '1.25rem', padding: '0.2rem 0' }}>
                    {results.summary.largest_tree_root || 'N/A'}
                  </div>
                </div>
              </div>

              {/* Invalid Entries */}
              <div>
                <div className="section-title">Invalid Entries</div>
                {results.invalid_entries.length > 0 ? (
                  <div className="edge-list">
                    {results.invalid_entries.map((entry, idx) => (
                      <span key={idx} className="edge-badge invalid">
                        {entry === "" ? "empty string" : entry}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-placeholder">No invalid entries detected.</p>
                )}
              </div>

              {/* Duplicate Edges */}
              <div>
                <div className="section-title">Duplicate Edges</div>
                {results.duplicate_edges.length > 0 ? (
                  <div className="edge-list">
                    {results.duplicate_edges.map((edge, idx) => (
                      <span key={idx} className="edge-badge duplicate">
                        {edge}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="empty-placeholder">No duplicate edges found.</p>
                )}
              </div>

              {/* Hierarchies */}
              <div>
                <div className="section-title">Visualized Forest</div>
                {results.hierarchies.length > 0 ? (
                  <div className="trees-grid">
                    {results.hierarchies.map((hierarchy, idx) => (
                      <HierarchyRenderer key={idx} hierarchy={hierarchy} />
                    ))}
                  </div>
                ) : (
                  <p className="empty-placeholder">No valid tree components built.</p>
                )}
              </div>
            </div>
          ) : (
            <div style={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
              <p style={{ color: 'var(--text-light-secondary)', fontStyle: 'italic', fontSize: '0.95rem' }}>
                Enter graph relationships on the left and click "Analyze Graph" to see the visual trees and structural summary.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
