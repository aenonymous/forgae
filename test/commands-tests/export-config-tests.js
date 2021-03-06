const chai = require('chai');
const chaiFiles = require('chai-files');
const assert = chai.assert;
chai.use(chaiFiles);

const forgaeExecute = require('../../packages/forgae-utils/utils/forgae-utils.js').forgaeExecute;
const fs = require('fs-extra');
const path = require('path');

const forgaeConfigDefaultFileName = require('./../../packages/forgae-cli/forgae-export/constants').forgaeConfigFileName;
const constants = require('../constants.json');
// const cliCmds = constants.cliCommands;
// const cliSubCmds = constants.cliSubCommands;

const testWorkingDir = constants.exportForgaeConfigTestsFolderPath;

let cwd = process.cwd();

const expectedTerminalOutput = {
    networkId: 'ae_devnet',
    host: 'http://localhost:3001',
    internalHost: 'http://localhost:3001/internal',
    compilerUrl: 'http://localhost:3080',
    minerWallet: {
        publicKey: 'ak_2mwRmUeYmfuW93ti9HMSUJzCk1EYcQEfikVSzgo6k2VghsWhgU',
        secretKey: 'bb9f0b01c8c9553cfbaf7ef81a50f977b1326801ebf7294d1c2cbccdedf27476e9bbf604e611b5460a3b3999e9771b6f60417d73ce7c5519e12f7e127a1225ca'
    },
    defaultWallets: [{
        publicKey: 'ak_fUq2NesPXcYZ1CcqBcGC3StpdnQw3iVxMA3YSeCNAwfN4myQk',
        secretKey: '7c6e602a94f30e4ea7edabe4376314f69ba7eaa2f355ecedb339df847b6f0d80575f81ffb0a297b7725dc671da0b1769b1fc5cbe45385c7b5ad1fc2eaf1d609d'
    },
    {
        publicKey: 'ak_tWZrf8ehmY7CyB1JAoBmWJEeThwWnDpU4NadUdzxVSbzDgKjP',
        secretKey: '7fa7934d142c8c1c944e1585ec700f671cbc71fb035dc9e54ee4fb880edfe8d974f58feba752ae0426ecbee3a31414d8e6b3335d64ec416f3e574e106c7e5412'
    },
    {
        publicKey: 'ak_FHZrEbRmanKUe9ECPXVNTLLpRP2SeQCLCT6Vnvs9JuVu78J7V',
        secretKey: '1509d7d0e113528528b7ce4bf72c3a027bcc98656e46ceafcfa63e56597ec0d8206ff07f99ea517b7a028da8884fb399a2e3f85792fe418966991ba09b192c91'
    }
    ]
};

describe('ForgAE Export Forgae Config', async () => {

    let workingDir;

    beforeEach(async () => {
        workingDir = path.join(cwd, testWorkingDir);

        await fs.ensureDirSync(workingDir);
        process.chdir(workingDir);
    });

    it('Should terminal output is correct', async () => {
        let result = await forgaeExecute('export-config');
        result = JSON.parse(result);
        
        assert.equal(JSON.stringify(result), JSON.stringify(expectedTerminalOutput), "Configuration mismatch!");
    });

    it('Should export forgae config file with default path', async () => {
        await forgaeExecute('export-config');
        assert.isOk(fs.existsSync('./forgaeConfig.json'), "Missing forgae config json file!");
    });

    it('Should export forgae config file with random path', async () => {
        const someRandomPath = './wer/fvfgbh/setsdg/sdg.asd.json'
        await forgaeExecute('export-config', [
            '--path',
            someRandomPath
        ]);
        assert.isOk(fs.existsSync(someRandomPath), "Missing forgae config json file!");
    });

    it('Exported forgae configuration should be equal to expected one with default path', async () => {
        await forgaeExecute('export-config');
        let exportedForgaeConfig = fs.readFileSync('./forgaeConfig.json', 'utf8');

        assert.equal(JSON.stringify(JSON.parse(exportedForgaeConfig)), JSON.stringify(expectedTerminalOutput));
    });

    it('Exported forgae configuration should be equal to expected one with random path', async () => {
        const someRandomPath = './oeirhjg/ierugn/dfhtf/sgsrr/ertrd.json'
        await forgaeExecute('export-config', [
            '--path',
            someRandomPath
        ]);

        let exportedForgaeConfig = fs.readFileSync(someRandomPath, 'utf8');

        assert.equal(JSON.stringify(JSON.parse(exportedForgaeConfig)), JSON.stringify(expectedTerminalOutput));
    });

    it('Should export forgae configuration, destination is only directories without filename and extension', async () => {
        const someRandomPath = './a3///tyjtjtyr/sfgedgb/dgnfhf/ththrth///ethrhr'
        await forgaeExecute('export-config', [
            '--path',
            someRandomPath
        ]);

        assert.isOk(fs.existsSync(path.join(someRandomPath, forgaeConfigDefaultFileName)), "Missing forgae config json file!");
    });

    it('Exported forgae configuration should be equal to expected one, destination is only directories without filename and extension', async () => {
        const someRandomPath = './a2/rgdt/dehthrth/edthr///sdfsgsgweq3332/ethreth'
        await forgaeExecute('export-config', [
            '--path',
            someRandomPath
        ]);

        let exportedForgaeConfig = fs.readFileSync(path.join(someRandomPath, forgaeConfigDefaultFileName), 'utf8');

        assert.equal(JSON.stringify(JSON.parse(exportedForgaeConfig)), JSON.stringify(expectedTerminalOutput));
    });

    afterEach(async () => {
        // delete test folder
        fs.removeSync(workingDir);

        process.chdir(cwd);
    })
});