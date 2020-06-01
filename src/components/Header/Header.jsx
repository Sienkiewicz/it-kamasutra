import React from 'react';
import s from './Header.module.scss';
import { NavLink } from 'react-router-dom';

const Header = (props) => {
  return (
    <header className='header'>
      <img
        src='https://images.vexels.com/media/users/3/137692/isolated/preview/e425fa1fe274a2267405829771f13a13-simple-logo-geometric-polygonal-by-vexels.png'
        alt=''
      />
		<div className={s.loginBlock}>
			{props.isAuth ? props.login : <NavLink to={'/login'}>Login</NavLink>}
			</div>
    </header>
  );
};

export default Header;
