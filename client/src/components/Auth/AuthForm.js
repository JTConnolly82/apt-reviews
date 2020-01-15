import React from 'react';


const AuthForm = (props) => {
  const { name, password, handleChange, handleSubmit, btnText } = props;
  return (
    <>
      <h1 style={{marginBottom: '10px'}}>{btnText}</h1>
      <form className='auth-form' onSubmit={handleSubmit}>
        <input type="text"
              name="name"
              value={name}
              onChange={handleChange}
              placeholder='user name'
              />
        <input type="text"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder='password'
              />
        <button>{btnText}</button>
      </form>
    </>
  )
}


export default AuthForm;