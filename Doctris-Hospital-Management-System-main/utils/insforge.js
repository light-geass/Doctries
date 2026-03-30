import { createClient } from '@insforge/sdk';

const baseUrl =
  process.env.NEXT_PUBLIC_INSFORGE_BASE_URL ||
  'https://4qg2f9tk.us-east.insforge.app';

const anonKey =
  process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3OC0xMjM0LTU2NzgtOTBhYi1jZGVmMTIzNDU2NzgiLCJlbWFpbCI6ImFub25AaW5zZm9yZ2UuY29tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM3MzYyNjV9.12caP_lPE7RZ8w4jq_2-9CFJBfBsg1qvydI4uESbjX4';

const insforge = createClient({
  baseUrl,
  anonKey,
});

export default insforge;
