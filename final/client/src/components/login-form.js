import React, { useState } from 'react';
import styled, { css } from 'react-emotion';
import { size } from 'polished';

import Button from './button';
import space from '../assets/images/space.jpg';
import { ReactComponent as Logo } from '../assets/logo.svg';
import { ReactComponent as Curve } from '../assets/curve.svg';
import { ReactComponent as Rocket } from '../assets/rocket.svg';
import { colors, unit } from '../styles';

export default function LoginForm(props) {
  const [state, setState] = useState({ email: '', password: '' });

  function handleInputChange(event) {
    setState({...state, [event.target.name]: event.target.value});
  }

  function onSubmit(event) {
    event.preventDefault();
    localStorage.setItem('loggingIn', '1');
    props.login({ variables: { email: state.email, password: state.password } });
  }

  return (
    <Container>
      <Header>
        <StyledCurve />
        <StyledLogo />
      </Header>
      <StyledRocket />
      <Heading>Space Explorer</Heading>
      <Subheading>Create a new account or login with your credentials</Subheading>
      <StyledForm onSubmit={onSubmit}>
        <StyledInput
          required
          type="email"
          name="email"
          placeholder="Email"
          data-testid="login-input"
          onChange={handleInputChange}
          autoFocus
        />
        <StyledInput
          required
          type="password"
          name="password"
          placeholder="Password"
          data-testid="login-input"
          onChange={handleInputChange}
        />
        <Button type="submit">Log in</Button>
      </StyledForm>
    </Container>
  );
}

/**
 * STYLED COMPONENTS USED IN THIS FILE ARE BELOW HERE
 */

const Container = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  flexGrow: 1,
  paddingBottom: unit * 6,
  color: 'white',
  backgroundColor: colors.primary,
  backgroundImage: `url(${space})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
});

const svgClassName = css({
  display: 'block',
  fill: 'currentColor',
});

const Header = styled('header')(svgClassName, {
  width: '100%',
  marginBottom: unit * 5,
  padding: unit * 2.5,
  position: 'relative',
});

const StyledLogo = styled(Logo)(size(56), {
  display: 'block',
  margin: '0 auto',
  position: 'relative',
});

const StyledCurve = styled(Curve)(size('100%'), {
  fill: colors.primary,
  position: 'absolute',
  top: 0,
  left: 0,
});

const Heading = styled('h1')({
  margin: `${unit * 3}px 0 ${unit * 6}px`,
});

const Subheading = styled('h5')({
  width: `428px`,
  textAlign: `center`,
  marginBottom: `15px`
});

const StyledRocket = styled(Rocket)(svgClassName, {
  width: 250,
});

const StyledForm = styled('form')({
  width: '100%',
  maxWidth: 406,
  padding: unit * 3.5,
  borderRadius: 3,
  boxShadow: '6px 6px 1px rgba(0, 0, 0, 0.25)',
  color: colors.text,
  backgroundColor: 'white',
});

const StyledInput = styled('input')({
  width: '100%',
  marginBottom: unit * 2,
  padding: `${unit * 1.25}px ${unit * 2.5}px`,
  border: `1px solid ${colors.grey}`,
  fontSize: 16,
  outline: 'none',
  ':focus': {
    borderColor: colors.primary,
  },
});
