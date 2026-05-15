import { Droppable, Draggable } from '@hello-pangea/dnd';
import { blockExercisesAPI } from '../services/api';

export default function ProgramBlock({ block, onUpdateExercise, onDeleteBlock, onDropExercise }) {

  const handleUpdate = async (exercise, field, value) => {
    const updates = { ...exercise, [field]: value };
    onUpdateExercise(block.id, exercise.id, updates);
    try {
      await blockExercisesAPI.update(block.id, exercise.id, { [field]: value });
    } catch (e) {
      console.error('Update failed', e);
    }
  };

  return (
    <div style={styles.block}>
      <div style={styles.blockHeader}>
        <div>
          <h3 style={styles.blockTitle}>{block.name}</h3>
          {block.focus && <span style={styles.focus}>{block.focus}</span>}
        </div>
        <button style={styles.deleteBtn} onClick={() => onDeleteBlock(block.id)}>✕ Remove</button>
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
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ ...styles.exercise, ...provided.draggableProps.style }}>
                    <div style={styles.exLeft}>
                      <span style={styles.handle}>⠿</span>
                      <p style={styles.exName}>{ex.name || ex.exercise?.name}</p>
                    </div>
                    <div style={styles.exControls}>
                      <label style={styles.label}>Sets</label>
                      <input style={styles.numInput} type="number" value={ex.sets} min="1" onChange={e => handleUpdate(ex, 'sets', parseInt(e.target.value))} />
                      <label style={styles.label}>Reps</label>
                      <input style={styles.numInput} type="number" value={ex.reps} min="1" onChange={e => handleUpdate(ex, 'reps', parseInt(e.target.value))} />
                      <input style={styles.notesInput} placeholder="Notes..." value={ex.notes || ''} onChange={e => handleUpdate(ex, 'notes', e.target.value)} />
                    </div>
                  </div>
                )}
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
  exercise: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'white', padding: '10px 12px', borderRadius: '6px', marginBottom: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', gap: '12px' },
  exLeft: { display: 'flex', alignItems: 'center', gap: '8px', minWidth: '160px' },
  handle: { color: '#ccc', fontSize: '16px', cursor: 'grab' },
  exName: { margin: 0, fontSize: '13px', fontWeight: 'bold', color: '#1a1a2e' },
  exControls: { display: 'flex', alignItems: 'center', gap: '8px', flex: 1, justifyContent: 'flex-end' },
  label: { fontSize: '11px', color: '#999' },
  numInput: { width: '50px', padding: '4px', border: '1px solid #ddd', borderRadius: '4px', textAlign: 'center', fontSize: '13px' },
  notesInput: { padding: '4px 8px', border: '1px solid #ddd', borderRadius: '4px', fontSize: '12px', width: '150px' },
};