const { network } = require("hardhat");
const {networkConfig, developmentChains} = require("../helper-hardhat-config");

const DECIMALS = 8;
const INITIAL_ANSWER = 200000000000;

module.exports = async (hre) => {
    const {getNamedAccounts, deployments} =  hre;
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    const chainId = network.config.chainId;

    if(developmentChains.includes(network.name))
    {
        log("Local Network Detected. Deploying mocks...");
        await deploy("MockV3Aggregator", {
            contract: "MockV3Aggregator",
            from:deployer,
            log: true,
            args: [DECIMALS, INITIAL_ANSWER],
        });
        log("Mocks Deployed");
        log("-----------------------------------------------------------------------------");
    }
}

module.exports.tags = ["all","mocks"];