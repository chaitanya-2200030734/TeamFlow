import { Link } from 'react-router-dom';

export const NotFoundPage = () => (
  <main className="not-found">
    <h1>Page not found</h1>
    <p>This route is not part of the TeamFlow workspace.</p>
    <Link className="btn btn-primary" to="/dashboard">Go to dashboard</Link>
  </main>
);
