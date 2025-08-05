const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SpiritPet", function () {
  let spiritPet;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const SpiritPet = await ethers.getContractFactory("SpiritPet");
    spiritPet = await SpiritPet.deploy("https://api.spiritreampets.com/metadata/pets/");
    await spiritPet.deployed();
  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await spiritPet.owner()).to.equal(owner.address);
    });

    it("Should set the correct name and symbol", async function () {
      expect(await spiritPet.name()).to.equal("SpiritPet");
      expect(await spiritPet.symbol()).to.equal("SPIRIT");
    });

    it("Should set the correct starter box price", async function () {
      expect(await spiritPet.starterBoxPrice()).to.equal(ethers.utils.parseEther("0.01"));
    });
  });

  describe("Starter Box Purchase", function () {
    it("Should allow users to buy starter box", async function () {
      const price = await spiritPet.starterBoxPrice();
      
      await expect(spiritPet.connect(addr1).buyStarterBox({ value: price }))
        .to.emit(spiritPet, "PetMinted")
        .withArgs(0, addr1.address, "Starter Pet");
      
      expect(await spiritPet.balanceOf(addr1.address)).to.equal(1);
      expect(await spiritPet.ownerOf(0)).to.equal(addr1.address);
    });

    it("Should fail if payment is insufficient", async function () {
      const price = await spiritPet.starterBoxPrice();
      const insufficientPrice = price.div(2);
      
      await expect(
        spiritPet.connect(addr1).buyStarterBox({ value: insufficientPrice })
      ).to.be.revertedWith("Insufficient payment");
    });

    it("Should create pet with correct initial attributes", async function () {
      const price = await spiritPet.starterBoxPrice();
      await spiritPet.connect(addr1).buyStarterBox({ value: price });
      
      const petData = await spiritPet.getPetData(0);
      
      expect(petData.attributes.level).to.equal(1);
      expect(petData.attributes.experience).to.equal(0);
      expect(petData.attributes.generation).to.equal(0);
      expect(petData.attributes.isAlive).to.equal(true);
      expect(petData.name).to.equal("Starter Pet");
      expect(petData.parent1).to.equal(0);
      expect(petData.parent2).to.equal(0);
    });
  });

  describe("Pet Breeding", function () {
    beforeEach(async function () {
      // 购买两只灵宠用于繁殖
      const price = await spiritPet.starterBoxPrice();
      await spiritPet.connect(addr1).buyStarterBox({ value: price });
      await spiritPet.connect(addr1).buyStarterBox({ value: price });
    });

    it("Should allow breeding two pets", async function () {
      const breedingFee = await spiritPet.breedingFee();
      
      await expect(
        spiritPet.connect(addr1).breedPets(0, 1, "Bred Pet", { value: breedingFee })
      ).to.emit(spiritPet, "PetMinted");
      
      expect(await spiritPet.balanceOf(addr1.address)).to.equal(3);
      
      const childPet = await spiritPet.getPetData(2);
      expect(childPet.parent1).to.equal(0);
      expect(childPet.parent2).to.equal(1);
      expect(childPet.attributes.generation).to.equal(1);
    });

    it("Should fail if breeding fee is insufficient", async function () {
      const breedingFee = await spiritPet.breedingFee();
      const insufficientFee = breedingFee.div(2);
      
      await expect(
        spiritPet.connect(addr1).breedPets(0, 1, "Bred Pet", { value: insufficientFee })
      ).to.be.revertedWith("Insufficient breeding fee");
    });

    it("Should fail if user doesn't own the pets", async function () {
      const breedingFee = await spiritPet.breedingFee();
      
      await expect(
        spiritPet.connect(addr2).breedPets(0, 1, "Bred Pet", { value: breedingFee })
      ).to.be.revertedWith("Not owner of parent1");
    });

    it("Should fail if trying to breed pet with itself", async function () {
      const breedingFee = await spiritPet.breedingFee();
      
      await expect(
        spiritPet.connect(addr1).breedPets(0, 0, "Bred Pet", { value: breedingFee })
      ).to.be.revertedWith("Cannot breed with itself");
    });
  });

  describe("Pet Level Up", function () {
    beforeEach(async function () {
      const price = await spiritPet.starterBoxPrice();
      await spiritPet.connect(addr1).buyStarterBox({ value: price });
    });

    it("Should allow pet owner to level up pet", async function () {
      await expect(spiritPet.connect(addr1).levelUpPet(0, 100))
        .to.emit(spiritPet, "PetLevelUp")
        .withArgs(0, 2);
      
      const petData = await spiritPet.getPetData(0);
      expect(petData.attributes.level).to.equal(2);
      expect(petData.attributes.experience).to.equal(100);
    });

    it("Should fail if non-owner tries to level up pet", async function () {
      await expect(
        spiritPet.connect(addr2).levelUpPet(0, 100)
      ).to.be.revertedWith("Not pet owner");
    });

    it("Should not level up beyond max level", async function () {
      // Level up to max level (50)
      await spiritPet.connect(addr1).levelUpPet(0, 4900); // 49 * 100 = 4900 exp for level 50
      
      const petData = await spiritPet.getPetData(0);
      expect(petData.attributes.level).to.equal(50);
      
      // Try to level up beyond max
      await spiritPet.connect(addr1).levelUpPet(0, 1000);
      const petDataAfter = await spiritPet.getPetData(0);
      expect(petDataAfter.attributes.level).to.equal(50); // Should stay at max level
    });
  });

  describe("Contract Management", function () {
    it("Should allow owner to withdraw funds", async function () {
      const price = await spiritPet.starterBoxPrice();
      await spiritPet.connect(addr1).buyStarterBox({ value: price });
      
      const ownerBalanceBefore = await owner.getBalance();
      const contractBalance = await ethers.provider.getBalance(spiritPet.address);
      
      await spiritPet.withdraw();
      
      const ownerBalanceAfter = await owner.getBalance();
      expect(ownerBalanceAfter).to.be.gt(ownerBalanceBefore);
    });

    it("Should fail if non-owner tries to withdraw", async function () {
      await expect(
        spiritPet.connect(addr1).withdraw()
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });

    it("Should allow owner to set base URI", async function () {
      const newBaseURI = "https://new-api.spiritreampets.com/metadata/pets/";
      await spiritPet.setBaseURI(newBaseURI);
      
      // We can't directly test the base URI getter since it's internal,
      // but we can test that the function doesn't revert
    });
  });

  describe("Total Supply", function () {
    it("Should track total supply correctly", async function () {
      expect(await spiritPet.totalSupply()).to.equal(0);
      
      const price = await spiritPet.starterBoxPrice();
      await spiritPet.connect(addr1).buyStarterBox({ value: price });
      expect(await spiritPet.totalSupply()).to.equal(1);
      
      await spiritPet.connect(addr2).buyStarterBox({ value: price });
      expect(await spiritPet.totalSupply()).to.equal(2);
    });

    it("Should respect max supply", async function () {
      const maxSupply = await spiritPet.maxSupply();
      expect(maxSupply).to.equal(100000);
    });
  });
});