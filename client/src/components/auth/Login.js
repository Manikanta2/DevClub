import React, {Fragment, useState} from 'react';
import {Link, Redirect} from 'react-router-dom';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import {login} from '../../actions/auth';

const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const {email, password} = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value});

    const onSubmit = async e => {
        e.preventDefault();
        login(email, password);
        /*const newUser = {
            email,
            password
        };

        try{
            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            const body = JSON.stringify(newUser);

            const res = await axios.post('/api/users', body, config);
            console.log(res.data);
        } catch(err){
            console.error(err.response.data);
        }*/
    };

    // Redirect if logged in
    if(isAuthenticated){
        return <Redirect to='/dashboard' />
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead"><i className="fas fa-user"></i> Sign Into Your Account</p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input type="email" placeholder="Email Address" name="email" value={email} onChange={e => onChange(e)} required/>
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        minLength="6"
                        value={password}
                        onChange={e => onChange(e)}
                    />
                </div>
                <input type="submit" className="btn btn-primary" value="Login"/>
            </form>
            <p className="my-1">
                Doesn't have an account? <Link to="/login">Sign Un</Link>
            </p>
        </Fragment>
    )
};

Login.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool
};

const mapStateToProps = state => ({
   isAuthenticated: state.auth.isAuthenticated
});

export default connect(mapStateToProps, {login})(Login);