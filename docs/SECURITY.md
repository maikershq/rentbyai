# Security Best Practices for RentBy

## Overview

This document outlines security considerations and best practices for deploying and maintaining RentBy.

## Smart Contract Security

### Audit Checklist

- [ ] **Reentrancy Protection**: All state changes before external calls
- [ ] **Integer Overflow/Underflow**: Using Rust's checked arithmetic
- [ ] **Access Control**: Owner-only functions properly protected
- [ ] **Escrow Logic**: Funds only released on valid conditions
- [ ] **Reputation Manipulation**: Limits on reputation changes
- [ ] **Account Validation**: All accounts verified before operations

### Key Security Features

1. **Escrow-Based Payments**
   - Funds locked in program-owned account
   - Released only on completion or dispute resolution
   - No direct wallet-to-wallet transfers

2. **Reputation System**
   - On-chain tracking prevents manipulation
   - Incremental changes only
   - Historical scores preserved

3. **Dispute Resolution**
   - Admin-only resolution authority
   - Partial refund support
   - Transparent on-chain record

### Testing

Run comprehensive tests before deployment:

```bash
anchor test
```

### Mainnet Deployment

⚠️ **Before deploying to mainnet:**

1. Complete security audit by qualified auditor
2. Run extensive testing on devnet
3. Test with small amounts first
4. Monitor all transactions
5. Have upgrade authority ready
6. Prepare incident response plan

## API Security

### Environment Variables

**Never commit sensitive data!**

- Use `.env` files (added to `.gitignore`)
- Rotate API keys regularly
- Use different keys for dev/staging/production
- Store secrets in Railway/Vercel secret management

### CORS Configuration

```javascript
// api/src/index.js
app.use(cors({
  origin: process.env.CORS_ORIGIN.split(','),
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

### Input Validation

Always validate and sanitize user input:

```bash
npm install joi
```

```javascript
const Joi = require('joi');

const resourceSchema = Joi.object({
  owner: Joi.string().required(),
  resource_type: Joi.string().valid('compute', 'human', 'physical', 'api').required(),
  hourly_rate: Joi.number().min(0).required(),
  // ... other fields
});
```

### SQL Injection Protection

When adding a database:

```javascript
// ✅ Good: Use parameterized queries
const resources = await db.query(
  'SELECT * FROM resources WHERE owner = $1',
  [ownerAddress]
);

// ❌ Bad: String concatenation
const resources = await db.query(
  `SELECT * FROM resources WHERE owner = '${ownerAddress}'`
);
```

### Authentication

If adding user authentication:

```bash
npm install jsonwebtoken bcrypt
```

```javascript
const jwt = require('jsonwebtoken');

// Generate token
const token = jwt.sign(
  { wallet: userWallet },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify middleware
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'No token provided' });
  
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid token' });
    req.userId = decoded.wallet;
    next();
  });
};
```

## Frontend Security

### Environment Variables

Only expose public variables:

```bash
# ✅ Good: Public prefix
NEXT_PUBLIC_API_URL=https://api.rentby.ai

# ❌ Bad: Secret in frontend
API_SECRET_KEY=xxx
```

### Content Security Policy

Add to `next.config.js`:

```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline';"
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

### Wallet Security

```javascript
// Always verify wallet signatures
const verifySignature = async (message, signature, publicKey) => {
  const messageBytes = new TextEncoder().encode(message);
  const signatureBytes = bs58.decode(signature);
  return nacl.sign.detached.verify(messageBytes, signatureBytes, publicKey.toBytes());
};

// Never expose private keys
// Use wallet adapters (@solana/wallet-adapter-react)
```

### XSS Protection

```javascript
// ✅ Good: React auto-escapes
<div>{userInput}</div>

// ❌ Bad: dangerouslySetInnerHTML without sanitization
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// If you must use HTML, sanitize first:
import DOMPurify from 'dompurify';
<div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(userInput) }} />
```

## Deployment Security

### Secrets Management

**Railway:**
```bash
railway variables set API_SECRET=xxx --env production
```

**Vercel:**
```bash
vercel env add API_SECRET production
```

### HTTPS/SSL

- Always use HTTPS in production
- Railway and Vercel provide SSL automatically
- Redirect HTTP to HTTPS

### Dependency Security

```bash
# Regular security audits
npm audit
npm audit fix

# Keep dependencies updated
npm update

# Check for outdated packages
npm outdated
```

### Monitoring

Set up monitoring and alerts:

1. **Error Tracking**
   - Sentry, LogRocket, or similar
   - Alert on unexpected errors
   - Track error rates

2. **Performance Monitoring**
   - Response time metrics
   - API endpoint performance
   - Database query performance

3. **Security Monitoring**
   - Failed authentication attempts
   - Unusual transaction patterns
   - High request rates from single IP

### Backup & Recovery

1. **Smart Contract**
   - Keep deployment keys secure
   - Have upgrade authority wallet backed up
   - Document recovery procedures

2. **Database** (when added)
   - Regular automated backups
   - Test restoration procedures
   - Store backups in different region

3. **Environment Variables**
   - Document all required variables
   - Keep encrypted backups
   - Have recovery process

## Incident Response

### Preparation

1. Create incident response team
2. Document response procedures
3. Set up communication channels
4. Prepare rollback procedures

### Detection

- Monitor error rates
- Set up alerts for anomalies
- Regular security scans
- Community bug reports

### Response

1. **Assess severity**
   - Critical: Funds at risk
   - High: Service disruption
   - Medium: Performance issues
   - Low: Minor bugs

2. **Contain**
   - Pause affected services if needed
   - Prevent further damage
   - Document everything

3. **Remediate**
   - Deploy fixes
   - Verify resolution
   - Monitor for recurrence

4. **Post-mortem**
   - Document incident
   - Identify root cause
   - Implement preventive measures
   - Update security practices

## Security Checklist

### Pre-Deployment

- [ ] Security audit completed
- [ ] All secrets in environment variables
- [ ] HTTPS enabled
- [ ] CORS properly configured
- [ ] Rate limiting implemented
- [ ] Input validation on all endpoints
- [ ] Error messages don't expose sensitive info
- [ ] Dependencies up to date
- [ ] npm audit shows no high vulnerabilities

### Post-Deployment

- [ ] Monitoring and alerting active
- [ ] Backup procedures in place
- [ ] Incident response plan documented
- [ ] Regular security reviews scheduled
- [ ] Bug bounty program (optional)
- [ ] Penetration testing (for mainnet)

## Responsible Disclosure

If you discover a security vulnerability:

1. **Do NOT** open a public GitHub issue
2. Email: security@rentby.ai
3. Include detailed description and reproduction steps
4. Allow reasonable time for fix before public disclosure
5. Consider bug bounty program (if available)

## Resources

- [Solana Security Best Practices](https://docs.solana.com/developing/programming-model/security)
- [Anchor Security](https://www.anchor-lang.com/docs/security)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)

## Updates

This document should be reviewed and updated:
- Before each major release
- After security incidents
- When new features are added
- When security best practices evolve

Last updated: 2026-02-04
