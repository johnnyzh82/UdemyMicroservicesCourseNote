// import axios from 'axios';
import buildClient from "../api/build-client";

const LandingPgae = ({ currentUser }) => {
    return currentUser ? <h1>You are signed in</h1> : <h1>You're not signed in</h1>
};

LandingPgae.getInitialProps = async (context) => {
    // if (typeof window === 'undefined') {
    //     // we are on the servers!
    //     // request should be mde to http://ingress-nginx.ingress-nginx......
    //     const { data } = await axios.get(
    //         'http://ingress-nginx-controller.ingress-nginx.svc.cluster.local/api/users/currentuser', 
    //         {
    //             headers: req.headers
    //         }
    //     );
    //     return data;
    // } else {
    //     // we are on the browser!
    //     // request can be made with a base url of ''....
    //     const { data } = await axios.get('/api/users/currentuser');
    //     return data;
    // }
    const client = buildClient(context);
    const { data } = await client.get("/api/users/currentuser");
    return data;
};

export default LandingPgae;