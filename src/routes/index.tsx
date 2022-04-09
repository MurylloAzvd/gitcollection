import React from 'react';
import { Switch, Route } from 'react-router-dom';

const Dashboard = React.lazy(() => import('../pages/Dashboard'));
const Repo = React.lazy(() => import('../pages/Repo'));

export const Routes: React.FC = () => {
  return (
    <React.Suspense fallback={<div>Carregando...</div>}>
      <Switch>
        <Route component={Dashboard} path="/" exact />
        <Route component={Repo} path="/repositories/:repository+" />
      </Switch>
    </React.Suspense>
  );
};
