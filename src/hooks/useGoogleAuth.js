export const useGoogleAuthClient = (handleCredentialResponse) => {
  const client = window.google.accounts.oauth2.initTokenClient({
    client_id:
      "627921590766-95uqkbkc7ic29fcrbtc9nb61f8bp3i3g.apps.googleusercontent.com",
    scope: [
      "https://www.googleapis.com/auth/calendar",
      "https://www.googleapis.com/auth/admin.directory.resource.calendar.readonly",
      "https://www.googleapis.com/auth/admin.directory.resource.calendar",
      "https://www.googleapis.com/auth/calendar.events",
      "https://www.googleapis.com/auth/userinfo.profile",
    ].join(" "),
    callback: handleCredentialResponse,
  });

  return client;
};
