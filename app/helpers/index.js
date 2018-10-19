exports.usersToShow = users => {
  const userToShow = [];
  users.forEach(params => {
    userToShow.push({
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email
    });
  });
  return userToShow;
};
