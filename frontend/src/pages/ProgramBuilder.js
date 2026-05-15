import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { programsAPI, blocksAPI } from '../services/api';
import ProgramBlock from '../components/ProgramBlock';
import ExerciseSearch from '../components/ExerciseSearch';

export default function ProgramBuilder() {
  const { id } = useParams();
  const [program, setProgram] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [blockForm, setBlockForm] = useState({ name: '', focus: '' });

  useEffect(() => {
    programsAPI.getOne(id).then(res => {
      setProgram(res.data);
      setLoading(false);
    });
  }, [id]);

  const handleAddBlock = async (e) => {
    e.preventDefault();
    const res = await blocksAPI.create(id, { ...blockForm, order_index: program.blocks.length });
    setProgram({ ...program, blocks: [...program.blocks, { ...res.data, exercises: [] }] });
    setBlockForm({ name: '', focus: '' });
    setShowAddBlock(false);
  };

  const handleDropExercise = async (blockId, exercise) => {
    const block = program.blocks.find(b => b.id === blockId);
    const newExercise = {
      id: Date.now().toString(),
      exerciseId: exercise.id,
      name: exercise.name,
      sets: 3,
      reps: 10,
      notes: '',
      order_index: block.exercises.length,
    };
    setProgram({
      ...program,
      blocks: program.blocks.map(b =>
        b.id === blockId ? { ...b, exercises: [...b.exercises, newExercise] } : b
      ),
    });
  };

  const handleUpdateExercise = (blockId, exerciseId, updates) => {
    setProgram({
      ...program,
      blocks: program.blocks.map(b =>
        b.id === blockId ? {
          ...b,
          exercises: b.exercises.map(e => e.id === exerciseId ? { ...e, ...updates } : e)
        } : b
      ),
    });
  };

  const handleDeleteBlock = async (blockId) => {
    await blocksAPI.delete(id, blockId);
    setProgram({ ...program, blocks: program.blocks.filter(b => b.id !== blockId) });
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId === destination.droppableId) {
      const block = program.blocks.find(b => b.id === source.droppableId);
      const exercises = Array.from(block.exercises);
      const [moved] = exercises.splice(source.index, 1);
      exercises.splice(destination.index, 0, moved);
      setProgram({
        ...program,
        blocks: program.blocks.map(b => b.id === source.droppableId ? { ...b, exercises } : b),
      });
    }
  };

  if (loading) return <div style={{ padding: '24px' }}>Loading...</div>;

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <ExerciseSearch onDrop={handleDropExercise} blocks={program.blocks} />
      </div>
      <div style={styles.main}>
        <div style={styles.header}>
          <h2 style={styles.title}>{program.name}</h2>
          <button style={styles.btn} onClick={() => setShowAddBlock(!showAddBlock)}>+ Add Block</button>
        </div>

        {showAddBlock && (
          <form onSubmit={handleAddBlock} style={styles.form}>
            <input style={styles.input} placeholder="Block Name (e.g. Week 1 - Upper Body)" value={blockForm.name} onChange={e => setBlockForm({...blockForm, name: e.target.value})} required />
            <input style={styles.input} placeholder="Focus (e.g. Strength, Hypertrophy)" value={blockForm.focus} onChange={e => setBlockForm({...blockForm, focus: e.target.value})} />
            <button style={styles.btn} type="submit">Create Block</button>
          </form>
        )}

        <DragDropContext onDragEnd={onDragEnd}>
          <div style={styles.blocks}>
            {program.blocks.map(block => (
              <ProgramBlock
                key={block.id}
                block={block}
                onUpdateExercise={handleUpdateExercise}
                onDeleteBlock={handleDeleteBlock}
                onDropExercise={handleDropExercise}
              />
            ))}
          </div>
        </DragDropContext>

        {program.blocks.length === 0 && (
          <div style={styles.empty}>
            <p>No blocks yet. Add a block to get started, then drag exercises from the left panel!</p>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: { display: 'flex', height: 'calc(100vh - 56px)' },
  sidebar: { width: '300px', background: '#f8f9fa', borderRight: '1px solid #e0e0e0', overflowY: 'auto', padding: '16px' },
  main: { flex: 1, overflowY: 'auto', padding: '24px' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' },
  title: { margin: 0, color: '#1a1a2e' },
  btn: { padding: '10px 20px', background: '#1a1a2e', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  form: { background: 'white', padding: '16px', borderRadius: '8px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  input: { width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' },
  blocks: { display: 'flex', flexDirection: 'column', gap: '16px' },
  empty: { textAlign: 'center', color: '#999', marginTop: '60px' },
};