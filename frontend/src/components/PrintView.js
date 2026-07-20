export default function PrintView({ program }) {
  const supersetColors = ['#e94560', '#4560e9', '#45e960', '#e9a045', '#9045e9'];

  const getGroupColor = (groupId, exercises) => {
    const groups = [...new Set(exercises.filter(e => e.supersetGroup).map(e => e.supersetGroup))];
    const index = groups.indexOf(groupId);
    return supersetColors[index % supersetColors.length];
  };

  const totalExercises = program.blocks.reduce((sum, b) => sum + b.exercises.length, 0);

  return (
    <div>
      <div className="no-print" style={styles.toolbar}>
        <button style={styles.printBtn} onClick={() => window.print()}>
          🖨️ Print / Save as PDF
        </button>
      </div>

      <div id="print-content">

        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <div style={styles.headerLabel}>TRAINING PROGRAM</div>
            <h1 style={styles.headerTitle}>{program.name}</h1>
            {program.description && <p style={styles.headerDesc}>{program.description}</p>}
          </div>
          <div style={styles.headerRight}>
            {program.durationWeeks && (
              <div style={styles.stat}>
                <div style={styles.statNum}>{program.durationWeeks}</div>
                <div style={styles.statLabel}>WEEKS</div>
              </div>
            )}
            <div style={styles.stat}>
              <div style={styles.statNum}>{program.blocks.length}</div>
              <div style={styles.statLabel}>BLOCKS</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statNum}>{totalExercises}</div>
              <div style={styles.statLabel}>EXERCISES</div>
            </div>
          </div>
        </div>

        {/* Blocks */}
        <div style={styles.body}>
          {program.blocks.map((block, blockIndex) => (
            <div key={block.id} className="block-section" style={styles.block}>
              <div style={styles.blockHeader}>
                <div style={styles.blockBadge}>{String(blockIndex + 1).padStart(2, '0')}</div>
                <div>
                  <div style={styles.blockName}>{block.name}</div>
                  {block.focus && <div style={styles.blockFocus}>{block.focus.toUpperCase()}</div>}
                </div>
                <div style={styles.blockCount}>{block.exercises.length} exercises</div>
              </div>

              <table style={styles.table}>
                <thead>
                  <tr style={styles.thead}>
                    <th style={{ ...styles.th, width: '32px' }}>#</th>
                    <th style={{ ...styles.th, textAlign: 'left' }}>EXERCISE</th>
                    <th style={{ ...styles.th, width: '64px' }}>SETS</th>
                    <th style={{ ...styles.th, width: '64px' }}>REPS</th>
                    <th style={{ ...styles.th, textAlign: 'left' }}>NOTES</th>
                    <th style={{ ...styles.th, width: '80px' }}>WEIGHT</th>
                  </tr>
                </thead>
                <tbody>
                  {block.exercises.map((ex, exIndex) => {
                    const color = ex.supersetGroup ? getGroupColor(ex.supersetGroup, block.exercises) : null;
                    return (
                      <tr key={ex.id} style={{ background: exIndex % 2 === 0 ? '#fafafa' : 'white' }}>
                        <td style={{ ...styles.td, borderLeft: `4px solid ${color || 'transparent'}`, textAlign: 'center', color: '#999' }}>
                          {exIndex + 1}
                        </td>
                        <td style={styles.td}>
                          <div style={styles.exName}>{ex.name || ex.exercise?.name}</div>
                          {ex.supersetGroup && (
                            <span style={{ ...styles.supersetBadge, color, borderColor: color }}>SUPERSET</span>
                          )}
                        </td>
                        <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{ex.sets}</td>
                        <td style={{ ...styles.td, textAlign: 'center', fontWeight: 'bold' }}>{ex.reps}</td>
                        <td style={{ ...styles.td, color: '#888', fontSize: '12px' }}>{ex.notes || ''}</td>
                        <td style={{ ...styles.td, textAlign: 'center' }}>
                          <div style={styles.weightBox} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <span>Program Block Builder</span>
          <span>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;600;700&display=swap');

        #print-content {
          font-family: 'DM Sans', sans-serif;
          max-width: 860px;
          margin: 0 auto;
          background: white;
        }

        .block-section {
          break-inside: avoid;
          page-break-inside: avoid;
        }

        @media print {
          .no-print { display: none !important; }
          body * { visibility: hidden; }
          #print-content, #print-content * { visibility: visible; }
          #print-content {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            max-width: 100%;
          }
          @page {
            size: A4;
            margin: 15mm 20mm;
          }
        }
      `}</style>
    </div>
  );
}

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1a1a2e',
    padding: '36px 48px',
    marginBottom: '0',
  },
  headerLeft: { flex: 1 },
  headerLabel: {
    fontSize: '10px',
    letterSpacing: '4px',
    color: '#e94560',
    marginBottom: '8px',
    fontWeight: '700',
  },
  headerTitle: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '42px',
    color: 'white',
    margin: '0 0 6px',
    letterSpacing: '2px',
    lineHeight: 1,
  },
  headerDesc: {
    color: '#888',
    fontSize: '13px',
    margin: 0,
  },
  headerRight: {
    display: 'flex',
    gap: '16px',
    marginLeft: '32px',
  },
  stat: {
    textAlign: 'center',
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.08)',
    padding: '14px 18px',
    borderRadius: '6px',
    minWidth: '60px',
  },
  statNum: {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: '30px',
    color: 'white',
    lineHeight: 1,
    marginBottom: '4px',
    letterSpacing: '1px',
  },
  statLabel: {
    fontSize: '9px',
    letterSpacing: '2px',
    color: '#555',
    fontWeight: '700',
  },
  body: {
    padding: '32px 48px',
    background: 'white',
  },
  block: {
    marginBottom: '28px',
    border: '1px solid #e8e8e8',
    borderRadius: '6px',
    overflow: 'hidden',
  },
  blockHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    background: '#f5f5f5',
    borderBottom: '2px solid #1a1a2e',
    padding: '10px 16px',
  },
  blockBadge: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#1a1a2e',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    flexShrink: 0,
  },
  blockName: {
    fontSize: '14px',
    fontWeight: '700',
    color: '#1a1a2e',
  },
  blockFocus: {
    fontSize: '9px',
    letterSpacing: '2px',
    color: '#e94560',
    fontWeight: '700',
    marginTop: '2px',
  },
  blockCount: {
    marginLeft: 'auto',
    fontSize: '11px',
    color: '#aaa',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  thead: {
    background: '#fafafa',
  },
  th: {
    padding: '8px 14px',
    fontSize: '9px',
    letterSpacing: '1.5px',
    color: '#aaa',
    fontWeight: '700',
    borderBottom: '1px solid #eee',
    textAlign: 'center',
  },
  td: {
    padding: '11px 14px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '13px',
    color: '#333',
    verticalAlign: 'middle',
  },
  exName: {
    fontWeight: '600',
    color: '#1a1a2e',
    fontSize: '13px',
  },
  supersetBadge: {
    display: 'inline-block',
    fontSize: '8px',
    letterSpacing: '1px',
    border: '1px solid',
    padding: '1px 5px',
    borderRadius: '2px',
    fontWeight: '700',
    marginTop: '3px',
  },
  weightBox: {
    width: '48px',
    height: '22px',
    border: '1px solid #ddd',
    borderRadius: '3px',
    margin: '0 auto',
    background: 'white',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 48px',
    borderTop: '1px solid #eee',
    background: '#fafafa',
    fontSize: '11px',
    color: '#ccc',
  },
  toolbar: {
    padding: '12px 48px',
    background: '#f0f0f0',
    borderBottom: '1px solid #ddd',
    display: 'flex',
    justifyContent: 'flex-end',
  },
  printBtn: {
    padding: '10px 24px',
    background: '#1a1a2e',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '600',
  },
};