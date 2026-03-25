import { QUESTION_BANK } from '@/data/questionBank';
import type { QuestionProgress } from '@/store/questionBankStore';
import type { TrackedCard } from '@/store/flashcardStore';

export type SubjectAccuracy = {
  subject: string;
  attempts: number;
  correct: number;
  rate: number;
};

export type TopicLoad = {
  konu: string;
  wrong: number;
  attempts: number;
};

export type QuestionBankAggregate = {
  totalAttempts: number;
  totalCorrect: number;
  accuracy: number;
  solvedDistinct: number;
  bySubject: SubjectAccuracy[];
  topWeakTopics: TopicLoad[];
};

export function aggregateQuestionBank(progress: Record<string, QuestionProgress>): QuestionBankAggregate {
  let totalAttempts = 0;
  let totalCorrect = 0;
  const subjectMap = new Map<string, { attempts: number; correct: number }>();
  const topicMap = new Map<string, { wrong: number; attempts: number }>();

  for (const [qid, p] of Object.entries(progress)) {
    if (!p.attempts) continue;
    const q = QUESTION_BANK.find((x) => x.question_id === qid);
    if (!q) continue;
    totalAttempts += p.attempts;
    totalCorrect += p.correctCount;

    const sub = subjectMap.get(q.ders) ?? { attempts: 0, correct: 0 };
    sub.attempts += p.attempts;
    sub.correct += p.correctCount;
    subjectMap.set(q.ders, sub);

    const wrong = p.attempts - p.correctCount;
    const t = topicMap.get(q.konu) ?? { wrong: 0, attempts: 0 };
    t.attempts += p.attempts;
    t.wrong += wrong;
    topicMap.set(q.konu, t);
  }

  const bySubject: SubjectAccuracy[] = [...subjectMap.entries()]
    .map(([subject, v]) => ({
      subject,
      attempts: v.attempts,
      correct: v.correct,
      rate: v.attempts > 0 ? v.correct / v.attempts : 0,
    }))
    .sort((a, b) => b.attempts - a.attempts);

  const topWeakTopics = [...topicMap.entries()]
    .map(([konu, v]) => ({ konu, wrong: v.wrong, attempts: v.attempts }))
    .filter((x) => x.wrong > 0)
    .sort((a, b) => b.wrong - a.wrong)
    .slice(0, 10);

  const accuracy = totalAttempts > 0 ? totalCorrect / totalAttempts : 0;

  return {
    totalAttempts,
    totalCorrect,
    accuracy,
    solvedDistinct: Object.keys(progress).filter((id) => (progress[id]?.attempts ?? 0) > 0).length,
    bySubject,
    topWeakTopics,
  };
}

export type FlashcardAggregate = {
  totalCards: number;
  reviewsTotal: number;
  dueToday: number;
  byDeck: { title: string; due: number; reviewed: number }[];
};

export function aggregateFlashcards(
  decks: { deck_id: string; başlık: string; kart_ids: string[] }[],
  cards: Record<string, TrackedCard>,
): FlashcardAggregate {
  const endToday = new Date();
  endToday.setHours(23, 59, 59, 999);
  const endTs = endToday.getTime();

  let reviewsTotal = 0;
  let dueToday = 0;
  for (const c of Object.values(cards)) {
    reviewsTotal += c.schedule.tekrarSayısı;
    if (c.schedule.due <= endTs) dueToday += 1;
  }

  const byDeck = decks.map((d) => {
    let due = 0;
    let reviewed = 0;
    for (const id of d.kart_ids) {
      const c = cards[id];
      if (!c) continue;
      if (c.schedule.tekrarSayısı > 0) reviewed += 1;
      if (c.schedule.due <= endTs) due += 1;
    }
    return { title: d.başlık, due, reviewed };
  });

  return {
    totalCards: Object.keys(cards).length,
    reviewsTotal,
    dueToday,
    byDeck,
  };
}

export type DayMinutes = { dayKey: string; label: string; minutes: number };

export function last7DaysPomodoro(sessionLog: { at: string; workMinutes: number }[]): DayMinutes[] {
  const out: DayMinutes[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    d.setHours(0, 0, 0, 0);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const label = `${d.getDate()}/${d.getMonth() + 1}`;
    let minutes = 0;
    for (const e of sessionLog) {
      const ed = new Date(e.at);
      const ek = `${ed.getFullYear()}-${String(ed.getMonth() + 1).padStart(2, '0')}-${String(ed.getDate()).padStart(2, '0')}`;
      if (ek === key) minutes += e.workMinutes;
    }
    out.push({ dayKey: key, label, minutes });
  }
  return out;
}

export function maxInSeries(values: number[]): number {
  const m = Math.max(...values, 1);
  return m;
}
