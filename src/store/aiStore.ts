import { create } from 'zustand';
import { useUserStore } from '@/store/userStore';
import { useStatsStore, weeklyDelta } from '@/store/statsStore';

export interface ChatMessage {
  id: string;
  role: 'ai' | 'user';
  text: string;
}

const GOAL_LABEL: Record<string, string> = {
  weight_loss: 'perdita di peso',
  muscle_gain: 'aumento massa',
  performance: 'performance',
  maintain: 'mantenimento',
};

function mockReply(input: string): string {
  const u = useUserStore.getState();
  const name = u.name || 'atleta';
  const goal = u.goal ? GOAL_LABEL[u.goal] : 'forma fisica';
  const t = input.toLowerCase();

  if (t.includes('progress')) {
    const entries = useStatsStore.getState().entries;
    if (entries.length < 2) {
      return `${name}, non ho ancora abbastanza misurazioni per analizzare i tuoi progressi. Aggiungine qualcuna dalla scheda "Progressi" e torna a chiedermelo 📈.`;
    }
    const dw = weeklyDelta(entries, 'weight');
    const dm = weeklyDelta(entries, 'muscle');
    const wTxt = dw === 0 ? 'peso stabile' : `${dw < 0 ? 'perso' : 'preso'} ${Math.abs(dw)}kg`;
    const mTxt = dm === 0 ? 'massa stabile' : `${dm > 0 ? '+' : ''}${dm}kg di massa magra`;
    return `${name}, nell'ultima settimana: ${wTxt}, ${mTxt} 💪. Continua a registrare le misure per restare in linea con l'obiettivo "${goal}".`;
  }
  if (t.includes('allenamen') || t.includes('workout') || t.includes('scheda')) {
    return `Vista la tua età (${u.age ?? '–'}) e l'obiettivo "${goal}", ti propongo una split 4 giorni: Petto+Tricipiti, Schiena+Bicipiti, Gambe, Spalle+Core. 3-4 serie da 8-12 reps, 90s di recupero. Vuoi che la salvi tra le tue schede?`;
  }
  if (t.includes('diet') || t.includes('cibo') || t.includes('mangi') || t.includes('nutri')) {
    return `Per l'obiettivo "${goal}" punta a ~1.8g di proteine per kg di peso, carboidrati intorno agli allenamenti e grassi sani. Idratati bene e non saltare la colazione. Vuoi un esempio di giornata tipo?`;
  }
  if (t.includes('recuper') || t.includes('riposo') || t.includes('sonno')) {
    return `Il recupero è dove cresci, ${name}. Dormi 7-9 ore, lascia 48h tra gli stimoli sullo stesso gruppo e inserisci una settimana di scarico ogni 6-8. Lo stretching post-workout aiuta la mobilità.`;
  }
  return `Ottima domanda! Ricorda: ${name}, i risultati arrivano con la costanza. Ogni piccolo passo verso "${goal}" conta. Dimmi pure se vuoi analizzare i progressi, una scheda o consigli sull'alimentazione 🚀`;
}

interface AIState {
  messages: ChatMessage[];
  loading: boolean;
  send: (text: string) => void;
  reset: () => void;
}

const initialMessages: ChatMessage[] = [
  {
    id: 'init',
    role: 'ai',
    text: 'Ciao! Sono Eclipse AI, il tuo assistente offline. Come posso aiutarti oggi?',
  },
];

export const useAIStore = create<AIState>((set, get) => ({
  messages: initialMessages,
  loading: false,
  reset: () => set({ messages: initialMessages, loading: false }),
  send: (text) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    set((s) => ({
      messages: [...s.messages, { id: 'u' + Date.now(), role: 'user', text: trimmed }],
      loading: true,
    }));
    const delay = 800 + Math.random() * 700;
    setTimeout(() => {
      set((s) => ({
        messages: [...s.messages, { id: 'a' + Date.now(), role: 'ai', text: mockReply(trimmed) }],
        loading: false,
      }));
    }, delay);
  },
}));
