import React from 'react';
import {
  LayoutDashboard,
  ClipboardCheck,
  UserX,
  UserPlus,
  Users,
  School,
  CalendarDays,
  FileSpreadsheet,
} from 'lucide-react';
import { TabType } from '../types';

interface NavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentTab, onSelectTab }) => {
  const tabs = [
    { id: 'home' as TabType, label: 'الرئيسية', icon: LayoutDashboard },
    { id: 'visits' as TabType, label: 'الزيارات', icon: ClipboardCheck },
    { id: 'absences' as TabType, label: 'الغياب', icon: UserX },
    { id: 'pupils' as TabType, label: 'التسجيل والانقطاع', icon: UserPlus },
    { id: 'animateurs' as TabType, label: 'الأساتذة', icon: Users },
    { id: 'ecoles' as TabType, label: 'المدارس', icon: School },
    { id: 'schedule' as TabType, label: 'الجدول', icon: CalendarDays },
    { id: 'reports' as TabType, label: 'التقارير', icon: FileSpreadsheet },
  ];

  return (
    <nav className="bg-white border-t border-slate-200 shadow-xl flex-shrink-0 relative z-30">
      <div className="flex items-center overflow-x-auto scrollbar-none max-w-md mx-auto px-1 py-1.5 gap-1 justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex-shrink-0 px-2 py-1.5 rounded-xl flex flex-col items-center justify-center gap-1 transition-all duration-200 cursor-pointer min-w-[62px] ${
                isActive
                  ? 'bg-blue-600 text-white shadow-md font-bold scale-102'
                  : 'text-slate-500 hover:text-blue-600 hover:bg-slate-50 font-medium'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.5]' : 'stroke-2'}`} />
              <span className="text-[10px] leading-tight text-center whitespace-nowrap">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
