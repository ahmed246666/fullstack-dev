'use client';

import React, { useState, useEffect } from 'react';
import { CheckSquare, Square, Plus, Trash2, Clock, AlertCircle, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { useAgent } from '@/context/AgentContext';

interface AgentTask {
  id: string;
  text: string;
  completed: boolean;
  dueDate?: string;
  priority: 'HIGH' | 'NORMAL';
}

export function AgentTasksWidget() {
  const { lang } = useLanguage();
  const { currentAgent } = useAgent();
  const [tasks, setTasks] = useState<AgentTask[]>([]);
  const [newTaskText, setNewTaskText] = useState('');
  const [priority, setPriority] = useState<'HIGH' | 'NORMAL'>('NORMAL');
  const [isAdding, setIsAdding] = useState(false);

  const storageKey = `azm_agent_tasks_${currentAgent.id}`;

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        setTasks(JSON.parse(saved));
      } else {
        // Default initial reminder tasks
        const initial: AgentTask[] = [
          {
            id: '1',
            text:
              lang === 'ar'
                ? 'متابعة تذكرة الدفع الإلكتروني مع سداد'
                : 'Follow up with SADAD gateway ticket',
            completed: false,
            priority: 'HIGH'
          },
          {
            id: '2',
            text:
              lang === 'ar'
                ? 'تحديث مقال دليل إعداد واجهة البرمجة (API Guide)'
                : 'Update API integration guide in Knowledge Base',
            completed: true,
            priority: 'NORMAL'
          }
        ];
        setTasks(initial);
        localStorage.setItem(storageKey, JSON.stringify(initial));
      }
    } catch {
      // ignore
    }
  }, [currentAgent.id, lang, storageKey]);


  const saveTasks = (newTasks: AgentTask[]) => {
    setTasks(newTasks);
    try {
      localStorage.setItem(storageKey, JSON.stringify(newTasks));
    } catch {
      // ignore
    }
  };

  const toggleTask = (id: string) => {
    const updated = tasks.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t));
    saveTasks(updated);
  };

  const deleteTask = (id: string) => {
    const updated = tasks.filter((t) => t.id !== id);
    saveTasks(updated);
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    const newTask: AgentTask = {
      id: `${Date.now()}`,
      text: newTaskText.trim(),
      completed: false,
      priority
    };

    saveTasks([newTask, ...tasks]);
    setNewTaskText('');
    setIsAdding(false);
  };

  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="p-4 rounded-3xl glass-panel bg-navy-900/80 border border-gold-500/20 shadow-xl space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-gold-500/10 border border-gold-500/30 flex items-center justify-center text-gold-400">
            <CheckSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold text-white font-brand">
              {lang === 'ar' ? 'مهام وتذكيرات الموظف' : 'Agent Tasks & Action Items'}
            </h3>
            <span className="text-[10px] text-slate-400">
              {completedCount}/{tasks.length} {lang === 'ar' ? 'مكتمل' : 'completed'}
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-gold-500/10 hover:bg-gold-500/20 border border-gold-500/30 text-[11px] font-semibold text-gold-300 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مهمة جديدة' : 'Add Task'}</span>
        </button>
      </div>

      {/* Task Add Form */}
      {isAdding && (
        <form onSubmit={handleAddTask} className="p-3 rounded-2xl bg-navy-950/80 border border-navy-800 space-y-2">
          <input
            type="text"
            required
            placeholder={
              lang === 'ar' ? 'اكتب تفاصيل التذكير أو المهمة...' : 'Enter task or reminder note...'
            }
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            className="w-full px-3 py-1.5 rounded-xl bg-navy-900 border border-navy-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-gold-500"
          />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <label className="text-[10.5px] text-slate-400">
                {lang === 'ar' ? 'الأولوية:' : 'Priority:'}
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="bg-navy-900 border border-navy-700 rounded-lg px-2 py-0.5 text-[11px] text-slate-200"
              >
                <option value="NORMAL">{lang === 'ar' ? 'عادية' : 'Normal'}</option>
                <option value="HIGH">{lang === 'ar' ? 'عاجلة' : 'High'}</option>
              </select>
            </div>
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-2 py-1 rounded-lg text-[10.5px] text-slate-400 hover:text-white"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-3 py-1 rounded-lg bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-[10.5px]"
              >
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Task List */}
      <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-2 rounded-xl border text-xs transition-all ${
              task.completed
                ? 'bg-navy-950/40 border-navy-850 opacity-60 line-through text-slate-400'
                : 'bg-navy-950/70 border-navy-800 text-slate-200 hover:border-gold-500/30'
            }`}
          >
            <div
              onClick={() => toggleTask(task.id)}
              className="flex items-center gap-2.5 cursor-pointer flex-1 min-w-0"
            >
              {task.completed ? (
                <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : (
                <Square className="w-4 h-4 text-slate-500 hover:text-gold-400 shrink-0" />
              )}
              <span className="truncate text-[11.5px]">{task.text}</span>
            </div>

            <div className="flex items-center gap-2 shrink-0 ml-2 rtl:mr-2 rtl:ml-0">
              {task.priority === 'HIGH' && (
                <span className="px-1.5 py-0.5 rounded bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9.5px] font-bold">
                  {lang === 'ar' ? 'عاجل' : 'High'}
                </span>
              )}
              <button
                onClick={() => deleteTask(task.id)}
                className="text-slate-500 hover:text-rose-400 p-1 transition-colors"
                title="Delete task"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}

        {tasks.length === 0 && (
          <div className="py-4 text-center text-xs text-slate-500">
            {lang === 'ar' ? 'لا توجد مهام حالياً' : 'No tasks or reminders logged'}
          </div>
        )}
      </div>
    </div>
  );
}
