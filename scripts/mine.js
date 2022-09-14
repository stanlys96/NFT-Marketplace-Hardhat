const { moveBlocks } = require('../utils/move-blocks');

async function mine() {
  await moveBlocks(5, (sleepAmount = 1000));
}

mine()
  .then(() => process.exit(0))
  .catch((e) => {
    console.log(e);
    process.exit(1);
  });
