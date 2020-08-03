const CoinFlip = artifacts.require("CoinFlip");
const truffleAssert = require("truffle-assertions");
const assertionError = require("assertion-error");

contract ("CoinFlip", async function(accounts) {

    let instance;
    beforeEach (async function() {
        instance = await CoinFlip.new();
     });

     it ("should fail if zero or minus payment", async function() {
        await truffleAssert.fails(instance.makeBet({value:"0"}), truffleAssert.ErrorType.REVERT);
        //await truffleAssert.fails(instance.makeBet({value:"-1"}), truffleAssert.ErrorType.REVERT);
        await truffleAssert.passes(instance.makeBet({value:"1"}));
     });

     it ("should make bet", async function() {
        await instance.makeBet({value:"100"});
        var winnings = await instance.getWinning();
        var balance = await instance.getBalance();
        assert(winnings == 200, `winnings=${winnings}, balance=${balance}`);
        assert(balance == 200, `winnings=${winnings}, balance=${balance}`);
     });

     it ("should withdraw", async function() {
        await instance.makeBet({value:"100"});
        var winnings = await instance.getWinning();
        var balance = await instance.getBalance();
        var transferred = await instance.withdrawBalance();
        assert(winnings == 200, `winnings=${winnings}, balance=${balance}, transferred=${transferred}`);
        assert(balance == 200, `winnings=${winnings}, balance=${balance}, transferred=${transferred}`);
        assert(transferred == 200, `winnings=${winnings}, balance=${balance}, transferred=${transferred}`);
   });
})