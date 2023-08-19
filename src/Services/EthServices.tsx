import { JsonRpcProvider, ethers } from "ethers";

export const sendEther = async ({ provider, sender, receiver, privateKey, amount }: {
  provider: JsonRpcProvider,
  sender: string,
  receiver: string,
  privateKey: string,
  amount: string
}) => {
  const wallet = new ethers.Wallet(privateKey, provider);
  return await wallet.sendTransaction({
    from: sender,
    to: receiver,
    value: ethers.parseEther(amount)
  });
}

// receive ether
export const receiveEther = async ({ provider, privateKey }: {
  provider: JsonRpcProvider,
  privateKey: string
}) => {
  const wallet = new ethers.Wallet(privateKey, provider);
  const receipentAddress = wallet.address;

  provider.on('pending', async (tx) => {
    try {
      const transaction = await provider.getTransaction(tx);
      if (transaction?.to === receipentAddress) {
        console.log('Transaction received');
        console.log(transaction);
      }
    } catch (err) {
      console.error(err);
    }
  });
  console.log('Listening to incoming transaction to receipent address: ' + receipentAddress);
}