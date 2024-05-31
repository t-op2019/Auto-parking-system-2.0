import {
  clusterApiUrl,
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
} from "@solana/web3.js";
import bs58 from "bs58";
import { Buffer } from "buffer";
import * as Linking from "expo-linking";
import { React, useEffect, useState, useCallback, useContext } from "react";
import { Text, View } from "react-native";
import "react-native-get-random-values";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "react-native-url-polyfill/auto";
import nacl from "tweetnacl";
import Button from "../../components/common/Button";
import { buildUrl } from "../../utils/buildUrl";
import { decryptPayload } from "../../utils/decryptPayload";
import { encryptPayload } from "../../utils/encryptPayload";
import { styles } from "./ConnectWallet.style";
import { useNavigation } from "@react-navigation/native";
import asyncStorage from "@react-native-async-storage/async-storage";
import generateQRCodeBase64 from "../../utils/genQr";
import { v4 as uuidv4 } from "uuid";
import { Context } from "../../App";
import * as anchor from "@project-serum/anchor";
import IDL from "../../idl.json";

global.Buffer = global.Buffer || Buffer;

const onConnectRedirectLink = Linking.createURL("onConnect");
const onDisconnectRedirectLink = Linking.createURL("onDisconnect");
const onSignMessageRedirectLink = Linking.createURL("onSignMessage");
const PROGRAM_ID = new anchor.web3.PublicKey("6pAhjEV2iy9wJmyybVMqaVAi3q6K9sxxiZ5P23XSz188");
const connection = new Connection(clusterApiUrl("devnet"));

export default function ConnectWallet() {
  const [signMsg, setSignMsg] = useState();
  const [publicKey, setPublicKey] = useState(null);
  const [dappKeyPair] = useState(nacl.box.keyPair());
  const [sharedSecret, setSharedSecret] = useState();
  const [session, setSession] = useState();
  const [deepLink, setDeepLink] = useState("");
  const [balance, setBalance] = useState(0);
  const [storagePublicKey, setStoragePublicKey] = useState("");
  const [userPubkey, setUserPubkey] = useContext(Context);

  const navigation = useNavigation();
  useEffect(() => {
    asyncStorage.setItem(
      "Private QR",
      "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMQAAADECAIAAABPxBk8AAAAAXNSR0IB2cksfwAABWlJREFUeJzt3UGO3DAMRNF0kPtfebL1hgAJ/pLVg/+Wgcf2JAWFkGTq8/Pz80ci/H37BfR7GCZhDJMwhkkYwySMYRLGMAljmIQxTMIYJmEMkzCGSRjDJIxhEsYwCfNv+gOfzwd/ieeequr+1TWdn0282+bPnza/y8nfvcORSRjDJIxhEmZcMz1t9o9v/o+vntupS6rrN3VP51kd02dV3vp3cWQSxjAJY5iEWdVMT9N5kek1m3mX6RxP532o53buM32fzrM296w4MgljmIQxTMJgNROFWmOi6jNqTZD6vai5qARHJmEMkzCGSZjraqbNHp235m+odbTEnqSTHJmEMUzCGCZhsJopMeeR2G9U3X/zPptnpeukk3NRjkzCGCZhDJMwq5op8f89NX+z2btN7QGf3ue2dcApRyZhDJMwhkmYcc301h6aTt1A1TfVczv32aD6DrzFkUkYwySMYRJm1Z9p01epQtUKiTqmeu4N+5ASvaDsz6TXGCZhDJMw2DzT5rv6zrM6c0ub+1T3pPakb77jq66Z/p2k6zxHJmEMkzCGSZhPYk0n0a8yse6W6KVEPSs9f0bto39yZBLGMAljmIRZ1Uzpb8fStcVmfSrxDtT9XZvT1zNMwhgmYbD9TJ3rT96nUzdQcz+d96xqlJPzRukz+xyZhDFMwhgmYVb7majzTE72LEg8dzpPQ32LR62rUn8PjkzCGCZhDJMwkT7g0/5DiWs2EvvNT57vm7h/hyOTMIZJGMMkTKQPeOK8tk0d9rTpOZnos9CZAzt5Bt+GI5MwhkkYwyQMVjMl6qTq/hVqT9L0fRLPpfanU9/9dTgyCWOYhDFMwmDfzd1WryQk1rY2c13VfSrU93EVRyZhDJMwhkmY1Xdz1Z9P91xTZ+sm1t2q527qtpNrbek66cmRSRjDJIxhEmY8z5RY60l/bz+9JvGsJ2qejJpzompBRyZhDJMwhkmYVc30Vr2V+P++c/+T9zlZd1oz6TqGSRjDJEykP9PmTLp0nZTuUdm5JlFrdnjenL6GYRLGMAkTOW+ufNjBfksnz1RJ9ymYSpz31+HIJIxhEsYwCRPpaZnoYZ0+p+Wt2mXzPtQ7T8+TqTgyCWOYhDFMwsTPm6O+U+v8bOL7tc17Vtekv+/rSPRrcGQSxjAJY5iEWe1nekr0IOig9jml1wc357Fsrjm5x9+RSRjDJIxhEgbrz0T930ztN6Ik9q1X13T+nOqBOb2mw5FJGMMkjGESJrKf6YmaZ5reJ9G7srqmcvK7ts3fj2en6DqGSRjDJAy2NjdF7SV6SszldN5taroH663eBFOOTMIYJmEMkzCRXgMna5F0T8vqWW/dJ7EO6B5wXccwCWOYhPnKPuCde07vn/i2/2T/zA7nmfQ1DJMwhkkYbJ4p0bMx3fs73T+pc/3muVTNN32HiiOTMIZJGMMkzKpmmtY0b+2zqSTmjU72KaC4NqfrGCZhDJMwR89O6Th5/m4H1Qch0YuBOl+PqmUdmYQxTMIYJmGw/kwb1DpU+lnpuaXN70vVlPYa0BUMkzCGSZhVf6aTZ7El6ifqXJTpPSvp9c302SyOTMIYJmEMkzBYT0vqXN70uWyJ9bL0z3buuflZqgZ1ZBLGMAljmISJ9wGfSqz9UT21N9ds3qeyWSu0D7iuZpiEMUzCXFczbaT3R1PzQ9RZwptnTc9U7nBkEsYwCWOYhDna0zJ9nw6qD+f0noleUNXPpntvVhyZhDFMwhgmYVbzTOl1tM58zLRemdYfiX3oVP+C2zgyCWOYhDFMwlzXn0nfy5FJGMMkjGESxjAJY5iEMUzCGCZhDJMwhkkYwySMYRLGMAljmIQxTMIYJmH+A4FZe76sv2HmAAAAAElFTkSuQmCC"
    );
    asyncStorage.setItem("publicKey", "GQ");
  }, []);
  useEffect(() => {
    const initializeDeeplinks = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        setDeepLink(initialUrl);
      }
    };
    initializeDeeplinks();
    const listener = Linking.addEventListener("url", handleDeepLink);
    return () => {
      listener.remove();
    };
  }, []);

  const handleDeepLink = ({ url }) => {
    setDeepLink(url);
  };

  useEffect(() => {
    const saveDataInStorage = async (data) => {
      try {
        await asyncStorage.setItem("publicKey", data.publicKey);
        await asyncStorage.setItem("signature", data.signature);
        let randomString = uuidv4();
        const url = await generateQRCodeBase64(
          data.publicKey,
          randomString,
          data.signature
        );
        // it's not work for now
        await asyncStorage.setItem("Private QR", url);
      } catch (e) {
        console.log(e);
      }
    };
    if (!deepLink) return;
    console.log("deepLink: ", deepLink);
    const url = new URL(deepLink);
    const params = url.searchParams;

    // Handle an error response from Phantom
    if (params.get("errorCode")) {
      const error = Object.fromEntries([...params]);
      const message =
        error?.errorMessage ??
        JSON.stringify(Object.fromEntries([...params]), null, 2);
      console.log("error: ", message);
      return;
    }

    if (/onConnect/.test(url.pathname)) {
      const sharedSecretDapp = nacl.box.before(
        bs58.decode(params.get("phantom_encryption_public_key")),
        dappKeyPair.secretKey
      );
      const connectData = decryptPayload(
        params.get("data"),
        params.get("nonce"),
        sharedSecretDapp
      );
      setSharedSecret(sharedSecretDapp);
      setSession(connectData.session);
      setPublicKey(new PublicKey(connectData.public_key));
      setUserPubkey(connectData.public_key.toString());
      console.log(`connected to ${connectData.public_key.toString()}`);
      console.log(`shared secret when connect: ${sharedSecretDapp}`);
    }

    if (/onSignMessage/.test(url.pathname)) {
      setSignMsg(params.get("data"));
      const data = decryptPayload(
        params.get("data"),
        params.get("nonce"),
        sharedSecret
      );
      saveDataInStorage(data);

      console.log("============");
      console.log("data", data);
      console.log(`shared secret when sign: ${sharedSecret}`);
      // console.log(bs58.decode(params.get("data")))
    }
    if (/onDisconnect/.test(url.pathname)) {
      setPublicKey(null);
      console.log("disconnected");
    }
  }, [deepLink]);

  const connect = async () => {
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      cluster: "devnet",
      app_url: "exp://192.168",
      redirect_link: onConnectRedirectLink,
    });

    const url = buildUrl("connect", params);
    Linking.openURL(url);
  };

  const disconnect = async () => {
    const payload = {
      session,
    };
    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);
    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onDisconnectRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    const url = buildUrl("disconnect", params);
    Linking.openURL(url);
  };

  const updateBalance = async () => {
    if (publicKey) {
      const balance = await connection.getBalance(publicKey);
      setBalance(balance / LAMPORTS_PER_SOL);
    }
  };

  const signMessage = async () => {
    const message = uuidv4();

    const payload = {
      session,
      message: bs58.encode(Buffer.from(message)),
    };

    const [nonce, encryptedPayload] = encryptPayload(payload, sharedSecret);

    const params = new URLSearchParams({
      dapp_encryption_public_key: bs58.encode(dappKeyPair.publicKey),
      nonce: bs58.encode(nonce),
      redirect_link: onSignMessageRedirectLink,
      payload: bs58.encode(encryptedPayload),
    });
    console.log("++++++++++++++++++++");
    const url = buildUrl("signMessage", params);
    Linking.openURL(url);
    // setSignMsg(url)
  };
  const retrieveData = async () => {
    try {
      const value = await AsyncStorage.getItem("publicKey");
      if (value !== null) {
        setStoragePublicKey(value);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    updateBalance();
    retrieveData();
  }, [publicKey]);

  return (
    <SafeAreaProvider>
      <SafeAreaView>
        <View style={styles.header}>
          {publicKey || storagePublicKey ? (
            <>
              <View style={[styles.row, styles.wallet]}>
                <View style={styles.greenDot} />
                <Text
                  style={styles.text}
                  numberOfLines={1}
                  ellipsizeMode="middle"
                >
                  {`Connected to: ${publicKey.toString()}`}
                </Text>
              </View>
              <View style={styles.row}>
                <Text style={styles.balanceText}>{`Balance: ${balance.toFixed(
                  2
                )} SOL`}</Text>
              </View>
              <View style={styles.row}>
                <Button title="Sign Message" onPress={signMessage} />
              </View>
              <Text>{signMsg}</Text>
              {/* <Text> {bs58.decode(signMsg)}</Text> */}
              <View style={styles.row}>
                <Button title="Disconnect" onPress={disconnect} />
              </View>
            </>
          ) : (
            <View style={{ marginTop: 15 }}>
              <Button title="Connect Phantom" onPress={connect} />
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
