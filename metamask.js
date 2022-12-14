const Web3 = require('web3')
Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send

const web3 = new Web3()
// web3.setProvider(new web3.providers.HttpProvider('https://newest-ultra-reel.rinkeby.discover.quiknode.pro/c57187cdbda3ccf50abb7f727dd6ff052a1b5851'))
web3.setProvider(new web3.providers.HttpProvider('http://localhost:8545'))
const privateKey = '0x348ce564d427a3311b6536bbcff9390d69395b06ed6c486954e971d960fe8709'
const account = web3.eth.accounts.privateKeyToAccount(privateKey)
console.log(account)
signature = web3.eth.accounts.sign('Some data', privateKey)
console.log(signature)
const msgParams = JSON.stringify({
    domain: {
      // Defining the chain aka Rinkeby testnet or Ethereum Main Net
      chainId: 1,
      // Give a user friendly name to the specific contract you are signing for.
      name: 'Ether Mail',
      // If name isn't enough add verifying contract to make sure you are establishing contracts with the proper entity
      verifyingContract: '0xCcCCccccCCCCcCCCCCCcCcCccCcCCCcCcccccccC',
      // Just let's you know the latest version. Definitely make sure the field name is correct.
      version: '1',
    },

    // Defining the message signing data content.
    message: {
      /*
       - Anything you want. Just a JSON Blob that encodes the data you want to send
       - No required fields
       - This is DApp Specific
       - Be as explicit as possible when building out the message schema.
      */
      contents: 'Hello, Bob!',
      attachedMoneyInEth: 4.2,
      from: {
        name: 'Cow',
        wallets: [
          '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826',
          '0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF',
        ],
      },
      to: [
        {
          name: 'Bob',
          wallets: [
            '0xbBbBBBBbbBBBbbbBbbBbbbbBBbBbbbbBbBbbBBbB',
            '0xB0BdaBea57B0BDABeA57b0bdABEA57b0BDabEa57',
            '0xB0B0b0b0b0b0B000000000000000000000000000',
          ],
        },
      ],
    },
    // Refers to the keys of the *types* object below.
    primaryType: 'Mail',
    types: {
      // TODO: Clarify if EIP712Domain refers to the domain the contract is hosted on
      EIP712Domain: [
        { name: 'name', type: 'string' },
        { name: 'version', type: 'string' },
        { name: 'chainId', type: 'uint256' },
        { name: 'verifyingContract', type: 'address' },
      ],
      // Not an EIP712Domain definition
      Group: [
        { name: 'name', type: 'string' },
        { name: 'members', type: 'Person[]' },
      ],
      // Refer to PrimaryType
      Mail: [
        { name: 'from', type: 'Person' },
        { name: 'to', type: 'Person[]' },
        { name: 'contents', type: 'string' },
      ],
      // Not an EIP712Domain definition
      Person: [
        { name: 'name', type: 'string' },
        { name: 'wallets', type: 'address[]' },
      ],
    },
  });

var from = web3.eth.accounts[0];

var params = [from, msgParams];
var method = 'eth_signTypedData_v4';

console.log(web3.currentProvider)

web3.currentProvider.sendAsync(
  {
    method,
    params,
    from,
  },
  function (err, result) {
    if (err) return console.dir(err);
    if (result.error) {
      alert(result.error.message);
    }
    if (result.error) return console.error('ERROR', result);
    console.log('TYPED SIGNED:' + JSON.stringify(result.result));

    const recovered = sigUtil.recoverTypedSignature_v4({
      data: JSON.parse(msgParams),
      sig: result.result,
    });

    if (
      ethUtil.toChecksumAddress(recovered) === ethUtil.toChecksumAddress(from)
    ) {
      alert('Successfully recovered signer as ' + from);
    } else {
      alert(
        'Failed to verify signer when comparing ' + result + ' to ' + from
      );
    }
  }
);
