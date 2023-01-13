const demoToken = artifacts.require("demoToken");
const demoTokenSale = artifacts.require("demoTokenSale");

module.exports = async function(deployer) {
    // deploy token contract
    await deployer.deploy(demoToken);

    // deploy token sale contract
    await deployer.deploy(demoTokenSale, demoToken.address);
};
