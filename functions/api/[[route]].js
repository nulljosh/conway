// REST surface. Thin: every route is argument-shuffling around callTool() in
// src/lib/tools.js, which functions/mcp.js also calls. No Life logic lives here — including
// the board and step ceilings, which must not be duplicated or bypassed.

import { callTool, ToolError, TOOL_NAMES } from '../../src/lib/tools.js';

const CORS = {
  'access-control-allow-origin': '*',
  'access-control-allow-headers': 'content-type',
  'access-control-allow-methods': 'GET, POST, OPTIONS',
};

const json = (body, status = 200) =>
  new Response(JSON.stringify(body, null, 2), {
    status,
    headers: { 'content-type': 'application/json', ...CORS },
  });

const ENDPOINTS = {
  'GET /api/patterns': 'Named starting patterns, as rows ready to pass to /api/step.',
  'POST /api/step': '{ rows, steps? } -> { rows, population, steps }',
  'POST /mcp': 'Model Context Protocol, JSON-RPC. Same two tools.',
};

const run = (name, args) => {
  try {
    return json(callTool(name, args));
  } catch (err) {
    // A rejected expression is the caller's to fix, so name the problem rather than 500ing.
    if (err instanceof ToolError) return json({ error: err.message, tool: name }, 400);
    throw err;
  }
};

const POSTS = { '/api/step': 'step_board' };

export async function onRequest({ request }) {
  if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: CORS });

  const url = new URL(request.url);
  const path = url.pathname.replace(/\/+$/, '');

  if (request.method === 'GET' && path === '/api/patterns') return run('list_patterns', {});

  if (request.method === 'POST' && POSTS[path]) {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Body must be JSON.' }, 400);
    }
    return run(POSTS[path], body);
  }

  if (path === '/api' || path === '/api/') return json({ endpoints: ENDPOINTS, tools: TOOL_NAMES });

  return json({ error: `Unknown endpoint: ${request.method} ${path}`, endpoints: ENDPOINTS }, 404);
}
