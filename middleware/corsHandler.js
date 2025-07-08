export default function withCors(handler, options = {}) {
    const {
        origin = process.env.ALLOW_ORIGIN,
        methods = 'POST,OPTIONS',
        headers = 'Content-Type',
    } = options;

    return async function corsHandler(req, res) {
        // Sæt de nødvendige CORS headers
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Access-Control-Allow-Methods', methods);
        res.setHeader('Access-Control-Allow-Headers', headers);

        // Håndter preflight (OPTIONS)
        if (req.method === 'OPTIONS') {
            return res.status(204).end();
        }

        // Kald den originale handler
        return handler(req, res);
    };
}