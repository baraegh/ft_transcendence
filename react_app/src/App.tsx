import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginPage from "./tsx/loginPage";
import FA from './tsx/2FA'
import DSTeam from './tsx/discoverTeam'
import Home from './tsx/home'
import MyHeader from "./tsx/header";
import MyProfileUser from './tsx/myProfileUser';
import OtherProfileUser from "./tsx/otherProfileUser";
import LeaderBoard from './tsx/leaderBoard';
import Play from './tsx/play'
import QRpopup from './tsx/QRpopup'


function App()
{

  return(<MyProfileUser />);
}

export default App;