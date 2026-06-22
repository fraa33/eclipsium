export type MuscleGroup =
  | 'Petto'
  | 'Schiena'
  | 'Gambe'
  | 'Spalle'
  | 'Braccia'
  | 'Core';

export interface Exercise {
  id: string;
  name: string;
  group: MuscleGroup;
  instructions: string;
}

export const MUSCLE_GROUPS: { group: MuscleGroup; emoji: string; color: string }[] = [
  { group: 'Petto', emoji: '🫁', color: '#534AB7' },
  { group: 'Schiena', emoji: '🦾', color: '#4CAF82' },
  { group: 'Gambe', emoji: '🦵', color: '#EF9F27' },
  { group: 'Spalle', emoji: '🪨', color: '#7F77DD' },
  { group: 'Braccia', emoji: '💪', color: '#E2544A' },
  { group: 'Core', emoji: '🔥', color: '#3C3489' },
];

export const EXERCISES: Exercise[] = [
  { id: 'p1', name: 'Panca piana bilanciere', group: 'Petto', instructions: 'Schiena appoggiata, scendi controllato fino al petto, spingi esplosivo.' },
  { id: 'p2', name: 'Panca inclinata manubri', group: 'Petto', instructions: 'Inclinazione 30°, gomiti a 45°, range completo.' },
  { id: 'p3', name: 'Croci ai cavi', group: 'Petto', instructions: 'Leggera flessione gomito, stringi al centro.' },
  { id: 'p4', name: 'Dip alle parallele', group: 'Petto', instructions: 'Busto inclinato in avanti per enfatizzare il petto.' },
  { id: 's1', name: 'Trazioni alla sbarra', group: 'Schiena', instructions: 'Presa prona, tira con i gomiti verso il basso.' },
  { id: 's2', name: 'Rematore bilanciere', group: 'Schiena', instructions: 'Busto a 45°, tira verso l\'ombelico.' },
  { id: 's3', name: 'Lat machine', group: 'Schiena', instructions: 'Petto in fuori, tira la barra al petto.' },
  { id: 's4', name: 'Stacco da terra', group: 'Schiena', instructions: 'Schiena neutra, spingi col pavimento.' },
  { id: 'g1', name: 'Squat bilanciere', group: 'Gambe', instructions: 'Scendi sotto il parallelo, ginocchia in linea coi piedi.' },
  { id: 'g2', name: 'Pressa', group: 'Gambe', instructions: 'Non bloccare le ginocchia in alto.' },
  { id: 'g3', name: 'Affondi manubri', group: 'Gambe', instructions: 'Passo lungo, ginocchio posteriore verso terra.' },
  { id: 'g4', name: 'Leg curl', group: 'Gambe', instructions: 'Controlla la fase negativa.' },
  { id: 'sp1', name: 'Lento avanti manubri', group: 'Spalle', instructions: 'Spingi sopra la testa senza inarcare.' },
  { id: 'sp2', name: 'Alzate laterali', group: 'Spalle', instructions: 'Gomiti leggermente flessi, sali fino alle spalle.' },
  { id: 'sp3', name: 'Alzate posteriori', group: 'Spalle', instructions: 'Busto in avanti, apri verso l\'esterno.' },
  { id: 'b1', name: 'Curl bilanciere', group: 'Braccia', instructions: 'Gomiti fermi, contrai in alto.' },
  { id: 'b2', name: 'French press', group: 'Braccia', instructions: 'Gomiti stretti, estendi i tricipiti.' },
  { id: 'b3', name: 'Curl a martello', group: 'Braccia', instructions: 'Presa neutra, controlla la discesa.' },
  { id: 'b4', name: 'Push down ai cavi', group: 'Braccia', instructions: 'Gomiti al corpo, estendi completamente.' },
  { id: 'c1', name: 'Plank', group: 'Core', instructions: 'Corpo in linea, addome contratto.' },
  { id: 'c2', name: 'Crunch ai cavi', group: 'Core', instructions: 'Arrotonda la colonna, espira in contrazione.' },
  { id: 'c3', name: 'Russian twist', group: 'Core', instructions: 'Ruota il busto controllando il movimento.' },
];

export const exercisesByGroup = (group: MuscleGroup) =>
  EXERCISES.filter((e) => e.group === group);
