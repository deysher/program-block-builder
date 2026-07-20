import { Droppable, Draggable } from '@hello-pangea/dnd';
import { blockExercisesAPI } from '../services/api';

export default function ProgramBlock({ block, onUpdateExercise, onDeleteBlock, onRefresh }) {

  const handleUpdate = async (exercise, field, value) => {
    const updates = { ...exercise, [field]: value };
    onUpdateExercise(block.id, exercise.id, updates);
    try {
      await blockExercisesAPI.update(block.id, exercise.id, { [field]: value });
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  const handleDelete = async (exerciseId) => {
    try {
      await blockExercisesAPI.remove(block.id, exerciseId);
      onUpdateExercise(block.id, exerciseId, { _delete: true });
    } catch (e) {
      console.error('Failed to delete exercise:', e);
    }
  };

const supersetColors = ['#e94560', '#4560e9', '#45e960', '#e9a045', '#9045e9'];

const getGroupColor = (groupId, exercises) => {
  const groups = [...new Set(exercises.filter(e => e.supersetGroup).map(e => e.supersetGroup))];
  const index = groups.indexOf(groupId);
  return supersetColors[index % supersetColors.length];
};

const handleToggleSuperset = async (exercise, exercises) => {
  const index = exercises.findIndex(e => e.id === exercise.id);
  const prev = exercises[index - 1];
  const next = exercises[index + 1];

  try {
    if (exercise.supersetGroup) {
      await blockExercisesAPI.update(block.id, exercise.id, { supersetGroup: null });
      onRefresh();
    } else {
      if (!prev) {
        alert('Select the second exercise in the superset. The exercise above it will be grouped with it.');
        return;
      }
      if (prev.supersetGroup && next?.supersetGroup === prev.supersetGroup) {
        const groupId = `ss-${Date.now()}`;
        await blockExercisesAPI.update(block.id, prev.id, { supersetGroup: groupId });
        await blockExercisesAPI.update(block.id, exercise.id, { supersetGroup: groupId });
      } else if (prev.supersetGroup) {
        await blockExercisesAPI.update(block.id, exercise.id, { supersetGroup: prev.supersetGroup });
      } else {
        const groupId = `ss-${Date.now()}`;
        await blockExercisesAPI.update(block.id, prev.id, { supersetGroup: groupId });
        await blockExercisesAPI.update(block.id, exercise.id, { supersetGroup: groupId });
      }
      onRefresh();
    }
  } catch (e) {
    console.error('Superset toggle failed:', e.response?.data || e.message);
  }
};

const renderExercise = (ex, index, exercises, provided) => {
  const color = ex.supersetGroup ? getGroupColor(ex.supersetGroup, exercises) : null;
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      style={{ ...styles.exercise, ...provided.draggableProps.style, borderLeft: color ? `3px solid ${color}` : '3px solid transparent' }}
    >
      <div style={styles.exLeft}>
        <span style={styles.handle}>⠿</span>
        <div>
          <p style={styles.exName}>{ex.name || ex.exercise?.name}</p>
          {ex.supersetGroup && (
            <span style={{ ...styles.supersetTag, background: `${color}22`, color }}>Superset</span>
          )}
        </div>
      </div>
      <div style={styles.exControls}>
        <label style={styles.label}>Sets</label>
        <input
          style={styles.numInput}
          type="number"
          value={ex.sets}
          min="1"
          onChange={e => handleUpdate(ex, 'sets', parseInt(e.target.value))}
        />
        <label style={styles.label}>Reps</label>
        <input
          style={styles.numInput}
          type="number"
          value={ex.reps}
          min="1"
          onChange={e => handleUpdate(ex, 'reps', parseInt(e.target.value))}
        />
        <input
          style={styles.notesInput}
          placeholder="Notes..."
          value={ex.notes || ''}
          onChange={e => handleUpdate(ex, 'notes', e.target.value)}
        />
        <button
          style={ex.supersetGroup ? { ...styles.supersetBtnActive, background: color } : styles.supersetBtn}
          title={ex.supersetGroup ? 'Remove from superset' : 'Add to superset with previous exercise'}
          onClick={() => handleToggleSuperset(ex, exercises)}
        >SS</button>
        <button style={styles.removeBtn} onClick={() => handleDelete(ex.id)}>✕</button>
      </div>
    </div>
  );
};

  return (
    <div style={styles.block}>
      <div style={styles.blockHeader}>
        <div>
          <h3 style={styles.blockTitle}>{block.name}</h3>
          {block.focus && <span style={styles.focus}>{block.focus}</span>}
        </div>
        <button style={styles.deleteBtn} onClick={() => onDeleteBlock(block.id)}>✕ Remove Block</button>
      </div>

      <Droppable droppableId={block.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={{ ...styles.dropZone, background: snapshot.isDraggingOver ? '#e8f4fd' : '#f8f9fa' }}
          >
            {block.exercises.length === 0 && (
              <p style={styles.emptyDrop}>Search and add exercises from the left panel</p>
            )}
            {block.exercises.map((ex, index) => (
              <Draggable key={ex.id} draggableId={ex.id.toString()} index={index}>
                {(provided) => renderExercise(ex, index, block.exercises, provided)}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
}

const styles = {
  block: { background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' },
  blockHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: '#1a1a2e', color: 'white' },
  blockTitle: { margin: 0, color: 'white', fontSize: '16px' },
  focus: { fontSize: '12px', color: '#aaa', marginTop: '2px', display: 'block' },
  deleteBtn: { padding: '6px 12px', background: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
  dropZone: { minHeight: '80px', padding: '12px', transition: 'background 0.2s' },
  emptyDrop: { textAlign: 'center', color: '#bbb', fontSize: '13px', padding: '20px 0' },
  exercise: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '10px 12px', borderRadius: '6px', marginBottom: '4px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gap: '12px' },
  exLeft: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px' },
  handle: { color: '#ccc', fontSize: '16px', cursor: 'grab' },
  exName: { margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e' },
  supersetTag: { fontSize: '10px', background: '#ffeef0', color: '#e94560', padding: '1px 6px', borderRadius: '10px', fontWeight: 'bold' },
  exControls: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' },
  label: { fontSize: '11px', color: '#999' },
  numInput: { width: '50px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', fontSize: '13px' },
  notesInput: { padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', width: '150px' },
  supersetBtn: { padding: '4px 8px', background: '#f0f0f0', color: '#666', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  supersetBtnActive: { padding: '4px 8px', background: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold' },
  removeBtn: { padding: '4px 8px', background: '#e94560', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' },
};