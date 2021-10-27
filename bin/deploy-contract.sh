npx hardhat run scripts/deploy.js --network rinkeby
mv artifacts/contracts/NoNonsenseNftGame.sol/NoNonsenseNftGame.json utilities
git add utils/NoNonsenseNftGame.json
echo "\n****************"
echo "Remember to update your contract address in the UI!"
echo "****************"
