import { ethers } from 'ethers';
import CryptoJS from 'crypto-js';

// generate mnemonics
export const generateWallet = (): ethers.HDNodeWallet => {
  const wallet = ethers.Wallet.createRandom();
  return wallet;
};

// restore wallet from mnemonics
export const restoreWallet = (mnemonics: string) => {
  const wallet = ethers.Wallet!.fromPhrase(mnemonics);
  return wallet;
}

// get encrypted mnemonics
export const getEncryptedMnemonics = (mnemonics: string, passKey: string) => {
  const encryptedMnemonics = CryptoJS.AES.encrypt(mnemonics, passKey);
  return encryptedMnemonics.toString();
}

// get decrypted mnemonics from local storage
export const getDecryptedMnemonics = (encryptedMnemonics: string, passKey: string) => {
  const decryptedMnemonics = CryptoJS.AES.decrypt(encryptedMnemonics, passKey);
  return decryptedMnemonics.toString(CryptoJS.enc.Utf8);
}