
export function formatISODateOnly(date: Date | string): string {
    return new Date(date).toISOString().split('T')[0];
}