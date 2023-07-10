import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LoginPage from "./loginPage";
import FA from './2FA'
import DSTeam from './discoverTeam'
import Home from './home'
import MyHeader from "./header";
import MyProfileUser from './myProfileUser';
import OtherProfileUser from "./otherProfileUser";
import LeaderBoard from './leaderBoard';
import Play from './play'
import QRpopup from './QRpopup'
import InviteFriend from './inviteFriend'

function App()
{

  return(<MyProfileUser />);
}

export default App;