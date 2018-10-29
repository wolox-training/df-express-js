exports.usersToShow = users => {
  const userToShow = users.map(params => {
    return {
      firstName: params.firstName,
      lastName: params.lastName,
      email: params.email
    };
  });
  return userToShow;
};
