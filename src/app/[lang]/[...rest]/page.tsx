import { notFound } from 'next/navigation';

// Any unknown path below /de or /en shows the 404 page.
export default function CatchAll() {
  notFound();
}
