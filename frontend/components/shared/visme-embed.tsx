'use client';

import { useEffect } from 'react';

const SCRIPT_SRC = 'https://static-bundles.visme.co/forms/vismeforms-embed.js';

/**
 * Renders a Visme form embed. In this app the whole tree is gated behind the
 * AuthProvider loader, so a normally-loaded embed script runs BEFORE the
 * `.visme_d` div exists and never initializes it. We instead inject the script
 * from a useEffect — which runs only after this component (and its div) are in
 * the DOM — and force a fresh load so the embed reliably finds and mounts.
 */
export function VismeEmbed() {
  useEffect(() => {
    // Remove any previously-loaded copy so the embed re-scans the DOM.
    document.querySelectorAll(`script[src="${SCRIPT_SRC}"]`).forEach((s) => s.remove());

    const script = document.createElement('script');
    script.src = SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <div
      className="visme_d w-full"
      data-title="Workshop Registration Form"
      data-url="4k973z99-workshop-registration-form?fullPage=true"
      data-domain="forms"
      data-full-page="true"
      data-min-height="100vh"
      data-form-id="182486"
    />
  );
}
