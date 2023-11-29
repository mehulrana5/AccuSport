const express = require('express');
const schema = require('./Schema');
const fetchUser = require('./middleware/fetchUser')

// Function to get player ID by user ID
const getPlayerIdByUserId = async (userId) => {
    // Your implementation to retrieve the player ID based on the user ID
    const player = await schema.player.findOne({ user_id: userId }).select("_id");
    return player ? player._id : null;
};

// Export the function for use in other files
module.exports = {
    getPlayerIdByUserId,
};
