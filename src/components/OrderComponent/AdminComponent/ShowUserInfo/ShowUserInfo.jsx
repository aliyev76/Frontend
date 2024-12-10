import React, { useState, useEffect } from 'react';
import { getUserById } from '../../../../api/auth'; // Import the function

const ShowUserInfo = ({ userId }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getUserById(userId); // Fetch user by ID
        
        // Assuming the response structure is { user: {...} }
        if (response && response.user) {
          setUser(response.user); // Update the user state with the user object
        } else {
          setError('User not found');
        }
      } catch (err) {
        setError('Failed to load user data');
        console.error(err); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId]); // Re-fetch if userId changes

  // Display loading state
  if (loading) {
    return <div>Loading...</div>;
  }

  // Display error message if there was an issue
  if (error) {
    return <div>{error}</div>;
  }

  // Display if user is not found
  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <h2>User Information</h2>
      <p><strong>Name:</strong> {user.username || 'N/A'}</p>
      <p><strong>Email:</strong> {user.email || 'N/A'}</p>
      <p><strong>Username:</strong> {user.username || 'N/A'}</p>
      <p><strong>Phone:</strong> {user.phone || 'N/A'}</p>
      <p><strong>Address:</strong> {user.address || 'N/A'}</p>
      <p><strong>Role:</strong> {user.role || 'N/A'}</p>
      {/* Add other fields as needed */}
    </div>
  );
};

export default ShowUserInfo;

