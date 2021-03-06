module.exports = function (RED) {
	'use strict';
	var smartmeterObis = require('smartmeter-obis');

	function SmartmeterNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		node.smartmeterDatasource = RED.nodes.getNode(config.datasource);
		if (node.smartmeterDatasource) {
			var options = {
				'protocol': config.protocol,
				'transport': config.transport,
				'transportSerialPort': node.smartmeterDatasource.serialport,
				'transportSerialBaudrate': node.smartmeterDatasource.serialbaud,
				'transportSerialDataBits': node.smartmeterDatasource.databits,
				'transportSerialStopBits': node.smartmeterDatasource.stopbits,
				'transportSerialParity': node.smartmeterDatasource.parity,
				'requestInterval': config.requestInterval,
				'transportHttpRequestUrl': `${node.smartmeterDatasource.hostname}:${node.smartmeterDatasource.hostport}`,
				'transportLocalFilePath': node.smartmeterDatasource.filepath,
				'obisNameLanguage': 'de',
				'obisFallbackMedium': 6
			};

			function sendData(obisResult) {
				const msg = {
					payload: obisResult
				};
				node.send(msg);
			}

			var smTransport = smartmeterObis.init(options, sendData);
			smTransport.process();

			node.on('close', function () {
				smTransport.stop();
			});
		}
	}
	RED.nodes.registerType('smartmeter', SmartmeterNode);
}