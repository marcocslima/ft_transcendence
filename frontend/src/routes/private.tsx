import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'pages/Home/home';
import CommonLayout from 'components/Layout';
import Chat from 'pages/Chat';
import { Game } from 'components/Game';
import Register from 'pages/Register';
import HistoricTable from 'components/HistoricTable';
import Statistics from 'components/Statistics';
import { UserStatusUpdater } from '../utils/user-status';

const PrivateRoutes: React.FC = () => {
  UserStatusUpdater();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game-options" element={<Game />} />
          <Route path="/message" element={<Chat />} />
          <Route
            path="/profile/:username"
            element={<Register content="profile-data" />}
          />
          <Route
            path="/profile/:username/edit"
            element={<Register content="profile-edit" />}
          />
          <Route
            path="/profile/:username/security"
            element={<Register content="security" />}
          />
          <Route path="/historic" element={<HistoricTable />} />
          <Route path="/statistics" element={<Statistics />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default PrivateRoutes;
