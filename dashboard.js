import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { api } from '../utils/api';

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState({ title: '', description: '' });
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (!localStorage.getItem('token')) router.push('/login');
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      setTasks(res.data);
    } catch (err) {
      setMessage('Failed to fetch tasks');
    }
  };

  const addTask = async () => {
    try {
      await api.post('/tasks', newTask);
      setNewTask({ title: '', description: '' });
      fetchTasks();
      setMessage('Task added');
    } catch (err) {
      setMessage(err.response?.data?.error || 'Failed to add task');
    }
  };

  // Similar for update/delete
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      fetchTasks();
      setMessage('Task deleted');
    } catch (err) {
      setMessage('Failed to delete task');
    }
  };

  return (
    <div className="p-6">
      <h1>Dashboard</h1>
      <button onClick={() => { localStorage.removeItem('token'); router.push('/login'); }}>Logout</button>
      <div>
        <input placeholder="Title" value={newTask.title} onChange={(e) => setNewTask({ ...newTask, title: e.target.value })} />
        <input placeholder="Description" value={newTask.description} onChange={(e) => setNewTask({ ...newTask, description: e.target.value })} />
        <button onClick={addTask}>Add Task</button>
      </div>
      <ul>
        {tasks.map(task => (
          <li key={task._id}>
            {task.title} - {task.description}
            <button onClick={() => deleteTask(task._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <p>{message}</p>
    </div>
  );
}
