$( document ).ready(function() {

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
