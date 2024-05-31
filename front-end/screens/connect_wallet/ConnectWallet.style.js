import { StyleSheet } from "react-native";
import { COLORS } from "../../constants";
export const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: COLORS.DARK_GREY,
      flexGrow: 1,
      position: "relative",
    },
    greenDot: {
      height: 8,
      width: 8,
      borderRadius: 10,
      marginRight: 5,
      backgroundColor: COLORS.GREEN,
    },
    header: {
      width: "95%",
      marginLeft: "auto",
      marginRight: "auto",
    },
    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 5,
    },
    spinner: {
      position: "absolute",
      alignSelf: "center",
      top: "50%",
      zIndex: 1000,
    },
    text: {
      color: COLORS.LIGHT_GREY,
      width: "100%",
    },
    wallet: {
      alignItems: "center",
      margin: 10,
      marginBottom: 15,
    },
    button: {
      backgroundColor: "#0056b3", // Slightly darker blue for more contrast
      // paddingVertical: 14,
      // paddingHorizontal: 30,
      borderRadius: 30, // More pronounced rounded corners for a pill-like shape
      elevation: 12, // More pronounced shadow for a floating effect
      marginVertical: 10, // Add vertical margin for better spacing
      marginHorizontal: 5,
      justifyContent: "center", // Center button text or content
      alignItems: "center",
      width: 122, // Set a fixed width for the button
    },
    deposit: {
      backgroundColor: "green", // Slightly darker blue for more contrast
      paddingVertical: 14,
      paddingHorizontal: 30,
      borderRadius: 30, // More pronounced rounded corners for a pill-like shape
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.37,
      shadowRadius: 7.49,
      elevation: 12, // More pronounced shadow for a floating effect
      margin: 12,
      width: 150,
      marginVertical: 10, // Add
    },
    buttonText: {
      color: "white",
      fontSize: 14, // Slightly larger text for readability
      fontWeight: "bold", // Medium font weight for emphasis
      textAlign: "center", // Ensure text is centered
    },
    modalView: {
      display: "flex",
      flexDirection: "column",
      gap: 8,
      width: 250,
      margin: 20,
      backgroundColor: "white",
      borderRadius: 20,
      padding: 35,
      alignItems: "center",
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 4,
      },
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: adds a semi-transparent overlay
    },
    input: {
      borderWidth: 0, // Removing border
      borderBottomWidth: 2, // Adding a bottom border for a minimalist design
      borderBottomColor: "#0056b3", // Bottom border color to match button
      flex: 1,
      fontSize: 16, // Larger font size for better readability
      color: "#333", // Darker font color for contrast
      borderRadius: 5, // Slightly rounded corners for the input
      backgroundColor: "#FFF", // Ensure the input background is white for visibility
    },
    submitBtn: {
      backgroundColor: "#0056b3",
      width: 100, // Set a fixed width for the button
      height: 40, // Slightly darker blue for more contrast
    },
    closeBtn: {
      backgroundColor: "red", // Red color for contrast // Add margin around the button for spacing
      width: 100, // Set a fixed width for the button
      height: 40,
    },
    modalTitle: {
      marginBottom: 15,
      textAlign: "center",
      fontWeight: "bold",
      fontSize: 20,
    },
    buttonContainer: {
      flexDirection: "row",
      justifyContent: "space-around", // Evenly space the buttons within the container
      marginTop: 20, // Add some margin at the top for spacing
      width: "100%", // Ensure the container takes up the full width of its parent
      paddingHorizontal: 10, // Add padding to prevent buttons from touching the container edges
    },
  });