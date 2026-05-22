export function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const firstName = name.trim().split(/\s+/)[0] || name;

  if (hour < 12) return `Good morning, ${firstName} 👋`;
  if (hour < 18) return `Good afternoon, ${firstName} 👋`;
  return `Good evening, ${firstName} 👋`;
}
