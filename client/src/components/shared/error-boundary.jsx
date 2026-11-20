import { Component } from 'react';
import ErrorPage from '@/pages/Error';

// Replaces the Next.js App Router `error.tsx` convention, which automatically
// wrapped every route segment in an error boundary. React Router has no such
// convention, so this class component provides the same behaviour: catch a
// render/runtime error anywhere below, show the existing Error UI, and let the
// user recover with "Try again" (which re-mounts the subtree) instead of
// leaving them on a blank white screen.
export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.reset = this.reset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    // In production this should report to an error-monitoring service
    // (Sentry/Datadog). Kept as a single sink so wiring is one line.
    if (import.meta.env.PROD !== true) {
      // eslint-disable-next-line no-console
      console.error('Error boundary:', error, info);
    }
  }

  reset() {
    this.setState({ error: null });
  }

  render() {
    if (this.state.error) {
      return <ErrorPage error={this.state.error} reset={this.reset} />;
    }
    return this.props.children;
  }
}
