// import axios from 'axios';
// import buildClient from "../api/build-client";
import Link from 'next/link';

const LandingPgae = ({ currentUser, tickets }) => {
    // return currentUser ? <h1>You are signed in</h1> : <h1>You're not signed in</h1>
    const ticketList = tickets.map(ticket => {
        const ref = '/tickets/' + ticket.id;
        return (
            <tr key={ticket.id}>
                <td>{ticket.title}</td>
                <td>{ticket.price}</td>
                <td>                    
                    <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
                        <a>View</a>
                    </Link>
                </td>
            </tr>
        );
    });
    return (
        <div>
            <h1>Tickets</h1>
            <table className="table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Price</th>
                        <th>Link</th>
                    </tr>
                </thead>
                <tbody>
                    {ticketList}
                </tbody>
            </table>
        </div>
    );
};

LandingPgae.getInitialProps = async (context, client, currentUser) => {
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

    // const client = buildClient(context);
    // const { data } = await client.get("/api/users/currentuser");
    // return data;

    const { data } = await client.get('/api/tickets');

    return { tickets: data };
};

export default LandingPgae;