import React from 'react';
import { useOutletContext } from 'react-router-dom';
import UserTables from '../../../../components/OrderComponent/UserComponent/UserTables/UserTables';

const UserOrder = () => {
  const { userProfile } = useOutletContext(); // Access userProfile from the layout context

  return (
    <div>
      <h1>{userProfile.username}'s Orders</h1>
      <UserTables />
    </div>
  );
};

export default UserOrder;

