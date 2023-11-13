# k6-load-testing
Performance test using K6 load testing

## Steps to run the load test
1. Install k6 on machine: https://k6.io/docs/get-started/installation/
2. Run a microservice: https://github.com/ramit21/springbootpoc
3. Invoke the load test:
```
k6 run loadtest.js
```
4. Monitor the report generated, esp errors and http_req_duration p(95).

Note how we pass headers, and post request body when making http calls.