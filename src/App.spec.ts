import request from 'supertest';
import app from '../App';
import { QuickenDataExtractor } from './QuickenDataExtractor';
import * as fixtures from './fixtures';

describe('App module', function() {

  it('should export a function', () => {
    expect(app).toBeInstanceOf(Function);
  });

  it('should return success response with stopSolverResults and a time stamp', async () => {
    const googleDirectionsResultStringified = JSON.stringify(fixtures.googleDirectionsResult);
    // console.log(googleDirectionsResultStringified);
    const reqPacket: StopSolverRequest = {
      routesID: '999',
      userParameters: {
        speedKilometersPerHour: 32,
        hoursPerDay: 8,
      },
      directionsResults: googleDirectionsResultStringified,
    };
    
    const res = await request(app)
    .post('/api/fetch')
    .send(reqPacket)
    .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('stopSolverRoutesID');
    expect(res.body).toHaveProperty('stopSolverStops');
  });
  it('should handle a userParameters of 0, Stop Solver disabled', async () => {
    const googleDirectionsResultStringified = JSON.stringify(fixtures.googleDirectionsResult);
    const expectedLength = fixtures.googleDirectionsResult.geocoded_waypoints.length;

    const res = await request(app)
    .post('/api/fetch')
    .send({
      routesID: '999',
      userParameters: {
        kilometersPerDay: 0
      },
      directionsResults: googleDirectionsResultStringified,
    })
    .set('Accept', 'application/json');

    expect(res.status).toBe(200);
    expect(res.body.stopSolverStops[0][0].length).toEqual(expectedLength);
  })
  it('should gracefully handle a malformed request', async () => {
    const res = await request(app)
    .post('/api/fetch')
    .send({
      parameters: {
        kilometersPerDay: 0
      }
    })
    .set('Accept', 'application/json');
    expect(res.status).toBe(500);
    expect(app).toThrow(Error);
  })
});