import React, { useState } from 'react';
import { AppData, Ecole } from '../types';
import { Search, Plus, Edit2, Trash2, Building2, Users, Layers, AlertCircle } from 'lucide-react';

interface EcolesTabProps {
  db: AppData;
  onUpdateDb: (updater: (prev: AppData) => AppData) => void;
  onOpenAddEcoleModal: () => void;
  onOpenEditEcoleModal: (ecoleId: number) => void;
  onOpenAddGroupeToEcoleModal: (ecoleNom: string) => void;
  onOpenEditGroupeModal: (groupeId: number) => void;
}

export const EcolesTab: React.FC<EcolesTabProps> = ({
  db,
  onUpdateDb,
  onOpenAddEcoleModal,
  onOpenEditEcoleModal,
  onOpenAddGroupeToEcoleModal,
  onOpenEditGroupeModal,
}) => {
  const [search, setSearch] = useState('');

  const filtered = db.ecoles.filter(
    (e) =>
      !search ||
      e.nom.toLowerCase().includes(search.toLowerCase()) ||
      e.commune.toLowerCase().includes(search.toLowerCase())
  );

  const handleDeleteEcole = (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذه المدرسة؟')) return;
    onUpdateDb((prev) => ({
      ...prev,
      ecoles: prev.ecoles.filter((e) => e.id !== id),
    }));
  };

  return (
    <div className="p-4 space-y-4 max-w-2xl mx-auto pb-24">
      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="بحث باسم المدرسة أو الجماعة..."
          className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
        />
      </div>

      {/* School List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
          <Building2 className="w-12 h-12 text-emerald-300 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">لا توجد مدارس مسجلة حتى الآن</h3>
            <p className="text-xs text-slate-500 mt-1">أضف المدارس التي يشتغل بها أساتذتك لإدماج أفواج التلاميذ والزيارات.</p>
          </div>
          <button
            onClick={onOpenAddEcoleModal}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة مدرسة جديدة الآن</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((e) => {
            const gs = db.groupes.filter((g) => g.ecole === e.nom);
            const totalEff = gs.reduce((s, g) => s + g.eff, 0);

            return (
              <div
                key={e.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 hover:border-blue-200 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-800">{e.nom}</h3>
                    <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                      جماعة {e.commune} · إقليم {e.province}
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditEcoleModal(e.id)}
                      className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition cursor-pointer"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteEcole(e.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Summary badges */}
                <div className="flex items-center gap-3 text-xs font-semibold text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span>{gs.length} أفواج</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{totalEff} تلميذ</span>
                  </div>
                </div>

                {/* Groups Details */}
                {gs.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    {gs.map((g) => {
                      const anim = db.animateurs.find((a) => a.id === g.animId);
                      return (
                        <div
                          key={g.id}
                          className="flex items-center justify-between bg-slate-50/80 border border-slate-100 rounded-xl px-3 py-2 text-xs"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-extrabold text-blue-800 bg-blue-100 px-2 py-0.5 rounded-md text-[11px]">
                              {g.groupe}
                            </span>
                            <div>
                              <div className="font-bold text-slate-800 text-[11px]">
                                {g.niveauReel || g.niveau}
                              </div>
                              <div className="text-[10px] text-slate-500">
                                الأستاذ: {anim ? anim.nom.split(' ')[0] : '—'}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-bold text-slate-600">
                              👥 {g.eff}
                            </span>
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                g.absences > 3
                                  ? 'bg-rose-100 text-rose-800'
                                  : g.absences > 0
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              🔴 {g.absences}
                            </span>

                            <button
                              onClick={() => onOpenEditGroupeModal(g.id)}
                              className="text-[10px] font-bold text-slate-600 hover:text-blue-600 bg-white border border-slate-200 px-2 py-1 rounded-lg transition cursor-pointer"
                            >
                              ✏️
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {e.notes && (
                  <p className="text-xs text-slate-600 bg-amber-50/80 border border-amber-200 p-2 rounded-xl">
                    {e.notes}
                  </p>
                )}

                <button
                  onClick={() => onOpenAddGroupeToEcoleModal(e.nom)}
                  className="w-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold py-2 px-3 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة فوج لهذه المدرسة</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Add School Button */}
      <button
        onClick={onOpenAddEcoleModal}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>إضافة مدرسة جديدة</span>
      </button>
    </div>
  );
};
