import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import scrollToComponent from 'react-scroll-to-component';

function Header(props) {
    return <nav className="navbar navbar-dark navbar-expand-lg fixed-top bg-white portfolio-navbar gradient">
        <div className="container">
            <Link to="/" className="navbar-brand logo">Histórias da minha terra</Link>
            <button data-toggle="collapse" className="navbar-toggler" data-target="#navbarNav"><span className="sr-only">Toggle navigation</span><span className="navbar-toggler-icon"></span></button>
            <div className="collapse navbar-collapse"
                id="navbarNav">
                <ul className="nav navbar-nav ml-auto">
                    <li className="nav-item" role="presentation"><NavLink to="/sobre" className="nav-link"  >Sobre</NavLink></li>
                    <li className="nav-item" role="presentation"><NavLink to="/endpoints" className="nav-link"  >API</NavLink></li>
                    <li className="nav-item" role="presentation"><NavLink to="/contato" className="nav-link"  >Contato</NavLink></li>
                </ul>
            </div>
        </div>
    </nav>;
}


export default Header