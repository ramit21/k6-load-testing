import {Rate} from "k6/metrics"
import http from "k6/http"

export let errorRate = new Rate("errors"), options = {
    scenarios: {
        contacts: {
            executor: 'constant-arrival-rate', //K6 will try to maintain the given iteration rate, and add more VUs as needed to achieve same
            
            //how long test case runs
            duration: '1m',

            //iterations per unit of time
            rate: 50,
            timeUnit: '1s',

            //Max Virtual User limit
            preAllocatedVUs: 50

        }
    },
    threshold: {
        'http_req_duration': ['p(99) < 10000'], //99% of requests take less than 10 sec
        errors: ["rate<0.01"]
    },
    insecureSkipTLSVerify: true
};

//Setup method is called once, use it to generate one time activities like login jwts etc. and pass over to default method
//Right now passing base url below just to show how to pass over values to the main default function
export const setup = () => {
    const baseUrl = "http://localhost:8080/"
    return { baseUrl: baseUrl, headers: {'Content-type' : 'application/json', 'Accept' : '*/*'} }
};

/*
 This default method is what is called under load. This is where you place code to call your APIs
 More the no of api calls, or more complex the logic (eg. waiting on result of one api call before calling other),
 more the no. of VUs k6 will try to spin to achieve the given iteration rate.
*/
export default (config) => {
    const getResponse = http.get(config.baseUrl+'reserve/all', config.headers);
    errorRate.add(getResponse.status !== 200);

    const requestBody = { name : 'User' };
    const postResponse = http.post(config.baseUrl+'reserve/save', JSON.stringify(requestBody), config.headers);
    console.log(postResponse);
    errorRate.add(postResponse.status !== 200);
}
