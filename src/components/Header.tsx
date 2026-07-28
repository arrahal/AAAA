import React from 'react';
import { Calendar, UserCog, Edit3 } from 'lucide-react';
import { AppData } from '../types';
import { MONTHS_AR } from '../data/initialData';

interface HeaderProps {
  db: AppData;
  onOpenMonthSelector: () => void;
  onOpenSupervisorModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ db, onOpenMonthSelector, onOpenSupervisorModal }) => {
  const totalEff = db.groupes.reduce((a, g) => a + g.eff, 0);
  const totalAbs = db.groupes.reduce((a, g) => a + g.absences, 0);
  const totalVisits = db.groupes.reduce((a, g) => a + (g.visits || 0), 0);

  const supervisorName = db.supervisor?.nom || 'المشرف التربوي';
  const project = db.supervisor?.project || 'مشروع الدعم والارتقاء بالتأطير التربوي';
  const location = [db.supervisor?.province, db.supervisor?.region].filter(Boolean).join(' · ');

  return (
    <header className="bg-gradient-to-r from-blue-800 via-blue-700 to-indigo-800 text-white px-4 pt-3 pb-3 shadow-md flex-shrink-0">
      <div className="flex items-center justify-between mb-3 gap-2">
        <button
          onClick={onOpenSupervisorModal}
          className="text-right flex-1 group hover:opacity-90 transition cursor-pointer"
        >
          <div className="flex items-center gap-1.5">
            <h1 className="text-sm sm:text-base font-extrabold tracking-tight text-white flex items-center gap-1.5">
              <span>{supervisorName}</span>
              <Edit3 className="w-3.5 h-3.5 opacity-70 group-hover:opacity-100" />
            </h1>
          </div>
          <p className="text-[11px] text-blue-100/90 font-medium mt-0.5 line-clamp-1">
            {project} {location ? `— ${location}` : ''}
          </p>
        </button>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={onOpenSupervisorModal}
            title="حساب المشرف وإعدادات المشروع"
            className="flex items-center gap-1 bg-white/15 hover:bg-white/25 active:scale-95 transition text-white px-2.5 py-1.5 rounded-full text-xs font-semibold border border-white/30 backdrop-blur-sm cursor-pointer"
          >
            <UserCog className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">حساب المشرف</span>
          </button>

          <button
            onClick={onOpenMonthSelector}
            className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 active:scale-95 transition text-white px-3 py-1.5 rounded-full text-xs font-semibold border border-white/30 backdrop-blur-sm cursor-pointer"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>{MONTHS_AR[db.currentMonth] || `شهر ${db.currentMonth}`}</span>
          </button>
        </div>
      </div>

      {/* Stats Ticker */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-center">
        <div className="bg-white/15 border border-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 min-w-[70px] flex-1 flex flex-col items-center">
          <span className="text-base font-extrabold text-white leading-tight">{db.animateurs.length}</span>
          <span className="text-[10px] text-blue-100/80 font-medium">أستاذ</span>
        </div>

        <div className="bg-white/15 border border-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 min-w-[70px] flex-1 flex flex-col items-center">
          <span className="text-base font-extrabold text-white leading-tight">{db.ecoles.length}</span>
          <span className="text-[10px] text-blue-100/80 font-medium">مدرسة</span>
        </div>

        <div className="bg-white/15 border border-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 min-w-[70px] flex-1 flex flex-col items-center">
          <span className="text-base font-extrabold text-white leading-tight">{db.groupes.length}</span>
          <span className="text-[10px] text-blue-100/80 font-medium">فوج</span>
        </div>

        <div className="bg-white/15 border border-white/20 backdrop-blur-md rounded-xl px-3 py-1.5 min-w-[70px] flex-1 flex flex-col items-center">
          <span className="text-base font-extrabold text-white leading-tight">{totalEff}</span>
          <span className="text-[10px] text-blue-100/80 font-medium">تلميذ</span>
        </div>

        <div className="bg-emerald-500/25 border border-emerald-300/40 backdrop-blur-md rounded-xl px-3 py-1.5 min-w-[70px] flex-1 flex flex-col items-center">
          <span className="text-base font-extrabold text-emerald-200 leading-tight">{totalVisits}</span>
          <span className="text-[10px] text-emerald-100 font-medium">زيارة</span>
        </div>

        <div className="bg-rose-500/25 border border-rose-300/40 backdrop-blur-md rounded-xl px-3 py-1.5 min-w-[70px] flex-1 flex flex-col items-center">
          <span className="text-base font-extrabold text-rose-200 leading-tight">{totalAbs}</span>
          <span className="text-[10px] text-rose-100 font-medium">غياب</span>
        </div>
      </div>
    </header>
  );
};
