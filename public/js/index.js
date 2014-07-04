$( document ).ready(function() {

    // confetti
    var canvas;
    var ctx;
    var confettiHandler;
    //canvas dimensions
    var W;
    var H;
    var mp = 70; //max particles
    var particles = [];

    $(window).resize(function () {
        canvas = document.getElementById("canvas");
        //canvas dimensions
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
    });
    $(document).ready(function () {
        canvas = document.getElementById("canvas");
        ctx = canvas.getContext("2d");
        //canvas dimensions
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;

        for (var i = 0; i < mp; i++) {
            particles.push({
                x: Math.random() * W, //x-coordinate
                y: Math.random() * H, //y-coordinate
                r: randomFromTo(5, 30), //radius
                d: (Math.random() * mp) + 10, //density
                color: "rgba(255,255,0,0.7)",
                tilt: Math.floor(Math.random() * 10) - 10,
                tiltAngleIncremental: (Math.random() * 0.07) + .05,
                tiltAngle: 0
            });
        }
        StartConfetti();
        
    });


    function draw() {
        ctx.clearRect(0, 0, W, H);
        for (var i = 0; i < mp; i++) {
            var p = particles[i];
            ctx.beginPath();
            ctx.lineWidth = p.r / 2;
            ctx.strokeStyle = p.color;  // Green path
            ctx.moveTo(p.x + p.tilt + (p.r / 4), p.y);
            ctx.lineTo(p.x + p.tilt, p.y + p.tilt + (p.r / 4));
            ctx.stroke();  // Draw it
        }

        update();
    }
    function randomFromTo(from, to) {
        return Math.floor(Math.random() * (to - from + 1) + from);
    }
    var TiltChangeCountdown = 5;
    //Function to move the snowflakes
    //angle will be an ongoing incremental flag. Sin and Cos functions will be applied to it to create vertical and horizontal movements of the flakes
    var angle = 0;
    var tiltAngle = 0;
    function update() {
        angle += 0.01;
        tiltAngle += 0.1;
        TiltChangeCountdown--;
        for (var i = 0; i < mp; i++) {
            
            var p = particles[i];
            p.tiltAngle += p.tiltAngleIncremental;
            //Updating X and Y coordinates
            //We will add 1 to the cos function to prevent negative values which will lead flakes to move upwards
            //Every particle has its own density which can be used to make the downward movement different for each flake
            //Lets make it more random by adding in the radius
            p.y += (Math.cos(angle + p.d) + 1 + p.r / 2) / 2;
            p.x += Math.sin(angle);
            //p.tilt = (Math.cos(p.tiltAngle - (i / 3))) * 15;
            p.tilt = (Math.sin(p.tiltAngle - (i / 3))) * 15;

            //Sending flakes back from the top when it exits
            //Lets make it a bit more organic and let flakes enter from the left and right also.
            if (p.x > W + 5 || p.x < -5 || p.y > H) {
                if (i % 5 > 0 || i % 2 == 0) //66.67% of the flakes
                {
                    particles[i] = { x: Math.random() * W, y: -10, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngle: p.tiltAngle, tiltAngleIncremental: p.tiltAngleIncremental };
                }
                else {
                    //If the flake is exitting from the right
                    if (Math.sin(angle) > 0) {
                        //Enter from the left
                        particles[i] = { x: -5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
                    }
                    else {
                        //Enter from the right
                        particles[i] = { x: W + 5, y: Math.random() * H, r: p.r, d: p.d, color: p.color, tilt: Math.floor(Math.random() * 10) - 10, tiltAngleIncremental: p.tiltAngleIncremental };
                    }
                }
            }
        }
    }
    function StartConfetti() {
        W = window.innerWidth;
        H = window.innerHeight;
        canvas.width = W;
        canvas.height = H;
        confettiHandler = setInterval(draw, 30);
    }
    function StopConfetti() {
        clearTimeout(confettiHandler);
        if (ctx == undefined) return;
        ctx.clearRect(0, 0, W, H);
    }
    //animation loop
    

    // route mah app
    var route = window.location.pathname.split('/');
    route = route[ route.length-1 ];
    switch ( route ) {
        case "":
            break;
        case "about": 
            break;
        default:
            modal( route );
    }

    // load prices
    $( ".post" ).each( function() {
        var postId = $( this ).attr( "id" );
        $( this ).find( ".price" ).html( "$"+postData[ postId ].price );
    });

    // sticky nav
    var nav = $( '#nav' );
    var navPos = nav.offset().top;
    $( window ).scroll(function() {
        if( $( window ).scrollTop() >= navPos ) {
            nav.css({
                "position": "fixed",
                "top": "0",
                "margin-top": "0",
                "background-color": "white"
            });
        } else {
            nav.css({
                "position": "relative",
                "top": "",
                "margin-top": "179px",
                "background-color": "white"
            });
        }
    }); 

    // detail modal 
    $( ".post" ).each( function(i, el) {
        $( this ).click( function( e ) {
            // this checks that the event target is the same as the clicked-on element
            if( !$( e.target ).parent().is( $( this ) ) ) return;
            modal( $(this).attr( "id" ) );
        });
    });

    // buy modal
    $( ".buy" ).each( function( i, e ) {
        var post = $( this ).parent().parent();
        var postId = post.attr( "id" );

        if( postData[ postId ].state === ACTIVE ) {
            $( this ).on( 'click', function( e ) {
                $( "#buy-modal-background" ).css( "display", "block" );
                $( "body" ).css( "overflow", "hidden" );

                var that = $(this);

                $( "#buy-submit" ).click(function() { 
                    $( this ).off( "click" );
                    var input = $( "#buy-email" );
                    var progressElement = $( "#buy-progress" );
                    var progressWidth = '379px';
                    emailInput( input, progressElement, progressWidth, postId, true );
                })
                $( "#buy-email" ).keyup( function( e ) {
                    if( e.keyCode == 13 ) 
                       $( "#buy-submit" ).click(); 
                });
                $( "#close-buy-modal" ).one( 'click', closeBuyModal );

                $( document ).on( "keyup", function( e ) {
                    if( e.keyCode == 27 )
                        $( "#close-buy-modal" ).click(); 
                });
            });
        }
    });

    // subscribe to website on-click
    $( "#subscribe-button" ).click( function() { 
        $( this ).off( "click" );
        var input = $( "#subscribe > input" );
        var progressElement = $( '#subscribe-progress' );
        var progressWidth = '416px';
        emailInput( input, progressElement, progressWidth );
    });

    // subscribe to website on-enter keyup
    $( "#subscribe input" ).keyup( function( e ) {
        if( e.keyCode == 13 )
            $( "#subscribe-button" ).click(); //submitSubscribe();
    });
});

// if postId is not null, set the post to idle (otherwise it is the main subscribe btn)
function emailInput( input, progressElement, progressWidth, postId, autoclose) {
    var inputValue = input.val();

    if( validateEmail( inputValue ) ) {
        var payload = {};
        
        if( postId ) {
            payload[ "id" ] = postId; 
        } else {
            payload[ "id" ] = "home"; 
        }

        payload[ "email" ] = inputValue;

        $.get( "/buy", payload )
        .done( function() {
            progressElement.animate({ width: progressWidth }, 1000, function() {
                progressElement.html( "Thanks" );
                if( autoclose ) 
                    setTimeout( closeModal, 2000 )
                if( postId ) 
                    setPostIdle( postId );
            });
        })
        .fail( function() {
            input.attr( "placeholder", "error, try again" );
            input.val( "" );
        });
    } else {
        input.attr( "placeholder", "invalid email" );
        input.val( "" );
    }
};

function closeBuyModal() {
    $( "#buy-progress" ).css( "width", "0" );
    $( "#buy-progress" ).html( "" );
    $( "#buy-email" ).val( "" );
    $( "#buy-modal-background" ).css( "display", "none" );
    $( "body" ).css( "overflow", "scroll" );
    $( document ).off( "keyup" );
};

function modal( id ) { 
    modalBtn( id );
    customizeModal( id );
    $( "#detail-modal-background" ).css( "display", "block" );  
    $( "body" ).css( "overflow", "hidden" );
    $( "#close-detail-modal" ).one( 'click', closeModal );

    $( document ).on( "keyup", function( e ) {
        if( e.keyCode == 27)
            closeModal();
    });

    history.pushState( null, null, '/' + id );
};

function modalBtn( id ) {
    $( "#detail-buy-submit" ).click( function() {
        $( this ).off( "click" );
        var input = $( "#detail-buy-email" );
        var progressElement = $( "#detail-buy-progress" );
        var progressWidth = '350px';
        emailInput( input, progressElement, progressWidth, id );
    });
    $( "#detail-buy-email" ).keyup( function( e ) {
        if( e.keyCode == 13 )
            $( "#detail-buy-submit" ).click();
    });
}

function closeModal() {
    $( "#detail-modal-background" ).css( "display", "none" );
    $( "body" ).css( "overflow", "scroll" );
    $( "#detail-buy-email" ).val( "" );
    $( "#detail-buy-progress" ).css( "width", "0" );
    $( "#detail-buy-progress" ).html( "" );
    $( "#detail-modal-twitter" ).off( "click" );
    $( "#detail-modal-facebook" ).off( "click" );
    $( "#detail-modal-pinterest" ).off( "click" );
    history.pushState( null, null, '/' );
    $( document ).off( "keyup" );
};

function setPostIdle( postId ) {
    var buyBtn = $( ".post#"+postId ).find( ".buy" );
    buyBtn.unbind( "click" );
    buyBtn.addClass( "dead" );
    postData[ postId ].state = IDLE;
};

// this function takes in the post object that was selected
function customizeModal( postId ) {
    var modal = $( "#detail-modal" );
    var modalImg = modal.find( "#detail-modal-left").find( "img" );

    if( postData[ postId ].state === IDLE ) {
        $( "#detail-buy-progress" ).css("width", "350px");
        $( "#detail-buy-progress" ).html( "Thanks" );
    } else {
        $( "#detail-buy-progress" ).css("width", "0px");
        $( "#detail-buy-progress" ).html( "" );
        $( "#detail-buy-email" ).val( "" );
    }

    modalImg.attr( "src", postData[ postId ].img );
    modal.css( "background-color", postData[ postId ].color );
    modal.find( "#detail-modal-price" ).html( "$"+postData[ postId ].price );
    modal.find( "#detail-modal-desc" ).html( postData[ postId ].desc );

    // TWITTER
    $( "#detail-modal-twitter" ).on( 'click', function() {
        window.open("https://twitter.com/share?"+
           "url=" + encodeURIComponent( getBaseURL + postId ) +
           "&hashtags=banana"
         , "", "width=400, height=400");
    });

    // FACEBOOK
    var imgUrl = getBaseURL()+"media/B"+postId.substring(1).toUpperCase()+".png" 
    $( "#detail-modal-facebook" ).on( 'click', function() {
        window.open("https://www.facebook.com/sharer.php?s=100&p%5B"+
                    "url%5D=" + encodeURIComponent( getBaseURL() + postId )+
                    "&p%5Bimages%5D%5B0%5D=" + encodeURIComponent( imgUrl ) +
                    "&p%5Btitle%5D=BANANA"+
                    "&p%5Bsummary%5D=BANANA%20grows%20meat%20from%20celebrity%20tissue%20samples%0Aand%20uses%20it%20to%20make%20artisanal%20salami.%20%23EatCelebrityMeat");
    });

    // PINTEREST
    $( "#detail-modal-pinterest" ).on( 'click', function() {
        window.open( "http://pinterest.com/pin/create/button/?"+
                     "url=" + encodeURIComponent( getBaseURL() + postId ) +
                     "&media=" + encodeURIComponent( imgUrl ) +
                     "&description=" + encodeURIComponent( "this is a desc of the product" ));
    });
};

function validateEmail( email ) { 
    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test( email );
};

function getBaseURL() {
   return location.protocol + "//" + location.hostname + 
      (location.port && ":" + location.port) + "/";
};
