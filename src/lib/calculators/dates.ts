export function parseIsoDate(value: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
  const [y, m, d] = value.split("-").map(Number);
  const dt = new Date(y, m - 1, d);
  if (dt.getFullYear() !== y || dt.getMonth() !== m - 1 || dt.getDate() !== d) return null;
  return dt;
}

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function diffDays(from: Date, to: Date): number {
  const a = startOfDay(from).getTime();
  const b = startOfDay(to).getTime();
  return Math.round((b - a) / 86400000);
}

export function inclusiveDays(from: Date, to: Date): number {
  return Math.max(0, diffDays(from, to) + 1);
}

export function addMonths(date: Date, months: number): Date {
  const y = date.getFullYear();
  const m = date.getMonth() + months;
  const day = date.getDate();
  const next = new Date(y, m, 1);
  const last = new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate();
  next.setDate(Math.min(day, last));
  return startOfDay(next);
}

export function addYears(date: Date, years: number): Date {
  const next = new Date(date.getFullYear() + years, date.getMonth(), date.getDate());
  if (date.getMonth() === 1 && date.getDate() === 29 && next.getMonth() !== 1) {
    return startOfDay(new Date(date.getFullYear() + years, 1, 28));
  }
  return startOfDay(next);
}

export function durationYmd(start: Date, end: Date): { yil: number; ay: number; gun: number } {
  const s = startOfDay(start);
  const e = startOfDay(end);
  let cursor = s;
  let yil = 0;
  let ay = 0;
  while (addYears(cursor, 1).getTime() <= e.getTime()) {
    yil += 1;
    cursor = addYears(cursor, 1);
  }
  while (addMonths(cursor, 1).getTime() <= e.getTime()) {
    ay += 1;
    cursor = addMonths(cursor, 1);
  }
  return { yil, ay, gun: Math.max(0, diffDays(cursor, e)) };
}

export function formatDuration(d: { yil: number; ay: number; gun: number }): string {
  const parts = [
    d.yil > 0 ? `${d.yil} yıl` : "",
    d.ay > 0 ? `${d.ay} ay` : "",
    d.gun > 0 || (d.yil === 0 && d.ay === 0) ? `${d.gun} gün` : "",
  ].filter(Boolean);
  return parts.join(" ");
}

export function ageOn(birth: Date, on: Date): number {
  const b = startOfDay(birth);
  const o = startOfDay(on);
  let age = o.getFullYear() - b.getFullYear();
  const m = o.getMonth() - b.getMonth();
  if (m < 0 || (m === 0 && o.getDate() < b.getDate())) age -= 1;
  return age;
}

export function hoursBetween(start: string, end: string): number | null {
  const s = parseTime(start);
  const e = parseTime(end);
  if (s === null || e === null) return null;
  const diff = e - s;
  if (diff <= 0) return 0;
  return diff;
}

function parseTime(value: string): number | null {
  const m = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!m) return null;
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h < 0 || h > 23 || min < 0 || min > 59) return null;
  return h + min / 60;
}
