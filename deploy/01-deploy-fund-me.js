const { network } = require("hardhat");
const { networkConfig, developmentChains } = require("../helper-hardhat-config");
require("dotenv").config();
const { verify } = require("../utils/verify");


module.exports = async (hre) => {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    const chainId = network.config.chainId;

    let ethUsdPriceFeedAddress;
    if (developmentChains.includes(network.name)) {
        const ethUsdAggregator = await deployments.get("MockV3Aggregator");
        ethUsdPriceFeedAddress = ethUsdAggregator.address;
    }
    else {
        ethUsdPriceFeedAddress = networkConfig[chainId]["ethUsdPriceFeed"]
    }
    const fundMe = await deploy("FundMe", {
        from: deployer,
        log: true,
        args: [ethUsdPriceFeedAddress],
        waitConfirmations: network.config.blockConfirmations || 1, 
    });

    if (!developmentChains.includes(network.name) && process.env.ETHERSCAN_API_KEY) {
        await verify(fundMe.address, [ethUsdPriceFeedAddress]);
    }

    log("FundMe Deployed");
    log("-----------------------------------------------------------------------------");
}

module.exports.tags = ["all", "fundme"];