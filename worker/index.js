export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS Headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // Health Check
    if (path === '/health' || path === '/ping') {
      return new Response(JSON.stringify({ status: 'healthy', version: '1.0.0' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Match Endpoint
    if (path === '/match-industry' && request.method === 'POST') {
      const { tags, location } = await request.json();
      
      // Basic logic to match industries based on tags
      const industries = matchIndustries(tags);
      
      return new Response(JSON.stringify({ 
        target_industries: industries,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response('Not Found', { status: 404 });
  },
};

function matchIndustries(tags) {
  const mapping = {
    'cable': [
      { sector: 'Home Appliances', relevance: 'High', hs_code: '8544.42' },
      { sector: 'Automotive Harness', relevance: 'Medium', hs_code: '8544.30' }
    ],
    'wire': [
      { sector: 'Home Appliances', relevance: 'High', hs_code: '8544.42' },
      { sector: 'Construction', relevance: 'Low', hs_code: '8544.49' }
    ],
    'connector': [
      { sector: 'Electronics Manufacturing', relevance: 'High', hs_code: '8536.69' }
    ]
  };

  const results = [];
  tags.forEach(tag => {
    const normalizedTag = tag.toLowerCase();
    for (const key in mapping) {
      if (normalizedTag.includes(key)) {
        results.push(...mapping[key]);
      }
    }
  });

  // Remove duplicates and return unique sectors
  return Array.from(new Set(results.map(r => r.sector)))
    .map(sector => results.find(r => r.sector === sector));
}
