const { ethers } = require("hardhat");

async function main() {
  console.log("开始部署《灵境宠界》智能合约...");

  // 获取合约工厂
  const SpiritToken = await ethers.getContractFactory("SpiritToken");
  const SpiritPet = await ethers.getContractFactory("SpiritPet");
  const SpiritLand = await ethers.getContractFactory("SpiritLand");
  const BattleSystem = await ethers.getContractFactory("BattleSystem");

  console.log("1. 部署灵晶代币合约 (SpiritToken)...");
  const spiritToken = await SpiritToken.deploy();
  await spiritToken.deployed();
  console.log(`✅ SpiritToken 部署完成: ${spiritToken.address}`);

  console.log("2. 部署灵宠NFT合约 (SpiritPet)...");
  const baseURI = "https://api.spiritreampets.com/metadata/pets/";
  const spiritPet = await SpiritPet.deploy(baseURI);
  await spiritPet.deployed();
  console.log(`✅ SpiritPet 部署完成: ${spiritPet.address}`);

  console.log("3. 部署地块NFT合约 (SpiritLand)...");
  const landURI = "https://api.spiritreampets.com/metadata/lands/{id}.json";
  const spiritLand = await SpiritLand.deploy(landURI, spiritToken.address);
  await spiritLand.deployed();
  console.log(`✅ SpiritLand 部署完成: ${spiritLand.address}`);

  console.log("4. 部署战斗系统合约 (BattleSystem)...");
  const battleSystem = await BattleSystem.deploy(spiritPet.address, spiritToken.address);
  await battleSystem.deployed();
  console.log(`✅ BattleSystem 部署完成: ${battleSystem.address}`);

  console.log("5. 设置合约权限...");
  
  // 给地块合约和战斗系统铸币权限
  const MINTER_ROLE = await spiritToken.MINTER_ROLE();
  const BURNER_ROLE = await spiritToken.BURNER_ROLE();
  
  await spiritToken.grantRole(MINTER_ROLE, spiritLand.address);
  console.log("✅ 已授予SpiritLand铸币权限");
  
  await spiritToken.grantRole(MINTER_ROLE, battleSystem.address);
  console.log("✅ 已授予BattleSystem铸币权限");
  
  await spiritToken.grantRole(BURNER_ROLE, spiritLand.address);
  console.log("✅ 已授予SpiritLand销毁权限");
  
  await spiritToken.grantRole(BURNER_ROLE, battleSystem.address);
  console.log("✅ 已授予BattleSystem销毁权限");

  // 给战斗系统设置灵宠经验增长权限（需要在SpiritPet中添加相关函数）
  
  console.log("\n🎉 所有合约部署完成!");
  console.log("==========================================");
  console.log("合约地址汇总:");
  console.log(`SpiritToken:  ${spiritToken.address}`);
  console.log(`SpiritPet:    ${spiritPet.address}`);
  console.log(`SpiritLand:   ${spiritLand.address}`);
  console.log(`BattleSystem: ${battleSystem.address}`);
  console.log("==========================================");

  // 保存合约地址到文件
  const fs = require('fs');
  const contractAddresses = {
    SpiritToken: spiritToken.address,
    SpiritPet: spiritPet.address,
    SpiritLand: spiritLand.address,
    BattleSystem: battleSystem.address,
    network: (await ethers.provider.getNetwork()).name
  };

  fs.writeFileSync(
    '../frontend/src/contracts/addresses.json',
    JSON.stringify(contractAddresses, null, 2)
  );
  console.log("✅ 合约地址已保存到 frontend/src/contracts/addresses.json");

  // 验证合约（仅在测试网上）
  if ((await ethers.provider.getNetwork()).name !== "hardhat") {
    console.log("\n等待区块确认后进行合约验证...");
    await spiritToken.deployTransaction.wait(6);
    
    try {
      await hre.run("verify:verify", {
        address: spiritToken.address,
        constructorArguments: [],
      });
      console.log("✅ SpiritToken 合约验证完成");
    } catch (error) {
      console.log("❌ SpiritToken 合约验证失败:", error.message);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("部署失败:", error);
    process.exit(1);
  });