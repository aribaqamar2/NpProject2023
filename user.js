const users = [];

// join user to chat
function userJoin(id, username, room) {
    const user = { id, username, room};

    users.push(user);

    return user;
}

// Get current User
function getCurrentUser(id) {
    return users.find(user => user.id === id);
}

// User leaves chat
function userLeaves(id) {
    const index = users.findIndex(user => user.id === id);
    if(index !== -1) {
        return users.splice(index, 1)[0];
    }
}

// Get room users
function getRoomsUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    userLeaves,
    getRoomsUsers 
};