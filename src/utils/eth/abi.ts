export const ERC20_ABI = [
  // Read-Only Functions
  "function balanceOf(address owner) view returns (uint256)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",

  // Authenticated Functions
  "function transfer(address to, uint amount) returns (bool)",
  "function approve(address _spender, uint256 _value) returns (bool)",

  // Events
  "event Transfer(address indexed from, address indexed to, uint amount)",
];

export const WETH_ABI = [
  // Wrap ETH
  "function deposit() payable",

  // Unwrap ETH
  "function withdraw(uint wad) public",
];
