import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

    container: {
        flex: 1,
        paddingHorizontal: 30,
        justifyContent: "center",
        backgroundColor: "#f7f5f3",
      },
      title: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 10,
        textAlign: "center",
      },
      input: {
        height: 50,
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
      },
      registerButton: {
        backgroundColor: "#1a365c",
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
      },
      loginButton: {
        backgroundColor: "#1a365c",
        paddingVertical: 15,
        borderRadius: 10,
        marginTop: 10,
      },
      buttonText: {
        color: "#fff",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 16,
      },
      forgotPassword: {
        marginTop: 15,
        textAlign: "center",
        color: "#edf2fa",
        textDecorationLine: "underline",
      },
      subtitle: {
        fontSize: 16,
        color: "#777",
        marginBottom: 30,
        textAlign: "center",
      },
      

    });