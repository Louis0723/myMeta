
declare let ENV


if (ENV) {
    let env = ENV;
}

export let env=(function env(){
    let env={
        env:null,
        ethUrl:null
    };
    if (ENV === 'production') {
        env={
            env: ENV,
            ethUrl: 'https://mainnet.infura.io/Uw7vEslp5bpgqPgNkm05'
        }
    } else {
        console.log('this is development mode')
        env={
            env : ENV,
            ethUrl: 'https://ropsten.infura.io/Uw7vEslp5bpgqPgNkm05'
        }
    }
    return env
})()

