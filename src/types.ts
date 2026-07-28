export interface SupervisorInfo {
  nom: string;
  project: string;
  region: string;
  province: string;
}

export interface Animateur {
  id: number;
  nom: string;
  tel: string;
  zone: string;
  notes: string;
  scores: Record<number, number>;
  visits: number;
}

export interface Ecole {
  id: number;
  nom: string;
  commune: string;
  groupes: string[];
  province: string;
  notes: string;
}

export interface Groupe {
  id: number;
  ecole: string;
  groupe: string;
  animId: number;
  eff: number;
  filles: number;
  garcons: number;
  absences: number;
  jt?: number;
  niveau: string;
  niveauReel?: string;
  horaires: Record<string, string>;
  visits?: number;
}

export interface Report {
  id: number;
  month: number;
  type: 'visite' | 'notes' | 'taqrir';
  animId: number;
  groupeId?: number;
  date: string;
  text: string;
}

export interface DocumentFile {
  name: string;
  type: string;
  url?: string;
  data?: string;
  publicId?: string;
  animId?: number | null;
  ecoleId?: number | null;
  desc?: string;
  date: string;
}

export interface MonthGroupSnapshot {
  id: number;
  absences: number;
  visits: number;
}

export interface MonthAnimScoreSnapshot {
  id: number;
  scores: Record<number, number>;
}

export interface MonthSnapshot {
  groupes: MonthGroupSnapshot[];
  animScores: MonthAnimScoreSnapshot[];
}

export interface StudentRecord {
  id: number;
  nom: string;
  sexe: 'F' | 'M';
  groupeId: number;
  ecoleNom: string;
  dateInscription: string;
  parentTel?: string;
  status: 'actif' | 'inqitaa' | 'transfere';
  notes?: string;
}

export interface InqitaaRecord {
  id: number;
  studentNom: string;
  sexe: 'F' | 'M';
  groupeId: number;
  ecoleNom: string;
  dateInqitaa: string;
  cause: string;
  status: 'monqatia' | 'irjaa' | 'mowataba'; // منقطع | تم الإرجاع | قيد المتابعة
  dateIrjaa?: string;
  notes?: string;
}

export interface VisitRecord {
  id: number;
  animId: number;
  groupeId?: number;
  date: string;
  scores: Record<number, number>;
  notes: string;
  recommandations?: string;
  month: number;
}

export interface AppData {
  supervisor: SupervisorInfo;
  currentMonth: number;
  animateurs: Animateur[];
  ecoles: Ecole[];
  groupes: Groupe[];
  reports: Report[];
  students?: StudentRecord[];
  inqitaat?: InqitaaRecord[];
  visitsList?: VisitRecord[];
  nextId: {
    a: number;
    e: number;
    g: number;
    r: number;
    st?: number;
    inq?: number;
    v?: number;
  };
  monthData?: Record<string, MonthSnapshot>;
}

export interface CloudConfig {
  cloudName: string;
  uploadPreset: string;
}

export interface GistConfig {
  token: string;
  gistId: string;
  lastPush?: string;
}

export type TabType = 'home' | 'visits' | 'absences' | 'pupils' | 'animateurs' | 'ecoles' | 'schedule' | 'reports';
export type ReportSubTab = 'synthese' | 'visites' | 'absences' | 'notes' | 'docs' | 'partage';
