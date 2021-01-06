import { useState } from 'react';
// import axios from "axios";
import useRequest from "../../hooks/use-request";

export default () => {
    const [email, setEmail] = useState(''); // arg is the default
    const [password, setPassword] = useState('');
    // const [errors, setErrors] = useState([]);

    const { doRequest, errors } = useRequest({
        url: "/api/users/signup",
        method: "post",
        body: {
            email, password
        }
    });

    const onSubmit = async event => {
        event.preventDefault();
        // try {
        //     const response = await axios.post('/api/users/signup', {
        //         email, password
        //     });

        //     console.log(response.data);
        // } catch (err) {
        //     setErrors(err.response.data);
        // }
        
        doRequest();
    };

    return (
        <form onSubmit={onSubmit}>
            <h1>Sign up</h1>
            <div className="form-group">
                <label>Email address</label>
                <input value={email} onChange={e=>setEmail(e.target.value)} className="form-control" />
            </div>
            <div className="form-group">
                <label>Password</label>
                <input value={password} onChange={e=>setPassword(e.target.value)} type="password" className="form-control" />
            </div>
            { errors /* {errors.length > 0 && (<div className="alert alert-danger">
                <h4>Oooops...</h4>
                <ul className="my-0">
                    {errors.map(err => <li key={err.message}>{err.message}</li>)}
                </ul>
            </div>)} */ }
            <button className="btn btn-primary">Sign up</button>
        </form>
    );
};