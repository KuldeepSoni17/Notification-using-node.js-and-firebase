var admin = require("firebase-admin");
var http = require("http");
var url = require("url")
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: "periodicnotcheck",
    clientEmail: "firebase-adminsdk-glv7e@periodicnotcheck.iam.gserviceaccount.com",
    privateKey: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCinuLQf30eoWFP\n68pqp0lgdTIvtlZ9voNjfjv+vDwVdWovgG3Fz27GxfX88jCwA1hxnAuBea7e7q56\nPCKOtKaKLHLIkOrf++FVLpYlgLWaXSp1GHBX6v1ofyV+1DrEoFeXTh4l3bV2shH7\nXfPSxFNe9HTk7xNPIiBnMDmvlJITHWyKA7J+txMwnPeXqF0O8XP8rGSoetBt2DM0\nkDxl6CgEZWP6yy1f3y83wb1GntpvzLw+ISP3yWHMgwMRw4dbmn9oAG4qJWpuQaAZ\nQ+Vc5Fe8h8RUX+EbOeZbL3a1GuPZCQWOtL6v0PGU4Omf/56EXgzu9fHI/Irul75R\nERQMCQf3AgMBAAECggEAMmde09MAG/NXLyddSOtq4dvRX1p7umPHY5onzE/Zq6kF\n7Y03+PzPUArhsLH8h0GyMxxzsIDfw7dlGvvylhrGF8OpHCNWuW/fqsBSx3L6VssT\nstGNWKK8QpxOKd5sDK/KFlqfG4t5iD2vNyMqxKQXVzIb3S2A5aElO/aFmrdJA2U3\n1t/q8zZJJG3QN+lCP427U0hP5400hX08+/Fqnld5jbZvkvyyNQp/3D1P2OJNFVO4\n4sWJYLATO2O49LTpwmLDUMvCSKIyGPvBVnjZz0v8BfD+mc4ggZMYzHSkMAU3Ia4Q\nkaQl5XP7eo2qpBAQ2oErdyWhJBy1U/QUke5XN+EXWQKBgQDOEvaQJSki4OOdYWnw\nbqhdpU89JtVJrzv8TLqIBR8rPCKhpAlN06HyFPo1N6aW1RsbWbknUDdeU0ULHs/l\nESO9B/I5iBHzvn31DfvxDnfflTtxNjv/91LCgj+C0Ed4WKtys+p+PTmU1mdKKLcK\nRR/LLOxiiZDVxL3ERsB04t9y7QKBgQDKBN+QladxN1Nc1jRqbElnY7ThPDD81hrU\nGP49mZwcPIV8t0QR6WpIR62bQztJN5nLQalOIO3mvvyBY69iU/wpz8pqEFtXMKRf\nFZZ3TDITooCoOgvN4xEQkiEiGZA4VeRID5lliudNcAIoqb+p521D/BJnL9IGI/kz\nJK5Yu9eV8wKBgE9hVKMP/XmXAXbVWHaqWabBD/XxaIWav9OfRtcwieIgpwJ26rKV\nDDPxSrSHPF+rtWZiuIThTILENrti4hhN8uNVFUR+GtQ2k9R6z4r61MhGdwBUMOaX\nwcR1YbulOXKtTVXA4lpAgVbJBD630lJdcDLWmjQW47jEsYjS7D3aStK9AoGANbmo\nDxaNqkFRbS4WUHst5k4Q65mLWaJDDkb7TjyM1MGPqoQ+mRjfSAuv8suld6pOv0xe\nD0YYnrYKBwsQuHCnbiMxrJVfBUgNXrAqDN35r1kXKCYPv5h0kFiccSolPaYyCKwF\nWojfTKvOFyxVqYS/fUYLSt/f1fw5KM3HhBeolNsCgYBiq2aFNu2qhjbblsfVknAb\nAa+bBAQ6MYYP/aU9rLOs0wNHsFD4zCXtmypK5i/yh4ZhdEVScaL0B9ghRbgnJwId\nHLkC05Q8V05keabJ+ZfQ5jefL3oVUsqQ4oS1stag9R7jQcyW0GswxJPOn+JWEmOJ\n4gvKzUu4IR/LX0e1gIxGLg==\n-----END PRIVATE KEY-----\n"
  }),
  databaseURL: "https://periodicnotcheck.firebaseio.com"
});

http.createServer(function (req, res) {
	var q = url.parse(req.url, true).query;
	var datime = q.datime;
	var token = q.token;
	console.log("DTIME_VAL", datime);
var payload = 
	{
		data: {
		datetime: datime
		}
	};
admin.messaging().sendToDevice(token, payload)
 .then(function(response) {
    console.log("Successfully sent message:", response);
})
  .catch(function(error) {
    console.log("Error sending message:", error);
});
topic = "sync";  
admin.messaging().sendToTopic(topic, payload)
.then(function(response) {
console.log("Successfully sent message:", response);
})
.catch(function(error) {
console.log("Error sending message:", error);
});
  res.write('ReloadForNewMessage');
  res.end();
}).listen(8080);
