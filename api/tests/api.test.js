import request from 'supertest';
import app from '../src/index.js';

describe('RentBy API Tests', () => {
  let testResource;
  let testRental;

  describe('Health Check', () => {
    it('should return health status', async () => {
      const res = await request(app).get('/health');
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('status', 'healthy');
      expect(res.body).toHaveProperty('version');
      expect(res.body).toHaveProperty('timestamp');
    });
  });

  describe('Resources', () => {
    describe('POST /api/resources', () => {
      it('should create a new resource', async () => {
        const newResource = {
          owner: 'test_wallet_address_1',
          mint: 'test_mint_1',
          resource_type: 'compute',
          specs: '8x NVIDIA H100 80GB',
          hourly_rate: 10
        };

        const res = await request(app)
          .post('/api/resources')
          .send(newResource)
          .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.resource).toHaveProperty('id');
        expect(res.body.resource).toHaveProperty('reputation', 0);
        expect(res.body.resource).toHaveProperty('total_rentals', 0);
        expect(res.body.resource.owner).toBe(newResource.owner);
        expect(res.body.resource.resource_type).toBe(newResource.resource_type);

        testResource = res.body.resource;
      });

      it('should return 400 for missing required fields', async () => {
        const incompleteResource = {
          owner: 'test_wallet_address',
          mint: 'test_mint'
        };

        const res = await request(app)
          .post('/api/resources')
          .send(incompleteResource)
          .expect(400);

        expect(res.body).toHaveProperty('error');
      });
    });

    describe('GET /api/resources', () => {
      beforeAll(async () => {
        // Create some test resources
        await request(app).post('/api/resources').send({
          owner: 'wallet_a',
          mint: 'mint_a',
          resource_type: 'compute',
          specs: '4x A100',
          hourly_rate: 5
        });

        await request(app).post('/api/resources').send({
          owner: 'wallet_b',
          mint: 'mint_b',
          resource_type: 'human',
          specs: 'ML Engineer',
          hourly_rate: 50
        });

        await request(app).post('/api/resources').send({
          owner: 'wallet_c',
          mint: 'mint_c',
          resource_type: 'device',
          specs: 'Industrial Robot Arm',
          hourly_rate: 15,
          reputation: 5,
          total_rentals: 20
        });
      });

      it('should return all resources', async () => {
        const res = await request(app).get('/api/resources').expect(200);

        expect(res.body).toHaveProperty('resources');
        expect(res.body).toHaveProperty('count');
        expect(Array.isArray(res.body.resources)).toBe(true);
      });

      it('should filter resources by type', async () => {
        const res = await request(app)
          .get('/api/resources?type=compute')
          .expect(200);

        expect(res.body.resources.every(r => r.resource_type === 'compute')).toBe(true);
      });

      it('should filter resources by max price', async () => {
        const res = await request(app)
          .get('/api/resources?max_price=10')
          .expect(200);

        expect(res.body.resources.every(r => r.hourly_rate <= 10)).toBe(true);
      });

      it('should filter resources by min reputation', async () => {
        const res = await request(app)
          .get('/api/resources?min_reputation=3')
          .expect(200);

        expect(res.body.resources.every(r => r.reputation >= 3)).toBe(true);
      });

      it('should sort by reputation (highest first)', async () => {
        const res = await request(app).get('/api/resources').expect(200);

        for (let i = 0; i < res.body.resources.length - 1; i++) {
          expect(res.body.resources[i].reputation).toBeGreaterThanOrEqual(
            res.body.resources[i + 1].reputation
          );
        }
      });
    });

    describe('GET /api/resources/:id', () => {
      it('should return a specific resource', async () => {
        const res = await request(app)
          .get(`/api/resources/${testResource.id}`)
          .expect(200);

        expect(res.body.id).toBe(testResource.id);
        expect(res.body.resource_type).toBe(testResource.resource_type);
      });

      it('should return 404 for non-existent resource', async () => {
        const res = await request(app)
          .get('/api/resources/nonexistent-id')
          .expect(404);

        expect(res.body).toHaveProperty('error');
      });
    });
  });

  describe('Rentals', () => {
    describe('POST /api/rentals', () => {
      it('should create a new rental', async () => {
        const newRental = {
          renter: 'test_renter_wallet',
          resource_owner: 'resource_owner_wallet',
          resource_mint: 'resource_mint_1',
          escrow_amount: 50,
          duration: 3600,
          solana_tx_signature: 'test_signature_123'
        };

        const res = await request(app)
          .post('/api/rentals')
          .send(newRental)
          .expect(201);

        expect(res.body.success).toBe(true);
        expect(res.body.rental).toHaveProperty('id');
        expect(res.body.rental).toHaveProperty('status', 'active');
        expect(res.body.rental).toHaveProperty('start_time');
        expect(res.body.rental.renter).toBe(newRental.renter);

        testRental = res.body.rental;
      });

      it('should return 400 for missing required fields', async () => {
        const incompleteRental = {
          renter: 'test_renter',
          resource_owner: 'resource_owner'
        };

        const res = await request(app)
          .post('/api/rentals')
          .send(incompleteRental)
          .expect(400);

        expect(res.body).toHaveProperty('error');
      });
    });

    describe('GET /api/rentals', () => {
      beforeAll(async () => {
        // Create test rentals
        await request(app).post('/api/rentals').send({
          renter: 'renter_a',
          resource_owner: 'owner_a',
          resource_mint: 'mint_a',
          escrow_amount: 100,
          duration: 7200
        });

        await request(app).post('/api/rentals').send({
          renter: 'renter_b',
          resource_owner: 'owner_b',
          resource_mint: 'mint_b',
          escrow_amount: 75,
          duration: 3600,
          status: 'completed'
        });
      });

      it('should return all rentals', async () => {
        const res = await request(app).get('/api/rentals').expect(200);

        expect(res.body).toHaveProperty('rentals');
        expect(res.body).toHaveProperty('count');
        expect(Array.isArray(res.body.rentals)).toBe(true);
      });

      it('should filter rentals by user', async () => {
        const res = await request(app)
          .get('/api/rentals?user=renter_a')
          .expect(200);

        expect(res.body.rentals.every(r => 
          r.renter === 'renter_a' || r.resource_owner === 'renter_a'
        )).toBe(true);
      });
    });

    describe('GET /api/rentals/:id', () => {
      it('should return a specific rental', async () => {
        const res = await request(app)
          .get(`/api/rentals/${testRental.id}`)
          .expect(200);

        expect(res.body.id).toBe(testRental.id);
        expect(res.body.renter).toBe(testRental.renter);
      });

      it('should return 404 for non-existent rental', async () => {
        const res = await request(app)
          .get('/api/rentals/nonexistent-id')
          .expect(404);

        expect(res.body).toHaveProperty('error');
      });
    });

    describe('PATCH /api/rentals/:id/status', () => {
      it('should update rental status', async () => {
        const res = await request(app)
          .patch(`/api/rentals/${testRental.id}/status`)
          .send({ status: 'completed', solana_tx_signature: 'tx_sig_456' })
          .expect(200);

        expect(res.body.success).toBe(true);
        expect(res.body.rental.status).toBe('completed');
      });

      it('should return 400 for invalid status', async () => {
        const res = await request(app)
          .patch(`/api/rentals/${testRental.id}/status`)
          .send({ status: 'invalid_status' })
          .expect(400);

        expect(res.body).toHaveProperty('error');
      });

      it('should return 404 for non-existent rental', async () => {
        const res = await request(app)
          .patch('/api/rentals/nonexistent-id/status')
          .send({ status: 'completed' })
          .expect(404);

        expect(res.body).toHaveProperty('error');
      });
    });
  });

  describe('Search', () => {
    beforeAll(async () => {
      // Create resources for search testing
      await request(app).post('/api/resources').send({
        owner: 'wallet_x',
        mint: 'mint_x',
        resource_type: 'compute',
        specs: 'NVIDIA GPU cluster for ML training',
        hourly_rate: 8,
        reputation: 4,
        total_rentals: 30
      });

      await request(app).post('/api/resources').send({
        owner: 'wallet_y',
        mint: 'mint_y',
        resource_type: 'device',
        specs: 'Robot arm for industrial automation',
        hourly_rate: 12,
        reputation: 3,
        total_rentals: 15
      });

      await request(app).post('/api/resources').send({
        owner: 'wallet_z',
        mint: 'mint_z',
        resource_type: 'human',
        specs: 'Senior Machine Learning Engineer',
        hourly_rate: 60,
        reputation: 5,
        total_rentals: 50
      });
    });

    it('should search for resources by keywords', async () => {
      const res = await request(app)
        .post('/api/search')
        .send({ query: 'GPU for ML training' })
        .expect(200);

      expect(res.body).toHaveProperty('query');
      expect(res.body).toHaveProperty('resources');
      expect(res.body.resources.length).toBeGreaterThan(0);
    });

    it('should return 400 for missing query', async () => {
      const res = await request(app)
        .post('/api/search')
        .send({})
        .expect(400);

      expect(res.body).toHaveProperty('error');
    });

    it('should apply filters in search', async () => {
      const res = await request(app)
        .post('/api/search')
        .send({
          query: 'ML training',
          filters: {
            type: 'compute',
            max_price: 10,
            min_reputation: 3
          }
        })
        .expect(200);

      expect(res.body.resources.every(r => r.resource_type === 'compute')).toBe(true);
      expect(res.body.resources.every(r => r.hourly_rate <= 10)).toBe(true);
      expect(res.body.resources.every(r => r.reputation >= 3)).toBe(true);
    });

    it('should return results sorted by relevance score', async () => {
      const res = await request(app)
        .post('/api/search')
        .send({ query: 'Machine Learning' })
        .expect(200);

      for (let i = 0; i < res.body.resources.length - 1; i++) {
        expect(res.body.resources[i].score).toBeGreaterThanOrEqual(
          res.body.resources[i + 1].score
        );
      }
    });
  });

  describe('Statistics', () => {
    it('should return marketplace statistics', async () => {
      const res = await request(app).get('/api/stats').expect(200);

      expect(res.body).toHaveProperty('total_resources');
      expect(res.body).toHaveProperty('total_rentals');
      expect(res.body).toHaveProperty('active_rentals');
      expect(res.body).toHaveProperty('completed_rentals');
      expect(res.body).toHaveProperty('average_reputation');

      expect(typeof res.body.total_resources).toBe('number');
      expect(typeof res.body.total_rentals).toBe('number');
      expect(typeof res.body.average_reputation).toBe('number');
    });
  });
});
