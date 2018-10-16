var ethUtil = require('ethereumjs-util')
var sigUtil = require('eth-sig-util')
var ethABI = require('ethereumjs-abi')
var Web3 = require('web3')
var Eth = require('ethjs')
window.Eth = Eth

// from https://github.com/MetaMask/faq/blob/master/DEVELOPERS.md#partly_sunny-web3---ethereum-browser-environment-check
window.addEventListener('load', function() {

  // Checking if Web3 has been injected by the browser (Mist/MetaMask)
  if (typeof web3 !== 'undefined') {
    // Use Mist/MetaMask's provider
    web3js = new Web3(web3.currentProvider);
  } else {
    console.log('No web3js. You should consider trying MetaMask!')
    // fallback - use your fallback strategy (local node / hosted node + in-dapp id mgmt / fail)
    web3js = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  }

})

var fs = require('fs')
var terms = fs.readFileSync(__dirname + '/terms.txt').toString()

ethSignButton.addEventListener('click', function (event) {
  event.preventDefault()
  var msg = '0x879a053d4800c6354e76c7985a865d2922c82fb5b3f4577b2fe08b998954f2e0'
  var from = web3js.eth.accounts[0]
  web3js.eth.sign(from, msg, function (err, result) {
    if (err) return console.error(err)
    console.log('SIGNED:' + result)
  })
})

web3PersonalSignButton.addEventListener('click', function (event) {
  event.preventDefault()
  var text = 'Hi Alice'
  //var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  console.log(text)
  console.log(web3js)
  //var from = web3js.eth.accounts[0]
  var from = web3js.eth.defaultAccount
  console.log(`From address ${from}`)

  /*
    const holder = web3js.eth.accounts.sign(message, privateKey)
    holder.message, holder.messageHash, holder.signature
  */

  // https://web3js.s.readthedocs.io/en/1.0/web3js.utils.html#soliditysha3
  let msgHash = web3js.utils.soliditySha3(text).toString('hex')

  // https://programtheblockchain.com/posts/2018/02/17/signing-and-verifying-messages-in-ethereum/
  // let msgHash = '0x' + ethABI.soliditySHA3(['string'], [new Buffer(text, 'utf8')]).toString('hex')

  console.log(`msg=${text} msgHash=${msgHash} from=${from}`)

  //https://web3js.s.readthedocs.io/en/1.0/web3js.eth-personal.html#sign
  web3js.eth.personal.sign(msgHash, from, function (err, result) {
    if (err) return console.error(err)
    console.log('PERSONAL SIGNED:' + result)

    console.log('recovering...')
    const msgParams = {data: msgHash}
    msgParams.sig = result.result
    console.dir({msgParams})
    const recovered = sigUtil.recoverPersonalSignature(msgParams)
    console.dir({recovered})

    if (recovered === from) {
      console.log('SigUtil Successfully verified signer as ' + from)
    } else {
      console.dir(recovered)
      console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + from)
      console.log('Failed, comparing %s to %s', recovered, from)
    }
  })
})

personalSignButton.addEventListener('click', function (event) {
  event.preventDefault()
  var text = terms
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  // var msg = '0x1' // hexEncode(text)
  console.log(web3js)
  //console.log(msg)
  var from = web3js.eth.accounts[0]

  /*  web3js.personal.sign not yet implemented!!!
   *  We're going to have to assemble the tx manually!
   *  This is what it would probably look like, though:
    web3js.personal.sign(msg, from) function (err, result) {
      if (err) return console.error(err)
      console.log('PERSONAL SIGNED:' + result)
    })
  */

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msg, from]
  var method = 'personal_sign'

  web3js.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.error(err)
    if (result.error) return console.error(result.error)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

    console.log('recovering...')
    const msgParams = {data: msg}
    msgParams.sig = result.result
    console.dir({msgParams})
    const recovered = sigUtil.recoverPersonalSignature(msgParams)
    console.dir({recovered})

    if (recovered === from) {
      console.log('SigUtil Successfully verified signer as ' + from)
    } else {
      console.dir(recovered)
      console.log('SigUtil Failed to verify signer when comparing ' + recovered.result + ' to ' + from)
      console.log('Failed, comparing %s to %s', recovered, from)
    }

    /*
    method = 'personal_ecRecover'
    var params = [msg, result.result]
    web3js.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, recovered) {
      console.dir({ err, recovered })
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)

      if (result.result === from ) {
        console.log('Successfully verified signer as ' + from)
      } else {
        console.log('Failed to verify signer when comparing ' + result.result + ' to ' + from)
      }

    })
    */
  })

})

personalRecoverTest.addEventListener('click', function (event) {
  event.preventDefault()
  var text = 'hello!'
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  // var msg = '0x1' // hexEncode(text)
  console.log(msg)
  var from = web3js.eth.accounts[0]

  /*  web3js.personal.sign not yet implemented!!!
   *  We're going to have to assemble the tx manually!
   *  This is what it would probably look like, though:
    web3js.personal.sign(msg, from) function (err, result) {
      if (err) return console.error(err)
      console.log('PERSONAL SIGNED:' + result)
    })
  */

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msg, from]
  var method = 'personal_sign'

  web3js.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.error(err)
    if (result.error) return console.error(result.error)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

    console.log('recovering...')
    const msgParams = {data: msg}
    msgParams.sig = result.result

    method = 'personal_ecRecover'
    var params = [msg, result.result]
    web3js.currentProvider.sendAsync({
      method,
      params,
      from,
    }, function (err, result) {
      var recovered = result.result
      console.log('ec recover called back:')
      console.dir({err, recovered})
      if (err) return console.error(err)
      if (result.error) return console.error(result.error)

      if (recovered === from) {
        console.log('Successfully ecRecovered signer as ' + from)
      } else {
        console.log('Failed to verify signer when comparing ' + result + ' to ' + from)
      }

    })
  })

})

ethjsPersonalSignButton.addEventListener('click', function (event) {
  event.preventDefault()
  var text = terms
  var msg = ethUtil.bufferToHex(new Buffer(text, 'utf8'))
  var from = web3js.eth.accounts[0]

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [from, msg]

  // Now with Eth.js
  var eth = new Eth(web3js.currentProvider)

  eth.personal_sign(msg, from)
    .then((signed) => {
      console.log('Signed!  Result is: ', signed)
      console.log('Recovering...')

      return eth.personal_ecRecover(msg, signed)
    })
    .then((recovered) => {

      if (recovered === from) {
        console.log('Ethjs recovered the message signer!')
      } else {
        console.log('Ethjs failed to recover the message signer!')
        console.dir({recovered})
      }
    })
})

web3SignTypedDataButton.addEventListener('click', function (event) {
  event.preventDefault()

  const typedData = {
    types: {
      EIP712Domain: [
        {name: 'name', type: 'string'},
        {name: 'version', type: 'string'},
        {name: 'chainId', type: 'uint256'},
        {name: 'verifyingContract', type: 'address'}
      ],
      Person: [
        {name: 'name', type: 'string'},
        {name: 'wallet', type: 'address'}
      ],
      Mail: [
        {name: 'from', type: 'Person'},
        {name: 'to', type: 'Person'},
        {name: 'contents', type: 'string'}
      ]
    },
    primaryType: 'Person',
    domain: {
      name: 'Person chat',
      version: '1',
      chainId: 1
    },
    message: {
      name: 'Testing',
      wallet: '0xCD2a3d9F938E13CD947Ec05AbC7FE734Df8DD826'
    }
  }

  var from = web3js.eth.accounts[0]
  console.log('CLICKED, SENDING PERSONAL SIGN REQ')

  web3js.eth.signTypedData(typedData, from, function (err, result) {
    if (err) return console.error(err)
    if (result.error) {
      alert(result.error.message)
    }
    if (result.error) return console.error(result)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

    const recovered = sigUtil.recoverTypedSignature({data: typedData, sig: result.result})

    if (recovered === from) {
      alert('Successfully ecRecovered signer as ' + from)
    } else {
      alert('Failed to verify signer when comparing ' + result + ' to ' + from)
    }

  })
})

signTypedDataButton.addEventListener('click', function(event) {
  event.preventDefault()

  const msgParams = [
    {
      type: 'string',
      name: 'Message',
      value: 'Hi, Alice!'
    },
    {
      type: 'uint32',
      name: 'A number',
      value: '1337'
    }
  ]

  var from = web3js.eth.accounts[0]

  /*  web3js.eth.signTypedData not yet implemented!!!
   *  We're going to have to assemble the tx manually!
   *  This is what it would probably look like, though:
    web3js.eth.signTypedData(msg, from) function (err, result) {
      if (err) return console.error(err)
      console.log('PERSONAL SIGNED:' + result)
    })
  */

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msgParams, from]
  console.dir(params)
  var method = 'eth_signTypedData'

  web3js.currentProvider.sendAsync({
    method,
    params,
    from,
  }, function (err, result) {
    if (err) return console.dir(err)
    if (result.error) {
      alert(result.error.message)
    }
    if (result.error) return console.error(result)
    console.log('PERSONAL SIGNED:' + JSON.stringify(result.result))

    const recovered = sigUtil.recoverTypedSignature({ data: msgParams, sig: result.result })

    if (recovered === from ) {
      alert('Successfully ecRecovered signer as ' + from)
    } else {
      alert('Failed to verify signer when comparing ' + result + ' to ' + from)
    }

  })

})

ethjsSignTypedDataButton.addEventListener('click', function (event) {
  event.preventDefault()

  const msgParams = [
    {
      type: 'string',
      name: 'Message',
      value: 'Hi, Alice!'
    },
    {
      type: 'uint32',
      name: 'A number',
      value: '1337'
    }
  ]

  var from = web3js.eth.accounts[0]

  console.log('CLICKED, SENDING PERSONAL SIGN REQ')
  var params = [msgParams, from]

  var eth = new Eth(web3js.currentProvider)

  eth.signTypedData(msgParams, from)
    .then((signed) => {
      console.log('Signed!  Result is: ', signed)
      console.log('Recovering...')

      const recovered = sigUtil.recoverTypedSignature({data: msgParams, sig: signed})

      if (recovered === from) {
        alert('Successfully ecRecovered signer as ' + from)
      } else {
        alert('Failed to verify signer when comparing ' + signed + ' to ' + from)
      }

    })
})
