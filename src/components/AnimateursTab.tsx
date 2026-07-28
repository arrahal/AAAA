import React, { useState } from 'react';
import { AppData, Animateur, Groupe } from '../types';
import { ZONES, CRITERIA } from '../data/initialData';
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  Layers,
  FileText,
  Phone,
  Building2,
  Users,
  GraduationCap,
} from 'lucide-react';

interface AnimateursTabProps {
  db: AppData;
  onUpdateDb: (updater: (prev: AppData) => AppData) => void;
  onOpenVisitModal: (animId: number) => void;
  onOpenEvalModal: (animId: number) => void;
  onOpenNotesModal: (animId: number) => void;
  onOpenGroupsModal: (animId: number) => void;
  onOpenEditAnimModal: (animId: number) => void;
  onOpenAddAnimModal: () => void;
}

export const AnimateursTab: React.FC<AnimateursTabProps> = ({
  db,
  onUpdateDb,
  onOpenVisitModal,
  onOpenEvalModal,
  onOpenNotesModal,
  onOpenGroupsModal,
  onOpenEditAnimModal,
  onOpenAddAnimModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');

  const filtered = db.animateurs.filter((a) => {
    const matchesQuery =
      !search ||
      a.nom.toLowerCase().includes(search.toLowerCase()) ||
      a.zone.toLowerCase().includes(search.toLowerCase());
    const matchesZone = selectedZone === 'all' || a.zone === selectedZone;
    return matchesQuery && matchesZone;
  });

  const handleDelete = (id: number) => {
    if (!window.confirm('هل أنت متأكد من حذف هذا الأستاذ؟')) return;
    onUpdateDb((prev) => ({
      ...prev,
      animateurs: prev.animateurs.filter((a) => a.id !== id),
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
          placeholder="بحث باسم الأستاذ أو المنطقة..."
          className="w-full bg-white border border-slate-200 rounded-xl pr-10 pl-4 py-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 font-medium"
        />
      </div>

      {/* Zone Filter Chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedZone('all')}
          className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
            selectedZone === 'all'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
              : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
          }`}
        >
          الكل ({db.animateurs.length})
        </button>
        {ZONES.map((z) => {
          const count = db.animateurs.filter((a) => a.zone === z).length;
          return (
            <button
              key={z}
              onClick={() => setSelectedZone(z)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                selectedZone === z
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {z} ({count})
            </button>
          );
        })}
      </div>

      {/* Animateur List */}
      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center border border-slate-200 space-y-3">
          <Users className="w-12 h-12 text-blue-300 mx-auto" />
          <div>
            <h3 className="text-sm font-bold text-slate-800">لا يوجد أساتذة مؤطرين حتى الآن</h3>
            <p className="text-xs text-slate-500 mt-1">ابدأ بإضافة أول أستاذ مؤطر في فريقك التعليمي لمتابعة زياراته وأفواجه.</p>
          </div>
          <button
            onClick={onOpenAddAnimModal}
            className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow transition inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة أستاذ جديد الآن</span>
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => {
            const gs = db.groupes.filter((g) => g.animId === a.id);
            const eff = gs.reduce((s, g) => s + g.eff, 0);
            const visits = gs.reduce((s, g) => s + (g.visits || 0), 0);
            const scoreValues: number[] = Object.values(a.scores || {}).map((v) => Number(v));
            const avgScore = scoreValues.length
              ? (Math.round((scoreValues.reduce((x, y) => x + y, 0) / scoreValues.length) * 10) / 10).toFixed(1)
              : null;
            const ecolesCount = new Set(gs.map((g) => g.ecole)).size;

            return (
              <div
                key={a.id}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-3 hover:border-blue-200 transition"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-sm font-black text-slate-800">{a.nom}</h3>
                    <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-500 font-medium">
                      <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md font-bold">
                        {a.zone}
                      </span>
                      <span className="flex items-center gap-1 dir-ltr font-mono text-slate-600">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {a.tel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onOpenEditAnimModal(a.id)}
                      className="p-1.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-600 rounded-lg transition cursor-pointer"
                      title="تعديل"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(a.id)}
                      className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg transition cursor-pointer"
                      title="حذف"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                    <Layers className="w-3.5 h-3.5 text-blue-600" />
                    <span className="text-slate-600 font-medium">
                      الأفواج: <b className="text-slate-900">{gs.length}</b>
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                    <GraduationCap className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-slate-600 font-medium">
                      التلاميذ: <b className="text-slate-900">{eff}</b>
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                    <Building2 className="w-3.5 h-3.5 text-amber-600" />
                    <span className="text-slate-600 font-medium">
                      المدارس: <b className="text-slate-900">{ecolesCount}</b>
                    </span>
                  </div>

                  <div className="bg-slate-50 rounded-xl p-2 border border-slate-100 flex items-center gap-2">
                    <CheckCircle2
                      className={`w-3.5 h-3.5 ${visits > 0 ? 'text-emerald-600' : 'text-rose-500'}`}
                    />
                    <span className="text-slate-600 font-medium">
                      الزيارات: <b className={visits > 0 ? 'text-emerald-700' : 'text-rose-600'}>{visits}</b>
                    </span>
                  </div>
                </div>

                {avgScore !== null && (
                  <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 px-3 py-1.5 rounded-xl text-xs font-bold">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
                    <span>متوسط التقييم التربوي:</span>
                    <span className="text-amber-700 font-black">{avgScore} / 3</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-100">
                  <button
                    onClick={() => onOpenEvalModal(a.id)}
                    className="flex-1 min-w-[100px] bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Star className="w-3.5 h-3.5" />
                    <span>تقييم الأداء</span>
                  </button>

                  <button
                    onClick={() => onOpenVisitModal(a.id)}
                    className="flex-1 min-w-[100px] bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>+ زيارة</span>
                  </button>

                  <button
                    onClick={() => onOpenGroupsModal(a.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-slate-500" />
                    <span>الأفواج ({gs.length})</span>
                  </button>

                  <button
                    onClick={() => onOpenNotesModal(a.id)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-bold py-1.5 px-2.5 rounded-xl transition flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-slate-500" />
                    <span>ملاحظة</span>
                  </button>
                </div>

                {a.notes && (
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-700">
                    <span className="font-bold text-slate-500 block text-[10px] mb-0.5">ملاحظة مسجلة:</span>
                    {a.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add Teacher Full Button */}
      <button
        onClick={onOpenAddAnimModal}
        className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[0.99] text-white font-bold py-3 px-4 rounded-2xl shadow-lg shadow-blue-600/25 transition flex items-center justify-center gap-2 text-sm cursor-pointer"
      >
        <Plus className="w-5 h-5" />
        <span>إضافة أستاذ مؤطر جديد</span>
      </button>
    </div>
  );
};
