import React, { useState, useEffect, useRef } from 'react';
import { 
  Plus, 
  Trash2, 
  Printer, 
  Settings, 
  FileText, 
  Image as ImageIcon, 
  Type, 
  Hash,
  ChevronDown,
  ChevronUp,
  Upload,
  Eye,
  Edit3
} from 'lucide-react';

const App = () => {
  const [examData, setExamData] = useState({
    title: '1. Klassenarbeit',
    subject: 'Wirtschaftskunde',
    class: 'Klasse 10b',
    date: new Date().toLocaleDateString('de-DE'),
    teacher: 'Max Mustermann',
    logoUrl: '',
    situation: 'Sie arbeiten als Assistent/in der Geschäftsführung bei der "TechSolutions GmbH". Ein Kunde bittet um ein Angebot für eine neue IT-Infrastruktur...',
    tasks: [
      { id: 1, text: 'Nennen Sie vier Bestandteile eines ordnungsgemäßen Kaufvertrags.', points: 4, space: 100 },
      { id: 2, text: 'Erläutern Sie den Unterschied zwischen Besitz und Eigentum anhand eines Beispiels aus der Handlungssituation.', points: 6, space: 150 }
    ]
  });

  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'
  const fileInputRef = useRef(null);

  const totalPoints = examData.tasks.reduce((sum, task) => sum + Number(task.points || 0), 0);

  const updateField = (field, value) => {
    setExamData(prev => ({ ...prev, [field]: value }));
  };

  const addTask = () => {
    const newTask = {
      id: Date.now(),
      text: '',
      points: 0,
      space: 100
    };
    setExamData(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const removeTask = (id) => {
    setExamData(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const updateTask = (id, field, value) => {
    setExamData(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, [field]: value } : t)
    }));
  };

  const moveTask = (index, direction) => {
    const newTasks = [...examData.tasks];
    const targetIndex = index + direction;
    if (targetIndex >= 0 && targetIndex < newTasks.length) {
      [newTasks[index], newTasks[targetIndex]] = [newTasks[targetIndex], newTasks[index]];
      setExamData(prev => ({ ...prev, tasks: newTasks }));
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField('logoUrl', reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Hilfskomponente für die Schreiblinien
  const LinePattern = ({ height }) => (
    <div 
      className="w-full border border-gray-200 bg-white" 
      style={{ 
        height: `${height}px`, 
        backgroundImage: 'linear-gradient(#e5e7eb 1px, transparent 1px)',
        backgroundSize: '100% 25px',
        backgroundPosition: '0 -1px'
      }} 
    />
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans text-slate-900">
      {/* UI Header - Wird beim Drucken ausgeblendet */}
      <header className="bg-white border-b border-slate-200 px-6 py-3 flex justify-between items-center sticky top-0 z-50 print:hidden shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-indigo-600 rounded-lg text-white">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold leading-none">Prüfungs-Editor</h1>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Lehrer-Tool v2.0</p>
          </div>
        </div>
        
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button 
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all text-sm font-medium ${activeTab === 'edit' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            <Edit3 size={16} /> Editor
          </button>
          <button 
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-md transition-all text-sm font-medium ${activeTab === 'preview' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-600 hover:text-indigo-600'}`}
          >
            <Eye size={16} /> Vorschau
          </button>
        </div>

        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-md hover:bg-indigo-700 transition-colors shadow-md active:scale-95"
        >
          <Printer size={18} />
          <span>PDF / Drucken</span>
        </button>
      </header>

      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden print:block">
        {/* Editor Sidebar */}
        <aside className={`w-full lg:w-[450px] bg-white border-r border-slate-200 overflow-y-auto p-6 space-y-8 print:hidden ${activeTab === 'preview' ? 'hidden' : 'block'}`}>
          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Settings size={14} /> Stammdaten
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Titel der Arbeit</label>
                <input type="text" value={examData.title} onChange={(e) => updateField('title', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Fach</label>
                <input type="text" value={examData.subject} onChange={(e) => updateField('subject', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Klasse</label>
                <input type="text" value={examData.class} onChange={(e) => updateField('class', e.target.value)} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
              </div>
              <div className="col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1 flex justify-between">
                  <span>Schullogo</span>
                  <button onClick={() => updateField('logoUrl', '')} className="text-red-500 hover:underline text-[10px]">Entfernen</button>
                </label>
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="mt-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-lg p-4 hover:border-indigo-400 hover:bg-indigo-50 transition-all cursor-pointer group"
                >
                  {examData.logoUrl ? (
                    <img src={examData.logoUrl} className="h-16 object-contain mb-2" alt="Preview" />
                  ) : (
                    <Upload className="text-slate-300 group-hover:text-indigo-400 mb-2" size={24} />
                  )}
                  <span className="text-xs text-slate-500">Logo hochladen (PNG/JPG)</span>
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleLogoUpload} className="hidden" />
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
              <Type size={14} /> Handlungssituation
            </h2>
            <textarea 
              rows="4"
              value={examData.situation}
              onChange={(e) => updateField('situation', e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none text-sm leading-relaxed"
              placeholder="Kontext für die Schüler..."
            />
          </section>

          <section className="pb-10">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Hash size={14} /> Aufgaben
              </h2>
              <span className="bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded text-xs font-bold">Summe: {totalPoints} Pkt.</span>
            </div>
            
            <div className="space-y-4">
              {examData.tasks.map((task, index) => (
                <div key={task.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl relative group hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded uppercase">Aufgabe {index + 1}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveTask(index, -1)} className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200"><ChevronUp size={14}/></button>
                      <button onClick={() => moveTask(index, 1)} className="p-1 hover:bg-white rounded border border-transparent hover:border-slate-200"><ChevronDown size={14}/></button>
                      <button onClick={() => removeTask(task.id)} className="p-1 text-slate-400 hover:text-red-500"><Trash2 size={14}/></button>
                    </div>
                  </div>
                  <textarea 
                    value={task.text}
                    onChange={(e) => updateTask(task.id, 'text', e.target.value)}
                    className="w-full px-2 py-1 border border-slate-200 rounded mb-3 text-sm"
                    placeholder="Fragestellung..."
                    rows="2"
                  />
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Punkte</label>
                      <input type="number" value={task.points} onChange={(e) => updateTask(task.id, 'points', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-sm font-bold" />
                    </div>
                    <div className="flex-1">
                      <label className="block text-[10px] text-slate-500 uppercase font-bold mb-1">Platz (Pixel)</label>
                      <input type="number" step="25" value={task.space} onChange={(e) => updateTask(task.id, 'space', e.target.value)} className="w-full px-2 py-1 border border-slate-200 rounded text-sm" />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addTask} className="w-full py-4 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-indigo-400 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 font-bold text-sm">
                <Plus size={18} /> Aufgabe hinzufügen
              </button>
            </div>
          </section>
        </aside>

        {/* Preview Panel */}
        <section className={`flex-1 overflow-y-auto p-4 md:p-12 bg-slate-200 print:bg-white print:p-0 ${activeTab === 'edit' ? 'hidden lg:block' : 'block'}`}>
          <div className="mx-auto bg-white shadow-2xl min-h-[29.7cm] w-[21cm] p-[2.5cm] print:shadow-none print:w-full print:mx-0 print:min-h-0 relative box-border border border-slate-300 print:border-none">
            
            {/* Kopfzeile */}
            <div className="flex justify-between items-start mb-10 pb-6 border-b-2 border-slate-900">
              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                  <div className="flex flex-col border-b border-slate-900">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Name:</span>
                    <div className="h-6"></div>
                  </div>
                  <div className="flex flex-col border-b border-slate-400">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Datum:</span>
                    <div className="text-sm py-1">{examData.date}</div>
                  </div>
                  <div className="flex flex-col border-b border-slate-400">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Klasse:</span>
                    <div className="text-sm py-1">{examData.class}</div>
                  </div>
                  <div className="flex flex-col border-b border-slate-400">
                    <span className="text-[9px] font-bold text-slate-500 uppercase">Lehrkraft:</span>
                    <div className="text-sm py-1">{examData.teacher}</div>
                  </div>
                </div>
                <div className="pt-4">
                  <h2 className="text-3xl font-black uppercase leading-tight">{examData.title}</h2>
                  <div className="text-xl font-medium text-slate-600 italic">{examData.subject}</div>
                </div>
              </div>
              
              {examData.logoUrl && (
                <div className="ml-8">
                  <img src={examData.logoUrl} alt="Schullogo" className="max-h-24 max-w-40 object-contain" />
                </div>
              )}
            </div>

            {/* Situation */}
            {examData.situation && (
              <div className="mb-10 p-6 bg-slate-50 border border-slate-200 rounded-sm">
                <span className="font-bold block mb-2 text-xs uppercase tracking-widest text-slate-400">Handlungssituation:</span>
                <p className="text-sm leading-relaxed text-slate-800">{examData.situation}</p>
              </div>
            )}

            {/* Aufgaben */}
            <div className="space-y-12">
              {examData.tasks.map((task, index) => (
                <div key={task.id} className="break-inside-avoid">
                  <div className="flex justify-between items-start gap-4 mb-3">
                    <div className="flex-1">
                      <span className="font-bold text-lg mr-2 underline decoration-indigo-600 decoration-2 underline-offset-4">Aufgabe {index + 1}:</span>
                      <span className="text-[15px] font-medium leading-snug">{task.text || "..."}</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="text-[10px] font-bold uppercase text-slate-400 mb-1">Punkte</div>
                      <div className="border-2 border-slate-900 px-3 py-1 font-bold text-sm min-w-[50px] text-center">
                        / {task.points}
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <LinePattern height={task.space} />
                  </div>
                </div>
              ))}
            </div>

            {/* Abschlusszeile */}
            <div className="mt-16 pt-8 border-t-2 border-slate-900 grid grid-cols-2 gap-10">
              <div className="flex flex-col justify-end">
                <span className="text-xs italic text-slate-500">Viel Erfolg beim Bearbeiten der Aufgaben!</span>
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center bg-slate-900 text-white p-3 rounded-sm">
                  <span className="font-bold uppercase text-xs tracking-widest">Gesamtpunktzahl:</span>
                  <div className="font-black text-xl">
                    / {totalPoints}
                  </div>
                </div>
                <div className="flex justify-between items-center border-2 border-slate-900 p-3 rounded-sm">
                  <span className="font-bold uppercase text-xs tracking-widest text-slate-900">Note:</span>
                  <div className="font-black text-xl">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Global CSS for Print and Patterns */}
      <style>{`
        @media print {
          @page {
            margin: 0;
            size: A4;
          }
          body {
            background: white;
            padding: 0;
            margin: 0;
          }
          main {
            display: block !important;
          }
          section {
            padding: 0 !important;
            margin: 0 !important;
          }
          aside, header, .print\\:hidden {
            display: none !important;
          }
          .shadow-2xl {
            shadow: none !important;
          }
          .border {
            border-color: #000 !important;
          }
        }
        
        /* Hide scrollbars for cleaner look */
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: #f1f5f9;
        }
        ::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
      `}</style>
    </div>
  );
};

export default App;