var chai = require("chai");
var sinon = require("sinon");
var chaiAsPromised = require("chai-as-promised");
var sinonChai = require("sinon-chai");

chai.use(chaiAsPromised);
chai.use(sinonChai);

global.expect = chai.expect;
global.sinon = sinon;