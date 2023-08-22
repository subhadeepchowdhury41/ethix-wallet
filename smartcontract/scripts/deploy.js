

async function main() {
  const Greetings = await ethers.getContractFactory("Greetings");
  const res = await Greetings.deploy("Subhadeep Chowdhury deployed this contract!");
  console.log("Contract deployed to address:", res.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
