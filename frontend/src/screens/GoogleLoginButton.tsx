import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from "@react-native-google-signin/google-signin";

GoogleSignin.configure({
  webClientId: "<FROM DEVELOPER CONSOLE>", // client ID of type WEB for your server. Required to get the `idToken` on the user object, and for offline access.
  scopes: ["https://www.googleapis.com/auth/drive.readonly"], // what API you want to access on behalf of the user, default is email and profile
  forceCodeForRefreshToken: false, // [Android] related to `serverAuthCode`, read the docs link below *.
  iosClientId: "<FROM DEVELOPER CONSOLE>",
});

<GoogleSigninButton
  size={GoogleSigninButton.Size.Wide}
  color={GoogleSigninButton.Color.Dark}
  onPress={() => {
    // initiate sign in
  }}
  disabled={false}
/>;
