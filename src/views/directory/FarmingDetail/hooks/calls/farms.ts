import { ethers } from 'ethers';
import { calculateGasMargin } from 'utils'

export const stakeFarm = async (masterChefContract, pid, amount, performanceFee, gasPrice) => {
  const value = ethers.utils.parseEther(amount).toString()

  let gasLimit = await masterChefContract.estimateGas.deposit(pid, value, {value: performanceFee});
  gasLimit = calculateGasMargin(gasLimit)

  const tx = await masterChefContract.deposit(pid, value, { gasPrice, gasLimit, value: performanceFee })
  const receipt = await tx.wait()
  return receipt
}

export const unstakeFarm = async (masterChefContract, pid, amount, performanceFee, gasPrice) => {
  const value = ethers.utils.parseEther(amount).toString()
  
  let gasLimit = await masterChefContract.estimateGas.withdraw(pid, value, {value: performanceFee});
  gasLimit = calculateGasMargin(gasLimit)

  const tx = await masterChefContract.withdraw(pid, value, {gasPrice, gasLimit, value: performanceFee })
  const receipt = await tx.wait()
  return receipt
}

export const emergencyUnstakeFarm = async (masterChefContract, pid, gasPrice) => {
  let gasLimit = await masterChefContract.estimateGas.emergencyWithdraw(pid);
  gasLimit = calculateGasMargin(gasLimit)

  const tx = await masterChefContract.emergencyWithdraw(pid, {gasPrice, gasLimit })
  const receipt = await tx.wait()
  return receipt
}

export const harvestFarm = async (masterChefContract, pid, performanceFee, gasPrice) => {
  let gasLimit = await masterChefContract.estimateGas.deposit(pid, '0', {value: performanceFee});
  gasLimit = calculateGasMargin(gasLimit)

  const tx = await masterChefContract.deposit(pid, '0', {gasPrice, gasLimit, value: performanceFee })
  const receipt = await tx.wait()
  return receipt
}
