import Link from 'next/link';

export default function NotFound() {
  return (
    <section className="legal">
      <div className="wrap">
        <h1>404</h1>
        <p>Diese Seite gibt es nicht. / This page does not exist.</p>
        <p>
          <Link className="btn btn-primary" href="/de">
            Deutsch
          </Link>{' '}
          <Link className="btn btn-primary" href="/en">
            English
          </Link>
        </p>
      </div>
    </section>
  );
}
