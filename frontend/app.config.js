import "dotenv/config";

export default {
  expo: {
    android: {
      package: "com.cheersmap.frontend",
    },
    plugins: [
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.GOOGLE_IOS_URL_SCHEME,
        },
      ],
    ],
  },
};
