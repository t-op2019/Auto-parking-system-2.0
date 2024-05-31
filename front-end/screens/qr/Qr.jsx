import QrDetail from "../../components/qr_components/QrDetail";
import {
  Modal,
  View,
  Text,
  TextInput,
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import idl from "../../idl.json";
import * as anchor from "@project-serum/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { getProgram } from "../../utils/solanaHelper";
import { Context } from "../../App";
import { useContext } from "react";

export default function Qr() {
  const [ userPubkey,setUserPubkey ] = useContext(Context);
  const connection = new Connection(
    "https://api.devnet.solana.com",
    "confirmed"
  );
  // const provider = new anchor.AnchorProvider(
  //   connection,
  //   wallet,
  //   anchor.AnchorProvider.defaultOptions()
  // );
  // anchor.setProvider(provider);
  // const programId = new PublicKey(
  //   "6pAhjEV2iy9wJmyybVMqaVAi3q6K9sxxiZ5P23XSz188"
  // );
  // const program = new anchor.Program(idl, programId);

  const [isWithdrawalModalVisible, setIsWithdrawalModalVisible] =
    useState(false);
  const [isFundModalVisible, setIsFundModalVisible] = useState(false);
  const [type, setType] = useState("");

  useEffect(()=>{
    console.log(userPubkey)
  },[])
  const depositSOL = async (amount) => {
    try {
      const program = await getProgram();
      console.log("program", program)
      const userPublicKey = userPubkey;

      // Get the pool and vault accounts (assumes initialization has been done)
      const pool = await program.account.pool.all();
      const poolAccount = pool[0].publicKey; // Assuming a single pool

      await program.rpc.deposit(new anchor.BN(amount), {
        accounts: {
          depositor: userPublicKey,
          pool: poolAccount,
          vault: new PublicKey(pool[0].account.vault),
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      });

      console.log("Deposit successful");
    } catch (error) {
      console.error("Error during deposit:", error);
    }
  };

  const withdrawSOL = async (amount) => {
    try {
      const program = await getProgram();
      const userPublicKey = userPubkey;

      // Get the pool and vault accounts (assumes initialization has been done)
      const pool = await program.account.pool.all();
      const poolAccount = pool[0].publicKey; // Assuming a single pool

      await program.rpc.withdraw(new anchor.BN(amount), {
        accounts: {
          receiver: userPublicKey,
          pool: poolAccount,
          vault: new PublicKey(pool[0].account.vault),
          systemProgram: anchor.web3.SystemProgram.programId,
        },
      });

      console.log("Withdraw successful");
    } catch (error) {
      console.error("Error during withdraw:", error);
    }
  };

  const handleSubmit = async () => {
    // Handle the submit action here. `actionType` could be 'withdrawal' or 'fund'

    await depositSOL(0.5)
    Alert.alert("Success", "Your submission was successful.", [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);

    // Close the modal
    setIsWithdrawalModalVisible(false);
    setIsFundModalVisible(false);

    // Optionally reset the type input
    setType("");

  };
  return (
    <ScrollView>
      <View style={styles.container}>
        <QrDetail />
        <View style={{ display: "flex", flexDirection: "row", marginTop: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: "#0056b3", // Slightly darker blue for more contrast
              paddingVertical: 14,
              paddingHorizontal: 30,
              borderRadius: 30, // More pronounced rounded corners for a pill-like shape
              elevation: 12, // More pronounced shadow for a floating effect
              marginVertical: 10, // Add vertical margin for better spacing
              marginHorizontal: 5,
              justifyContent: "center", // Center button text or content
              alignItems: "center",
              width: 150,
            }}
            onPress={() => setIsWithdrawalModalVisible(true)}
          >
            <Text style={styles.buttonText}>Withdraw</Text>
          </TouchableOpacity>

          {/* Fund Button */}
          <TouchableOpacity
            style={{
              backgroundColor: "green", // Slightly darker blue for more contrast
              paddingVertical: 14,
              paddingHorizontal: 30,
              borderRadius: 30, // More pronounced rounded corners for a pill-like shape
              elevation: 12, // More pronounced shadow for a floating effect
              marginVertical: 10, // Add vertical margin for better spacing
              marginHorizontal: 5,
              justifyContent: "center", // Center button text or content
              alignItems: "center",
              width: 150,
            }}
            onPress={() => setIsFundModalVisible(true)}
          >
            <Text style={styles.buttonText}>Deposit</Text>
          </TouchableOpacity>
        </View>
        {/* Withdrawal Button */}

        {/* Withdrawal Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isWithdrawalModalVisible}
          onRequestClose={() => setIsWithdrawalModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Withdrawal</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Total: </Text>
                <TextInput
                  style={styles.input}
                  value={type}
                  onChangeText={setType}
                  keyboardType="numeric"
                />
                <Text style={{ position: "absolute", bottom: 5, right: 10 }}>
                  SOL
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Pressable
                  style={[styles.button, styles.closeBtn]}
                  onPress={() => setIsWithdrawalModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.submitBtn]}
                  onPress={() => handleSubmit("withdrawal")}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>

        {/* Fund Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={isFundModalVisible}
          onRequestClose={() => setIsFundModalVisible(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Deposit</Text>
              <View
                style={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "bold" }}>Total: </Text>
                <TextInput
                  style={styles.input}
                  value={type}
                  onChangeText={setType}
                  keyboardType="numeric"
                />
                <Text style={{ position: "absolute", bottom: 5, right: 10 }}>
                  SOL
                </Text>
              </View>
              <View style={{ display: "flex", flexDirection: "row" }}>
                <Pressable
                  style={[styles.button, styles.closeBtn]}
                  onPress={() => setIsFundModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Close</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.submitBtn]}
                  onPress={() => handleSubmit("withdrawal")}
                >
                  <Text style={styles.buttonText}>Submit</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F0F2F5", // Light background color for contrast
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
