var web3 = new Web3(Web3.givenProvider);
var contractInstance;

$(document).ready(function() {
    window.ethereum.enable().then(function(accounts) { 
        contractInstance = new web3.eth.Contract(abi, "0xEE37107AC41787c31481A96233E297f89177cC17", {from:accounts[0]});
        
        console.log(contractInstance);

        contractInstance.events.betResult(function(error, result){
            if (!error) {
                displayResult(result.returnValues.winnings);
                displayBalance(result.returnValues.balance);
            }
        });

        $("#make_bet_button").click(makeBet);
        $("#withdraw_button").click(withdraw);
        getAndDisplayBalance();
    });
});

function makeBet() {
    var amountToBet = $("#bet_input").val();

    console.log(amountToBet);

    var config = {
        value: web3.utils.toWei(amountToBet, "ether")
    }

    contractInstance.methods.makeBet().send(config)
    .on("transactionHash", function(hash) {
        console.log(hash);
        $("#result_output").text("Waiting...");
    $("#winnings_output").text("");
    })
    .on("confirmation", function(confirmationNr) {
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt) {
        console.log(receipt);
    });

    
}

function displayResult(winnings) {
    console.log(`winning ${winnings}`);
    if (winnings > 0) {
        $("#result_output").text("You won!");
        $("#winnings_output").text(web3.utils.fromWei(winnings, "ether"));
    } else {
        $("#result_output").text("Sorry, you lost :(");
        $("#winnings_output").text("");
    }
};

function getAndDisplayBalance() {
    contractInstance.methods.getBalance().call().then(function(balance) {
        displayBalance(balance);
    });
}

function displayBalance(balance) {
    console.log(`balance ${balance}`);
    $("#total_output").text(web3.utils.fromWei(balance, "ether"));
    $("#withdraw_button").prop("disabled", balance == 0);
}

function withdraw() {
    contractInstance.methods.withdrawBalance().send()
    .on("transactionHash", function(hash) {
        console.log(hash);
    })
    .on("confirmation", function(confirmationNr) {
        console.log(confirmationNr);
    })
    .on("receipt", function(receipt) {
        console.log(receipt);
        getAndDisplayBalance();
        $("#result_output").text("");
        $("#winnings_output").text("");
    });
}