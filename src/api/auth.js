import API from './api'; // Import the API instance

// Helper to generate a unique key for user-specific data
const getAuthKey = (username) => `auth_${username}`;

// Function to refresh the authentication token
export const refreshAuthToken = async (username) => {
  try {
    const authKey = getAuthKey(username);
    const userData = JSON.parse(localStorage.getItem(authKey)); // Fetch user-specific data

    if (!userData || !userData.refreshToken) {
      console.error(`No refresh token found for user: ${username}`);
      throw new Error('No refresh token found');
    }

    // Attempt to refresh the token
    const response = await API.post('/auth/refresh-token', { refreshToken: userData.refreshToken });
    const { token: newToken, refreshToken: newRefreshToken } = response.data;

    if (newToken) {
      // Update user-specific data in localStorage
      localStorage.setItem(
        authKey,
        JSON.stringify({
          ...userData,
          token: newToken,
          refreshToken: newRefreshToken || userData.refreshToken, // Use new refresh token if provided
        })
      );
      console.log(`Token refreshed successfully for user: ${username}`);
      return newToken;
    }

    throw new Error('No new token returned from refresh');
  } catch (error) {
    console.error(`Error refreshing token for user: ${username}`, error.response?.data || error.message);

    // Handle invalid or expired refresh token
    if (error.response?.status === 401) {
      localStorage.removeItem(getAuthKey(username)); // Clear user data
      window.location.href = '/login'; // Redirect to login
    }

    throw new Error('Failed to refresh token');
  }
};

// Fetch user profile based on the stored auth token
export const getUserProfile = async (username, navigate) => {
  try {
    const authKey = getAuthKey(username);
    const userData = JSON.parse(localStorage.getItem(authKey)); // Fetch user-specific data

    if (!userData || !userData.token) {
      console.error(`Authentication token is missing for user: ${username}`);
      throw new Error('Authentication token is missing');
    }

    // Fetch the user's profile
    const response = await API.get('/auth/profile', {
      headers: {
        'Authorization': `Bearer ${userData.token}`,
      },
    });

    return response.data.user; // Assuming API response structure is { user: ... }
  } catch (error) {
    console.error(`Error fetching profile for user: ${username}`, error.response?.data || error.message);

    // Attempt token refresh if expired
    if (error.response?.data?.error === 'Unauthorized: Token expired') {
      try {
        await refreshAuthToken(username); // Refresh token
        return getUserProfile(username, navigate); // Retry fetching the profile
      } catch (refreshError) {
        console.error(`Failed to refresh token for user: ${username}`);
        // navigate('/login'); // Redirect to login
      }
    }

    throw error;
  }
};

// User Registration
export const register = async (data) => {
  try {
    const response = await API.post('/auth/register', data);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  }
};

// Login Function
export const login = async (data, navigate) => {
  try {
    const response = await API.post('/auth/login', data);
    const { token, refreshToken, user } = response.data;

    // Store user-specific data in localStorage
    localStorage.setItem(
      getAuthKey(user.username),
      JSON.stringify({ token, refreshToken, profile: user })
    );

    navigate(`/user/${user.username}/dashboard`); // Redirect to user's dashboard
    return { token, user };
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);

    if (error.response?.status === 401) {
      // navigate('/login'); // Redirect to login if unauthorized
      console.log(error)
    }

    throw error;
  }
};

// Forgot Password Request
export const forgotPassword = async (email) => {
  try {
    const response = await API.post('/auth/forgot-password', { email });
    return response.data;
  } catch (error) {
    console.error('Forgot Password Error:', error.response?.data || error.message);
    throw error;
  }
};

// Reset Password API
export const resetPassword = async (data) => {
  try {
    const response = await API.post('/auth/reset-password', data);
    return response.data;
  } catch (error) {
    console.error('Reset Password Error:', error.response?.data || error.message);
    throw error;
  }
};

// Contact API
export const contact = async (data) => {
  try {
    const response = await API.post('/auth/contact', data);
    return response.data;
  } catch (error) {
    console.error('Contact Error:', error.response?.data || error.message);
    throw error;
  }
};

// Update User Profile
export const updateUserProfile = async (username, updatedData) => {
  try {
    const authKey = getAuthKey(username);
    const userData = JSON.parse(localStorage.getItem(authKey)); // Fetch user-specific data

    if (!userData || !userData.token) {
      console.error(`Authentication token is missing for user: ${username}`);
      throw new Error('Authentication token is missing');
    }

    // Perform profile update
    const response = await API.put('/auth/profile', updatedData, {
      headers: {
        'Authorization': `Bearer ${userData.token}`, // Send token in Authorization header
      },
    });

    // Update profile in localStorage
    const updatedProfile = response.data.user;
    localStorage.setItem(
      authKey,
      JSON.stringify({
        ...userData,
        profile: updatedProfile,
      })
    );

    return updatedProfile; // Return updated profile
  } catch (error) {
    console.error('Update Profile Error:', error.response?.data || error.message);

    // Handle expired token
    if (error.response?.data?.error === 'Unauthorized: Token expired') {
      await refreshAuthToken(username);
      return updateUserProfile(username, updatedData); // Retry updating the profile
    }

    throw error;
  }
};

export const getUserById = async (userId) => {
  try {
    // Retrieve user data from localStorage to get the token
    const authKey = `auth_${localStorage.getItem('username')}`;
    const userData = JSON.parse(localStorage.getItem(authKey));

    if (!userData || !userData.token) {
      throw new Error('Authentication token is missing');
    }

    // Make the fetch call with the Authorization header
    const response = await fetch(`http://localhost:5000/api/auth/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${userData.token}`,  // Pass the token in the header
      },
    });

    const text = await response.text();  // Get raw text response for debugging
    console.log('Response Text:', text);  // Log raw response

    if (!response.ok) {
      throw new Error(`Failed to fetch. Status: ${response.status}`);
    }

    try {
      const data = JSON.parse(text);  // Parse JSON if successful
      return data;
    } catch (parseError) {
      throw new Error('Failed to parse JSON response');
    }

  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw new Error('Failed to fetch user data');
  }
};

