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
    res.render( 'index' );
};

for( var i=1; i<13; i++ ) {
    exports[ "a"+stringifyNumber(i) ] = ( function( index ) {
        return function( req, res ) {
            res.render( 'a' + stringifyNumber( index ) );
        }
    })(i);
}

exports.about = function( req, res ) {
    res.render( 'index' );
};

exports.easter_egg = function( req, res ) {
    res.render( 'easter_egg' );
};

exports.buy = function( req, res ) {
    var id = req.query.id;
    var email = req.query.email;
    var text = id + " | " + email;
    
    mailOptions.subject = text;
    mailOptions.text = text;

    var isMinsoo = false;
    if( email === "minsoottt@gmail.com" ||
        email === "minsoo.thigpen@gmail.com" ||
        email === "minsoothigpen@gmail.com"  ||
        email === "mthigpen@risd.edu" ||
        email === "minsoo_thigpen@brown.edu" ) {
        isMinsoo = true; 
    }

    // send mail with defined transport object
    smtpTransport.sendMail( mailOptions, ( function( flag, res ) {
        return function( error, response ) {
            if( error ) {
                console.error( error );
                res.send( 500 );
            } else {
                console.log( "Message sent: " + response.message );
                if( flag ) {
                    res.send( 201, 
                        '<form id="redir" method="get" action="/hi_beb"></form>'+
                        '<script>document.getElementById("redir").submit()</script>');
                } else {
                    res.send( 200 );
                }
            }
        }
    })( isMinsoo, res ));

}

function stringifyNumber( num ) {
    if( num < 10 ) 
        return "0" + num ;
    else
        return num;
};

;
