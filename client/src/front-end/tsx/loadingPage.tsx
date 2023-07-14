import React, { useContext, useEffect, useState } from 'react';
import MyHeader from './header';
import '../css/loadingPage.css'
import loop from '../img/918482bf17436bf12a7015c4e0ab8a0f.gif'
function LoadingPage(): JSX.Element {
    return (
        <div>
            <MyHeader />
            <div className='mainDisplay'>
                <div className="loading-contaiter">
                    <img id='loop' src={loop} alt="" />
                    <p className="flickering-text">Waiting For Opponent Respond</p>
                </div>

            </div>
        </div>
    );
}

export default LoadingPage;
