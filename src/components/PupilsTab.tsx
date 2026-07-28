import React, { useState } from 'react';
import { AppData, StudentRecord, InqitaaRecord } from '../types';
import { UserPlus, UserX, Search, Plus, RotateCcw, CheckCircle2, Phone, Calendar, Trash2, School, AlertCircle } from 'lucide-react';

interface PupilsTabProps {
  db: AppData;
  onUpdateDb: (updater: (prev: AppData) => AppData) => void;
}

export const PupilsTab: React.FC<PupilsTabProps> = ({ db, onUpdateDb }) => {
  const [activeSubTab, setActiveSubTab] = useState<'registrations' | 'inqitaat'>('registrations');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals inside Pupils Tab
  const [isAddStudentOpen, setIsAddStudentOpen] = useState(false);
  const [isAddInqitaaOpen, setIsAddInqitaaOpen] = useState(false);

  // Form states for New Student Registration
  const [stNom, setStNom] = useState('');
  const [stSexe, setStSexe] = useState<'F' | 'M'>('M');
  const [stGroupeId, setStGroupeId] = useState<number>(db.groupes[0]?.id || 1);
  const [stParentTel, setStParentTel] = useState('');
  const [stNotes, setStNotes] = useState('');

  // Form states for Dropout Registration
  const [inqNom, setInqNom] = useState('');
  const [inqSexe, setInqSexe] = useState<'F' | 'M'>('M');
  const [inqGroupeId, setInqGroupeId] = useState<number>(db.groupes[0]?.id || 1);
  const [inqCause, setInqCause] = useState('صعوبات تعلم وجغرافيا');
  const [inqNotes, setInqNotes] = useState('');

  const studentsList = db.students || [];
  const inqitaatList = db.inqitaat || [];

  const handleRegisterNewStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!stNom.trim()) return alert('الرجاء إدخال اسم التلميذ');

    const grp = db.groupes.find((g) => g.id === stGroupeId);
    if (!grp) return alert('الرجاء اختيار الفوج والمدرسة أولاً');

    const newId = (db.nextId?.st || 1) + 1;
    const newStudent: StudentRecord = {
      id: newId,
      nom: stNom.trim(),
      sexe: stSexe,
      groupeId: stGroupeId,
      ecoleNom: grp.ecole,
      dateInscription: new Date().toISOString().split('T')[0],
      parentTel: stParentTel.trim(),
      status: 'actif',
      notes: stNotes.trim(),
    };

    onUpdateDb((prev) => {
      // Automatically increment group effectif and gender count
      const updatedGroupes = prev.groupes.map((g) => {
        if (g.id === stGroupeId) {
          return {
            ...g,
            eff: g.eff + 1,
            filles: stSexe === 'F' ? g.filles + 1 : g.filles,
            garcons: stSexe === 'M' ? g.garcons + 1 : g.garcons,
          };
        }
        return g;
      });

      return {
        ...prev,
        groupes: updatedGroupes,
        students: [newStudent, ...(prev.students || [])],
        nextId: { ...prev.nextId, st: newId + 1 },
      };
    });

    alert('✅ تم تسجيل التلميذ الجديد بنجاح وتحديث بنيان الفوج!');
    setStNom('');
    setStParentTel('');
    setStNotes('');
    setIsAddStudentOpen(false);
  };

  const handleRegisterInqitaa = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inqNom.trim()) return alert('الرجاء إدخال اسم التلميذ المنقطع');

    const grp = db.groupes.find((g) => g.id === inqGroupeId);
    if (!grp) return alert('الرجاء اختيار الفوج والمدرسة');

    const newId = (db.nextId?.inq || 1) + 1;
    const newInqitaa: InqitaaRecord = {
      id: newId,
      studentNom: inqNom.trim(),
      sexe: inqSexe,
      groupeId: inqGroupeId,
      ecoleNom: grp.ecole,
      dateInqitaa: new Date().toISOString().split('T')[0],
      cause: inqCause.trim(),
      status: 'monqatia',
      notes: inqNotes.trim(),
    };

    onUpdateDb((prev) => ({
      ...prev,
      inqitaat: [newInqitaa, ...(prev.inqitaat || [])],
      nextId: { ...prev.nextId, inq: newId + 1 },
    }));

    alert('✅ تم تسجيل حالة الانقطاع بنجاح لمتابعة إرجاعه مقاعد الدراسة!');
    setInqNom('');
    setInqNotes('');
    setIsAddInqitaaOpen(false);
  };

  const handleToggleIrjaa = (inqId: number) => {
    onUpdateDb((prev) => ({
      ...prev,
      inqitaat: (prev.inqitaat || []).map((item) => {
        if (item.id === inqId) {
          const nextStatus = item.status === 'monqatia' ? 'irjaa' : 'monqatia';
          return {
            ...item,
            status: nextStatus,
            dateIrjaa: nextStatus === 'irjaa' ? new Date().toISOString().split('T')[0] : undefined,
          };
        }
        return item;
      }),
    }));
  };

  const handleDeleteStudent = (id: number) => {
    if (confirm('هل أنت تأكد من حذف تسجيل هذا التلميذ؟')) {
      onUpdateDb((prev) => ({
        ...prev,
        students: (prev.students || []).filter((s) => s.id !== id),
      }));
    }
  };

  const handleDeleteInqitaa = (id: number) => {
    if (confirm('هل أنت تأكد من حذف هذا السجل؟')) {
      onUpdateDb((prev) => ({
        ...prev,
        inqitaat: (prev.inqitaat || []).filter((i) => i.id !== id),
      }));
    }
  };

  // Metrics
  const activeDropoutsCount = inqitaatList.filter((i) => i.status === 'monqatia').length;
  const returnedCount = inqitaatList.filter((i) => i.status === 'irjaa').length;

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto pb-20">
      {/* Title */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-extrabold text-slate-800 flex items-center gap-1.5">
            <UserPlus className="w-5 h-5 text-indigo-600" />
            <span>تسجيل التلاميذ وتتبع الانقطاع والإرجاع</span>
          </h2>
          <p className="text-xs text-slate-500 font-medium">تسجيل الجدد، تتبع حالات الهدر والانقطاع المدرسي</p>
        </div>

        <div className="flex items-center gap-1.5">
          {activeSubTab === 'registrations' ? (
            <button
              onClick={() => setIsAddStudentOpen(true)}
              className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>تلميذ جديد</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAddInqitaaOpen(true)}
              className="bg-amber-600 hover:bg-amber-700 active:scale-95 text-white font-bold px-3 py-2 rounded-xl text-xs shadow-md transition flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>حالة انقطاع</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-gradient-to-br from-indigo-500 to-blue-600 text-white rounded-2xl p-3 shadow-sm">
          <span className="text-xl font-black block leading-none">{studentsList.length}</span>
          <span className="text-[10px] text-indigo-100 font-bold mt-1 block">تلاميذ مسجلون جدد</span>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-3 shadow-sm">
          <span className="text-xl font-black block leading-none">{activeDropoutsCount}</span>
          <span className="text-[10px] text-amber-100 font-bold mt-1 block">حالات انقطاع قائمة</span>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-3 shadow-sm">
          <span className="text-xl font-black block leading-none">{returnedCount}</span>
          <span className="text-[10px] text-emerald-100 font-bold mt-1 block">تلاميذ تم إرجاعهم</span>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl gap-1">
        <button
          onClick={() => setActiveSubTab('registrations')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'registrations'
              ? 'bg-white text-indigo-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserPlus className="w-4 h-4" />
          <span>سجل التسجيلات الجديدة ({studentsList.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('inqitaat')}
          className={`flex-1 py-2 text-xs font-bold rounded-xl transition cursor-pointer flex items-center justify-center gap-1.5 ${
            activeSubTab === 'inqitaat'
              ? 'bg-white text-amber-700 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <UserX className="w-4 h-4" />
          <span>تتبع حالات الانقطاع ({inqitaatList.length})</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3 top-2.5" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="بحث باسم التلميذ أو المدرسة..."
          className="w-full bg-white border border-slate-200 rounded-xl pr-9 pl-3 py-2 text-xs font-medium focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* ================= VIEW 1: REGISTRATIONS LIST ================= */}
      {activeSubTab === 'registrations' && (
        <div className="space-y-3">
          {studentsList.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3 shadow-sm">
              <UserPlus className="w-12 h-12 text-indigo-300 mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">لم يتم تسجيل تلاميذ جدد بعد</h3>
                <p className="text-xs text-slate-500 mt-1">
                  يمكنك تسجيل التلميذ الجديد مباشرة وإلحاقه بأحد الأفواج والمؤسسات.
                </p>
              </div>
              <button
                onClick={() => setIsAddStudentOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>تسجيل أول تلميذ جديد</span>
              </button>
            </div>
          ) : (
            studentsList
              .filter(
                (s) =>
                  s.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  s.ecoleNom.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((s) => {
                const grp = db.groupes.find((g) => g.id === s.groupeId);
                return (
                  <div
                    key={s.id}
                    className="bg-white border border-slate-200 rounded-2xl p-3.5 shadow-sm space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">{s.nom}</span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            s.sexe === 'F' ? 'bg-pink-100 text-pink-700' : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {s.sexe === 'F' ? 'أنثى' : 'ذكر'}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {s.dateInscription}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      المدرسة: {s.ecoleNom} · الفوج: {grp?.groupe || '—'}
                      {s.parentTel && ` · هاتف الولي: ${s.parentTel}`}
                    </p>

                    {s.notes && (
                      <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg italic">
                        {s.notes}
                      </p>
                    )}

                    <div className="flex justify-end border-t border-slate-100 pt-1.5">
                      <button
                        onClick={() => handleDeleteStudent(s.id)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>حذف</span>
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* ================= VIEW 2: DROP-OUTS LIST ================= */}
      {activeSubTab === 'inqitaat' && (
        <div className="space-y-3">
          {inqitaatList.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3 shadow-sm">
              <UserX className="w-12 h-12 text-amber-300 mx-auto" />
              <div>
                <h3 className="text-sm font-bold text-slate-800">لا توجد حالات انقطاع مسجلة</h3>
                <p className="text-xs text-slate-500 mt-1">
                  يمكنك تسجيل حالات الانقطاع ومتابعة جهود إعادة إدماجهم بالمدارس.
                </p>
              </div>
              <button
                onClick={() => setIsAddInqitaaOpen(true)}
                className="bg-amber-600 hover:bg-amber-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow transition inline-flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>تسجيل حالة انقطاع</span>
              </button>
            </div>
          ) : (
            inqitaatList
              .filter(
                (i) =>
                  i.studentNom.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  i.ecoleNom.toLowerCase().includes(searchTerm.toLowerCase())
              )
              .map((i) => {
                const grp = db.groupes.find((g) => g.id === i.groupeId);
                const isReturned = i.status === 'irjaa';

                return (
                  <div
                    key={i.id}
                    className={`bg-white border rounded-2xl p-3.5 shadow-sm space-y-2 ${
                      isReturned ? 'border-emerald-200 bg-emerald-50/30' : 'border-amber-200 bg-amber-50/20'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-slate-800">{i.studentNom}</span>
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                            isReturned
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-amber-100 text-amber-800 border border-amber-300'
                          }`}
                        >
                          {isReturned ? 'تمت العودة للمدرسة ✅' : 'منقطع عن الدراسة ⚠️'}
                        </span>
                      </div>

                      <span className="text-[10px] text-slate-400 font-medium">{i.dateInqitaa}</span>
                    </div>

                    <p className="text-[11px] text-slate-600 font-medium">
                      المدرسة: {i.ecoleNom} · الفوج: {grp?.groupe || '—'} · السبب: {i.cause}
                    </p>

                    <div className="flex items-center justify-between border-t border-slate-100 pt-2">
                      <button
                        onClick={() => handleToggleIrjaa(i.id)}
                        className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition flex items-center gap-1.5 cursor-pointer ${
                          isReturned
                            ? 'bg-amber-50 text-amber-700 border-amber-300'
                            : 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700 shadow-sm'
                        }`}
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>{isReturned ? 'إلغاء وضعية الإرجاع' : 'تسجيل إرجاع التلميذ للمدرسة'}</span>
                      </button>

                      <button
                        onClick={() => handleDeleteInqitaa(i.id)}
                        className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer"
                      >
                        حذف
                      </button>
                    </div>
                  </div>
                );
              })
          )}
        </div>
      )}

      {/* ================= MODAL: ADD NEW STUDENT ================= */}
      {isAddStudentOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-800 border-b pb-2 flex items-center gap-1.5">
              <UserPlus className="w-4 h-4 text-indigo-600" />
              <span>تسجيل تلميذ جديد في الفوج</span>
            </h3>

            <form onSubmit={handleRegisterNewStudent} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم التلميذ الكامل *</label>
                <input
                  type="text"
                  required
                  value={stNom}
                  onChange={(e) => setStNom(e.target.value)}
                  placeholder="مثال: يوسف العبدلاوي"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">النوع *</label>
                  <select
                    value={stSexe}
                    onChange={(e) => setStSexe(e.target.value as 'F' | 'M')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                  >
                    <option value="M">ذكر</option>
                    <option value="F">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">المدرسة والفوج *</label>
                  <select
                    value={stGroupeId}
                    onChange={(e) => setStGroupeId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                  >
                    {db.groupes.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.ecole} — {g.groupe}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">هاتف الولي (اختياري)</label>
                <input
                  type="tel"
                  value={stParentTel}
                  onChange={(e) => setStParentTel(e.target.value)}
                  placeholder="06XXXXXXXX"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">ملاحظات إضافية</label>
                <textarea
                  value={stNotes}
                  onChange={(e) => setStNotes(e.target.value)}
                  placeholder="مستوى التحصيل، ملاحظات أولية..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl shadow cursor-pointer"
                >
                  حفظ وتسجيل
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddStudentOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= MODAL: ADD DROPOUT ================= */}
      {isAddInqitaaOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-sm w-full p-4 space-y-3 border border-slate-200 shadow-2xl">
            <h3 className="text-sm font-extrabold text-slate-800 border-b pb-2 flex items-center gap-1.5">
              <UserX className="w-4 h-4 text-amber-600" />
              <span>تسجيل حالة انقطاع عن الدراسة</span>
            </h3>

            <form onSubmit={handleRegisterInqitaa} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-bold mb-1">اسم التلميذ المنقطع *</label>
                <input
                  type="text"
                  required
                  value={inqNom}
                  onChange={(e) => setInqNom(e.target.value)}
                  placeholder="مثال: فاطمة الزهراء البقالي"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">النوع *</label>
                  <select
                    value={inqSexe}
                    onChange={(e) => setInqSexe(e.target.value as 'F' | 'M')}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                  >
                    <option value="M">ذكر</option>
                    <option value="F">أنثى</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">الفوج والمؤسسة *</label>
                  <select
                    value={inqGroupeId}
                    onChange={(e) => setInqGroupeId(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                  >
                    {db.groupes.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.ecole} — {g.groupe}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">سبب الانقطاع *</label>
                <select
                  value={inqCause}
                  onChange={(e) => setInqCause(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-bold text-slate-800"
                >
                  <option value="بعد المسافة وصعوبة المسالك">بعد المسافة وصعوبة المسالك</option>
                  <option value="ظروف عائلية أو اجتماعية">ظروف عائلية أو اجتماعية</option>
                  <option value="صعوبات في التعلم والتحصيل">صعوبات في التعلم والتحصيل</option>
                  <option value="انتقال السكن">انتقال السكن</option>
                  <option value="أسباب أخرى">أسباب أخرى</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">إجراءات المواكبة المزمعة</label>
                <textarea
                  value={inqNotes}
                  onChange={(e) => setInqNotes(e.target.value)}
                  placeholder="زيارة منزلية، تواصل مع الولي..."
                  rows={2}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 font-medium"
                />
              </div>

              <div className="flex gap-2 pt-2 border-t">
                <button
                  type="submit"
                  className="flex-1 bg-amber-600 hover:bg-amber-700 text-white font-bold py-2.5 rounded-xl shadow cursor-pointer"
                >
                  حفظ وتسجيل الانقطاع
                </button>
                <button
                  type="button"
                  onClick={() => setIsAddInqitaaOpen(false)}
                  className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
