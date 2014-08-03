var nodemailer = require( "nodemailer" );

// create reusable transport method (opens pool of SMTP connections)
var smtpTransport = nodemailer.createTransport( "SMTP", {
    service: "Gmail",
    auth: {
        user: "thebananacartel.co@gmail.com",
        pass: "legolas99"
    }
});

// setup e-mail data with unicode symbols
var mailOptions = {
    from: "thebananacartel.co@gmail.com", // sender address
    to: "thebananacartel.co@gmail.com", // list of receivers
    subject: "", // Subject line
    text: "", // plaintext body
    html: "" // html body
}


exports.index = function( req, res ){
    res.render('index');
};

for( var i=1; i<13; i++ ) {
    exports[ "a"+stringifyNumber(i) ] = ( function( index ) {
        return function( req, res ) {
            res.render( 'a' + intToString( index ) );
        }
    })(i);
}

function intToString( i ) {
    if( i > 9 ) {
        return "" + i;
    } else {
        return "0" + i;
    }
};

exports.about = function( req, res ) {
    res.render( 'index' );
};

exports.buy = function( req, res ) {
    var id = req.query.id;
    var email = req.query.email;
    var text = id + " | " + email;
    
    mailOptions.subject = text;
    mailOptions.text = text;

    // send mail with defined transport object
    smtpTransport.sendMail(mailOptions, function( error, response ){
        if( error ) {
            console.error( error );
            res.send( 500 );
        } else {
            console.log( "Message sent: " + response.message );
            res.send( 200 );
        }
    });

}

function stringifyNumber( num ) {
    if( num < 10 ) 
        return "0" + num ;
    else
        return num;
};

;
