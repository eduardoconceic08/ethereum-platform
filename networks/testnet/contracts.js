window.contracts={"Indexer":{"address":"0x71c6866378e2cf5fa32ee5243f0ef5b3d7eb6c75","interface":[{"constant":false,"inputs":[{"name":"contentID","type":"uint256"},{"name":"accountID","type":"address"},{"name":"channelID","type":"uint256"},{"name":"timestamp","type":"uint256"}],"name":"index","outputs":[],"payable":false,"type":"function"}]},"Publisher":{"address":"0x5285164d0057b65135a9579d05811db8281ef56a","interface":[{"constant":true,"inputs":[{"name":"contentID","type":"uint256"}],"name":"getContentAccount","outputs":[{"name":"","type":"address"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getOverallSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"accountID","type":"address"},{"name":"channelID","type":"uint256"},{"name":"attributes","type":"string"},{"name":"document","type":"string"}],"name":"getContentByData","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"contentID","type":"uint256"}],"name":"getContentChannel","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"contentID","type":"uint256"}],"name":"getContentTimestamp","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"channelName","type":"string"},{"name":"attributes","type":"string"},{"name":"document","type":"string"},{"name":"indexer","type":"address"}],"name":"publish","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"str","type":"string"}],"name":"getChannelByName","outputs":[{"name":"channelID","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[{"name":"channelID","type":"uint256"}],"name":"getChannelSize","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"CRED","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[],"type":"constructor"},{"payable":false,"type":"fallback"},{"anonymous":false,"inputs":[{"indexed":true,"name":"contentID","type":"uint256"},{"indexed":true,"name":"accountID","type":"address"},{"indexed":true,"name":"channelID","type":"uint256"},{"indexed":false,"name":"attributes","type":"string"},{"indexed":false,"name":"sizeBytes","type":"uint256"},{"indexed":false,"name":"timestamp","type":"uint256"}],"name":"Publish","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"contentID","type":"uint256"},{"indexed":true,"name":"accountID","type":"address"},{"indexed":true,"name":"channelID","type":"uint256"},{"indexed":false,"name":"attributes","type":"string"},{"indexed":false,"name":"document","type":"string"}],"name":"Store","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"name":"channelID","type":"uint256"},{"indexed":true,"name":"channelIndex","type":"uint256"},{"indexed":true,"name":"overallIndex","type":"uint256"},{"indexed":false,"name":"contentID","type":"uint256"}],"name":"Sequence","type":"event"}]}}
