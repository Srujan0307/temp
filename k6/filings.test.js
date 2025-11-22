import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 500 }, // ramp up to 500 users over 2 minutes
    { duration: '5m', target: 500 }, // stay at 500 users for 5 minutes
    { duration: '2m', target: 0 }, // ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests must complete within 2000ms
    http_req_failed: ['rate<0.01'], // error rate must be less than 1%
  },
};

export default function () {
  const res = http.get('http://localhost:3000/filings');
  check(res, {
    'is status 200': (r) => r.status === 200,
  });
  sleep(1);
}
