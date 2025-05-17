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
        borderColor: "#1a365c",
        borderWidth: 1,
        borderRadius: 10,
        paddingHorizontal: 16,
        marginBottom: 12,
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
      backButtonText: {
        color: "#1a365c",
        textAlign: "center",
        fontWeight: "600",
        fontSize: 16,
      },
      backButton:{
        
        marginTop: 20,
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 15,
        marginHorizontal: 8,
         borderWidth: 2,
         borderColor: "#1a365c",
        backgroundColor: "#fff",
         borderRadius: 10,
        
      },
      button: {
        marginTop: 20,
        flex: 1,
        paddingHorizontal: 24,
        paddingVertical: 15,
        marginHorizontal: 8,
        backgroundColor: "#1a365c",
      borderRadius: 10,
          
      },
      forgotPassword: {
        marginTop: 15,
        textAlign: "center",
        color: "#1a365c",
        textDecorationLine: "underline",
        
        
      },
      subtitle: {
        fontSize: 16,
        color: "#777",
        marginBottom: 15,
        textAlign: "center",
      },
      error: {
        color: "red",
        fontSize: 14,
        marginBottom: 10,
      },
      
//
center: {
  flex: 1,
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: "#000",
},
previewRow: {
  flexDirection: "row",
  gap: 8,
},
thumb: {
  width: 120,
  height: 160,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: "#666",
},
overlay: {
  position: "absolute",
  bottom: 40,
  width: "100%",
  alignItems: "center",
},
countdown: {
  fontSize: 48,
  color: "white",
  fontWeight: "bold",
},
shutter: {
  width: 80,
  height: 80,
  borderRadius: 40,
  borderWidth: 4,
  borderColor: "white",
  justifyContent: "center",
  alignItems: "center",
},
shutterInner: {
  width: 60,
  height: 60,
  borderRadius: 30,
  backgroundColor: "white",
},


loadingText: {
  color: "#fff",
},
permissionText: {
  color: "#fff",
  marginBottom: 12,
},
camera: {
  flex: 1,
},
backPreviewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
frontPreviewContainer: {
    position: "absolute",
    top: 25,
    left: 25,
    width: 100,
    height: 140,
    borderWidth: 1.5,
    borderColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    zIndex: 10,
  },
  
  frontPreview: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  


    });