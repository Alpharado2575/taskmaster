import { useEffect, useState } from "react";
import axios from "axios";

export default function Dashboard({ setToken }) {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [filter, setFilter] = useState("all");
  const [userStats, setUserStats] = useState({ total: 0, completed: 0, pending: 0 });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const api = axios.create({
    baseURL: "http://localhost:5000/api/tasks",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
  });

  const loadTasks = async () => {
    try {
      setIsLoading(true);
      const res = await api.get("/");
      setTasks(res.data);
      
      const total = res.data.length;
      const completed = res.data.filter(task => task.completed).length;
      const pending = total - completed;
      
      setUserStats({ total, completed, pending });
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const addTask = async () => {
    if (!title.trim()) return;
    
    try {
      await api.post("/", { title, completed: false });
      setTitle("");
      loadTasks();
    } catch (error) {
      console.error("Failed to add task:", error);
    }
  };

  // OPSI 1: Delete langsung dengan konfirmasi modal
  const deleteTask = async (id) => {
    try {
      await api.delete("/" + id);
      
      // Animasi delete
      const taskElement = document.getElementById(`task-${id}`);
      if (taskElement) {
        taskElement.classList.add("animate-delete");
        setTimeout(() => {
          loadTasks();
          setDeleteConfirmId(null);
        }, 300);
      } else {
        loadTasks();
      }
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  // OPSI 2: Batch delete multiple tasks
  const [selectedTasks, setSelectedTasks] = useState([]);
  
  const toggleTaskSelection = (id) => {
    setSelectedTasks(prev =>
      prev.includes(id)
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
  };

  const deleteSelectedTasks = async () => {
    if (selectedTasks.length === 0) return;
    
    try {
      // Kirim multiple delete requests
      await Promise.all(
        selectedTasks.map(id => api.delete("/" + id))
      );
      
      // Animate all selected tasks
      selectedTasks.forEach(id => {
        const taskElement = document.getElementById(`task-${id}`);
        if (taskElement) {
          taskElement.classList.add("animate-delete");
        }
      });
      
      setTimeout(() => {
        loadTasks();
        setSelectedTasks([]);
      }, 300);
    } catch (error) {
      console.error("Failed to delete tasks:", error);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await api.put("/" + id, { completed: !completed });
      loadTasks();
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const startEdit = (task) => {
    setEditingId(task._id);
    setEditText(task.title);
  };

  const saveEdit = async (id) => {
    try {
      await api.put("/" + id, { title: editText });
      setEditingId(null);
      loadTasks();
    } catch (error) {
      console.error("Failed to edit task:", error);
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === "completed") return task.completed;
    if (filter === "pending") return !task.completed;
    return true;
  });

  useEffect(() => {
    loadTasks();
  }, []);

  return (
    <div className="min-h-dvh bg-gradient-to-br from-gray-50 via-gray-50/50 to-gray-100 p-4 md:p-8">
      {/* Background elements */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -top-40 -left-40 size-80 bg-gradient-to-br from-blue-100/20 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 size-80 bg-gradient-to-tr from-red-100/20 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 p-8 text-white shadow-2xl shadow-blue-500/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold tracking-tight">TaskMaster</h1>
              </div>
              <p className="text-blue-100/90">Manage your tasks efficiently</p>
            </div>
            
            <div className="flex items-center gap-4">
              {selectedTasks.length > 0 && (
                <button
                  onClick={deleteSelectedTasks}
                  className="group flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 rounded-xl border border-white/20 transition-all duration-200 shadow-lg shadow-red-500/20"
                >
                  <span className="font-semibold">
                    Hapus ({selectedTasks.length})
                  </span>
                </button>
              )}
              
              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  setToken(null);
                }}
                className="group flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm hover:bg-white/20 rounded-xl border border-white/20 transition-all duration-200"
              >
                <span className="font-semibold">Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Add Task Section */}
        <div className="mb-8 bg-white/90 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/40">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 i-heroicons-plus-circle-20-solid size-5 text-gray-400" />
              <input
                className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-3 focus:ring-blue-500/20 outline-none transition-all duration-200 hover:border-gray-300 placeholder:text-gray-400"
                placeholder="Apa yang perlu dikerjakan?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addTask()}
              />
            </div>
            <button
              onClick={addTask}
              className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-200"
            >
              <span>Tambah Task</span>
            </button>
          </div>
        </div>

        {/* Tasks List */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-lg border border-white/40 overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center">
              <span className="i-heroicons-arrow-path-20-solid size-12 text-gray-400 animate-spin mx-auto block mb-4" />
              <p className="text-gray-500 font-medium">Loading tasks...</p>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="p-12 text-center">
              <span className="i-heroicons-inbox-20-solid size-16 text-gray-300 mx-auto block mb-4" />
              <p className="text-gray-500 font-medium text-lg">
                {filter === "all" ? "Tidak ada task. Tambah task baru! 📝" :
                 filter === "completed" ? "Belum ada task yang selesai" :
                 "Semua task sudah selesai! 🎉"}
              </p>
            </div>
          ) : (
            <>
              <ul className="divide-y divide-gray-100">
                {filteredTasks.map((task) => (
                  <li
                    id={`task-${task._id}`}
                    key={task._id}
                    className="group hover:bg-gray-50/80 transition-all duration-200"
                  >
                    <div className="p-6">
                      <div className="flex items-center gap-4">
                        {/* Selection Checkbox */}
                        <button
                          onClick={() => toggleTaskSelection(task._id)}
                          className={`flex-shrink-0 size-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${selectedTasks.includes(task._id) ? 'bg-blue-500 border-blue-500' : 'border-gray-300 hover:border-blue-400'}`}
                        >
                          {selectedTasks.includes(task._id) && (
                            <span className="i-heroicons-check-20-solid size-3 text-white" />
                          )}
                        </button>

                        {/* Complete Checkbox */}
                        <button
                          onClick={() => toggleComplete(task._id, task.completed)}
                          className={`flex-shrink-0 size-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${task.completed ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-blue-500'}`}
                        >
                          {task.completed && (
                            <span className="i-heroicons-check-20-solid size-4 text-white" />
                          )}
                        </button>

                        {/* Task Content */}
                        <div className="flex-1 min-w-0">
                          {editingId === task._id ? (
                            <div className="flex items-center gap-3">
                              <input
                                className="flex-1 px-3 py-2 border-b-2 border-blue-500 focus:outline-none bg-transparent"
                                value={editText}
                                onChange={(e) => setEditText(e.target.value)}
                                autoFocus
                                onKeyPress={(e) => e.key === 'Enter' && saveEdit(task._id)}
                              />
                              <button
                                onClick={() => saveEdit(task._id)}
                                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                              >
                                Simpan
                              </button>
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                              >
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div>
                              <p className={`font-medium text-lg ${task.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
                                {task.title}
                              </p>
                              <p className="text-sm text-gray-500 mt-1">
                                Dibuat: {new Date(task.createdAt || Date.now()).toLocaleDateString('id-ID')}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {/* OPSI 1: Tombol Delete dengan Konfirmasi Modal */}
                          {deleteConfirmId === task._id ? (
                            <div className="flex items-center gap-2 animate-fade-in">
                              <p className="text-sm text-red-600 font-medium">Yakin?</p>
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 transition-colors flex items-center gap-1"
                              >
                                <span className="i-heroicons-check-20-solid size-3" />
                                Ya
                              </button>
                              <button
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-3 py-1.5 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-1"
                              >
                                <span className="i-heroicons-x-mark-20-solid size-3" />
                                Batal
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              {/* Edit Button */}
                              <button
                                onClick={() => startEdit(task)}
                                className="p-2.5 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-xl transition-all duration-200 group/tooltip relative"
                                title="Edit task"
                              >
                                <span className="i-heroicons-pencil-20-solid size-5" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                                  Edit
                                </span>
                              </button>

                              {/* OPSI 2: Tombol Delete dengan Hover Effect */}
                              <button
                                onClick={() => setDeleteConfirmId(task._id)}
                                className="p-2.5 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-200 group/tooltip relative"
                                title="Hapus task"
                              >
                                <span className="i-heroicons-trash-20-solid size-5" />
                                <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover/tooltip:opacity-100 transition-opacity whitespace-nowrap">
                                  Hapus
                                </span>
                              </button>

                              {/* OPSI 3: Tombol Delete dengan Icon yang Berubah */}
                              <button
                                onClick={() => deleteTask(task._id)}
                                className="p-2.5 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200 group/delete relative"
                                title="Hapus task langsung"
                              >
                                <span className="i-heroicons-trash-20-solid size-5 group-hover/delete:hidden" />
                                <span className="i-heroicons-trash-20-solid size-5 text-red-600 hidden group-hover/delete:block" />
                              </button>

                              {/* OPSI 4: Floating Action Button untuk Mobile */}
                              <div className="md:hidden">
                                <button
                                  onClick={() => deleteTask(task._id)}
                                  className="p-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
                                >
                                  <span className="i-heroicons-trash-20-solid size-4" />
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Bulk Actions Footer */}
              {selectedTasks.length > 0 && (
                <div className="sticky bottom-0 bg-gradient-to-r from-red-50 to-orange-50 border-t border-red-200 p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="i-heroicons-exclamation-triangle-20-solid size-5 text-red-500" />
                    <span className="font-medium text-red-700">
                      {selectedTasks.length} task terpilih
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelectedTasks([])}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Batal pilih
                    </button>
                    <button
                      onClick={deleteSelectedTasks}
                      className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-semibold rounded-lg shadow-lg shadow-red-500/20 transition-all duration-200"
                    >
                      Hapus yang dipilih
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Task</p>
                <p className="text-2xl font-bold text-gray-800 mt-1">{userStats.total}</p>
              </div>
              <span className="i-heroicons-document-text-20-solid size-10 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-green-600 mt-1">{userStats.completed}</p>
              </div>
              <span className="i-heroicons-check-circle-20-solid size-10 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white/80 backdrop-blur-lg rounded-2xl p-6 shadow-lg border border-white/40">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">{userStats.pending}</p>
              </div>
              <span className="i-heroicons-clock-20-solid size-10 text-orange-500" />
            </div>
          </div>
        </div>
      </div>

      {/* Floating Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="size-16 bg-gradient-to-r from-red-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="i-heroicons-exclamation-triangle-20-solid size-8 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Task?</h3>
              <p className="text-gray-600">
                Task akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-3 bg-gray-100 text-gray-700 font-semibold rounded-xl hover:bg-gray-200 transition-colors"
              >
                Batal
              </button>
              <button
                onClick={() => deleteTask(deleteConfirmId)}
                className="flex-1 py-3 bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <span className="i-heroicons-trash-20-solid size-5" />
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}