// Shared by the form (client) and the API route (server).
export const MAX_FILES = 5;
export const MAX_TOTAL_BYTES = 10 * 1024 * 1024;
export const ALLOWED_FILE = /\.(dxf|dwg|step|stp|igs|iges|pdf|png|jpe?g|zip)$/i;
export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
